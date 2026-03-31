export type StudentTaskStatus = "pending" | "completed" | "overdue" | string;

export type StudentTodayTask = {
  task_id: number;
  title: string;
  subject?: string | null;
  status: StudentTaskStatus;
  due_date?: string | null;
  estimated_minutes?: number | null;
};

export type StudentAssignment = {
  assignment_id: number;
  title: string;
  subject?: string | null;
  status?: string | null;
  is_submitted?: boolean | null;
  due_date?: string | null;
  priority?: string | null;
};

export type StudentSubmission = {
  submission_id: number;
  assignment_title?: string | null;
  file_name?: string | null;
  submitted_at?: string | null;
  status?: string | null;
  score?: number | null;
};

export type StudentLatestReport = {
  student_name?: string | null;
  period?: string | null;
  achievement_score?: number | null;
  submission_rate?: number | null;
  weak_topics?: string[] | null;
  ai_insight?: string | null;
};

export type StudentGoalsUpdatePayload = {
  exam_date?: string | null;
  target_score?: number | null;
  daily_study_minutes?: number | null;
};

export type StudentGoalsUpdateResponse = {
  success?: boolean;
  detail?: string;
  goal?: {
    exam_date?: string | null;
    target_score?: number | null;
    daily_study_minutes?: number | null;
  };
};

export type StudentCoachQuestionType =
  | "today_plan"
  | "why_this_task"
  | "before_exam";

export type StudentCoachResponse = {
  success?: boolean;
  answer: string;
  question_type: StudentCoachQuestionType | string;
};
