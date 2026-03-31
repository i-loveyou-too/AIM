export type IssueType =
  | "미제출"
  | "시험 임박"
  | "진도 지연"
  | "계획 조정 필요"
  | "질문 있음"
  | "OCR 검토 필요"
  | "OMR 오답 다수"
  | "공통 오답 반영"
  | "집중 관리";

export type IssueUrgency = "긴급" | "높음" | "중간" | "낮음";
export type IssueStatus = "미확인" | "확인됨" | "처리 완료";

export type IssueAction = {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

export type IssueDetail =
  | {
      kind: "unsubmitted";
      assignmentTitle: string;
      dueDate: string;
      missedCount: number;
      teacherMemo?: string;
      nextAction: string;
    }
  | {
      kind: "exam";
      examDate: string;
      dDay: string;
      progressStatus: string;
      needsReinforcement: boolean;
      needsPlanAdjust: boolean;
      note?: string;
    }
  | {
      kind: "progress";
      plannedUnit: string;
      actualUnit: string;
      delayWeeks?: number;
      reason?: string;
      adjustmentNeeded: string;
    }
  | {
      kind: "question";
      questionText: string;
      relatedUnit: string;
      assignmentTitle?: string;
      needsInClassExplanation: boolean;
    }
  | {
      kind: "ocr";
      assignmentTitle: string;
      submittedAt: string;
      ocrSummary: string;
      reviewReason: string;
    }
  | {
      kind: "commonMistake";
      topMistakeQuestion: string;
      mistakeType: string;
      conceptToReExplain: string[];
      todayLessonRecommendation: string;
    }
  | {
      kind: "focus";
      reasons: string[];
      recentTrend: string;
      teacherNote?: string;
    };

export type Issue = {
  id: string;
  type: IssueType;
  urgency: IssueUrgency;
  status: IssueStatus;
  studentName?: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  occurredAt: string;
  actions: IssueAction[];
  detail: IssueDetail;
};

export type IssueSummaryData = {
  unreadCount: number;
  urgentTodayCount: number;
  examImminentCount: number;
  assignmentIssueCount: number;
  lessonReflectionCount: number;
  focusStudentCount: number;
};

export type LessonReflectionIssueData = {
  reExplainNow: string[];
  questionItems: string[];
  individualNeed: Array<{ studentName: string; reason: string }>;
  homeworkPriority: string;
};

export type IssueInsightsData = {
  repeatNonSubmit: Array<{ name: string; className: string; count: number; lastNote?: string }>;
  frequentQuestions: Array<{ name: string; className: string; count: number; topic: string }>;
  examImminent: Array<{ name: string; className: string; dDay: string; subject: string; urgency: "긴급" | "높음" | "중간" | "낮음" }>;
  delayRisk: Array<{ name: string; className: string; delayUnit: string; weeks: number }>;
  commonReinforcement: Array<{ className: string; concept: string; urgency: "긴급" | "높음" | "중간" | "낮음" }>;
};
