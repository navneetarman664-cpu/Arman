import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Sparkles, Palette } from 'lucide-react';
import { COLORS_DATA } from '../data/learningData';
import { ColorItem } from '../types';
import { soundManager } from '../utils/audio';

interface ColorsSectionProps {
  onBack: () => void;
  onColorLearned: (colorId: string) => void;
}

export const ColorsSection: React.FC<ColorsSectionProps> = ({ onBack, onColorLearned }) => {
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS_DATA[0]);

  const handleSelectColor = (color: ColorItem) => {
    soundManager.playPop();
    setSelectedColor(color);
    onColorLearned(color.id);
    const phrase = `${color.nepali} — ${color.exampleNepali}`;
    soundManager.speakNepali(phrase);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="colors-back-btn"
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
            रङहरू (Colors)
          </span>
        </div>
      </div>

      {/* Featured Big Color Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedColor.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border-4 border-amber-200 shadow-xl p-6 mb-6 overflow-hidden relative flex flex-col items-center text-center"
        >
          {/* Big Color Circle Swatch */}
          <button
            onClick={() => handleSelectColor(selectedColor)}
            className="group relative cursor-pointer my-2"
          >
            <div
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full ${selectedColor.bgClass} shadow-xl flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-105 group-active:scale-95 transition-all`}
            >
              <span className="animate-gentle-wiggle drop-shadow-md">
                {selectedColor.exampleIcon}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-white text-slate-800 p-2.5 rounded-full shadow-md border border-slate-200 group-hover:scale-110 transition-transform">
              <Volume2 className="w-5 h-5 text-amber-600" />
            </div>
          </button>

          {/* Color Names */}
          <div className="mt-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              {selectedColor.nepali}
            </h2>
            <p className="text-base sm:text-lg font-bold text-slate-600 mt-0.5">
              {selectedColor.phonetic} • {selectedColor.english}
            </p>
          </div>

          {/* Example Object */}
          <div className="mt-4 px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="text-2xl">{selectedColor.exampleIcon}</span>
            <span className="text-sm sm:text-base font-bold text-amber-950">
              उदा: {selectedColor.exampleNepali} ({selectedColor.exampleObject})
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Grid of 9 Colors */}
      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-3 px-1">
        सबै रङहरू (छुनुहोस् र सुन्नुहोस्):
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3.5 sm:gap-4">
        {COLORS_DATA.map((color) => {
          const isSelected = selectedColor.id === color.id;
          return (
            <motion.button
              key={color.id}
              onClick={() => handleSelectColor(color)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-3xl bg-white border-2 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-500 ring-4 ring-amber-200 bg-amber-50/40 shadow-md'
                  : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              {/* Color circle badge */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${color.bgClass} flex items-center justify-center text-2xl sm:text-3xl shadow-sm mb-2`}
              >
                <span>{color.exampleIcon}</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {color.nepali}
              </span>
              <span className="text-xs font-bold text-amber-700">
                {color.phonetic}
              </span>
              <span className="text-[11px] text-slate-500">
                {color.english}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
