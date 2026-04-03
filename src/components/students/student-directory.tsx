"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudentFilters } from "@/components/students/student-filters";
import { StudentOverview, type OverviewKey } from "@/components/students/student-overview";
import { StudentTable } from "@/components/students/student-table";

type StudentRecord = {
  id: string;
  studentCode?: string | null;
  name: string;
  school: string;
  className: string;
  grade: string;
  subject: string;
  status: string;
  recentProgress: string;
  recentTag: string;
  score: number;
  examDays: number;
  overdueAssignments: number;
  assignmentDone: number;
  assignmentTotal: number;
  assignmentRate?: number;
  weakTopic: string;
  nextExamDate?: string | null;
};

type StudentDirectoryProps = {
  students: StudentRecord[];
};

type SortBy = "name" | "score" | "examDays" | "overdueAssignments" | "school";

const gradeOrdering = ["고1", "고2", "고3"];
const statusOrdering = ["상승", "안정", "주의", "시험 임박"];
const subjectOrdering = ["국어", "영어", "수학", "과학"];

function uniqueValues(items: StudentRecord[], key: keyof StudentRecord) {
  return Array.from(new Set(items.map((item) => item[key] as string)));
}

function sortStudents(items: StudentRecord[], sortBy: SortBy, overviewFilter: OverviewKey) {
  const effectiveSortBy = overviewFilter === "tasks" ? "overdueAssignments" : sortBy;

  return [...items].sort((a, b) => {
    if (effectiveSortBy === "name") return a.name.localeCompare(b.name, "ko");
    if (effectiveSortBy === "school") return a.school.localeCompare(b.school, "ko") || a.name.localeCompare(b.name, "ko");
    if (effectiveSortBy === "score") return b.score - a.score || a.name.localeCompare(b.name, "ko");
    if (effectiveSortBy === "examDays") return a.examDays - b.examDays || b.score - a.score;
    if (effectiveSortBy === "overdueAssignments") return b.overdueAssignments - a.overdueAssignments || a.name.localeCompare(b.name, "ko");
    return 0;
  });
}

function buildOptions(values: string[], includeAll = true) {
  const options = values.map((value) => ({ label: value, value }));
  return includeAll ? [{ label: "전체", value: "전체" }, ...options] : options;
}

export function StudentDirectory({ students }: StudentDirectoryProps) {
  const [search, setSearch] = useState("");
  const [school, setSchool] = useState("전체");
  const [className, setClassName] = useState("전체");
  const [grade, setGrade] = useState("전체");
  const [subject, setSubject] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [sortBy, setSortBy] = useState<SortBy>("examDays");
  const [overviewFilter, setOverviewFilter] = useState<OverviewKey>("all");
  const [page, setPage] = useState(1);

  const schoolOptions = useMemo(() => buildOptions(uniqueValues(students, "school")), [students]);
  // 반 옵션 — 선택한 학교에 해당하는 반만 표시
  const classNameOptions = useMemo(() => {
    const base = school === "전체" ? students : students.filter((s) => s.school === school);
    const names = Array.from(new Set(base.map((s) => s.className))).sort((a, b) =>
      a.localeCompare(b, "ko"),
    );
    return buildOptions(names);
  }, [students, school]);
  const gradeOptions = useMemo(
    () => [{ label: "전체", value: "전체" }, ...gradeOrdering.map((value) => ({ label: value, value }))],
    [],
  );
  const subjectOptions = useMemo(
    () => [{ label: "전체", value: "전체" }, ...subjectOrdering.map((value) => ({ label: value, value }))],
    [],
  );
  const statusOptions = useMemo(
    () => [{ label: "전체", value: "전체" }, ...statusOrdering.map((value) => ({ label: value, value }))],
    [],
  );
  const sortOptions = useMemo(
    () => [
      { label: "시험 임박순", value: "examDays" },
      { label: "성취도순", value: "score" },
      { label: "학교순", value: "school" },
      { label: "이름순", value: "name" },
      { label: "미완료 과제순", value: "overdueAssignments" },
    ],
    [],
  );

  // 필터가 바뀌면 첫 페이지부터 다시 보여줍니다.
  useEffect(() => {
    setPage(1);
  }, [overviewFilter, search, school, className, grade, subject, status, sortBy]);

  const baseFilteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      if (school !== "전체" && student.school !== school) return false;
      if (className !== "전체" && student.className !== className) return false;
      if (grade !== "전체" && student.grade !== grade) return false;
      if (subject !== "전체" && student.subject !== subject) return false;
      if (status !== "전체" && student.status !== status) return false;

      if (!query) return true;

      const haystack = [
        student.id,
        student.studentCode ?? "",
        student.name,
        student.school,
        student.grade,
        student.className,
        student.subject,
        student.recentProgress,
        student.recentTag,
        student.status,
        student.weakTopic,
        student.nextExamDate ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [className, grade, school, search, students, status, subject]);

  const filteredStudents = useMemo(() => {
    return baseFilteredStudents.filter((student) => {
      if (overviewFilter === "attention") {
        const needsAttention =
          student.status === "주의" || student.status === "시험 임박" || student.overdueAssignments > 0;
        return needsAttention;
      }

      if (overviewFilter === "urgent") {
        return student.examDays <= 14;
      }

      if (overviewFilter === "tasks") {
        return student.overdueAssignments > 0;
      }

      return true;
    });
  }, [baseFilteredStudents, overviewFilter]);

  const sortedStudents = useMemo(
    () => sortStudents(filteredStudents, sortBy, overviewFilter),
    [filteredStudents, overviewFilter, sortBy],
  );

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStudents = sortedStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const overviewCards = useMemo(() => {
    const attention = baseFilteredStudents.filter(
      (student) => student.status === "주의" || student.status === "시험 임박" || student.overdueAssignments > 0,
    ).length;
    const urgent = baseFilteredStudents.filter((student) => student.examDays <= 14).length;
    const tasks = baseFilteredStudents.reduce((total, student) => total + student.overdueAssignments, 0);

    return [
      {
        key: "all" as const,
        label: "전체 학생",
        value: `${baseFilteredStudents.length}명`,
        note: school === "전체" ? "전체 학교 기준 학생 수입니다." : `${school} 기준으로 필터링되었습니다.`,
        tone: "rose" as const,
        emoji: "👥",
        badge: "전체",
      },
      {
        key: "attention" as const,
        label: "관리 필요",
        value: `${attention}명`,
        note: "주의와 미완료 과제를 함께 확인합니다.",
        tone: "peach" as const,
        emoji: "⚠️",
        badge: "필터",
      },
      {
        key: "urgent" as const,
        label: "시험 임박",
        value: `${urgent}명`,
        note: "D-14 이내 학생을 우선 점검합니다.",
        tone: "gold" as const,
        emoji: "⏰",
        badge: "D-14",
      },
      {
        key: "tasks" as const,
        label: "미완료 과제",
        value: `${tasks}건`,
        note: "과제 누락이 쌓이지 않도록 확인합니다.",
        tone: "soft" as const,
        emoji: "📝",
        badge: "과제",
      },
    ];
  }, [baseFilteredStudents, school]);

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
              학생 관리
            </span>
            <div>
              <h2 className="text-[1.3rem] font-extrabold tracking-tight text-text sm:text-[1.5rem]">
                김민정 선생님! 학생들을 한눈에 확인하세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                학교, 학년, 과목 기준으로 학생 상태를 빠르게 확인하고 필요한 학생부터 우선 관리할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Link
              href="/dashboard/students/register"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0"
            >
              <span className="text-base leading-none">+</span>
              학생 등록
            </Link>
          </div>
        </div>
      </div>

      <StudentOverview
        cards={overviewCards}
        activeKey={overviewFilter}
        onSelect={(key) => setOverviewFilter(key)}
      />

      <StudentFilters
        search={search}
        school={school}
        className={className}
        grade={grade}
        subject={subject}
        status={status}
        sortBy={sortBy}
        schoolOptions={schoolOptions}
        classNameOptions={classNameOptions}
        gradeOptions={gradeOptions}
        subjectOptions={subjectOptions}
        statusOptions={statusOptions}
        sortOptions={sortOptions}
        quickFilterLabel={
          overviewFilter === "all"
            ? undefined
            : overviewFilter === "attention"
              ? "관리 필요"
              : overviewFilter === "urgent"
                ? "시험 임박"
                : "미완료 과제"
        }
        onSearchChange={setSearch}
        onSchoolChange={(value) => { setSchool(value); setClassName("전체"); }}
        onClassNameChange={setClassName}
        onGradeChange={setGrade}
        onSubjectChange={setSubject}
        onStatusChange={setStatus}
        onSortChange={(value) => setSortBy(value as SortBy)}
        onReset={() => {
          setSearch("");
          setSchool("전체");
          setClassName("전체");
          setGrade("전체");
          setSubject("전체");
          setStatus("전체");
          setSortBy("examDays");
          setOverviewFilter("all");
        }}
      />

      <StudentTable
        students={pageStudents}
        page={currentPage}
        totalPages={totalPages}
        totalCount={sortedStudents.length}
        onPageChange={setPage}
      />
    </section>
  );
}
