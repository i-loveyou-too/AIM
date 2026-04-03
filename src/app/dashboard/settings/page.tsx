import type { Metadata } from "next";
import { SettingsFormClient } from "@/components/settings/settings-form-client";
import { getTeacherSettingsOverview } from "@/lib/api/teacher";

export const metadata: Metadata = {
  title: "설정 | Aim ON",
  description: "교사용 대시보드의 운영 설정과 프로필 정보를 확인합니다.",
};

type TeacherSettingsOverview = {
  profile: {
    name: string;
    displayName: string;
    affiliation: string;
    role: string;
    email: string;
    phone: string;
    intro: string;
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
  dbRequiredSections?: string[];
};

const EMPTY_SETTINGS: TeacherSettingsOverview = {
  profile: {
    name: "<db 데이터필요>",
    displayName: "",
    affiliation: "<db 데이터필요>",
    role: "<db 데이터필요>",
    email: "<db 데이터필요>",
    phone: "<db 데이터필요>",
    intro: "",
    joined: "<db 데이터필요>",
  },
  notificationSettings: [
    {
      key: "db-required-notification",
      label: "<db 데이터필요>",
      description: "알림 설정은 DB 데이터 연결 후 활성화됩니다.",
      enabled: false,
    },
  ],
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
    classes: [
      {
        name: "<db 데이터필요>",
        subject: "<db 데이터필요>",
        studentCount: 0,
        examDate: "<db 데이터필요>",
      },
    ],
    subjects: ["<db 데이터필요>"],
    examScheduleLinked: false,
    curriculumTemplateLinked: false,
  },
  dbRequiredSections: [],
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
    assignmentSettings: {
      ...EMPTY_SETTINGS.assignmentSettings,
      ...(data?.assignmentSettings ?? {}),
    },
    basicInfoSettings: {
      ...EMPTY_SETTINGS.basicInfoSettings,
      ...(data?.basicInfoSettings ?? {}),
    },
    dbRequiredSections: Array.isArray(data?.dbRequiredSections) ? data.dbRequiredSections : [],
  };

  return (
    <main className="space-y-6">
      <header className="rounded-[28px] border border-border/80 bg-white px-6 py-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">설정</p>
        <h1 className="mt-1.5 text-[1.35rem] font-extrabold tracking-tight text-text sm:text-[1.6rem]">
          설정
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          교사용 대시보드의 기본 운영 환경과 알림, 리포트, 수업, 과제 관련 설정을 관리합니다.
        </p>
      </header>

      {loadFailed ? (
        <section className="rounded-[22px] border border-[#f6cfcf] bg-[#fff7f7] px-5 py-4 text-sm text-[#9f3d3d]">
          설정 데이터를 불러오지 못해 기본값으로 표시 중입니다. 백엔드(`/api/teacher/settings/overview`) 연결을 확인해 주세요.
        </section>
      ) : null}

      {safeData.dbRequiredSections && safeData.dbRequiredSections.length > 0 ? (
        <section className="rounded-[22px] border border-[#f6d9b8] bg-[#fffaf4] px-5 py-4 text-sm text-[#8a5a1f]">
          <strong>&lt;db 데이터필요&gt;</strong> {safeData.dbRequiredSections.join(", ")}
        </section>
      ) : null}

      <SettingsFormClient initialData={safeData} />
    </main>
  );
}
