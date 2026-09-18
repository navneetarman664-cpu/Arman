import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, Trophy, RotateCcw, CheckCircle2, Star } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/learningData';
import { QuizQuestion } from '../types';
import { soundManager } from '../utils/audio';

interface QuizSectionProps {
  onBack: () => void;
  onCompleteQuiz: (score: number) => void;
  onEarnStar: (count: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  onBack,
  onCompleteQuiz,
  onEarnStar,
}) => {
  // Take 5 random questions for this quiz round
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    startNewQuiz();
  }, []);

  const startNewQuiz = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);

    if (shuffled[0]) {
      soundManager.speakNepali(shuffled[0].promptNepali);
    }
  };

  const currentQuestion: QuizQuestion | undefined = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion || feedback) return;

    if (optionId === currentQuestion.correctAnswer) {
      // Correct!
      const compliments = ['शाबास! 🎉', 'एकदम राम्रो! ⭐', 'धेरै राम्रो! 🌟'];
      const text = compliments[Math.floor(Math.random() * compliments.length)];
      setFeedback({ text, isCorrect: true });
      soundManager.playSuccessChime();
      soundManager.speakNepali(text);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });

      const newScore = score + 1;
      setScore(newScore);
      onEarnStar(1);

      setTimeout(() => {
        advanceQuestion(newScore);
      }, 1500);
    } else {
      // Incorrect -> gentle feedback
      const text = 'फेरि प्रयास गरौँ 😊';
      setFeedback({ text, isCorrect: false });
      soundManager.playEncouragingTryAgain();
      soundManager.speakNepali(text);

      setTimeout(() => {
        advanceQuestion(score);
      }, 1800);
    }
  };

  const advanceQuestion = (finalScore: number) => {
    setFeedback(null);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      soundManager.speakNepali(questions[nextIdx].promptNepali);
    } else {
      // Finished 5-question quiz!
      setIsFinished(true);
      soundManager.playSuccessChime();
      onCompleteQuiz(finalScore);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="quiz-back-btn"
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        {/* Progress indicator */}
        {!isFinished && questions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              प्रश्न {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: questions.length }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx < currentIndex
                      ? 'bg-amber-500 scale-110'
                      : idx === currentIndex
                      ? 'bg-amber-400 ring-2 ring-amber-200'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {!isFinished && currentQuestion ? (
        /* Question Card */
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-5 sm:p-7 flex flex-col items-center text-center">
          {/* Audio repeat prompt */}
          <button
            onClick={() => soundManager.speakNepali(currentQuestion.promptNepali)}
            className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors mb-2"
          >
            🔊 प्रश्न सुन्नुहोस्
          </button>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 mb-1">
            {currentQuestion.promptNepali}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-6">
            {currentQuestion.promptEnglish}
          </p>

          {/* Feedback banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`py-2 px-6 rounded-2xl font-black text-base sm:text-lg mb-4 shadow-sm ${
                  feedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                }`}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3 Picture Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
            {currentQuestion.options.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={feedback !== null}
                onClick={() => handleSelectOption(opt.id)}
                className="p-5 rounded-3xl bg-slate-50 hover:bg-amber-50/80 border-3 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md flex flex-col items-center justify-center gap-2 transition-all cursor-pointer min-h-[140px]"
              >
                <span className="text-5xl sm:text-6xl animate-gentle-bounce">
                  {opt.icon}
                </span>
                <span className="text-xl font-black text-slate-800 mt-1">
                  {opt.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* Quiz Finished Celebration Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-6 sm:p-8 flex flex-col items-center text-center max-w-lg mx-auto"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-400 text-white flex items-center justify-center text-5xl shadow-lg mb-3">
            🏆
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            शाबास! क्विज सकियो! 🎉
          </h2>
          <p className="text-sm font-bold text-slate-600 mt-1">
            तपाईंले ५ मध्ये {score} वटा सही उत्तर दिनुभयो!
          </p>

          {/* Stars visualizer */}
          <div className="flex items-center gap-2 my-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i < score
                    ? 'text-amber-500 fill-amber-400 scale-110 animate-pulse'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 w-full mb-6">
            <p className="text-sm font-extrabold text-amber-950">
              ⭐ तपाईंले {score} वटा नयाँ तारा जित्नुभयो!
            </p>
          </div>

          <button
            onClick={startNewQuiz}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>अर्को क्विज खेलौँ (Play Again)</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
