// 성취도 추이 차트 — SVG 기반 라인 차트 (외부 라이브러리 없음)
// 최근 8회차 점수 변화를 선·점·라벨로 시각화

const W = 640;   // viewBox 가로
const H = 180;   // viewBox 세로 (라벨 제외)
const PAD_LEFT  = 36;
const PAD_RIGHT = 16;
const PAD_TOP   = 16;
const PAD_BTM   = 8;

const MIN_SCORE = 40;
const MAX_SCORE = 100;

type AchievementPoint = {
  score: number;
  date: string;
  session: string;
  note?: string;
};

function toX(index: number, total: number): number {
  const usable = W - PAD_LEFT - PAD_RIGHT;
  return PAD_LEFT + (index / (total - 1)) * usable;
}

function toY(score: number): number {
  const usable = H - PAD_TOP - PAD_BTM;
  return PAD_TOP + ((MAX_SCORE - score) / (MAX_SCORE - MIN_SCORE)) * usable;
}

export function AchievementTrendChart({ data }: { data: AchievementPoint[] }) {
  if (!data || data.length === 0) {
    return (
      <section className="rounded-[28px] border border-border/80 bg-white px-6 py-8 shadow-soft">
        <p className="text-sm font-semibold text-muted">성취도 추이 데이터가 없습니다.</p>
      </section>
    );
  }

  const total = data.length;

  // 폴리라인 포인트 문자열
  const points = data
    .map((d, i) => `${toX(i, total)},${toY(d.score)}`)
    .join(" ");

  // 영역 채우기 path
  const areaPath = [
    `M ${toX(0, total)},${toY(data[0].score)}`,
    ...data.map((d, i) => `L ${toX(i, total)},${toY(d.score)}`),
    `L ${toX(total - 1, total)},${H - PAD_BTM}`,
    `L ${toX(0, total)},${H - PAD_BTM}`,
    "Z",
  ].join(" ");

  // 목표선 Y (85점)
  const targetY = toY(85);

  return (
    <section className="rounded-[28px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">성취도 추이</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-tight text-text">
          최근 8회차 성취도 변화
        </h2>
        <p className="mt-1 text-sm text-muted">
          회차별 점수와 목표 점수(85점) 대비 달성 흐름을 확인하세요.
        </p>
      </div>

      <div className="px-6 py-5">
        {/* 최신값 요약 */}
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[1.8rem] font-extrabold tracking-tight text-brand">
              {data[data.length - 1].score}점
            </span>
            <span className="text-sm font-semibold text-muted">최신 성취도</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
            <span>↑</span>
            <span>
              {data[data.length - 1].score - data[0].score > 0 ? "+" : ""}
              {data[data.length - 1].score - data[0].score}점 (4주간)
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-brand">
              <span className="h-0.5 w-5 rounded-full bg-brand" /> 실제 성취도
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <span className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-muted/50" /> 목표 85점
            </span>
          </div>
        </div>

        {/* SVG 차트 */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H + 48}`}
            className="w-full min-w-[400px]"
            aria-label="성취도 추이 라인 차트"
          >
            {/* 그리드 라인 */}
            {[60, 70, 80, 90].map((score) => {
              const y = toY(score);
              return (
                <g key={score}>
                  <line
                    x1={PAD_LEFT} y1={y} x2={W - PAD_RIGHT} y2={y}
                    stroke="#E9E9EE" strokeWidth="1"
                  />
                  <text x={PAD_LEFT - 6} y={y + 4} textAnchor="end"
                    fontSize="10" fill="#6B6B76">
                    {score}
                  </text>
                </g>
              );
            })}

            {/* 목표선 (85점) */}
            <line
              x1={PAD_LEFT} y1={targetY} x2={W - PAD_RIGHT} y2={targetY}
              stroke="#6B6B76" strokeWidth="1.5" strokeDasharray="5,4"
            />
            <text x={W - PAD_RIGHT + 2} y={targetY + 4}
              fontSize="10" fill="#6B6B76">목표</text>

            {/* 영역 채우기 */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#F04452" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#F04452" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* 라인 */}
            <polyline
              points={points}
              fill="none" stroke="#F04452" strokeWidth="2.5" strokeLinejoin="round"
            />

            {/* 점 + 라벨 */}
            {data.map((d, i) => {
              const cx = toX(i, total);
              const cy = toY(d.score);
              const isLast = i === total - 1;
              return (
                <g key={i}>
                  {/* 점 */}
                  <circle cx={cx} cy={cy} r={isLast ? 6 : 4}
                    fill={isLast ? "#F04452" : "#fff"}
                    stroke="#F04452" strokeWidth="2.5"
                  />
                  {/* 점수 라벨 */}
                  <text x={cx} y={cy - 10} textAnchor="middle"
                    fontSize={isLast ? "12" : "10"}
                    fontWeight={isLast ? "700" : "500"}
                    fill={isLast ? "#F04452" : "#1F1F23"}>
                    {d.score}
                  </text>
                  {/* X축 라벨 (날짜) */}
                  <text x={cx} y={H + 20} textAnchor="middle"
                    fontSize="10" fill="#6B6B76">
                    {d.date}
                  </text>
                  <text x={cx} y={H + 34} textAnchor="middle"
                    fontSize="9" fill="#9ca3af">
                    {d.session}
                  </text>
                  {/* 특이사항 노트 */}
                  {d.note && (
                    <text x={cx} y={cy - 22} textAnchor="middle"
                      fontSize="9" fill="#FF7A59">
                      {d.note.length > 8 ? d.note.slice(0, 8) + "…" : d.note}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
