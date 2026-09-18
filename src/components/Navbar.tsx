import React from 'react';
import { Volume2, VolumeX, Home, Trophy, UserCheck, Sparkles } from 'lucide-react';
import { SectionType } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  currentSection: SectionType;
  onNavigate: (section: SectionType) => void;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  stars,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm px-3 py-2.5 sm:px-6 sm:py-3 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* App Brand & Mascot */}
        <button
          id="nav-brand-btn"
          onClick={() => {
            soundManager.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-md flex items-center justify-center">
            {/* Cute Nepali Danphe Bird / Mascot */}
            <span className="text-2xl sm:text-2xl animate-gentle-wiggle drop-shadow">🦚</span>
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm text-[10px]">
              🇳🇵
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-amber-900 tracking-tight leading-tight">
                मेरो नेपाली सिकाइ
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-amber-700/80 -mt-0.5">
              Mero Nepali Sikai
            </p>
          </div>
        </button>

        {/* Action Controls: Stars, Home, Mute, Progress, Parent */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Star Counter Pill */}
          <button
            id="nav-stars-btn"
            onClick={() => {
              soundManager.playPop();
              onNavigate('progress');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-full text-amber-800 font-bold text-sm shadow-xs hover:scale-105 active:scale-95 transition-all"
            title="तपाईंका ताराहरू (Stars)"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span className="font-extrabold text-base text-amber-900">{stars}</span>
            <span className="text-xs text-amber-700 hidden sm:inline">तारा</span>
          </button>

          {/* Home Button (shown when not on home) */}
          {currentSection !== 'home' && (
            <button
              id="nav-home-btn"
              onClick={() => {
                soundManager.playPop();
                onNavigate('home');
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
              title="गृहपृष्ठ (Home)"
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={onToggleMute}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xs border transition-all active:scale-90 ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-500'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}
            title={isMuted ? 'ध्वनि खोल्नुहोस् (Unmute)' : 'ध्वनि बन्द गर्नुहोस् (Mute)'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Progress / Badges */}
          <button
            id="nav-progress-btn"
            onClick={() => {
              soundManager.playPop();
              onNavigate('progress');
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border shadow-xs transition-all active:scale-90 ${
              currentSection === 'progress'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
            title="प्रगति र पदक (Progress)"
            aria-label="Progress"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Parent Gate Button */}
          <button
            id="nav-parent-btn"
            onClick={() => {
              soundManager.playPop();
              onNavigate('parent');
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border shadow-xs transition-all active:scale-90 ${
              currentSection === 'parent'
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="अभिभावक खण्ड (Parent Zone)"
            aria-label="Parents"
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
