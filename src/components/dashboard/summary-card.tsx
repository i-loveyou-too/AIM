import Link from "next/link";

type SummaryCardProps = {
  label: string;
  value: string;
  note: string;
  tone: "rose" | "gold" | "peach" | "soft";
  emoji: string;
  badge: string;
  href?: string;
};

const toneStyles = {
  rose: {
    badge: "bg-brand/10 text-brand",
    icon: "bg-brand/10 text-brand",
  },
  gold: {
    badge: "bg-warm/70 text-text",
    icon: "bg-warm/80 text-text",
  },
  peach: {
    badge: "bg-accent/10 text-accent",
    icon: "bg-accent/10 text-accent",
  },
  soft: {
    badge: "bg-soft text-brand",
    icon: "bg-soft text-brand",
  },
};

export function SummaryCard({ label, value, note, tone, emoji, badge, href }: SummaryCardProps) {
  const styles = toneStyles[tone];
  const Card = (
    <section className="group rounded-[28px] border border-border/80 bg-white/80 p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${styles.icon}`}>
          <span aria-hidden="true">{emoji}</span>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${styles.badge}`}>
          {badge}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-[1.45rem] font-extrabold tracking-tight text-text sm:text-[1.75rem]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">{note}</p>
    </section>
  );

  if (!href) {
    return Card;
  }

  return (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2">
      {Card}
    </Link>
  );
}
