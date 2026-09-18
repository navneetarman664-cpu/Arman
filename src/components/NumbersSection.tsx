import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Volume2, Sparkles, Grid, CreditCard } from 'lucide-react';
import { NUMBERS_DATA } from '../data/learningData';
import { NumberItem } from '../types';
import { soundManager } from '../utils/audio';

interface NumbersSectionProps {
  onBack: () => void;
  onNumberCompleted: (num: number) => void;
}

export const NumbersSection: React.FC<NumbersSectionProps> = ({ onBack, onNumberCompleted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [poppedObjects, setPoppedObjects] = useState<number[]>([]);

  const currentNumber: NumberItem = NUMBERS_DATA[currentIndex];

  useEffect(() => {
    setPoppedObjects([]);
    if (viewMode === 'flashcard' && currentNumber) {
      playNumberAudio(currentNumber);
      onNumberCompleted(currentNumber.number);
    }
  }, [currentIndex, viewMode]);

  const playNumberAudio = (item: NumberItem) => {
    soundManager.playPop();
    const text = `${item.nepaliNumeral} — ${item.nepaliWord}`;
    soundManager.speakNepali(text);
  };

  const handleNext = () => {
    soundManager.playPop();
    if (currentIndex < NUMBERS_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      soundManager.playSuccessChime();
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    soundManager.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(NUMBERS_DATA.length - 1);
    }
  };

  // When child taps one of the counting objects
  const handleObjectTap = (index: number) => {
    soundManager.playPop();
    if (!poppedObjects.includes(index)) {
      const updated = [...poppedObjects, index];
      setPoppedObjects(updated);

      // Pronounce current count
      const countNumber = updated.length;
      const matchingNumber = NUMBERS_DATA.find((n) => n.number === countNumber);
      if (matchingNumber) {
        soundManager.speakNepali(matchingNumber.nepaliWord);
      }

      if (updated.length === currentNumber.number) {
        soundManager.playSuccessChime();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="numbers-back-btn"
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              soundManager.playPop();
              setViewMode('flashcard');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'flashcard'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>गन्ती कार्ड</span>
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setViewMode('grid');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>१–२० सबै</span>
          </button>
        </div>
      </div>

      {viewMode === 'flashcard' ? (
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentNumber.number}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg bg-white rounded-3xl border-4 border-blue-200 shadow-xl overflow-hidden p-5 sm:p-7 flex flex-col items-center text-center"
            >
              {/* Progress counter */}
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  अंक {currentIndex + 1} / {NUMBERS_DATA.length}
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  English: {currentNumber.number}
                </span>
              </div>

              {/* Big Nepali Numeral */}
              <button
                id="current-number-display-btn"
                onClick={() => playNumberAudio(currentNumber)}
                className="group relative my-1 focus:outline-hidden"
              >
                <div
                  className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr ${currentNumber.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-transform`}
                >
                  <span className="text-7xl sm:text-8xl font-black drop-shadow-md select-none">
                    {currentNumber.nepaliNumeral}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full shadow-md border border-blue-200 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </div>
              </button>

              {/* Nepali Word and Phonetic */}
              <div
                onClick={() => playNumberAudio(currentNumber)}
                className="mt-3 cursor-pointer group"
              >
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  {currentNumber.nepaliNumeral} — {currentNumber.nepaliWord}
                </h3>
                <p className="text-base font-bold text-blue-600">
                  {currentNumber.englishPhonetic} ({currentNumber.number})
                </p>
              </div>

              {/* Interactive Counting Objects Visualizer */}
              <div className="w-full mt-5 pt-4 border-t-2 border-slate-100">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-700">
                    वस्तुहरू छुनुहोस् र गन्नुहोस्:
                  </span>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    गनेको: {poppedObjects.length} / {currentNumber.number}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-100 min-h-[100px]">
                  {Array.from({ length: currentNumber.number }).map((_, i) => {
                    const isCounted = poppedObjects.includes(i);
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleObjectTap(i)}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xs transition-all ${
                          isCounted
                            ? 'bg-amber-400 ring-4 ring-amber-200 scale-110 rotate-6 shadow-md'
                            : 'bg-white hover:bg-white/90 border border-slate-200'
                        }`}
                      >
                        <span>{currentNumber.icon}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {poppedObjects.length === currentNumber.number && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-3 flex items-center justify-center gap-1.5 text-emerald-600 font-extrabold text-sm"
                  >
                    <Sparkles className="w-4 h-4 fill-emerald-500" />
                    <span>शाबास! तपाईंले सबै {currentNumber.nepaliWord} वटा वस्तु गन्नुभयो! 🎉</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              id="number-prev-btn"
              onClick={handlePrev}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-blue-300 text-blue-800 shadow-md flex items-center justify-center hover:bg-blue-50 active:scale-95 transition-all"
              title="अघिल्लो (Previous)"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <button
              id="number-listen-again-btn"
              onClick={() => playNumberAudio(currentNumber)}
              className="px-6 py-3.5 sm:py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-base sm:text-lg shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <Volume2 className="w-6 h-6" />
              <span>फेरि सुन्नुहोस्</span>
            </button>

            <button
              id="number-next-btn"
              onClick={handleNext}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg flex items-center justify-center active:scale-95 transition-all"
              title="पछिल्लो (Next)"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      ) : (
        /* Numbers Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
          {NUMBERS_DATA.map((item, index) => (
            <motion.button
              key={item.number}
              onClick={() => {
                setCurrentIndex(index);
                playNumberAudio(item);
                setViewMode('flashcard');
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-4 border-2 border-blue-200 shadow-sm hover:border-blue-400 hover:shadow-md flex flex-col items-center text-center transition-all cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center text-4xl font-black shadow-xs mb-2`}
              >
                {item.nepaliNumeral}
              </div>
              <span className="text-lg font-black text-slate-800 leading-tight">
                {item.nepaliWord}
              </span>
              <span className="text-xs font-bold text-blue-600">
                {item.englishPhonetic} ({item.number})
              </span>
              <div className="mt-2 text-xl">{item.icon}</div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
