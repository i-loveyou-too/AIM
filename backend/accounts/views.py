import json
from typing import Any, Dict, Optional, Tuple

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .user_display import (
    resolve_user_display_name,
    resolve_user_greeting_name,
    resolve_user_header_name,
    resolve_user_initials,
    resolve_user_role_label,
)


UserModel = get_user_model()


def _json(payload: Dict[str, Any], status: int = 200) -> JsonResponse:
    return JsonResponse(payload, status=status)


def _parse_request_json(request) -> Tuple[Dict[str, Any], Optional[str]]:
    if not request.body:
        return {}, None

    try:
        return json.loads(request.body.decode("utf-8")), None
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}, "올바른 JSON 형식이 아닙니다."


def _serialize_user(user) -> Dict[str, Any]:
    display_name = resolve_user_display_name(user)
    return {
        "id": user.id,
        "username": user.get_username(),
        "is_staff": bool(user.is_staff),
        "is_superuser": bool(user.is_superuser),
        "display_name": display_name,
        "header_name": resolve_user_header_name(user, display_name),
        "greeting_name": resolve_user_greeting_name(user, display_name),
        "initials": resolve_user_initials(user, display_name),
        "role_label": resolve_user_role_label(user),
    }


def _is_teacher_or_admin(user) -> bool:
    if user.is_superuser or user.is_staff:
        return True
    return user.groups.filter(name__iexact="teacher").exists()


def _resolve_next_path(raw_next: Optional[str], request) -> str:
    if (
        isinstance(raw_next, str)
        and raw_next.startswith("/")
        and not raw_next.startswith("//")
        and url_has_allowed_host_and_scheme(
            url=raw_next,
            allowed_hosts={request.get_host()},
            require_https=request.is_secure(),
        )
    ):
        return raw_next
    return "/dashboard"


@ensure_csrf_cookie
@require_http_methods(["GET"])
def auth_csrf(request):
    token = get_token(request)
    return _json(
        {
            "authenticated": bool(request.user.is_authenticated),
            "csrfToken": token,
            "message": "CSRF cookie issued",
        }
    )


@require_http_methods(["POST"])
def auth_login(request):
    payload, parse_error = _parse_request_json(request)
    if parse_error:
        return _json(
            {
                "authenticated": False,
                "message": parse_error,
                "detail": parse_error,
            },
            status=400,
        )

    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", ""))
    next_path = _resolve_next_path(payload.get("next"), request)

    if not username or not password:
        return _json(
            {
                "authenticated": False,
                "message": "아이디와 비밀번호를 모두 입력해 주세요.",
                "detail": "아이디와 비밀번호를 모두 입력해 주세요.",
            },
            status=400,
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        try:
            existing_user = UserModel._default_manager.get_by_natural_key(username)
            if not existing_user.is_active:
                return _json(
                    {
                        "authenticated": False,
                        "message": "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
                        "detail": "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
                    },
                    status=403,
                )
        except UserModel.DoesNotExist:
            pass

        return _json(
            {
                "authenticated": False,
                "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
                "detail": "아이디 또는 비밀번호가 올바르지 않습니다.",
            },
            status=401,
        )

    if not user.is_active:
        return _json(
            {
                "authenticated": False,
                "message": "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
                "detail": "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
            },
            status=403,
        )

    if not _is_teacher_or_admin(user):
        return _json(
            {
                "authenticated": False,
                "message": "교사/관리자 계정만 로그인할 수 있습니다.",
                "detail": "교사/관리자 계정만 로그인할 수 있습니다.",
            },
            status=403,
        )

    login(request, user)
    return _json(
        {
            "authenticated": True,
            "message": "로그인되었습니다.",
            "detail": "로그인되었습니다.",
            "next": next_path,
            "user": _serialize_user(user),
        }
    )


@require_http_methods(["POST"])
def auth_logout(request):
    if not request.user.is_authenticated:
        return _json(
            {
                "authenticated": False,
                "message": "이미 로그아웃된 상태입니다.",
                "detail": "이미 로그아웃된 상태입니다.",
            }
        )

    logout(request)
    return _json(
        {
            "authenticated": False,
            "message": "로그아웃되었습니다.",
            "detail": "로그아웃되었습니다.",
        }
    )


@require_http_methods(["GET"])
def auth_me(request):
    if not request.user.is_authenticated:
        return _json(
            {
                "authenticated": False,
                "message": "인증이 필요합니다.",
                "detail": "인증이 필요합니다.",
            },
            status=401,
        )

    if not _is_teacher_or_admin(request.user):
        return _json(
            {
                "authenticated": False,
                "message": "교사/관리자 권한이 필요합니다.",
                "detail": "교사/관리자 권한이 필요합니다.",
            },
            status=403,
        )

    return _json(
        {
            "authenticated": True,
            "user": _serialize_user(request.user),
        }
    )
