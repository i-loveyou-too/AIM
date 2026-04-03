"use client";

import { useRef, useState } from "react";
import { patchTeacherSettings, type TeacherSettingsPatchPayload } from "@/lib/api/teacher";
import { AssignmentSettings } from "@/components/settings/assignment-settings";
import { BasicInfoSettings } from "@/components/settings/basic-info-settings";
import { LessonSettings } from "@/components/settings/lesson-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { ReportSettingsSection } from "@/components/settings/report-settings";

type Props = {
  initialData: {
    profile: React.ComponentProps<typeof ProfileSettings>["profile"];
    notificationSettings: React.ComponentProps<typeof NotificationSettings>["initialSettings"];
    reportSettings: React.ComponentProps<typeof ReportSettingsSection>["initialSettings"];
    lessonSettings: React.ComponentProps<typeof LessonSettings>["initialSettings"];
    assignmentSettings: React.ComponentProps<typeof AssignmentSettings>["initialSettings"];
    basicInfoSettings: React.ComponentProps<typeof BasicInfoSettings>["data"];
  };
};

export function SettingsFormClient({ initialData }: Props) {
  const payload = useRef<TeacherSettingsPatchPayload>({});

  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);
    setSaveResult(null);

    const result = await patchTeacherSettings(payload.current);

    setIsSaving(false);
    setSaveResult({ ok: result.ok, message: result.ok ? "설정이 저장되었습니다." : (result.error ?? "저장에 실패했습니다.") });
  }

  function handleReset() {
    payload.current = {};
    setSaveResult(null);
    // 페이지 새로고침으로 초기 상태 복원
    window.location.reload();
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileSettings profile={initialData.profile} />
        <NotificationSettings
          initialSettings={initialData.notificationSettings}
          onStateChange={(s) => { payload.current = { ...payload.current, notifications: s }; }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportSettingsSection
          initialSettings={initialData.reportSettings}
          onStateChange={(s) => { payload.current = { ...payload.current, report: s }; }}
        />
        <LessonSettings
          initialSettings={initialData.lessonSettings}
          onStateChange={(s) => { payload.current = { ...payload.current, lesson: s }; }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AssignmentSettings
          initialSettings={initialData.assignmentSettings}
          onStateChange={(s) => { payload.current = { ...payload.current, assignment: s }; }}
        />
        <BasicInfoSettings data={initialData.basicInfoSettings} />
      </div>

      <div className="rounded-[24px] border border-border/80 bg-white px-6 py-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-h-[20px]">
            {saveResult ? (
              <p className={`text-sm font-medium ${saveResult.ok ? "text-emerald-600" : "text-brand"}`}>
                {saveResult.message}
              </p>
            ) : (
              <p className="text-sm text-muted">
                알림 / 리포트 / 수업 / 과제 설정은 저장 버튼을 눌러야 반영됩니다.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="rounded-full border border-border bg-soft px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-brand/30 hover:text-brand disabled:opacity-50"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="rounded-full border border-brand bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
