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
    """오늘 할 일 목록 반환 (Stub)"""
    data = {
        "success": True,
        "student": _student_meta(request),
        "tasks": [
            {
                "task_id": 1,
                "title": "수학 확률과 통계 3단원 오답정리",
                "subject": "수학",
                "status": "pending",
                "due_date": "2026-03-31",
                "estimated_minutes": 40,
            },
            {
                "task_id": 2,
                "title": "영어 단어 Ch.12 테스트 준비",
                "subject": "영어",
                "status": "completed",
                "due_date": "2026-03-31",
                "estimated_minutes": 20,
            },
        ],
    }
    return JsonResponse(data)


@student_api_required
@require_http_methods(["GET"])
def student_assignments(request):
    """과제 목록 반환 (Stub)"""
    data = {
        "success": True,
        "student": _student_meta(request),
        "assignments": [
            {
                "assignment_id": 101,
                "title": "지수함수와 로그함수 심화 문제 풀이",
                "subject": "수학",
                "is_submitted": False,
                "due_date": "2026-04-02T23:59:59+09:00",
                "priority": "high",
            },
            {
                "assignment_id": 102,
                "title": "EBS 수능특강 영어 독해 1-3강",
                "subject": "영어",
                "is_submitted": True,
                "due_date": "2026-03-30T18:00:00+09:00",
                "priority": "medium",
            },
        ],
    }
    return JsonResponse(data)


@student_api_required
@require_http_methods(["GET"])
def student_submissions(request):
    """제출 이력 목록 반환 (Stub)"""
    data = {
        "success": True,
        "student": _student_meta(request),
        "submissions": [
            {
                "submission_id": 501,
                "assignment_title": "수학 1단원 기초",
                "file_name": "homework_math_01.jpg",
                "submitted_at": "2026-03-29T14:20:00+09:00",
                "status": "reviewed",
                "score": 85,
            },
            {
                "submission_id": 502,
                "assignment_title": "영어 단어 테스트",
                "file_name": "vocab_test.png",
                "submitted_at": "2026-03-30T09:15:00+09:00",
                "status": "pending",
                "score": None,
            },
        ],
    }
    return JsonResponse(data)


@student_api_required
@require_http_methods(["GET"])
def student_latest_report(request):
    """최신 리포트 요약 반환 (Stub)"""
    student = _student_meta(request)
    data = {
        "success": True,
        "student": student,
        "report": {
            "student_id": student.get("id"),
            "student_name": student.get("name"),
            "period": "2026-03-24 ~ 2026-03-31",
            "achievement_score": 78,
            "submission_rate": 92,
            "weak_topics": ["로그 함수의 미분", "삼각함수의 주기"],
            "ai_insight": "최근 수학 문제 풀이 속도가 개선되었으나, 로그 계산 실수 방지가 필요합니다.",
        },
    }
    return JsonResponse(data)


@student_api_required
@require_http_methods(["PATCH"])
def student_patch_goals(request):
    """학생 목표 수정 (Stub)"""
    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "bad request"}, status=400)

    return JsonResponse(
        {
            "success": True,
            "detail": "goals updated",
            "student": _student_meta(request),
            "goal": {
                "exam_date": body.get("exam_date", "2026-05-10"),
                "target_score": body.get("target_score", 90),
                "daily_study_minutes": body.get("daily_study_minutes", 120),
            },
        }
    )


@student_api_required
@require_http_methods(["POST"])
def student_coach(request):
    """AI 코치 응답 반환 (Stub)"""
    try:
        body = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "bad request"}, status=400)

    q_type = body.get("question_type")

    templates = {
        "today_plan": "오늘은 수학 오답 정리 40분, 단어 암기 20분을 추천해요. 수학부터 끝내볼까요?",
        "why_this_task": "이 과제는 이번 시험에서 15% 비중을 차지하는 함수 단원을 보완하기 위해 중요합니다.",
        "before_exam": "시험까지 14일 남았습니다. 취약한 로그 단원 복습을 3일 내에 마치는 것을 목표로 하세요!",
    }

    answer = templates.get(q_type, "궁금한 내용을 다시 선택해주세요.")
    if q_type not in templates:
        return JsonResponse({"detail": "not found"}, status=404)

    return JsonResponse(
        {
            "success": True,
            "student": _student_meta(request),
            "answer": answer,
            "question_type": q_type,
        }
    )
