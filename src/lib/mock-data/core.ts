export const teacherProfile = {
  name: "김민정 선생님",
  role: "교사용 관리자",
  initials: "김",
  greetingName: "김민정",
};

export type SidebarChild = { label: string; href: string };

export type SidebarMenuItem = {
  emoji: string;
  label: string;
  href?: string;
  children?: SidebarChild[];
};

export const sidebarMenu: SidebarMenuItem[] = [
  { emoji: "🧭", label: "대시보드", href: "/dashboard" },
  {
    emoji: "🗓️",
    label: "오늘 수업 운영",
    href: "/dashboard/today-lessons",
    children: [
      { label: "수업 일정 보기",  href: "/dashboard/today-lessons#schedule" },
      { label: "수업별 준비 카드", href: "/dashboard/today-lessons#lesson-prep" },
      { label: "숙제 반영 현황",  href: "/dashboard/today-lessons#homework" },
    ],
  },
  {
    emoji: "👥",
    label: "학생 관리",
    href: "/dashboard/students",
    children: [
      { label: "전체 학생 목록", href: "/dashboard/students" },
    ],
  },
  {
    emoji: "📚",
    label: "수업 진도 / 커리큘럼",
    href: "/dashboard/curriculum",
    children: [
      { label: "역산 계획 보기",   href: "/dashboard/curriculum#reverse-plan" },
      { label: "커리큘럼 로드맵",  href: "/dashboard/curriculum#roadmap" },
      { label: "위험 신호 확인",   href: "/dashboard/curriculum#risk" },
    ],
  },
  {
    emoji: "📝",
    label: "과제 관리",
    href: "/dashboard/assignments",
    children: [
      { label: "반별 과제 현황", href: "/dashboard/assignments?tab=class" },
      { label: "미제출 학생",   href: "/dashboard/assignments?tab=unsubmitted" },
      { label: "마감 임박 과제", href: "/dashboard/assignments?tab=dueToday" },
    ],
  },
  {
    emoji: "📈",
    label: "리포트",
    href: "/dashboard/reports",
    children: [
      { label: "학생별 리포트",   href: "/dashboard/reports?tab=student" },
      { label: "반별 리포트",     href: "/dashboard/reports?tab=class" },
      { label: "시험 대비 리포트", href: "/dashboard/reports?tab=exam" },
      { label: "기간별 리포트",   href: "/dashboard/reports?tab=period" },
    ],
  },
  { emoji: "⚙️", label: "설정", href: "/dashboard/settings" },
];

export const sidebarNotice =
  "오늘은 시험이 임박한 학생부터 먼저 확인해두면, 전체 수업 운영이 훨씬 안정적으로 정리됩니다.";
