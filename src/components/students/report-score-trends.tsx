import type { StudentDetailData } from "@/types/student-detail";

const MONTHS = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"];
const AVG_SCORES = [64, 65, 65, 66, 67, 67];
const XS = [60, 156, 252, 348, 444, 540];

function buildTrend(score: number): number[] {
  const base = Math.max(45, score - 38);
  const step = (score - base) / 5;
  return Array.from({ length: 6 }, (_, i) =>
    Math.max(40, Math.min(100, Math.round(base + step * i)))
  );
}

function scoreToY(score: number): number {
  // score 40→170, 100→20  (150px height)
  return 170 - ((score - 40) / 60) * 150;
}

function toPoints(scores: number[]): string {
  return scores.map((s, i) => `${XS[i]},${scoreToY(s).toFixed(1)}`).join(" ");
}

export function ReportScoreTrends({ detail }: { detail: StudentDetailData }) {
  const studentScores = buildTrend(detail.student.score);
  const studentPoints = toPoints(studentScores);
  const avgPoints = toPoints(AVG_SCORES);
  const lastScore = studentScores[5];
  const lastX = XS[5];
  const lastY = scoreToY(lastScore);

  const gridLines = [
    { score: 100, y: scoreToY(100) },
    { score: 80, y: scoreToY(80) },
    { score: 60, y: scoreToY(60) },
    { score: 40, y: scoreToY(40) },
  ];

  // Area fill polygon: student line + bottom edge
  const areaPoints = `${studentPoints} ${lastX},170 60,170`;

  return (
    <article className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            <h2 className="text-[1.1rem] font-extrabold tracking-tight text-text">Score Trends</h2>
          </div>
          <p className="mt-1 text-xs text-muted">최근 6개월 성취도 변화 추이</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-full bg-brand" />
            {detail.student.name}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-px w-5 border-t-2 border-dashed border-[#CCCCCC]" />
            전체 평균
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden">
        <svg viewBox="0 0 600 210" className="w-full" aria-hidden="true">
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F04452" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F04452" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines + Y labels */}
          {gridLines.map(({ score, y }) => (
            <g key={score}>
              <line x1="50" y1={y} x2="560" y2={y} stroke="#E9E9EE" strokeWidth="1" />
              <text x="42" y={y + 4} textAnchor="end" fontSize="10" fill="#6B6B76">{score}</text>
            </g>
          ))}

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#trendGrad)" />

          {/* Average line (dashed) */}
          <polyline
            points={avgPoints}
            fill="none"
            stroke="#CCCCCC"
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />

          {/* Student line */}
          <polyline
            points={studentPoints}
            fill="none"
            stroke="#F04452"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Intermediate data points */}
          {studentScores.slice(0, 5).map((score, i) => (
            <circle
              key={MONTHS[i]}
              cx={XS[i]}
              cy={scoreToY(score)}
              r="3.5"
              fill="#fff"
              stroke="#F04452"
              strokeWidth="2"
            />
          ))}

          {/* Last point (highlighted) */}
          <circle cx={lastX} cy={lastY} r="6" fill="#F04452" />
          <circle cx={lastX} cy={lastY} r="9" fill="none" stroke="#F04452" strokeWidth="1.5" strokeOpacity="0.35" />
          <text
            x={lastX}
            y={lastY - 14}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#F04452"
          >
            {lastScore}
          </text>

          {/* Month labels */}
          {MONTHS.map((month, i) => (
            <text
              key={month}
              x={XS[i]}
              y="195"
              textAnchor="middle"
              fontSize="10"
              fontWeight={i === 5 ? "700" : "400"}
              fill={i === 5 ? "#F04452" : "#6B6B76"}
            >
              {month}
            </text>
          ))}
        </svg>
      </div>
    </article>
  );
}
