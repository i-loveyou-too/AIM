"use client";

// 설정 > 계정 / 프로필 섹션

type ProfileData = {
  name: string;
  affiliation: string;
  role: string;
  email: string;
  phone: string;
  joined: string;
};

export function ProfileSettings({ profile }: { profile: ProfileData }) {
  const settingsProfile = profile;
  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">계정</p>
        <h2 className="mt-1 text-base font-extrabold text-text">프로필 정보</h2>
      </div>
      <div className="px-6 py-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* 아바타 */}
          <div className="shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/10 text-2xl font-extrabold text-brand shadow-sm ring-1 ring-brand/20">
              {settingsProfile.name[0]}
            </div>
            <button
              type="button"
              className="mt-2 w-20 rounded-full border border-border bg-soft py-1 text-[11px] font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
            >
              변경
            </button>
          </div>

          {/* 정보 그리드 */}
          <div className="flex-1 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold text-muted">이름</p>
              <p className="mt-1 text-sm font-bold text-text">{settingsProfile.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted">소속</p>
              <p className="mt-1 text-sm font-bold text-text">{settingsProfile.affiliation}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted">역할</p>
              <p className="mt-1 text-sm font-bold text-text">{settingsProfile.role}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted">이메일</p>
              <p className="mt-1 text-sm font-bold text-text">{settingsProfile.email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted">연락처</p>
              <p className="mt-1 text-sm font-bold text-text">{settingsProfile.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted">가입일</p>
              <p className="mt-1 text-sm font-bold text-text">{settingsProfile.joined}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="rounded-full border border-border bg-soft px-4 py-2 text-sm font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
          >
            프로필 수정
          </button>
        </div>
      </div>
    </section>
  );
}
