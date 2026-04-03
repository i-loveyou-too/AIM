from __future__ import annotations

from typing import Any, Dict, Optional

from django.db import connection


ROLE_LABELS = {
    "owner": "\uad50\uc0ac\uc6a9 \uad00\ub9ac\uc790",
    "admin": "\uad50\uc0ac\uc6a9 \uad00\ub9ac\uc790",
    "manager": "\uad50\uc0ac\uc6a9 \uad00\ub9ac\uc790",
    "teacher": "\uad50\uc0ac",
    "assistant": "\uc870\uad50",
    "student": "\ud559\uc0dd",
}


ACTIVE_USER_STATUSES = ("active", "inactive", "invited", "suspended", "archived")
ACTIVE_MEMBERSHIP_STATUSES = ("active", "invited", "inactive")
ACTIVE_PROFILE_STATUSES = ("active", "inactive", "archived")


def _table_exists(table_name: str) -> bool:
    with connection.cursor() as cursor:
        cursor.execute("SELECT to_regclass(%s)", [f"public.{table_name}"])
        row = cursor.fetchone()
    return bool(row and row[0])


def _normalize_text(value: Any) -> Optional[str]:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _auth_fallback_display_name(user) -> Optional[str]:
    if user is None or not getattr(user, "is_authenticated", False):
        return None

    full_name = _normalize_text(user.get_full_name())
    if full_name:
        return full_name

    joined_name = " ".join(
        part
        for part in [
            _normalize_text(getattr(user, "last_name", "")),
            _normalize_text(getattr(user, "first_name", "")),
        ]
        if part
    ).strip()
    if joined_name:
        return joined_name

    return _normalize_text(user.get_username()) or _normalize_text(getattr(user, "email", ""))


def _build_profile_query() -> Optional[str]:
    if not _table_exists("users"):
        return None

    academies_exists = _table_exists("academies")
    academy_members_exists = _table_exists("academy_members")
    teacher_profiles_exists = _table_exists("teacher_profiles")

    academy_member_join = ""
    teacher_profile_join = ""
    academy_name_select = "NULL::text AS academy_name"
    academy_role_select = "NULL::text AS academy_role"
    academy_member_id_select = "NULL::bigint AS academy_member_id"
    academy_id_select = "NULL::bigint AS academy_id"
    teacher_profile_id_select = "NULL::bigint AS teacher_profile_id"
    teacher_profile_user_id_select = "NULL::bigint AS teacher_profile_user_id"
    teacher_profile_academy_id_select = "NULL::bigint AS teacher_profile_academy_id"
    teacher_profile_display_name_select = "NULL::text AS teacher_profile_display_name"
    subject_main_select = "NULL::text AS subject_main"
    subject_detail_select = "NULL::text AS subject_detail"
    intro_select = "NULL::text AS intro"
    employment_type_select = "NULL::text AS employment_type"
    hire_date_select = "NULL::date AS hire_date"
    color_code_select = "NULL::text AS color_code"
    teacher_profile_status_select = "NULL::text AS teacher_profile_status"

    if academy_members_exists:
        academy_name_join = ""
        academy_name_projection = "NULL::text AS academy_name"
        if academies_exists:
            academy_name_join = """
            LEFT JOIN public.academies a
              ON a.id = am.academy_id
            """
            academy_name_projection = "a.name AS academy_name"
        academy_member_join = """
        LEFT JOIN LATERAL (
            SELECT
                am.id,
                am.academy_id,
                am.academy_role,
                am.is_primary,
                am.status,
                {academy_name_projection}
            FROM public.academy_members am
            {academy_name_join}
            WHERE am.user_id = u.id
              AND am.status = ANY(%s)
            ORDER BY
                am.is_primary DESC,
                CASE am.status
                    WHEN 'active' THEN 0
                    WHEN 'invited' THEN 1
                    ELSE 2
                END,
                am.id
            LIMIT 1
        ) am ON TRUE
        """
        academy_member_join = academy_member_join.format(
            academy_name_join=academy_name_join,
            academy_name_projection=academy_name_projection,
        )
        academy_role_select = "am.academy_role"
        academy_member_id_select = "am.id"
        academy_id_select = "am.academy_id"
        if academies_exists:
            academy_name_select = "am.academy_name"

    if teacher_profiles_exists:
        teacher_profile_filters = [
            "tp.user_id = u.id",
            "tp.status = ANY(%s)",
        ]
        teacher_profile_order = [
            "CASE tp.status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END",
            "tp.id",
        ]
        if academy_members_exists:
            teacher_profile_filters.append("(am.academy_id IS NULL OR tp.academy_id = am.academy_id)")
            teacher_profile_order.insert(
                0,
                "CASE WHEN am.academy_id IS NOT NULL AND tp.academy_id = am.academy_id THEN 0 ELSE 1 END",
            )

        teacher_profile_join = f"""
        LEFT JOIN LATERAL (
            SELECT
                tp.id,
                tp.user_id,
                tp.academy_id,
                NULLIF(BTRIM(tp.display_name), '') AS display_name,
                tp.subject_main,
                tp.subject_detail,
                tp.intro,
                tp.employment_type,
                tp.hire_date,
                tp.color_code,
                tp.status
            FROM public.teacher_profiles tp
            WHERE {' AND '.join(teacher_profile_filters)}
            ORDER BY {', '.join(teacher_profile_order)}
            LIMIT 1
        ) tp ON TRUE
        """
        teacher_profile_id_select = "tp.id AS teacher_profile_id"
        teacher_profile_user_id_select = "tp.user_id AS teacher_profile_user_id"
        teacher_profile_academy_id_select = "tp.academy_id AS teacher_profile_academy_id"
        teacher_profile_display_name_select = "tp.display_name AS teacher_profile_display_name"
        subject_main_select = "tp.subject_main"
        subject_detail_select = "tp.subject_detail"
        intro_select = "tp.intro"
        employment_type_select = "tp.employment_type"
        hire_date_select = "tp.hire_date"
        color_code_select = "tp.color_code"
        teacher_profile_status_select = "tp.status AS teacher_profile_status"

    return f"""
        SELECT
            u.id AS user_id,
            u.auth_user_id,
            NULLIF(BTRIM(u.login_id), '') AS login_id,
            NULLIF(BTRIM(u.email), '') AS email,
            NULLIF(BTRIM(u.name), '') AS user_name,
            NULLIF(BTRIM(u.phone), '') AS phone,
            NULLIF(BTRIM(u.role), '') AS global_role,
            u.status AS user_status,
            u.last_login_at,
            u.created_at,
            {academy_member_id_select},
            {academy_id_select},
            {academy_name_select},
            {academy_role_select},
            {teacher_profile_id_select},
            {teacher_profile_user_id_select},
            {teacher_profile_academy_id_select},
            {teacher_profile_display_name_select},
            {subject_main_select},
            {subject_detail_select},
            {intro_select},
            {employment_type_select},
            {hire_date_select},
            {color_code_select},
            {teacher_profile_status_select}
        FROM public.users u
        {academy_member_join}
        {teacher_profile_join}
        WHERE u.auth_user_id = %s
          AND u.status = ANY(%s)
        ORDER BY u.id
        LIMIT 1
    """


def get_user_profile_context(user) -> Optional[Dict[str, Any]]:
    if user is None or not getattr(user, "is_authenticated", False):
        return None

    query = _build_profile_query()
    if not query:
        return None

    params = []
    if _table_exists("academy_members"):
        params.append(list(ACTIVE_MEMBERSHIP_STATUSES))
    if _table_exists("teacher_profiles"):
        params.append(list(ACTIVE_PROFILE_STATUSES))
    params.extend([user.id, list(ACTIVE_USER_STATUSES)])

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()

    if row is None:
        return None

    data = dict(zip(columns, row))
    teacher_display_name = _normalize_text(data.get("teacher_profile_display_name"))
    user_name = _normalize_text(data.get("user_name"))
    login_id = _normalize_text(data.get("login_id"))
    email = _normalize_text(data.get("email"))
    display_name = teacher_display_name or user_name or login_id or email
    role_key = _normalize_text(data.get("academy_role")) or _normalize_text(data.get("global_role"))
    role_key = role_key.lower() if role_key else None

    data.update(
        {
            "teacher_display_name": teacher_display_name,
            "user_name": user_name,
            "login_id": login_id,
            "email": email,
            "display_name": display_name,
            "greeting_name": display_name or "\uc120\uc0dd\ub2d8",
            "header_name": f"{display_name} \uc120\uc0dd\ub2d8" if display_name else "\uc120\uc0dd\ub2d8",
            "initials": (display_name[:1].upper() if display_name else "\uad50"),
            "role_key": role_key,
            "role_label": ROLE_LABELS.get(role_key or "", "\uad50\uc0ac"),
        }
    )
    return data


def resolve_user_display_name(user) -> Optional[str]:
    context = get_user_profile_context(user)
    if context and context.get("display_name"):
        return context["display_name"]
    return _auth_fallback_display_name(user)


def resolve_user_initials(user, display_name: Optional[str] = None) -> str:
    name = _normalize_text(display_name) or resolve_user_display_name(user) or ""
    return name[:1].upper() if name else "\uad50"


def resolve_user_role_label(user) -> str:
    context = get_user_profile_context(user)
    if context and context.get("role_label"):
        return context["role_label"]

    if user is not None and getattr(user, "is_superuser", False):
        return "\uad50\uc0ac\uc6a9 \uad00\ub9ac\uc790"
    if user is not None and getattr(user, "is_staff", False):
        return "\uad50\uc0ac\uc6a9 \uad00\ub9ac\uc790"
    return "\uad50\uc0ac"


def resolve_user_header_name(user, display_name: Optional[str] = None) -> str:
    name = _normalize_text(display_name) or resolve_user_display_name(user) or ""
    return f"{name} \uc120\uc0dd\ub2d8" if name else "\uc120\uc0dd\ub2d8"


def resolve_user_greeting_name(user, display_name: Optional[str] = None) -> str:
    name = _normalize_text(display_name) or resolve_user_display_name(user) or ""
    return name or "\uc120\uc0dd\ub2d8"
