/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionType, UserProgress } from './types';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { LettersSection } from './components/LettersSection';
import { NumbersSection } from './components/NumbersSection';
import { VocabularySection } from './components/VocabularySection';
import { AnimalsSection } from './components/AnimalsSection';
import { ColorsSection } from './components/ColorsSection';
import { RhymesSection } from './components/RhymesSection';
import { GamesSection } from './components/GamesSection';
import { QuizSection } from './components/QuizSection';
import { ProgressSection } from './components/ProgressSection';
import { ParentSection } from './components/ParentSection';

const STORAGE_KEY = 'mero_nepali_sikai_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  stars: 12,
  streakDays: 3,
  lettersLearned: ['swar-1', 'vyanjan-1', 'vyanjan-2'],
  numbersLearned: [1, 2, 3],
  wordsLearned: ['f-1', 'a-1'],
  quizzesCompleted: 1,
  gamesPlayed: 2,
  rhymesListened: ['rhyme-1'],
  totalLearningMinutes: 18,
  lastActiveDate: new Date().toISOString().split('T')[0],
  badges: ['b-first-letter'],
};

export default function App() {
  const [currentSection, setCurrentSection] = useState<SectionType>('home');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Silently catch
    }
  }, [progress]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  const handleEarnStar = (count: number = 1) => {
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + count,
    }));
  };

  const handleLetterCompleted = (letterId: string) => {
    setProgress((prev) => {
      if (!prev.lettersLearned.includes(letterId)) {
        return {
          ...prev,
          lettersLearned: [...prev.lettersLearned, letterId],
          stars: prev.stars + 1,
        };
      }
      return prev;
    });
  };

  const handleNumberCompleted = (num: number) => {
    setProgress((prev) => {
      if (!prev.numbersLearned.includes(num)) {
        return {
          ...prev,
          numbersLearned: [...prev.numbersLearned, num],
          stars: prev.stars + 1,
        };
      }
      return prev;
    });
  };

  const handleWordLearned = (wordId: string) => {
    setProgress((prev) => {
      if (!prev.wordsLearned.includes(wordId)) {
        return {
          ...prev,
          wordsLearned: [...prev.wordsLearned, wordId],
          stars: prev.stars + 1,
        };
      }
      return prev;
    });
  };

  const handleRhymeCompleted = (rhymeId: string) => {
    setProgress((prev) => {
      if (!prev.rhymesListened.includes(rhymeId)) {
        return {
          ...prev,
          rhymesListened: [...prev.rhymesListened, rhymeId],
          stars: prev.stars + 3,
        };
      }
      return prev;
    });
  };

  const handleCompleteQuiz = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizzesCompleted: prev.quizzesCompleted + 1,
      stars: prev.stars + score,
    }));
  };

  const handleResetProgress = () => {
    setProgress({
      stars: 0,
      streakDays: 1,
      lettersLearned: [],
      numbersLearned: [],
      wordsLearned: [],
      quizzesCompleted: 0,
      gamesPlayed: 0,
      rhymesListened: [],
      totalLearningMinutes: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      badges: [],
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-slate-800 flex flex-col no-select">
      {/* Top Child-Friendly Navigation Bar */}
      <Navbar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        stars={progress.stars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area with Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HomeScreen
                onSelectSection={setCurrentSection}
                stars={progress.stars}
              />
            </motion.div>
          )}

          {currentSection === 'letters' && (
            <motion.div
              key="letters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <LettersSection
                onBack={() => setCurrentSection('home')}
                onLetterCompleted={handleLetterCompleted}
              />
            </motion.div>
          )}

          {currentSection === 'numbers' && (
            <motion.div
              key="numbers"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <NumbersSection
                onBack={() => setCurrentSection('home')}
                onNumberCompleted={handleNumberCompleted}
              />
            </motion.div>
          )}

          {currentSection === 'vocabulary' && (
            <motion.div
              key="vocabulary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <VocabularySection
                onBack={() => setCurrentSection('home')}
                onWordLearned={handleWordLearned}
              />
            </motion.div>
          )}

          {currentSection === 'animals' && (
            <motion.div
              key="animals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AnimalsSection
                onBack={() => setCurrentSection('home')}
                onAnimalLearned={handleWordLearned}
              />
            </motion.div>
          )}

          {currentSection === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ColorsSection
                onBack={() => setCurrentSection('home')}
                onColorLearned={handleWordLearned}
              />
            </motion.div>
          )}

          {currentSection === 'rhymes' && (
            <motion.div
              key="rhymes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RhymesSection
                onBack={() => setCurrentSection('home')}
                onRhymeCompleted={handleRhymeCompleted}
              />
            </motion.div>
          )}

          {currentSection === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <GamesSection
                onBack={() => setCurrentSection('home')}
                onEarnStar={handleEarnStar}
              />
            </motion.div>
          )}

          {currentSection === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuizSection
                onBack={() => setCurrentSection('home')}
                onCompleteQuiz={handleCompleteQuiz}
                onEarnStar={handleEarnStar}
              />
            </motion.div>
          )}

          {currentSection === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ProgressSection
                progress={progress}
                onBack={() => setCurrentSection('home')}
              />
            </motion.div>
          )}

          {currentSection === 'parent' && (
            <motion.div
              key="parent"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ParentSection
                progress={progress}
                onBack={() => setCurrentSection('home')}
                onResetProgress={handleResetProgress}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
