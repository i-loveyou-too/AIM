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

// ── 고1 영어 B반 ──────────────────────────────────────────────────────────────
const englishBData: CurriculumPageData = {
  overview: {
    school: "서울고등학교",
    className: "영어 B반",
    subject: "영어",
    examDate: "4월 20일",
    currentDate: "3월 24일",
    dDay: "D-27",
    remainingLessons: 8,
    totalLessons: 28,
    totalUnits: 20,
    plannedProgress: 65,
    actualProgress: 62,
    planStatus: "순항 중",
    delayUnits: 1,
    reinforcementUnits: 2,
    completionChance: "현재 속도 유지 시 시험 전 완주 가능성 높음",
    currentPlannedPosition: "3단원 3주차",
    currentActualPosition: "3단원 2주차",
    finishEstimate: "4/15 전후",
    nextCheckpoint: "4/1 독해 속도 점검",
  },
  summaryCards: [
    { label: "시험일", value: "4월 20일", note: "기말고사 기준 역산 계획", emoji: "📅", badge: "D-27", tone: "brand" },
    { label: "남은 수업 수", value: "8회", note: "시험 전 실제 확보 가능한 수업", emoji: "🧭", badge: "여유", tone: "success" },
    { label: "전체 진도율", value: "65%", note: "계획상 도달해야 할 기준 진도", emoji: "📈", badge: "계획", tone: "accent" },
    { label: "계획 대비 현재 상태", value: "순항 중", note: "현재 실제 진도는 계획과 거의 동일", emoji: "⏳", badge: "양호", tone: "success" },
    { label: "지연 단원 수", value: "1개", note: "계획보다 늦어진 단원", emoji: "🔁", badge: "경미", tone: "soft" },
    { label: "보강 필요 단원 수", value: "2개", note: "시험 전 우선 처리해야 할 영역", emoji: "🛠️", badge: "보강", tone: "warm" },
    { label: "완주 가능성", value: "높음", note: "현재 속도 유지 기준", emoji: "🎯", badge: "판단", tone: "success" },
    { label: "시험 전 우선 단원", value: "독해 유형", note: "다음 수업부터 우선 투입", emoji: "🚩", badge: "우선", tone: "brand" },
  ],
  reversePlan: {
    totalPeriod: "2024.03.04 ~ 2024.04.20 (7주)",
    totalUnits: 20,
    remainingUnits: 7,
    remainingLessons: 8,
    weeklyTarget: "주당 1단원 + 어휘 테스트 1회",
    algorithmTarget: "현재 계획상 3단원 3주차까지 도달",
    actualTarget: "실제 진도는 3단원 2주차",
    gapSummary: "반 주 지연",
    paceSummary: "전반적으로 계획에 근접하나 독해 속도 향상이 필요합니다.",
    completionEstimate: "4/15 전후",
    focusUnit: "독해 유형",
    nextCheckpoint: "4/1 독해 속도 점검",
  },
  calendar: {
    monthLabel: "3월 → 4월",
    periodLabel: "시험일까지 27일",
    note: "독해·문법·어휘를 균형 있게 배치",
    items: [
      { date: "3/24", label: "오늘", title: "계획 점검", note: "현재 진도와 지연 구간 확인", tone: "today" },
      { date: "3/26", label: "수업", title: "문법 정리", note: "시제·가정법 핵심 정리", tone: "lesson" },
      { date: "3/28", label: "보강", title: "어휘 테스트", note: "고빈도 어휘 점검", tone: "boost" },
      { date: "4/1",  label: "체크", title: "독해 속도 점검", note: "분당 읽기 속도 확인", tone: "check" },
      { date: "4/5",  label: "수업", title: "독해 유형", note: "빈칸·순서 유형 집중", tone: "lesson" },
      { date: "4/10", label: "수업", title: "실전 모의", note: "시험 형식 풀이", tone: "lesson" },
      { date: "4/15", label: "보강", title: "마지막 보강", note: "오답 유형 최종 정리", tone: "boost" },
      { date: "4/20", label: "시험", title: "기말고사", note: "시험일", tone: "exam" },
    ],
  },
  comparison: {
    totalUnits: 20,
    plannedUnits: 13,
    actualUnits: 12,
    plannedPercent: 65,
    actualPercent: 62,
    plannedMilestone: "3단원 3주차",
    actualMilestone: "3단원 2주차",
    goalMilestone: "4월 중순 마무리",
    finishEstimate: "4/15 전후",
    gapSummary: "계획 대비 반 주 지연",
    canFinishBeforeExam: "충분히 가능",
    markers: [
      { label: "계획",     value: "65%",      tone: "soft" },
      { label: "실제",     value: "62%",      tone: "brand" },
      { label: "도달 목표", value: "3단원 3주차", tone: "warm" },
      { label: "마감 예상", value: "4/15",     tone: "accent" },
    ],
  },
  roadmap: [
    {
      title: "문법 핵심 정리",
      period: "3/4 ~ 3/22",
      statusLabel: "거의 완료",
      tone: "success",
      plannedProgress: 90,
      actualProgress: 88,
      lessonNote: "시제·가정법·관계사를 시험 전 완성합니다.",
      assignmentNote: "문법 오답 정리 과제를 기출과 연결합니다.",
      commonMistakeNote: "가정법 시제 혼용이 반복됩니다.",
      reinforcementNote: "가정법 문형 패턴 1회 추가 보강합니다.",
      canFinishBeforeExam: "완료 예정",
      badges: ["거의 완료", "시험 전 정리"],
      subtopics: [
        { title: "시제",   progress: 100, statusLabel: "완료",    note: "기본 확보" },
        { title: "가정법", progress: 85,  statusLabel: "진행 중", note: "문형 자동화 필요" },
        { title: "관계사", progress: 80,  statusLabel: "진행 중", note: "복잡 구조 점검" },
      ],
    },
    {
      title: "독해 유형별 접근",
      period: "3/25 ~ 4/10",
      statusLabel: "진행 중",
      tone: "brand",
      plannedProgress: 50,
      actualProgress: 45,
      lessonNote: "빈칸·순서·요지 유형을 반복 연습합니다.",
      assignmentNote: "독해 기출 1세트를 매 수업 연결합니다.",
      commonMistakeNote: "빈칸 유형에서 문맥 파악 속도가 느립니다.",
      reinforcementNote: "문장 흐름 파악 훈련을 추가합니다.",
      canFinishBeforeExam: "가능",
      badges: ["보강 필요", "핵심 유형"],
      subtopics: [
        { title: "빈칸 추론", progress: 55, statusLabel: "진행 중",    note: "속도 향상 필요" },
        { title: "순서·삽입", progress: 45, statusLabel: "보강 필요", note: "흐름 파악 강화" },
        { title: "요지·주제", progress: 50, statusLabel: "진행 중",    note: "선택지 분별 연습" },
      ],
    },
    {
      title: "어휘·표현 완성",
      period: "4/11 ~ 4/18",
      statusLabel: "예정",
      tone: "soft",
      plannedProgress: 20,
      actualProgress: 15,
      lessonNote: "고빈도 어휘와 숙어를 마지막에 점검합니다.",
      assignmentNote: "어휘 테스트 2회로 마무리합니다.",
      commonMistakeNote: "아직 큰 오답 패턴 없음.",
      reinforcementNote: "시험 직전 고빈도 어휘만 선별합니다.",
      canFinishBeforeExam: "예정",
      badges: ["예정", "마무리"],
      subtopics: [
        { title: "고빈도 어휘", progress: 25, statusLabel: "예정", note: "목록 준비 중" },
        { title: "숙어·표현",   progress: 15, statusLabel: "예정", note: "시험 직전 배치" },
        { title: "실전 적용",   progress: 10, statusLabel: "예정", note: "모의 문항 연결" },
      ],
    },
  ],
  nextActions: {
    nextUnit: "독해 유형별 접근 — 빈칸 추론과 순서 배열",
    objective: "문법 완성 후 독해 유형으로 빠르게 전환합니다.",
    keyConcepts: ["문맥 흐름 파악", "빈칸 전후 단서 찾기", "순서 배열 연결어 활용"],
    homeworkReflection: [
      "지난 과제에서 가정법 시제 혼용이 있었는지 먼저 확인",
      "독해 속도보다 정확도 우선으로 유도",
      "오답 선택 이유를 학생이 직접 설명하게 하기",
    ],
    commonMistakes: [
      "빈칸 전후 문장을 충분히 읽지 않고 선택",
      "순서 배열에서 연결어 무시",
      "어휘 몰라서 추측으로 답하는 습관",
    ],
    reinforcementTargets: ["김지수 · 영어 B반", "오민준 · 영어 B반", "빈칸 유형 미흡 학생 2명"],
    preClassChecks: ["문법 오답 과제 회수 확인", "독해 기출 자료 준비", "어휘 테스트지 출력"],
    buttons: ["계획 조정", "보강 배정", "다음 수업 보기"],
  },
  risks: {
    highestRisk: "김지수 · 영어 B반",
    summary: "독해 속도가 느려 시험 시간 내 풀이 완료가 어려울 수 있어, 빈칸 유형 집중 연습을 먼저 배치합니다.",
    items: [
      { title: "독해 속도",    reason: "빈칸 유형에서 문맥 파악이 느립니다.", target: "김지수 · 영어 B반", severity: "높음", nextStep: "독해 기출 타이머 풀이 1회 추가" },
      { title: "가정법 정확도", reason: "시제 혼용이 반복됩니다.",               target: "오민준 · 영어 B반", severity: "중간", nextStep: "가정법 패턴 카드 제공" },
      { title: "어휘 부족",    reason: "고빈도 어휘 암기가 충분하지 않습니다.", target: "영어 B반 전체",     severity: "낮음", nextStep: "주 2회 어휘 퀴즈 유지" },
    ],
  },
  notes: {
    memoTitle: "진도 조정 / 운영 메모",
    memoSummary: "문법 단원이 예상보다 빠르게 마무리되어 독해 유형 진입을 1주 앞당겼습니다.",
    items: [
      { title: "계획 조정 메모", detail: "문법 단원 완성 속도가 빨라 독해 진입을 앞당겼습니다.",       reason: "시험 전 독해 유형 반복 횟수를 늘리기 위함입니다." },
      { title: "보강 배정 이유", detail: "빈칸 추론과 순서 배열을 분리해 각각 보강합니다.",           reason: "유형별로 접근법이 달라 함께 보강하면 혼란이 생깁니다." },
      { title: "다음 조정 예정", detail: "4/1 독해 속도 점검 후 기출 비중을 조정합니다.",             reason: "시험 2주 전부터는 실전 형식 위주로만 운영할 예정입니다." },
    ],
  },
};

// ── 고2 수학 B반 ──────────────────────────────────────────────────────────────
const mathBData: CurriculumPageData = {
  overview: {
    school: "서울고등학교",
    className: "수학 B반",
    subject: "수학",
    examDate: "4월 15일",
    currentDate: "3월 24일",
    dDay: "D-22",
    remainingLessons: 7,
    totalLessons: 26,
    totalUnits: 22,
    plannedProgress: 68,
    actualProgress: 55,
    planStatus: "지연 주의",
    delayUnits: 3,
    reinforcementUnits: 4,
    completionChance: "현재 속도로는 완주 어려움 — 속도 조정 필요",
    currentPlannedPosition: "4단원 1주차",
    currentActualPosition: "3단원 초반",
    finishEstimate: "4/13 이후",
    nextCheckpoint: "3/28 미적분 기초 속도 점검",
  },
  summaryCards: [
    { label: "시험일",           value: "4월 15일",  note: "기말고사 기준 역산 계획",         emoji: "📅", badge: "D-22", tone: "brand" },
    { label: "남은 수업 수",     value: "7회",       note: "시험 전 실제 확보 가능한 수업",   emoji: "🧭", badge: "촉박", tone: "alert" },
    { label: "전체 진도율",       value: "68%",       note: "계획상 도달해야 할 기준 진도",    emoji: "📈", badge: "계획", tone: "accent" },
    { label: "계획 대비 현재 상태", value: "지연 주의", note: "실제 진도가 계획보다 2주 늦음",  emoji: "⏳", badge: "위험", tone: "alert" },
    { label: "지연 단원 수",      value: "3개",       note: "계획보다 늦어진 단원",             emoji: "🔁", badge: "지연", tone: "alert" },
    { label: "보강 필요 단원 수", value: "4개",       note: "시험 전 우선 처리해야 할 영역",   emoji: "🛠️", badge: "보강", tone: "warm" },
    { label: "완주 가능성",       value: "낮음",      note: "현재 속도 유지 기준",             emoji: "🎯", badge: "판단", tone: "alert" },
    { label: "시험 전 우선 단원", value: "미적분 기초", note: "다음 수업부터 최우선 투입",    emoji: "🚩", badge: "긴급", tone: "alert" },
  ],
  reversePlan: {
    totalPeriod: "2024.02.26 ~ 2024.04.15 (7주)",
    totalUnits: 22,
    remainingUnits: 10,
    remainingLessons: 7,
    weeklyTarget: "주당 1.5단원 + 보강 필수",
    algorithmTarget: "현재 계획상 4단원 1주차까지 도달",
    actualTarget: "실제 진도는 3단원 초반",
    gapSummary: "2주 지연",
    paceSummary: "속도를 높이지 않으면 시험 전 완주가 어렵습니다. 보강 횟수를 줄이고 진도에 집중해야 합니다.",
    completionEstimate: "4/13 이후",
    focusUnit: "미적분 기초",
    nextCheckpoint: "3/28 미적분 기초 속도 점검",
  },
  calendar: {
    monthLabel: "3월 → 4월",
    periodLabel: "시험일까지 22일",
    note: "지연 단원 해소를 최우선으로 배치",
    items: [
      { date: "3/24", label: "오늘", title: "계획 점검",   note: "현재 진도와 지연 구간 확인",  tone: "today" },
      { date: "3/25", label: "수업", title: "미적분 기초",  note: "극한·미분 핵심 개념",         tone: "lesson" },
      { date: "3/27", label: "보강", title: "적분 보강",    note: "계산 절차 집중",              tone: "boost" },
      { date: "3/28", label: "체크", title: "속도 점검",    note: "진도 만회 가능 여부 확인",    tone: "check" },
      { date: "4/1",  label: "수업", title: "통계 기초",    note: "확률 분포 진입",              tone: "lesson" },
      { date: "4/7",  label: "수업", title: "실전 풀이",    note: "기출 기반 실전 연습",         tone: "lesson" },
      { date: "4/12", label: "보강", title: "마지막 보강",  note: "최우선 단원 집중",            tone: "boost" },
      { date: "4/15", label: "시험", title: "기말고사",     note: "시험일",                      tone: "exam" },
    ],
  },
  comparison: {
    totalUnits: 22,
    plannedUnits: 15,
    actualUnits: 12,
    plannedPercent: 68,
    actualPercent: 55,
    plannedMilestone: "4단원 1주차",
    actualMilestone: "3단원 초반",
    goalMilestone: "4월 초 마무리",
    finishEstimate: "4/13 이후",
    gapSummary: "계획 대비 2주 지연",
    canFinishBeforeExam: "속도 조정 필요",
    markers: [
      { label: "계획",     value: "68%",       tone: "soft" },
      { label: "실제",     value: "55%",       tone: "alert" },
      { label: "도달 목표", value: "4단원 1주차", tone: "warm" },
      { label: "마감 예상", value: "4/13+",     tone: "alert" },
    ],
  },
  roadmap: [
    {
      title: "미적분 기초",
      period: "3/18 ~ 4/1",
      statusLabel: "지연",
      tone: "alert",
      plannedProgress: 60,
      actualProgress: 38,
      lessonNote: "극한과 미분 개념을 빠르게 완성해야 합니다.",
      assignmentNote: "미분 계산 기출을 매 수업 연결합니다.",
      commonMistakeNote: "적분 부호와 계산 절차 오류가 많습니다.",
      reinforcementNote: "적분 계산 자동화를 1회 추가 보강합니다.",
      canFinishBeforeExam: "속도 필요",
      badges: ["지연", "긴급 처리"],
      subtopics: [
        { title: "극한·미분", progress: 55, statusLabel: "진행 중",    note: "개념 재확인 필요" },
        { title: "적분 기초", progress: 35, statusLabel: "보강 필요", note: "계산 절차 오류" },
        { title: "실전 적용", progress: 20, statusLabel: "지연",       note: "문항 연결 필요" },
      ],
    },
    {
      title: "확률과 통계",
      period: "4/2 ~ 4/10",
      statusLabel: "예정",
      tone: "warm",
      plannedProgress: 30,
      actualProgress: 18,
      lessonNote: "확률 분포와 통계 기초를 빠르게 훑습니다.",
      assignmentNote: "통계 기출 핵심 유형만 선별합니다.",
      commonMistakeNote: "조합과 확률 개념 혼용이 예상됩니다.",
      reinforcementNote: "조합·순열 구분 1회 정리합니다.",
      canFinishBeforeExam: "가능",
      badges: ["예정", "핵심만"],
      subtopics: [
        { title: "경우의 수", progress: 30, statusLabel: "예정", note: "개념 진입 전" },
        { title: "확률 분포", progress: 15, statusLabel: "예정", note: "기출 선별 필요" },
        { title: "통계 추정", progress: 10, statusLabel: "예정", note: "시험 직전 배치" },
      ],
    },
    {
      title: "실전 마무리",
      period: "4/11 ~ 4/14",
      statusLabel: "예정",
      tone: "soft",
      plannedProgress: 15,
      actualProgress: 5,
      lessonNote: "기출 실전 풀이로 마무리합니다.",
      assignmentNote: "기출 2회 오답 정리로 마감합니다.",
      commonMistakeNote: "아직 진입 전.",
      reinforcementNote: "핵심 문제만 선별합니다.",
      canFinishBeforeExam: "예정",
      badges: ["예정", "실전"],
      subtopics: [
        { title: "기출 실전", progress: 10, statusLabel: "예정", note: "시험 직전" },
        { title: "오답 정리", progress: 5,  statusLabel: "예정", note: "마무리" },
        { title: "최종 점검", progress: 0,  statusLabel: "예정", note: "시험 전날" },
      ],
    },
  ],
  nextActions: {
    nextUnit: "미적분 기초 — 적분 계산 집중",
    objective: "지연된 미적분 기초를 빠르게 완성합니다.",
    keyConcepts: ["미분·적분 계산 절차", "극한값 계산 자동화", "기출 문항 유형 파악"],
    homeworkReflection: [
      "적분 부호 오류 패턴 우선 확인",
      "계산 과정 생략 없이 서술하게 유도",
      "기출 풀이 속도보다 정확도 먼저",
    ],
    commonMistakes: [
      "적분 계산에서 부호 실수 반복",
      "미분과 적분 공식 혼용",
      "문항 읽기 시간 부족",
    ],
    reinforcementTargets: ["최현우 · 수학 B반", "강나연 · 수학 B반", "적분 기초 미흡 학생 3명"],
    preClassChecks: ["미분 기출 과제 회수 확인", "적분 계산 자료 준비", "지연 학생 출결 확인"],
    buttons: ["계획 조정", "보강 배정", "다음 수업 보기"],
  },
  risks: {
    highestRisk: "최현우 · 수학 B반",
    summary: "전체적으로 진도가 2주 지연되어 있어, 미적분 기초 완성이 시험 결과에 직결됩니다.",
    items: [
      { title: "미적분 기초 지연", reason: "진도가 계획보다 2주 밀려 있습니다.",              target: "수학 B반 전체",    severity: "높음", nextStep: "다음 3회 수업을 미적분 집중으로 배치" },
      { title: "적분 계산 오류",   reason: "부호와 절차 실수가 반복됩니다.",                  target: "최현우 · 수학 B반", severity: "높음", nextStep: "적분 보강 문제 10개 추가" },
      { title: "통계 진입 시간 부족", reason: "미적분 지연으로 통계 학습 시간이 줄어듭니다.", target: "수학 B반 전체",    severity: "중간", nextStep: "통계는 핵심 유형만 선별 운영" },
      { title: "실전 모의 부족",   reason: "기출 풀이 횟수가 부족합니다.",                    target: "강나연 · 수학 B반", severity: "중간", nextStep: "4/7 실전 모의 필수 배치" },
    ],
  },
  notes: {
    memoTitle: "진도 조정 / 운영 메모",
    memoSummary: "B반은 A반보다 전반적으로 개념 이해 속도가 느려 보강 횟수를 줄이고 진도를 우선하는 방향으로 운영 방침을 바꿨습니다.",
    items: [
      { title: "운영 방침 변경", detail: "보강을 줄이고 진도 완주를 최우선으로 전환했습니다.",    reason: "완주가 안 되면 시험 범위 자체가 빠지기 때문입니다." },
      { title: "보강 배정 기준", detail: "적분 계산 오류가 있는 학생 2명만 별도 보강합니다.",     reason: "전체 보강보다 개인별 맞춤이 더 효율적입니다." },
      { title: "다음 조정 예정", detail: "3/28 속도 점검 후 통계 단원 비중을 최종 결정합니다.", reason: "미적분 완성 여부에 따라 통계 배분이 달라집니다." },
    ],
  },
};

// 클래스 목록 (셀렉터에서 사용)
export const curriculumClasses: {
  id: string;
  label: string;
  grade: string;
  subject: string;
  data: CurriculumPageData;
}[] = [
  { id: "math-a",    label: "수학 A반", grade: "고2", subject: "수학", data: curriculumPageData },
  { id: "english-b", label: "영어 B반", grade: "고1", subject: "영어", data: englishBData },
  { id: "math-b",    label: "수학 B반", grade: "고2", subject: "수학", data: mathBData },
];
