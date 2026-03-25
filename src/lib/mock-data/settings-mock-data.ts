// 설정 페이지 mock data
// 교사용 MVP 핵심 설정 값

// ── 프로필 ────────────────────────────────────────────────────────────
export const settingsProfile = {
  name: "김민정",
  affiliation: "목동 에임 학원",
  role: "수학 전임 강사 · 운영 관리자",
  email: "minjeong.kim@aimon.kr",
  phone: "010-1234-5678",
  joined: "2024년 3월",
};

// ── 알림 설정 ─────────────────────────────────────────────────────────
export type NotificationSetting = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const notificationSettings: NotificationSetting[] = [
  {
    key: "exam_alert",
    label: "시험 임박 알림",
    description: "D-14 이내 시험 예정 학생 발생 시 알림",
    enabled: true,
  },
  {
    key: "missing_hw",
    label: "미제출 알림",
    description: "숙제 미제출 2회 이상 학생 발생 시 알림",
    enabled: true,
  },
  {
    key: "question_alert",
    label: "질문 등록 알림",
    description: "학생이 질문을 새로 등록할 때 알림",
    enabled: false,
  },
  {
    key: "ocr_review",
    label: "OCR 검토 필요 알림",
    description: "OCR 인식 오류로 검토가 필요할 때 알림",
    enabled: true,
  },
  {
    key: "plan_delay",
    label: "계획 지연 알림",
    description: "진도 달성률이 목표 대비 10%p 이상 낮을 때 알림",
    enabled: true,
  },
  {
    key: "lesson_issue",
    label: "수업 반영 필요 이슈 알림",
    description: "이슈함에 긴급 이슈가 등록될 때 알림",
    enabled: false,
  },
];

// ── 리포트 기본 설정 ──────────────────────────────────────────────────
export const reportSettings = {
  defaultPeriod: "4주" as "1주" | "2주" | "4주",
  defaultView: "학생별" as "학생별" | "반별",
  examEmphasisDDay: "D-14" as "D-7" | "D-14" | "D-21",
};

// ── 수업 운영 설정 ────────────────────────────────────────────────────
export const lessonSettings = {
  defaultDuration: "90분" as "60분" | "90분" | "120분",
  showNextAction: true,
  showLessonMemo: true,
  todayPageInfoScope: "전체" as "전체" | "요약만",
};

// ── 과제 관리 설정 ─────────────────────────────────────────────────────
export const assignmentSettings = {
  defaultDeadlineTime: "23:59",
  allowPhotoSubmit: true,
  allowOMRSubmit: true,
  questionEnabled: true,
  ocrReviewHighlight: true,
  commonMistakeAlert: true,
};

// ── 반 / 과목 기본 정보 ────────────────────────────────────────────────
export const basicInfoSettings = {
  classes: [
    { name: "고2 수학 A반", subject: "수학", studentCount: 8, examDate: "2026.04.05" },
    { name: "고1 영어 B반", subject: "영어", studentCount: 6, examDate: "2026.04.08" },
    { name: "중3 국어 A반", subject: "국어", studentCount: 7, examDate: "2026.04.15" },
    { name: "중3 과학 C반", subject: "과학", studentCount: 5, examDate: "2026.04.20" },
    { name: "중2 수학 D반", subject: "수학", studentCount: 6, examDate: "2026.04.25" },
  ],
  subjects: ["수학", "영어", "국어", "과학"],
  examScheduleLinked: true,
  curriculumTemplateLinked: true,
};
