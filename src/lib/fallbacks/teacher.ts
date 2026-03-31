import type { TeacherDashboardQuickActionItem } from "@/types/view/teacher";

export const UNKNOWN_EXAM_DAYS = 9999;

export const TEACHER_DASHBOARD_QUICK_ACTIONS: TeacherDashboardQuickActionItem[] = [
  { label: "학생 목록", description: "학생 목록에서 상태와 과제 진행을 확인합니다.", tone: "rose", icon: "👤" },
  { label: "반 목록", description: "반별 평균 점수와 커리큘럼 상태를 확인합니다.", tone: "gold", icon: "🏫" },
  { label: "오늘 수업", description: "오늘 수업 일정과 제출 현황을 확인합니다.", tone: "peach", icon: "🕒" },
  { label: "리포트", description: "학생/반 리포트 화면으로 이동해 추이를 점검합니다.", tone: "soft", icon: "📊" },
];

export const TEACHER_STUDENTS_PAGE_MESSAGES = {
  emptyTitle: "학생 데이터가 없습니다",
  emptyDescription: "`/api/teacher/students` 응답이 비어 있습니다. DB seed 또는 VIEW 결과를 확인해 주세요.",
  errorTitle: "학생 목록을 불러오지 못했습니다",
  errorDescription: "`/api/teacher/students` 연결 상태를 확인해 주세요.",
};
