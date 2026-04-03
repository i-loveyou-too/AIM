import json
from functools import wraps
from typing import Any, Dict

from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


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


def _resolve_student_identity(request):
    if not request.user.is_authenticated:
        return None, _auth_error("인증이 필요합니다.", status=401, authenticated=False)

    # 학생 API는 학생 계정 전용으로 제한한다.
    if _is_teacher_or_admin(request.user):
        return None, _auth_error("학생 계정으로만 접근할 수 있습니다.", status=403, authenticated=True)

    username = request.user.get_username().strip()
    if not username:
        return None, _auth_error("학생 계정 식별에 실패했습니다.", status=403, authenticated=True)

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT id, name, student_code
            FROM students
            WHERE student_code = %s
               OR lower(student_code) = lower(%s)
               OR lower(name) = lower(%s)
               OR CAST(id AS TEXT) = %s
            ORDER BY id
            LIMIT 1
            """,
            [username, username, username, username],
        )
        row = cursor.fetchone()

    if row is None:
        return None, _auth_error(
            "학생 계정이 학생 데이터와 연결되어 있지 않습니다.",
            status=403,
            authenticated=True,
        )

    return {
        "student_id": int(row[0]),
        "student_name": row[1] or username,
        "student_code": row[2],
    }, None


def student_api_required(view_func):
    @wraps(view_func)
    def _wrapped(request, *args, **kwargs):
        student_identity, error = _resolve_student_identity(request)
        if error is not None:
            return error
        request.student_identity = student_identity
        return view_func(request, *args, **kwargs)

    return _wrapped


def _student_meta(request) -> Dict[str, Any]:
    identity = getattr(request, "student_identity", {})
    return {
        "id": identity.get("student_id"),
        "name": identity.get("student_name"),
        "student_code": identity.get("student_code"),
    }


@student_api_required
@require_http_methods(["GET"])
def student_today_tasks(request):
    """오늘 할 일 목록 — student_submissions 기준으로 미제출/진행 중 과제 반환"""
    student_id = request.student_identity["student_id"]

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                ss.id               AS task_id,
                a.title,
                cg.class_name       AS subject,
                ss.submit_status    AS status,
                a.due_date,
                NULL                AS estimated_minutes
            FROM student_submissions ss
            JOIN assignments a ON a.id = ss.assignment_id
            JOIN class_groups cg ON cg.id = a.class_group_id
            WHERE ss.student_id = %s
              AND ss.submit_status IN ('not_submitted', 'partial')
              AND a.due_date >= CURRENT_DATE - INTERVAL '7 days'
            ORDER BY a.due_date ASC
            LIMIT 20
            """,
            [student_id],
        )
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

    tasks = []
    for row in rows:
        due = row.get("due_date")
        tasks.append({
            "task_id": row["task_id"],
            "title": row["title"] or "",
            "subject": row["subject"] or "",
            "status": row["status"] or "not_submitted",
            "due_date": due.isoformat() if due else None,
            "estimated_minutes": row["estimated_minutes"],
        })

    return JsonResponse({"success": True, "student": _student_meta(request), "tasks": tasks})


@student_api_required
@require_http_methods(["GET"])
def student_assignments(request):
    """과제 목록 — 본인 수강반 과제 전체 반환"""
    student_id = request.student_identity["student_id"]

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                a.id                AS assignment_id,
                a.title,
                cg.class_name       AS subject,
                ss.submit_status,
                CASE WHEN ss.submit_status = 'completed' THEN TRUE ELSE FALSE END AS is_submitted,
                a.due_date,
                a.status            AS priority
            FROM assignments a
            JOIN enrollments en ON en.class_group_id = a.class_group_id
                AND en.student_id = %s
                AND en.is_active = TRUE
            LEFT JOIN student_submissions ss ON ss.assignment_id = a.id
                AND ss.student_id = %s
            ORDER BY a.due_date DESC
            LIMIT 50
            """,
            [student_id, student_id],
        )
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

    assignments = []
    for row in rows:
        due = row.get("due_date")
        assignments.append({
            "assignment_id": row["assignment_id"],
            "title": row["title"] or "",
            "subject": row["subject"] or "",
            "status": row["submit_status"] or "not_submitted",
            "is_submitted": row["is_submitted"],
            "due_date": due.isoformat() if due else None,
            "priority": row["priority"] or "active",
        })

    return JsonResponse({"success": True, "student": _student_meta(request), "assignments": assignments})


@student_api_required
@require_http_methods(["GET"])
def student_submissions(request):
    """제출 이력 목록 — 본인 제출 내역 반환"""
    student_id = request.student_identity["student_id"]

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                ss.id               AS submission_id,
                a.title             AS assignment_title,
                ss.submission_type  AS file_name,
                ss.submitted_at,
                ss.submit_status    AS status,
                ss.correct_count    AS score
            FROM student_submissions ss
            JOIN assignments a ON a.id = ss.assignment_id
            WHERE ss.student_id = %s
              AND ss.submitted_at IS NOT NULL
            ORDER BY ss.submitted_at DESC
            LIMIT 50
            """,
            [student_id],
        )
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

    submissions = []
    for row in rows:
        submitted_at = row.get("submitted_at")
        submissions.append({
            "submission_id": row["submission_id"],
            "assignment_title": row["assignment_title"] or "",
            "file_name": row["file_name"] or "",
            "submitted_at": submitted_at.isoformat() if submitted_at else None,
            "status": row["status"] or "",
            "score": row["score"],
        })

    return JsonResponse({"success": True, "student": _student_meta(request), "submissions": submissions})


@student_api_required
@require_http_methods(["GET"])
def student_latest_report(request):
    """최신 리포트 — reports_student 최근 1건 반환"""
    student_id = request.student_identity["student_id"]
    student = _student_meta(request)

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                report_period_start,
                report_period_end,
                achievement_score,
                homework_rate,
                summary_insight
            FROM reports_student
            WHERE student_id = %s
            ORDER BY report_period_end DESC
            LIMIT 1
            """,
            [student_id],
        )
        row = cursor.fetchone()

    if row is None:
        return JsonResponse({"success": True, "student": student, "report": None})

    period_start, period_end, achievement_score, homework_rate, summary_insight = row

    # 취약 주제
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT topic FROM student_weak_topics
            WHERE student_id = %s
            ORDER BY severity DESC, created_at DESC
            LIMIT 5
            """,
            [student_id],
        )
        weak_topics = [r[0] for r in cursor.fetchall()]

    period_str = ""
    if period_start and period_end:
        period_str = f"{period_start.isoformat()} ~ {period_end.isoformat()}"

    report = {
        "student_id": student_id,
        "student_name": student.get("name"),
        "period": period_str,
        "achievement_score": achievement_score,
        "submission_rate": float(homework_rate) if homework_rate is not None else None,
        "weak_topics": weak_topics,
        "ai_insight": summary_insight or "",
    }

    return JsonResponse({"success": True, "student": student, "report": report})


@student_api_required
@require_http_methods(["PATCH"])
def student_patch_goals(request):
    """학생 목표 수정 — student_goal_profiles UPSERT"""
    student_id = request.student_identity["student_id"]

    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "올바른 JSON 형식이 아닙니다."}, status=400)

    exam_date = body.get("exam_date")
    target_score = body.get("target_score")
    daily_study_minutes = body.get("daily_study_minutes")

    # 타입 검증
    if target_score is not None:
        try:
            target_score = int(target_score)
            if not (0 <= target_score <= 100):
                raise ValueError
        except (ValueError, TypeError):
            return JsonResponse({"detail": "target_score는 0~100 사이 정수여야 합니다."}, status=400)

    if daily_study_minutes is not None:
        try:
            daily_study_minutes = int(daily_study_minutes)
            if daily_study_minutes < 0:
                raise ValueError
        except (ValueError, TypeError):
            return JsonResponse({"detail": "daily_study_minutes는 0 이상 정수여야 합니다."}, status=400)

    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO student_goal_profiles (student_id, exam_target_date, goal_score, updated_at)
            VALUES (%s, %s, %s, NOW())
            ON CONFLICT (student_id) DO UPDATE SET
                exam_target_date = COALESCE(EXCLUDED.exam_target_date, student_goal_profiles.exam_target_date),
                goal_score       = COALESCE(EXCLUDED.goal_score,       student_goal_profiles.goal_score),
                updated_at       = NOW()
            RETURNING exam_target_date, goal_score
            """,
            [student_id, exam_date or None, target_score],
        )
        result_row = cursor.fetchone()

    saved_date, saved_score = result_row if result_row else (exam_date, target_score)

    return JsonResponse({
        "success": True,
        "detail": "goals updated",
        "student": _student_meta(request),
        "goal": {
            "exam_date": saved_date.isoformat() if saved_date else exam_date,
            "target_score": saved_score,
            "daily_study_minutes": daily_study_minutes,
        },
    })


@student_api_required
@require_http_methods(["POST"])
def student_coach(request):
    """AI 코치 응답 — 템플릿 기반 (향후 LLM 교체 지점)"""
    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "올바른 JSON 형식이 아닙니다."}, status=400)

    q_type = body.get("question_type")

    templates = {
        "today_plan": "오늘은 수학 오답 정리 40분, 단어 암기 20분을 추천해요. 수학부터 끝내볼까요?",
        "why_this_task": "이 과제는 이번 시험에서 15% 비중을 차지하는 함수 단원을 보완하기 위해 중요합니다.",
        "before_exam": "시험까지 14일 남았습니다. 취약한 로그 단원 복습을 3일 내에 마치는 것을 목표로 하세요!",
    }

    if q_type not in templates:
        return JsonResponse({"detail": "지원하지 않는 질문 유형입니다."}, status=404)

    return JsonResponse({
        "success": True,
        "student": _student_meta(request),
        "answer": templates[q_type],
        "question_type": q_type,
    })
