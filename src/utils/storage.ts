import {
  UserProfile,
  SkillProgress,
  SkillId,
  TutorQuota,
  QueuedQuestion,
  DiagnosticResult
} from '../types';

const DB_NAME = 'fractutor_db';
const DB_VERSION = 1;

interface DBStores {
  profile: UserProfile;
  skills: SkillProgress[];
  diagnostic: DiagnosticResult | null;
  tutorQuota: TutorQuota;
  offlineQueue: QueuedQuestion[];
}

const DEFAULT_SKILLS: SkillProgress[] = [
  { skillId: 'p1_concepto', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p2_terminos', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p3_equivalencia', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p4_simplificacion', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p5_comparacion', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p6_recta', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p7_suma_igual_den', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p8_resta_igual_den', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p9_contexto', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 },
  { skillId: 'p10_repaso', status: 'todo', correctAttempts: 0, totalAttempts: 0, lastPracticed: null, nextReviewDate: null, spacedStage: 0, retrievalSuccessStreak: 0 }
];

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('app_data')) {
        db.createObjectStore('app_data');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('app_data', 'readonly');
      const store = tx.objectStore('app_data');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    const item = localStorage.getItem(`fractutor_${key}`);
    return item ? JSON.parse(item) : null;
  }
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('app_data', 'readwrite');
      const store = tx.objectStore('app_data');
      const req = store.put(value, key);
      req.onsuccess = () => {
        // Keep localStorage mirrored for backup
        try {
          localStorage.setItem(`fractutor_${key}`, JSON.stringify(value));
        } catch {}
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback to localStorage
    try {
      localStorage.setItem(`fractutor_${key}`, JSON.stringify(value));
    } catch {}
  }
}

export const StorageService = {
  async getProfile(): Promise<UserProfile | null> {
    return await idbGet<UserProfile>('profile');
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await idbSet('profile', profile);
  },

  async getSkillsProgress(): Promise<SkillProgress[]> {
    const skills = await idbGet<SkillProgress[]>('skills');
    if (!skills || skills.length === 0) {
      await idbSet('skills', DEFAULT_SKILLS);
      return DEFAULT_SKILLS;
    }
    return skills;
  },

  async updateSkillProgress(skillId: SkillId, updater: (prev: SkillProgress) => SkillProgress): Promise<SkillProgress[]> {
    const skills = await this.getSkillsProgress();
    const index = skills.findIndex((s) => s.skillId === skillId);
    if (index !== -1) {
      skills[index] = updater(skills[index]);
    } else {
      const defaultSkill = DEFAULT_SKILLS.find((s) => s.skillId === skillId) || {
        skillId,
        status: 'todo',
        correctAttempts: 0,
        totalAttempts: 0,
        lastPracticed: null,
        nextReviewDate: null,
        spacedStage: 0,
        retrievalSuccessStreak: 0
      };
      skills.push(updater(defaultSkill));
    }
    await idbSet('skills', skills);
    return skills;
  },

  async getDiagnosticResult(): Promise<DiagnosticResult | null> {
    return await idbGet<DiagnosticResult>('diagnostic');
  },

  async saveDiagnosticResult(result: DiagnosticResult): Promise<void> {
    await idbSet('diagnostic', result);
  },

  async getTutorQuota(): Promise<TutorQuota> {
    const today = getTodayString();
    const quota = await idbGet<TutorQuota>('tutor_quota');
    if (!quota || quota.date !== today) {
      const resetQuota: TutorQuota = {
        date: today,
        sessionsCount: 0,
        currentSessionActive: false,
        messagesInCurrentSession: 0,
        totalMessagesToday: 0
      };
      await idbSet('tutor_quota', resetQuota);
      return resetQuota;
    }
    return quota;
  },

  async saveTutorQuota(quota: TutorQuota): Promise<void> {
    await idbSet('tutor_quota', quota);
  },

  async getOfflineQueue(): Promise<QueuedQuestion[]> {
    const queue = await idbGet<QueuedQuestion[]>('offline_queue');
    return queue || [];
  },

  async addOfflineQuestion(question: string, contextTopic?: string): Promise<QueuedQuestion> {
    const queue = await this.getOfflineQueue();
    const newItem: QueuedQuestion = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      question,
      contextTopic,
      createdAt: new Date().toISOString(),
      answered: false
    };
    queue.push(newItem);
    await idbSet('offline_queue', queue);
    return newItem;
  },

  async removeOfflineQuestion(id: string): Promise<void> {
    const queue = await this.getOfflineQueue();
    const updated = queue.filter((item) => item.id !== id);
    await idbSet('offline_queue', updated);
  },

  async clearOfflineQueue(): Promise<void> {
    await idbSet('offline_queue', []);
  },

  async resetAllProgress(): Promise<void> {
    await idbSet('skills', DEFAULT_SKILLS);
    await idbSet('profile', null);
    await idbSet('diagnostic', null);
    await idbSet('offline_queue', []);
  }
};
