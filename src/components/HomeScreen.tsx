import React from 'react';
import { motion } from 'motion/react';
import { SectionType } from '../types';
import { soundManager } from '../utils/audio';

interface HomeScreenProps {
  onSelectSection: (section: SectionType) => void;
  stars: number;
}

interface MenuCardItem {
  id: SectionType;
  titleNepali: string;
  subtitleEnglish: string;
  subtextNepali: string;
  icon: string;
  gradient: string;
  accentBorder: string;
  shadowColor: string;
  badge?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectSection }) => {
  const menuItems: MenuCardItem[] = [
    {
      id: 'letters',
      titleNepali: '१. नेपाली अक्षर',
      subtitleEnglish: 'Nepali Letters (क, ख, ग & अ, आ, इ)',
      subtextNepali: 'स्वर र व्यञ्जन सिक्ने',
      icon: '🔤',
      gradient: 'from-amber-400 via-orange-400 to-rose-400',
      accentBorder: 'border-orange-300',
      shadowColor: 'shadow-orange-200',
      badge: 'स्वर र व्यञ्जन',
    },
    {
      id: 'numbers',
      titleNepali: '२. अंक सिकौँ',
      subtitleEnglish: 'Learn Numbers (१ देखि २०)',
      subtextNepali: 'गन्ती र रमाइलो बलहरू',
      icon: '🔢',
      gradient: 'from-sky-400 via-blue-400 to-indigo-500',
      accentBorder: 'border-blue-300',
      shadowColor: 'shadow-blue-200',
      badge: '१–२०',
    },
    {
      id: 'vocabulary',
      titleNepali: '३. शब्द सिकौँ',
      subtitleEnglish: 'Basic Vocabulary (८ विधा)',
      subtextNepali: 'फलफूल, तरकारी, चरा र सामान',
      icon: '📚',
      gradient: 'from-emerald-400 via-teal-400 to-green-500',
      accentBorder: 'border-emerald-300',
      shadowColor: 'shadow-emerald-200',
      badge: '८०+ शब्द',
    },
    {
      id: 'animals',
      titleNepali: '४. जनावर',
      subtitleEnglish: 'Animals & Sounds',
      subtextNepali: 'गाई, कुकुर, बिरालो र रोचक कुरा',
      icon: '🦁',
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      accentBorder: 'border-amber-300',
      shadowColor: 'shadow-amber-200',
      badge: 'आवाज र तथ्य',
    },
    {
      id: 'colors',
      titleNepali: '५. रङहरू',
      subtitleEnglish: 'Learn Colors',
      subtextNepali: 'रातो, निलो, हरियो र इन्द्रेणी',
      icon: '🎨',
      gradient: 'from-pink-400 via-rose-400 to-purple-500',
      accentBorder: 'border-pink-300',
      shadowColor: 'shadow-pink-200',
      badge: '९ रङहरू',
    },
    {
      id: 'rhymes',
      titleNepali: '६. बाल गीत / कविता',
      subtitleEnglish: 'Rhymes & Songs',
      subtextNepali: 'तारा बाजी लै लै र रमाइला गीत',
      icon: '🎵',
      gradient: 'from-violet-400 via-purple-500 to-indigo-500',
      accentBorder: 'border-purple-300',
      shadowColor: 'shadow-purple-200',
      badge: 'कराओके',
    },
    {
      id: 'games',
      titleNepali: '७. खेलौँ',
      subtitleEnglish: 'Educational Mini-Games',
      subtextNepali: 'अक्षर, गन्ती र रङ मिलाउने खेल',
      icon: '🎮',
      gradient: 'from-teal-400 via-emerald-400 to-cyan-500',
      accentBorder: 'border-teal-300',
      shadowColor: 'shadow-teal-200',
      badge: '४ रमाइला खेल',
    },
    {
      id: 'quiz',
      titleNepali: '८. क्विज',
      subtitleEnglish: 'Simple Quizzes',
      subtextNepali: '५ प्रश्नहरूको रमाइलो परीक्षा',
      icon: '⭐',
      gradient: 'from-rose-400 via-red-400 to-amber-500',
      accentBorder: 'border-rose-300',
      shadowColor: 'shadow-rose-200',
      badge: 'तारा जित्नुहोस्',
    },
  ];

  const handleCardClick = (section: SectionType, title: string) => {
    soundManager.playPop();
    soundManager.speakNepali(title);
    onSelectSection(section);
  };

  return (
    <div className="pb-16 pt-3 px-3 sm:px-6 max-w-5xl mx-auto">
      {/* Friendly Nepali Mascot Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-2 border-amber-300 p-4 sm:p-5 mb-6 shadow-sm"
      >
        <div className="flex items-center gap-3.5 sm:gap-5">
          {/* Danphe Mascot */}
          <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-2xl border-2 border-amber-300 shadow-md flex items-center justify-center">
            <span className="text-3xl sm:text-4xl animate-gentle-bounce">🦚</span>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
              डाँफे
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 text-xs font-bold mb-1">
              <span>🇳🇵 नमस्ते सानो साथी!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight leading-snug">
              आज हामी के सिक्ने त?
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-amber-800/80">
              तलको कुनै पनि कार्ड थिच्नुहोस् र रमाइलोसँग नेपाली सिक्नुहोस्!
            </p>
          </div>
        </div>

        {/* Decorative Mountain silhouette background hint */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none text-6xl">
          🏔️
        </div>
      </motion.div>

      {/* 8 Main Section Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            id={`home-card-${item.id}`}
            onClick={() => handleCardClick(item.id, item.titleNepali.replace(/^\d+\.\s*/, ''))}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative text-left rounded-3xl p-4 sm:p-5 bg-white border-2 ${item.accentBorder} shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between min-h-[145px] sm:min-h-[165px]`}
          >
            {/* Top decorative gradient glow */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.gradient}`} />

            {/* Header: Icon & Badge */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl sm:text-3xl shadow-sm text-white group-hover:rotate-6 transition-transform`}
              >
                {item.icon}
              </div>
              {item.badge && (
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Titles */}
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
                {item.titleNepali}
              </h3>
              <p className="text-xs font-bold text-amber-600 mt-0.5">
                {item.subtextNepali}
              </p>
              <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                {item.subtitleEnglish}
              </p>
            </div>

            {/* Audio tap hint indicator */}
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
              <span className="inline-flex items-center gap-1">
                <span>सुरु गरौँ</span>
                <span>👉</span>
              </span>
              <span className="text-slate-500 group-hover:text-amber-600 transition-colors">
                🔊 सुन्ने
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
