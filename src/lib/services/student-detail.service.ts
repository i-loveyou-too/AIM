import { toDisplayGrade, toDisplayStatus, toDisplayTrack } from "@/lib/api/teacher";
import type { TeacherStudentDetail } from "@/types/teacher";
import type { StudentDetailCard, StudentDetailData } from "@/types/student-detail";

type DetailTone = "rose" | "gold" | "peach" | "soft";
const MISSING_DB_VALUE = "<디비 데이터 필요>";

const STATUS_PROFILE: Record<string, { label: string; tone: DetailTone; note: string }> = {
  rising: {
    label: "상승 흐름",
    tone: "soft",
    note: "최근 학습 흐름이 안정적으로 올라가고 있습니다.",
  },
  stable: {
    label: "안정",
    tone: "gold",
    note: "현재 계획을 유지하며 취약 포인트만 점검하면 됩니다.",
  },
  warning: {
    label: "주의",
    tone: "peach",
    note: "취약 단원과 과제 진행 상태를 우선 점검해야 합니다.",
  },
  focus: {
    label: "주의",
    tone: "peach",
    note: "핵심 단원 중심으로 보강 우선순위를 조정해 주세요.",
  },
  urgent: {
    label: "시험 임박",
    tone: "gold",
    note: "시험일이 가까워 우선순위 높은 과제부터 처리해야 합니다.",
  },
};

function toText(value: unknown, fallback = MISSING_DB_VALUE) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toExamDays(dateText: string | null) {
  if (!dateText) return null;
  const examDate = new Date(dateText);
  if (Number.isNaN(examDate.getTime())) return null;
  const now = new Date();
  const diffMs = examDate.setHours(0, 0, 0, 0) - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function toDdayLabel(days: number | null) {
  if (days === null) return "시험일 미정";
  if (days === 0) return "D-DAY";
  return `D-${days}`;
}

function toExamDateLabel(dateText: string | null) {
  if (!dateText) return "미정";
  const parsed = new Date(dateText);
  if (Number.isNaN(parsed.getTime())) return dateText;
  return parsed.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

function toWeakTopics(detail: TeacherStudentDetail) {
  const topics = (detail.weak_topics ?? [])
    .map((item) => item?.topic)
    .filter((topic): topic is string => Boolean(topic && topic.trim().length > 0));
  return topics.length > 0 ? topics : [MISSING_DB_VALUE];
}

function toStatusProfile(status: string | null) {
  if (!status) return STATUS_PROFILE.stable;
  return STATUS_PROFILE[status] ?? STATUS_PROFILE.stable;
}

function toToneBySeverity(severity: string | undefined): DetailTone {
  if (severity === "high") return "rose";
  if (severity === "medium") return "peach";
  return "gold";
}

function toProgressBars(rate: number) {
  const last = Math.max(42, Math.min(92, Math.round(rate)));
  return [last - 30, last - 24, last - 18, last - 12, last - 6, last].map((value) =>
    Math.max(28, value),
  );
}

export function toStudentDetailData(detail: TeacherStudentDetail): StudentDetailData {
  const status = toStatusProfile(detail.status);
  const grade = toDisplayGrade(detail.grade);
  const track = toDisplayTrack(detail.track);
  const score = clampPercent(toNumber(detail.current_score, 0));
  const goalScore = Math.max(score, toNumber(detail.goal_score, score + 8));
  const examDays = toExamDays(detail.next_exam_date);
  const dDayLabel = toDdayLabel(examDays);
  const weakTopics = toWeakTopics(detail);
  const weakTopicCount = weakTopics[0] === MISSING_DB_VALUE ? 0 : weakTopics.length;
  const done = Math.max(0, toNumber(detail.assignment_done, 0));
  const total = Math.max(done, toNumber(detail.assignment_total, done));
  const overdue = Math.max(0, toNumber(detail.overdue_assignments, 0));
  const completionRate = total > 0 ? clampPercent((done / total) * 100) : 0;
  const readiness = clampPercent(toNumber(detail.exam_readiness, score));
  const planRate = readiness > 0 ? readiness : score;
  const nextAction = toText(detail.latest_next_action);
  const feedbackSummary = toText(detail.latest_feedback);
  const progressUnit = toText(detail.recent_progress_unit);
  const examDateLabel = toExamDateLabel(detail.next_exam_date);

  const sectionCards: StudentDetailCard[] = [
    {
      label: "최근 성취도",
      value: `${score}%`,
      note: "현재 점수 기준 성취도",
      tone: "soft",
      badge: "실데이터",
    },
    {
      label: "미완료 과제 수",
      value: `${Math.max(0, total - done + overdue)}건`,
      note: `완료 ${done}건 / 전체 ${total}건`,
      tone: overdue > 0 ? "peach" : "gold",
      badge: overdue > 0 ? "점검 필요" : "안정",
    },
    {
      label: "취약 단원 수",
      value: `${weakTopicCount}개`,
      note: weakTopics.join(", "),
      tone: weakTopicCount > 0 ? "rose" : "soft",
      badge: weakTopicCount > 0 ? "보강 필요" : "안정",
    },
    {
      label: "계획 조정 필요",
      value: toText(detail.exam_progress_status, "계획 점검"),
      note: status.note,
      tone: status.tone,
      badge: status.label,
    },
    {
      label: "시험 임박도",
      value: dDayLabel,
      note: `시험일 ${examDateLabel}`,
      tone: examDays !== null && examDays <= 14 ? "gold" : "soft",
      badge: examDays !== null && examDays <= 14 ? "확인 필요" : "예정",
    },
    {
      label: "최근 피드백 여부",
      value: detail.latest_feedback ? "기록됨" : "미기록",
      note: feedbackSummary,
      tone: detail.latest_feedback ? "soft" : "peach",
      badge: detail.latest_feedback ? "확인 완료" : "입력 필요",
    },
  ];

  const assignmentItems: StudentDetailData["assignments"]["items"] = [
    {
      title: `${progressUnit} 복습 과제`,
      status: overdue > 0 ? "미완료" : "완료",
      due: examDateLabel,
      note: overdue > 0 ? `미완료 과제 ${overdue}건이 남아 있습니다.` : "최근 과제 흐름은 안정적입니다.",
      score: `${score}점`,
    },
    {
      title: `${weakTopics[0]} 보강 문제`,
      status: detail.needs_reinforcement ? "미완료" : "완료",
      due: "다음 수업 전",
      note: nextAction,
      score: `${goalScore}점 목표`,
    },
    {
      title: "오답 노트 점검",
      status: detail.latest_feedback ? "완료" : "미완료",
      due: "주간 점검",
      note: feedbackSummary,
      score: `${Math.max(0, score - 2)}점`,
    },
  ];

  const weakAnalysis =
    detail.weak_topics && detail.weak_topics.length > 0
      ? detail.weak_topics.map((item) => {
          const topic = toText(item?.topic, "취약 단원");
          const severity = item?.severity;
          const tone = toToneBySeverity(severity);
          const statusLabel =
            severity === "high" ? "우선 보강" : severity === "medium" ? "관리 필요" : "관찰";
          const progressRate = severity === "high" ? 38 : severity === "medium" ? 58 : 72;
          return {
            title: topic,
            description: `${topic} 관련 문제에서 반복 오류가 관찰됩니다.`,
            statusLabel,
            tone,
            accuracyLabel: `정확도 ${progressRate}%`,
            progressRate,
          };
        })
      : [
          {
            title: MISSING_DB_VALUE,
            description: MISSING_DB_VALUE,
            statusLabel: "관찰",
            tone: "gold" as const,
            accuracyLabel: "정확도 -",
            progressRate: 48,
          },
        ];

  return {
    student: {
      id: String(detail.student_id),
      name: detail.name,
      school: toText(detail.school_name),
      grade,
      className: toText(detail.class_name),
      subject: track === "-" ? MISSING_DB_VALUE : track,
      status: toDisplayStatus(detail.status),
      score,
      examDays: examDays ?? 0,
    },
    goalScore,
    currentLevel: toText(detail.current_level, status.label),
    examDate: examDateLabel,
    dDayLabel,
    studyti: {
      summary: toText(detail.studyti_summary),
      tags: detail.studyti_tags && detail.studyti_tags.length > 0 ? detail.studyti_tags : ["실데이터"],
      ctaLabel: "학습 성향 확인",
    },
    learningGoal: {
      summary: toText(detail.study_goal),
      scoreBoostLabel: `목표 ${goalScore - score}점 상승`,
      targetScoreLabel: `${goalScore}점`,
      admissionTrack: track,
      targetUniversity: MISSING_DB_VALUE,
      focusLabel: toText(detail.recent_tag),
    },
    aiInsight: {
      progressReport: {
        statusLabel: toText(detail.exam_progress_status),
        currentChapterLabel: "현재 학습 단원",
        currentChapter: progressUnit,
        progressRate: planRate,
        nextGoal: nextAction,
        completeDate: examDateLabel,
        smartInsight: toText(detail.note),
      },
      weakAnalysis,
      clinicRecommendation: {
        title: "맞춤 보강 클리닉",
        subtitle: "취약 단원을 중심으로 다음 수업 계획을 조정합니다.",
        ctaLabel: "보강 계획 보기",
      },
    },
    managementStatus: status.label,
    managementTone: status.tone,
    managementNote: status.note,
    sectionCards,
    progress: {
      recentUnit: progressUnit,
      completedUnits:
        detail.studyti_tags && detail.studyti_tags.length > 0
          ? detail.studyti_tags.slice(0, 3)
          : ["학습 데이터 점검", "진도 흐름 확인"],
      currentUnit: progressUnit,
      delayStatus: toText(detail.exam_progress_status),
      progressRate: planRate,
      progressBars: toProgressBars(planRate),
      progressNote: toText(detail.note),
    },
    exam: {
      examDate: examDateLabel,
      remainingDays: dDayLabel,
      planRate,
      planStatus: toText(detail.exam_progress_status),
      planNote: status.note,
      reversePlanPosition: progressUnit,
      reversePlanNote: toText(detail.study_goal),
      statusLabel: status.label,
      statusTone: status.tone,
    },
    assignments: {
      completionRate,
      completionText: `${done}/${total}`,
      riskText:
        overdue > 0
          ? `미완료 과제 ${overdue}건이 있어 우선 점검이 필요합니다.`
          : "과제 흐름은 안정적이며 현재 계획대로 진행 가능합니다.",
      items: assignmentItems,
    },
    weaknesses: {
      topics: weakTopics,
      repeatMistakes: weakTopics.map((topic) => `${topic}에서 반복 실수 발생`),
      attentionFlags: [
        detail.needs_reinforcement ? "보강 필요" : "흐름 유지",
        overdue > 0 ? "미완료 과제 점검" : "과제 정상",
        examDays !== null && examDays <= 14 ? "시험 임박" : "시험 예정",
      ],
      note: feedbackSummary,
    },
    feedback: {
      summary: feedbackSummary,
      attitude: toText(detail.studyti_summary),
      supplement: nextAction,
      nextCheck: examDateLabel,
      note: toText(detail.note),
    },
    nextActions: [
      {
        label: nextAction,
        description: "다음 수업 전 우선 실행할 항목입니다.",
        tone: status.tone,
      },
      {
        label: `${weakTopics[0]} 보강`,
        description: "취약 단원 보강 문제를 중심으로 반복 학습합니다.",
        tone: "peach",
      },
      {
        label: "오답 노트 점검",
        description: "최근 실수 패턴을 정리하고 재발을 방지합니다.",
        tone: "soft",
      },
    ],
    timeline: [
      {
        time: "최근",
        title: "학생 상세 데이터 동기화",
        detail: "실데이터 기반으로 학생 상태를 업데이트했습니다.",
        kind: "info",
      },
      {
        time: "다음 수업",
        title: "핵심 보강 항목 점검",
        detail: nextAction,
        kind: "warning",
      },
      {
        time: examDateLabel,
        title: "시험 대비 체크",
        detail: `${dDayLabel} 기준으로 계획을 점검합니다.`,
        kind: "success",
      },
    ],
  };
}
