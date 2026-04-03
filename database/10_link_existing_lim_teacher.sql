WITH source_user AS (
    SELECT
        au.id AS auth_user_id,
        au.username,
        au.password,
        au.email,
        au.last_login,
        au.date_joined
    FROM public.auth_user au
    WHERE au.username = 'lim'
),
upsert_user AS (
    INSERT INTO public.users (
        auth_user_id,
        login_id,
        email,
        password_hash,
        name,
        role,
        status,
        last_login_at,
        created_at,
        updated_at
    )
    SELECT
        su.auth_user_id,
        su.username,
        NULLIF(BTRIM(su.email), ''),
        su.password,
        'test',
        'teacher',
        'active',
        su.last_login,
        COALESCE(su.date_joined, NOW()),
        NOW()
    FROM source_user su
    ON CONFLICT (auth_user_id) DO UPDATE
    SET
        login_id = EXCLUDED.login_id,
        email = COALESCE(EXCLUDED.email, public.users.email),
        password_hash = EXCLUDED.password_hash,
        name = COALESCE(NULLIF(public.users.name, ''), EXCLUDED.name),
        role = COALESCE(NULLIF(public.users.role, ''), EXCLUDED.role),
        status = CASE
            WHEN public.users.status IN ('deleted', 'archived') THEN public.users.status
            ELSE 'active'
        END,
        last_login_at = EXCLUDED.last_login_at,
        updated_at = NOW()
    RETURNING id
),
target_user AS (
    SELECT id
    FROM upsert_user
    UNION ALL
    SELECT u.id
    FROM public.users u
    JOIN source_user su ON su.auth_user_id = u.auth_user_id
    LIMIT 1
),
bootstrap_academy AS (
    INSERT INTO public.academies (
        name,
        owner_user_id,
        status
    )
    SELECT
        'Default Academy',
        tu.id,
        'active'
    FROM target_user tu
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.academy_members am
        WHERE am.user_id = tu.id
          AND am.status IN ('invited', 'active', 'inactive')
    )
    RETURNING id, owner_user_id
),
target_academy AS (
    SELECT ba.id
    FROM bootstrap_academy ba
    UNION ALL
    SELECT a.id
    FROM public.academies a
    JOIN target_user tu ON a.owner_user_id = tu.id
    ORDER BY id
    LIMIT 1
)
INSERT INTO public.academy_members (
    academy_id,
    user_id,
    academy_role,
    is_primary,
    joined_at,
    invited_by,
    status,
    created_at,
    updated_at
)
SELECT
    ta.id,
    tu.id,
    'teacher',
    TRUE,
    NOW(),
    tu.id,
    'active',
    NOW(),
    NOW()
FROM target_user tu
JOIN target_academy ta ON TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.academy_members am
    WHERE am.academy_id = ta.id
      AND am.user_id = tu.id
);

INSERT INTO public.teacher_profiles (
    user_id,
    academy_id,
    display_name,
    subject_main,
    employment_type,
    status,
    created_at,
    updated_at
)
SELECT
    tu.id,
    ta.id,
    'test',
    'math',
    'full_time',
    'active',
    NOW(),
    NOW()
FROM (
    SELECT u.id
    FROM public.users u
    JOIN public.auth_user au ON au.id = u.auth_user_id
    WHERE au.username = 'lim'
    LIMIT 1
) tu
JOIN (
    SELECT a.id
    FROM public.academies a
    JOIN public.users u ON u.id = a.owner_user_id
    JOIN public.auth_user au ON au.id = u.auth_user_id
    WHERE au.username = 'lim'
    ORDER BY a.id
    LIMIT 1
) ta ON TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.teacher_profiles tp
    WHERE tp.user_id = tu.id
      AND tp.academy_id = ta.id
);
