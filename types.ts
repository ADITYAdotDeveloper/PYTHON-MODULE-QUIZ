export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Quote {
  quote: string;
  author: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: string; // ISO string
  quote?: string;
}

export type ScreenState = 'WELCOME' | 'QUIZ' | 'RESULTS' | 'LEADERBOARD';

export interface QuizResultPayload {
  name: string;
  score: number;
  timestamp: string;
  quote: string;
}