export interface Problem {
  id: number;
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