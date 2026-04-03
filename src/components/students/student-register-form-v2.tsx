"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAuthCsrf } from "@/lib/api/auth";
import { createTeacherStudent, getTeacherClasses, getTeacherProfile } from "@/lib/api/teacher";
import type { TeacherClassListItem } from "@/types/teacher";

type FormValues = {
  name: string;
  studentCode: string;
  schoolName: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  status: "active" | "inactive";
  classGroupId: string;
  enrolledAt: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ClassOption = {
  id: string;
  label: string;
  meta: string;
};

const GRADE_OPTIONS = ["고1", "고2", "고3"];

function getTodayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fieldClass(hasError = false) {
  return [
    "w-full rounded-2xl border px-4 py-3 text-sm text-text outline-none transition",
    "placeholder:text-muted/55 focus:border-brand/40 focus:ring-2 focus:ring-brand/10",
    hasError ? "border-brand/40 bg-brand/[0.04]" : "border-border bg-soft/50",
  ].join(" ");
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "학생 이름을 입력해 주세요.";
  if (!values.grade.trim()) errors.grade = "학년을 선택해 주세요.";
  return errors;
}

function buildClassOption(item: TeacherClassListItem): ClassOption {
  const label = item.class_name?.trim() || `반 ${item.class_group_id}`;
  const metaParts = [item.grade, item.track].filter((value) => value && String(value).trim().length > 0);
  return {
    id: String(item.class_group_id),
    label,
    meta: metaParts.length > 0 ? metaParts.join(" · ") : "연결 가능한 반",
  };
}

export function StudentRegisterFormV2() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    name: "",
    studentCode: "",
    schoolName: "",
    grade: "",
    parentName: "",
    parentPhone: "",
    studentPhone: "",
    status: "active",
    classGroupId: "",
    enrolledAt: getTodayString(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [academyName, setAcademyName] = useState<string>("현재 소속 학원");
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      setIsLoadingMeta(true);
      try {
        const [profile, classes] = await Promise.all([
          getTeacherProfile(),
          getTeacherClasses(),
        ]);
        if (cancelled) return;
        setAcademyName(profile.affiliation || "현재 소속 학원");
        setClassOptions(classes.map(buildClassOption));
      } catch {
        if (cancelled) return;
        setAcademyName("현재 소속 학원");
        setClassOptions([]);
      } finally {
        if (!cancelled) setIsLoadingMeta(false);
      }
    }

    void loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasClassOptions = classOptions.length > 0;

  const summaryItems = useMemo(
    () => [
      { label: "등록 학원", value: academyName || "현재 소속 학원" },
      { label: "연결 가능한 반", value: hasClassOptions ? `${classOptions.length}개` : "없음" },
      { label: "등록 상태", value: values.status === "active" ? "활성" : "비활성" },
    ],
    [academyName, classOptions.length, hasClassOptions, values.status],
  );

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validate(next)[field] }));
    }
  }

  function touchField(field: keyof FormValues) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validate(values)[field] }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);

    const nextTouched = Object.fromEntries(
      Object.keys(values).map((key) => [key, true]),
    ) as Partial<Record<keyof FormValues, boolean>>;
    setTouched(nextTouched);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const csrfResult = await fetchAuthCsrf();
      if (!csrfResult.ok) {
        setApiError(csrfResult.error);
        return;
      }

      const result = await createTeacherStudent(
        {
          name: values.name.trim(),
          student_code: values.studentCode.trim() || null,
          school_name: values.schoolName.trim() || null,
          grade: values.grade || null,
          parent_name: values.parentName.trim() || null,
          parent_phone: values.parentPhone.trim() || null,
          student_phone: values.studentPhone.trim() || null,
          status: values.status,
          class_group_id: values.classGroupId ? Number(values.classGroupId) : null,
          enrolled_at: values.enrolledAt || null,
        } as never,
        csrfResult.csrfToken,
      );

      if (!result.ok) {
        setApiError(result.error);
        return;
      }

      router.push("/dashboard/students");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <section className="rounded-[28px] border border-border/70 bg-white p-6 shadow-soft sm:p-7">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brand">
              STUDENT PROFILE
            </span>
            <h3 className="text-[1.15rem] font-extrabold tracking-tight text-text sm:text-[1.3rem]">
              학생 기본 정보와 소속 반을 등록합니다
            </h3>
            <p className="text-sm leading-6 text-muted">
              저장하면 `students` 테이블에 먼저 반영되고, 반을 선택한 경우 `enrollments`까지 함께 연결됩니다.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-text">
                학생 이름 <span className="text-brand">*</span>
              </label>
              <input
                value={values.name}
                onChange={(event) => setField("name", event.target.value)}
                onBlur={() => touchField("name")}
                className={fieldClass(!!(touched.name && errors.name))}
                placeholder="학생 이름을 입력해 주세요"
              />
              {touched.name && errors.name ? (
                <p className="mt-1.5 text-xs font-medium text-brand">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">학생 코드</label>
              <input
                value={values.studentCode}
                onChange={(event) => setField("studentCode", event.target.value)}
                className={fieldClass()}
                placeholder="예: AIM-25001"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">학교명</label>
              <input
                value={values.schoolName}
                onChange={(event) => setField("schoolName", event.target.value)}
                className={fieldClass()}
                placeholder="재학 중인 학교"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">
                학년 <span className="text-brand">*</span>
              </label>
              <select
                value={values.grade}
                onChange={(event) => setField("grade", event.target.value)}
                onBlur={() => touchField("grade")}
                className={fieldClass(!!(touched.grade && errors.grade))}
              >
                <option value="">학년 선택</option>
                {GRADE_OPTIONS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
              {touched.grade && errors.grade ? (
                <p className="mt-1.5 text-xs font-medium text-brand">{errors.grade}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">등록 상태</label>
              <select
                value={values.status}
                onChange={(event) => setField("status", event.target.value as FormValues["status"])}
                className={fieldClass()}
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">보호자 이름</label>
              <input
                value={values.parentName}
                onChange={(event) => setField("parentName", event.target.value)}
                className={fieldClass()}
                placeholder="보호자 성함"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">보호자 연락처</label>
              <input
                value={values.parentPhone}
                onChange={(event) => setField("parentPhone", event.target.value)}
                className={fieldClass()}
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">학생 연락처</label>
              <input
                value={values.studentPhone}
                onChange={(event) => setField("studentPhone", event.target.value)}
                className={fieldClass()}
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-text">등록일</label>
              <input
                type="date"
                value={values.enrolledAt}
                onChange={(event) => setField("enrolledAt", event.target.value)}
                className={fieldClass()}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[28px] border border-brand/15 bg-[#fff8f8] p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-brand">ACADEMY LINK</p>
                <h3 className="mt-1 text-lg font-extrabold tracking-tight text-text">소속과 반 연결</h3>
              </div>
              {isLoadingMeta ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted">불러오는 중</span>
              ) : null}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text">현재 소속 학원</label>
                <input value={academyName} readOnly className={fieldClass()} />
                <p className="mt-1.5 text-xs text-muted">
                  저장 시 학생의 `academy_id`는 현재 로그인한 선생님의 주 소속 학원으로 연결됩니다.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-text">반 선택</label>
                <select
                  value={values.classGroupId}
                  onChange={(event) => setField("classGroupId", event.target.value)}
                  className={fieldClass()}
                  disabled={!hasClassOptions}
                >
                  <option value="">{hasClassOptions ? "반을 선택하세요" : "연결 가능한 반이 없습니다"}</option>
                  {classOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-muted">
                  {hasClassOptions
                    ? "반을 선택하면 저장과 함께 enrollments도 생성됩니다."
                    : "현재 교사 계정에 연결된 반이 없어서 학생만 먼저 등록됩니다."}
                </p>
                {values.classGroupId ? (
                  <p className="mt-2 text-xs font-medium text-text">
                    {classOptions.find((option) => option.id === values.classGroupId)?.meta ?? ""}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-border/70 bg-white p-5 shadow-soft">
            <p className="text-xs font-semibold tracking-[0.14em] text-muted">SAVE SUMMARY</p>
            <div className="mt-4 space-y-3">
              {summaryItems.map((item) => (
                <div key={item.label} className="rounded-2xl bg-soft/55 px-4 py-3">
                  <p className="text-xs font-semibold text-muted">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-text">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="rounded-[24px] border border-border/60 bg-white px-6 py-4 shadow-soft">
        {apiError ? (
          <div className="mb-3 rounded-2xl border border-brand/20 bg-brand/[0.05] px-4 py-3 text-sm font-medium text-brand">
            {apiError}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            저장 후 학생 목록으로 이동하며, 새로고침해도 등록 결과가 유지됩니다.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/students"
              className="rounded-full border border-border bg-soft px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-brand/30 hover:text-text"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "저장 중..." : "학생 등록"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
