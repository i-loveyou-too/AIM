"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { updateTeacherProfile } from "@/lib/api/teacher";

type ProfileData = {
  name: string;
  displayName: string;
  affiliation: string;
  role: string;
  email: string;
  phone: string;
  intro: string;
  joined: string;
};

type EditableProfileFields = {
  name: string;
  displayName: string;
  email: string;
  phone: string;
  intro: string;
};

function isDbPlaceholder(value: string) {
  const trimmed = value.trim();
  return !trimmed || trimmed.startsWith("<db");
}

function toEditableValue(value: string) {
  return isDbPlaceholder(value) ? "" : value;
}

function getAvatarLabel(name: string, displayName: string) {
  const source = displayName.trim() || name.trim();
  if (!source || source.startsWith("<")) {
    return "DB";
  }
  return source[0].toUpperCase();
}

function buildEditableFields(profile: ProfileData): EditableProfileFields {
  return {
    name: toEditableValue(profile.name),
    displayName: toEditableValue(profile.displayName),
    email: toEditableValue(profile.email),
    phone: toEditableValue(profile.phone),
    intro: toEditableValue(profile.intro),
  };
}

function FieldLabel({ children }: { children: string }) {
  return <p className="text-[11px] font-semibold text-muted">{children}</p>;
}

function ReadonlyValue({ value }: { value: string }) {
  return <p className="mt-1 text-sm font-bold text-text">{value || "-"}</p>;
}

export function ProfileSettings({ profile }: { profile: ProfileData }) {
  const { refreshSession } = useAuth();
  const [savedProfile, setSavedProfile] = useState<ProfileData>(profile);
  const [draft, setDraft] = useState<EditableProfileFields>(() => buildEditableFields(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSavedProfile(profile);
    if (!isEditing) {
      setDraft(buildEditableFields(profile));
    }
  }, [profile, isEditing]);

  const avatarLabel = useMemo(
    () => getAvatarLabel(savedProfile.name, savedProfile.displayName),
    [savedProfile.displayName, savedProfile.name],
  );

  function updateDraft<K extends keyof EditableProfileFields>(key: K, value: EditableProfileFields[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleEditStart() {
    setDraft(buildEditableFields(savedProfile));
    setFieldErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft(buildEditableFields(savedProfile));
    setFieldErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsEditing(false);
  }

  async function handleSave() {
    if (isSaving) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const result = await updateTeacherProfile({
      name: draft.name,
      displayName: draft.displayName,
      email: draft.email,
      phone: draft.phone,
      intro: draft.intro,
    });

    if (!result.ok) {
      setErrorMessage(result.error);
      setFieldErrors(result.fieldErrors ?? {});
      setIsSaving(false);
      return;
    }

    const nextProfile: ProfileData = {
      ...savedProfile,
      name: result.profile.name,
      displayName: result.profile.displayName,
      affiliation: result.profile.affiliation,
      role: result.profile.role,
      email: result.profile.email,
      phone: result.profile.phone,
      intro: result.profile.intro,
      joined: result.profile.joined,
    };

    setSavedProfile(nextProfile);
    setDraft(buildEditableFields(nextProfile));
    setSuccessMessage(result.message);
    setIsEditing(false);
    setIsSaving(false);
    await refreshSession();
  }

  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">계정</p>
        <h2 className="mt-1 text-base font-extrabold text-text">프로필 정보</h2>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/10 text-2xl font-extrabold text-brand shadow-sm ring-1 ring-brand/20">
              {avatarLabel}
            </div>
            <div className="mt-2 flex w-20 items-center justify-center rounded-full border border-border bg-soft py-1 text-[11px] font-semibold text-muted">
              프로필
            </div>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>이름</FieldLabel>
              {isEditing ? (
                <>
                  <input
                    value={draft.name}
                    onChange={(event) => updateDraft("name", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-text outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                    placeholder="이름을 입력해 주세요"
                    disabled={isSaving}
                  />
                  {fieldErrors.name ? (
                    <p className="mt-1 text-xs font-medium text-brand">{fieldErrors.name}</p>
                  ) : null}
                </>
              ) : (
                <ReadonlyValue value={savedProfile.name} />
              )}
            </div>

            <div>
              <FieldLabel>소속</FieldLabel>
              <ReadonlyValue value={savedProfile.affiliation} />
            </div>

            <div>
              <FieldLabel>역할</FieldLabel>
              <ReadonlyValue value={savedProfile.role} />
            </div>

            <div>
              <FieldLabel>이메일</FieldLabel>
              {isEditing ? (
                <>
                  <input
                    value={draft.email}
                    onChange={(event) => updateDraft("email", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-text outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                    placeholder="이메일을 입력해 주세요"
                    disabled={isSaving}
                  />
                  {fieldErrors.email ? (
                    <p className="mt-1 text-xs font-medium text-brand">{fieldErrors.email}</p>
                  ) : null}
                </>
              ) : (
                <ReadonlyValue value={savedProfile.email} />
              )}
            </div>

            <div>
              <FieldLabel>연락처</FieldLabel>
              {isEditing ? (
                <>
                  <input
                    value={draft.phone}
                    onChange={(event) => updateDraft("phone", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-text outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                    placeholder="연락처를 입력해 주세요"
                    disabled={isSaving}
                  />
                  {fieldErrors.phone ? (
                    <p className="mt-1 text-xs font-medium text-brand">{fieldErrors.phone}</p>
                  ) : null}
                </>
              ) : (
                <ReadonlyValue value={savedProfile.phone} />
              )}
            </div>

            <div>
              <FieldLabel>가입일</FieldLabel>
              <ReadonlyValue value={savedProfile.joined} />
            </div>

            <div>
              <FieldLabel>표시명</FieldLabel>
              {isEditing ? (
                <>
                  <input
                    value={draft.displayName}
                    onChange={(event) => updateDraft("displayName", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-semibold text-text outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                    placeholder="헤더에 표시할 이름을 입력해 주세요"
                    disabled={isSaving}
                  />
                  {fieldErrors.displayName ? (
                    <p className="mt-1 text-xs font-medium text-brand">{fieldErrors.displayName}</p>
                  ) : null}
                </>
              ) : (
                <ReadonlyValue value={savedProfile.displayName || savedProfile.name} />
              )}
            </div>

            <div className="sm:col-span-2">
              <FieldLabel>소개</FieldLabel>
              {isEditing ? (
                <>
                  <textarea
                    value={draft.intro}
                    onChange={(event) => updateDraft("intro", event.target.value)}
                    className="mt-1 min-h-[120px] w-full rounded-2xl border border-border bg-white px-3 py-3 text-sm font-medium text-text outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
                    placeholder="학생과 학부모에게 보여줄 소개를 입력해 주세요"
                    disabled={isSaving}
                  />
                  {fieldErrors.intro ? (
                    <p className="mt-1 text-xs font-medium text-brand">{fieldErrors.intro}</p>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-text">
                  {savedProfile.intro || "-"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div aria-live="polite" className="mt-5 min-h-[20px]">
          {errorMessage ? (
            <p className="rounded-xl border border-brand/20 bg-brand/[0.05] px-3.5 py-2.5 text-[13px] font-medium text-brand">
              {errorMessage}
            </p>
          ) : null}
          {!errorMessage && successMessage ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[13px] font-medium text-emerald-700">
              {successMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-border bg-soft px-4 py-2 text-sm font-semibold text-muted transition hover:border-brand/30 hover:text-brand disabled:opacity-60"
                disabled={isSaving}
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                className="rounded-full border border-brand bg-brand px-5 py-2 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleEditStart}
              className="rounded-full border border-border bg-soft px-4 py-2 text-sm font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
            >
              프로필 수정
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
