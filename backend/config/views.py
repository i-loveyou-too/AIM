import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

# TODO: 실제 인증 기능 도입 시 request.user를 사용하여 student_id를 식별하도록 수정
# 현재는 Stub 단계이므로 student_id=1로 가정하고 동작함

@require_http_methods(["GET"])
def student_today_tasks(request):
    """오늘 할 일 목록 반환 (Stub)"""
    # TODO: 실제 DB 연동 지점 - v_student_today_tasks 또는 관련 테이블 조회
    data = {
        "success": True,
        "tasks": [
            {
                "task_id": 1,
                "title": "수학 확률과 통계 3단원 오답정리",
                "subject": "수학",
                "status": "pending",
                "due_date": "2026-03-31",
                "estimated_minutes": 40
            },
            {
                "task_id": 2,
                "title": "영어 단어 Ch.12 테스트 준비",
                "subject": "영어",
                "status": "completed",
                "due_date": "2026-03-31",
                "estimated_minutes": 20
            }
        ]
    }
    return JsonResponse(data)

@require_http_methods(["GET"])
def student_assignments(request):
    """과제 목록 반환 (Stub)"""
    # TODO: 실제 DB 연동 지점 - assignments 및 student_submissions 테이블 조인 조회
    data = {
        "success": True,
        "assignments": [
            {
                "assignment_id": 101,
                "title": "지수함수와 로그함수 심화 문제 풀이",
                "subject": "수학",
                "is_submitted": False,
                "due_date": "2026-04-02T23:59:59+09:00",
                "priority": "high"
            },
            {
                "assignment_id": 102,
                "title": "EBS 수능특강 영어 독해 1-3강",
                "subject": "영어",
                "is_submitted": True,
                "due_date": "2026-03-30T18:00:00+09:00",
                "priority": "medium"
            }
        ]
    }
    return JsonResponse(data)

@require_http_methods(["GET"])
def student_submissions(request):
    """제출 이력 목록 반환 (Stub)"""
    # TODO: 실제 DB 연동 지점 - student_submissions 테이블 조회
    data = {
        "success": True,
        "submissions": [
            {
                "submission_id": 501,
                "assignment_title": "수학 1단원 기초",
                "file_name": "homework_math_01.jpg",
                "submitted_at": "2026-03-29T14:20:00+09:00",
                "status": "reviewed",
                "score": 85
            },
            {
                "submission_id": 502,
                "assignment_title": "영어 단어 테스트",
                "file_name": "vocab_test.png",
                "submitted_at": "2026-03-30T09:15:00+09:00",
                "status": "pending",
                "score": None
            }
        ]
    }
    return JsonResponse(data)

@require_http_methods(["GET"])
def student_latest_report(request):
    """최신 리포트 요약 반환 (Stub)"""
    # TODO: 실제 DB 연동 지점 - v_student_detail 또는 전용 리포트 VIEW 조회
    data = {
        "success": True,
        "report": {
            "student_name": "이서준",
            "period": "2026-03-24 ~ 2026-03-31",
            "achievement_score": 78,
            "submission_rate": 92,
            "weak_topics": ["로그 함수의 미분", "삼각함수의 주기"],
            "ai_insight": "최근 수학 문제 풀이 속도가 개선되었으나, 로그 계산 실수 방지가 필요합니다."
        }
    }
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["PATCH"])
def student_patch_goals(request):
    """학생 목표 수정 (Stub)"""
    try:
        body = json.loads(request.body)
        # TODO: 실제 DB 연동 지점 - student_profiles 테이블 UPDATE
        
        return JsonResponse({
            "success": True,
            "detail": "goals updated",
            "goal": {
                "exam_date": body.get("exam_date", "2026-05-10"),
                "target_score": body.get("target_score", 90),
                "daily_study_minutes": body.get("daily_study_minutes", 120)
            }
        })
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"detail": "bad request"}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def student_coach(request):
    """AI 코치 응답 반환 (Stub)"""
    try:
        body = json.loads(request.body)
        q_type = body.get("question_type")
        
        # TODO: 실제 AI 엔진 또는 DB 기반 템플릿 매핑 로직으로 교체
        templates = {
            "today_plan": "오늘은 수학 오답 정리 40분, 단어 암기 20분을 추천해요. 수학부터 끝내볼까요?",
            "why_this_task": "이 과제는 이번 시험에서 15% 비중을 차지하는 함수 단원을 보완하기 위해 중요합니다.",
            "before_exam": "시험까지 14일 남았습니다. 취약한 로그 단원 복습을 3일 내에 마치는 것을 목표로 하세요!"
        }
        
        answer = templates.get(q_type, "궁금한 내용을 다시 선택해주세요.")
        
        if q_type not in templates:
            return JsonResponse({"detail": "not found"}, status=404)
            
        return JsonResponse({
            "success": True,
            "answer": answer,
            "question_type": q_type
        })
    except json.JSONDecodeError:
        return JsonResponse({"detail": "bad request"}, status=400)