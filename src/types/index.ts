export interface Vocabulary {
  id: string;
  english: string;
  vietnamese: string;
  pronunciation: string;
  image?: string;
  audio?: string;
}

export interface PracticeResult {
  resultId: string;
  vocabularyId: string;
  practiceType: 'en-to-vi' | 'vi-to-en';
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTakenMs: number;
  timestamp: number;
  hintsRevealed: number;
}

export interface Settings {
  hintInterval: number; // seconds
  dailyWordCount: number;
}

// Extend Window interface to include our API
declare global {
  interface Window {
    api: {
      readJsonData: () => Promise<Vocabulary[]>;
      getSettings: () => Promise<Settings>;
      saveSettings: (settings: Settings) => Promise<boolean>;
      savePracticeResult: (result: PracticeResult) => Promise<boolean>;
    }
  }
} 