"use client";

import { useEffect, useMemo, useState } from "react";
import { StudentFilters } from "@/components/students/student-filters";
import { StudentOverview, type OverviewKey } from "@/components/students/student-overview";
import { StudentTable } from "@/components/students/student-table";
import type { StudentRecord } from "@/lib/mock-data/index";

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
  const [grade, setGrade] = useState("전체");
  const [subject, setSubject] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [sortBy, setSortBy] = useState<SortBy>("examDays");
  const [overviewFilter, setOverviewFilter] = useState<OverviewKey>("all");
  const [page, setPage] = useState(1);

  const schoolOptions = useMemo(() => buildOptions(uniqueValues(students, "school")), [students]);
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
  }, [overviewFilter, search, school, grade, subject, status, sortBy]);

  const baseFilteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      if (school !== "전체" && student.school !== school) return false;
      if (grade !== "전체" && student.grade !== grade) return false;
      if (subject !== "전체" && student.subject !== subject) return false;
      if (status !== "전체" && student.status !== status) return false;

      if (!query) return true;

      const haystack = [
        student.id,
        student.name,
        student.school,
        student.grade,
        student.className,
        student.subject,
        student.recentProgress,
        student.recentTag,
        student.status,
        student.weakTopic,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [grade, school, search, students, status, subject]);

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

  const pageSize = 4;
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
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-brand">
              학생 관리
            </span>
            <div>
              <h2 className="text-[1.45rem] font-extrabold tracking-tight text-text sm:text-[1.7rem]">
                학생 목록을 필터로 바로 좁혀보세요
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                학교 선택, 학년 선택, 과목 선택을 분리해서 원하는 학생만 빠르게 볼 수 있습니다.
              </p>
            </div>
          </div>
          <div className="rounded-[22px] border border-border bg-soft px-4 py-3 text-sm font-semibold text-text shadow-sm">
            {overviewFilter === "urgent"
              ? "현재 보기: 시험 임박 학생만"
              : overviewFilter === "attention"
                ? "현재 보기: 관리 필요 학생만"
                : overviewFilter === "tasks"
                  ? "현재 보기: 미완료 과제 많은 학생만"
                  : "현재 보기: 전체 학생"}
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
        grade={grade}
        subject={subject}
        status={status}
        sortBy={sortBy}
        schoolOptions={schoolOptions}
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
        onSchoolChange={setSchool}
        onGradeChange={setGrade}
        onSubjectChange={setSubject}
        onStatusChange={setStatus}
        onSortChange={(value) => setSortBy(value as SortBy)}
        onReset={() => {
          setSearch("");
          setSchool("전체");
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
