import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowLeft, ArrowRight, Grid, CreditCard, Sparkles, RotateCcw, PenTool, Check } from 'lucide-react';
import { SWAR_LETTERS, VYANJAN_LETTERS } from '../data/learningData';
import { LetterItem } from '../types';
import { soundManager } from '../utils/audio';

interface LettersSectionProps {
  onBack: () => void;
  onLetterCompleted: (letterId: string) => void;
}

export const LettersSection: React.FC<LettersSectionProps> = ({ onBack, onLetterCompleted }) => {
  const [activeTab, setActiveTab] = useState<'swar' | 'vyanjan'>('swar');
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDrawPad, setShowDrawPad] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPaintingRef = useRef(false);

  const currentList: LetterItem[] = activeTab === 'swar' ? SWAR_LETTERS : VYANJAN_LETTERS;
  const currentLetter = currentList[currentIndex] || currentList[0];

  // Play audio when letter changes in flashcard mode
  useEffect(() => {
    if (viewMode === 'flashcard' && currentLetter) {
      playLetterAudio(currentLetter);
      onLetterCompleted(currentLetter.id);
    }
  }, [currentIndex, activeTab, viewMode]);

  const playLetterAudio = (item: LetterItem) => {
    soundManager.playPop();
    const phrase = `${item.letter} — ${item.word}`;
    soundManager.speakNepali(phrase);
  };

  const handleNext = () => {
    soundManager.playPop();
    if (currentIndex < currentList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      soundManager.playSuccessChime();
      setCurrentIndex(0);
    }
    clearCanvas();
  };

  const handlePrev = () => {
    soundManager.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(currentList.length - 1);
    }
    clearCanvas();
  };

  // Canvas drawing functions for finger letter tracing
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isPaintingRef.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isPaintingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPaintingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#F97316'; // Playful orange chalk
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="letters-back-btn"
          onClick={() => {
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        {/* View Mode Toggle: Single Card vs Grid */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            id="letters-mode-flashcard"
            onClick={() => {
              soundManager.playPop();
              setViewMode('flashcard');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'flashcard'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>कार्ड</span>
          </button>
          <button
            id="letters-mode-grid"
            onClick={() => {
              soundManager.playPop();
              setViewMode('grid');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>सबै</span>
          </button>
        </div>
      </div>

      {/* Category Tabs: Swar vs Vyanjan */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          id="letters-tab-swar"
          onClick={() => {
            soundManager.playPop();
            setActiveTab('swar');
            setCurrentIndex(0);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-base sm:text-lg transition-all shadow-sm active:scale-95 ${
            activeTab === 'swar'
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white ring-4 ring-rose-200'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300'
          }`}
        >
          <span>स्वर वर्ण (अ–अः)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold">
            १३
          </span>
        </button>

        <button
          id="letters-tab-vyanjan"
          onClick={() => {
            soundManager.playPop();
            setActiveTab('vyanjan');
            setCurrentIndex(0);
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-base sm:text-lg transition-all shadow-sm active:scale-95 ${
            activeTab === 'vyanjan'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white ring-4 ring-blue-200'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300'
          }`}
        >
          <span>व्यञ्जन वर्ण (क–ज्ञ)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-bold">
            ३६
          </span>
        </button>
      </div>

      {/* Flashcard Single Letter Big View */}
      {viewMode === 'flashcard' ? (
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLetter.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-white rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden relative p-6 flex flex-col items-center text-center"
            >
              {/* Card Index Pill */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {currentIndex + 1} / {currentList.length}
                </span>

                {/* Finger Writing Pad Toggle */}
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setShowDrawPad(!showDrawPad);
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    showDrawPad
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  }`}
                  title="अक्षर लेख्ने अभ्यास"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>{showDrawPad ? 'अभ्यास बन्द' : 'अक्षर लेख्नुहोस्'}</span>
                </button>
              </div>

              {/* Main Big Letter Display with Tap Audio */}
              <button
                id="current-letter-display-btn"
                onClick={() => playLetterAudio(currentLetter)}
                className="relative group my-2 focus:outline-hidden"
              >
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr ${currentLetter.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 group-active:scale-95 transition-transform`}
                >
                  <span className="text-8xl sm:text-9xl font-black drop-shadow-md select-none">
                    {currentLetter.letter}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-amber-600 p-2.5 rounded-full shadow-md border border-amber-200 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
              </button>

              {/* Word and Picture Showcase */}
              <div
                onClick={() => playLetterAudio(currentLetter)}
                className="w-full mt-4 p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200/80 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-4xl sm:text-5xl animate-gentle-bounce">
                    {currentLetter.icon}
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-950 leading-tight">
                      {currentLetter.word}
                    </h3>
                    <p className="text-sm font-semibold text-amber-700">
                      {currentLetter.englishPhonetic} • {currentLetter.meaning}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Volume2 className="w-5 h-5" />
                </div>
              </div>

              {/* Interactive Tracing / Practice Pad */}
              {showDrawPad && (
                <div className="w-full mt-4 p-3 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900">
                      औँलाले अक्षर कोर्नुहोस्:
                    </span>
                    <button
                      onClick={clearCanvas}
                      className="flex items-center gap-1 text-xs text-rose-600 font-bold hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>मेटाउनुहोस्</span>
                    </button>
                  </div>
                  <div className="relative w-full h-36 bg-white rounded-xl border border-amber-200 overflow-hidden touch-none flex items-center justify-center">
                    {/* Faint Guide Letter in Background */}
                    <span className="absolute text-7xl font-bold text-slate-200 select-none pointer-events-none">
                      {currentLetter.letter}
                    </span>
                    <canvas
                      ref={canvasRef}
                      width={340}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onMouseMove={draw}
                      onTouchStart={startDrawing}
                      onTouchEnd={stopDrawing}
                      onTouchMove={draw}
                      className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls: Previous / Audio / Next */}
          <div className="flex items-center gap-4 mt-6">
            <button
              id="letter-prev-btn"
              onClick={handlePrev}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-amber-300 text-amber-800 shadow-md flex items-center justify-center hover:bg-amber-50 active:scale-95 transition-all"
              title="अघिल्लो (Previous)"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>

            <button
              id="letter-listen-again-btn"
              onClick={() => playLetterAudio(currentLetter)}
              className="px-6 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base sm:text-lg shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <Volume2 className="w-6 h-6" />
              <span>फेरि सुन्नुहोस्</span>
            </button>

            <button
              id="letter-next-btn"
              onClick={handleNext}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex items-center justify-center active:scale-95 transition-all"
              title="पछिल्लो (Next)"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      ) : (
        /* Grid Overview of All Letters */
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {currentList.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setCurrentIndex(index);
                playLetterAudio(item);
                setViewMode('flashcard');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-3 border-2 border-amber-200 shadow-sm hover:border-amber-400 hover:shadow-md flex flex-col items-center text-center transition-all cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center text-3xl font-extrabold shadow-xs mb-1.5`}
              >
                {item.letter}
              </div>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
                {item.word}
              </span>
              <span className="text-[10px] font-semibold text-slate-600">
                {item.englishPhonetic}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
