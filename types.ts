export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // For MCQ
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface StudentResult {
  studentId: string;
  studentName: string;
  quizId: string;
  score: number;
  maxScore: number;
  completedAt: string;
  badgesEarned: string[];
}

export interface AppState {
  user: {
    id: string;
    name: string;
    role: UserRole;
    xp: number;
    level: number;
  } | null;
  quizzes: Quiz[];
  results: StudentResult[];
  theme: {
    dyslexicMode: boolean;
    highContrast: boolean;
  };
}