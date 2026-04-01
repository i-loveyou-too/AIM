import type { StudentDetailData } from "@/types/student-detail";

const CX = 140;
const CY = 140;
const MAX_R = 88;
const LABEL_R = 108;

const AXES = [
  { label: "수학", angle: -90 },
  { label: "영어", angle: -18 },
  { label: "과학", angle: 54 },
  { label: "국어", angle: 126 },
  { label: "역사", angle: 198 },
];

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function axisPoint(angle: number, r: number): [number, number] {
  return [CX + Math.cos(toRad(angle)) * r, CY + Math.sin(toRad(angle)) * r];
}
function textAnchor(angle: number): "start" | "end" | "middle" {
  const cos = Math.cos(toRad(angle));
  if (cos > 0.25) return "start";
  if (cos < -0.25) return "end";
  return "middle";
}

function buildSubjectScores(detail: StudentDetailData): number[] {
  const s = detail.student.score;
  const weak = detail.weaknesses.topics.join(" ").toLowerCase();
  const mathWeak = /수학|미적분|삼각|확률|벡터|수열|통계/.test(weak);
  const engWeak = /영어|독해|어법|읽기/.test(weak);
  const sciWeak = /과학|물리|화학|생물|지구/.test(weak);
  const korWeak = /국어|문학|독서|비문학|화법/.test(weak);

  return [
    mathWeak ? Math.max(38, s - 22) : Math.min(96, s + 4),   // 수학
    engWeak  ? Math.max(42, s - 16) : Math.min(94, s + 8),   // 영어
    sciWeak  ? Math.max(40, s - 20) : Math.min(90, s + 5),   // 과학
    korWeak  ? Math.max(44, s - 14) : Math.min(92, s + 2),   // 국어
    Math.min(88, Math.max(45, s - 6)),                        // 역사 (neutral)
  ].map(v => Math.max(25, Math.min(100, Math.round(v))));
}

export function ReportSubjectBalance({ detail }: { detail: StudentDetailData }) {
  const scores = buildSubjectScores(detail);

  const studentPolygon = AXES.map(({ angle }, i) => {
    const [x, y] = axisPoint(angle, MAX_R * (scores[i] / 100));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const gridRatios = [0.25, 0.5, 0.75, 1.0];

  return (
    <article className="rounded-[28px] border border-border/80 bg-white p-5 shadow-soft sm:p-6">
      <div>
        <h2 className="text-[1.1rem] font-extrabold tracking-tight text-text">Subject Balance</h2>
        <p className="mt-1 text-xs text-muted">영역별 핵심 역량 밸런스</p>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <svg viewBox="0 0 280 280" className="w-full max-w-[240px]" aria-hidden="true">
          {/* Grid rings */}
          {gridRatios.map((ratio) => {
            const pts = AXES.map(({ angle }) => {
              const [x, y] = axisPoint(angle, MAX_R * ratio);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(" ");
            return (
              <polygon
                key={ratio}
                points={pts}
                fill="none"
                stroke={ratio === 1.0 ? "#D9D9D9" : "#EBEBEB"}
                strokeWidth="1"
              />
            );
          })}

          {/* Axis spokes */}
          {AXES.map(({ angle, label }) => {
            const [x, y] = axisPoint(angle, MAX_R);
            return (
              <line key={label} x1={CX} y1={CY} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#E2E2E2" strokeWidth="1" />
            );
          })}

          {/* Student filled polygon */}
          <polygon
            points={studentPolygon}
            fill="rgba(240, 68, 82, 0.14)"
            stroke="#F04452"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Vertex dots */}
          {AXES.map(({ angle }, i) => {
            const [x, y] = axisPoint(angle, MAX_R * (scores[i] / 100));
            return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.5" fill="#F04452" />;
          })}

          {/* Labels */}
          {AXES.map(({ angle, label }) => {
            const [x, y] = axisPoint(angle, LABEL_R);
            const anchor = textAnchor(angle);
            return (
              <text
                key={label}
                x={x.toFixed(1)}
                y={y.toFixed(1)}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="700"
                fill="#1F1F23"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Score chips */}
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {AXES.map(({ label }, i) => (
          <span
            key={label}
            className="rounded-full bg-soft px-2.5 py-1 text-[10px] font-semibold text-muted"
          >
            {label} {scores[i]}%
          </span>
        ))}
      </div>
    </article>
  );
}
