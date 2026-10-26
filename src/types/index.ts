export type Grade = '7mo' | '8vo' | '9no';

export type ConfidenceLevel = 'cuesta' | 'regular' | 'bien' | 'avanzar';

export type StudentGoal = 'recuperar' | 'tareas' | 'examen' | 'avanzar';

export interface UserProfile {
  name: string;
  grade: Grade;
  confidence: ConfidenceLevel;
  goal: StudentGoal;
  createdAt: string;
  diagnosticCompleted: boolean;
  startingSkillId?: string;
  notes?: string;
}

export type SkillId =
  | 'p1_concepto'
  | 'p2_terminos'
  | 'p3_equivalencia'
  | 'p4_simplificacion'
  | 'p5_comparacion'
  | 'p6_recta'
  | 'p7_suma_igual_den'
  | 'p8_resta_igual_den'
  | 'p9_contexto'
  | 'p10_repaso';

export type SkillStatus = 'todo' | 'learning' | 'mastered';

export interface SkillProgress {
  skillId: SkillId;
  status: SkillStatus;
  correctAttempts: number;
  totalAttempts: number;
  lastPracticed: string | null;
  nextReviewDate: string | null;
  spacedStage: number; // 0: nuevo, 1: +1 día, 2: +3 días, 3: +7 días, 4: consolidado
  retrievalSuccessStreak: number;
}

export interface FadedStep {
  stepNumber: number;
  title: string;
  explanation: string;
  promptOrAction?: string;
  hint?: string;
  solutionPart?: string;
  fadedRatio: number; // 0 = fully solved, 1 = student completes
}

export interface FadedExampleData {
  title: string;
  problemStatement: string;
  steps: FadedStep[];
  reflectionPrompt: string;
}

export interface LessonSection {
  title: string;
  content: string;
  interactiveConfig?: {
    type: 'bar' | 'circle' | 'number-line';
    initialNumerator: number;
    initialDenominator: number;
    targetNumerator?: number;
    targetDenominator?: number;
    label?: string;
  };
  strategyTip?: string;
}

export interface Lesson {
  id: SkillId;
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  estimatedMinutes: number;
  keyTakeaway: string;
  visualType: 'bar' | 'circle' | 'number-line';
  sections: LessonSection[];
  fadedExample: FadedExampleData;
}

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Exercise {
  id: string;
  skillId: SkillId;
  difficulty: 'facil' | 'medio' | 'desafio';
  prompt: string;
  contextNarrative?: string;
  visualConfig?: {
    type: 'bar' | 'circle' | 'number-line';
    numerator: number;
    denominator: number;
    interactive?: boolean;
    comparisonNumerator?: number;
    comparisonDenominator?: number;
  };
  options: ExerciseOption[];
  hints: string[]; // Pistas graduales (1: leve, 2: estratégica, 3: casi resuelta)
  explanation: string;
  isDiagnostic?: boolean;
}

export interface DiagnosticResult {
  completedAt: string;
  score: number;
  total: number;
  assignedStartingSkill: SkillId;
  summaryMessage: string;
  skillBreakdown: Record<string, boolean>;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'queued' | 'error';
  suggestedPrompts?: string[];
  modelUsed?: string;
  isFallback?: boolean;
  redundancyTier?: number;
}

export interface TutorQuota {
  date: string; // YYYY-MM-DD
  sessionsCount: number; // Máximo 2 al día
  currentSessionActive: boolean;
  messagesInCurrentSession: number; // Máximo 10 por sesión
  totalMessagesToday: number; // Máximo 20 al día
}

export interface QueuedQuestion {
  id: string;
  question: string;
  contextTopic?: string;
  createdAt: string;
  answered: boolean;
}
