type FeatureComingSoonProps = {
  title?: string;
  description?: string;
};

export function FeatureComingSoon({
  title = "기능 준비중",
  description = "아직 데이터 연동이 완료되지 않았습니다. SQL/DB 연결 완료 후 화면이 활성화됩니다.",
}: FeatureComingSoonProps) {
  return (
    <section className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
      <p className="text-sm font-semibold text-brand">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </section>
  );
}
