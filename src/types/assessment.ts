export interface Problem {
  id?: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Section {
  name: string;
  questions: Problem[];
}

export interface Assessment {
  id?: string;
  grade: number;
  subject: string;
  title: string;
  total_questions: number;
  sections: Section[];
  created_at?: string;
  updated_at?: string;
}

export interface Attempt {
  id: string;
  assessment_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  responses: Record<string, string>; // question_id -> selected_answer
  total_questions?: number;
  correct_answers?: number;
  score_percentage?: number;
}