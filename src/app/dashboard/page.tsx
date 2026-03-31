import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { InsightPanel } from "@/components/dashboard/insight-panel";
import { ExamAlert } from "@/components/dashboard/exam-alert";
import type { ExamAlertSchool } from "@/components/dashboard/exam-alert";
import {
  getTeacherClasses,
  getTeacherStudents,
  getTeacherTodayLessons,
  toDisplayStatus,
} from "@/lib/api/teacher";
import type { TeacherClassListItem, TeacherStudentListItem, TeacherTodayLessonItem } from "@/types/teacher";

type StatusTone = "rose" | "gold" | "peach" | "soft";

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
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

function buildSummaryCards(students: TeacherStudentListItem[], classes: TeacherClassListItem[]) {
  const totalStudents = students.length;
  const activeClasses = classes.filter((item) => item.is_active !== false).length;

  const attentionStudents = students.filter((item) => {
    const status = String(item.status ?? "");
    const overdue = toNumber(item.overdue_assignments) ?? 0;
    return status === "warning" || status === "urgent" || status === "focus" || overdue > 0;
  }).length;

  const scoreValues = students.map((item) => toNumber(item.score)).filter((value): value is number => value !== null);
  const avgScore = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : null;

  const rateValues = students
    .map((item) => toNumber(item.assignment_rate))
    .filter((value): value is number => value !== null);
  const avgRate = rateValues.length > 0 ? rateValues.reduce((a, b) => a + b, 0) / rateValues.length : null;

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
      const bars = Array.from({ length: 7 }, (_, index) => clamp(Math.round(avgScore - 26 + index * 5), 24, 92));
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
            : (item.next_exam_date ?? "-"),
      };
    });
}

function buildStudentInsight(students: TeacherStudentListItem[]) {
  const sorted = [...students].sort((a, b) => {
    const aPriority =
      String(a.status) === "urgent" || String(a.status) === "focus" || (toNumber(a.overdue_assignments) ?? 0) > 0 ? 0 : 1;
    const bPriority =
      String(b.status) === "urgent" || String(b.status) === "focus" || (toNumber(b.overdue_assignments) ?? 0) > 0 ? 0 : 1;
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
        badge: statusLabel === "주의" || statusLabel === "시험 임박" ? "주의" : statusLabel === "상승" ? "상승" : "확인",
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

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildExamSchools(students: TeacherStudentListItem[] | null): ExamAlertSchool[] {
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
      } satisfies ExamAlertSchool;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

function buildRecentActivity(
  students: TeacherStudentListItem[] | null,
  classes: TeacherClassListItem[] | null,
  lessons: TeacherTodayLessonItem[] | null,
) {
  const items: Array<{ time: string; student: string; action: string; detail: string; kind?: "success" | "info" | "warning" }> = [];

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

function StateCard({ title, message, tone = "soft" }: { title: string; message: string; tone?: StatusTone }) {
  const styles: Record<StatusTone, string> = {
    rose: "border-brand/25 bg-brand/5 text-brand",
    gold: "border-warm/60 bg-warm/20 text-text",
    peach: "border-accent/30 bg-accent/10 text-accent",
    soft: "border-border bg-white text-text",
  };

  return (
    <section className={`rounded-[28px] border px-6 py-6 shadow-soft ${styles[tone]}`}>
      <p className="text-base font-extrabold tracking-tight">{title}</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </section>
  );
}

function OperationsStatusCard({
  classes,
  lessons,
}: {
  classes: TeacherClassListItem[] | null;
  lessons: TeacherTodayLessonItem[] | null;
}) {
  if (!classes || !lessons) {
    return (
      <StateCard
        title="현재 데이터를 불러올 수 없습니다"
        message="운영 상태 카드 데이터를 불러오지 못했습니다."
        tone="peach"
      />
    );
  }

  const imminent = classes.filter((item) => typeof item.exam_days_left === "number" && item.exam_days_left <= 14).length;
  const openIssues = lessons.reduce((sum, item) => sum + (toNumber(item.open_issue_count) ?? 0), 0);
  const reviewCount = lessons.reduce((sum, item) => sum + (toNumber(item.needs_review_count) ?? 0), 0);

  return (
    <section className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">운영 상태</p>
          <h2 className="mt-2 text-xl font-semibold text-text">오늘 확인할 핵심 수치</h2>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">실데이터</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-soft/40 px-4 py-3">
          <p className="text-xs text-muted">시험 임박 반</p>
          <p className="mt-1 text-lg font-extrabold text-text">{imminent}개</p>
        </div>
        <div className="rounded-2xl border border-border bg-soft/40 px-4 py-3">
          <p className="text-xs text-muted">열린 이슈</p>
          <p className="mt-1 text-lg font-extrabold text-text">{openIssues}건</p>
        </div>
        <div className="rounded-2xl border border-border bg-soft/40 px-4 py-3">
          <p className="text-xs text-muted">제출 검토 필요</p>
          <p className="mt-1 text-lg font-extrabold text-text">{reviewCount}건</p>
        </div>
      </div>
    </section>
  );
}

const quickActionItems = [
  { label: "학생 목록", description: "학생 목록에서 상태와 과제 진행을 확인합니다.", tone: "rose" as const, icon: "👤" },
  { label: "반 목록", description: "반별 평균 점수와 커리큘럼 상태를 확인합니다.", tone: "gold" as const, icon: "🏫" },
  { label: "오늘 수업", description: "오늘 수업 일정과 제출 현황을 확인합니다.", tone: "peach" as const, icon: "🕒" },
  { label: "리포트", description: "학생/반 리포트 화면으로 이동해 추이를 점검합니다.", tone: "soft" as const, icon: "📊" },
];

export default async function DashboardPage() {
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
  const examSchools = buildExamSchools(students);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cardsError ? (
          <div className="sm:col-span-2 xl:col-span-4">
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="대시보드 핵심 카드 API 호출에 실패했습니다."
              tone="peach"
            />
          </div>
        ) : (
          cards.map((item) => (
            <SummaryCard
              key={item.label}
              label={item.label}
              value={item.value}
              note={item.note}
              tone={item.tone}
              emoji={item.emoji}
              badge={item.badge}
              href={item.href}
            />
          ))
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          {insightError ? (
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="인사이트 패널 API 호출에 실패했습니다."
              tone="peach"
            />
          ) : insightEmpty || !studentInsight ? (
            <StateCard title="표시할 인사이트가 없습니다" message="학생 또는 반 데이터가 비어 있습니다." />
          ) : (
            <InsightPanel classInsights={classInsights} studentInsight={studentInsight} />
          )}

          {scheduleError ? (
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="오늘 수업 일정 API 호출에 실패했습니다."
              tone="peach"
            />
          ) : scheduleItems.length === 0 ? (
            <StateCard title="오늘 수업 일정이 없습니다" message="`/api/teacher/today-lessons` 결과가 비어 있습니다." />
          ) : (
            <TodaySchedule items={scheduleItems} />
          )}
        </div>

        <div className="space-y-6">
          <OperationsStatusCard classes={classes} lessons={lessons} />
          <ExamAlert schools={examSchools} />

          {recentError ? (
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="실시간 알림 데이터 API 호출에 실패했습니다."
              tone="peach"
            />
          ) : recentItems.length === 0 ? (
            <StateCard title="표시할 최근 활동이 없습니다" message="최근 활동으로 표시할 실데이터가 없습니다." />
          ) : (
            <RecentActivity items={recentItems} />
          )}

          <QuickActions items={quickActionItems} />
        </div>
      </section>
    </div>
  );
}
