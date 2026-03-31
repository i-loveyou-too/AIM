export function StudentHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-brand">Aim ON</span>
        <span className="text-muted">|</span>
        <h1 className="text-base font-semibold text-text">{title}</h1>
      </div>
    </header>
  );
}
