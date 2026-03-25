// 커리큘럼 / 계획 페이지 목업 데이터
// 시험일까지의 역산 계획, 실제 진도, 위험 구간, 다음 수업 액션을 한 화면에서 보여주기 위한 데이터 묶음입니다.

export type CurriculumTone = "brand" | "warm" | "accent" | "soft" | "success" | "alert";

export type CurriculumSummaryCard = {
  label: string;
  value: string;
  note: string;
  emoji: string;
  badge: string;
  tone: CurriculumTone;
};

export type CurriculumCalendarTone = "today" | "lesson" | "boost" | "check" | "exam";

export type CurriculumCalendarItem = {
  date: string;
  label: string;
  title: string;
  note: string;
  tone: CurriculumCalendarTone;
};

export type CurriculumSubtopic = {
  title: string;
  progress: number;
  statusLabel: string;
  note?: string;
};

export type CurriculumRoadmapItem = {
  title: string;
  period: string;
  statusLabel: string;
  tone: CurriculumTone;
  plannedProgress: number;
  actualProgress: number;
  lessonNote: string;
  assignmentNote: string;
  commonMistakeNote: string;
  reinforcementNote: string;
  canFinishBeforeExam: string;
  badges: string[];
  subtopics: CurriculumSubtopic[];
};

export type CurriculumActionItem = {
  title: string;
  description: string;
  tone: CurriculumTone;
};

export type CurriculumRiskItem = {
  title: string;
  reason: string;
  target: string;
  severity: "높음" | "중간" | "낮음";
  nextStep: string;
};

export type CurriculumNoteItem = {
  title: string;
  detail: string;
  reason: string;
};

export type CurriculumPageData = {
  overview: {
    school: string;
    className: string;
    subject: string;
    examDate: string;
    currentDate: string;
    dDay: string;
    remainingLessons: number;
    totalLessons: number;
    totalUnits: number;
    plannedProgress: number;
    actualProgress: number;
    planStatus: string;
    delayUnits: number;
    reinforcementUnits: number;
    completionChance: string;
    currentPlannedPosition: string;
    currentActualPosition: string;
    finishEstimate: string;
    nextCheckpoint: string;
  };
  summaryCards: CurriculumSummaryCard[];
  reversePlan: {
    totalPeriod: string;
    totalUnits: number;
    remainingUnits: number;
    remainingLessons: number;
    weeklyTarget: string;
    algorithmTarget: string;
    actualTarget: string;
    gapSummary: string;
    paceSummary: string;
    completionEstimate: string;
    focusUnit: string;
    nextCheckpoint: string;
  };
  calendar: {
    monthLabel: string;
    periodLabel: string;
    note: string;
    items: CurriculumCalendarItem[];
  };
  comparison: {
    totalUnits: number;
    plannedUnits: number;
    actualUnits: number;
    plannedPercent: number;
    actualPercent: number;
    plannedMilestone: string;
    actualMilestone: string;
    goalMilestone: string;
    finishEstimate: string;
    gapSummary: string;
    canFinishBeforeExam: string;
    markers: {
      label: string;
      value: string;
      tone: CurriculumTone;
    }[];
  };
  roadmap: CurriculumRoadmapItem[];
  nextActions: {
    nextUnit: string;
    objective: string;
    keyConcepts: string[];
    homeworkReflection: string[];
    commonMistakes: string[];
    reinforcementTargets: string[];
    preClassChecks: string[];
    buttons: string[];
  };
  risks: {
    highestRisk: string;
    summary: string;
    items: CurriculumRiskItem[];
  };
  notes: {
    memoTitle: string;
    memoSummary: string;
    items: CurriculumNoteItem[];
  };
};

export const curriculumPageData: CurriculumPageData = {
  overview: {
    school: "서울고등학교",
    className: "수학 A반",
    subject: "수학",
    examDate: "4월 12일",
    currentDate: "3월 24일",
    dDay: "D-19",
    remainingLessons: 6,
    totalLessons: 24,
    totalUnits: 24,
    plannedProgress: 71,
    actualProgress: 67,
    planStatus: "약간 지연",
    delayUnits: 2,
    reinforcementUnits: 3,
    completionChance: "현재 속도 유지 시 시험 전 완주 가능성 보통",
    currentPlannedPosition: "4단원 2주차",
    currentActualPosition: "3단원 후반",
    finishEstimate: "4/9 전후",
    nextCheckpoint: "3/29 함수 보강 후 기출 연결",
  },
  summaryCards: [
    {
      label: "시험일",
      value: "4월 12일",
      note: "기말고사 기준 역산 계획",
      emoji: "📅",
      badge: "D-19",
      tone: "brand",
    },
    {
      label: "남은 수업 수",
      value: "6회",
      note: "시험 전 실제 확보 가능한 수업",
      emoji: "🧭",
      badge: "집중",
      tone: "warm",
    },
    {
      label: "전체 진도율",
      value: "71%",
      note: "계획상 도달해야 할 기준 진도",
      emoji: "📈",
      badge: "계획",
      tone: "accent",
    },
    {
      label: "계획 대비 현재 상태",
      value: "약간 지연",
      note: "현재 실제 진도는 1주 정도 늦음",
      emoji: "⏳",
      badge: "주의",
      tone: "soft",
    },
    {
      label: "지연 단원 수",
      value: "2개",
      note: "계획보다 늦어진 단원",
      emoji: "🔁",
      badge: "지연",
      tone: "alert",
    },
    {
      label: "보강 필요 단원 수",
      value: "3개",
      note: "시험 전 우선 처리해야 할 영역",
      emoji: "🛠️",
      badge: "보강",
      tone: "warm",
    },
    {
      label: "완주 가능성",
      value: "보통",
      note: "현재 속도 유지 기준",
      emoji: "🎯",
      badge: "판단",
      tone: "success",
    },
    {
      label: "시험 전 우선 단원",
      value: "함수",
      note: "다음 수업부터 우선 투입",
      emoji: "🚩",
      badge: "우선",
      tone: "brand",
    },
  ],
  reversePlan: {
    totalPeriod: "2024.02.26 ~ 2024.04.12 (7주)",
    totalUnits: 24,
    remainingUnits: 8,
    remainingLessons: 6,
    weeklyTarget: "주당 1~2단원 + 보강 1회",
    algorithmTarget: "현재 계획상 4단원 2주차까지 도달",
    actualTarget: "실제 진도는 3단원 후반",
    gapSummary: "1주 지연",
    paceSummary: "현재 속도 유지 시 시험 전 완주는 가능하나 함수 단원 보강이 필요합니다.",
    completionEstimate: "4/9 전후",
    focusUnit: "함수 단원",
    nextCheckpoint: "3/29 함수 보강 후 기출 연결",
  },
  calendar: {
    monthLabel: "3월 → 4월",
    periodLabel: "시험일까지 19일",
    note: "계획, 보강, 체크포인트를 시험일까지 집중 배치",
    items: [
      { date: "3/24", label: "오늘", title: "계획 점검", note: "현재 진도와 지연 구간 확인", tone: "today" },
      { date: "3/26", label: "수업", title: "수열 극한", note: "핵심 개념 정리", tone: "lesson" },
      { date: "3/27", label: "보강", title: "유리화 보강", note: "오답 유형 집중", tone: "boost" },
      { date: "3/29", label: "체크", title: "중간 점검", note: "지연 단원 확인", tone: "check" },
      { date: "4/1", label: "수업", title: "함수 연결", note: "다음 단원 진입", tone: "lesson" },
      { date: "4/5", label: "실전", title: "기출 풀이", note: "시간 배분 연습", tone: "lesson" },
      { date: "4/9", label: "보강", title: "마지막 보강", note: "시험 전 우선 처리", tone: "boost" },
      { date: "4/12", label: "시험", title: "기말고사", note: "시험일", tone: "exam" },
    ],
  },
  comparison: {
    totalUnits: 24,
    plannedUnits: 17,
    actualUnits: 16,
    plannedPercent: 71,
    actualPercent: 67,
    plannedMilestone: "4단원 2주차",
    actualMilestone: "3단원 후반",
    goalMilestone: "4월 초 마무리",
    finishEstimate: "4/9 전후",
    gapSummary: "계획 대비 1주 지연",
    canFinishBeforeExam: "보강이 있으면 가능",
    markers: [
      { label: "계획", value: "71%", tone: "soft" },
      { label: "실제", value: "67%", tone: "brand" },
      { label: "도달 목표", value: "4단원 2주차", tone: "warm" },
      { label: "마감 예상", value: "4/9", tone: "accent" },
    ],
  },
  roadmap: [
    {
      title: "수열과 극한",
      period: "3/4 ~ 3/29",
      statusLabel: "진행 중",
      tone: "brand",
      plannedProgress: 75,
      actualProgress: 68,
      lessonNote: "극한 계산과 수렴·발산 판별을 시험 전 우선 정리합니다.",
      assignmentNote: "극한 기출 1세트와 계산형 숙제를 연결합니다.",
      commonMistakeNote: "분모 유리화 단계 생략과 계산 순서 누락이 반복됩니다.",
      reinforcementNote: "유리화와 극한 계산 자동화를 1회 추가 보강합니다.",
      canFinishBeforeExam: "가능",
      badges: ["공통 오답 반영", "시험 전 우선"],
      subtopics: [
        { title: "극한의 정의", progress: 100, statusLabel: "완료", note: "기본 개념 확보" },
        { title: "극한값 계산", progress: 80, statusLabel: "진행 중", note: "절차 자동화 필요" },
        { title: "수렴·발산 판별", progress: 65, statusLabel: "보강 필요", note: "서술형 연결 필요" },
      ],
    },
    {
      title: "함수의 활용",
      period: "3/30 ~ 4/5",
      statusLabel: "보강 필요",
      tone: "warm",
      plannedProgress: 55,
      actualProgress: 42,
      lessonNote: "그래프 해석과 조건 해석을 빠르게 연결해야 합니다.",
      assignmentNote: "함수 그래프 오답 정리 과제를 이번 주에 반영합니다.",
      commonMistakeNote: "그래프 이동과 조건 분기 해석이 흔들립니다.",
      reinforcementNote: "식-그래프-서술형 연결을 보강합니다.",
      canFinishBeforeExam: "가능",
      badges: ["보강 필요", "과제 연계"],
      subtopics: [
        { title: "그래프 해석", progress: 60, statusLabel: "진행 중", note: "조건 분기 점검" },
        { title: "최댓값·최솟값", progress: 45, statusLabel: "보강 필요", note: "식 해석 강화" },
        { title: "문항 적용", progress: 35, statusLabel: "지연", note: "실전 적용 속도 저하" },
      ],
    },
    {
      title: "미적분 기초",
      period: "4/6 ~ 4/12",
      statusLabel: "예정",
      tone: "soft",
      plannedProgress: 25,
      actualProgress: 18,
      lessonNote: "시험 전 마무리 단원으로 짧고 밀도 있게 배치합니다.",
      assignmentNote: "기출 실전 2회와 오답 정리로 연결합니다.",
      commonMistakeNote: "아직 큰 오답 패턴은 없지만 진입 시점 조정이 필요합니다.",
      reinforcementNote: "마지막 주에는 핵심 문제만 선별해 투입합니다.",
      canFinishBeforeExam: "우선 배치",
      badges: ["예정", "시험 전 우선"],
      subtopics: [
        { title: "미분의 의미", progress: 30, statusLabel: "예정", note: "개념 진입 전" },
        { title: "기본 문제", progress: 20, statusLabel: "예정", note: "실전 형식 확인" },
        { title: "실전 응용", progress: 10, statusLabel: "예정", note: "시험 직전 배치" },
      ],
    },
  ],
  nextActions: {
    nextUnit: "함수의 활용 — 그래프 해석과 조건 정리",
    objective: "수열에서 함수로 넘어가기 전에 연결 단원을 안정화합니다.",
    keyConcepts: [
      "그래프 이동과 조건 해석",
      "최댓값·최솟값 결정 포인트",
      "수열과 함수 연결 유형",
    ],
    homeworkReflection: [
      "지난 과제에서 유리화 단계 생략이 있었는지 먼저 확인",
      "기출 풀이 속도보다 절차 설명을 더 우선하기",
      "서술형 풀이 순서를 학생이 직접 말하게 유도",
    ],
    commonMistakes: [
      "식은 맞는데 그래프 해석이 늦어짐",
      "시험 직전 서술형 문장 정리가 흐려짐",
      "보강 후 바로 다음 수업으로 이어지지 않음",
    ],
    reinforcementTargets: [
      "박서연 · 수학 A반",
      "이서준 · 수학 A반",
      "함수 기초 미흡 학생 2명",
    ],
    preClassChecks: [
      "극한 기출 1세트 회수 확인",
      "함수 단원 그래프 자료 준비",
      "보강 대상 학생 출결 확인",
    ],
    buttons: ["계획 조정", "보강 배정", "다음 수업 보기"],
  },
  risks: {
    highestRisk: "박서연 · 수학 A반",
    summary: "현재 속도 유지 시 함수 단원 진입이 1주 더 밀릴 가능성이 있어, 계산 보강을 먼저 배치하는 편이 안전합니다.",
    items: [
      {
        title: "수열과 극한",
        reason: "유리화 계산에서 절차 누락이 반복됩니다.",
        target: "박서연 · 수학 A반",
        severity: "높음",
        nextStep: "보강 문제 5개 추가 배부",
      },
      {
        title: "함수의 활용",
        reason: "그래프 해석과 조건 분기에서 속도 저하가 발생합니다.",
        target: "이서준 · 수학 A반",
        severity: "중간",
        nextStep: "수업 전 그래프 해석 예시를 다시 정리",
      },
      {
        title: "시험 전 실전 모의",
        reason: "기출 풀이가 시험 형식과 아직 충분히 연결되지 않았습니다.",
        target: "수학 A반 전체",
        severity: "높음",
        nextStep: "4/5 이전 실전 모의 1회 필수",
      },
      {
        title: "미적분 기초",
        reason: "시험 전 마무리 구간이라 보강 없이 지나가면 위험합니다.",
        target: "중상위권 학생",
        severity: "낮음",
        nextStep: "핵심 문제만 선별해 짧게 배치",
      },
    ],
  },
  notes: {
    memoTitle: "진도 조정 / 운영 메모",
    memoSummary: "지난 주 등비수열 심화에 시간이 더 들어 함수 단원을 1회 미뤘고, 이번 주부터는 기출 연결을 더 빠르게 넣는 방향으로 조정합니다.",
    items: [
      {
        title: "계획 조정 메모",
        detail: "수열 심화에서 예상보다 시간이 더 들어 함수 진입이 늦어졌습니다.",
        reason: "지연을 빠르게 잡지 않으면 시험 전 실전 풀이 시간이 부족해집니다.",
      },
      {
        title: "보강 배정 이유",
        detail: "유리화 계산과 그래프 해석이 동시에 흔들려, 계산형과 해석형을 나눠 보강합니다.",
        reason: "한 번에 다 잡기보다 우선순위를 두는 편이 운영상 안정적입니다.",
      },
      {
        title: "다음 조정 예정",
        detail: "3/29 점검 후 함수 단원 진입 여부와 보강 학생 배치를 다시 확인합니다.",
        reason: "시험 전 마지막 2주에는 기출과 오답 위주로만 좁힐 예정입니다.",
      },
    ],
  },
};
