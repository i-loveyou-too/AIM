"use client";

import { useState } from "react";

type ExamAlertClass = {
  name: string;
  progress: number;
};

export type ExamAlertSchool = {
  name: string;
  examName: string;
  examDate: string;
  daysLeft: number;
  overallProgress: number;
  classes: ExamAlertClass[];
};

type Props = {
  schools: ExamAlertSchool[];
};

export function ExamAlert({ schools }: Props) {
  const [selectedSchoolName, setSelectedSchoolName] = useState(
    schools[0]?.name ?? "",
  );

  const selectedSchool =
    schools.find((school) => school.name === selectedSchoolName) ??
    schools[0];

  if (!selectedSchool) {
    return null;
  }

  return (
    <section className="rounded-[32px] bg-[#171519] p-5 text-white shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-warm text-text">
            🗓️
          </div>
          <span className="text-sm font-semibold tracking-[0.18em] text-warm">
            EXAM ALERT
          </span>
        </div>

        <label className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
          <span className="text-white/60">학교 선택</span>
          <select
            value={selectedSchoolName}
            onChange={(event) => setSelectedSchoolName(event.target.value)}
            className="bg-transparent text-sm font-semibold text-white outline-none"
          >
            {schools.map((school) => (
              <option key={school.name} value={school.name} className="text-text">
                {school.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-5">
        <div className="rounded-[28px] bg-white/5 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-warm">
              {selectedSchool.examName}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-warm">
              {selectedSchool.examDate}
            </span>
          </div>

          <h3 className="mt-5 text-[2.75rem] font-extrabold leading-none tracking-tight text-warm">
            D-{selectedSchool.daysLeft}
          </h3>
          <p className="mt-3 text-[1.15rem] font-extrabold tracking-tight">
            {selectedSchool.name}
          </p>
          <p className="mt-2 text-sm text-white/70">
            {selectedSchool.examName} 기준으로 시험 대비 진척도를 관리합니다.
          </p>

          <div className="mt-7">
            <div className="flex items-end justify-between gap-3">
              <p className="text-[2.1rem] font-extrabold tracking-tight text-warm">
                {selectedSchool.overallProgress}%
              </p>
              <p className="text-sm text-white/55">
                {selectedSchool.name} 기준 진도율
              </p>
            </div>
            <div className="mt-4 h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-warm transition-[width] duration-300"
                style={{ width: `${selectedSchool.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold tracking-[0.14em] text-white/70">
              소속 반 진도율
            </p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              최근 업데이트
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {selectedSchool.classes.map((classItem) => (
              <div key={`${selectedSchool.name}-${classItem.name}`} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{classItem.name}</p>
                  <p className="text-sm font-semibold text-warm">{classItem.progress}%</p>
                </div>
                <div className="h-2.5 rounded-full bg-white/10">
                  <div
                    className="h-2.5 rounded-full bg-warm"
                    style={{ width: `${classItem.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/55">
              학교별 확인 포인트
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              선택한 학교의 시험일과 해당 반 진도율을 한 화면에서 확인할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
