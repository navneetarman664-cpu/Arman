export type SectionType =
  | 'home'
  | 'letters'
  | 'numbers'
  | 'vocabulary'
  | 'animals'
  | 'colors'
  | 'rhymes'
  | 'games'
  | 'quiz'
  | 'progress'
  | 'parent';

export interface LetterItem {
  id: string;
  letter: string;
  type: 'swar' | 'vyanjan';
  word: string;
  englishPhonetic: string;
  meaning: string;
  icon: string;
  color: string;
}

export interface NumberItem {
  number: number;
  nepaliNumeral: string;
  nepaliWord: string;
  englishPhonetic: string;
  icon: string;
  color: string;
}

export interface VocabCategory {
  id: string;
  nameNepali: string;
  nameEnglish: string;
  icon: string;
  color: string;
  items: VocabItem[];
}

export interface VocabItem {
  id: string;
  nepali: string;
  english: string;
  phonetic: string;
  icon: string;
}

export interface AnimalItem {
  id: string;
  nepali: string;
  english: string;
  phonetic: string;
  icon: string;
  soundType: 'cow' | 'dog' | 'cat' | 'elephant' | 'horse' | 'goat' | 'tiger' | 'lion' | 'monkey' | 'rabbit';
  soundText: string;
  funFactNepali: string;
  funFactEnglish: string;
  color: string;
}

export interface ColorItem {
  id: string;
  nepali: string;
  english: string;
  phonetic: string;
  hex: string;
  textClass: string;
  bgClass: string;
  exampleObject: string;
  exampleNepali: string;
  exampleIcon: string;
}

export interface RhymeVerse {
  lineNepali: string;
  lineEnglish: string;
}

export interface RhymeItem {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  characterIcon: string;
  themeColor: string;
  verses: RhymeVerse[];
  moralNepali?: string;
}

export interface QuizQuestion {
  id: string;
  promptNepali: string;
  promptEnglish: string;
  correctAnswer: string;
  options: {
    id: string;
    label: string;
    icon: string;
  }[];
}

export interface BadgeItem {
  id: string;
  titleNepali: string;
  titleEnglish: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface UserProgress {
  stars: number;
  streakDays: number;
  lettersLearned: string[];
  numbersLearned: number[];
  wordsLearned: string[];
  quizzesCompleted: number;
  gamesPlayed: number;
  rhymesListened: string[];
  totalLearningMinutes: number;
  lastActiveDate: string;
  badges: string[];
}
