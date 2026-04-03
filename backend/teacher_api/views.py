import datetime
import json
import os
from collections import defaultdict
from functools import wraps

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import connection, transaction
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST, require_http_methods

from accounts.user_display import (
    get_user_profile_context,
    resolve_user_display_name,
    resolve_user_greeting_name,
    resolve_user_header_name,
    resolve_user_initials,
    resolve_user_role_label,
)

GRADE_LABELS = {
    "grade1": "고1",
    "grade2": "고2",
    "grade3": "고3",
}

TRACK_SUBJECT_LABELS = {
    "naesin": "수학",
    "suneung": "수능 수학",
}

ASSIGNMENT_STATUS_LABELS = {
    "active": "진행 중",
    "due_soon": "마감 임박",
    "reviewed": "검토 완료",
    "needs_reinforcement": "보강 필요",
}

SUBMIT_STATUS_LABELS = {
    "completed": "완료",
    "partial": "부분 완료",
    "not_submitted": "미완료",
}

SUBMISSION_TYPE_LABELS = {
    "photo": "사진 제출",
    "omr": "OMR 제출",
}

REPORT_STATUS_LABELS = {
    "excellent": "양호",
    "good": "양호",
    "caution": "주의",
    "critical": "위험",
}

URGENCY_LABELS = {
    "high": "높음",
    "medium": "중간",
    "low": "낮음",
}


def _is_teacher_or_admin(user) -> bool:
    if user.is_superuser or user.is_staff:
        return True
    return user.groups.filter(name__iexact="teacher").exists()


def _auth_error(detail: str, status: int, authenticated: bool) -> JsonResponse:
    return JsonResponse(
        {
            "authenticated": authenticated,
            "detail": detail,
            "message": detail,
        },
        status=status,
    )


def teacher_api_required(view_func):
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return _auth_error("인증이 필요합니다.", status=401, authenticated=False)
        if not _is_teacher_or_admin(request.user):
            return _auth_error("교사/관리자 권한이 필요합니다.", status=403, authenticated=True)
        return view_func(request, *args, **kwargs)

    return _wrapped


def fetch_all_dict(query, params=None):
    with connection.cursor() as cursor:
        cursor.execute(query, params or [])
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
    return [dict(zip(columns, row)) for row in rows]


def fetch_one_dict(query, params=None):
    with connection.cursor() as cursor:
        cursor.execute(query, params or [])
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
    if row is None:
        return None
    return dict(zip(columns, row))


def fetch_all_dict_safe(query, params=None):
    try:
        return fetch_all_dict(query, params)
    except Exception:
        return []


def fetch_one_dict_safe(query, params=None):
    try:
        return fetch_one_dict(query, params)
    except Exception:
        return None


def to_float(value, default=0.0):
    if value is None:
        return float(default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def to_int(value, default=0):
    if value is None:
        return int(default)
    try:
        return int(value)
    except (TypeError, ValueError):
        return int(default)


def to_json(value, default):
    if value is None:
        return default
    if isinstance(value, (dict, list)):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed
        except json.JSONDecodeError:
            return default
    return default


def to_string_list(value):
    parsed = to_json(value, [])
    if isinstance(parsed, list):
        return [str(item) for item in parsed if item is not None and str(item).strip() != ""]
    if isinstance(parsed, dict):
        result = []
        for key, val in parsed.items():
            if isinstance(val, (list, tuple)):
                joined = ", ".join([str(v) for v in val if v is not None])
                if joined:
                    result.append(f"{key}: {joined}")
            elif val is not None:
                result.append(f"{key}: {val}")
        return result
    return []


def format_date(value):
    if value is None:
        return None
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.strftime("%Y-%m-%d")
    text = str(value)
    if len(text) >= 10:
        return text[:10]
    return text


def format_date_dot(value):
    if value is None:
        return "-"
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.strftime("%Y.%m.%d")
    text = str(value)
    if len(text) >= 10 and "-" in text:
        return text[:10].replace("-", ".")
    return text


def format_mmdd(value):
    if value is None:
        return "-"
    if isinstance(value, (datetime.date, datetime.datetime)):
        return f"{value.month}/{value.day}"
    text = str(value)
    if len(text) >= 10 and "-" in text:
        try:
            d = datetime.date.fromisoformat(text[:10])
            return f"{d.month}/{d.day}"
        except ValueError:
            return text
    return text


def format_time_hhmm(value):
    if value is None:
        return None
    if isinstance(value, datetime.time):
        return value.strftime("%H:%M")
    text = str(value)
    if len(text) >= 5:
        return text[:5]
    return text


def format_datetime_short(value):
    if value is None:
        return None
    if isinstance(value, datetime.datetime):
        return value.strftime("%-m/%-d %H:%M")
    text = str(value)
    return text[:16]


def to_dday(days_left):
    if days_left is None:
        return "D-?"
    return f"D-{max(to_int(days_left, 0), 0)}"


def grade_label(value):
    if value is None:
        return "-"
    return GRADE_LABELS.get(str(value), str(value))


def track_subject_label(value):
    if value is None:
        return "수학"
    return TRACK_SUBJECT_LABELS.get(str(value), "수학")


def lesson_status_label(exam_days_left, open_issue_count, needs_review_count, unsubmitted_count):
    days = to_int(exam_days_left, 9999)
    if days <= 30:
        return "시험 임박"
    if to_int(open_issue_count) > 0:
        return "집중 관리"
    if to_int(needs_review_count) > 0 or to_int(unsubmitted_count) > 0:
        return "보강 필요"
    return "정상"


def achievement_label(avg_score):
    score = to_float(avg_score, 0)
    if score >= 85:
        return "우수"
    if score >= 70:
        return "보통"
    return "미흡"


def status_to_risk_label(score):
    numeric = to_float(score, 0)
    if numeric >= 80:
        return "양호"
    if numeric >= 65:
        return "주의"
    return "위험"


def get_teacher_profile(user=None):
    teacher = fetch_one_dict_safe(
        """
        SELECT id, name, role, initials, email, phone, created_at
        FROM teachers
        ORDER BY id
        LIMIT 1
        """
    )

    if not teacher:
        return {
            "teacherId": 1,
            "name": "김민정",
            "affiliation": "에임온",
            "role": "교사용 관리자",
            "email": "-",
            "phone": "-",
            "joined": "-",
            "header": {
                "name": "김민정 선생님",
                "role": "교사용 관리자",
                "initials": "김",
                "greetingName": "김민정",
            },
        }

    name = teacher.get("name") or "김민정"
    initials = teacher.get("initials") or name[:1]
    role = teacher.get("role") or "교사용 관리자"

    return {
        "teacherId": teacher.get("id") or 1,
        "name": name,
        "affiliation": "목동 에임 학원",
        "role": role,
        "email": teacher.get("email") or "-",
        "phone": teacher.get("phone") or "-",
        "joined": format_date_dot(teacher.get("created_at")),
        "header": {
            "name": f"{name} 선생님",
            "role": role,
            "initials": initials,
            "greetingName": name,
        },
    }


def build_today_lessons_overview():
    lessons = fetch_all_dict(
        """
        SELECT
            ls.id AS schedule_id,
            ls.scheduled_date,
            ls.start_time,
            ls.end_time,
            ls.topic,
            ls.status,
            cg.id AS class_group_id,
            cg.class_name,
            cg.grade,
            cg.track,
            COUNT(en.student_id) AS student_count,
            COALESCE((
                SELECT COUNT(*)
                FROM student_submissions ss2
                JOIN assignments a2 ON ss2.assignment_id = a2.id
                WHERE a2.class_group_id = cg.id
                  AND ss2.submit_status = 'not_submitted'
            ), 0) AS unsubmitted_count,
            COALESCE((
                SELECT COUNT(*)
                FROM student_submissions ss3
                JOIN assignments a3 ON ss3.assignment_id = a3.id
                WHERE a3.class_group_id = cg.id
                  AND ss3.needs_review = TRUE
            ), 0) AS needs_review_count,
            COALESCE((
                SELECT COUNT(*)
                FROM issues i
                WHERE i.class_group_id = cg.id
                  AND i.status = 'unread'
            ), 0) AS open_issue_count,
            lp.weak_topic_overview,
            lp.homework_reflection,
            lp.materials_needed,
            lp.ai_suggestions,
            cc.planned_progress,
            cc.actual_progress,
            cc.status AS curriculum_status,
            cc.delay_units,
            cc.reinforcement_units,
            ROUND(AVG(sp.current_score)::numeric, 1) AS avg_score,
            ex.exam_date,
            (ex.exam_date - CURRENT_DATE) AS exam_days_left
        FROM lesson_schedules ls
        JOIN class_groups cg ON ls.class_group_id = cg.id
        LEFT JOIN enrollments en ON en.class_group_id = cg.id AND en.is_active = TRUE
        LEFT JOIN student_profiles sp ON sp.student_id = en.student_id
        LEFT JOIN lesson_preps lp ON lp.lesson_schedule_id = ls.id
        LEFT JOIN class_curriculums cc ON cc.class_group_id = cg.id
        LEFT JOIN LATERAL (
            SELECT e.exam_date
            FROM exams e
            WHERE e.class_group_id = cg.id
              AND e.exam_date >= CURRENT_DATE
            ORDER BY e.exam_date
            LIMIT 1
        ) ex ON TRUE
        WHERE ls.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
        GROUP BY
            ls.id,
            cg.id,
            lp.id,
            cc.id,
            ex.exam_date
        ORDER BY ls.scheduled_date, ls.start_time
        LIMIT 120
        """
    )

    schedule_ids = [to_int(row.get("schedule_id")) for row in lessons]

    materials_rows = []
    next_actions_rows = []
    if schedule_ids:
        materials_rows = fetch_all_dict(
            """
            SELECT id, lesson_schedule_id, material_type, title, description
            FROM lesson_materials
            WHERE lesson_schedule_id = ANY(%s)
            ORDER BY lesson_schedule_id, id
            """,
            [schedule_ids],
        )

        next_actions_rows = fetch_all_dict(
            """
            SELECT lesson_schedule_id, phase, action_text, priority
            FROM lesson_next_actions
            WHERE lesson_schedule_id = ANY(%s)
            ORDER BY lesson_schedule_id, phase, priority, id
            """,
            [schedule_ids],
        )

    materials_by_schedule = defaultdict(list)
    for row in materials_rows:
        materials_by_schedule[to_int(row.get("lesson_schedule_id"))].append(row)

    actions_by_schedule = defaultdict(lambda: {
        "beforeClass": [],
        "duringClass": [],
        "afterClass": [],
        "nextLessonPrep": [],
    })

    for row in next_actions_rows:
        sid = to_int(row.get("lesson_schedule_id"))
        phase = str(row.get("phase") or "")
        text = str(row.get("action_text") or "").strip()
        if not text:
            continue

        if phase == "before":
            actions_by_schedule[sid]["beforeClass"].append(text)
        elif phase == "during":
            actions_by_schedule[sid]["duringClass"].append(text)
        elif phase == "after":
            actions_by_schedule[sid]["afterClass"].append(text)

    summary = {
        "totalLessons": len(lessons),
        "focusStudents": 0,
        "homeworkIssues": 0,
        "teachingPoints": 0,
        "examImminentStudents": 0,
    }

    schedule = []
    preps = []
    next_actions = []

    weak_counter = defaultdict(int)
    critical_items = []
    incomplete_homework = []

    for row in lessons:
        sid_num = to_int(row.get("schedule_id"))
        lesson_id = f"lesson-{sid_num}"

        start_time = format_time_hhmm(row.get("start_time")) or "--:--"
        end_time = format_time_hhmm(row.get("end_time"))
        time_range = f"{start_time} – {end_time}" if end_time else start_time

        days_left = row.get("exam_days_left")
        status = lesson_status_label(
            days_left,
            row.get("open_issue_count"),
            row.get("needs_review_count"),
            row.get("unsubmitted_count"),
        )

        weak_topics = to_string_list(row.get("weak_topic_overview"))
        homework_payload = to_json(row.get("homework_reflection"), {})
        materials_payload = to_string_list(row.get("materials_needed"))

        student_count = max(to_int(row.get("student_count"), 0), 1)
        unsubmitted_count = to_int(row.get("unsubmitted_count"), 0)
        needs_review_count = to_int(row.get("needs_review_count"), 0)
        open_issue_count = to_int(row.get("open_issue_count"), 0)

        completion_rate = max(0, min(100, int(round((student_count - unsubmitted_count) / student_count * 100))))

        for topic in weak_topics:
            weak_counter[topic] += 1

        summary["homeworkIssues"] += unsubmitted_count + needs_review_count
        summary["teachingPoints"] += max(len(weak_topics), 1)
        if status in {"집중 관리", "보강 필요", "시험 임박"}:
            summary["focusStudents"] += 1
        if to_int(days_left, 9999) <= 30:
            summary["examImminentStudents"] += 1

        schedule.append(
            {
                "id": lesson_id,
                "time": time_range,
                "studentName": row.get("class_name") or f"반 {row.get('class_group_id')}",
                "grade": grade_label(row.get("grade")),
                "subject": track_subject_label(row.get("track")),
                "lessonType": f"그룹 ({student_count}명)",
                "todayGoal": row.get("topic") or "오늘 수업 목표 확인",
                "examDate": format_date(row.get("exam_date")) or "-",
                "dDay": to_dday(days_left),
                "status": status,
            }
        )

        homework_status = "완료"
        if completion_rate < 70:
            homework_status = "미완료"
        elif completion_rate < 95:
            homework_status = "부분 완료"

        prep_item = {
            "id": lesson_id,
            "studentName": row.get("class_name") or f"반 {row.get('class_group_id')}",
            "grade": grade_label(row.get("grade")),
            "subject": track_subject_label(row.get("track")),
            "time": time_range,
            "examDate": format_date(row.get("exam_date")) or "-",
            "dDay": to_dday(days_left),
            "recentAchievement": achievement_label(row.get("avg_score")),
            "status": status,
            "progress": {
                "todayUnit": row.get("topic") or "오늘 수업 단원 점검",
                "curriculumPosition": f"전체 커리큘럼 중 {int(round(to_float(row.get('actual_progress'), 0)))}% 진행",
                "completedRange": f"현재 계획 상태: {row.get('curriculum_status') or 'on_track'}",
                "targetRange": f"오늘 목표: {row.get('topic') or '핵심 개념 정리'}",
                "planComparison": f"계획 {int(round(to_float(row.get('planned_progress'), 0)))}% / 실제 {int(round(to_float(row.get('actual_progress'), 0)))}%",
                "isDelayed": to_int(row.get("delay_units"), 0) > 0,
                "delayNote": f"지연 단원 {to_int(row.get('delay_units'), 0)}개 · 보강 필요 {to_int(row.get('reinforcement_units'), 0)}개",
            },
            "explanation": {
                "keyConcepts": weak_topics[:4] if weak_topics else ["수업 핵심 개념 정리", "오답 유형 교정"],
                "confusionPoints": weak_topics[:2] if weak_topics else ["핵심 절차 누락 여부 확인"],
                "conceptType": "개념형 + 문풀 적용형",
                "misconceptions": weak_topics[2:4] if len(weak_topics) > 2 else ["오답 원인 설명을 학생이 직접 말하도록 유도"],
            },
            "materials": {
                "mainTextbook": f"{row.get('class_name') or '해당 반'} 교재",
                "workbooks": [m.get("title") for m in materials_by_schedule[sid_num][:2] if m.get("title")],
                "printouts": materials_payload[:3],
                "priorityTag": (materials_by_schedule[sid_num][0].get("title") if materials_by_schedule[sid_num] else "핵심 자료 확인"),
            },
            "weaknesses": {
                "weakUnits": weak_topics[:4] if weak_topics else ["집중 관리 포인트 확인"],
                "repeatMistakes": weak_topics[1:4] if len(weak_topics) > 1 else ["반복 오답 패턴 점검"],
                "attentionPoints": [f"열린 이슈 {open_issue_count}건"],
                "todayFocusCheck": [
                    f"미제출 {unsubmitted_count}건 점검",
                    f"검토 필요 {needs_review_count}건 확인",
                ],
            },
            "homework": {
                "status": homework_status,
                "completionRate": completion_rate,
                "errorTendencies": to_string_list(homework_payload.get("errors") if isinstance(homework_payload, dict) else []),
                "reflectionPoints": to_string_list(homework_payload.get("reflection") if isinstance(homework_payload, dict) else []),
                "homeworkBasedExplanation": to_string_list(homework_payload.get("actions") if isinstance(homework_payload, dict) else []),
                "warning": f"미제출 {unsubmitted_count}건 · 검토 필요 {needs_review_count}건",
            },
            "lessonMemo": {
                "preClassCheck": [
                    f"수업 전 {row.get('class_name') or ''} 숙제 현황 점검",
                    f"열린 이슈 {open_issue_count}건 확인",
                ],
                "questionPrompts": [
                    "오늘 오답의 원인을 학생이 직접 설명하게 합니다.",
                    "핵심 절차를 말로 재현하게 합니다.",
                ],
                "postClassNote": row.get("ai_suggestions") or "수업 후 학습 태도/이해도 기록",
                "nextLessonConnection": f"보강 필요 단원 {to_int(row.get('reinforcement_units'), 0)}개를 다음 수업과 연결",
            },
        }

        preps.append(prep_item)

        if open_issue_count > 0 or unsubmitted_count > 0:
            critical_items.append(
                {
                    "studentName": prep_item["studentName"],
                    "subject": prep_item["subject"],
                    "issue": f"미제출 {unsubmitted_count}건 · 열린 이슈 {open_issue_count}건",
                    "actionRequired": "다음 수업 도입부에서 숙제/오답 점검을 우선 진행",
                }
            )

        if completion_rate < 100:
            incomplete_homework.append(
                {
                    "studentName": prep_item["studentName"],
                    "subject": prep_item["subject"],
                    "completionRate": completion_rate,
                }
            )

        action_group = actions_by_schedule[sid_num]
        if row.get("ai_suggestions"):
            action_group["nextLessonPrep"].append(str(row.get("ai_suggestions")))
        if not action_group["beforeClass"]:
            action_group["beforeClass"].append("숙제 현황과 미제출 학생을 확인합니다.")
        if not action_group["duringClass"]:
            action_group["duringClass"].append("핵심 오답 유형을 칠판으로 재설명합니다.")
        if not action_group["afterClass"]:
            action_group["afterClass"].append("수업 후 이해도와 다음 과제를 기록합니다.")
        if not action_group["nextLessonPrep"]:
            action_group["nextLessonPrep"].append("다음 수업 보강 포인트를 미리 배치합니다.")

        next_actions.append(
            {
                "lessonId": lesson_id,
                "studentName": prep_item["studentName"],
                "beforeClass": action_group["beforeClass"],
                "duringClass": action_group["duringClass"],
                "afterClass": action_group["afterClass"],
                "nextLessonPrep": action_group["nextLessonPrep"],
            }
        )

    if not weak_counter:
        common_re_explanation = ["공통 재설명 포인트 데이터가 없습니다."]
    else:
        common_re_explanation = [topic for topic, _count in sorted(weak_counter.items(), key=lambda item: item[1], reverse=True)[:5]]

    reinforcement_needed = [
        "미제출 학생 개별 확인",
        "검토 필요 제출 우선 피드백",
        "반복 오답 유형 재설명",
    ]

    materials = []
    for row in materials_rows:
        sid = to_int(row.get("lesson_schedule_id"))
        schedule_item = next((item for item in schedule if item.get("id") == f"lesson-{sid}"), None)
        material_type_raw = str(row.get("material_type") or "reference")
        if material_type_raw == "worksheet":
            material_type = "프린트"
        elif material_type_raw == "reference":
            material_type = "교재"
        elif material_type_raw == "quiz":
            material_type = "기출"
        elif material_type_raw == "explanation":
            material_type = "정리표"
        else:
            material_type = "링크"

        materials.append(
            {
                "id": f"mat-{to_int(row.get('id'))}",
                "subject": (schedule_item.get("subject") if schedule_item else "수학"),
                "student": (schedule_item.get("studentName") if schedule_item else "-"),
                "type": material_type,
                "title": row.get("title") or "자료",
                "priority": "필수" if material_type in {"프린트", "정리표"} else "참고",
                "note": row.get("description") or "",
            }
        )

    return {
        "summary": summary,
        "schedule": schedule,
        "preps": preps,
        "weaknessOverview": [
            {
                "studentName": item["studentName"],
                "grade": item["grade"],
                "subject": item["subject"],
                "urgency": "높음" if item["status"] in {"시험 임박", "집중 관리"} else "중간",
                "focusReason": item["lessonMemo"]["preClassCheck"][0],
                "overlappingWeakness": ", ".join(item["weaknesses"]["weakUnits"][:2]) if item["weaknesses"]["weakUnits"] else "공통 약점 데이터 없음",
                "action": item["lessonMemo"]["nextLessonConnection"],
            }
            for item in preps[:6]
        ],
        "homeworkReflection": {
            "criticalItems": critical_items[:6],
            "incompleteHomework": incomplete_homework[:8],
            "commonReExplanation": common_re_explanation,
            "reinforcementNeeded": reinforcement_needed,
        },
        "materials": materials,
        "nextActions": next_actions,
    }


def build_assignments_overview():
    assignments = fetch_all_dict(
        """
        SELECT vas.*, cg.track
        FROM v_assignment_status vas
        LEFT JOIN class_groups cg ON vas.class_group_id = cg.id
        ORDER BY vas.due_date DESC, vas.assignment_id DESC
        LIMIT 300
        """
    )

    assignment_ids = [to_int(row.get("assignment_id")) for row in assignments]

    submissions = []
    omr_rows = []
    if assignment_ids:
        submissions = fetch_all_dict(
            """
            SELECT
                ss.id,
                ss.assignment_id,
                ss.student_id,
                s.name AS student_name,
                ss.submit_status,
                ss.submitted_at,
                ss.submission_type,
                ss.ocr_summary,
                ss.correct_count,
                ss.total_questions,
                ss.question_text,
                ss.is_repeat_nonsubmit,
                ss.needs_review
            FROM student_submissions ss
            JOIN students s ON ss.student_id = s.id
            WHERE ss.assignment_id = ANY(%s)
            ORDER BY ss.assignment_id, ss.id
            """,
            [assignment_ids],
        )

        submission_ids = [to_int(row.get("id")) for row in submissions]
        if submission_ids:
            omr_rows = fetch_all_dict(
                """
                SELECT submission_id, question_num, student_answer, correct_answer, is_correct
                FROM submission_omr_items
                WHERE submission_id = ANY(%s)
                ORDER BY submission_id, question_num
                """,
                [submission_ids],
            )

    cma_rows = fetch_all_dict(
        """
        SELECT id, assignment_id, weak_concept_summary, repeat_mistake_patterns, explanation_needed, top_questions
        FROM common_mistake_analyses
        ORDER BY id DESC
        LIMIT 500
        """
    )
    cma_ids = [to_int(row.get("id")) for row in cma_rows]

    cmi_rows = []
    if cma_ids:
        cmi_rows = fetch_all_dict(
            """
            SELECT analysis_id, rank, question_num, topic, mistake_type, incorrect_count, total_students
            FROM common_mistake_items
            WHERE analysis_id = ANY(%s)
            ORDER BY analysis_id, rank
            """,
            [cma_ids],
        )

    reflection_rows = fetch_all_dict(
        """
        SELECT id, assignment_id, class_group_id, urgency, re_explain_topics,
               reinforcement_items, question_reflection_items, homework_follow_up
        FROM lesson_reflections
        ORDER BY created_at DESC
        LIMIT 400
        """
    )
    reflection_ids = [to_int(row.get("id")) for row in reflection_rows]

    reflection_individual_rows = []
    if reflection_ids:
        reflection_individual_rows = fetch_all_dict(
            """
            SELECT reflection_id, student_id, student_name, reason
            FROM lesson_reflection_individuals
            WHERE reflection_id = ANY(%s)
            ORDER BY reflection_id, id
            """,
            [reflection_ids],
        )

    repeat_nonsubmit_rows = fetch_all_dict(
        """
        SELECT *
        FROM v_repeat_nonsubmit
        ORDER BY total_nonsubmit_count DESC, student_id
        LIMIT 20
        """
    )

    frequent_question_rows = fetch_all_dict(
        """
        SELECT
            s.name AS student_name,
            cg.class_name,
            COUNT(*) AS question_count,
            MAX(ss.question_text) AS latest_question
        FROM student_submissions ss
        JOIN students s ON ss.student_id = s.id
        JOIN assignments a ON ss.assignment_id = a.id
        JOIN class_groups cg ON a.class_group_id = cg.id
        WHERE ss.question_text IS NOT NULL
          AND BTRIM(ss.question_text) != ''
        GROUP BY s.name, cg.class_name
        ORDER BY question_count DESC, s.name
        LIMIT 20
        """
    )

    assignment_key_by_id = {to_int(item.get("assignment_id")): f"ca-{to_int(item.get('assignment_id'))}" for item in assignments}

    assignment_key_by_class_group = {}
    for item in assignments:
        class_group_id = to_int(item.get("class_group_id"))
        if class_group_id not in assignment_key_by_class_group:
            assignment_key_by_class_group[class_group_id] = f"ca-{to_int(item.get('assignment_id'))}"

    summary = {
        "activeAssignments": sum(1 for row in assignments if str(row.get("status")) in {"active", "due_soon", "needs_reinforcement"}),
        "dueTodayCount": sum(1 for row in assignments if row.get("due_date") and str(row.get("due_date"))[:10] in {str(datetime.date.today()), str(datetime.date.today() + datetime.timedelta(days=1))}),
        "unsubmittedStudents": len({to_int(row.get("student_id")) for row in submissions if str(row.get("submit_status")) == "not_submitted"}),
        "studentsWithQuestions": len({to_int(row.get("student_id")) for row in submissions if row.get("question_text")}),
        "avgSubmissionRate": int(round(sum(to_float(row.get("submission_rate"), 0) for row in assignments) / len(assignments))) if assignments else 0,
        "reinforcementNeeded": sum(1 for row in assignments if str(row.get("status")) == "needs_reinforcement"),
    }

    class_assignments = []
    for row in assignments:
        assignment_id = to_int(row.get("assignment_id"))
        class_assignments.append(
            {
                "id": f"ca-{assignment_id}",
                "className": row.get("class_name") or f"반 {row.get('class_group_id')}",
                "subject": track_subject_label(row.get("track")),
                "studentCount": to_int(row.get("total_submissions"), 0),
                "assignmentTitle": row.get("assignment_title") or "과제",
                "issuedDate": format_mmdd(row.get("issued_date")),
                "dueDate": format_mmdd(row.get("due_date")),
                "submittedCount": to_int(row.get("completed_count"), 0) + to_int(row.get("partial_count"), 0),
                "photoSubmissions": to_int(row.get("photo_count"), 0),
                "omrSubmissions": to_int(row.get("omr_count"), 0),
                "questionsCount": to_int(row.get("question_count"), 0),
                "status": ASSIGNMENT_STATUS_LABELS.get(str(row.get("status")), "진행 중"),
                "topMistakeTopic": row.get("top_mistake_topic") or "집계 중",
                "repeatUnsubmitCount": to_int(row.get("repeat_nonsubmit_count"), 0),
            }
        )

    omr_by_submission_id = defaultdict(list)
    for row in omr_rows:
        omr_by_submission_id[to_int(row.get("submission_id"))].append(
            {
                "questionNum": to_int(row.get("question_num")),
                "studentAnswer": row.get("student_answer") or "",
                "correctAnswer": row.get("correct_answer") or "",
                "correct": bool(row.get("is_correct")),
            }
        )

    student_submissions = []
    for row in submissions:
        assignment_id = to_int(row.get("assignment_id"))
        submission_id = to_int(row.get("id"))
        student_submissions.append(
            {
                "id": f"ss-{submission_id}",
                "classId": assignment_key_by_id.get(assignment_id, f"ca-{assignment_id}"),
                "studentName": row.get("student_name") or "-",
                "status": SUBMIT_STATUS_LABELS.get(str(row.get("submit_status")), "미완료"),
                "submittedAt": format_datetime_short(row.get("submitted_at")),
                "submissionType": SUBMISSION_TYPE_LABELS.get(str(row.get("submission_type"))) if row.get("submission_type") else None,
                "ocrSummary": row.get("ocr_summary"),
                "omrResult": omr_by_submission_id.get(submission_id),
                "correctCount": to_int(row.get("correct_count")) if row.get("correct_count") is not None else None,
                "totalQuestions": to_int(row.get("total_questions")) if row.get("total_questions") is not None else None,
                "question": row.get("question_text"),
                "isRepeatNonSubmit": bool(row.get("is_repeat_nonsubmit")),
                "needsReview": bool(row.get("needs_review")),
            }
        )

    mistakes_by_analysis_id = defaultdict(list)
    for row in cmi_rows:
        mistakes_by_analysis_id[to_int(row.get("analysis_id"))].append(
            {
                "rank": to_int(row.get("rank")),
                "questionNum": to_int(row.get("question_num")),
                "topic": row.get("topic") or "-",
                "mistakeType": str(row.get("mistake_type") or "").replace("_", " "),
                "incorrectCount": to_int(row.get("incorrect_count")),
                "totalStudents": max(to_int(row.get("total_students")), 1),
            }
        )

    common_mistake_analyses = []
    for row in cma_rows:
        assignment_id = to_int(row.get("assignment_id"))
        common_mistake_analyses.append(
            {
                "classId": assignment_key_by_id.get(assignment_id, f"ca-{assignment_id}"),
                "topMistakes": mistakes_by_analysis_id.get(to_int(row.get("id")), []),
                "weakConceptSummary": to_string_list(row.get("weak_concept_summary")),
                "repeatMistakePatterns": to_string_list(row.get("repeat_mistake_patterns")),
                "explanationNeeded": to_string_list(row.get("explanation_needed")),
                "topQuestions": to_string_list(row.get("top_questions")),
            }
        )

    individuals_by_reflection_id = defaultdict(list)
    for row in reflection_individual_rows:
        individuals_by_reflection_id[to_int(row.get("reflection_id"))].append(
            {
                "studentName": row.get("student_name") or f"학생 {to_int(row.get('student_id'))}",
                "reason": row.get("reason") or "개별 확인 필요",
            }
        )

    lesson_reflections = []
    for row in reflection_rows:
        assignment_id = to_int(row.get("assignment_id"))
        class_group_id = to_int(row.get("class_group_id"))
        class_id = assignment_key_by_id.get(assignment_id)
        if not class_id:
            class_id = assignment_key_by_class_group.get(class_group_id, f"ca-{assignment_id or class_group_id}")

        lesson_reflections.append(
            {
                "classId": class_id,
                "urgency": URGENCY_LABELS.get(str(row.get("urgency")), "중간"),
                "reExplainTopics": to_string_list(row.get("re_explain_topics")),
                "reinforcementItems": to_string_list(row.get("reinforcement_items")),
                "individualFeedbackNeeded": individuals_by_reflection_id.get(to_int(row.get("id")), []),
                "questionReflectionItems": to_string_list(row.get("question_reflection_items")),
                "homeworkFollowUp": row.get("homework_follow_up") or "핵심 개념 중심의 숙제를 재배치합니다.",
            }
        )

    reinforcement_priority = []
    for row in sorted(assignments, key=lambda item: (to_int(item.get("not_submitted_count"), 0) + to_int(item.get("needs_review_count"), 0)), reverse=True)[:3]:
        risk_score = to_int(row.get("not_submitted_count"), 0) + to_int(row.get("needs_review_count"), 0)
        urgency = "높음" if risk_score >= 5 else "중간" if risk_score >= 2 else "낮음"
        reinforcement_priority.append(
            {
                "className": row.get("class_name") or f"반 {row.get('class_group_id')}",
                "reason": f"미제출 {to_int(row.get('not_submitted_count'), 0)}건 · 검토 필요 {to_int(row.get('needs_review_count'), 0)}건",
                "urgency": urgency,
            }
        )

    recent_operation_memo = (
        f"최근 과제 {len(assignments)}건 기준으로 미제출 {summary['unsubmittedStudents']}명, "
        f"질문 등록 {summary['studentsWithQuestions']}명입니다."
    )

    assignment_insights = {
        "repeatNonSubmitStudents": [
            {
                "name": row.get("name") or f"학생 {to_int(row.get('student_id'))}",
                "className": row.get("class_name") or "-",
                "count": to_int(row.get("total_nonsubmit_count"), 0),
                "lastNote": row.get("latest_teacher_note") or "확인 필요",
            }
            for row in repeat_nonsubmit_rows[:5]
        ],
        "frequentQuestionStudents": [
            {
                "name": row.get("student_name") or "-",
                "className": row.get("class_name") or "-",
                "questionCount": to_int(row.get("question_count"), 0),
                "topic": row.get("latest_question") or "질문 내용 없음",
            }
            for row in frequent_question_rows[:5]
        ],
        "reinforcementPriority": reinforcement_priority,
        "recentOperationMemo": recent_operation_memo,
    }

    return {
        "summary": summary,
        "classAssignments": class_assignments,
        "studentSubmissions": student_submissions,
        "commonMistakeAnalyses": common_mistake_analyses,
        "lessonReflections": lesson_reflections,
        "assignmentInsights": assignment_insights,
    }


def build_curriculum_overview():
    dashboard_rows = fetch_all_dict(
        """
        SELECT *
        FROM v_curriculum_dashboard
        ORDER BY days_to_exam NULLS LAST, class_group_id
        LIMIT 200
        """
    )

    curriculum_rows = fetch_all_dict(
        """
        SELECT
            cc.id AS curriculum_id,
            cc.class_group_id,
            cri.id AS roadmap_id,
            cri.title,
            cri.period_start,
            cri.period_end,
            cri.planned_progress,
            cri.actual_progress,
            cri.status,
            cri.lesson_note,
            cri.assignment_note,
            cri.common_mistake_note,
            cri.reinforcement_note,
            cri.can_finish_before_exam,
            cri.sort_order
        FROM class_curriculums cc
        LEFT JOIN curriculum_roadmap_items cri ON cri.curriculum_id = cc.id
        ORDER BY cc.class_group_id, cri.sort_order, cri.id
        """
    )

    roadmap_ids = [to_int(row.get("roadmap_id")) for row in curriculum_rows if row.get("roadmap_id") is not None]
    subtopic_rows = []
    if roadmap_ids:
        subtopic_rows = fetch_all_dict(
            """
            SELECT roadmap_item_id, title, progress, status_label, note, sort_order
            FROM curriculum_subtopics
            WHERE roadmap_item_id = ANY(%s)
            ORDER BY roadmap_item_id, sort_order, id
            """,
            [roadmap_ids],
        )

    subtopics_by_roadmap_id = defaultdict(list)
    for row in subtopic_rows:
        subtopics_by_roadmap_id[to_int(row.get("roadmap_item_id"))].append(
            {
                "title": row.get("title") or "세부 주제",
                "progress": int(round(to_float(row.get("progress"), 0))),
                "statusLabel": row.get("status_label") or "진행 중",
                "note": row.get("note"),
            }
        )

    roadmap_by_class_group_id = defaultdict(list)
    for row in curriculum_rows:
        class_group_id = to_int(row.get("class_group_id"))
        roadmap_id = row.get("roadmap_id")
        if roadmap_id is None:
            continue

        status_raw = str(row.get("status") or "on_track")
        tone = "soft"
        if status_raw in {"at_risk", "delayed"}:
            tone = "alert"
        elif status_raw == "slightly_delayed":
            tone = "warm"
        elif status_raw == "on_track":
            tone = "success"

        roadmap_by_class_group_id[class_group_id].append(
            {
                "title": row.get("title") or "단원",
                "period": f"{format_mmdd(row.get('period_start'))} ~ {format_mmdd(row.get('period_end'))}",
                "statusLabel": status_raw,
                "tone": tone,
                "plannedProgress": int(round(to_float(row.get("planned_progress"), 0))),
                "actualProgress": int(round(to_float(row.get("actual_progress"), 0))),
                "lessonNote": row.get("lesson_note") or "수업 운영 메모",
                "assignmentNote": row.get("assignment_note") or "과제 운영 메모",
                "commonMistakeNote": row.get("common_mistake_note") or "공통 오답 점검",
                "reinforcementNote": row.get("reinforcement_note") or "보강 단원 점검",
                "canFinishBeforeExam": "가능" if row.get("can_finish_before_exam") else "주의 필요",
                "badges": [status_raw, "로드맵"],
                "subtopics": subtopics_by_roadmap_id.get(to_int(roadmap_id), []),
            }
        )

    classes = []

    for row in dashboard_rows:
        class_group_id = to_int(row.get("class_group_id"))
        class_name = row.get("class_name") or f"반 {class_group_id}"
        grade = grade_label(row.get("grade"))
        subject = track_subject_label(row.get("track"))

        planned_progress = int(round(to_float(row.get("planned_progress"), 0)))
        actual_progress = int(round(to_float(row.get("actual_progress"), 0)))
        progress_gap = to_float(row.get("progress_gap"), 0)
        delay_units = to_int(row.get("delay_units"), 0)
        reinforcement_units = to_int(row.get("reinforcement_units"), 0)

        status_raw = str(row.get("status") or "on_track")
        status_text = {
            "on_track": "순항 중",
            "slightly_delayed": "약간 지연",
            "delayed": "지연 주의",
            "at_risk": "위험",
        }.get(status_raw, status_raw)

        summary_cards = [
            {"label": "시험일", "value": format_mmdd(row.get("exam_date")), "note": "기말고사 기준 역산 계획", "emoji": "📅", "badge": to_dday(row.get("days_to_exam")), "tone": "brand"},
            {"label": "남은 수업 수", "value": f"{to_int(row.get('remaining_lessons'), 0)}회", "note": "시험 전 실제 확보 가능한 수업", "emoji": "🧭", "badge": "집중", "tone": "warm"},
            {"label": "전체 진도율", "value": f"{planned_progress}%", "note": "계획상 도달해야 할 기준 진도", "emoji": "📈", "badge": "계획", "tone": "accent"},
            {"label": "계획 대비 현재 상태", "value": status_text, "note": "현재 실제 진도 상태", "emoji": "⏳", "badge": "운영", "tone": "soft"},
            {"label": "지연 단원 수", "value": f"{delay_units}개", "note": "계획보다 늦어진 단원", "emoji": "🔁", "badge": "지연", "tone": "alert" if delay_units > 0 else "soft"},
            {"label": "보강 필요 단원 수", "value": f"{reinforcement_units}개", "note": "시험 전 우선 처리해야 할 영역", "emoji": "🛠️", "badge": "보강", "tone": "warm"},
            {"label": "완주 가능성", "value": row.get("completion_chance") or "보통", "note": "현재 속도 유지 기준", "emoji": "🎯", "badge": "판단", "tone": "success" if progress_gap >= -2 else "alert"},
            {"label": "시험 전 우선 단원", "value": row.get("next_checkpoint") or "다음 체크포인트", "note": "다음 수업부터 우선 투입", "emoji": "🚩", "badge": "우선", "tone": "brand"},
        ]

        calendar_items = [
            {"date": format_mmdd(datetime.date.today()), "label": "오늘", "title": "계획 점검", "note": "현재 진도와 지연 구간 확인", "tone": "today"},
            {"date": format_mmdd(row.get("exam_date")), "label": "시험", "title": "시험일", "note": "시험 일정", "tone": "exam"},
        ]

        roadmap = roadmap_by_class_group_id.get(class_group_id, [])
        if not roadmap:
            roadmap = [
                {
                    "title": "기본 로드맵",
                    "period": "-",
                    "statusLabel": status_text,
                    "tone": "soft",
                    "plannedProgress": planned_progress,
                    "actualProgress": actual_progress,
                    "lessonNote": "로드맵 데이터가 없습니다.",
                    "assignmentNote": "과제 데이터 점검이 필요합니다.",
                    "commonMistakeNote": "공통 오답 데이터가 없습니다.",
                    "reinforcementNote": "보강 계획을 확인해 주세요.",
                    "canFinishBeforeExam": row.get("completion_chance") or "보통",
                    "badges": ["기본"],
                    "subtopics": [],
                }
            ]

        classes.append(
            {
                "id": f"class-{class_group_id}",
                "label": class_name,
                "grade": grade,
                "subject": subject,
                "data": {
                    "overview": {
                        "school": "에임온",
                        "className": class_name,
                        "subject": subject,
                        "examDate": format_mmdd(row.get("exam_date")),
                        "currentDate": format_mmdd(datetime.date.today()),
                        "dDay": to_dday(row.get("days_to_exam")),
                        "remainingLessons": to_int(row.get("remaining_lessons"), 0),
                        "totalLessons": max(to_int(row.get("remaining_lessons"), 0) + 4, to_int(row.get("remaining_lessons"), 0)),
                        "totalUnits": to_int(row.get("total_units"), 0),
                        "plannedProgress": planned_progress,
                        "actualProgress": actual_progress,
                        "planStatus": status_text,
                        "delayUnits": delay_units,
                        "reinforcementUnits": reinforcement_units,
                        "completionChance": row.get("completion_chance") or "보통",
                        "currentPlannedPosition": f"계획 {planned_progress}%",
                        "currentActualPosition": f"실제 {actual_progress}%",
                        "finishEstimate": format_mmdd(row.get("exam_date")),
                        "nextCheckpoint": row.get("next_checkpoint") or "다음 점검 필요",
                    },
                    "summaryCards": summary_cards,
                    "reversePlan": {
                        "totalPeriod": f"오늘 ~ {format_mmdd(row.get('exam_date'))}",
                        "totalUnits": to_int(row.get("total_units"), 0),
                        "remainingUnits": to_int(row.get("remaining_units"), 0),
                        "remainingLessons": to_int(row.get("remaining_lessons"), 0),
                        "weeklyTarget": row.get("weekly_target") or "주간 목표를 확인하세요.",
                        "algorithmTarget": f"계획상 {planned_progress}% 도달",
                        "actualTarget": f"실제 {actual_progress}% 진행",
                        "gapSummary": f"{planned_progress - actual_progress}%p 차이",
                        "paceSummary": "현재 속도로 시험 전 완주 가능성을 점검합니다.",
                        "completionEstimate": format_mmdd(row.get("exam_date")),
                        "focusUnit": row.get("next_checkpoint") or "핵심 단원 점검",
                        "nextCheckpoint": row.get("next_checkpoint") or "체크포인트 설정 필요",
                    },
                    "calendar": {
                        "monthLabel": f"{datetime.date.today().month}월",
                        "periodLabel": f"시험일까지 {to_int(row.get('days_to_exam'), 0)}일",
                        "note": "계획, 보강, 체크포인트를 시험일까지 집중 배치",
                        "items": calendar_items,
                    },
                    "comparison": {
                        "totalUnits": to_int(row.get("total_units"), 0),
                        "plannedUnits": int(round(to_int(row.get("total_units"), 0) * (planned_progress / 100))) if to_int(row.get("total_units"), 0) else 0,
                        "actualUnits": int(round(to_int(row.get("total_units"), 0) * (actual_progress / 100))) if to_int(row.get("total_units"), 0) else 0,
                        "plannedPercent": planned_progress,
                        "actualPercent": actual_progress,
                        "plannedMilestone": f"계획 {planned_progress}%",
                        "actualMilestone": f"실제 {actual_progress}%",
                        "goalMilestone": row.get("next_checkpoint") or "시험 전 완주",
                        "finishEstimate": format_mmdd(row.get("exam_date")),
                        "gapSummary": f"{planned_progress - actual_progress}%p 차이",
                        "canFinishBeforeExam": row.get("completion_chance") or "보통",
                        "markers": [
                            {"label": "계획", "value": f"{planned_progress}%", "tone": "soft"},
                            {"label": "실제", "value": f"{actual_progress}%", "tone": "brand"},
                            {"label": "도달 목표", "value": row.get("next_checkpoint") or "체크포인트", "tone": "warm"},
                            {"label": "마감 예상", "value": format_mmdd(row.get("exam_date")), "tone": "accent"},
                        ],
                    },
                    "roadmap": roadmap,
                    "nextActions": {
                        "nextUnit": row.get("next_checkpoint") or "다음 단원",
                        "objective": "계획-실제 간 격차를 줄이고 시험 범위 완주를 목표로 합니다.",
                        "keyConcepts": ["핵심 개념 정리", "기출 연결", "오답 재설명"],
                        "homeworkReflection": ["숙제 미완료 학생 확인", "제출 품질 점검"],
                        "commonMistakes": ["반복 오답 유형 재설명"],
                        "reinforcementTargets": [f"보강 필요 단원 {reinforcement_units}개"],
                        "preClassChecks": ["수업 전 계획 대비 진도 점검"],
                        "buttons": ["계획 저장", "다음 수업 반영", "보강 일정 확인"],
                    },
                    "risks": {
                        "highestRisk": status_text,
                        "summary": f"지연 단원 {delay_units}개 · 보강 필요 {reinforcement_units}개",
                        "items": [
                            {
                                "title": "계획 대비 진도 격차",
                                "reason": f"계획 {planned_progress}% / 실제 {actual_progress}%",
                                "target": row.get("next_checkpoint") or "다음 체크포인트",
                                "severity": "높음" if delay_units >= 2 else "중간" if delay_units == 1 else "낮음",
                                "nextStep": "다음 수업에서 우선 보강 단원을 배치합니다.",
                            }
                        ],
                    },
                    "notes": {
                        "memoTitle": "진도 조정 / 운영 메모",
                        "memoSummary": f"현재 상태는 {status_text}이며, 다음 체크포인트는 {row.get('next_checkpoint') or '-'}입니다.",
                        "items": [
                            {
                                "title": "운영 메모",
                                "detail": "계획 대비 실진도를 매 수업 후 갱신합니다.",
                                "reason": "지연 구간을 조기에 확인하기 위해서입니다.",
                            },
                            {
                                "title": "보강 기준",
                                "detail": f"보강 필요 단원 {reinforcement_units}개를 우선 배정합니다.",
                                "reason": "시험 전 핵심 영역을 먼저 안정화하기 위해서입니다.",
                            },
                        ],
                    },
                },
            }
        )

    return {"classes": classes}


def build_reports_overview():
    student_rows = fetch_all_dict(
        """
        SELECT *
        FROM v_report_hub_student
        ORDER BY student_id, created_at DESC
        LIMIT 800
        """
    )

    latest_student_by_id = {}
    for row in student_rows:
        sid = to_int(row.get("student_id"))
        if sid not in latest_student_by_id:
            latest_student_by_id[sid] = row

    class_rows = fetch_all_dict(
        """
        SELECT *
        FROM v_report_hub_class
        ORDER BY class_group_id
        LIMIT 200
        """
    )

    exam_student_rows = fetch_all_dict(
        """
        SELECT *
        FROM v_exam_imminent_students
        ORDER BY exam_date, student_id
        LIMIT 400
        """
    )

    period_metric_rows = fetch_all_dict(
        """
        SELECT metric_name, metric_value, metric_date
        FROM report_period_metrics
        ORDER BY metric_date DESC
        LIMIT 400
        """
    )

    issue_rows = fetch_all_dict(
        """
        SELECT issue_type, urgency, occurred_at, title
        FROM v_issue_summary
        ORDER BY occurred_at DESC, id DESC
        LIMIT 50
        """
    )

    student_reports = []
    for row in latest_student_by_id.values():
        achievement = to_int(row.get("achievement_score"), 0)
        homework = int(round(to_float(row.get("homework_rate"), 0)))
        progress = int(round(to_float(row.get("progress_rate"), 0)))
        readiness_score = to_int(row.get("exam_readiness_score"), 0)

        exam_match = next((item for item in exam_student_rows if to_int(item.get("student_id")) == to_int(row.get("student_id"))), None)

        student_reports.append(
            {
                "id": str(to_int(row.get("student_id"))),
                "name": row.get("name") or "-",
                "grade": grade_label(row.get("grade")),
                "subject": "수학",
                "className": row.get("class_name") or "-",
                "achievement": achievement,
                "homework": homework,
                "progress": progress,
                "examReadiness": status_to_risk_label(readiness_score),
                "insight": row.get("summary_insight") or "리포트 요약 데이터가 없습니다.",
                "lastUpdated": format_date_dot(row.get("created_at")),
                "status": REPORT_STATUS_LABELS.get(str(row.get("overall_status")), "주의"),
                "examDate": format_date(row.get("report_period_end")) or "-",
                "dDay": to_dday(exam_match.get("days_left") if exam_match else None),
                "examUpcoming": bool(exam_match and to_int(exam_match.get("days_left"), 9999) <= 21),
            }
        )

    class_reports = []
    for row in class_rows:
        avg_score = int(round(to_float(row.get("avg_score"), 0)))
        avg_homework = int(round(to_float(row.get("avg_homework_rate"), 0)))
        actual_progress = int(round(to_float(row.get("actual_progress"), 0)))
        planned_progress = int(round(to_float(row.get("planned_progress"), 0)))

        risk_level = "양호"
        if to_float(row.get("avg_readiness"), 0) < 60 or to_int(row.get("at_risk_count"), 0) >= 3:
            risk_level = "위험"
        elif to_float(row.get("avg_readiness"), 0) < 75 or to_int(row.get("at_risk_count"), 0) >= 1:
            risk_level = "주의"

        progress_stability = "안정"
        if actual_progress + 8 < planned_progress:
            progress_stability = "불안정"
        elif actual_progress < planned_progress:
            progress_stability = "보통"

        class_reports.append(
            {
                "id": f"c{to_int(row.get('class_group_id'))}",
                "name": row.get("class_name") or "-",
                "subject": track_subject_label(row.get("track")),
                "studentCount": to_int(row.get("student_count"), 0),
                "avgAchievement": avg_score,
                "avgHomework": avg_homework,
                "avgProgress": actual_progress,
                "weakUnit": "공통 약점 단원 확인",
                "commonMistake": "공통 오답 패턴 점검 필요",
                "examRisk": risk_level,
                "focusStudentCount": to_int(row.get("at_risk_count"), 0),
                "teachingPoint": "핵심 오답 유형 재설명",
                "progressStability": progress_stability,
                "achievementTrend": [max(avg_score - 6, 0), max(avg_score - 3, 0), avg_score],
                "homeworkTrend": [max(avg_homework - 5, 0), max(avg_homework - 2, 0), avg_homework],
            }
        )

    exam_readiness_students = []
    for row in exam_student_rows:
        readiness = to_int(row.get("readiness_score"), 0)
        days_left = to_int(row.get("days_left"), 9999)

        risk_level = "양호"
        if readiness < 60 or days_left <= 14:
            risk_level = "위험"
        elif readiness < 75 or days_left <= 30:
            risk_level = "주의"

        exam_readiness_students.append(
            {
                "id": str(to_int(row.get("student_id"))),
                "name": row.get("name") or "-",
                "grade": grade_label(row.get("status")) if False else "-",
                "subject": "수학",
                "examDate": format_date(row.get("exam_date")) or "-",
                "dDay": max(days_left, 0),
                "readiness": readiness,
                "riskLevel": risk_level,
                "onTrack": str(row.get("progress_status") or "") in {"on_track", "stable"},
                "needsExtra": bool(row.get("needs_reinforcement")),
                "needsPlanAdjust": str(row.get("progress_status") or "") in {"delayed", "at_risk"},
                "riskNote": row.get("note") or "시험 전 집중 보강 포인트를 점검하세요.",
            }
        )

    class_exam_agg = defaultdict(lambda: {
        "readiness_values": [],
        "days": [],
        "risk": 0,
    })
    for row in exam_student_rows:
        class_name = row.get("class_name") or "-"
        class_exam_agg[class_name]["readiness_values"].append(to_float(row.get("readiness_score"), 0))
        class_exam_agg[class_name]["days"].append(to_int(row.get("days_left"), 9999))
        if bool(row.get("needs_reinforcement")):
            class_exam_agg[class_name]["risk"] += 1

    exam_readiness_classes = []
    idx = 1
    for class_name, item in class_exam_agg.items():
        avg_readiness = int(round(sum(item["readiness_values"]) / len(item["readiness_values"]))) if item["readiness_values"] else 0
        min_day = min(item["days"]) if item["days"] else 9999
        risk_level = "양호"
        if avg_readiness < 60 or item["risk"] >= 2:
            risk_level = "위험"
        elif avg_readiness < 75 or item["risk"] >= 1:
            risk_level = "주의"

        exam_readiness_classes.append(
            {
                "id": f"ec{idx}",
                "name": class_name,
                "examDate": "-",
                "dDay": max(min_day, 0) if min_day != 9999 else 0,
                "avgReadiness": avg_readiness,
                "riskLevel": risk_level,
                "completionRisk": item["risk"] >= 1,
                "riskNote": "보강 필요 학생 비율을 점검하세요.",
            }
        )
        idx += 1

    metrics_by_name = defaultdict(list)
    for row in sorted(period_metric_rows, key=lambda item: item.get("metric_date") or datetime.date.today()):
        metrics_by_name[str(row.get("metric_name"))].append(row)

    def build_points(metric_name, labels):
        rows = metrics_by_name.get(metric_name, [])
        if not rows:
            return [{"label": label, "value": 0} for label in labels]

        selected = rows[-len(labels):]
        points = []
        for idx_local, row in enumerate(selected):
            points.append({
                "label": labels[idx_local],
                "value": int(round(to_float(row.get("metric_value"), 0))),
            })
        while len(points) < len(labels):
            points.insert(0, {"label": labels[len(points)], "value": 0})
        return points

    def build_period(period_key, labels):
        achievement = build_points("achievement", labels)
        homework = build_points("homework_rate", labels)
        progress = build_points("progress_rate", labels)

        question_count = [{"label": label, "value": max(int(round(val["value"] / 10)), 0)} for label, val in zip(labels, achievement)]
        missed_count = [{"label": label, "value": max(10 - int(round(val["value"] / 10)), 0)} for label, val in zip(labels, homework)]
        risk_count = [{"label": label, "value": max(5 - int(round(val["value"] / 20)), 0)} for label, val in zip(labels, progress)]

        issues = []
        for issue in issue_rows[:8]:
            severity = "low"
            urgency = str(issue.get("urgency") or "")
            if urgency in {"critical", "high"}:
                severity = "high"
            elif urgency == "medium":
                severity = "medium"

            issue_type = str(issue.get("issue_type") or "")
            type_label = {
                "unsubmitted": "숙제",
                "progress_delay": "진도",
                "exam_imminent": "시험",
                "question": "숙제",
            }.get(issue_type, "진도")

            issues.append(
                {
                    "date": format_mmdd(issue.get("occurred_at")),
                    "type": type_label,
                    "severity": severity,
                    "title": issue.get("title") or "이슈",
                }
            )

        return {
            "achievementTrend": achievement,
            "homeworkTrend": homework,
            "progressTrend": progress,
            "questionCount": question_count,
            "missedCount": missed_count,
            "riskCount": risk_count,
            "issues": issues,
        }

    period_reports = {
        "1주": build_period("1주", ["이번 주"]),
        "2주": build_period("2주", ["1주 전", "이번 주"]),
        "4주": build_period("4주", ["4주 전", "3주 전", "2주 전", "이번 주"]),
        "월간": build_period("월간", ["1주", "2주", "3주", "4주"]),
    }

    avg_achievement = int(round(sum(item["achievement"] for item in student_reports) / len(student_reports))) if student_reports else 0
    avg_homework = int(round(sum(item["homework"] for item in student_reports) / len(student_reports))) if student_reports else 0
    avg_progress = int(round(sum(item["progress"] for item in student_reports) / len(student_reports))) if student_reports else 0

    report_hub_summary_cards = [
        {"label": "전체 학생 평균 성취도", "value": f"{avg_achievement}%", "note": "학생 리포트 기준 집계", "emoji": "📊", "tone": "brand", "badge": "실데이터"},
        {"label": "평균 숙제 수행률", "value": f"{avg_homework}%", "note": "학생 리포트 기준 집계", "emoji": "📝", "tone": "success", "badge": "실데이터"},
        {"label": "평균 진도 달성률", "value": f"{avg_progress}%", "note": "학생 리포트 기준 집계", "emoji": "📈", "tone": "accent", "badge": "실데이터"},
        {"label": "시험 임박 학생", "value": f"{len([s for s in exam_readiness_students if s['dDay'] <= 14])}명", "note": "D-14 기준", "emoji": "📅", "tone": "alert", "badge": "즉시 확인"},
        {"label": "집중 관리 필요 학생", "value": f"{len([s for s in student_reports if s['status'] in {'주의', '위험', '관리 필요'}])}명", "note": "전체 학생 기준", "emoji": "⚠️", "tone": "warm", "badge": "점검"},
        {"label": "계획 대비 위험 반", "value": f"{len([c for c in class_reports if c['examRisk'] == '위험'])}개", "note": "반 리포트 기준", "emoji": "🏫", "tone": "soft", "badge": "점검 필요"},
    ]

    return {
        "summaryCards": report_hub_summary_cards,
        "studentReports": student_reports,
        "classReports": class_reports,
        "examReadinessStudents": exam_readiness_students,
        "examReadinessClasses": exam_readiness_classes,
        "periodReports": period_reports,
    }


def build_report_student_detail(student_id):
    report_row = fetch_one_dict(
        """
        SELECT
            rs.id AS report_id,
            rs.student_id,
            rs.report_period_start,
            rs.report_period_end,
            rs.overall_status,
            rs.summary_insight,
            rs.achievement_score,
            rs.progress_rate,
            rs.homework_rate,
            rs.weak_topic_count,
            rs.exam_readiness_score,
            rs.plan_stability,
            rs.teacher_comment,
            rs.next_lesson_direction,
            rs.created_at,
            s.student_code,
            s.name,
            s.grade,
            sc.name AS school_name,
            cg.class_name,
            ex.exam_date,
            (ex.exam_date - CURRENT_DATE) AS days_left,
            COALESCE(cc.actual_progress, 0) AS actual_progress,
            COALESCE(cc.planned_progress, 0) AS planned_progress,
            COALESCE(cc.total_units, 0) AS total_units,
            COALESCE(cc.remaining_lessons, 0) AS remaining_lessons
        FROM reports_student rs
        JOIN students s ON rs.student_id = s.id
        LEFT JOIN schools sc ON s.school_id = sc.id
        LEFT JOIN enrollments en ON en.student_id = s.id AND en.is_active = TRUE
        LEFT JOIN class_groups cg ON en.class_group_id = cg.id
        LEFT JOIN class_curriculums cc ON cc.class_group_id = cg.id
        LEFT JOIN LATERAL (
            SELECT exam_date
            FROM exams e
            WHERE e.class_group_id = cg.id
              AND e.exam_date >= CURRENT_DATE
            ORDER BY exam_date
            LIMIT 1
        ) ex ON TRUE
        WHERE rs.student_id = %s
        ORDER BY rs.created_at DESC
        LIMIT 1
        """,
        [student_id],
    )

    if not report_row:
        return None

    report_id = to_int(report_row.get("report_id"))

    metric_rows = fetch_all_dict(
        """
        SELECT metric_name, metric_value, metric_date
        FROM report_period_metrics
        WHERE report_id = %s
        ORDER BY metric_date
        """,
        [report_id],
    )

    achievement_rows = fetch_all_dict(
        """
        SELECT session_num, session_date, score, note
        FROM student_achievement_trends
        WHERE student_id = %s
        ORDER BY session_date
        LIMIT 16
        """,
        [student_id],
    )

    weak_topic_rows = fetch_all_dict(
        """
        SELECT topic, severity, created_at
        FROM student_weak_topics
        WHERE student_id = %s
        ORDER BY created_at DESC
        LIMIT 30
        """,
        [student_id],
    )

    timeline_rows = fetch_all_dict(
        """
        SELECT milestone_type, event_title, event_date, note
        FROM student_timelines
        WHERE student_id = %s
        ORDER BY event_date DESC
        LIMIT 8
        """,
        [student_id],
    )

    feedback_rows = fetch_all_dict(
        """
        SELECT feedback_text, next_action, logged_at
        FROM student_feedback_logs
        WHERE student_id = %s
        ORDER BY logged_at DESC
        LIMIT 6
        """,
        [student_id],
    )

    metrics_by_name = defaultdict(list)
    for row in metric_rows:
        metrics_by_name[str(row.get("metric_name"))].append(row)

    def metric_to_points(metric_name, labels):
        rows = metrics_by_name.get(metric_name, [])
        if not rows:
            return [{"week": label, "completionRate": 0, "submitted": 0, "total": 10} for label in labels]

        selected = rows[-len(labels):]
        points = []
        for idx_local, row in enumerate(selected):
            value = int(round(to_float(row.get("metric_value"), 0)))
            points.append(
                {
                    "week": labels[idx_local],
                    "completionRate": value,
                    "submitted": int(round(value / 10)),
                    "total": 10,
                }
            )
        return points

    labels = ["4주 전", "3주 전", "2주 전", "지난 주"]
    homework_trend = metric_to_points("homework_rate", labels)

    achievement_trend = []
    for idx_local, row in enumerate(achievement_rows[-8:]):
        achievement_trend.append(
            {
                "session": f"{to_int(row.get('session_num'), idx_local + 1)}회차",
                "date": format_mmdd(row.get("session_date")),
                "score": to_int(row.get("score"), 0),
                "note": row.get("note"),
            }
        )

    if not achievement_trend:
        achievement_trend = [
            {"session": "1회차", "date": "-", "score": to_int(report_row.get("achievement_score"), 0), "note": None}
        ]

    weak_topics = []
    weak_topic_count_by_name = defaultdict(int)
    for row in weak_topic_rows:
        topic_name = row.get("topic") or "취약 단원"
        weak_topic_count_by_name[topic_name] += 1

    for topic_name, count in sorted(weak_topic_count_by_name.items(), key=lambda item: item[1], reverse=True)[:8]:
        severity_raw = next((str(row.get("severity")) for row in weak_topic_rows if row.get("topic") == topic_name), "medium")
        severity_label = {"high": "높음", "medium": "중간", "low": "낮음"}.get(severity_raw, "중간")
        weak_topics.append(
            {
                "topic": topic_name,
                "category": "개념",
                "severity": severity_label,
                "frequency": count,
                "lastOccurred": format_mmdd(next((row.get("created_at") for row in weak_topic_rows if row.get("topic") == topic_name), None)),
                "riskBeforeExam": severity_label in {"높음", "중간"},
            }
        )

    repeat_patterns = []
    for topic in weak_topics[:4]:
        repeat_patterns.append(
            {
                "pattern": f"{topic['topic']} 관련 오답 반복",
                "count": topic["frequency"],
                "type": "개념 혼동" if topic["severity"] != "낮음" else "절차 누락",
            }
        )

    recent_milestones = []
    for row in timeline_rows:
        milestone_type = str(row.get("milestone_type") or "feedback_given")
        type_label = {
            "unit_complete": "수업",
            "exam_prep": "시험",
            "goal_achieved": "수업",
            "plan_adjusted": "피드백",
            "feedback_given": "피드백",
        }.get(milestone_type, "수업")
        recent_milestones.append(
            {
                "date": format_mmdd(row.get("event_date")),
                "type": type_label,
                "title": row.get("event_title") or "활동",
                "detail": row.get("note") or "상세 기록 없음",
            }
        )

    for row in feedback_rows[:3]:
        recent_milestones.append(
            {
                "date": format_mmdd(row.get("logged_at")),
                "type": "피드백",
                "title": "선생님 피드백",
                "detail": row.get("feedback_text") or "-",
            }
        )

    recent_milestones = sorted(
        recent_milestones,
        key=lambda item: item.get("date") or "",
        reverse=True,
    )[:8]

    achievement_score = to_int(report_row.get("achievement_score"), 0)
    progress_rate = int(round(to_float(report_row.get("progress_rate"), 0)))
    homework_rate = int(round(to_float(report_row.get("homework_rate"), 0)))
    readiness_score = to_int(report_row.get("exam_readiness_score"), 0)

    planned_progress = int(round(to_float(report_row.get("planned_progress"), 0)))
    actual_progress = int(round(to_float(report_row.get("actual_progress"), 0)))
    total_units = to_int(report_row.get("total_units"), 0)

    report_kpis = [
        {
            "id": "achievement",
            "label": "최근 성취도",
            "value": f"{achievement_score}점",
            "change": "+0점",
            "changeDir": "neutral",
            "note": "최근 리포트 기준",
            "tone": "brand",
            "icon": "📈",
        },
        {
            "id": "progress",
            "label": "진도 달성률",
            "value": f"{progress_rate}%",
            "change": f"계획 대비 {actual_progress - planned_progress:+d}%",
            "changeDir": "up" if actual_progress >= planned_progress else "down",
            "note": "계획 대비 진행률",
            "tone": "warm",
            "icon": "📚",
        },
        {
            "id": "homework",
            "label": "숙제 수행률",
            "value": f"{homework_rate}%",
            "change": "최근 기준",
            "changeDir": "neutral",
            "note": "숙제 제출/완료율",
            "tone": "accent",
            "icon": "📝",
        },
        {
            "id": "weakTopics",
            "label": "반복 취약 단원",
            "value": f"{len(weak_topics)}개",
            "change": "최근 기준",
            "changeDir": "neutral",
            "note": "학생 취약 단원 집계",
            "tone": "soft",
            "icon": "⚠️",
        },
        {
            "id": "examReadiness",
            "label": "시험 준비도",
            "value": f"{readiness_score}%",
            "change": "최근 기준",
            "changeDir": "neutral",
            "note": "시험 대비 준비도",
            "tone": "alert",
            "icon": "🎯",
        },
        {
            "id": "planStability",
            "label": "계획 안정성",
            "value": report_row.get("plan_stability") or "보통",
            "change": "최근 기준",
            "changeDir": "neutral",
            "note": "계획 안정성 평가",
            "tone": "soft",
            "icon": "🗓️",
        },
    ]

    progress_vs_plan = {
        "totalUnits": total_units,
        "plannedUnits": int(round(total_units * planned_progress / 100)) if total_units else 0,
        "actualUnits": int(round(total_units * actual_progress / 100)) if total_units else 0,
        "plannedPercent": planned_progress,
        "actualPercent": actual_progress,
        "status": "순항" if actual_progress >= planned_progress else "소폭 지연",
        "currentUnit": "현재 단원 진행 중",
        "delayNote": "계획 대비 차이를 점검 중입니다.",
        "weeklyBreakdown": [
            {"week": "w1", "planned": max(int(round(planned_progress / 4)), 0), "actual": max(int(round(actual_progress / 4)), 0), "label": "3주 전"},
            {"week": "w2", "planned": max(int(round(planned_progress / 3)), 0), "actual": max(int(round(actual_progress / 3)), 0), "label": "2주 전"},
            {"week": "w3", "planned": max(int(round(planned_progress / 2)), 0), "actual": max(int(round(actual_progress / 2)), 0), "label": "지난 주"},
            {"week": "w4", "planned": planned_progress, "actual": actual_progress, "label": "이번 주"},
        ],
    }

    exam_readiness = {
        "examDate": format_date(report_row.get("exam_date")) or "-",
        "dDay": to_dday(report_row.get("days_left")),
        "readinessScore": readiness_score,
        "targetScore": 85,
        "currentEstimated": achievement_score,
        "remainingLessons": to_int(report_row.get("remaining_lessons"), 0),
        "remainingWeeks": round(max(to_int(report_row.get("days_left"), 0), 0) / 7, 1),
        "status": "주의 필요" if readiness_score < 75 else "양호",
        "canReachTarget": readiness_score >= 75,
        "reachableScore": min(readiness_score + 12, 100),
        "reinforcementRequired": readiness_score < 75,
        "examCoverageReady": progress_rate,
        "checkItems": [
            {"label": "핵심 단원 이해도", "done": achievement_score >= 70},
            {"label": "기출문제 풀이 완료", "done": progress_rate >= 70},
            {"label": "서술형 대비 연습", "done": homework_rate >= 70},
            {"label": "취약 단원 보강 완료", "done": len(weak_topics) <= 3},
            {"label": "오답 노트 정리", "done": len(recent_milestones) >= 2},
            {"label": "실전 모의 풀이 1회", "done": readiness_score >= 80},
        ],
    }

    teacher_comment = {
        "strengths": [
            "최근 성취도와 숙제 수행률이 안정적으로 관리되고 있습니다.",
            "수업 참여도와 피드백 반응이 개선되고 있습니다.",
        ],
        "concerns": [
            "취약 단원 반복 패턴에 대한 추가 보강이 필요합니다.",
            "시험 전 핵심 문항 속도와 정확도 균형이 필요합니다.",
        ],
        "recentChange": report_row.get("summary_insight") or "최근 변화 데이터가 없습니다.",
        "nextFocus": report_row.get("next_lesson_direction") or "다음 수업에서 취약 단원 보강을 우선합니다.",
    }

    next_direction = {
        "nextLesson": report_row.get("next_lesson_direction") or "다음 수업 운영 방향을 설정하세요.",
        "reinforcement": [topic["topic"] for topic in weak_topics[:3]] or ["핵심 취약 단원 보강"],
        "homeworkDirection": "핵심 단원 중심으로 과제 분량을 압축하고 오답 복습을 강화합니다.",
        "explanationFocus": [pattern["pattern"] for pattern in repeat_patterns[:3]] or ["오답 원인 설명 강화"],
        "priority": "시험 대비 취약 단원 보강 > 숙제 안정화 > 진도 마무리",
    }

    report_student = {
        "id": report_row.get("student_code") or f"AIM_{student_id}",
        "name": report_row.get("name") or "-",
        "grade": grade_label(report_row.get("grade")),
        "subject": "수학",
        "className": report_row.get("class_name") or "-",
        "school": report_row.get("school_name") or "-",
        "reportPeriod": f"{format_date_dot(report_row.get('report_period_start'))} – {format_date_dot(report_row.get('report_period_end'))}",
        "examDate": format_date(report_row.get("exam_date")) or "-",
        "dDay": to_dday(report_row.get("days_left")),
        "overallStatus": "주의 필요" if str(report_row.get("overall_status")) in {"caution", "critical"} else "양호",
        "summaryInsight": report_row.get("summary_insight") or "요약 인사이트가 없습니다.",
    }

    return {
        "reportStudent": report_student,
        "reportKPIs": report_kpis,
        "achievementTrend": achievement_trend,
        "homeworkTrend": homework_trend,
        "progressVsPlan": progress_vs_plan,
        "weakTopics": weak_topics,
        "repeatMistakePatterns": repeat_patterns,
        "examReadiness": exam_readiness,
        "teacherComment": teacher_comment,
        "nextDirection": next_direction,
        "recentMilestones": recent_milestones,
    }


def build_settings_overview():
    profile = get_teacher_profile()
    teacher_id = profile.get("teacherId") or 1

    settings_rows = fetch_all_dict(
        """
        SELECT setting_key, setting_value
        FROM teacher_settings
        WHERE teacher_id = %s
        """,
        [teacher_id],
    )

    settings_map = {row.get("setting_key"): to_json(row.get("setting_value"), {}) for row in settings_rows}

    class_rows = fetch_all_dict(
        """
        SELECT
            vc.class_group_id,
            vc.class_name,
            vc.track,
            vc.enrolled_count,
            vc.next_exam_date
        FROM v_class_list vc
        ORDER BY vc.class_group_id
        LIMIT 200
        """
    )

    notification_defaults = [
        {"key": "exam_alert", "label": "시험 임박 알림", "description": "D-14 이내 시험 예정 학생 발생 시 알림", "enabled": True},
        {"key": "missing_hw", "label": "미제출 알림", "description": "숙제 미제출 2회 이상 학생 발생 시 알림", "enabled": True},
        {"key": "question_alert", "label": "질문 등록 알림", "description": "학생이 질문을 새로 등록할 때 알림", "enabled": True},
        {"key": "ocr_review", "label": "OCR 검토 필요 알림", "description": "OCR 인식 오류로 검토가 필요할 때 알림", "enabled": True},
        {"key": "plan_delay", "label": "계획 지연 알림", "description": "진도 달성률이 목표 대비 낮을 때 알림", "enabled": True},
        {"key": "lesson_issue", "label": "수업 반영 필요 이슈 알림", "description": "이슈함에 긴급 이슈가 등록될 때 알림", "enabled": True},
    ]

    notification_settings = settings_map.get("notification_settings")
    if not isinstance(notification_settings, list):
        notification_settings = notification_defaults

    report_settings = settings_map.get("report_settings")
    if not isinstance(report_settings, dict):
        report_settings = {
            "defaultPeriod": "4주",
            "defaultView": "학생별",
            "examEmphasisDDay": "D-14",
        }

    lesson_settings = settings_map.get("lesson_settings")
    if not isinstance(lesson_settings, dict):
        lesson_settings = {
            "defaultDuration": "90분",
            "showNextAction": True,
            "showLessonMemo": True,
            "todayPageInfoScope": "전체",
        }

    assignment_settings = settings_map.get("assignment_settings")
    if not isinstance(assignment_settings, dict):
        assignment_settings = {
            "defaultDeadlineTime": "23:59",
            "allowPhotoSubmit": True,
            "allowOMRSubmit": True,
            "questionEnabled": True,
            "ocrReviewHighlight": True,
            "commonMistakeAlert": True,
        }

    basic_info_settings = {
        "classes": [
            {
                "name": row.get("class_name") or "-",
                "subject": track_subject_label(row.get("track")),
                "studentCount": to_int(row.get("enrolled_count"), 0),
                "examDate": format_date(row.get("next_exam_date")) or "-",
            }
            for row in class_rows
        ],
        "subjects": sorted({track_subject_label(row.get("track")) for row in class_rows}),
        "examScheduleLinked": any(row.get("next_exam_date") is not None for row in class_rows),
        "curriculumTemplateLinked": True,
    }

    return {
        "profile": {
            "name": profile.get("name"),
            "displayName": profile.get("displayName", ""),
            "affiliation": profile.get("affiliation"),
            "role": profile.get("role"),
            "email": profile.get("email"),
            "phone": profile.get("phone"),
            "intro": profile.get("intro", ""),
            "joined": profile.get("joined"),
        },
        "notificationSettings": notification_settings,
        "reportSettings": report_settings,
        "lessonSettings": lesson_settings,
        "assignmentSettings": assignment_settings,
        "basicInfoSettings": basic_info_settings,
    }


def get_teacher_profile(user=None):
    teacher = fetch_one_dict_safe(
        """
        SELECT id, name, role, initials, email, phone, created_at
        FROM teachers
        ORDER BY id
        LIMIT 1
        """
    )

    display_name = resolve_user_display_name(user)
    name = display_name or (teacher.get("name") if teacher else None) or "선생님"
    role = resolve_user_role_label(user) or (teacher.get("role") if teacher else None) or "교사용 관리자"
    initials = resolve_user_initials(user, name)
    teacher_id = (teacher.get("id") if teacher else None) or getattr(user, "id", None) or 1
    user_email = (getattr(user, "email", None) or "").strip() if user is not None else ""

    return {
        "teacherId": teacher_id,
        "name": name,
        "affiliation": "목동 에임 학원",
        "role": role,
        "email": user_email or (teacher.get("email") if teacher else None) or "-",
        "phone": (teacher.get("phone") if teacher else None) or "-",
        "joined": format_date_dot(teacher.get("created_at") if teacher else None) or "-",
        "header": {
            "name": resolve_user_header_name(user, name),
            "role": role,
            "initials": initials,
            "greetingName": resolve_user_greeting_name(user, name),
        },
    }


def build_settings_overview(user=None):
    profile = get_teacher_profile(user)
    teacher_id = profile.get("teacherId") or 1

    settings_rows = fetch_all_dict_safe(
        """
        SELECT setting_key, setting_value
        FROM teacher_settings
        WHERE teacher_id = %s
        """,
        [teacher_id],
    )
    settings_map = {row.get("setting_key"): to_json(row.get("setting_value"), {}) for row in settings_rows}

    class_rows = fetch_all_dict_safe(
        """
        SELECT
            vc.class_group_id,
            vc.class_name,
            vc.track,
            vc.enrolled_count,
            vc.next_exam_date
        FROM v_class_list vc
        ORDER BY vc.class_group_id
        LIMIT 200
        """
    )

    notification_defaults = [
        {"key": "exam_alert", "label": "?쒗뿕 ?꾨컯 ?뚮┝", "description": "D-14 ?대궡 ?쒗뿕 ?덉젙 ?숈깮 諛쒖깮 ???뚮┝", "enabled": True},
        {"key": "missing_hw", "label": "誘몄젣異??뚮┝", "description": "?숈젣 誘몄젣異?2???댁긽 ?숈깮 諛쒖깮 ???뚮┝", "enabled": True},
        {"key": "question_alert", "label": "吏덈Ц ?깅줉 ?뚮┝", "description": "?숈깮??吏덈Ц???덈줈 ?깅줉?????뚮┝", "enabled": True},
        {"key": "ocr_review", "label": "OCR 寃???꾩슂 ?뚮┝", "description": "OCR ?몄떇 ?ㅻ쪟濡?寃?좉? ?꾩슂?????뚮┝", "enabled": True},
        {"key": "plan_delay", "label": "怨꾪쉷 吏???뚮┝", "description": "吏꾨룄 ?ъ꽦瑜좎씠 紐⑺몴 ?鍮???쓣 ???뚮┝", "enabled": True},
        {"key": "lesson_issue", "label": "?섏뾽 諛섏쁺 ?꾩슂 ?댁뒋 ?뚮┝", "description": "?댁뒋?⑥뿉 湲닿툒 ?댁뒋媛 ?깅줉?????뚮┝", "enabled": True},
    ]

    notification_settings = settings_map.get("notification_settings")
    if not isinstance(notification_settings, list):
        notification_settings = notification_defaults

    report_settings = settings_map.get("report_settings")
    if not isinstance(report_settings, dict):
        report_settings = {
            "defaultPeriod": "4二?",
            "defaultView": "?숈깮蹂?",
            "examEmphasisDDay": "D-14",
        }

    lesson_settings = settings_map.get("lesson_settings")
    if not isinstance(lesson_settings, dict):
        lesson_settings = {
            "defaultDuration": "90遺?",
            "showNextAction": True,
            "showLessonMemo": True,
            "todayPageInfoScope": "?꾩껜",
        }

    assignment_settings = settings_map.get("assignment_settings")
    if not isinstance(assignment_settings, dict):
        assignment_settings = {
            "defaultDeadlineTime": "23:59",
            "allowPhotoSubmit": True,
            "allowOMRSubmit": True,
            "questionEnabled": True,
            "ocrReviewHighlight": True,
            "commonMistakeAlert": True,
        }

    basic_info_settings = {
        "classes": [
            {
                "name": row.get("class_name") or "-",
                "subject": track_subject_label(row.get("track")),
                "studentCount": to_int(row.get("enrolled_count"), 0),
                "examDate": format_date(row.get("next_exam_date")) or "-",
            }
            for row in class_rows
        ],
        "subjects": sorted({track_subject_label(row.get("track")) for row in class_rows}),
        "examScheduleLinked": any(row.get("next_exam_date") is not None for row in class_rows),
        "curriculumTemplateLinked": True,
    }

    return {
        "profile": {
            "name": profile.get("name"),
            "affiliation": profile.get("affiliation"),
            "role": profile.get("role"),
            "email": profile.get("email"),
            "phone": profile.get("phone"),
            "joined": profile.get("joined"),
        },
        "notificationSettings": notification_settings,
        "reportSettings": report_settings,
        "lessonSettings": lesson_settings,
        "assignmentSettings": assignment_settings,
        "basicInfoSettings": basic_info_settings,
    }


def get_teacher_profile(user=None):
    teacher = fetch_one_dict_safe(
        """
        SELECT id, name, role, initials, email, phone, created_at
        FROM teachers
        ORDER BY id
        LIMIT 1
        """
    )

    profile_context = get_user_profile_context(user)
    teacher_display_name = ((profile_context or {}).get("teacher_display_name") or "").strip()
    user_name = ((profile_context or {}).get("user_name") or "").strip()
    login_id = ((profile_context or {}).get("login_id") or "").strip()
    profile_email = ((profile_context or {}).get("email") or "").strip()
    profile_phone = ((profile_context or {}).get("phone") or "").strip()
    intro = ((profile_context or {}).get("intro") or "").strip()
    resolved_display_name = (profile_context or {}).get("display_name") or resolve_user_display_name(user)
    name = user_name or login_id or profile_email or resolved_display_name or (teacher.get("name") if teacher else None) or "\uc120\uc0dd\ub2d8"
    role = (
        (profile_context or {}).get("role_label")
        or resolve_user_role_label(user)
        or (teacher.get("role") if teacher else None)
        or "\uad50\uc0ac\uc6a9 \uad00\ub9ac\uc790"
    )
    initials = resolve_user_initials(user, resolved_display_name or name)
    teacher_id = (profile_context or {}).get("user_id") or (teacher.get("id") if teacher else None) or getattr(user, "id", None) or 1
    user_email = (getattr(user, "email", None) or "").strip() if user is not None else ""
    affiliation = (profile_context or {}).get("academy_name")
    joined_at = (profile_context or {}).get("created_at") or (teacher.get("created_at") if teacher else None)

    return {
        "teacherId": teacher_id,
        "name": name,
        "displayName": teacher_display_name,
        "affiliation": affiliation or DB_REQUIRED_TEXT,
        "role": role,
        "email": _db_required_text(profile_email or user_email or (teacher.get("email") if teacher else None)),
        "phone": _db_required_text(profile_phone or (teacher.get("phone") if teacher else None)),
        "intro": intro,
        "joined": _db_required_date(joined_at),
        "header": {
            "name": resolve_user_header_name(user, resolved_display_name or name),
            "role": role,
            "initials": initials,
            "greetingName": resolve_user_greeting_name(user, resolved_display_name or name),
        },
    }


DB_REQUIRED_TEXT = "<db 데이터필요>"


def _db_required_text(value, fallback=DB_REQUIRED_TEXT):
    if value is None:
        return fallback
    text = str(value).strip()
    if not text or text == "-":
        return fallback
    return text


def _db_required_date(value):
    formatted = format_date_dot(value)
    if formatted in (None, "", "-"):
        return DB_REQUIRED_TEXT
    return formatted


def _table_exists(table_name):
    with connection.cursor() as cursor:
        cursor.execute("SELECT to_regclass(%s)", [f"public.{table_name}"])
        row = cursor.fetchone()
    return bool(row and row[0])


def _parse_json_request_body(request):
    if not request.body:
        return {}, None

    try:
        return json.loads(request.body.decode("utf-8")), None
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}, "올바른 JSON 형식이 아닙니다."


def _normalize_optional_text(value, *, max_length=None):
    if value is None:
        return None

    text = str(value).strip()
    if not text:
        return None
    if max_length is not None and len(text) > max_length:
        raise ValueError(f"{max_length}자 이하로 입력해 주세요.")
    return text


def _normalize_profile_update_payload(payload):
    errors = {}

    try:
        name = _normalize_optional_text(payload.get("name"), max_length=255)
    except ValueError as exc:
        errors["name"] = str(exc)
        name = None

    if not name:
        errors["name"] = "이름을 입력해 주세요."

    try:
        email = _normalize_optional_text(payload.get("email"), max_length=254)
    except ValueError as exc:
        errors["email"] = str(exc)
        email = None

    if email:
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = "올바른 이메일 형식이 아닙니다."

    try:
        phone = _normalize_optional_text(payload.get("phone"), max_length=50)
    except ValueError as exc:
        errors["phone"] = str(exc)
        phone = None

    try:
        display_name = _normalize_optional_text(
            payload.get("displayName", payload.get("display_name")),
            max_length=255,
        )
    except ValueError as exc:
        errors["displayName"] = str(exc)
        display_name = None

    intro_raw = payload.get("intro")
    intro = None
    if intro_raw is not None:
        intro = str(intro_raw).strip() or None
        if intro is not None and len(intro) > 2000:
            errors["intro"] = "소개는 2000자 이하로 입력해 주세요."

    return {
        "errors": errors,
        "name": name,
        "email": email,
        "phone": phone,
        "display_name": display_name,
        "intro": intro,
    }


def _ensure_teacher_user_row(user):
    if not _table_exists("users"):
        raise RuntimeError("users table not found")

    username = (user.get_username() or "").strip()
    fallback_name = (
        ((user.get_full_name() or "").strip())
        or ((getattr(user, "email", None) or "").strip())
        or username
        or "선생님"
    )

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT id
            FROM public.users
            WHERE auth_user_id = %s
               OR LOWER(login_id) = LOWER(%s)
            ORDER BY CASE WHEN auth_user_id = %s THEN 0 ELSE 1 END, id
            LIMIT 1
            """,
            [user.id, username, user.id],
        )
        row = cursor.fetchone()

        if row:
            user_id = row[0]
            cursor.execute(
                """
                UPDATE public.users
                SET auth_user_id = %s,
                    login_id = COALESCE(NULLIF(BTRIM(login_id), ''), %s),
                    password_hash = COALESCE(NULLIF(password_hash, ''), %s),
                    name = COALESCE(NULLIF(BTRIM(name), ''), %s),
                    email = COALESCE(NULLIF(BTRIM(email), ''), NULLIF(%s, ''))
                WHERE id = %s
                """,
                [user.id, username, user.password, fallback_name, (user.email or "").strip(), user_id],
            )
            return user_id

        cursor.execute(
            """
            INSERT INTO public.users (
                auth_user_id,
                login_id,
                email,
                password_hash,
                name,
                phone,
                role,
                status,
                last_login_at
            )
            VALUES (%s, %s, NULLIF(%s, ''), %s, %s, NULL, 'teacher', 'active', %s)
            RETURNING id
            """,
            [user.id, username, (user.email or "").strip(), user.password, fallback_name, user.last_login],
        )
        return cursor.fetchone()[0]


def _find_teacher_user_row_id(user):
    if not _table_exists("users"):
        return None

    username = (user.get_username() or "").strip()
    row = fetch_one_dict(
        """
        SELECT id
        FROM public.users
        WHERE auth_user_id = %s
           OR LOWER(login_id) = LOWER(%s)
        ORDER BY CASE WHEN auth_user_id = %s THEN 0 ELSE 1 END, id
        LIMIT 1
        """,
        [user.id, username, user.id],
    )
    return row.get("id") if row else None


def _get_primary_academy_id(user_id):
    if _table_exists("academy_members"):
        row = fetch_one_dict(
            """
            SELECT academy_id
            FROM public.academy_members
            WHERE user_id = %s
              AND status IN ('active', 'invited', 'inactive')
            ORDER BY
                is_primary DESC,
                CASE status WHEN 'active' THEN 0 WHEN 'invited' THEN 1 ELSE 2 END,
                id
            LIMIT 1
            """,
            [user_id],
        )
        if row and row.get("academy_id"):
            return row["academy_id"]

    if _table_exists("academies"):
        row = fetch_one_dict(
            """
            SELECT id
            FROM public.academies
            WHERE owner_user_id = %s
              AND status IN ('active', 'inactive', 'archived')
            ORDER BY
                CASE status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END,
                id
            LIMIT 1
            """,
            [user_id],
        )
        if row and row.get("id"):
            return row["id"]

    return None


def _sync_teacher_profile_tables(user, payload):
    normalized = _normalize_profile_update_payload(payload)
    if normalized["errors"]:
        return {"ok": False, "errors": normalized["errors"]}

    existing_user_id = _find_teacher_user_row_id(user)
    if normalized["email"] and _table_exists("users"):
        existing_email_row = fetch_one_dict(
            """
            SELECT id
            FROM public.users
            WHERE LOWER(email) = LOWER(%s)
              AND (%s IS NULL OR id <> %s)
              AND status <> 'deleted'
            LIMIT 1
            """,
            [normalized["email"], existing_user_id, existing_user_id],
        )
        if existing_email_row:
            return {"ok": False, "errors": {"email": "이미 사용 중인 이메일입니다."}}

    with transaction.atomic():
        user_id = _ensure_teacher_user_row(user)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE public.users
                SET name = %s,
                    email = NULLIF(%s, ''),
                    phone = NULLIF(%s, '')
                WHERE id = %s
                """,
                [
                    normalized["name"],
                    normalized["email"] or "",
                    normalized["phone"] or "",
                    user_id,
                ],
            )

        user.__class__.objects.filter(pk=user.pk).update(email=normalized["email"] or "")
        user.email = normalized["email"] or ""

        if _table_exists("teacher_profiles"):
            existing_profile = fetch_one_dict(
                """
                SELECT tp.id, tp.academy_id
                FROM public.teacher_profiles tp
                LEFT JOIN public.academy_members am
                  ON am.user_id = tp.user_id
                 AND am.academy_id = tp.academy_id
                 AND am.status IN ('active', 'invited', 'inactive')
                WHERE tp.user_id = %s
                  AND tp.status IN ('active', 'inactive', 'archived')
                ORDER BY
                    CASE WHEN am.is_primary THEN 0 ELSE 1 END,
                    CASE tp.status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END,
                    tp.id
                LIMIT 1
                """,
                [user_id],
            )

            teacher_display_name = normalized["display_name"] or normalized["name"]

            if existing_profile:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE public.teacher_profiles
                        SET display_name = %s,
                            intro = %s
                        WHERE id = %s
                        """,
                        [teacher_display_name, normalized["intro"], existing_profile["id"]],
                    )
            elif normalized["display_name"] or normalized["intro"]:
                academy_id = _get_primary_academy_id(user_id)
                if academy_id is None:
                    return {
                        "ok": False,
                        "errors": {
                            "displayName": "teacher_profiles를 생성할 학원 소속 정보가 없습니다.",
                        },
                    }

                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO public.teacher_profiles (
                            user_id,
                            academy_id,
                            display_name,
                            intro,
                            status
                        )
                        VALUES (%s, %s, %s, %s, 'active')
                        """,
                        [user_id, academy_id, teacher_display_name, normalized["intro"]],
                    )

    return {"ok": True, "profile": get_teacher_profile(user)}


def _build_teacher_class_rows(user=None):
    profile_context = get_user_profile_context(user)
    teacher_user_id = (profile_context or {}).get("user_id")
    if not teacher_user_id:
        return []

    return fetch_all_dict_safe(
        """
        SELECT
            cg.id AS class_group_id,
            cg.name AS class_name,
            cg.subject,
            COUNT(en.student_id) FILTER (WHERE en.status = 'active') AS student_count
        FROM public.class_groups cg
        LEFT JOIN public.enrollments en
          ON en.class_group_id = cg.id
        WHERE cg.teacher_user_id = %s
          AND cg.status IN ('active', 'inactive', 'archived')
        GROUP BY cg.id, cg.name, cg.subject
        ORDER BY
            CASE cg.status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END,
            cg.id
        LIMIT 200
        """,
        [teacher_user_id],
    )


def _resolve_teacher_user_row_id(user):
    existing_user_id = _find_teacher_user_row_id(user)
    if existing_user_id:
        return existing_user_id
    return _ensure_teacher_user_row(user)


def _get_accessible_academy_ids(user_id):
    academy_ids = []

    if _table_exists("academy_members"):
        rows = fetch_all_dict_safe(
            """
            SELECT academy_id
            FROM public.academy_members
            WHERE user_id = %s
              AND status IN ('active', 'invited', 'inactive')
            ORDER BY
                is_primary DESC,
                CASE status WHEN 'active' THEN 0 WHEN 'invited' THEN 1 ELSE 2 END,
                id
            """,
            [user_id],
        )
        academy_ids.extend(row.get("academy_id") for row in rows if row.get("academy_id"))

    if _table_exists("academies"):
        rows = fetch_all_dict_safe(
            """
            SELECT id
            FROM public.academies
            WHERE owner_user_id = %s
              AND status IN ('active', 'inactive', 'archived')
            ORDER BY
                CASE status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END,
                id
            """,
            [user_id],
        )
        academy_ids.extend(row.get("id") for row in rows if row.get("id"))

    unique_ids = []
    seen = set()
    for academy_id in academy_ids:
        if academy_id in seen:
            continue
        seen.add(academy_id)
        unique_ids.append(academy_id)
    return unique_ids


def _build_teacher_students_rows(user):
    teacher_user_id = _resolve_teacher_user_row_id(user)
    academy_ids = _get_accessible_academy_ids(teacher_user_id)
    if not academy_ids:
        primary_academy_id = _get_primary_academy_id(teacher_user_id)
        academy_ids = [primary_academy_id] if primary_academy_id else []

    if not academy_ids:
        return []

    return fetch_all_dict_safe(
        """
        SELECT
            s.id AS student_id,
            s.student_code,
            s.name,
            s.school_name,
            s.grade,
            CASE
                WHEN s.status IN ('inactive', 'archived') THEN 'warning'
                ELSE 'stable'
            END AS status,
            COALESCE(NULLIF(BTRIM(latest.class_name), ''), NULLIF(BTRIM(latest.group_name), '')) AS class_name,
            latest.track,
            COALESCE(
                NULLIF(BTRIM(latest.group_name), ''),
                NULLIF(BTRIM(latest.class_name), ''),
                '등록 정보 확인'
            ) AS recent_progress_unit,
            COALESCE(NULLIF(BTRIM(latest.subject), ''), '등록') AS recent_tag,
            0::integer AS score,
            0::integer AS assignment_done,
            0::integer AS assignment_total,
            0::integer AS overdue_assignments,
            0::integer AS assignment_rate,
            NULL::text AS top_weak_topics,
            NULL::date AS next_exam_date,
            NULL::integer AS exam_days_left,
            NULL::text AS note
        FROM public.students s
        LEFT JOIN LATERAL (
            SELECT
                en.class_group_id,
                en.enrolled_at,
                cg.class_name,
                cg.name AS group_name,
                cg.subject,
                cg.track
            FROM public.enrollments en
            LEFT JOIN public.class_groups cg
              ON cg.id = en.class_group_id
            WHERE en.student_id = s.id
              AND COALESCE(en.status, 'active') IN ('active', 'inactive', 'archived')
            ORDER BY
                CASE WHEN COALESCE(en.is_active, TRUE) THEN 0 ELSE 1 END,
                CASE COALESCE(en.status, 'active')
                    WHEN 'active' THEN 0
                    WHEN 'inactive' THEN 1
                    ELSE 2
                END,
                COALESCE(en.updated_at, en.created_at, en.enrolled_at) DESC,
                en.id DESC
            LIMIT 1
        ) latest ON TRUE
        WHERE s.academy_id = ANY(%s)
          AND s.status IN ('active', 'inactive', 'archived')
        ORDER BY s.id DESC
        LIMIT 200
        """,
        [academy_ids],
    )


def _build_teacher_class_list_rows(user):
    teacher_user_id = _resolve_teacher_user_row_id(user)
    teacher_name = resolve_user_display_name(user) or user.get_username() or "선생님"

    return fetch_all_dict_safe(
        """
        SELECT
            cg.id AS class_group_id,
            COALESCE(NULLIF(BTRIM(cg.class_name), ''), cg.name) AS class_name,
            cg.grade,
            cg.track,
            cg.level,
            %s AS teacher_name,
            COUNT(en.id) FILTER (
                WHERE COALESCE(en.status, 'active') = 'active'
                  AND COALESCE(en.is_active, TRUE) = TRUE
            )::integer AS enrolled_count,
            NULL::integer AS max_students,
            NULL::date AS next_exam_date,
            NULL::integer AS exam_days_left,
            NULL::numeric AS avg_score,
            NULL::numeric AS avg_assignment_rate,
            NULL::text AS curriculum_status,
            NULL::integer AS actual_progress,
            NULL::integer AS planned_progress,
            NULL::integer AS delay_units,
            CASE WHEN cg.status = 'active' THEN TRUE ELSE FALSE END AS is_active
        FROM public.class_groups cg
        LEFT JOIN public.enrollments en
          ON en.class_group_id = cg.id
        WHERE cg.teacher_user_id = %s
          AND cg.status IN ('active', 'inactive', 'archived')
        GROUP BY
            cg.id,
            COALESCE(NULLIF(BTRIM(cg.class_name), ''), cg.name),
            cg.grade,
            cg.track,
            cg.level,
            cg.status
        ORDER BY
            CASE cg.status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END,
            cg.id DESC
        LIMIT 200
        """,
        [teacher_name, teacher_user_id],
    )


def _to_optional_int(value):
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        trimmed = value.strip()
        if trimmed.isdigit():
            return int(trimmed)
    return None


def build_settings_overview(user=None):
    profile = get_teacher_profile(user)
    profile_context = get_user_profile_context(user)
    db_required_sections = []

    notification_settings = [
        {
            "key": "db-required-notification",
            "label": DB_REQUIRED_TEXT,
            "description": "teacher_settings.notification_settings 연결 필요",
            "enabled": False,
        }
    ]
    db_required_sections.append("알림 설정")

    report_settings = {
        "defaultPeriod": "4주",
        "defaultView": "학생별",
        "examEmphasisDDay": "D-14",
    }
    db_required_sections.append("리포트 설정")

    lesson_settings = {
        "defaultDuration": "90분",
        "showNextAction": False,
        "showLessonMemo": False,
        "todayPageInfoScope": "요약만",
    }
    db_required_sections.append("수업 설정")

    assignment_settings = {
        "defaultDeadlineTime": "23:59",
        "allowPhotoSubmit": False,
        "allowOMRSubmit": False,
        "questionEnabled": False,
        "ocrReviewHighlight": False,
        "commonMistakeAlert": False,
    }
    db_required_sections.append("과제 설정")

    class_rows = _build_teacher_class_rows(user)
    if class_rows:
        basic_info_settings = {
            "classes": [
                {
                    "name": _db_required_text(row.get("class_name")),
                    "subject": _db_required_text(row.get("subject")),
                    "studentCount": to_int(row.get("student_count"), 0),
                    "examDate": DB_REQUIRED_TEXT,
                }
                for row in class_rows
            ],
            "subjects": sorted(
                {
                    _db_required_text(row.get("subject"))
                    for row in class_rows
                }
            ),
            "examScheduleLinked": False,
            "curriculumTemplateLinked": False,
        }
        db_required_sections.append("시험 일정/커리큘럼 설정")
    else:
        basic_info_settings = {
            "classes": [
                {
                    "name": DB_REQUIRED_TEXT,
                    "subject": DB_REQUIRED_TEXT,
                    "studentCount": 0,
                    "examDate": DB_REQUIRED_TEXT,
                }
            ],
            "subjects": [DB_REQUIRED_TEXT],
            "examScheduleLinked": False,
            "curriculumTemplateLinked": False,
        }
        db_required_sections.append("반/과목 정보")

    return {
        "profile": {
            "name": _db_required_text(profile.get("name")),
            "affiliation": _db_required_text(profile.get("affiliation")),
            "role": _db_required_text(profile.get("role")),
            "email": _db_required_text(profile.get("email")),
            "phone": _db_required_text(profile.get("phone")),
            "joined": _db_required_date((profile_context or {}).get("created_at")),
        },
        "notificationSettings": notification_settings,
        "reportSettings": report_settings,
        "lessonSettings": lesson_settings,
        "assignmentSettings": assignment_settings,
        "basicInfoSettings": basic_info_settings,
        "dbRequiredSections": db_required_sections,
    }


@teacher_api_required
@require_http_methods(["GET", "POST"])
def teacher_students(request):
    if request.method == "GET":
        data = _build_teacher_students_rows(request.user)
        return JsonResponse(data, safe=False)

    # ── POST: 학생 등록 ────────────────────────────────────────────────────────
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "요청 형식이 올바르지 않습니다."}, status=400)

    # 필수값 검증
    name = (body.get("name") or "").strip()
    if not name:
        return JsonResponse({"error": "학생 이름은 필수입니다."}, status=400)

    GRADE_MAP = {"고1": "grade1", "고2": "grade2", "고3": "grade3"}
    grade_display = (body.get("grade") or "").strip()
    grade = GRADE_MAP.get(grade_display)
    if not grade:
        return JsonResponse(
            {"error": "학년 값이 올바르지 않습니다. (고1 / 고2 / 고3 중 하나)"},
            status=400,
        )

    # 선택값
    student_code    = (body.get("student_code") or "").strip() or None
    school_name     = (body.get("school_name") or "").strip() or None
    class_group_name = (body.get("class_group_name") or "").strip() or None
    enrolled_at     = (body.get("enrolled_at") or "").strip() or None

    try:
        with transaction.atomic():
            with connection.cursor() as cursor:

                # school_id 조회 또는 신규 생성
                school_id = None
                if school_name:
                    cursor.execute(
                        "SELECT id FROM schools WHERE name = %s LIMIT 1",
                        [school_name],
                    )
                    row = cursor.fetchone()
                    if row:
                        school_id = row[0]
                    else:
                        cursor.execute(
                            "INSERT INTO schools (name) VALUES (%s) RETURNING id",
                            [school_name],
                        )
                        school_id = cursor.fetchone()[0]

                # students INSERT
                cursor.execute(
                    """
                    INSERT INTO students (student_code, name, school_id, grade)
                    VALUES (%s, %s, %s, %s::student_grade)
                    RETURNING id
                    """,
                    [student_code, name, school_id, grade],
                )
                student_id = cursor.fetchone()[0]

                # enrollments INSERT (반 배정이 있는 경우)
                if class_group_name:
                    cursor.execute(
                        """
                        SELECT id FROM class_groups
                        WHERE class_name = %s AND teacher_user_id = %s
                        LIMIT 1
                        """,
                        [class_group_name, request.user.id],
                    )
                    cg_row = cursor.fetchone()
                    if cg_row:
                        class_group_id = cg_row[0]
                        cursor.execute(
                            """
                            INSERT INTO enrollments
                                (student_id, class_group_id, enrolled_at, is_active)
                            VALUES (%s, %s, %s, TRUE)
                            ON CONFLICT (student_id, class_group_id) DO NOTHING
                            """,
                            [
                                student_id,
                                class_group_id,
                                enrolled_at or datetime.date.today(),
                            ],
                        )

        return JsonResponse({"ok": True, "student_id": student_id}, status=201)

    except Exception as e:
        return JsonResponse(
            {"error": f"저장 중 오류가 발생했습니다: {str(e)}"},
            status=500,
        )


@teacher_api_required
@require_GET
def teacher_classes(request):
    query = """
        SELECT *
        FROM v_class_list
        ORDER BY class_group_id DESC
        LIMIT 100
    """
    data = fetch_all_dict(query)
    return JsonResponse(data, safe=False)


@teacher_api_required
@require_GET
def teacher_class_detail(request, class_group_id):
    query = """
        SELECT *
        FROM v_class_list
        WHERE class_group_id = %s
    """
    data = fetch_one_dict(query, [class_group_id])
    if data is None:
        return JsonResponse({"detail": "not found"}, status=404)
    return JsonResponse(data)


@teacher_api_required
@require_http_methods(["GET", "POST"])
def teacher_students_v2(request):
    if request.method == "GET":
        data = _build_teacher_students_rows(request.user)
        return JsonResponse(data, safe=False)

    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({"error": "요청 형식이 올바르지 않습니다."}, status=400)

    name = (body.get("name") or "").strip()
    if not name:
        return JsonResponse({"error": "학생 이름은 필수입니다."}, status=400)

    teacher_user_id = _resolve_teacher_user_row_id(request.user)
    accessible_academy_ids = _get_accessible_academy_ids(teacher_user_id)
    primary_academy_id = _get_primary_academy_id(teacher_user_id)

    academy_id = _to_optional_int(body.get("academy_id")) or primary_academy_id
    if academy_id is None:
        return JsonResponse({"error": "학생을 등록할 학원 소속 정보가 없습니다."}, status=400)
    if accessible_academy_ids and academy_id not in accessible_academy_ids:
        return JsonResponse({"error": "접근할 수 없는 학원입니다."}, status=403)

    student_code = (body.get("student_code") or "").strip() or None
    school_name = (body.get("school_name") or "").strip() or None
    grade = (body.get("grade") or "").strip() or None
    parent_name = (body.get("parent_name") or "").strip() or None
    parent_phone = (body.get("parent_phone") or "").strip() or None
    student_phone = (body.get("student_phone") or "").strip() or None
    status = (body.get("status") or "active").strip() or "active"
    if status not in {"active", "inactive", "archived"}:
        return JsonResponse({"error": "학생 상태 값이 올바르지 않습니다."}, status=400)

    class_group_id = _to_optional_int(body.get("class_group_id"))
    class_group_name = (body.get("class_group_name") or "").strip() or None
    enrolled_at_text = (body.get("enrolled_at") or "").strip() or None
    if enrolled_at_text:
        try:
            enrolled_at = datetime.datetime.strptime(enrolled_at_text, "%Y-%m-%d")
        except ValueError:
            return JsonResponse({"error": "등록일 형식이 올바르지 않습니다. (YYYY-MM-DD)"}, status=400)
    else:
        enrolled_at = datetime.datetime.combine(datetime.date.today(), datetime.time.min)

    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                if student_code:
                    cursor.execute(
                        """
                        SELECT id
                        FROM public.students
                        WHERE academy_id = %s
                          AND student_code = %s
                        LIMIT 1
                        """,
                        [academy_id, student_code],
                    )
                    if cursor.fetchone():
                        return JsonResponse({"error": "이미 사용 중인 학생 코드입니다."}, status=400)

                cursor.execute(
                    """
                    INSERT INTO public.students (
                        academy_id,
                        name,
                        student_code,
                        school_name,
                        grade,
                        parent_name,
                        parent_phone,
                        student_phone,
                        status
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    [
                        academy_id,
                        name,
                        student_code,
                        school_name,
                        grade,
                        parent_name,
                        parent_phone,
                        student_phone,
                        status,
                    ],
                )
                student_id = cursor.fetchone()[0]

                if class_group_id is None and class_group_name:
                    cursor.execute(
                        """
                        SELECT id
                        FROM public.class_groups
                        WHERE teacher_user_id = %s
                          AND academy_id = %s
                          AND (
                              name = %s
                              OR class_name = %s
                          )
                          AND status IN ('active', 'inactive', 'archived')
                        LIMIT 1
                        """,
                        [teacher_user_id, academy_id, class_group_name, class_group_name],
                    )
                    cg_row = cursor.fetchone()
                    if cg_row:
                        class_group_id = cg_row[0]

                if class_group_id is not None:
                    cursor.execute(
                        """
                        SELECT id
                        FROM public.class_groups
                        WHERE id = %s
                          AND teacher_user_id = %s
                          AND academy_id = %s
                          AND status IN ('active', 'inactive', 'archived')
                        LIMIT 1
                        """,
                        [class_group_id, teacher_user_id, academy_id],
                    )
                    if not cursor.fetchone():
                        return JsonResponse({"error": "선택한 반 정보를 찾을 수 없습니다."}, status=400)

                    cursor.execute(
                        """
                        INSERT INTO public.enrollments (
                            class_group_id,
                            student_id,
                            enrolled_at,
                            status,
                            is_active
                        )
                        VALUES (%s, %s, %s, 'active', TRUE)
                        RETURNING id
                        """,
                        [class_group_id, student_id, enrolled_at],
                    )
                    enrollment_id = cursor.fetchone()[0]
                else:
                    enrollment_id = None

        return JsonResponse(
            {
                "ok": True,
                "student_id": student_id,
                "enrollment_id": enrollment_id,
            },
            status=201,
        )
    except Exception as error:
        return JsonResponse(
            {"error": f"저장 중 오류가 발생했습니다: {error}"},
            status=500,
        )


@teacher_api_required
@require_GET
def teacher_classes_v2(request):
    data = _build_teacher_class_list_rows(request.user)
    return JsonResponse(data, safe=False)


@teacher_api_required
@require_GET
def teacher_class_detail_v2(request, class_group_id):
    data = next(
        (
            row
            for row in _build_teacher_class_list_rows(request.user)
            if to_int(row.get("class_group_id"), 0) == class_group_id
        ),
        None,
    )
    if data is None:
        return JsonResponse({"detail": "not found"}, status=404)
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_student_detail(request, student_id):
    query = """
        SELECT *
        FROM v_student_detail
        WHERE student_id = %s
    """
    data = fetch_one_dict(query, [student_id])
    if data is None:
        return JsonResponse({"detail": "not found"}, status=404)

    weak_topics = to_json(data.get("weak_topics"), None)
    data["weak_topics"] = weak_topics if isinstance(weak_topics, list) else None

    studyti_tags = to_json(data.get("studyti_tags"), None)
    data["studyti_tags"] = studyti_tags if isinstance(studyti_tags, list) else None

    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_today_lessons(request):
    query = """
        SELECT *
        FROM v_today_lessons
        ORDER BY schedule_id DESC
        LIMIT 100
    """
    data = fetch_all_dict(query)
    return JsonResponse(data, safe=False)


@teacher_api_required
@require_http_methods(["GET", "PATCH"])
def teacher_profile(request):
    if request.method == "PATCH":
        payload, parse_error = _parse_json_request_body(request)
        if parse_error:
            return JsonResponse({"detail": parse_error, "message": parse_error}, status=400)

        result = _sync_teacher_profile_tables(request.user, payload)
        if not result["ok"]:
            return JsonResponse(
                {
                    "detail": "프로필 저장에 실패했습니다.",
                    "message": "프로필 저장에 실패했습니다.",
                    "errors": result.get("errors", {}),
                },
                status=400,
            )

        return JsonResponse(
            {
                "message": "프로필이 저장되었습니다.",
                "profile": result["profile"],
            }
        )

    data = get_teacher_profile(request.user)
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_today_lessons_overview(request):
    data = build_today_lessons_overview()
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_assignments_overview(request):
    data = build_assignments_overview()
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_curriculum_overview(request):
    data = build_curriculum_overview()
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_reports_overview(request):
    data = build_reports_overview()
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_report_student_detail(request, student_id):
    data = build_report_student_detail(student_id)
    if data is None:
        return JsonResponse({"detail": "not found"}, status=404)
    return JsonResponse(data)


@teacher_api_required
@require_GET
def teacher_settings_overview(request):
    data = build_settings_overview(request.user)
    return JsonResponse(data)


# ── OCR stub ──────────────────────────────────────────────────────────────────

def _ocr_stub_response(submission_id: int) -> dict:
    """실제 OCR 연동 전 stub. OCR_PROVIDER=stub 일 때 사용."""
    return {
        "submission_id": submission_id,
        "status": "done",
        "text_preview": "(stub) 풀이 텍스트 미리보기",
        "question_count": 10,
        "weak_topic_candidates": ["집합 — 원소나열법", "함수의 극한"],
        "provider": "stub",
    }


def _call_real_ocr(submission_id: int, file_url: str) -> dict:
    """실제 OCR 공급자 연동 진입점. OCR_PROVIDER != stub 일 때 교체."""
    raise NotImplementedError("실제 OCR 공급자 미연결 상태입니다.")


def ocr_request_handler(submission_id: int, file_url: str) -> dict:
    provider = os.environ.get("OCR_PROVIDER", "stub")
    if provider == "stub":
        return _ocr_stub_response(submission_id)
    return _call_real_ocr(submission_id, file_url)


@teacher_api_required
@require_POST
def ocr_request(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "invalid JSON"}, status=400)

    submission_id = body.get("submission_id")
    file_url = body.get("file_url", "")
    if submission_id in (None, ""):
        return JsonResponse({"detail": "submission_id required"}, status=400)

    try:
        submission_id_int = int(submission_id)
    except (TypeError, ValueError):
        return JsonResponse({"detail": "submission_id must be integer"}, status=400)

    if submission_id_int <= 0:
        return JsonResponse({"detail": "submission_id must be positive"}, status=400)

    result = ocr_request_handler(submission_id_int, file_url)
    return JsonResponse(result)
