CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    auth_user_id INTEGER UNIQUE REFERENCES public.auth_user(id) ON DELETE SET NULL,
    login_id VARCHAR(150) NOT NULL,
    email VARCHAR(254),
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'teacher',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_users_role CHECK (role IN ('owner', 'teacher', 'assistant', 'student', 'admin')),
    CONSTRAINT ck_users_status CHECK (status IN ('active', 'inactive', 'invited', 'suspended', 'archived', 'deleted'))
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS login_id VARCHAR(150);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email VARCHAR(254);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(30) DEFAULT 'teacher';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_auth_user_id_fkey'
    ) THEN
        ALTER TABLE public.users
            ADD CONSTRAINT users_auth_user_id_fkey
            FOREIGN KEY (auth_user_id)
            REFERENCES public.auth_user(id)
            ON DELETE SET NULL;
    END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_login_id_ci
    ON public.users (LOWER(login_id));

CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email_ci
    ON public.users (LOWER(email))
    WHERE email IS NOT NULL AND BTRIM(email) <> '';

CREATE INDEX IF NOT EXISTS ix_users_role_status
    ON public.users (role, status);

CREATE TABLE IF NOT EXISTS public.academies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    biz_no VARCHAR(30),
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_academies_status CHECK (status IN ('active', 'inactive', 'archived', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_academies_owner_status
    ON public.academies (owner_user_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS ux_academies_biz_no
    ON public.academies (biz_no)
    WHERE biz_no IS NOT NULL AND BTRIM(biz_no) <> '';

CREATE TABLE IF NOT EXISTS public.academy_members (
    id BIGSERIAL PRIMARY KEY,
    academy_id BIGINT NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    academy_role VARCHAR(30) NOT NULL DEFAULT 'teacher',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    invited_by BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_academy_members_unique_member UNIQUE (academy_id, user_id),
    CONSTRAINT ck_academy_members_role CHECK (academy_role IN ('owner', 'teacher', 'assistant', 'student', 'manager')),
    CONSTRAINT ck_academy_members_status CHECK (status IN ('invited', 'active', 'inactive', 'removed', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_academy_members_user_status
    ON public.academy_members (user_id, status);

CREATE INDEX IF NOT EXISTS ix_academy_members_academy_primary
    ON public.academy_members (academy_id, is_primary);

CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    academy_id BIGINT NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    subject_main VARCHAR(100),
    subject_detail VARCHAR(100),
    intro TEXT,
    employment_type VARCHAR(30),
    hire_date DATE,
    color_code VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_teacher_profiles_user_academy UNIQUE (user_id, academy_id),
    CONSTRAINT ck_teacher_profiles_status CHECK (status IN ('active', 'inactive', 'archived', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_teacher_profiles_academy_status
    ON public.teacher_profiles (academy_id, status);

CREATE TABLE IF NOT EXISTS public.auth_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_auth_sessions_token_hash
    ON public.auth_sessions (session_token_hash);

CREATE INDEX IF NOT EXISTS ix_auth_sessions_user_expires_at
    ON public.auth_sessions (user_id, expires_at);

CREATE TABLE IF NOT EXISTS public.login_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    login_id_attempted VARCHAR(150),
    result VARCHAR(20) NOT NULL,
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_login_audit_logs_result CHECK (result IN ('success', 'failed', 'blocked'))
);

CREATE INDEX IF NOT EXISTS ix_login_audit_logs_login_id_created_at
    ON public.login_audit_logs (login_id_attempted, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_login_audit_logs_user_created_at
    ON public.login_audit_logs (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_password_reset_tokens_token_hash
    ON public.password_reset_tokens (token_hash);

CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_expires_at
    ON public.password_reset_tokens (user_id, expires_at);

CREATE TABLE IF NOT EXISTS public.class_groups (
    id BIGSERIAL PRIMARY KEY,
    academy_id BIGINT NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
    teacher_user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) GENERATED ALWAYS AS (name) STORED,
    subject VARCHAR(100),
    grade VARCHAR(30),
    course_type VARCHAR(50),
    track VARCHAR(50) GENERATED ALWAYS AS (course_type) STORED,
    level VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_class_groups_status CHECK (status IN ('active', 'inactive', 'archived', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_class_groups_academy_status
    ON public.class_groups (academy_id, status);

CREATE INDEX IF NOT EXISTS ix_class_groups_teacher_status
    ON public.class_groups (teacher_user_id, status);

CREATE TABLE IF NOT EXISTS public.students (
    id BIGSERIAL PRIMARY KEY,
    academy_id BIGINT NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    student_code VARCHAR(100),
    school_name VARCHAR(255),
    grade VARCHAR(30),
    parent_name VARCHAR(255),
    parent_phone VARCHAR(50),
    student_phone VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_students_status CHECK (status IN ('active', 'inactive', 'graduated', 'archived', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_students_academy_status
    ON public.students (academy_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS ux_students_student_code
    ON public.students (academy_id, student_code)
    WHERE student_code IS NOT NULL AND BTRIM(student_code) <> '';

CREATE TABLE IF NOT EXISTS public.enrollments (
    id BIGSERIAL PRIMARY KEY,
    class_group_id BIGINT NOT NULL REFERENCES public.class_groups(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_active BOOLEAN GENERATED ALWAYS AS (status = 'active') STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_enrollments_class_student UNIQUE (class_group_id, student_id),
    CONSTRAINT ck_enrollments_status CHECK (status IN ('active', 'paused', 'completed', 'cancelled', 'deleted'))
);

CREATE INDEX IF NOT EXISTS ix_enrollments_student_status
    ON public.enrollments (student_id, status);

CREATE INDEX IF NOT EXISTS ix_enrollments_class_status
    ON public.enrollments (class_group_id, status);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_set_updated_at') THEN
        CREATE TRIGGER trg_users_set_updated_at
        BEFORE UPDATE ON public.users
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_academies_set_updated_at') THEN
        CREATE TRIGGER trg_academies_set_updated_at
        BEFORE UPDATE ON public.academies
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_academy_members_set_updated_at') THEN
        CREATE TRIGGER trg_academy_members_set_updated_at
        BEFORE UPDATE ON public.academy_members
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_teacher_profiles_set_updated_at') THEN
        CREATE TRIGGER trg_teacher_profiles_set_updated_at
        BEFORE UPDATE ON public.teacher_profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_class_groups_set_updated_at') THEN
        CREATE TRIGGER trg_class_groups_set_updated_at
        BEFORE UPDATE ON public.class_groups
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_students_set_updated_at') THEN
        CREATE TRIGGER trg_students_set_updated_at
        BEFORE UPDATE ON public.students
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enrollments_set_updated_at') THEN
        CREATE TRIGGER trg_enrollments_set_updated_at
        BEFORE UPDATE ON public.enrollments
        FOR EACH ROW
        EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;
