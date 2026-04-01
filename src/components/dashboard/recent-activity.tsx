type RecentActivityItem = {
  time: string;
  student: string;
  action: string;
  detail: string;
  kind?: "success" | "info" | "warning";
};

type RecentActivityProps = {
  items: RecentActivityItem[];
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-white p-4 shadow-soft">
      <div>
        <p className="text-sm font-medium text-muted">실시간 알림</p>
        <h2 className="mt-1.5 text-xl font-semibold text-text">방금 반영된 변화를 빠르게 확인합니다</h2>
      </div>

      <div className="mt-4 space-y-3.5">
        {items.map((item, index) => (
          <div key={`${item.time}-${item.student}-${index}`} className="flex gap-3.5">
            <div className="flex flex-col items-center pt-1">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm ${
                  item.kind === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : item.kind === "warning"
                      ? "bg-brand/10 text-brand"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {item.kind === "success" ? "✓" : item.kind === "warning" ? "!" : "✉"}
              </span>
              {index < items.length - 1 ? <span className="mt-2 h-full w-px flex-1 bg-border" /> : null}
            </div>

            <article className="flex-1 rounded-xl border border-border bg-[#fafafa] p-3.5 transition duration-200 hover:border-brand/30 hover:shadow-glow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{item.action}</p>
                  <p className="mt-1 text-sm leading-5 text-muted">{item.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted shadow-sm">
                  {item.time}
                </span>
              </div>

              <p className="mt-2.5 text-sm font-medium text-brand">{item.student}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
