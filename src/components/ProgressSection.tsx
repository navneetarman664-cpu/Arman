import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Flame, Trophy, Award, BookOpen, Star, CheckCircle } from 'lucide-react';
import { UserProgress, BadgeItem } from '../types';
import { INITIAL_BADGES } from '../data/learningData';
import { soundManager } from '../utils/audio';

interface ProgressSectionProps {
  progress: UserProgress;
  onBack: () => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ progress, onBack }) => {
  // Dynamically calculate which badges are unlocked
  const badgesWithStatus: BadgeItem[] = INITIAL_BADGES.map((b) => {
    let unlocked = false;
    if (b.id === 'b-first-letter') {
      unlocked = progress.lettersLearned.length > 0;
    } else if (b.id === 'b-ten-words') {
      unlocked = progress.wordsLearned.length >= 10;
    } else if (b.id === 'b-count-master') {
      unlocked = progress.numbersLearned.length >= 20;
    } else if (b.id === 'b-animals-explorer') {
      unlocked = progress.wordsLearned.some((w) => w.startsWith('cow') || w.startsWith('a-'));
    } else if (b.id === 'b-color-artist') {
      unlocked = progress.stars >= 5;
    } else if (b.id === 'b-rhyme-singer') {
      unlocked = progress.rhymesListened.length > 0;
    } else if (b.id === 'b-quiz-star') {
      unlocked = progress.quizzesCompleted > 0;
    } else if (b.id === 'b-7day-streak') {
      unlocked = progress.streakDays >= 7;
    }
    return { ...b, unlocked };
  });

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="progress-back-btn"
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            मेरो प्रगति (My Progress)
          </span>
        </div>
      </div>

      {/* Highlights Grid: Stars, Streak, Lessons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Total Stars */}
        <div className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 fill-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-950">
            {progress.stars}
          </span>
          <span className="text-xs font-bold text-amber-800">ताराहरू (Stars)</span>
        </div>

        {/* Daily Streak */}
        <div className="bg-white rounded-3xl p-4 border-2 border-orange-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 fill-orange-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-orange-950">
            {progress.streakDays} दिन
          </span>
          <span className="text-xs font-bold text-orange-800">सिक्ने यात्रा (Streak)</span>
        </div>

        {/* Letters Learned */}
        <div className="bg-white rounded-3xl p-4 border-2 border-blue-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-blue-950">
            {progress.lettersLearned.length}
          </span>
          <span className="text-xs font-bold text-blue-800">अक्षरहरू सिकियो</span>
        </div>

        {/* Quizzes Completed */}
        <div className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-950">
            {progress.quizzesCompleted}
          </span>
          <span className="text-xs font-bold text-emerald-800">क्विज सम्पन्न</span>
        </div>
      </div>

      {/* Badges and Medals Showcase */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 shadow-md p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-amber-500" />
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            मेरा पदक र ब्याजहरू (Badges & Trophies)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {badgesWithStatus.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.03 }}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                badge.unlocked
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <span className="text-4xl mb-1.5">{badge.icon}</span>
              <h4 className="text-sm font-black text-slate-800 leading-tight">
                {badge.titleNepali}
              </h4>
              <p className="text-[11px] font-semibold text-amber-700">
                {badge.titleEnglish}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                {badge.description}
              </p>
              {badge.unlocked ? (
                <span className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" />
                  <span>प्राप्त भयो</span>
                </span>
              ) : (
                <span className="mt-2 text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                  🔒 बन्द छ
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
