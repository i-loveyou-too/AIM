// 설정 > 반 / 과목 기본 정보 섹션
// 현재 설정 상태 확인 카드

import { basicInfoSettings } from "@/lib/mock-data/settings-mock-data";

export function BasicInfoSettings() {
  return (
    <section className="rounded-[24px] border border-border/80 bg-white shadow-soft">
      <div className="border-b border-border/60 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">반 · 과목</p>
        <h2 className="mt-1 text-base font-extrabold text-text">반 / 과목 기본 정보</h2>
        <p className="mt-1 text-xs text-muted">현재 관리 중인 반과 과목의 설정 상태를 확인합니다.</p>
      </div>
      <div className="px-6 py-5 space-y-5">
        {/* 연결 상태 칩 */}
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            basicInfoSettings.examScheduleLinked
              ? "bg-emerald-50 text-emerald-600"
              : "bg-brand/10 text-brand"
          }`}>
            시험 일정 {basicInfoSettings.examScheduleLinked ? "연동됨" : "미연동"}
          </span>
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            basicInfoSettings.curriculumTemplateLinked
              ? "bg-emerald-50 text-emerald-600"
              : "bg-brand/10 text-brand"
          }`}>
            커리큘럼 템플릿 {basicInfoSettings.curriculumTemplateLinked ? "연결됨" : "미연결"}
          </span>
        </div>

        {/* 과목 목록 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">관리 중인 과목</p>
          <div className="flex flex-wrap gap-2">
            {basicInfoSettings.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full border border-border bg-soft px-3 py-1.5 text-xs font-semibold text-text shadow-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* 반 목록 */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">
            관리 중인 반 ({basicInfoSettings.classes.length}개)
          </p>
          <div className="space-y-2">
            {basicInfoSettings.classes.map((cls) => (
              <div
                key={cls.name}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-soft/50 px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">
                    {cls.subject}
                  </span>
                  <span className="text-sm font-bold text-text">{cls.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{cls.studentCount}명</span>
                  <span>시험 {cls.examDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
