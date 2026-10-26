import { SkillProgress, SkillId } from '../types';

export const SPACED_INTERVALS_DAYS = [1, 3, 7]; // Días de repaso espaciado

export function addDaysToDate(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

export function isDueForReview(nextReviewDate: string | null): boolean {
  if (!nextReviewDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return today >= nextReviewDate;
}

export function processPracticeAttempt(
  skill: SkillProgress,
  isCorrect: boolean
): SkillProgress {
  const now = new Date();
  const todayString = now.toISOString().split('T')[0];
  const newTotal = skill.totalAttempts + 1;
  const newCorrect = isCorrect ? skill.correctAttempts + 1 : skill.correctAttempts;

  if (isCorrect) {
    const newStreak = skill.retrievalSuccessStreak + 1;
    // Advance stage in intervals: 0 -> +1 day, 1 -> +3 days, 2 -> +7 days, 3 -> consolidated
    const currentStage = skill.spacedStage;
    let nextStage = currentStage;
    let daysToAdd = 1;

    if (currentStage === 0) {
      daysToAdd = 1;
      nextStage = 1;
    } else if (currentStage === 1) {
      daysToAdd = 3;
      nextStage = 2;
    } else if (currentStage >= 2) {
      daysToAdd = 7;
      nextStage = 3;
    }

    const nextReview = addDaysToDate(now, daysToAdd);

    // Determine mastery: at least 3 correct attempts and streak >= 2
    let newStatus = skill.status;
    if (newCorrect >= 3 && newStreak >= 2) {
      newStatus = 'mastered';
    } else {
      newStatus = 'learning';
    }

    return {
      ...skill,
      totalAttempts: newTotal,
      correctAttempts: newCorrect,
      lastPracticed: todayString,
      nextReviewDate: nextReview,
      spacedStage: nextStage,
      retrievalSuccessStreak: newStreak,
      status: newStatus
    };
  } else {
    // Non-punitive recovery: gentle review scheduled for tomorrow without losing mastered status
    return {
      ...skill,
      totalAttempts: newTotal,
      lastPracticed: todayString,
      nextReviewDate: addDaysToDate(now, 1),
      spacedStage: Math.max(0, skill.spacedStage - 1),
      retrievalSuccessStreak: 0,
      status: skill.status === 'mastered' ? 'learning' : skill.status
    };
  }
}

export function getMindsetFeedbackMessage(
  correctCount: number,
  totalCount: number,
  skillTitle: string
): string {
  const ratio = totalCount > 0 ? correctCount / totalCount : 0;
  if (ratio >= 0.8) {
    return `¡Gran demostración de estrategia! Has afianzado el concepto de ${skillTitle}. Cada intento bien pensado fortalece tus conexiones neuronales.`;
  } else if (ratio >= 0.5) {
    return `Buen avance en ${skillTitle}. Los errores cometidos son información valiosa que te indica exactamente qué paso pulir en tu próxima sesión.`;
  } else {
    return `Completaste tu sesión con constancia y esfuerzo. Con ejemplos visuales y pistas desvanecidas, verás cómo este tema se vuelve natural muy pronto.`;
  }
}
