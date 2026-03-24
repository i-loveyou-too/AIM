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
    <header className="px-1 py-1 sm:px-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-[1.95rem] font-extrabold leading-[1.08] tracking-tight text-text sm:text-[2.25rem]">
            {greeting}
          </p>
          <h1 className="text-base font-medium text-muted sm:text-lg">{title}</h1>
        </div>

        <div className="flex items-center gap-3 self-start rounded-full border border-border bg-white px-4 py-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-soft">
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
