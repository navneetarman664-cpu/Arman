import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import { VOCAB_CATEGORIES } from '../data/learningData';
import { VocabCategory, VocabItem } from '../types';
import { soundManager } from '../utils/audio';

interface VocabularySectionProps {
  onBack: () => void;
  onWordLearned: (wordId: string) => void;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({ onBack, onWordLearned }) => {
  const [selectedCategory, setSelectedCategory] = useState<VocabCategory>(VOCAB_CATEGORIES[0]);
  const [activeWord, setActiveWord] = useState<VocabItem | null>(null);

  const handleCategorySelect = (category: VocabCategory) => {
    soundManager.playPop();
    setSelectedCategory(category);
    soundManager.speakNepali(category.nameNepali);
  };

  const handleWordClick = (word: VocabItem) => {
    soundManager.playPop();
    setActiveWord(word);
    const phrase = `${word.nepali} — ${word.english}`;
    soundManager.speakNepali(word.nepali);
    onWordLearned(word.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="vocab-back-btn"
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
            शब्द सिकौँ (Vocabulary)
          </span>
        </div>
      </div>

      {/* Horizontal Category Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {VOCAB_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-sm whitespace-nowrap transition-all shadow-2xs active:scale-95 ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.nameNepali}</span>
              <span className="text-xs opacity-75 hidden sm:inline">({cat.nameEnglish})</span>
            </button>
          );
        })}
      </div>

      {/* Category Banner Title */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{selectedCategory.icon}</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {selectedCategory.nameNepali}
            </h2>
            <p className="text-xs font-bold text-slate-600">
              {selectedCategory.nameEnglish} • कुनै पनि कार्ड थिचेर उच्चारण सुन्नुहोस्
            </p>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
        {selectedCategory.items.map((item, index) => {
          const isCurrentActive = activeWord?.id === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => handleWordClick(item)}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-white rounded-3xl p-4 sm:p-5 border-2 shadow-md hover:shadow-lg flex flex-col items-center text-center transition-all cursor-pointer overflow-hidden ${
                isCurrentActive
                  ? 'border-amber-400 ring-4 ring-amber-200 bg-amber-50/50'
                  : 'border-slate-100 hover:border-amber-300'
              }`}
            >
              {/* Audio Speaker Icon Pill */}
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>

              {/* Big Emoji Illustration */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/80 flex items-center justify-center text-4xl sm:text-5xl shadow-2xs my-1 group-hover:scale-110 transition-transform">
                <span className="animate-gentle-wiggle">{item.icon}</span>
              </div>

              {/* Nepali Word */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
                {item.nepali}
              </h3>

              {/* English & Phonetic */}
              <p className="text-xs sm:text-sm font-extrabold text-amber-700 mt-0.5">
                {item.phonetic}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                {item.english}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
