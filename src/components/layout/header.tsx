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
      <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1.5">
          <p className="text-[1.4rem] font-extrabold leading-[1.1] tracking-tight text-text sm:text-[1.65rem] lg:text-[1.75rem]">
            {greeting}
          </p>
          <h1 className="max-w-2xl text-sm font-medium leading-6 text-muted sm:text-base">{title}</h1>
        </div>

        <div className="flex w-full items-center justify-between gap-3 self-start rounded-[22px] border border-border bg-white px-3.5 py-3 shadow-sm sm:w-auto sm:justify-start sm:rounded-full sm:px-3 sm:py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white shadow-soft">
            {profile.initials}
          </div>
          <div className="min-w-0 pr-1">
            <p className="truncate text-sm font-semibold text-text">{profile.name}</p>
            <p className="truncate text-xs text-muted">{profile.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
