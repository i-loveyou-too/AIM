type HeaderProps = {
  title: string;
  greeting: string;
  profile: {
    name: string;
    role: string;
    initials: string;
  };
};

export function Header({ title, greeting, profile }: HeaderProps) {
  return (
    <header className="px-0.5 py-0.5 sm:px-1.5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <p className="text-[1.75rem] font-extrabold leading-[1.08] tracking-tight text-text sm:text-[2rem]">
            {greeting}
          </p>
          <h1 className="text-sm font-medium text-muted sm:text-base">{title}</h1>
        </div>

        <div className="flex items-center gap-2.5 self-start rounded-full border border-border bg-white px-3 py-2.5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-soft">
            {profile.initials}
          </div>
          <div className="pr-1">
            <p className="text-sm font-semibold text-text">{profile.name}</p>
            <p className="text-xs text-muted">{profile.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
