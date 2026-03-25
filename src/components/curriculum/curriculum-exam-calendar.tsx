// 시험일 역산 캘린더 — 실제 달력 그리드 (3월·4월 2-month view)

import type { CurriculumPageData } from "@/lib/curriculum-mock-data";

type CalendarItem = CurriculumPageData["calendar"]["items"][number];
type Props = { calendar: CurriculumPageData["calendar"] };

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

// tone별 스타일 (날짜 셀 강조)
const toneCell: Record<CalendarItem["tone"], { dot: string; chip: string; text: string; ring: string }> = {
  today:  { dot: "bg-brand",        chip: "bg-brand text-white",           text: "text-brand font-extrabold",  ring: "ring-2 ring-brand/40" },
  lesson: { dot: "bg-muted/40",      chip: "bg-soft text-muted",            text: "text-text font-semibold",    ring: "ring-1 ring-border" },
  boost:  { dot: "bg-warm",          chip: "bg-warm/70 text-[#7a6200]",     text: "text-[#7a6200] font-bold",   ring: "ring-2 ring-warm/50" },
  check:  { dot: "bg-accent",        chip: "bg-accent/10 text-accent",      text: "text-accent font-bold",      ring: "ring-2 ring-accent/30" },
  exam:   { dot: "bg-brand",         chip: "bg-brand text-white",           text: "text-brand font-extrabold",  ring: "ring-2 ring-brand/60" },
};

// "3/24" → { month: 3, day: 24 }
function parseDate(str: string): { month: number; day: number } {
  const [m, d] = str.split("/").map(Number);
  return { month: m, day: d };
}

// 특정 연·월의 달력 셀 배열 생성 (null = 빈 칸, number = 날짜)
function buildCalendarCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=일
  const startOffset = (firstDow + 6) % 7; // 월요일 시작으로 변환
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // 마지막 줄 채우기
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function MonthCalendar({
  year,
  month,
  label,
  eventMap,
}: {
  year: number;
  month: number;
  label: string;
  eventMap: Map<number, CalendarItem>;
}) {
  const cells = buildCalendarCells(year, month);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div>
      {/* 월 제목 */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-extrabold text-text">{label}</span>
        {month === 4 && (
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand">
            시험월
          </span>
        )}
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`py-1 text-center text-[10px] font-bold tracking-wide ${
              i === 5 ? "text-brand/60" : i === 6 ? "text-brand/40" : "text-muted/70"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-0.5">
            {week.map((day, di) => {
              if (day === null) {
                return <div key={di} className="h-12" />;
              }

              const event = eventMap.get(day);
              const tone = event ? toneCell[event.tone] : null;
              const isWeekend = di === 5 || di === 6;

              return (
                <div
                  key={di}
                  className={`relative flex h-12 flex-col items-center justify-start rounded-xl pt-1.5 transition ${
                    event ? `${tone!.ring} bg-white shadow-sm` : "hover:bg-soft/60"
                  }`}
                >
                  {/* 날짜 숫자 */}
                  <span
                    className={`text-xs leading-none ${
                      event
                        ? tone!.text
                        : isWeekend
                        ? "text-muted/50"
                        : "text-text/70"
                    }`}
                  >
                    {day}
                  </span>

                  {/* 이벤트 칩 */}
                  {event && (
                    <span
                      className={`mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${tone!.chip}`}
                    >
                      {event.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CurriculumExamCalendar({ calendar }: Props) {
  // 이벤트를 { month → Map<day, item> } 구조로 변환
  const marchMap = new Map<number, CalendarItem>();
  const aprilMap = new Map<number, CalendarItem>();

  for (const item of calendar.items) {
    const { month, day } = parseDate(item.date);
    if (month === 3) marchMap.set(day, item);
    else if (month === 4) aprilMap.set(day, item);
  }

  const YEAR = 2024;

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          시험일 역산 캘린더
        </p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          {calendar.monthLabel} 일정 달력
        </h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
            {calendar.periodLabel}
          </span>
          <span className="rounded-full bg-warm/50 px-3 py-1 text-xs font-semibold text-[#7a6200]">
            {calendar.note}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* 범례 */}
        <div className="flex flex-wrap gap-3">
          {[
            { tone: "today" as const,  label: "오늘" },
            { tone: "lesson" as const, label: "수업" },
            { tone: "boost" as const,  label: "보강" },
            { tone: "check" as const,  label: "점검" },
            { tone: "exam" as const,   label: "시험" },
          ].map(({ tone, label }) => (
            <div key={tone} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${toneCell[tone].dot}`} />
              <span className="text-[11px] font-medium text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* 2-month 달력 */}
        <div className="grid gap-6 sm:grid-cols-2">
          <MonthCalendar
            year={YEAR}
            month={3}
            label="3월"
            eventMap={marchMap}
          />
          <MonthCalendar
            year={YEAR}
            month={4}
            label="4월"
            eventMap={aprilMap}
          />
        </div>

        {/* 이벤트 목록 (날짜순) */}
        <div className="rounded-2xl border border-border/60 bg-soft px-4 py-4">
          <p className="mb-3 text-[11px] font-bold text-muted uppercase tracking-[0.14em]">일정 목록</p>
          <div className="space-y-2">
            {calendar.items.map((item) => {
              const t = toneCell[item.tone];
              return (
                <div key={`${item.date}-${item.title}`} className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${t.chip}`}>
                    {item.date}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${t.text}`}>{item.title}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${t.chip}`}>{item.label}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted truncate">{item.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
