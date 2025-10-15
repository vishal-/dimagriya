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
  grade: number;
  subject: string;
  title: string;
  totalQuestions: number;
  sections: Section[];
}