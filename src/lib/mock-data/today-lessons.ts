// 오늘 수업 운영 페이지 목업 데이터
// 교사가 수업 전·중·후 흐름 전체를 한 화면에서 파악할 수 있도록 구성

export const todayLessonsSummary = {
  totalLessons: 5,
  focusStudents: 3,
  homeworkIssues: 4,
  teachingPoints: 9,
  examImminentStudents: 2,
};

// ─── 오늘 수업 일정 ───────────────────────────────────────────
export type LessonStatus = "집중 관리" | "정상" | "보강 필요" | "시험 임박";

export type LessonScheduleItem = {
  id: string;
  time: string;
  studentName: string;
  grade: string;
  subject: string;
  lessonType: string;
  todayGoal: string;
  examDate: string;
  dDay: string;
  status: LessonStatus;
};

export const todaySchedule: LessonScheduleItem[] = [
  {
    id: "lesson-1",
    time: "14:00 – 15:30",
    studentName: "박서연",
    grade: "고2",
    subject: "수학",
    lessonType: "1:1 개인",
    todayGoal: "수열 극한 핵심 개념 완성",
    examDate: "2024-04-12",
    dDay: "D-19",
    status: "시험 임박",
  },
  {
    id: "lesson-2",
    time: "16:00 – 17:30",
    studentName: "이준혁",
    grade: "고1",
    subject: "영어",
    lessonType: "1:1 개인",
    todayGoal: "빈칸추론 유형 집중 훈련",
    examDate: "2024-04-25",
    dDay: "D-32",
    status: "집중 관리",
  },
  {
    id: "lesson-3",
    time: "18:00 – 19:30",
    studentName: "수능 대비반 A",
    grade: "고3",
    subject: "국어",
    lessonType: "그룹 (3명)",
    todayGoal: "비문학 추론형 문제 풀이 전략",
    examDate: "2024-11-14",
    dDay: "D-234",
    status: "정상",
  },
  {
    id: "lesson-4",
    time: "20:00 – 21:00",
    studentName: "김도윤",
    grade: "중3",
    subject: "수학",
    lessonType: "1:1 개인",
    todayGoal: "이차방정식 판별식 개념 정리",
    examDate: "2024-04-17",
    dDay: "D-24",
    status: "보강 필요",
  },
  {
    id: "lesson-5",
    time: "21:00 – 22:00",
    studentName: "최아영",
    grade: "고2",
    subject: "화학",
    lessonType: "1:1 개인",
    todayGoal: "산화-환원 반응 반쪽 반응식 적용",
    examDate: "2024-04-12",
    dDay: "D-19",
    status: "시험 임박",
  },
];

// ─── 수업별 상세 준비 카드 ─────────────────────────────────────
export type HomeworkStatus = "완료" | "미완료" | "부분 완료";
export type AchievementLevel = "우수" | "보통" | "미흡";

export type LessonPrep = {
  id: string;
  // 기본 정보
  studentName: string;
  grade: string;
  subject: string;
  time: string;
  examDate: string;
  dDay: string;
  recentAchievement: AchievementLevel;
  status: LessonStatus;

  // 오늘 수업 진도
  progress: {
    todayUnit: string;
    curriculumPosition: string; // ex. "전체 커리큘럼 중 62% 진행"
    completedRange: string;
    targetRange: string;
    planComparison: string; // ex. "계획 대비 1주 지연"
    isDelayed: boolean;
    delayNote?: string;
  };

  // 오늘 설명할 내용
  explanation: {
    keyConcepts: string[];
    confusionPoints: string[];
    conceptType: string; // ex. "개념형 + 문풀 적용형"
    misconceptions: string[];
  };

  // 자료 / 리소스
  materials: {
    mainTextbook: string;
    workbooks: string[];
    printouts: string[];
    priorityTag: string;
  };

  // 학생 약점
  weaknesses: {
    weakUnits: string[];
    repeatMistakes: string[];
    attentionPoints: string[];
    todayFocusCheck: string[];
  };

  // 숙제 반영
  homework: {
    status: HomeworkStatus;
    completionRate: number;
    errorTendencies: string[];
    reflectionPoints: string[];
    homeworkBasedExplanation: string[];
    warning?: string;
  };

  // 수업 운영 메모
  lessonMemo: {
    preClassCheck: string[];
    questionPrompts: string[];
    postClassNote: string;
    nextLessonConnection: string;
  };
};

export const todayLessonsPrep: LessonPrep[] = [
  // ── 박서연 ──
  {
    id: "lesson-1",
    studentName: "박서연",
    grade: "고2",
    subject: "수학",
    time: "14:00 – 15:30",
    examDate: "2024-04-12",
    dDay: "D-19",
    recentAchievement: "보통",
    status: "시험 임박",

    progress: {
      todayUnit: "수열의 극한 — 극한값 계산 & 수렴·발산 판별",
      curriculumPosition: "전체 커리큘럼 중 68% 완료",
      completedRange: "수열 정의 → 등차/등비 수열 → 점화식까지 완료",
      targetRange: "오늘 수업 후: 극한의 정의 + 기본 극한값 계산까지",
      planComparison: "계획 대비 3일 지연",
      isDelayed: true,
      delayNote: "지난 주 등비수열 심화 문제에서 시간이 예상보다 더 걸렸음",
    },

    explanation: {
      keyConcepts: [
        "수열의 극한 정의 (lim 기호와 ε-δ 논법 간략 버전)",
        "발산·수렴 판별 기준",
        "∞/∞ 꼴 극한값 계산 — 최고차항으로 나누기",
        "극한의 기본 성질 4가지",
      ],
      confusionPoints: [
        "∞ - ∞ 꼴을 유리화해야 한다는 것을 자꾸 놓침",
        "극한이 '존재한다'는 의미와 값이 '0'이라는 의미를 혼동함",
      ],
      conceptType: "개념 정의형 + 계산 적용형",
      misconceptions: [
        "lim(n→∞) 1/n = 0 을 1/∞ = 0 으로 암기해버리는 패턴",
        "발산과 진동을 같은 것으로 혼용",
      ],
    },

    materials: {
      mainTextbook: "수학의 정석 수학Ⅱ (개정판)",
      workbooks: ["EBS 수능특강 수학Ⅱ p.88–102", "기출문제 프린트 #14"],
      printouts: ["극한값 계산 유형별 정리표 (자체 제작)", "수렴·발산 판별 체크리스트"],
      priorityTag: "기출문제 프린트 #14 — 오늘 꼭 사용",
    },

    weaknesses: {
      weakUnits: ["수열의 극한", "등비급수 (이전 단원)", "로그함수 연계 문제"],
      repeatMistakes: [
        "분모 유리화 단계 생략",
        "부등식 방향 실수 (음수 곱할 때 방향 전환 누락)",
        "치환 후 치환 변수 범위 재설정 빠뜨림",
      ],
      attentionPoints: [
        "개념은 이해했지만 문풀 시 공식 적용 순서 혼동",
        "풀이 과정 중 자신감이 낮아지면 바로 질문 포기 — 유도 필요",
      ],
      todayFocusCheck: [
        "∞/∞ 꼴 문제 직접 풀어보게 하기",
        "발산 판별 과정을 말로 설명시켜보기",
      ],
    },

    homework: {
      status: "부분 완료",
      completionRate: 65,
      errorTendencies: [
        "극한값 계산 문제 중 분수형 5문제 중 3문제 오답",
        "수렴 조건 서술형에서 논리 전개 불완전",
      ],
      reflectionPoints: [
        "분수형 극한 문제 → 오늘 수업 도입부에 다시 짚기",
        "서술형 오답 → 채점 기준 같이 검토 후 다시 써보게 하기",
      ],
      homeworkBasedExplanation: [
        "숙제 오답 3문제를 오늘 수업 워밍업으로 활용",
        "틀린 이유를 학생이 직접 말하게 유도 → 개념 재확인",
      ],
      warning: "숙제 완료율 65% — 미완료 부분은 이번 주 안에 추가 제출 유도 필요",
    },

    lessonMemo: {
      preClassCheck: [
        "숙제 오답 패턴 미리 파악 후 설명 순서 조정",
        "극한값 계산 예제 3개 칠판에 미리 써두기",
        "오늘 시험 범위 재확인 — 극한이 출제 비중 높음",
      ],
      questionPrompts: [
        '"이 식을 왜 최고차항으로 나눴어요?" — 원리 확인',
        '"발산이라는 걸 어떻게 보여줄 수 있어요?" — 서술 연습',
        '"똑같은 실수를 지난 번에도 했는데, 이번엔 어떻게 피할 거예요?"',
      ],
      postClassNote: "오늘 이해도 / 집중도 / 숙제 의지 간단히 기록 예정",
      nextLessonConnection: "다음 수업: 등비급수 심화 + 급수의 수렴 조건 — 오늘 개념과 직결",
    },
  },

  // ── 이준혁 ──
  {
    id: "lesson-2",
    studentName: "이준혁",
    grade: "고1",
    subject: "영어",
    time: "16:00 – 17:30",
    examDate: "2024-04-25",
    dDay: "D-32",
    recentAchievement: "미흡",
    status: "집중 관리",

    progress: {
      todayUnit: "빈칸추론 — 연결어 기반 빈칸 + 논리 흐름 파악형",
      curriculumPosition: "전체 커리큘럼 중 55% 완료",
      completedRange: "어법 → 어휘 → 주제·제목 → 함의 추론까지 완료",
      targetRange: "오늘 수업 후: 빈칸추론 기본 유형 전략 정립",
      planComparison: "계획 일치",
      isDelayed: false,
    },

    explanation: {
      keyConcepts: [
        "빈칸 위치별 접근 전략 (앞·중간·끝 위치 차이)",
        "연결어(Therefore, However, In other words)로 흐름 파악",
        "함정 선지 패턴 — 지엽적 단어 반복 선지 피하기",
        "글의 중심 소재와 빈칸의 관계 파악",
      ],
      confusionPoints: [
        "연결어를 보고도 앞뒤 논리 방향을 반대로 읽는 경향",
        "선지를 먼저 읽고 본문을 끼워맞추는 잘못된 풀이 순서",
      ],
      conceptType: "전략형 + 독해 흐름형",
      misconceptions: [
        "빈칸 앞 문장 하나만 읽고 답 고르는 패턴",
        "'Therefore'가 있으면 무조건 정리·결론이라고 판단하는 과단순화",
      ],
    },

    materials: {
      mainTextbook: "수능특강 영어독해 (고1 과정)",
      workbooks: ["빈칸추론 유형 기출 모음 (2019–2023) p.12–28", "자체 제작 연결어 정리 프린트"],
      printouts: ["빈칸추론 5단계 풀이법 요약표", "함정 선지 유형 분석 시트"],
      priorityTag: "함정 선지 유형 분석 시트 — 오늘 핵심 자료",
    },

    weaknesses: {
      weakUnits: ["빈칸추론", "논리 흐름 추론", "함의 추론 (이전 단원)"],
      repeatMistakes: [
        "본문 전체를 읽지 않고 빈칸 주변 2문장만 읽고 선택",
        "어려운 어휘를 만나면 문장 전체를 건너뜀",
        "시간 부족으로 검토 없이 제출",
      ],
      attentionPoints: [
        "읽기 속도 자체는 빠르지만 정확도가 낮음 — 속도보다 정확도 우선 훈련 필요",
        "틀렸을 때 이유를 '모르겠어요'로 종결 — 이유 찾기 습관 만들어야 함",
      ],
      todayFocusCheck: [
        "연결어 체크 → 논리 방향 말로 설명시키기",
        "함정 선지를 고른 경우 왜 함정인지 분석하게 유도",
      ],
    },

    homework: {
      status: "완료",
      completionRate: 100,
      errorTendencies: [
        "빈칸추론 8문제 중 5문제 오답 (62.5% 오답률)",
        "오답 패턴: 선지 중 본문 단어가 그대로 사용된 선지 선택",
      ],
      reflectionPoints: [
        "함정 선지 패턴이 정확히 이번 약점과 일치 → 오늘 집중 설명",
        "오답 5문제 오늘 수업에서 같이 복기",
      ],
      homeworkBasedExplanation: [
        "숙제 오답 5문제 → '왜 틀렸는지' 학생이 먼저 말하게 하기",
        "함정 선지 선택 패턴 → 함정 선지 특징 명시적으로 설명",
      ],
    },

    lessonMemo: {
      preClassCheck: [
        "숙제 오답 5문제 미리 정리해두기",
        "함정 선지 유형 분석 시트 인쇄 확인",
        "오늘 실전 문제 3개 (고난도 빈칸) 예비 선정",
      ],
      questionPrompts: [
        '"이 선지를 고른 이유가 뭐예요? 본문 어디서 힌트를 찾았어요?"',
        '"연결어가 있는데 앞 문장이랑 뒷 문장이 같은 방향이에요, 반대 방향이에요?"',
        '"이 문제에서 함정 선지는 어떤 것 같아요?"',
      ],
      postClassNote: "빈칸추론 이해도 + 자신감 변화 기록 예정",
      nextLessonConnection: "다음 수업: 글의 순서 배열 유형 — 논리 흐름 파악 역량 연계",
    },
  },

  // ── 수능 대비반 A (그룹) ──
  {
    id: "lesson-3",
    studentName: "수능 대비반 A",
    grade: "고3",
    subject: "국어",
    time: "18:00 – 19:30",
    examDate: "2024-11-14",
    dDay: "D-234",
    recentAchievement: "우수",
    status: "정상",

    progress: {
      todayUnit: "비문학 독해 — 과학·기술 지문 추론형 문제 전략",
      curriculumPosition: "수능 대비 커리큘럼 중 48% 완료",
      completedRange: "문학 전 갈래 → 비문학 사회·경제 지문까지 완료",
      targetRange: "오늘 수업 후: 과학·기술 지문 추론형 3가지 유형 전략 확립",
      planComparison: "계획 일치",
      isDelayed: false,
    },

    explanation: {
      keyConcepts: [
        "과학·기술 지문의 정보 구조 파악 (개념 정의 → 원리 → 적용)",
        "추론형 문제: '사실 확인'과 '추론 판단' 구별",
        "수치·비교 정보 체계적으로 정리하며 읽기",
        "선지 판단 시 지문 근거 반드시 확인하는 습관",
      ],
      confusionPoints: [
        "지문에 없는 내용인지, 있는데 틀린 내용인지 구분 어려워함",
        "수치가 많이 나오면 도식화 없이 넘어가려는 경향",
      ],
      conceptType: "독해 전략형 + 문제 풀이 기술형",
      misconceptions: [
        "추론은 '상상'이라고 생각 — 지문 근거 기반 추론임을 재확인 필요",
        "어려운 과학 배경지식이 없으면 못 푼다는 심리적 장벽",
      ],
    },

    materials: {
      mainTextbook: "수능 국어 비문학 실전 모의고사 (2024 수시)",
      workbooks: ["기출 과학 지문 모음 (2020–2023 수능)", "비문학 독해 전략 정리 노트"],
      printouts: ["오늘 실전 지문 2개 (과학·기술 분야)", "추론형 문제 유형 분류표"],
      priorityTag: "실전 지문 2개 프린트 — 오늘 메인",
    },

    weaknesses: {
      weakUnits: ["추론형 비문학 문제", "수치 포함 지문 정리", "빠른 독해 시 정보 누락"],
      repeatMistakes: [
        "지문 2회독 없이 문제 바로 풀기 시작 → 정보 누락",
        "선지 판단 시 '느낌'으로 결정 → 지문 재확인 생략",
      ],
      attentionPoints: [
        "3명 중 1명(정현우)이 수치 포함 지문에서 특히 약함 — 별도 확인 필요",
        "그룹 수업이라 개별 약점 파악 후 분리 설명 전략 필요",
      ],
      todayFocusCheck: [
        "정현우: 수치 정보 도식화 습관 오늘 특별 체크",
        "전원: 선지 판단 시 지문 근거 찾는 과정 말로 설명시키기",
      ],
    },

    homework: {
      status: "완료",
      completionRate: 95,
      errorTendencies: [
        "추론형 문제 정답률 67% (평균 목표 80%에 미달)",
        "틀린 문제 대부분: 근거 없는 선지 판단",
      ],
      reflectionPoints: [
        "오답 경향 → 오늘 '근거 없는 판단 방지' 전략 강조",
        "완료율 95%는 양호 — 학습 의지 긍정 피드백 필요",
      ],
      homeworkBasedExplanation: [
        "숙제 오답 중 공통 오답 2문제 → 오늘 수업 도입에서 같이 분석",
        "왜 근거 없이 판단했는지 → 선지 판단 프로세스 명시화",
      ],
    },

    lessonMemo: {
      preClassCheck: [
        "오늘 실전 지문 2개 프린트 인원수(3명) 맞게 준비",
        "정현우 개별 약점 — 수치 도식화 예시 칠판에 미리 준비",
        "그룹 내 개별 성취 차이 감안해 질문 분배 계획",
      ],
      questionPrompts: [
        '"이 선지가 맞다고 생각한 이유를 지문에서 찾아줄 수 있어요?"',
        '"수치가 3개 나왔는데 어떻게 정리하면서 읽었어요?"',
        '"추론이 가능하려면 지문에 어떤 근거가 있어야 해요?"',
      ],
      postClassNote: "3명 개별 이해도 + 정현우 수치 처리 습관 변화 기록",
      nextLessonConnection: "다음 수업: 인문·예술 지문 — 추상 개념 다루는 독해 전략",
    },
  },
];

// ─── 약점 집중 관리 학생 개요 ──────────────────────────────────
export const weaknessOverview = [
  {
    studentName: "이준혁",
    grade: "고1",
    subject: "영어",
    focusReason: "빈칸추론 오답률 62% — 전략 재정립 필요",
    overlappingWeakness: "논리 흐름 파악, 함의 추론",
    action: "오늘 집중 설명 + 함정 선지 분석",
    urgency: "높음" as const,
  },
  {
    studentName: "박서연",
    grade: "고2",
    subject: "수학",
    focusReason: "시험 D-19, 숙제 완료율 65%",
    overlappingWeakness: "분수형 극한 계산, 수렴 서술",
    action: "숙제 오답 복기 + 시험 출제 예상 유형 집중",
    urgency: "높음" as const,
  },
  {
    studentName: "김도윤",
    grade: "중3",
    subject: "수학",
    focusReason: "판별식 개념 혼동 반복, 보강 필요 상태",
    overlappingWeakness: "이차방정식 풀이, 근의 공식 적용",
    action: "개념 재확인 후 기초 문제 충분히 연습",
    urgency: "중간" as const,
  },
];

// ─── 숙제 반영 개요 ────────────────────────────────────────────
export const homeworkReflection = {
  criticalItems: [
    {
      studentName: "박서연",
      subject: "수학",
      issue: "분수형 극한 3문제 오답 — 오늘 수업 도입에 반드시 반영",
      actionRequired: "오답 복기 후 유사 문제 재풀이",
    },
    {
      studentName: "이준혁",
      subject: "영어",
      issue: "빈칸추론 5문제 오답 — 함정 선지 패턴 집중 분석 필요",
      actionRequired: "오답 원인 분석 + 선지 판단 기준 명시화",
    },
  ],
  incompleteHomework: [
    { studentName: "박서연", completionRate: 65, subject: "수학" },
    { studentName: "최아영", completionRate: 80, subject: "화학" },
  ],
  commonReExplanation: [
    "분수형 극한값 계산 — 박서연, 김도윤 공통 약점",
    "추론형 문제의 지문 근거 판단 프로세스 — 이준혁, 수능 대비반 공통",
  ],
  reinforcementNeeded: [
    "극한 수렴·발산 판별 서술 방법 (박서연)",
    "빈칸추론 함정 선지 유형 (이준혁)",
    "산화-환원 반응 반쪽 반응식 균형 (최아영)",
  ],
};

// ─── 오늘 사용할 자료 ──────────────────────────────────────────
export const todayMaterials = [
  {
    id: "mat-1",
    title: "수학의 정석 수학Ⅱ (개정판)",
    type: "교재" as const,
    subject: "수학",
    student: "박서연",
    priority: "필수" as const,
    note: "p.215–228 수열의 극한 단원",
  },
  {
    id: "mat-2",
    title: "극한값 계산 유형별 정리표",
    type: "프린트" as const,
    subject: "수학",
    student: "박서연",
    priority: "필수" as const,
    note: "자체 제작 — 오늘 핵심 자료",
  },
  {
    id: "mat-3",
    title: "기출문제 프린트 #14",
    type: "프린트" as const,
    subject: "수학",
    student: "박서연",
    priority: "필수" as const,
    note: "2020–2023 수능 극한 기출 모음",
  },
  {
    id: "mat-4",
    title: "함정 선지 유형 분석 시트",
    type: "프린트" as const,
    subject: "영어",
    student: "이준혁",
    priority: "필수" as const,
    note: "오늘 빈칸추론 핵심 자료",
  },
  {
    id: "mat-5",
    title: "빈칸추론 5단계 풀이법 요약표",
    type: "정리표" as const,
    subject: "영어",
    student: "이준혁",
    priority: "참고" as const,
    note: "수업 중 칠판에 붙여두기",
  },
  {
    id: "mat-6",
    title: "비문학 실전 지문 2개 (과학·기술)",
    type: "프린트" as const,
    subject: "국어",
    student: "수능 대비반 A",
    priority: "필수" as const,
    note: "3부 출력 완료 확인 필요",
  },
  {
    id: "mat-7",
    title: "추론형 문제 유형 분류표",
    type: "정리표" as const,
    subject: "국어",
    student: "수능 대비반 A",
    priority: "참고" as const,
    note: "그룹 수업 칠판 판서용",
  },
];

// ─── 수업별 다음 액션 ──────────────────────────────────────────
export type LessonNextActions = {
  lessonId: string;
  studentName: string;
  beforeClass: string[];
  duringClass: string[];
  afterClass: string[];
  nextLessonPrep: string[];
};

export const lessonNextActions: LessonNextActions[] = [
  {
    lessonId: "lesson-1",
    studentName: "박서연",
    beforeClass: [
      "숙제 오답 5문제 패턴 정리 후 도입 설명 순서 조정",
      "극한값 계산 예제 3개 칠판에 미리 써두기",
      "오늘 시험 범위 재확인 — 극한이 출제 비중 높음",
    ],
    duringClass: [
      "극한값 계산 과정을 말로 설명하게 유도 — 개념 내재화 확인",
      "∞/∞ 꼴 문제 직접 풀어보게 하기",
      "발산 판별 과정을 말로 설명시켜보기",
      '"똑같은 실수를 이번엔 어떻게 피할 거예요?" 질문 유도',
    ],
    afterClass: [
      "오늘 이해도·집중도 간단히 기록 (1–5점)",
      "숙제 완료율 65% — 이번 주 추가 제출 기한 안내",
      "극한 수렴·발산 판별 이해 여부 메모",
    ],
    nextLessonPrep: [
      "등비급수 심화 + 급수 수렴 조건 준비",
      "오늘 오답 기반 보완 문제 2–3개 선정",
    ],
  },
  {
    lessonId: "lesson-2",
    studentName: "이준혁",
    beforeClass: [
      "숙제 오답 5문제 미리 정리해두기",
      "함정 선지 유형 분석 시트 출력 확인",
      "오늘 실전 고난도 빈칸 문제 3개 예비 선정",
    ],
    duringClass: [
      "오답 원인을 학생이 먼저 말하게 하기 — 함정 패턴 인식 훈련",
      "연결어 체크 → 논리 방향 말로 설명시키기",
      '"이 선지를 고른 이유를 지문에서 찾아줄 수 있어요?" 질문',
    ],
    afterClass: [
      "오늘 수업 반응 기록 — 자신감 변화 확인",
      "빈칸추론 이해도 + 함정 선지 인식 여부 메모",
    ],
    nextLessonPrep: [
      "글의 순서 배열 유형 기출 자료 선정",
      "논리 흐름 파악 역량 연계 문제 준비",
    ],
  },
  {
    lessonId: "lesson-3",
    studentName: "수능 대비반 A",
    beforeClass: [
      "실전 지문 2개 프린트 인원수(3명) 맞게 준비",
      "정현우 개별 약점 — 수치 도식화 예시 칠판 준비",
      "그룹 내 개별 성취 차이 감안해 질문 분배 계획",
    ],
    duringClass: [
      "정현우: 수치 정보 도식화 습관 개별 체크",
      "전원: 선지 판단 시 지문 근거 찾는 과정 말로 설명시키기",
      '"추론이 가능하려면 지문에 어떤 근거가 있어야 해요?" 질문',
    ],
    afterClass: [
      "3명 개별 이해도 + 정현우 수치 처리 습관 변화 기록",
      "공통 오답 유형 메모 — 다음 수업 보완 여부 검토",
    ],
    nextLessonPrep: [
      "인문·예술 지문 2개 선정",
      "추상 개념 정리 자료 준비",
    ],
  },
  {
    lessonId: "lesson-4",
    studentName: "김도윤",
    beforeClass: [
      "이차방정식 판별식 기초 예제 3개 미리 준비",
      "지난 수업 내용 간단히 복습 포인트 정리",
    ],
    duringClass: [
      "판별식 개념 먼저 구두로 설명하게 유도",
      "근의 공식 적용 단계 직접 써보게 하기",
    ],
    afterClass: [
      "오늘 개념 이해도 기록",
      "보강 필요 항목 확인 후 다음 수업 준비",
    ],
    nextLessonPrep: [
      "이차방정식 완성 후 이차함수 연계 문제 준비",
    ],
  },
  {
    lessonId: "lesson-5",
    studentName: "최아영",
    beforeClass: [
      "산화-환원 반쪽 반응식 예제 2개 준비",
      "시험 D-19 — 오늘 출제 예상 유형 재확인",
    ],
    duringClass: [
      "반쪽 반응식 균형 맞추는 과정을 단계별로 설명하게 유도",
      "산화수 계산 실수 패턴 집중 체크",
    ],
    afterClass: [
      "오늘 이해도 기록 — 시험 대비 보완 포인트 메모",
      "다음 수업 범위 확인",
    ],
    nextLessonPrep: [
      "전기화학 기초 + 산화-환원 심화 문제 준비",
    ],
  },
];
