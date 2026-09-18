import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, RefreshCw, Trophy, Heart, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { SWAR_LETTERS, VYANJAN_LETTERS, NUMBERS_DATA, VOCAB_CATEGORIES, COLORS_DATA } from '../data/learningData';

interface GamesSectionProps {
  onBack: () => void;
  onEarnStar: (count: number) => void;
}

type GameType = 'letter-match' | 'number-count' | 'word-match' | 'color-match';

export const GamesSection: React.FC<GamesSectionProps> = ({ onBack, onEarnStar }) => {
  const [activeGame, setActiveGame] = useState<GameType>('letter-match');
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);

  // Current challenge data
  const [currentQuestion, setCurrentQuestion] = useState<{
    prompt: string;
    promptEnglish: string;
    targetDisplay: string;
    correctAnswerId: string;
    options: { id: string; label: string; icon: string; extra?: string }[];
  } | null>(null);

  useEffect(() => {
    generateNewQuestion(activeGame);
  }, [activeGame, round]);

  const fireCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const generateNewQuestion = (gameType: GameType) => {
    setFeedback(null);

    if (gameType === 'letter-match') {
      // Pick random letter from Swar or Vyanjan
      const pool = [...SWAR_LETTERS.slice(0, 8), ...VYANJAN_LETTERS.slice(0, 15)];
      const target = pool[Math.floor(Math.random() * pool.length)];

      // Pick 2 distractors
      const distractors = pool.filter((l) => l.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 2);
      const allOptions = [
        { id: target.id, label: target.word, icon: target.icon },
        ...distractors.map((d) => ({ id: d.id, label: d.word, icon: d.icon })),
      ].sort(() => 0.5 - Math.random());

      setCurrentQuestion({
        prompt: `अक्षर ‘${target.letter}’ बाट कुन चित्र आउँछ?`,
        promptEnglish: `Which picture starts with letter "${target.letter}"?`,
        targetDisplay: target.letter,
        correctAnswerId: target.id,
        options: allOptions,
      });
      soundManager.speakNepali(`अक्षर ${target.letter} बाट कुन चित्र आउँछ?`);
    } else if (gameType === 'number-count') {
      // Pick number between 1 and 10 for simple counting
      const numItem = NUMBERS_DATA[Math.floor(Math.random() * 10)];
      const distractorPool = NUMBERS_DATA.filter((n) => n.number !== numItem.number).sort(() => 0.5 - Math.random()).slice(0, 2);

      const allOptions = [
        { id: String(numItem.number), label: `${numItem.nepaliNumeral} (${numItem.nepaliWord})`, icon: '🔢' },
        ...distractorPool.map((d) => ({ id: String(d.number), label: `${d.nepaliNumeral} (${d.nepaliWord})`, icon: '🔢' })),
      ].sort(() => 0.5 - Math.random());

      setCurrentQuestion({
        prompt: `यहाँ कतिवटा वस्तु छन्? गनेर सही अंक छान्नुहोस्:`,
        promptEnglish: `Count the objects and choose the matching Nepali number:`,
        targetDisplay: Array(numItem.number).fill(numItem.icon).join(' '),
        correctAnswerId: String(numItem.number),
        options: allOptions,
      });
      soundManager.speakNepali(`यहाँ कतिवटा छन्? गन्ती गर्नुहोस्।`);
    } else if (gameType === 'word-match') {
      // Pick a random word from vocabulary
      const allVocab = VOCAB_CATEGORIES.flatMap((c) => c.items);
      const target = allVocab[Math.floor(Math.random() * allVocab.length)];
      const distractors = allVocab.filter((v) => v.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 2);

      const allOptions = [
        { id: target.id, label: target.nepali, icon: '📝' },
        ...distractors.map((d) => ({ id: d.id, label: d.nepali, icon: '📝' })),
      ].sort(() => 0.5 - Math.random());

      setCurrentQuestion({
        prompt: `यो चित्रको सही नेपाली नाम कुन हो?`,
        promptEnglish: `What is the Nepali word for this picture?`,
        targetDisplay: target.icon,
        correctAnswerId: target.id,
        options: allOptions,
      });
      soundManager.speakNepali(`यो चित्रको नाम के हो?`);
    } else if (gameType === 'color-match') {
      // Pick a color
      const target = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
      const distractors = COLORS_DATA.filter((c) => c.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 2);

      const allOptions = [
        { id: target.id, label: target.nepali, icon: target.exampleIcon, extra: target.bgClass },
        ...distractors.map((d) => ({ id: d.id, label: d.nepali, icon: d.exampleIcon, extra: d.bgClass })),
      ].sort(() => 0.5 - Math.random());

      setCurrentQuestion({
        prompt: `‘${target.nepali}’ (${target.english}) रङ कुन हो?`,
        promptEnglish: `Which one is the color "${target.english}"?`,
        targetDisplay: target.nepali,
        correctAnswerId: target.id,
        options: allOptions,
      });
      soundManager.speakNepali(`${target.nepali} रङ कुन हो?`);
    }
  };

  const handleOptionSelect = (selectedId: string) => {
    if (!currentQuestion) return;

    if (selectedId === currentQuestion.correctAnswerId) {
      // Positive feedback
      const compliments = ['शाबास! 🎉', 'एकदम राम्रो! ⭐', 'अति उत्तम! 🌟'];
      const text = compliments[Math.floor(Math.random() * compliments.length)];
      setFeedback({ text, isCorrect: true });
      soundManager.playSuccessChime();
      soundManager.speakNepali(text);
      fireCelebration();
      setScore((s) => s + 1);
      onEarnStar(1);

      setTimeout(() => {
        setRound((r) => r + 1);
      }, 1500);
    } else {
      // Gentle encouragement (never harsh)
      const text = 'फेरि प्रयास गरौँ 😊';
      setFeedback({ text, isCorrect: false });
      soundManager.playEncouragingTryAgain();
      soundManager.speakNepali(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="games-back-btn"
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        {/* Score Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>जित्नुभएको अंक: {score}</span>
        </div>
      </div>

      {/* 4 Mini-Game Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          id="game-tab-letter"
          onClick={() => {
            soundManager.playPop();
            setActiveGame('letter-match');
            setRound(1);
          }}
          className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center gap-1 border-2 transition-all ${
            activeGame === 'letter-match'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <span className="text-2xl">🔤</span>
          <span>अक्षर मिलाऊ</span>
          <span className="text-[10px] opacity-80">(Letter Match)</span>
        </button>

        <button
          id="game-tab-number"
          onClick={() => {
            soundManager.playPop();
            setActiveGame('number-count');
            setRound(1);
          }}
          className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center gap-1 border-2 transition-all ${
            activeGame === 'number-count'
              ? 'bg-blue-500 text-white border-blue-600 shadow-md ring-2 ring-blue-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
          }`}
        >
          <span className="text-2xl">🔢</span>
          <span>गन्ती गरौँ</span>
          <span className="text-[10px] opacity-80">(Number Count)</span>
        </button>

        <button
          id="game-tab-word"
          onClick={() => {
            soundManager.playPop();
            setActiveGame('word-match');
            setRound(1);
          }}
          className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center gap-1 border-2 transition-all ${
            activeGame === 'word-match'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <span className="text-2xl">📚</span>
          <span>शब्द मिलाऊ</span>
          <span className="text-[10px] opacity-80">(Word Match)</span>
        </button>

        <button
          id="game-tab-color"
          onClick={() => {
            soundManager.playPop();
            setActiveGame('color-match');
            setRound(1);
          }}
          className={`p-3 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center gap-1 border-2 transition-all ${
            activeGame === 'color-match'
              ? 'bg-purple-500 text-white border-purple-600 shadow-md ring-2 ring-purple-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
          }`}
        >
          <span className="text-2xl">🎨</span>
          <span>रङ चिनौँ</span>
          <span className="text-[10px] opacity-80">(Color Match)</span>
        </button>
      </div>

      {/* Main Game Stage */}
      {currentQuestion && (
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-5 sm:p-7 flex flex-col items-center text-center">
          {/* Round Indicator */}
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              गेम राउन्ड {round}
            </span>
            <button
              onClick={() => {
                soundManager.playPop();
                generateNewQuestion(activeGame);
              }}
              className="flex items-center gap-1 text-xs text-amber-700 font-bold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>नयाँ प्रश्न</span>
            </button>
          </div>

          {/* Question Prompt */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {currentQuestion.prompt}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {currentQuestion.promptEnglish}
          </p>

          {/* Big Target Display */}
          <div className="my-5 p-5 sm:p-6 bg-gradient-to-tr from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 shadow-inner flex items-center justify-center min-h-[110px] max-w-md w-full">
            <span className="text-5xl sm:text-6xl font-black text-amber-950 tracking-wider">
              {currentQuestion.targetDisplay}
            </span>
          </div>

          {/* Encouragement / Positive Feedback Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`w-full max-w-sm py-2.5 px-4 rounded-2xl font-black text-base sm:text-lg mb-4 shadow-sm flex items-center justify-center gap-2 ${
                  feedback.isCorrect
                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                }`}
              >
                <span>{feedback.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3 Answer Options Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-xl">
            {currentQuestion.options.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOptionSelect(opt.id)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 shadow-sm flex flex-col items-center justify-center gap-2 transition-all cursor-pointer min-h-[100px]"
              >
                {opt.extra ? (
                  <div className={`w-12 h-12 rounded-full ${opt.extra} shadow-xs flex items-center justify-center text-2xl`}>
                    {opt.icon}
                  </div>
                ) : (
                  <span className="text-4xl animate-gentle-wiggle">{opt.icon}</span>
                )}
                <span className="text-lg font-black text-slate-800">
                  {opt.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
