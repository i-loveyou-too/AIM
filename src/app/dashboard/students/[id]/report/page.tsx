import type { Metadata } from "next";
import Link from "next/link";
import { ReportHeader } from "@/components/students/report-header";
import { ReportKpiStrip } from "@/components/students/report-kpi-strip";
import { ReportScoreTrends } from "@/components/students/report-score-trends";
import { ReportSubjectBalance } from "@/components/students/report-subject-balance";
import { ReportWeakPoint } from "@/components/students/report-weak-point";
import { ReportStudyHabits } from "@/components/students/report-study-habits";
import { ReportAiStrategy } from "@/components/students/report-ai-strategy";
import { getTeacherStudentDetail } from "@/lib/api/teacher";
import { toStudentDetailData } from "@/lib/services/student-detail.service";

export const metadata: Metadata = {
  title: "학생 리포트 | Aim ON",
  description: "학생 성취 추이, 과목 밸런스, 취약점, 학습 습관, AI 전략을 종합 분석한 리포트입니다.",
};

type PageProps = {
  params: {
    id: string;
  };
};

function NotFoundState({ id }: { id: string }) {
  return (
    <main className="space-y-6">
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-10 shadow-soft">
        <p className="text-base font-extrabold tracking-tight text-text">학생 리포트 데이터가 없습니다</p>
        <p className="mt-2 text-sm text-muted">요청한 학생의 리포트 데이터가 없습니다.</p>
        <div className="mt-4 flex gap-3">
          <Link
            href={`/dashboard/students/${id}`}
            className="inline-flex rounded-full border border-border bg-soft px-4 py-2 text-xs font-semibold text-text hover:border-brand/30 hover:text-brand transition"
          >
            ← 학생 상세 보기
          </Link>
          <Link
            href="/dashboard/students"
            className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand"
          >
            학생 목록으로
          </Link>
        </div>
      </section>
    </main>
  );
}

export default async function StudentReportPage({ params }: PageProps) {
  const studentId = Number(params.id);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    return <NotFoundState id={params.id} />;
  }

  try {
    const result = await getTeacherStudentDetail(studentId);
    if (result.status === 404 || !result.data) {
      return <NotFoundState id={params.id} />;
    }

    const detail = toStudentDetailData(result.data);

    return (
      <main className="space-y-5">
        <ReportHeader detail={detail} studentId={params.id} />
        <ReportKpiStrip detail={detail} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)]">
          <ReportScoreTrends detail={detail} />
          <ReportSubjectBalance detail={detail} />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <ReportWeakPoint detail={detail} />
          <ReportStudyHabits detail={detail} />
        </div>
        <ReportAiStrategy detail={detail} />
      </main>
    );
  } catch (error) {
    return (
      <main className="space-y-6">
        <section className="rounded-[28px] border border-brand/25 bg-brand/5 px-6 py-10 shadow-soft">
          <p className="text-base font-extrabold tracking-tight text-brand">리포트를 불러오지 못했습니다</p>
          <p className="mt-2 text-xs text-muted">
            {error instanceof Error ? error.message : "unknown error"}
          </p>
        </section>
      </main>
    );
  }
}
