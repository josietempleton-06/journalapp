
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string;
  date: number; // Timestamp
  aiAnalysis?: string;
  tags: string[];
}

export enum MoodType {
  HAPPY = 'Happy',
  CALM = 'Calm',
  SAD = 'Sad',
  ANXIOUS = 'Anxious',
  ENERGIZED = 'Energized',
  TIRED = 'Tired',
  GRATEFUL = 'Grateful'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
