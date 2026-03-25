import { students, type StudentRecord } from "./mock-data/students";
import { studentReports } from "./mock-data/report-hub-mock-data";

type Tone = "rose" | "gold" | "peach" | "soft";

export type StudentDetailCard = {
  label: string;
  value: string;
  note: string;
  tone: Tone;
  badge: string;
};

export type StudentDetailData = {
  student: StudentRecord;
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

// 과목별 기본 흐름은 여기서만 관리합니다.
const subjectProfiles: Record<
  StudentRecord["subject"],
  {
    recentUnit: string;
    completedUnits: string[];
    currentUnit: string;
    delayStatus: string;
    progressRate: number;
    progressBars: number[];
    progressNote: string;
    weaknessTopics: string[];
    repeatMistakes: string[];
    attentionFlags: string[];
    assignmentNotes: Array<{
      title: string;
      status: "완료" | "미완료";
      due: string;
      note: string;
      score: string;
    }>;
    feedbackSummary: string;
    attitude: string;
    supplement: string;
    nextCheck: string;
    timelinePrefix: string;
    studytiSummary: string;
    studytiTags: string[];
    goalSummary: string;
    targetUniversity: string;
    admissionTrack: string;
  }
> = {
  수학: {
    recentUnit: "미적분 II",
    completedUnits: ["함수의 극한", "도함수 활용"],
    currentUnit: "적분 응용",
    delayStatus: "계획 대비 소폭 지연",
    progressRate: 78,
    progressBars: [42, 50, 58, 64, 70, 78],
    progressNote: "개념 복습과 응용 문제의 균형은 좋고, 서술형 연결만 조금 더 다듬으면 됩니다.",
    weaknessTopics: ["미분 응용", "문항 해석", "서술형 논리"],
    repeatMistakes: ["조건 누락", "부호 처리 실수", "식 변형 중간 단계 생략"],
    attentionFlags: ["서술형 마무리 점검", "오답 재발 방지"],
    assignmentNotes: [
      { title: "미분 응용 문제", status: "미완료", due: "오늘", note: "서술형 풀이까지 함께 확인 필요", score: "78/100" },
      { title: "적분 기본 문제", status: "완료", due: "어제", note: "정답률은 안정적", score: "95/100" },
      { title: "함수 복습 노트", status: "완료", due: "지난 수업", note: "개념 정리는 완료", score: "92/100" },
    ],
    feedbackSummary: "개념 이해는 좋고, 문제를 끝까지 밀어붙이는 힘을 더 올리면 좋습니다.",
    attitude: "집중도는 높지만, 마지막 계산에서 급해지는 경향이 있습니다.",
    supplement: "오답 정리를 길게 하기보다 자주 짧게 확인하는 방식이 맞습니다.",
    nextCheck: "다음 수업 전 서술형 3문항 체크",
    timelinePrefix: "수학",
    studytiSummary: "계산 속도는 빠르지만, 마지막 서술 단계에서 꼼꼼함이 약해집니다.",
    studytiTags: ["상위권 유지형", "속도 빠름", "서술형 보강 필요"],
    goalSummary: "이번 시험에서 점수를 끌어올리면서 정시 준비 흐름을 안정적으로 유지합니다.",
    targetUniversity: "고려대",
    admissionTrack: "정시",
  },
  영어: {
    recentUnit: "Reading V",
    completedUnits: ["지문 구조 파악", "핵심 문장 찾기"],
    currentUnit: "어휘 복습과 문장 연결",
    delayStatus: "문장 연결 단계 점검 필요",
    progressRate: 71,
    progressBars: [36, 42, 50, 57, 62, 71],
    progressNote: "독해 흐름은 괜찮고, 어휘와 문장 연결에서 조금 더 정교함이 필요합니다.",
    weaknessTopics: ["어휘 복습", "문장 연결", "영작 구성"],
    repeatMistakes: ["유사 어휘 혼동", "주어 동사 대응 실수", "문장 순서 정리 부족"],
    attentionFlags: ["어휘 누적 점검", "서술형 표현 관리"],
    assignmentNotes: [
      { title: "Reading V 독해", status: "미완료", due: "오늘", note: "핵심 문장 표시가 필요", score: "81/100" },
      { title: "어휘 20문항", status: "완료", due: "어제", note: "정답률은 무난", score: "89/100" },
      { title: "문장 연결 연습", status: "미완료", due: "이번 주", note: "문장 순서 재점검 필요", score: "84/100" },
    ],
    feedbackSummary: "독해는 유지되고 있으나, 어휘 복습 속도를 조금 올려야 합니다.",
    attitude: "수업 집중도는 좋고, 숙제 복습만 더 안정되면 좋습니다.",
    supplement: "짧은 분량이라도 매일 보는 방식이 효과적입니다.",
    nextCheck: "다음 수업 전 어휘 정리와 연결 문장 확인",
    timelinePrefix: "영어",
    studytiSummary: "독해 흐름은 안정적이고, 어휘 누적 관리에 따라 성과가 크게 달라집니다.",
    studytiTags: ["독해 강점", "어휘 누적형", "루틴 관리 중요"],
    goalSummary: "이번 시험 점수를 올리고 수시 내신 흐름을 같이 챙기는 방향이 맞습니다.",
    targetUniversity: "한국외대",
    admissionTrack: "수시",
  },
  국어: {
    recentUnit: "문학의 이해",
    completedUnits: ["서술형 개념 정리", "지문 핵심 파악"],
    currentUnit: "문학 해석과 표현 정리",
    delayStatus: "진도는 안정적",
    progressRate: 82,
    progressBars: [44, 49, 55, 61, 68, 75, 82],
    progressNote: "지문 해석은 안정적이고, 표현의 세부 정리를 통해 완성도를 올리는 단계입니다.",
    weaknessTopics: ["서술형", "표현력", "문학 용어"],
    repeatMistakes: ["표현의 뉘앙스 차이", "근거 문장 누락", "문학 용어 혼동"],
    attentionFlags: ["서술형 답안 점검", "표현력 보완"],
    assignmentNotes: [
      { title: "문학 해석 정리", status: "완료", due: "어제", note: "핵심은 잘 잡힘", score: "90/100" },
      { title: "서술형 답안", status: "미완료", due: "오늘", note: "근거 문장 보강 필요", score: "83/100" },
      { title: "문학 용어 정리", status: "완료", due: "지난 수업", note: "개념은 안정적", score: "94/100" },
    ],
    feedbackSummary: "지문 해석은 안정적이며, 표현력 보완만 하면 흐름이 더 좋아집니다.",
    attitude: "차분하지만 답안을 정리하는 속도를 조금 더 올릴 필요가 있습니다.",
    supplement: "짧은 서술형을 자주 써보는 방식이 잘 맞습니다.",
    nextCheck: "다음 수업 전 서술형 2문항과 표현 정리",
    timelinePrefix: "국어",
    studytiSummary: "정리형 사고가 강하고, 근거 문장 연결을 분명히 하는 쪽이 잘 맞습니다.",
    studytiTags: ["차분한 정리형", "근거 연결 중요", "서술형 보완"],
    goalSummary: "정시와 수시를 함께 열어두고 서술형 완성도를 끌어올립니다.",
    targetUniversity: "서강대",
    admissionTrack: "정시/수시 병행",
  },
  과학: {
    recentUnit: "물리 개념",
    completedUnits: ["기본 개념 정리", "실험 관찰 포인트"],
    currentUnit: "실험 서술과 개념 연결",
    delayStatus: "실험 서술 보강 필요",
    progressRate: 66,
    progressBars: [30, 36, 42, 48, 54, 60, 66],
    progressNote: "개념은 잡히고 있고, 실험 보고서와 서술형에서 점검이 필요한 단계입니다.",
    weaknessTopics: ["실험 서술", "개념 연결", "자료 해석"],
    repeatMistakes: ["실험 결과 해석 누락", "조건 정리 부족", "그래프 설명 생략"],
    attentionFlags: ["실험 보고서 점검", "서술형 보완"],
    assignmentNotes: [
      { title: "물리 개념 확인", status: "완료", due: "어제", note: "기본 이해는 확보", score: "87/100" },
      { title: "실험 보고서", status: "미완료", due: "오늘", note: "결과 해석 보완 필요", score: "79/100" },
      { title: "자료 해석 문제", status: "완료", due: "지난 수업", note: "기본 정리는 양호", score: "88/100" },
    ],
    feedbackSummary: "기본 개념은 잡혀 있고, 보고서 서술형을 더 구체적으로 다듬으면 좋습니다.",
    attitude: "실습 참여는 좋고, 마무리 정리 단계에서 조금 더 꼼꼼함이 필요합니다.",
    supplement: "실험 결과와 개념을 짝지어서 다시 보는 방식이 효과적입니다.",
    nextCheck: "다음 수업 전 실험 서술 문장 점검",
    timelinePrefix: "과학",
    studytiSummary: "실험 참여는 적극적이지만, 결과 해석을 언어로 정리하는 데 시간이 걸립니다.",
    studytiTags: ["실험 참여형", "결과 해석 보강", "정리 속도 필요"],
    goalSummary: "수시 대비를 염두에 두고 과학 내신 안정화를 우선합니다.",
    targetUniversity: "한양대",
    admissionTrack: "수시",
  },
};

// 학생 상태별 관리 신호는 이 매핑에서 한 번에 읽습니다.
const statusProfiles: Record<
  StudentRecord["status"],
  {
    managementStatus: string;
    managementTone: Tone;
    managementNote: string;
    currentLevel: string;
    planStatus: string;
    planTone: Tone;
    planNote: string;
    planAdjustmentText: string;
    feedbackLabel: string;
    riskText: string;
    nextActionText: string;
    timelineKind: "success" | "info" | "warning";
  }
> = {
  상승: {
    managementStatus: "상승 흐름",
    managementTone: "soft",
    managementNote: "최근 성취도 상승이 뚜렷해서 현재 계획을 유지해도 됩니다.",
    currentLevel: "상승 중",
    planStatus: "계획 유지 가능",
    planTone: "soft",
    planNote: "역산 계획을 그대로 유지해도 무리가 없습니다.",
    planAdjustmentText: "유지",
    feedbackLabel: "최근 피드백 있음",
    riskText: "추가 보강보다 정리 중심이 적합합니다.",
    nextActionText: "현재 흐름 유지",
    timelineKind: "success",
  },
  안정: {
    managementStatus: "안정",
    managementTone: "gold",
    managementNote: "기본 흐름이 안정적이라 계획 유지 중심으로 관리하면 됩니다.",
    currentLevel: "안정 유지",
    planStatus: "계획 유지 가능",
    planTone: "soft",
    planNote: "현재 계획대로 가도 괜찮은 상태입니다.",
    planAdjustmentText: "유지",
    feedbackLabel: "최근 피드백 기록 있음",
    riskText: "점검은 필요하지만 큰 위험 신호는 없습니다.",
    nextActionText: "유지 관리",
    timelineKind: "info",
  },
  주의: {
    managementStatus: "주의",
    managementTone: "peach",
    managementNote: "보강이 필요한 상태라 우선순위를 다시 잡는 것이 좋습니다.",
    currentLevel: "보완 필요",
    planStatus: "보강 필요",
    planTone: "peach",
    planNote: "일정 일부를 줄이고 핵심 단원을 다시 잡는 편이 좋습니다.",
    planAdjustmentText: "조정",
    feedbackLabel: "최근 피드백 확인",
    riskText: "미완료 과제와 취약 단원을 동시에 점검해야 합니다.",
    nextActionText: "보강 우선",
    timelineKind: "warning",
  },
  "시험 임박": {
    managementStatus: "시험 임박",
    managementTone: "gold",
    managementNote: "시험 대응 우선순위를 바로 올려야 하는 학생입니다.",
    currentLevel: "시험 대응 중",
    planStatus: "진도 재조정 필요",
    planTone: "gold",
    planNote: "역산 계획에서 현재 위치를 다시 맞춰야 합니다.",
    planAdjustmentText: "재조정",
    feedbackLabel: "최근 피드백 필요",
    riskText: "핵심 문제 중심으로 바로 정리해야 합니다.",
    nextActionText: "시험 대비 집중",
    timelineKind: "warning",
  },
};

// 특정 학생의 시험일이나 강조 포인트는 예외값으로만 덮어씁니다.
const detailOverrides: Record<
  string,
  {
    goalDelta: number;
    examDate: string;
    teacherFocus: string;
    goalSummary: string;
    targetUniversity: string;
    admissionTrack: string;
  }
> = {
  AIM_24001: { goalDelta: 8, examDate: "4월 12일", teacherFocus: "미분 응용과 서술형 연결", goalSummary: "이번 시험 8점 상승과 정시 준비 흐름 유지를 목표로 합니다.", targetUniversity: "고려대", admissionTrack: "정시" },
  AIM_24005: { goalDelta: 10, examDate: "4월 7일", teacherFocus: "서술형 마무리와 오답 정리", goalSummary: "이번 시험 10점 상승이 우선이며 정시 대응력을 끌어올립니다.", targetUniversity: "연세대", admissionTrack: "정시" },
  AIM_24012: { goalDelta: 12, examDate: "4월 9일", teacherFocus: "어휘 복습과 독해 속도", goalSummary: "이번 시험 점수 상승과 수시 내신 안정화를 함께 봅니다.", targetUniversity: "한국외대", admissionTrack: "수시" },
  AIM_24021: { goalDelta: 6, examDate: "4월 18일", teacherFocus: "서술형 표현 완성도", goalSummary: "정시와 수시를 함께 열어두고 서술형 완성도를 높입니다.", targetUniversity: "서울대", admissionTrack: "정시/수시 병행" },
  AIM_24028: { goalDelta: 9, examDate: "4월 10일", teacherFocus: "응용 문제와 풀이 순서", goalSummary: "이번 시험에서 9점 이상 올려 정시 경쟁력을 확보합니다.", targetUniversity: "성균관대", admissionTrack: "정시" },
  AIM_24031: { goalDelta: 11, examDate: "4월 10일", teacherFocus: "서술형 문장 구조", goalSummary: "수시 내신을 우선으로 하되 시험 점수 상승도 같이 잡습니다.", targetUniversity: "서강대", admissionTrack: "수시" },
  AIM_24036: { goalDelta: 7, examDate: "4월 16일", teacherFocus: "복합 응용 정리", goalSummary: "정시 흐름을 유지하면서 실전 응용 점수를 올립니다.", targetUniversity: "한양대", admissionTrack: "정시" },
  AIM_24042: { goalDelta: 8, examDate: "4월 16일", teacherFocus: "영작 구성과 문장 점검", goalSummary: "수시 내신을 지키면서 이번 시험에서 8점 상승을 노립니다.", targetUniversity: "중앙대", admissionTrack: "수시" },
  AIM_24048: { goalDelta: 13, examDate: "4월 21일", teacherFocus: "실험 서술과 자료 해석", goalSummary: "수시 준비 중심으로 과학 내신 안정화를 우선합니다.", targetUniversity: "경희대", admissionTrack: "수시" },
  AIM_24051: { goalDelta: 5, examDate: "4월 23일", teacherFocus: "시간 배분과 심화 정리", goalSummary: "정시 준비 흐름을 유지하며 안정적으로 점수를 더합니다.", targetUniversity: "고려대", admissionTrack: "정시" },
  AIM_24057: { goalDelta: 12, examDate: "4월 13일", teacherFocus: "서술형과 표현력", goalSummary: "수시 대비로 내신을 끌어올리면서 서술형 점검을 강화합니다.", targetUniversity: "이화여대", admissionTrack: "수시" },
  AIM_24063: { goalDelta: 10, examDate: "4월 13일", teacherFocus: "문장 연결과 어휘 정리", goalSummary: "정시 대비로 이번 시험 10점 상승을 목표로 합니다.", targetUniversity: "동국대", admissionTrack: "정시" },
};

function buildStatusProfile(student: StudentRecord) {
  return statusProfiles[student.status];
}

function buildSubjectProfile(student: StudentRecord) {
  return subjectProfiles[student.subject];
}

function buildStudentDetail(student: StudentRecord): StudentDetailData {
  const statusProfile = buildStatusProfile(student);
  const subjectProfile = buildSubjectProfile(student);
  const override = detailOverrides[student.id] ?? {
    goalDelta: 8,
    examDate: "4월 15일",
    teacherFocus: `${student.subject} 핵심 정리`,
    goalSummary: `이번 시험에서 ${student.subject} 점수를 끌어올리고 학습 흐름을 안정화합니다.`,
    targetUniversity: "미정",
    admissionTrack: "정시/수시 병행",
  };

  const goalScore = Math.min(100, student.score + override.goalDelta);
  // 취약 단원은 학생 개별 값과 과목 공통값을 합쳐 중복 없이 보여줍니다.
  const weakTopics = Array.from(new Set([student.weakTopic, ...subjectProfile.weaknessTopics]));
  const assignmentRate = Math.round((student.assignmentDone / student.assignmentTotal) * 100);
  const primaryWeakRate = Math.max(36, Math.min(62, 54 - student.overdueAssignments * 4));
  const secondaryWeakRate = Math.max(30, Math.min(58, primaryWeakRate - 8));
  const analysisStatusLabel = student.examDays <= 10 ? "중점 관리" : student.examDays <= 14 ? "진행 원활" : "추가 보강";
  const smartInsightText =
    student.examDays <= 10
      ? "현재 페이스를 유지하면 시험 전 핵심 범위를 2회독할 수 있습니다. 서술형 오답만 한 번 더 보강하면 안정권입니다."
      : "현재 페이스를 유지하면 시험 전 핵심 범위를 2.5회독할 수 있습니다. 오답 정리와 개념 복습 루틴을 함께 유지하면 좋습니다.";

  return {
    student,
    goalScore,
    currentLevel: statusProfile.currentLevel,
    examDate: override.examDate,
    dDayLabel: `D-${student.examDays}`,
    // 성향 요약은 수업 방식과 학생 반응 패턴을 빠르게 읽기 위한 값입니다.
    studyti: {
      summary: subjectProfile.studytiSummary,
      tags: subjectProfile.studytiTags,
      ctaLabel: "학생 성향 확인",
    },
    // 학습 목표는 이번 시험 점수와 장기 입시 방향을 같이 보여주기 위한 값입니다.
    learningGoal: {
      summary: override.goalSummary,
      scoreBoostLabel: `이번 시험 +${override.goalDelta}점`,
      targetScoreLabel: `목표 점수 ${goalScore}점`,
      admissionTrack: override.admissionTrack,
      targetUniversity: override.targetUniversity,
      focusLabel: override.teacherFocus,
    },
    // AI 인사이트는 진도, 취약 유형, 보강 추천을 한 번에 묶어 보여줍니다.
    aiInsight: {
      progressReport: {
        statusLabel: analysisStatusLabel,
        currentChapterLabel: "현재 단원",
        currentChapter: subjectProfile.currentUnit,
        progressRate: subjectProfile.progressRate,
        nextGoal: subjectProfile.completedUnits[subjectProfile.completedUnits.length - 1]
          ? `${subjectProfile.completedUnits[subjectProfile.completedUnits.length - 1]} 심화`
          : `${subjectProfile.currentUnit} 정리`,
        completeDate: student.examDays <= 7 ? "시험 직전 정리" : "시험 7일 전 정리",
        smartInsight: smartInsightText,
      },
      weakAnalysis: [
        {
          title: weakTopics[0],
          description: `${subjectProfile.repeatMistakes[0]}이 자주 보여 우선 점검이 필요합니다.`,
          statusLabel: student.overdueAssignments > 0 ? "중점 관리" : "추가 보강",
          tone: student.overdueAssignments > 1 ? "peach" : "gold",
          accuracyLabel: `정답률 ${primaryWeakRate}%`,
          progressRate: primaryWeakRate,
        },
        {
          title: weakTopics[1] ?? weakTopics[0],
          description: `${subjectProfile.repeatMistakes[1] ?? subjectProfile.repeatMistakes[0]}를 함께 정리하면 안정적입니다.`,
          statusLabel: student.status === "시험 임박" ? "추가 보강" : "보완 필요",
          tone: student.status === "시험 임박" ? "peach" : "rose",
          accuracyLabel: `정답률 ${secondaryWeakRate}%`,
          progressRate: secondaryWeakRate,
        },
      ],
      clinicRecommendation: {
        title: "맞춤 클리닉 추천",
        subtitle: "취약 유형과 최근 오답을 묶어 짧은 보강 계획으로 연결합니다.",
        ctaLabel: "보강안 보기",
      },
    },
    managementStatus: statusProfile.managementStatus,
    managementTone: statusProfile.managementTone,
    managementNote: statusProfile.managementNote,
    sectionCards: [
      {
        label: "최근 성취도",
        value: `${student.score}%`,
        note: "최근 진도 대비 흐름",
        tone: "rose",
        badge: statusProfile.nextActionText,
      },
      {
        label: "미완료 과제 수",
        value: `${student.overdueAssignments}건`,
        note: "이번 주 누적 기준",
        tone: student.overdueAssignments > 0 ? "peach" : "soft",
        badge: student.overdueAssignments > 0 ? "확인 필요" : "안정",
      },
      {
        label: "취약 단원 수",
        value: `${weakTopics.length}개`,
        note: "반복 점검 대상",
        tone: "gold",
        badge: "집중",
      },
      {
        label: "계획 조정 필요",
        value: statusProfile.planAdjustmentText,
        note: "역산 계획 기준",
        tone: statusProfile.planTone,
        badge: statusProfile.planStatus,
      },
      {
        label: "시험 임박도",
        value: `D-${student.examDays}`,
        note: "시험일까지 남은 기간",
        tone: student.examDays <= 14 ? "gold" : "soft",
        badge: student.examDays <= 14 ? "우선" : "관리",
      },
      {
        label: "최근 피드백 여부",
        value: statusProfile.feedbackLabel,
        note: "최근 수업 기록",
        tone: "soft",
        badge: "기록",
      },
    ],
    progress: {
      recentUnit: subjectProfile.recentUnit,
      completedUnits: subjectProfile.completedUnits,
      currentUnit: subjectProfile.currentUnit,
      delayStatus: subjectProfile.delayStatus,
      progressRate: subjectProfile.progressRate,
      progressBars: subjectProfile.progressBars,
      progressNote: subjectProfile.progressNote,
    },
    exam: {
      examDate: override.examDate,
      remainingDays: `D-${student.examDays}`,
      planRate: Math.max(52, Math.min(96, student.score + (statusProfile.timelineKind === "warning" ? 4 : 8))),
      planStatus: statusProfile.planStatus,
      planNote: statusProfile.planNote,
      reversePlanPosition: student.examDays <= 10 ? "역산 계획 후반부" : "역산 계획 중반부",
      reversePlanNote: `현재 위치는 ${student.examDays <= 10 ? "시험 직전 점검 구간" : "핵심 단원 정리 구간"}입니다.`,
      statusLabel: student.examDays <= 14 ? "보강 필요" : statusProfile.nextActionText,
      statusTone: statusProfile.planTone,
    },
    assignments: {
      completionRate: assignmentRate,
      completionText: `${student.assignmentDone}/${student.assignmentTotal}`,
      riskText:
        student.overdueAssignments > 0
          ? `미완료 ${student.overdueAssignments}건이 남아 있어 과제 관리가 필요합니다.`
          : "과제 누락 없이 안정적으로 관리되고 있습니다.",
      items: subjectProfile.assignmentNotes,
    },
    weaknesses: {
      topics: weakTopics,
      repeatMistakes: subjectProfile.repeatMistakes,
      attentionFlags: subjectProfile.attentionFlags,
      note: `현재는 ${override.teacherFocus} 쪽을 우선 점검하면 효율적입니다.`,
    },
    feedback: {
      summary: subjectProfile.feedbackSummary,
      attitude: subjectProfile.attitude,
      supplement: subjectProfile.supplement,
      nextCheck: subjectProfile.nextCheck,
      note: `다음 수업 전 ${override.teacherFocus}을 다시 확인하면 좋습니다.`,
    },
    nextActions: [
      {
        label: "다음 수업에서 다룰 내용",
        description: `${subjectProfile.currentUnit} 중심으로 핵심 문제를 다시 정리합니다.`,
        tone: "rose",
      },
      {
        label: "우선 확인할 과제",
        description:
          student.overdueAssignments > 0
            ? `미완료 과제 ${student.overdueAssignments}건을 먼저 확인합니다.`
            : "완료된 과제의 오답 포인트만 재점검합니다.",
        tone: student.overdueAssignments > 0 ? "peach" : "soft",
      },
      {
        label: "계획 수정 추천",
        description: `${statusProfile.planStatus} 기준으로 역산 계획을 ${statusProfile.planAdjustmentText}합니다.`,
        tone: statusProfile.planTone,
      },
    ],
    timeline: [
      {
        time: "오늘",
        title: `${subjectProfile.timelinePrefix} 과제 상태 확인`,
        detail: "최근 제출 흐름과 미완료 과제를 다시 확인합니다.",
        kind: statusProfile.timelineKind,
      },
      {
        time: "어제",
        title: "피드백 기록",
        detail: "수업 중 메모와 보강 포인트를 정리했습니다.",
        kind: "info",
      },
      {
        time: "3일 전",
        title: "진도 업데이트",
        detail: "현재 진행 단원이 계획 기준에 맞는지 점검했습니다.",
        kind: "success",
      },
      {
        time: "이번 주",
        title: "시험 관련 알림",
        detail: `시험일까지 ${student.examDays}일 남아 있어 우선순위를 조정합니다.`,
        kind: "warning",
      },
    ],
  };
}

export function getStudentDetailById(id: string) {
  const student = id
    ? students.find((item) => item.id === id) ?? buildLegacyStudentRecord(id)
    : null;
  if (!student) {
    return null;
  }

  return buildStudentDetail(student);
}

function buildLegacyStudentRecord(id: string): StudentRecord | null {
  const legacy = studentReports.find((item) => item.id === id);
  if (!legacy) return null;

  const parsedDays = Number(legacy.dDay.replace(/^D-/, ""));
  const examDays = Number.isFinite(parsedDays) ? parsedDays : 14;
  const assignmentTotal = 20;
  const assignmentDone = Math.max(
    0,
    Math.min(assignmentTotal, Math.round((legacy.homework / 100) * assignmentTotal)),
  );
  const overdueAssignments = legacy.homework >= 90 ? 0 : legacy.homework >= 75 ? 1 : 2;
  const status: StudentRecord["status"] =
    legacy.examReadiness === "위험"
      ? "시험 임박"
      : legacy.examReadiness === "주의"
        ? "주의"
        : "안정";

  return {
    id: legacy.id,
    name: legacy.name,
    school: "서울고등학교",
    grade: legacy.grade,
    className: legacy.className,
    subject: legacy.subject,
    recentProgress: `${legacy.subject} 진도 점검`,
    recentTag: "Report Hub",
    score: legacy.achievement,
    examDays,
    overdueAssignments,
    assignmentDone,
    assignmentTotal,
    weakTopic: legacy.insight.split(" ").slice(0, 2).join(" "),
    status,
    note: legacy.insight,
  };
}
