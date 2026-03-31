type Tone = "rose" | "gold" | "peach" | "soft";

export type StudentDetailCard = {
  label: string;
  value: string;
  note: string;
  tone: Tone;
  badge: string;
};

export type StudentDetailData = {
  student: {
    id: string;
    name: string;
    school: string;
    grade: string;
    className: string;
    subject: string;
    status: string;
    score: number;
    examDays: number;
  };
  goalScore: number;
  currentLevel: string;
  examDate: string;
  dDayLabel: string;
  studyti: {
    summary: string;
    tags: string[];
    ctaLabel: string;
  };
  learningGoal: {
    summary: string;
    scoreBoostLabel: string;
    targetScoreLabel: string;
    admissionTrack: string;
    targetUniversity: string;
    focusLabel: string;
  };
  aiInsight: {
    progressReport: {
      statusLabel: string;
      currentChapterLabel: string;
      currentChapter: string;
      progressRate: number;
      nextGoal: string;
      completeDate: string;
      smartInsight: string;
    };
    weakAnalysis: Array<{
      title: string;
      description: string;
      statusLabel: string;
      tone: Tone;
      accuracyLabel: string;
      progressRate: number;
    }>;
    clinicRecommendation: {
      title: string;
      subtitle: string;
      ctaLabel: string;
    };
  };
  managementStatus: string;
  managementTone: Tone;
  managementNote: string;
  sectionCards: StudentDetailCard[];
  progress: {
    recentUnit: string;
    completedUnits: string[];
    currentUnit: string;
    delayStatus: string;
    progressRate: number;
    progressBars: number[];
    progressNote: string;
  };
  exam: {
    examDate: string;
    remainingDays: string;
    planRate: number;
    planStatus: string;
    planNote: string;
    reversePlanPosition: string;
    reversePlanNote: string;
    statusLabel: string;
    statusTone: Tone;
  };
  assignments: {
    completionRate: number;
    completionText: string;
    riskText: string;
    items: Array<{
      title: string;
      status: "완료" | "미완료";
      due: string;
      note: string;
      score: string;
    }>;
  };
  weaknesses: {
    topics: string[];
    repeatMistakes: string[];
    attentionFlags: string[];
    note: string;
  };
  feedback: {
    summary: string;
    attitude: string;
    supplement: string;
    nextCheck: string;
    note: string;
  };
  nextActions: Array<{
    label: string;
    description: string;
    tone: Tone;
  }>;
  timeline: Array<{
    time: string;
    title: string;
    detail: string;
    kind: "success" | "info" | "warning";
  }>;
};
