WITH source_user AS (
    SELECT
        au.id AS auth_user_id,
        au.username,
        au.password,
        NULLIF(BTRIM(au.email), '') AS email,
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
        su.email,
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
            WHEN public.users.status = 'deleted' THEN public.users.status
            ELSE 'active'
        END,
        last_login_at = EXCLUDED.last_login_at,
        updated_at = NOW()
    RETURNING id, auth_user_id, login_id, name, role, status
)
SELECT *
FROM upsert_user;
