// Add to your types/assessment.ts
export interface Response {
    question: string;
    answer: string;
    isCorrect: boolean;
}

export interface Attempt {
    id: string;
    assessment_id: string;
    student: string; // Student name
    status: 'in_progress' | 'completed' | 'abandoned';
    started_at: string;
    ended_at?: string;
    duration_minutes?: number;
    responses: Record<string, Response>; // question_index -> Response
    total_questions?: number;
    correct_answers?: number;
    score_percentage?: number;
}