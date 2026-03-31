import {
  TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK,
  TEACHER_ASSIGNMENTS_OVERVIEW_FALLBACK,
  TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK,
} from "@/lib/fallbacks/teacher";
import type {
  TeacherAssignmentBoardHeader,
  TeacherAssignmentCardId,
  TeacherAssignmentCardSelection,
  TeacherAssignmentViewTab,
  TeacherAssignmentsOverviewData,
} from "@/types/view/teacher";

function asObject(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readNumberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

export function normalizeTeacherAssignmentsOverview(raw: unknown): TeacherAssignmentsOverviewData {
  const fallback = TEACHER_ASSIGNMENTS_OVERVIEW_FALLBACK;
  const obj = asObject(raw);
  if (!obj) {
    return fallback;
  }

  const summaryObj = asObject(obj.summary);
  const insightsObj = asObject(obj.assignmentInsights);

  return {
    summary: {
      activeAssignments: readNumberValue(
        summaryObj?.activeAssignments,
        TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK.activeAssignments,
      ),
      dueTodayCount: readNumberValue(
        summaryObj?.dueTodayCount,
        TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK.dueTodayCount,
      ),
      unsubmittedStudents: readNumberValue(
        summaryObj?.unsubmittedStudents,
        TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK.unsubmittedStudents,
      ),
      studentsWithQuestions: readNumberValue(
        summaryObj?.studentsWithQuestions,
        TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK.studentsWithQuestions,
      ),
      avgSubmissionRate: readNumberValue(
        summaryObj?.avgSubmissionRate,
        TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK.avgSubmissionRate,
      ),
      reinforcementNeeded: readNumberValue(
        summaryObj?.reinforcementNeeded,
        TEACHER_ASSIGNMENTS_SUMMARY_FALLBACK.reinforcementNeeded,
      ),
    },
    classAssignments: Array.isArray(obj.classAssignments)
      ? (obj.classAssignments as TeacherAssignmentsOverviewData["classAssignments"])
      : fallback.classAssignments,
    studentSubmissions: Array.isArray(obj.studentSubmissions)
      ? (obj.studentSubmissions as TeacherAssignmentsOverviewData["studentSubmissions"])
      : fallback.studentSubmissions,
    commonMistakeAnalyses: Array.isArray(obj.commonMistakeAnalyses)
      ? (obj.commonMistakeAnalyses as TeacherAssignmentsOverviewData["commonMistakeAnalyses"])
      : fallback.commonMistakeAnalyses,
    lessonReflections: Array.isArray(obj.lessonReflections)
      ? (obj.lessonReflections as TeacherAssignmentsOverviewData["lessonReflections"])
      : fallback.lessonReflections,
    assignmentInsights: {
      repeatNonSubmitStudents: Array.isArray(insightsObj?.repeatNonSubmitStudents)
        ? (insightsObj?.repeatNonSubmitStudents as TeacherAssignmentsOverviewData["assignmentInsights"]["repeatNonSubmitStudents"])
        : TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK.repeatNonSubmitStudents,
      frequentQuestionStudents: Array.isArray(insightsObj?.frequentQuestionStudents)
        ? (insightsObj?.frequentQuestionStudents as TeacherAssignmentsOverviewData["assignmentInsights"]["frequentQuestionStudents"])
        : TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK.frequentQuestionStudents,
      reinforcementPriority: Array.isArray(insightsObj?.reinforcementPriority)
        ? (insightsObj?.reinforcementPriority as TeacherAssignmentsOverviewData["assignmentInsights"]["reinforcementPriority"])
        : TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK.reinforcementPriority,
      recentOperationMemo:
        typeof insightsObj?.recentOperationMemo === "string"
          ? insightsObj.recentOperationMemo
          : TEACHER_ASSIGNMENTS_INSIGHTS_FALLBACK.recentOperationMemo,
    },
  };
}

export function resolveTeacherAssignmentCardSelection(
  selection: TeacherAssignmentCardSelection,
  cardId: TeacherAssignmentCardId,
): TeacherAssignmentCardSelection {
  if (selection.activeCardId === cardId) {
    return {
      activeCardId: null,
      activeTab: "class",
      status: "전체",
      hasQuestion: null,
    };
  }

  if (cardId === "dueToday") {
    return {
      activeCardId: cardId,
      activeTab: "dueToday",
      status: "전체",
      hasQuestion: null,
    };
  }

  if (cardId === "unsubmitted") {
    return {
      activeCardId: cardId,
      activeTab: "unsubmitted",
      status: "전체",
      hasQuestion: null,
    };
  }

  if (cardId === "questions") {
    return {
      activeCardId: cardId,
      activeTab: "class",
      status: "전체",
      hasQuestion: true,
    };
  }

  if (cardId === "reinforcement") {
    return {
      activeCardId: cardId,
      activeTab: "class",
      status: "보강 필요",
      hasQuestion: null,
    };
  }

  return {
    activeCardId: cardId,
    activeTab: "class",
    status: "전체",
    hasQuestion: null,
  };
}

const TEACHER_ASSIGNMENT_BOARD_HEADERS: Record<
  TeacherAssignmentViewTab,
  TeacherAssignmentBoardHeader
> = {
  class: {
    label: "반별 보기",
    title: "반/수업 단위 과제 현황",
  },
  student: {
    label: "학생별 보기",
    title: "학생별 제출 상태",
  },
  unsubmitted: {
    label: "미제출 현황",
    title: "미제출 학생이 있는 과제",
  },
  dueToday: {
    label: "마감 임박 과제",
    title: "오늘 및 마감 임박 과제",
  },
};

export function getTeacherAssignmentBoardHeader(
  activeTab: TeacherAssignmentViewTab,
): TeacherAssignmentBoardHeader {
  return TEACHER_ASSIGNMENT_BOARD_HEADERS[activeTab];
}
