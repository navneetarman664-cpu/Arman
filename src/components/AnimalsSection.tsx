import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Sparkles, Music, Info } from 'lucide-react';
import { ANIMALS_DATA } from '../data/learningData';
import { AnimalItem } from '../types';
import { soundManager } from '../utils/audio';

interface AnimalsSectionProps {
  onBack: () => void;
  onAnimalLearned: (animalId: string) => void;
}

export const AnimalsSection: React.FC<AnimalsSectionProps> = ({ onBack, onAnimalLearned }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalItem>(ANIMALS_DATA[0]);

  const handleSelectAnimal = (animal: AnimalItem) => {
    setSelectedAnimal(animal);
    onAnimalLearned(animal.id);

    // Play animal sound, then pronounce name
    soundManager.playAnimalSound(animal.soundType);
    setTimeout(() => {
      soundManager.speakNepali(animal.nepali);
    }, 400);
  };

  const playOnlyAnimalSound = (animal: AnimalItem, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playAnimalSound(animal.soundType);
  };

  const playVoicePronunciation = (animal: AnimalItem, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.speakNepali(animal.nepali);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          id="animals-back-btn"
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
            जनावरहरू र आवाज (Animals)
          </span>
        </div>
      </div>

      {/* Featured Big Animal Spotlight Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAnimal.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-5 sm:p-6 mb-6 overflow-hidden relative"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* Animal Mascot Box */}
            <div
              onClick={() => handleSelectAnimal(selectedAnimal)}
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr ${selectedAnimal.color} text-white flex items-center justify-center text-6xl sm:text-7xl shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0`}
            >
              <span className="animate-gentle-wiggle drop-shadow-md">
                {selectedAnimal.icon}
              </span>
            </div>

            {/* Information and Sound buttons */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {selectedAnimal.nepali}
                </span>
                <span className="text-base sm:text-lg font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {selectedAnimal.phonetic} ({selectedAnimal.english})
                </span>
              </div>

              {/* Sound Balloon */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 rounded-full text-amber-900 font-extrabold text-sm my-1.5 border border-amber-300">
                <span>📢 आवाज:</span>
                <span className="text-rose-600 font-black">{selectedAnimal.soundText}</span>
              </div>

              {/* Child-friendly Fun Fact */}
              <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-left">
                <div className="flex items-start gap-2">
                  <span className="text-lg shrink-0">💡</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {selectedAnimal.funFactNepali}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedAnimal.funFactEnglish}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Audio Buttons */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-3.5">
                <button
                  onClick={(e) => playVoicePronunciation(selectedAnimal, e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>नाम सुन्नुहोस्</span>
                </button>

                <button
                  onClick={(e) => playOnlyAnimalSound(selectedAnimal, e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
                >
                  <Music className="w-4 h-4" />
                  <span>आवाज निकाल्नुहोस् ({selectedAnimal.soundText})</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Grid of 10 Animals */}
      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-3 px-1">
        सबै जनावरहरू (छुनुहोस् र आवाज सुन्नुहोस्):
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {ANIMALS_DATA.map((animal) => {
          const isSelected = selectedAnimal.id === animal.id;
          return (
            <motion.button
              key={animal.id}
              onClick={() => handleSelectAnimal(animal)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3.5 rounded-2xl bg-white border-2 flex flex-col items-center text-center shadow-xs transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-500 ring-4 ring-amber-200 bg-amber-50/60 shadow-md'
                  : 'border-slate-200 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${animal.color} text-white flex items-center justify-center text-4xl shadow-2xs mb-1.5`}
              >
                {animal.icon}
              </div>
              <span className="text-lg font-black text-slate-900 leading-tight">
                {animal.nepali}
              </span>
              <span className="text-[11px] font-bold text-amber-700">
                {animal.phonetic}
              </span>
              <span className="text-[10px] text-slate-500">
                {animal.english}
              </span>
              <span className="mt-1 text-[10px] font-extrabold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                {animal.soundText}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
