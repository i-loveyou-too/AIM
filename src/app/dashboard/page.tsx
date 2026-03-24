import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { InsightPanel } from "@/components/dashboard/insight-panel";
import { ExamAlert } from "@/components/dashboard/exam-alert";
import {
  aiInsights,
  quickActions,
  recentActivity,
  summaryStats,
  todaySchedule,
} from "@/lib/mock-data/index";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((item) => (
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
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <InsightPanel
            classInsights={aiInsights.classInsights}
            studentInsight={aiInsights.studentInsight}
          />
          <TodaySchedule items={todaySchedule} />
        </div>

        <div className="space-y-6">
          <ExamAlert />
          <RecentActivity items={recentActivity} />
          <QuickActions items={quickActions} />
        </div>
      </section>
    </div>
  );
}
