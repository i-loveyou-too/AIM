import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { InsightPanel } from "@/components/dashboard/insight-panel";
import { ExamAlert } from "@/components/dashboard/exam-alert";
import { loadTeacherDashboardPageData } from "@/lib/services/teacher.service";
import type { StatusTone, TeacherDashboardOperationsStatus } from "@/types/view/teacher";

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

function OperationsStatusCard({ status }: { status: TeacherDashboardOperationsStatus }) {
  if (status.unavailable) {
    return (
      <StateCard
        title="현재 데이터를 불러올 수 없습니다"
        message="운영 상태 카드 데이터를 불러오지 못했습니다."
        tone="peach"
      />
    );
  }

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
          <p className="mt-1 text-lg font-extrabold text-text">{status.imminent}개</p>
        </div>
        <div className="rounded-2xl border border-border bg-soft/40 px-4 py-3">
          <p className="text-xs text-muted">열린 이슈</p>
          <p className="mt-1 text-lg font-extrabold text-text">{status.openIssues}건</p>
        </div>
        <div className="rounded-2xl border border-border bg-soft/40 px-4 py-3">
          <p className="text-xs text-muted">제출 검토 필요</p>
          <p className="mt-1 text-lg font-extrabold text-text">{status.reviewCount}건</p>
        </div>
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  const data = await loadTeacherDashboardPageData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.cardsError ? (
          <div className="sm:col-span-2 xl:col-span-4">
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="대시보드 핵심 카드 API 호출에 실패했습니다."
              tone="peach"
            />
          </div>
        ) : (
          data.cards.map((item) => (
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
          {data.insightError ? (
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="인사이트 패널 API 호출에 실패했습니다."
              tone="peach"
            />
          ) : data.insightEmpty || !data.studentInsight ? (
            <StateCard title="표시할 인사이트가 없습니다" message="학생 또는 반 데이터가 비어 있습니다." />
          ) : (
            <InsightPanel classInsights={data.classInsights} studentInsight={data.studentInsight} />
          )}

          {data.scheduleError ? (
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="오늘 수업 일정 API 호출에 실패했습니다."
              tone="peach"
            />
          ) : data.scheduleItems.length === 0 ? (
            <StateCard title="오늘 수업 일정이 없습니다" message="`/api/teacher/today-lessons` 결과가 비어 있습니다." />
          ) : (
            <TodaySchedule items={data.scheduleItems} />
          )}
        </div>

        <div className="space-y-6">
          <OperationsStatusCard status={data.operationsStatus} />
          <ExamAlert schools={data.examSchools} />

          {data.recentError ? (
            <StateCard
              title="현재 데이터를 불러올 수 없습니다"
              message="실시간 알림 데이터 API 호출에 실패했습니다."
              tone="peach"
            />
          ) : data.recentItems.length === 0 ? (
            <StateCard title="표시할 최근 활동이 없습니다" message="최근 활동으로 표시할 실데이터가 없습니다." />
          ) : (
            <RecentActivity items={data.recentItems} />
          )}

          <QuickActions items={data.quickActionItems} />
        </div>
      </section>
    </div>
  );
}
