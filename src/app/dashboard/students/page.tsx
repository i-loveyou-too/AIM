import { StudentDirectory } from "@/components/students/student-directory";
import { getTeacherStudents, toDisplayGrade, toDisplayStatus } from "@/lib/api/teacher";

type StudentRecord = {
  id: string;
  studentCode: string;
  name: string;
  school: string;
  grade: string;
  className: string;
  subject: string;
  recentProgress: string;
  recentTag: string;
  score: number;
  examDays: number;
  nextExamDate: string | null;
  overdueAssignments: number;
  assignmentDone: number;
  assignmentTotal: number;
  assignmentRate: number;
  weakTopic: string;
  status: "상승" | "안정" | "주의" | "시험 임박";
  note: string;
};

const UNKNOWN_EXAM_DAYS = 9999;

function toNumber(value: number | string | null | undefined, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toStatusLabel(value: string | null | undefined): StudentRecord["status"] {
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

function mapStudent(row: Awaited<ReturnType<typeof getTeacherStudents>>[number]): StudentRecord {
  const assignmentDone = toNumber(row.assignment_done, 0);
  const assignmentTotal = toNumber(row.assignment_total, 0);
  const assignmentRate = toNumber(row.assignment_rate, 0);

  return {
    id: String(row.student_id),
    studentCode: row.student_code ?? "-",
    name: row.name ?? "-",
    school: row.school_name ?? "-",
    grade: toDisplayGrade(row.grade),
    className: row.class_name ?? "-",
    subject: inferSubject(row.class_name, row.track),
    recentProgress: row.recent_progress_unit ?? "-",
    recentTag: row.recent_tag ?? "-",
    score: Math.max(0, toNumber(row.score, 0)),
    examDays: calcExamDays(row.exam_days_left, row.next_exam_date),
    nextExamDate: row.next_exam_date,
    overdueAssignments: Math.max(0, toNumber(row.overdue_assignments, 0)),
    assignmentDone: Math.max(0, assignmentDone),
    assignmentTotal: Math.max(0, assignmentTotal),
    assignmentRate: Math.max(0, assignmentRate),
    weakTopic: row.top_weak_topics ?? "-",
    status: toStatusLabel(row.status),
    note: row.note ?? "-",
  };
}

export default async function StudentsPage() {
  try {
    const rows = await getTeacherStudents();
    const students = rows.map(mapStudent);

    if (students.length === 0) {
      return (
        <div className="space-y-6">
          <section className="rounded-[28px] border border-dashed border-border bg-white px-6 py-10 text-center shadow-soft">
            <p className="text-base font-extrabold tracking-tight text-text">학생 데이터가 없습니다</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              `/api/teacher/students` 응답이 비어 있습니다. DB seed 또는 VIEW 결과를 확인해 주세요.
            </p>
          </section>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <StudentDirectory students={students} />
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <section className="rounded-[28px] border border-brand/25 bg-brand/5 px-6 py-10 text-center shadow-soft">
          <p className="text-base font-extrabold tracking-tight text-brand">학생 목록을 불러오지 못했습니다</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            `/api/teacher/students` 연결 상태를 확인해 주세요.
          </p>
          <p className="mt-2 text-xs text-muted">{error instanceof Error ? error.message : "unknown error"}</p>
        </section>
      </div>
    );
  }
}
