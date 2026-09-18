import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Sparkles, Music } from 'lucide-react';
import { RHYMES_DATA } from '../data/learningData';
import { RhymeItem } from '../types';
import { soundManager } from '../utils/audio';

interface RhymesSectionProps {
  onBack: () => void;
  onRhymeCompleted: (rhymeId: string) => void;
}

export const RhymesSection: React.FC<RhymesSectionProps> = ({ onBack, onRhymeCompleted }) => {
  const [selectedRhyme, setSelectedRhyme] = useState<RhymeItem>(RHYMES_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset play state on rhyme switch
    stopRhyme();
    setActiveLineIndex(0);
  }, [selectedRhyme]);

  useEffect(() => {
    return () => {
      stopRhyme();
    };
  }, []);

  const stopRhyme = () => {
    setIsPlaying(false);
    soundManager.stopSpeech();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const playVerseLine = (lineIdx: number) => {
    if (lineIdx >= selectedRhyme.verses.length) {
      // Completed rhyme!
      setIsPlaying(false);
      setActiveLineIndex(0);
      soundManager.playSuccessChime();
      onRhymeCompleted(selectedRhyme.id);
      return;
    }

    setActiveLineIndex(lineIdx);
    const currentLine = selectedRhyme.verses[lineIdx];

    soundManager.speakNepali(currentLine.lineNepali, () => {
      // Small pause between lines
      timerRef.current = setTimeout(() => {
        playVerseLine(lineIdx + 1);
      }, 700);
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopRhyme();
    } else {
      setIsPlaying(true);
      playVerseLine(activeLineIndex);
    }
  };

  const handleRestart = () => {
    stopRhyme();
    setActiveLineIndex(0);
    setTimeout(() => {
      setIsPlaying(true);
      playVerseLine(0);
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="rhymes-back-btn"
          onClick={() => {
            stopRhyme();
            soundManager.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-2xl transition-all active:scale-95 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>फर्कनुहोस्</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-extrabold text-purple-800 bg-purple-100 px-3 py-1 rounded-full">
            बाल गीत र कविता (Rhymes)
          </span>
        </div>
      </div>

      {/* Rhyme Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        {RHYMES_DATA.map((rhyme) => {
          const isSelected = selectedRhyme.id === rhyme.id;
          return (
            <button
              key={rhyme.id}
              onClick={() => {
                soundManager.playPop();
                setSelectedRhyme(rhyme);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all shadow-2xs active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
              }`}
            >
              <span className="text-lg">{rhyme.characterIcon}</span>
              <span>{rhyme.titleNepali}</span>
            </button>
          );
        })}
      </div>

      {/* Main Animated Stage & Lyrics Card */}
      <div className="bg-white rounded-3xl border-4 border-purple-200 shadow-xl overflow-hidden p-5 sm:p-7">
        {/* Animated Theater Stage */}
        <div
          className={`w-full rounded-2xl bg-gradient-to-tr ${selectedRhyme.themeColor} p-6 sm:p-8 text-white relative overflow-hidden flex flex-col items-center justify-center text-center shadow-md mb-6`}
        >
          {/* Animated Mascot Character for the Rhyme */}
          <motion.div
            animate={
              isPlaying
                ? {
                    scale: [1, 1.15, 1],
                    rotate: [0, 8, -8, 0],
                    y: [0, -10, 0],
                  }
                : { scale: 1, rotate: 0, y: 0 }
            }
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 1.8,
              ease: 'easeInOut',
            }}
            className="text-7xl sm:text-8xl drop-shadow-lg my-2 cursor-pointer"
            onClick={togglePlay}
          >
            {selectedRhyme.characterIcon}
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            {selectedRhyme.titleNepali}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-white/90">
            {selectedRhyme.titleEnglish}
          </p>

          {/* Background whimsical decorations */}
          <div className="absolute top-2 left-3 opacity-30 text-2xl">✨</div>
          <div className="absolute bottom-2 right-4 opacity-30 text-3xl">🎵</div>
          <div className="absolute bottom-3 left-4 opacity-30 text-2xl">🎶</div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            id="rhyme-play-btn"
            onClick={togglePlay}
            className={`px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg text-white shadow-lg flex items-center gap-2 active:scale-95 transition-all ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>रोक्नुहोस् (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>गीत सुन्नुहोस् (Play)</span>
              </>
            )}
          </button>

          <button
            id="rhyme-restart-btn"
            onClick={handleRestart}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all shadow-xs"
            title="सुरुदेखि सुन्नुहोस् (Restart)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Karaoke Line-by-Line Lyrics Highlight */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-600 text-center uppercase tracking-wider mb-2">
            गीतका शब्दहरू (Lyrics):
          </h4>
          {selectedRhyme.verses.map((verse, index) => {
            const isCurrentLine = isPlaying && activeLineIndex === index;
            return (
              <motion.div
                key={index}
                animate={isCurrentLine ? { scale: 1.02 } : { scale: 1 }}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                  isCurrentLine
                    ? 'bg-purple-100/90 border-purple-400 shadow-md ring-2 ring-purple-200'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                }`}
                onClick={() => {
                  setActiveLineIndex(index);
                  soundManager.speakNepali(verse.lineNepali);
                }}
              >
                <p
                  className={`text-lg sm:text-xl font-extrabold leading-tight ${
                    isCurrentLine ? 'text-purple-950' : 'text-slate-800'
                  }`}
                >
                  {verse.lineNepali}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {verse.lineEnglish}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Moral/Context message */}
        {selectedRhyme.moralNepali && (
          <div className="mt-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-900">
              💡 {selectedRhyme.moralNepali}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
