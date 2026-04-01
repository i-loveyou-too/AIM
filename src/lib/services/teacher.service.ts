import {
  getTeacherClasses,
  getTeacherReportsOverview,
  getTeacherStudents,
  getTeacherTodayLessons,
  getTeacherTodayLessonsOverview,
  toDisplayGrade,
  toDisplayStatus,
} from "@/lib/api/teacher";
import {
  TEACHER_REPORTS_OVERVIEW_FALLBACK,
  TEACHER_TODAY_LESSONS_OVERVIEW_FALLBACK,
  TEACHER_DASHBOARD_QUICK_ACTIONS,
  UNKNOWN_EXAM_DAYS,
} from "@/lib/fallbacks/teacher";
import type {
  TeacherClassListItem,
  TeacherStudentListItem,
  TeacherTodayLessonItem,
} from "@/types/teacher";
import type {
  TeacherDashboardExamAlertSchool,
  TeacherDashboardPageData,
  TeacherDashboardRecentActivityItem,
  TeacherDashboardStudentInsight,
  TeacherReportsOverviewData,
  TeacherReportsPageData,
  TeacherTodayLessonsOverviewData,
  TeacherTodayLessonsPageData,
  TeacherStudentsPageData,
  TeacherStudentsPageStudentRecord,
} from "@/types/view/teacher";

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toNumberWithFallback(value: number | string | null | undefined, fallback = 0) {
  const parsed = toNumber(value);
  return parsed === null ? fallback : parsed;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildDuration(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return "-";
  const startParts = startTime.split(":").map(Number);
  const endParts = endTime.split(":").map(Number);
  if (startParts.length < 2 || endParts.length < 2) return "-";
  const startMin = startParts[0] * 60 + startParts[1];
  const endMin = endParts[0] * 60 + endParts[1];
  const diff = endMin - startMin;
  if (!Number.isFinite(diff) || diff <= 0) return "-";
  return `${diff}분`;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function toStatusLabel(value: string | null | undefined): TeacherStudentsPageStudentRecord["status"] {
  const label = toDisplayStatus(value);
  if (label === "상승" || label === "주의" || label === "시험 임박" || label === "안정") return label;
  return "안정";
}

function inferSubject(className: string | null, track: string | null) {
  const source = `${className ?? ""} ${track ?? ""}`;
  if (source.includes("국어")) return "국어";
  if (source.includes("영어")) return "영어";
  if (source.includes("과학")) return "과학";
  return "수학";
}

function calcExamDays(examDaysLeft: number | null, nextExamDate: string | null) {
  if (typeof examDaysLeft === "number" && Number.isFinite(examDaysLeft)) {
    return Math.max(0, examDaysLeft);
  }

  if (nextExamDate) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const exam = new Date(nextExamDate);
    if (!Number.isNaN(exam.getTime())) {
      const examStart = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());
      const diffMs = examStart.getTime() - todayStart.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
  }

  return UNKNOWN_EXAM_DAYS;
}

function toRouteStudentId(value: unknown): string | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return String(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) return trimmed;
    const matched = trimmed.match(/\d+/g);
    if (matched && matched.length > 0) {
      return matched[matched.length - 1];
    }
  }
  return null;
}

function resolveStudentRouteId(row: TeacherStudentListItem): string {
  const directId = toRouteStudentId(row.student_id);
  if (directId) return directId;

  const fallbackId = toRouteStudentId((row as unknown as { id?: unknown }).id);
  if (fallbackId) return fallbackId;

  const codeId = toRouteStudentId(row.student_code);
  if (codeId) return codeId;

  return "";
}

function mapStudent(row: TeacherStudentListItem): TeacherStudentsPageStudentRecord {
  const assignmentDone = toNumberWithFallback(row.assignment_done, 0);
  const assignmentTotal = toNumberWithFallback(row.assignment_total, 0);
  const assignmentRate = toNumberWithFallback(row.assignment_rate, 0);

  return {
    id: resolveStudentRouteId(row),
    studentCode: row.student_code ?? "-",
    name: row.name ?? "-",
    school: row.school_name ?? "-",
    grade: toDisplayGrade(row.grade),
    className: row.class_name ?? "-",
    subject: inferSubject(row.class_name, row.track),
    recentProgress: row.recent_progress_unit ?? "-",
    recentTag: row.recent_tag ?? "-",
    score: Math.max(0, toNumberWithFallback(row.score, 0)),
    examDays: calcExamDays(row.exam_days_left, row.next_exam_date),
    nextExamDate: row.next_exam_date,
    overdueAssignments: Math.max(0, toNumberWithFallback(row.overdue_assignments, 0)),
    assignmentDone: Math.max(0, assignmentDone),
    assignmentTotal: Math.max(0, assignmentTotal),
    assignmentRate: Math.max(0, assignmentRate),
    weakTopic: row.top_weak_topics ?? "-",
    status: toStatusLabel(row.status),
    note: row.note ?? "-",
  };
}

function buildSummaryCards(students: TeacherStudentListItem[], classes: TeacherClassListItem[]) {
  const totalStudents = students.length;
  const activeClasses = classes.filter((item) => item.is_active !== false).length;

  const attentionStudents = students.filter((item) => {
    const status = String(item.status ?? "");
    const overdue = toNumber(item.overdue_assignments) ?? 0;
    return status === "warning" || status === "urgent" || status === "focus" || overdue > 0;
  }).length;

  const scoreValues = students
    .map((item) => toNumber(item.score))
    .filter((value): value is number => value !== null);
  const avgScore =
    scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : null;

  const rateValues = students
    .map((item) => toNumber(item.assignment_rate))
    .filter((value): value is number => value !== null);
  const avgRate =
    rateValues.length > 0 ? rateValues.reduce((a, b) => a + b, 0) / rateValues.length : null;

  return [
    {
      label: "전체 학생 수",
      value: `${totalStudents}명`,
      note: "학생 목록 API 기준 집계",
      tone: "rose" as const,
      emoji: "👥",
      badge: "실데이터",
      href: "/dashboard/students",
    },
    {
      label: "활성 반 수",
      value: `${activeClasses}개`,
      note: "반 목록 API 기준 집계",
      tone: "gold" as const,
      emoji: "🏫",
      badge: "실데이터",
      href: "/dashboard/classes",
    },
    {
      label: "주의/긴급 학생 수",
      value: `${attentionStudents}명`,
      note: "warning·urgent·focus 또는 미완료 과제 기준",
      tone: "peach" as const,
      emoji: "⚠️",
      badge: "확인 필요",
      href: "/dashboard/students",
    },
    {
      label: "평균 점수 / 제출률",
      value: `${avgScore === null ? "-" : avgScore.toFixed(1)}점`,
      note: `평균 과제 제출률 ${avgRate === null ? "-" : `${avgRate.toFixed(1)}%`}`,
      tone: "soft" as const,
      emoji: "📊",
      badge: "실데이터",
      href: "/dashboard/students",
    },
  ];
}

function buildClassInsights(classes: TeacherClassListItem[]) {
  return [...classes]
    .sort((a, b) => (toNumber(b.avg_score) ?? 0) - (toNumber(a.avg_score) ?? 0))
    .slice(0, 12)
    .map((item) => {
      const avgScore = toNumber(item.avg_score) ?? 0;
      const assignmentRate = toNumber(item.avg_assignment_rate) ?? 0;
      const bars = Array.from({ length: 7 }, (_, index) =>
        clamp(Math.round(avgScore - 26 + index * 5), 24, 92),
      );
      return {
        label: "반별 인사이트",
        school: item.teacher_name ?? "담당 미정",
        className: item.class_name ?? `반 ${item.class_group_id}`,
        metricLabel: "평균 성취도",
        metricValue: `${avgScore.toFixed(1)}%`,
        delta: `${assignmentRate >= 70 ? "+" : ""}${assignmentRate.toFixed(1)}%`,
        note: `커리큘럼 상태 ${item.curriculum_status ?? "-"} · 평균 제출률 ${assignmentRate.toFixed(1)}%`,
        chartBars: bars,
        focusLabel: "시험 상태",
        focusValue:
          typeof item.exam_days_left === "number" && Number.isFinite(item.exam_days_left)
            ? `D-${Math.max(0, item.exam_days_left)}`
            : item.next_exam_date ?? "-",
      };
    });
}

function buildStudentInsight(students: TeacherStudentListItem[]): TeacherDashboardStudentInsight {
  const sorted = [...students].sort((a, b) => {
    const aPriority =
      String(a.status) === "urgent" ||
      String(a.status) === "focus" ||
      (toNumber(a.overdue_assignments) ?? 0) > 0
        ? 0
        : 1;
    const bPriority =
      String(b.status) === "urgent" ||
      String(b.status) === "focus" ||
      (toNumber(b.overdue_assignments) ?? 0) > 0
        ? 0
        : 1;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return (toNumber(b.score) ?? 0) - (toNumber(a.score) ?? 0);
  });

  return {
    label: "학생 인사이트",
    title: "우선 확인 학생",
    subtitle: "실데이터 기준으로 관리 우선순위가 높은 학생을 표시합니다.",
    students: sorted.slice(0, 3).map((item) => {
      const statusLabel = toDisplayStatus(item.status);
      const overdue = toNumber(item.overdue_assignments) ?? 0;
      return {
        id: String(item.student_id),
        name: item.name ?? "-",
        className: item.class_name ?? "-",
        badge:
          statusLabel === "주의" || statusLabel === "시험 임박"
            ? "주의"
            : statusLabel === "상승"
              ? "상승"
              : "확인",
        note:
          overdue > 0
            ? `미완료 과제 ${overdue}건 · 점수 ${toNumber(item.score) ?? "-"}`
            : `최근 점수 ${toNumber(item.score) ?? "-"} · 시험 ${item.next_exam_date ?? "-"}`,
      };
    }),
  };
}

function mapTodaySchedule(lessons: TeacherTodayLessonItem[]) {
  return lessons.slice(0, 6).map((item) => {
    const openIssues = toNumber(item.open_issue_count) ?? 0;
    const needsReview = toNumber(item.needs_review_count) ?? 0;
    const unsubmitted = toNumber(item.unsubmitted_count) ?? 0;
    let tone: "rose" | "gold" | "peach" = "rose";
    if (openIssues > 0) tone = "peach";
    else if (needsReview > 0 || unsubmitted > 0) tone = "gold";

    return {
      time: item.start_time ? item.start_time.slice(0, 5) : "--:--",
      duration: buildDuration(item.start_time, item.end_time),
      title: `${item.class_name ?? "-"} 수업`,
      student: `${item.teacher_name ?? "-"} · ${item.student_count}명`,
      memo: `미제출 ${unsubmitted}건 · 검토 필요 ${needsReview}건 · 열린 이슈 ${openIssues}건`,
      status: item.status === "completed" ? "완료" : item.status === "cancelled" ? "취소" : "수업 확인",
      tone,
    };
  });
}

function buildExamSchools(students: TeacherStudentListItem[] | null): TeacherDashboardExamAlertSchool[] {
  if (!students || students.length === 0) return [];

  const bySchool = new Map<string, TeacherStudentListItem[]>();
  students.forEach((item) => {
    const school = item.school_name ?? "미지정 학교";
    const group = bySchool.get(school) ?? [];
    group.push(item);
    bySchool.set(school, group);
  });

  return [...bySchool.entries()]
    .map(([schoolName, schoolStudents]) => {
      const classScores = new Map<string, number[]>();
      const schoolScores: number[] = [];
      const examDays: number[] = [];
      const examDates: string[] = [];

      schoolStudents.forEach((student) => {
        const className = student.class_name ?? "미분류 반";
        const score = toNumber(student.assignment_rate) ?? toNumber(student.score);
        if (score !== null) {
          const values = classScores.get(className) ?? [];
          values.push(clamp(score, 0, 100));
          classScores.set(className, values);
          schoolScores.push(clamp(score, 0, 100));
        }

        if (typeof student.exam_days_left === "number" && Number.isFinite(student.exam_days_left)) {
          examDays.push(Math.max(0, student.exam_days_left));
        }
        if (student.next_exam_date) {
          examDates.push(student.next_exam_date);
        }
      });

      const classes = [...classScores.entries()]
        .map(([name, values]) => ({
          name,
          progress: Math.round(average(values)),
        }))
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 4);

      const overallProgress = Math.round(
        classes.length > 0 ? average(classes.map((item) => item.progress)) : average(schoolScores),
      );

      const examDate = examDates.length > 0 ? [...examDates].sort()[0] : "-";

      return {
        name: schoolName,
        examName: "다가오는 시험",
        examDate,
        daysLeft: examDays.length > 0 ? Math.min(...examDays) : 0,
        overallProgress: Number.isFinite(overallProgress) ? overallProgress : 0,
        classes: classes.length > 0 ? classes : [{ name: "학급 정보 없음", progress: 0 }],
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

function buildRecentActivity(
  students: TeacherStudentListItem[] | null,
  classes: TeacherClassListItem[] | null,
  lessons: TeacherTodayLessonItem[] | null,
): TeacherDashboardRecentActivityItem[] {
  const items: TeacherDashboardRecentActivityItem[] = [];

  if (lessons) {
    lessons
      .filter((item) => (toNumber(item.needs_review_count) ?? 0) > 0)
      .slice(0, 2)
      .forEach((item, index) => {
        items.push({
          time: index === 0 ? "방금 전" : "조금 전",
          student: item.class_name ?? "-",
          action: "제출 검토 필요",
          detail: `검토 필요 제출 ${item.needs_review_count}건이 있습니다.`,
          kind: "warning",
        });
      });
  }

  if (students) {
    students
      .filter((item) => (toNumber(item.overdue_assignments) ?? 0) > 0)
      .slice(0, 2)
      .forEach((item) => {
        items.push({
          time: "최근",
          student: item.name ?? "-",
          action: "미완료 과제 확인 필요",
          detail: `미완료 과제 ${item.overdue_assignments ?? 0}건 · ${item.class_name ?? "-"}`,
          kind: "warning",
        });
      });
  }

  if (classes) {
    classes
      .filter((item) => typeof item.exam_days_left === "number" && item.exam_days_left <= 14)
      .slice(0, 1)
      .forEach((item) => {
        items.push({
          time: "오늘",
          student: item.class_name ?? "-",
          action: "시험 임박 반",
          detail: `시험 ${item.exam_days_left === null ? "-" : `D-${Math.max(0, item.exam_days_left)}`}`,
          kind: "info",
        });
      });
  }

  return items.slice(0, 4);
}

function buildOperationsStatus(
  classes: TeacherClassListItem[] | null,
  lessons: TeacherTodayLessonItem[] | null,
) {
  if (!classes || !lessons) {
    return {
      unavailable: true,
      imminent: 0,
      openIssues: 0,
      reviewCount: 0,
    };
  }

  return {
    unavailable: false,
    imminent: classes.filter((item) => typeof item.exam_days_left === "number" && item.exam_days_left <= 14)
      .length,
    openIssues: lessons.reduce((sum, item) => sum + (toNumber(item.open_issue_count) ?? 0), 0),
    reviewCount: lessons.reduce((sum, item) => sum + (toNumber(item.needs_review_count) ?? 0), 0),
  };
}

export async function loadTeacherStudentsPageData(): Promise<TeacherStudentsPageData> {
  try {
    const rows = await getTeacherStudents();
    const students = rows.map(mapStudent);

    if (students.length === 0) {
      return { status: "empty" };
    }

    return {
      status: "ok",
      students,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "unknown error",
    };
  }
}

export async function loadTeacherDashboardPageData(): Promise<TeacherDashboardPageData> {
  const [studentsResult, classesResult, lessonsResult] = await Promise.allSettled([
    getTeacherStudents(),
    getTeacherClasses(),
    getTeacherTodayLessons(),
  ]);

  const students = studentsResult.status === "fulfilled" ? studentsResult.value : null;
  const classes = classesResult.status === "fulfilled" ? classesResult.value : null;
  const lessons = lessonsResult.status === "fulfilled" ? lessonsResult.value : null;

  const cardsError = !students || !classes;
  const cards = !cardsError ? buildSummaryCards(students, classes) : [];

  const insightError = !students || !classes;
  const insightEmpty = !insightError && (students.length === 0 || classes.length === 0);
  const classInsights = !insightError ? buildClassInsights(classes) : [];
  const studentInsight = !insightError ? buildStudentInsight(students) : null;

  const scheduleError = !lessons;
  const scheduleItems = !scheduleError ? mapTodaySchedule(lessons) : [];

  const recentItems = buildRecentActivity(students, classes, lessons);
  const recentError = !students && !classes && !lessons;

  return {
    cardsError,
    cards,
    insightError,
    insightEmpty,
    classInsights,
    studentInsight,
    scheduleError,
    scheduleItems,
    recentItems,
    recentError,
    examSchools: buildExamSchools(students),
    operationsStatus: buildOperationsStatus(classes, lessons),
    quickActionItems: TEACHER_DASHBOARD_QUICK_ACTIONS,
  };
}

function readNumberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" || typeof value === "string") {
    return toNumberWithFallback(value, fallback);
  }
  return fallback;
}

export function normalizeTeacherReportsOverview(raw: unknown): TeacherReportsOverviewData {
  const fallback = TEACHER_REPORTS_OVERVIEW_FALLBACK;
  const obj = asObject(raw);
  if (!obj) return fallback;

  return {
    summaryCards: Array.isArray(obj.summaryCards)
      ? (obj.summaryCards as TeacherReportsOverviewData["summaryCards"])
      : fallback.summaryCards,
    studentReports: Array.isArray(obj.studentReports)
      ? (obj.studentReports as TeacherReportsOverviewData["studentReports"])
      : fallback.studentReports,
    classReports: Array.isArray(obj.classReports)
      ? (obj.classReports as TeacherReportsOverviewData["classReports"])
      : fallback.classReports,
    examReadinessStudents: Array.isArray(obj.examReadinessStudents)
      ? (obj.examReadinessStudents as TeacherReportsOverviewData["examReadinessStudents"])
      : fallback.examReadinessStudents,
    examReadinessClasses: Array.isArray(obj.examReadinessClasses)
      ? (obj.examReadinessClasses as TeacherReportsOverviewData["examReadinessClasses"])
      : fallback.examReadinessClasses,
    periodReports: asObject(obj.periodReports)
      ? (obj.periodReports as TeacherReportsOverviewData["periodReports"])
      : fallback.periodReports,
  };
}

export async function loadTeacherReportsPageData(): Promise<TeacherReportsPageData> {
  try {
    const raw = await getTeacherReportsOverview();
    return {
      overview: normalizeTeacherReportsOverview(raw),
      loadFailed: false,
    };
  } catch {
    return {
      overview: TEACHER_REPORTS_OVERVIEW_FALLBACK,
      loadFailed: true,
    };
  }
}

export function normalizeTeacherTodayLessonsOverview(raw: unknown): TeacherTodayLessonsOverviewData {
  const fallback = TEACHER_TODAY_LESSONS_OVERVIEW_FALLBACK;
  const obj = asObject(raw);
  if (!obj) return fallback;

  const summaryObj = asObject(obj.summary);
  const fallbackSummary = fallback.summary;

  return {
    summary: {
      totalLessons: readNumberValue(summaryObj?.totalLessons, fallbackSummary.totalLessons),
      focusStudents: readNumberValue(summaryObj?.focusStudents, fallbackSummary.focusStudents),
      homeworkIssues: readNumberValue(summaryObj?.homeworkIssues, fallbackSummary.homeworkIssues),
      teachingPoints: readNumberValue(summaryObj?.teachingPoints, fallbackSummary.teachingPoints),
      examImminentStudents: readNumberValue(
        summaryObj?.examImminentStudents,
        fallbackSummary.examImminentStudents,
      ),
    },
    schedule: Array.isArray(obj.schedule)
      ? (obj.schedule as TeacherTodayLessonsOverviewData["schedule"])
      : fallback.schedule,
    preps: Array.isArray(obj.preps) ? (obj.preps as TeacherTodayLessonsOverviewData["preps"]) : fallback.preps,
    weaknessOverview: Array.isArray(obj.weaknessOverview)
      ? (obj.weaknessOverview as TeacherTodayLessonsOverviewData["weaknessOverview"])
      : fallback.weaknessOverview,
    homeworkReflection: asObject(obj.homeworkReflection)
      ? (obj.homeworkReflection as TeacherTodayLessonsOverviewData["homeworkReflection"])
      : fallback.homeworkReflection,
    materials: Array.isArray(obj.materials)
      ? (obj.materials as TeacherTodayLessonsOverviewData["materials"])
      : fallback.materials,
    nextActions: Array.isArray(obj.nextActions)
      ? (obj.nextActions as TeacherTodayLessonsOverviewData["nextActions"])
      : fallback.nextActions,
  };
}

export async function loadTeacherTodayLessonsPageData(): Promise<TeacherTodayLessonsPageData> {
  try {
    const raw = await getTeacherTodayLessonsOverview();
    return {
      overview: normalizeTeacherTodayLessonsOverview(raw),
      loadFailed: false,
    };
  } catch {
    return {
      overview: TEACHER_TODAY_LESSONS_OVERVIEW_FALLBACK,
      loadFailed: true,
    };
  }
}
