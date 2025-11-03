// Add to your types/assessment.ts
export interface Attempt {
    id: string;
    assessment_id: string;
    student: string; // Student name
    status: 'in_progress' | 'completed' | 'abandoned';
    started_at: string;
    ended_at?: string;
    duration_minutes?: number;
    responses: Record<string, string>; // question_id -> selected_answer
    total_questions?: number;
    correct_answers?: number;
    score_percentage?: number;
}