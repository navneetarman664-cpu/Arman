import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Unlock, Clock, BookOpen, CheckCircle, BarChart3, RotateCcw, Volume2, ShieldCheck } from 'lucide-react';
import { UserProgress } from '../types';
import { soundManager } from '../utils/audio';

interface ParentSectionProps {
  progress: UserProgress;
  onBack: () => void;
  onResetProgress: () => void;
}

export const ParentSection: React.FC<ParentSectionProps> = ({
  progress,
  onBack,
  onResetProgress,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(3);
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Generate simple parent gate math question
    const n1 = Math.floor(Math.random() * 5) + 3;
    const n2 = Math.floor(Math.random() * 4) + 2;
    setNum1(n1);
    setNum2(n2);
  }, []);

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = num1 + num2;
    if (parseInt(userAnswer.trim(), 10) === sum) {
      soundManager.playSuccessChime();
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      soundManager.playEncouragingTryAgain();
      setErrorMessage('गलत उत्तर। कृपया फेरि प्रयास गर्नुहोस्।');
      setUserAnswer('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="parent-back-btn"
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-extrabold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>अभिभावक खण्ड (Parents Zone)</span>
          </span>
        </div>
      </div>

      {!isUnlocked ? (
        /* Parent Gate Verification */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border-2 border-slate-200 shadow-lg p-6 sm:p-8 max-w-md mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            अभिभावक प्रमाणीकरण (Parent Gate)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
            यो क्षेत्र अभिभावकहरूको लागि मात्र हो। कृपया प्रवेश गर्न तलको सामान्य जोड हिसाब हल गर्नुहोस्:
          </p>

          <form onSubmit={handleVerifyGate} className="space-y-4">
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200">
              <span className="text-2xl font-black text-indigo-950">
                {num1} + {num2} = ?
              </span>
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="उत्तर लेख्नुहोस्..."
              autoFocus
              className="w-full text-center text-2xl font-bold py-3 px-4 rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:outline-hidden"
            />

            {errorMessage && (
              <p className="text-xs font-bold text-rose-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-md active:scale-95 transition-all"
            >
              प्रवेश गर्नुहोस् (Unlock)
            </button>
          </form>
        </motion.div>
      ) : (
        /* Parent Dashboard */
        <div className="space-y-5">
          {/* Welcome card */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-3xl p-5 sm:p-6 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                👨‍👩‍👧
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black">
                  अभिभावक ड्यासबोर्ड (Parent Insights)
                </h3>
                <p className="text-xs text-indigo-100">
                  तपाईंको बच्चाको सिकाइ प्रगति, समय र उपलब्धिको अवलोकन
                </p>
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500">सिकेको समय</span>
                <h4 className="text-xl font-black text-slate-900">
                  {progress.totalLearningMinutes} मिनेट
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500">सिकिएका पाठहरू</span>
                <h4 className="text-xl font-black text-slate-900">
                  {progress.lettersLearned.length + progress.numbersLearned.length + progress.wordsLearned.length} विषय
                </h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500">क्विज अंक र तारा</span>
                <h4 className="text-xl font-black text-slate-900">
                  {progress.stars} तारा प्राप्त
                </h4>
              </div>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-black text-slate-900 mb-3">
              सिकाइ विवरण (Learning Breakdown):
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>नेपाली अक्षरहरू (Letters)</span>
                  <span>{progress.lettersLearned.length} / ४९</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.lettersLearned.length / 49) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>अंक १ देखि २० (Numbers)</span>
                  <span>{progress.numbersLearned.length} / २०</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.numbersLearned.length / 20) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>शब्दावली र जनावर (Vocabulary & Animals)</span>
                  <span>{progress.wordsLearned.length} शब्द</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.wordsLearned.length / 30) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pedagogical info & Safe Environment notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
            <p className="font-bold">
              🛡️ बालबालिकाका लागि पूर्ण सुरक्षित र विज्ञापन-रहित (100% Ad-Free):
            </p>
            <p className="text-amber-800">
              यस एपमा बालबालिकाको ध्यान भङ्ग गर्ने कुनै विज्ञापन राखिएको छैन। सबै डेटा बच्चाको उपकरणमा सुरक्षित रूपमा राखिन्छ।
            </p>
          </div>

          {/* Reset progress button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('के तपाईं साँच्चै सिकाइको सबै तथ्याङ्क नयाँ बनाउन चाहनुहुन्छ?')) {
                  onResetProgress();
                  alert('सिकाइको तथ्याङ्क रिसेट भयो।');
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>प्रगति रिसेट गर्नुहोस् (Reset Progress)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
