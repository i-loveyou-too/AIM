import type { Metadata } from "next";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ReportSettingsSection } from "@/components/settings/report-settings";
import { LessonSettings } from "@/components/settings/lesson-settings";
import { AssignmentSettings } from "@/components/settings/assignment-settings";
import { BasicInfoSettings } from "@/components/settings/basic-info-settings";
import { getTeacherSettingsOverview } from "@/lib/api/teacher";

export const metadata: Metadata = {
  title: "설정 | Aim ON",
  description: "교사용 대시보드의 기본 운영 환경과 알림, 리포트, 수업, 과제 관련 설정을 관리합니다.",
};

type TeacherSettingsOverview = {
  profile: {
    name: string;
    affiliation: string;
    role: string;
    email: string;
    phone: string;
    joined: string;
  };
  notificationSettings: Array<{
    key: string;
    label: string;
    description: string;
    enabled: boolean;
  }>;
  reportSettings: {
    defaultPeriod: "1주" | "2주" | "4주";
    defaultView: "학생별" | "반별";
    examEmphasisDDay: "D-7" | "D-14" | "D-21";
  };
  lessonSettings: {
    defaultDuration: "60분" | "90분" | "120분";
    todayPageInfoScope: "전체" | "요약만";
    showNextAction: boolean;
    showLessonMemo: boolean;
  };
  assignmentSettings: {
    defaultDeadlineTime: string;
    allowPhotoSubmit: boolean;
    allowOMRSubmit: boolean;
    questionEnabled: boolean;
    ocrReviewHighlight: boolean;
    commonMistakeAlert: boolean;
  };
  basicInfoSettings: {
    classes: Array<{
      name: string;
      subject: string;
      studentCount: number;
      examDate: string;
    }>;
    subjects: string[];
    examScheduleLinked: boolean;
    curriculumTemplateLinked: boolean;
  };
};

const EMPTY_SETTINGS: TeacherSettingsOverview = {
  profile: {
    name: "-",
    affiliation: "-",
    role: "-",
    email: "-",
    phone: "-",
    joined: "-",
  },
  notificationSettings: [],
  reportSettings: {
    defaultPeriod: "4주",
    defaultView: "학생별",
    examEmphasisDDay: "D-14",
  },
  lessonSettings: {
    defaultDuration: "90분",
    showNextAction: false,
    showLessonMemo: false,
    todayPageInfoScope: "요약만",
  },
  assignmentSettings: {
    defaultDeadlineTime: "23:59",
    allowPhotoSubmit: false,
    allowOMRSubmit: false,
    questionEnabled: false,
    ocrReviewHighlight: false,
    commonMistakeAlert: false,
  },
  basicInfoSettings: {
    classes: [],
    subjects: [],
    examScheduleLinked: false,
    curriculumTemplateLinked: false,
  },
};

export default async function SettingsPage() {
  let data: Partial<TeacherSettingsOverview> | null = null;
  try {
    data = (await getTeacherSettingsOverview()) as Partial<TeacherSettingsOverview>;
  } catch {
    data = null;
  }

  const loadFailed = data === null;
  const safeData: TeacherSettingsOverview = {
    profile: { ...EMPTY_SETTINGS.profile, ...(data?.profile ?? {}) },
    notificationSettings: Array.isArray(data?.notificationSettings)
      ? data.notificationSettings
      : EMPTY_SETTINGS.notificationSettings,
    reportSettings: { ...EMPTY_SETTINGS.reportSettings, ...(data?.reportSettings ?? {}) },
    lessonSettings: { ...EMPTY_SETTINGS.lessonSettings, ...(data?.lessonSettings ?? {}) },
    assignmentSettings: { ...EMPTY_SETTINGS.assignmentSettings, ...(data?.assignmentSettings ?? {}) },
    basicInfoSettings: { ...EMPTY_SETTINGS.basicInfoSettings, ...(data?.basicInfoSettings ?? {}) },
  };

  return (
    <main className="space-y-6">
      {/* 페이지 헤더 */}
      <header className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">설정</p>
        <h1 className="mt-1.5 text-[1.35rem] font-extrabold tracking-tight text-text sm:text-[1.6rem]">
          설정
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          교사용 대시보드의 기본 운영 환경과 알림, 리포트, 수업, 과제 관련 설정을 관리하는 화면입니다.
        </p>
      </header>

      {loadFailed ? (
        <section className="rounded-[22px] border border-[#f6cfcf] bg-[#fff7f7] px-5 py-4 text-sm text-[#9f3d3d]">
          설정 데이터를 불러오지 못해 기본값으로 표시 중입니다. 백엔드(`/api/teacher/settings/overview`) 연결을 확인해 주세요.
        </section>
      ) : null}

      {/* 2열 레이아웃: 프로필 + 알림 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileSettings profile={safeData.profile} />
        <NotificationSettings initialSettings={safeData.notificationSettings} />
      </div>

      {/* 2열 레이아웃: 리포트 + 수업 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ReportSettingsSection initialSettings={safeData.reportSettings} />
        <LessonSettings initialSettings={safeData.lessonSettings} />
      </div>

      {/* 2열 레이아웃: 과제 + 반/과목 정보 */}
      <div className="grid gap-6 xl:grid-cols-2">
        <AssignmentSettings initialSettings={safeData.assignmentSettings} />
        <BasicInfoSettings data={safeData.basicInfoSettings} />
      </div>

      {/* 하단 액션 영역 */}
      <div className="rounded-[24px] border border-border/80 bg-white px-6 py-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            변경 사항은 저장 버튼을 눌러야 반영됩니다.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full border border-border bg-soft px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-brand/30 hover:text-brand"
            >
              초기화
            </button>
            <button
              type="button"
              className="rounded-full border border-brand bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
