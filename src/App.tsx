import React, { useState, useEffect } from 'react';
import { UserProfile, SkillProgress, SkillId, DiagnosticResult } from './types';
import { StorageService } from './utils/storage';
import { OnboardingView } from './views/OnboardingView';
import { DiagnosticView } from './views/DiagnosticView';
import { SkillsMapView } from './views/SkillsMapView';
import { LessonDetailView } from './views/LessonDetailView';
import { PracticeSessionView } from './views/PracticeSessionView';
import { AITutorDrawer } from './components/tutor/AITutorDrawer';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { MetricsModal } from './components/metrics/MetricsModal';
import { ThemeToggle } from './components/common/ThemeToggle';
import {
  Compass,
  BookOpen,
  Brain,
  RotateCw,
  Sparkles,
  PieChart,
  TrendingUp
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skillsProgress, setSkillsProgress] = useState<SkillProgress[]>([]);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);

  // View state: 'map' | 'lesson' | 'practice' | 'diagnostic'
  const [currentView, setCurrentView] = useState<'map' | 'lesson' | 'practice' | 'diagnostic'>('map');
  const [selectedSkillId, setSelectedSkillId] = useState<SkillId>('p1_concepto');

  // AI Tutor drawer state
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorContextTopic, setTutorContextTopic] = useState<string | undefined>(undefined);

  // Metrics modal state
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const savedProfile = await StorageService.getProfile();
      const savedSkills = await StorageService.getSkillsProgress();
      const savedDiag = await StorageService.getDiagnosticResult();
      setProfile(savedProfile);
      setSkillsProgress(savedSkills);
      setDiagnosticResult(savedDiag);
    } catch (e) {
      console.error('Error loading app state:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetStudent = async () => {
    await StorageService.resetAllProgress();
    setProfile(null);
    setDiagnosticResult(null);
    setSkillsProgress(await StorageService.getSkillsProgress());
    setIsMetricsOpen(false);
    setCurrentView('map');
  };

  const handleUpdateConfidence = async (newConfidence: any) => {
    if (!profile) return;
    const updated: UserProfile = { ...profile, confidence: newConfidence };
    await StorageService.saveProfile(updated);
    setProfile(updated);
  };

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    await StorageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleDiagnosticComplete = async (result: DiagnosticResult) => {
    if (!profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      diagnosticCompleted: true,
      startingSkillId: result.assignedStartingSkill
    };
    await StorageService.saveProfile(updatedProfile);
    await StorageService.saveDiagnosticResult(result);
    setProfile(updatedProfile);
    setSelectedSkillId(result.assignedStartingSkill);
    setCurrentView('map');
  };

  const handleSelectLesson = (skillId: SkillId) => {
    setSelectedSkillId(skillId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPractice = (skillId: SkillId) => {
    setSelectedSkillId(skillId);
    setCurrentView('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSkillProgress = async (updated: SkillProgress) => {
    const updatedList = await StorageService.updateSkillProgress(updated.skillId, () => updated);
    setSkillsProgress(updatedList);
  };

  const handleOpenTutor = (topic?: string) => {
    setTutorContextTopic(topic);
    setIsTutorOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center animate-bounce">
            <PieChart className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cargando FracTutor...</p>
        </div>
      </div>
    );
  }

  // 1. Onboarding flow
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 transition-colors duration-200">
        <div className="max-w-md mx-auto px-4 mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <OnboardingView onComplete={handleOnboardingComplete} />
        <OfflineIndicator />
      </div>
    );
  }

  // 2. Diagnostic flow
  if (!profile.diagnosticCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 transition-colors duration-200">
        <div className="max-w-2xl mx-auto px-4 mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <DiagnosticView
          onComplete={handleDiagnosticComplete}
          studentName={profile.name}
          onBackToOnboarding={() => setProfile(null)}
        />
        <OfflineIndicator />
      </div>
    );
  }

  const currentSkillProg =
    skillsProgress.find((s) => s.skillId === selectedSkillId) || {
      skillId: selectedSkillId,
      status: 'todo',
      correctAttempts: 0,
      totalAttempts: 0,
      lastPracticed: null,
      nextReviewDate: null,
      spacedStage: 0,
      retrievalSuccessStreak: 0
    };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 pb-20 md:pb-8">
      {/* Top Bar Contract (1 row, 3 zones: Brand, nav links, primary action) */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3 md:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => setCurrentView('map')}
            className="flex items-center gap-2 text-base md:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <PieChart className="w-4 h-4" />
            </div>
            <span>FracTutor</span>
          </button>

          {/* Zone 2: 3-4 clean navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setCurrentView('map')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'map' ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-500 pb-1' : ''
              }`}
            >
              Mapa de Destrezas
            </button>
            <button
              type="button"
              onClick={() => handleSelectLesson('p1_concepto')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'lesson' ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-500 pb-1' : ''
              }`}
            >
              Micro-Lecciones
            </button>
            <button
              type="button"
              onClick={() => handleSelectPractice(profile.startingSkillId as SkillId || 'p1_concepto')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer whitespace-nowrap shrink-0 ${
                currentView === 'practice' ? 'text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-500 pb-1' : ''
              }`}
            >
              Práctica de Recuperación
            </button>
          </nav>

          {/* Zone 3: Dark Mode toggle + Metrics + PWA Install + Tutor IA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMetricsOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Ver métricas de éxito y enlace para compartir"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Métricas</span>
            </button>
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => handleOpenTutor()}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
              <span>Tutor IA</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'map' && (
          <SkillsMapView
            profile={profile}
            skillsProgress={skillsProgress}
            onSelectLesson={handleSelectLesson}
            onSelectPractice={handleSelectPractice}
            onOpenTutor={handleOpenTutor}
            onRetakeDiagnostic={() => setCurrentView('diagnostic')}
          />
        )}

        {currentView === 'diagnostic' && (
          <DiagnosticView
            onComplete={handleDiagnosticComplete}
            studentName={profile.name}
            onBackToOnboarding={() => setCurrentView('map')}
          />
        )}

        {currentView === 'lesson' && (
          <LessonDetailView
            skillId={selectedSkillId}
            onBack={() => setCurrentView('map')}
            onStartPractice={handleSelectPractice}
            onOpenTutor={handleOpenTutor}
          />
        )}

        {currentView === 'practice' && (
          <PracticeSessionView
            skillId={selectedSkillId}
            onBack={() => setCurrentView('map')}
            onUpdateProgress={handleUpdateSkillProgress}
            currentSkillProgress={currentSkillProg}
            onOpenTutor={handleOpenTutor}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 Mobile Touch Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center h-16 pb-safe transition-colors duration-200">
        <button
          type="button"
          onClick={() => setCurrentView('map')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            currentView === 'map' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Mapa</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentView !== 'lesson') handleSelectLesson(selectedSkillId);
          }}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            currentView === 'lesson' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1">Lección</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpenTutor()}
          className="flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] mt-1">Tutor IA</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMetricsOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] mt-1">Métricas</span>
        </button>
      </nav>

      {/* Socratic AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        profile={profile}
        initialTopic={tutorContextTopic}
      />

      {/* Metrics Modal */}
      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        profile={profile}
        skillsProgress={skillsProgress}
        diagnosticResult={diagnosticResult}
        onResetStudent={handleResetStudent}
        onUpdateConfidence={handleUpdateConfidence}
      />

      {/* Offline Status & Sync Toast */}
      <OfflineIndicator />
    </div>
  );
}
