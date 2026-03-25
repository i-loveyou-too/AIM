-- ============================================================
-- 01_create_schema.sql
-- 수학 학원 관리 시스템 — PostgreSQL 15+ 스키마
-- pgAdmin에서 순서대로 실행: 01 → 02 → 03 → 04 → 05 → 06 → 07
-- ============================================================

-- 확장
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM 타입
-- ============================================================

CREATE TYPE class_track AS ENUM ('naesin', 'suneung');
-- naesin=내신반, suneung=수능반

CREATE TYPE naesin_subject_cat AS ENUM (
    'math1',          -- 수학1
    'math2',          -- 수학2
    'geometry',       -- 기하
    'calculus',       -- 미적분
    'prob_stats'      -- 확률과통계
);

CREATE TYPE suneung_subject_cat AS ENUM (
    'common_prob_stats',  -- 공통+확률과통계
    'common_geometry',    -- 공통+기하
    'common_calculus'     -- 공통+미적분
);

CREATE TYPE class_level AS ENUM ('A', 'B', 'C');

CREATE TYPE student_grade AS ENUM ('grade1', 'grade2', 'grade3');
-- grade1=고1, grade2=고2, grade3=고3

CREATE TYPE student_status AS ENUM (
    'stable',   -- 안정
    'warning',  -- 주의
    'urgent',   -- 시험 임박 / 긴급
    'focus',    -- 집중 관리
    'rising'    -- 상승
);

CREATE TYPE submit_status AS ENUM (
    'completed',      -- 완료
    'partial',        -- 부분 완료
    'not_submitted'   -- 미완료
);

CREATE TYPE submission_type AS ENUM (
    'photo',  -- 사진 제출
    'omr'     -- OMR 제출
);

CREATE TYPE assignment_status AS ENUM (
    'active',               -- 진행 중
    'due_soon',             -- 마감 임박
    'reviewed',             -- 검토 완료
    'needs_reinforcement'   -- 보강 필요
);

CREATE TYPE issue_type AS ENUM (
    'unsubmitted',       -- 미제출
    'exam_imminent',     -- 시험 임박
    'progress_delay',    -- 진도 지연
    'plan_adjustment',   -- 계획 조정 필요
    'question',          -- 질문 있음
    'ocr_review',        -- OCR 검토 필요
    'omr_many_wrong',    -- OMR 오답 다수
    'common_mistake',    -- 공통 오답 반영
    'focus_management'   -- 집중 관리
);

CREATE TYPE issue_urgency AS ENUM ('critical', 'high', 'medium', 'low');
-- critical=긴급, high=높음, medium=중간, low=낮음

CREATE TYPE issue_status AS ENUM ('unread', 'acknowledged', 'resolved');
-- unread=미확인, acknowledged=확인됨, resolved=처리 완료

CREATE TYPE mistake_type AS ENUM (
    'calc_error',          -- 계산 실수
    'procedure_missing',   -- 절차 누락
    'concept_confusion',   -- 개념 혼동
    'description_error'    -- 서술 오류
);

CREATE TYPE urgency_level AS ENUM ('high', 'medium', 'low');

CREATE TYPE curriculum_status AS ENUM (
    'on_track',         -- 정상
    'slightly_delayed', -- 소폭 지연
    'delayed',          -- 지연
    'at_risk'           -- 위험
);

CREATE TYPE lesson_phase AS ENUM ('before', 'during', 'after');

CREATE TYPE report_overall_status AS ENUM (
    'excellent',      -- 우수
    'good',           -- 양호
    'caution',        -- 주의 필요
    'critical'        -- 위험
);

CREATE TYPE milestone_type AS ENUM (
    'unit_complete',    -- 단원 완료
    'exam_prep',        -- 시험 준비
    'goal_achieved',    -- 목표 달성
    'plan_adjusted',    -- 계획 조정
    'feedback_given'    -- 피드백 제공
);

-- ============================================================
-- 테이블
-- ============================================================

-- 선생님
CREATE TABLE teachers (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT '강사',
    initials    TEXT,
    email       TEXT,
    phone       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학교
CREATE TABLE schools (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    district    TEXT,  -- 구/지역 (강남구, 서초구 등)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 반
CREATE TABLE class_groups (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id          BIGINT NOT NULL REFERENCES teachers(id),
    grade               student_grade NOT NULL,
    track               class_track NOT NULL,
    naesin_subject      naesin_subject_cat,        -- track='naesin'일 때만 사용
    suneung_subject     suneung_subject_cat,       -- track='suneung'일 때만 사용
    level               class_level NOT NULL,
    class_name          TEXT GENERATED ALWAYS AS (
        CASE
            WHEN track = 'naesin' THEN
                (CASE grade
                    WHEN 'grade1' THEN '고1'
                    WHEN 'grade2' THEN '고2'
                    WHEN 'grade3' THEN '고3'
                END) || ' 내신 ' ||
                (CASE naesin_subject
                    WHEN 'math1'       THEN '수학1'
                    WHEN 'math2'       THEN '수학2'
                    WHEN 'geometry'    THEN '기하'
                    WHEN 'calculus'    THEN '미적분'
                    WHEN 'prob_stats'  THEN '확률과통계'
                END) || ' ' || level::TEXT || '반'
            WHEN track = 'suneung' THEN
                (CASE grade
                    WHEN 'grade1' THEN '고1'
                    WHEN 'grade2' THEN '고2'
                    WHEN 'grade3' THEN '고3'
                END) || ' 수능 ' ||
                (CASE suneung_subject
                    WHEN 'common_prob_stats' THEN '공통+확률과통계'
                    WHEN 'common_geometry'   THEN '공통+기하'
                    WHEN 'common_calculus'   THEN '공통+미적분'
                END) || ' ' || level::TEXT || '반'
        END
    ) STORED,
    max_students        INT NOT NULL DEFAULT 10,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_subject_by_track CHECK (
        (track = 'naesin'  AND naesin_subject  IS NOT NULL AND suneung_subject IS NULL) OR
        (track = 'suneung' AND suneung_subject IS NOT NULL AND naesin_subject  IS NULL)
    )
);

-- 학생
CREATE TABLE students (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_code    TEXT UNIQUE,          -- AIM_24001 형식
    name            TEXT NOT NULL,
    school_id       BIGINT REFERENCES schools(id),
    grade           student_grade NOT NULL,
    status          student_status NOT NULL DEFAULT 'stable',
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학생-반 수강 매핑
CREATE TABLE enrollments (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id),
    class_group_id  BIGINT NOT NULL REFERENCES class_groups(id),
    enrolled_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (student_id, class_group_id)
);

-- 시험 일정
CREATE TABLE exams (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_group_id  BIGINT NOT NULL REFERENCES class_groups(id),
    exam_name       TEXT NOT NULL,    -- 예: 2024년 1학기 중간고사
    exam_date       DATE NOT NULL,
    scope_start     TEXT,             -- 시험 범위 시작
    scope_end       TEXT,             -- 시험 범위 끝
    total_score     INT DEFAULT 100,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학생별 시험 준비도
CREATE TABLE student_exam_readiness (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id          BIGINT NOT NULL REFERENCES students(id),
    exam_id             BIGINT NOT NULL REFERENCES exams(id),
    readiness_score     INT CHECK (readiness_score BETWEEN 0 AND 100),
    progress_status     TEXT,
    needs_reinforcement BOOLEAN DEFAULT FALSE,
    needs_plan_adjust   BOOLEAN DEFAULT FALSE,
    note                TEXT,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, exam_id)
);

-- 학생 기본 프로파일 (현재 학습 상태)
CREATE TABLE student_profiles (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id              BIGINT NOT NULL UNIQUE REFERENCES students(id),
    recent_progress_unit    TEXT,       -- 현재 진행 단원 (예: 미적분 II)
    recent_tag              TEXT,       -- Ch.04
    current_score           INT,        -- 최근 점수
    assignment_done         INT DEFAULT 0,
    assignment_total        INT DEFAULT 0,
    overdue_assignments     INT DEFAULT 0,
    extra_info              JSONB,      -- 확장 필드
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학생 목표 프로파일
CREATE TABLE student_goal_profiles (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id          BIGINT NOT NULL UNIQUE REFERENCES students(id),
    goal_score          INT,
    current_level       TEXT,       -- 예: 중상 / 상
    study_goal          TEXT,
    studyti_summary     TEXT,       -- 학습 성향 요약
    exam_target_date    DATE,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학습 성향 태그
CREATE TABLE student_studyti_tags (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id),
    tag         TEXT NOT NULL,
    UNIQUE (student_id, tag)
);

-- 취약 주제
CREATE TABLE student_weak_topics (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id),
    topic       TEXT NOT NULL,
    severity    urgency_level NOT NULL DEFAULT 'medium',
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 피드백 로그
CREATE TABLE student_feedback_logs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id),
    teacher_id      BIGINT REFERENCES teachers(id),
    feedback_text   TEXT NOT NULL,
    next_action     TEXT,
    logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학생 타임라인
CREATE TABLE student_timelines (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id      BIGINT NOT NULL REFERENCES students(id),
    milestone_type  milestone_type NOT NULL,
    event_title     TEXT NOT NULL,
    event_date      DATE NOT NULL,
    note            TEXT
);

-- 성취도 추이 (회차별)
CREATE TABLE student_achievement_trends (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES students(id),
    session_num INT NOT NULL,
    session_date DATE NOT NULL,
    score       INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    note        TEXT
);

-- 반별 커리큘럼
CREATE TABLE class_curriculums (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_group_id          BIGINT NOT NULL REFERENCES class_groups(id),
    exam_id                 BIGINT REFERENCES exams(id),
    total_period_weeks      INT,
    total_units             INT,
    remaining_units         INT,
    remaining_lessons       INT,
    planned_progress        NUMERIC(5,2),   -- % (0~100)
    actual_progress         NUMERIC(5,2),   -- % (0~100)
    status                  curriculum_status NOT NULL DEFAULT 'on_track',
    delay_units             INT DEFAULT 0,
    reinforcement_units     INT DEFAULT 0,
    weekly_target           TEXT,
    completion_chance       TEXT,           -- 예: 높음 / 보통 / 낮음
    next_checkpoint         TEXT,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 커리큘럼 로드맵 항목
CREATE TABLE curriculum_roadmap_items (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    curriculum_id           BIGINT NOT NULL REFERENCES class_curriculums(id),
    title                   TEXT NOT NULL,
    period_start            DATE,
    period_end              DATE,
    planned_progress        NUMERIC(5,2),
    actual_progress         NUMERIC(5,2),
    status                  curriculum_status NOT NULL DEFAULT 'on_track',
    lesson_note             TEXT,
    assignment_note         TEXT,
    common_mistake_note     TEXT,
    reinforcement_note      TEXT,
    can_finish_before_exam  BOOLEAN DEFAULT TRUE,
    sort_order              INT NOT NULL DEFAULT 0
);

-- 로드맵 세부 주제
CREATE TABLE curriculum_subtopics (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    roadmap_item_id BIGINT NOT NULL REFERENCES curriculum_roadmap_items(id),
    title           TEXT NOT NULL,
    progress        NUMERIC(5,2) DEFAULT 0,
    status_label    TEXT,
    note            TEXT,
    sort_order      INT NOT NULL DEFAULT 0
);

-- 과제
CREATE TABLE assignments (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_group_id          BIGINT NOT NULL REFERENCES class_groups(id),
    teacher_id              BIGINT REFERENCES teachers(id),
    title                   TEXT NOT NULL,
    issued_date             DATE NOT NULL,
    due_date                DATE NOT NULL,
    total_questions         INT,
    status                  assignment_status NOT NULL DEFAULT 'active',
    top_mistake_topic       TEXT,
    repeat_nonsubmit_count  INT DEFAULT 0,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학생별 제출 현황
CREATE TABLE student_submissions (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assignment_id       BIGINT NOT NULL REFERENCES assignments(id),
    student_id          BIGINT NOT NULL REFERENCES students(id),
    submit_status       submit_status NOT NULL DEFAULT 'not_submitted',
    submitted_at        TIMESTAMPTZ,
    submission_type     submission_type,
    ocr_summary         TEXT,
    correct_count       INT,
    total_questions     INT,
    question_text       TEXT,       -- 학생이 남긴 질문
    is_repeat_nonsubmit BOOLEAN NOT NULL DEFAULT FALSE,
    needs_review        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
);

-- OMR 답안 항목
CREATE TABLE submission_omr_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    submission_id   BIGINT NOT NULL REFERENCES student_submissions(id),
    question_num    INT NOT NULL,
    student_answer  TEXT NOT NULL,
    correct_answer  TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL
);

-- OCR 검토
CREATE TABLE submission_ocr_reviews (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    submission_id   BIGINT NOT NULL UNIQUE REFERENCES student_submissions(id),
    review_reason   TEXT NOT NULL,
    reviewer_note   TEXT,
    reviewed_at     TIMESTAMPTZ,
    is_resolved     BOOLEAN NOT NULL DEFAULT FALSE
);

-- 공통 오답 분석
CREATE TABLE common_mistake_analyses (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assignment_id               BIGINT NOT NULL UNIQUE REFERENCES assignments(id),
    weak_concept_summary        JSONB,   -- TEXT[]
    repeat_mistake_patterns     JSONB,   -- TEXT[]
    explanation_needed          JSONB,   -- TEXT[]
    top_questions               JSONB,   -- TEXT[]
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 공통 오답 항목
CREATE TABLE common_mistake_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    analysis_id     BIGINT NOT NULL REFERENCES common_mistake_analyses(id),
    rank            INT NOT NULL,
    question_num    INT,
    topic           TEXT NOT NULL,
    mistake_type    mistake_type NOT NULL,
    incorrect_count INT NOT NULL DEFAULT 0,
    total_students  INT NOT NULL DEFAULT 0
);

-- 수업 반영 (Lesson Reflection)
CREATE TABLE lesson_reflections (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    assignment_id               BIGINT REFERENCES assignments(id),
    class_group_id              BIGINT NOT NULL REFERENCES class_groups(id),
    urgency                     urgency_level NOT NULL DEFAULT 'medium',
    re_explain_topics           JSONB,   -- TEXT[]
    reinforcement_items         JSONB,   -- TEXT[]
    question_reflection_items   JSONB,   -- TEXT[]
    homework_follow_up          TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 개별 피드백 필요 항목
CREATE TABLE lesson_reflection_individuals (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reflection_id   BIGINT NOT NULL REFERENCES lesson_reflections(id),
    student_id      BIGINT REFERENCES students(id),
    student_name    TEXT,   -- student_id가 없을 때 대비
    reason          TEXT NOT NULL
);

-- 이슈
CREATE TABLE issues (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    issue_type      issue_type NOT NULL,
    urgency         issue_urgency NOT NULL DEFAULT 'medium',
    status          issue_status NOT NULL DEFAULT 'unread',
    student_id      BIGINT REFERENCES students(id),
    class_group_id  BIGINT REFERENCES class_groups(id),
    title           TEXT NOT NULL,
    description     TEXT,
    occurred_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    detail          JSONB,          -- 이슈 유형별 상세 구조
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 학생 리포트
CREATE TABLE reports_student (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id              BIGINT NOT NULL REFERENCES students(id),
    teacher_id              BIGINT REFERENCES teachers(id),
    report_period_start     DATE NOT NULL,
    report_period_end       DATE NOT NULL,
    overall_status          report_overall_status NOT NULL DEFAULT 'good',
    summary_insight         TEXT,
    achievement_score       INT,
    progress_rate           NUMERIC(5,2),
    homework_rate           NUMERIC(5,2),
    weak_topic_count        INT DEFAULT 0,
    exam_readiness_score    INT,
    plan_stability          TEXT,       -- 높음/보통/낮음
    teacher_comment         TEXT,
    next_lesson_direction   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 성취도/숙제/진도 추이 메트릭
CREATE TABLE report_period_metrics (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    report_id       BIGINT NOT NULL REFERENCES reports_student(id),
    metric_name     TEXT NOT NULL,    -- 'achievement', 'homework_rate', 'progress_rate'
    metric_value    NUMERIC(8,2) NOT NULL,
    metric_date     DATE NOT NULL
);

-- 반 리포트
CREATE TABLE reports_class (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_group_id      BIGINT NOT NULL REFERENCES class_groups(id),
    teacher_id          BIGINT REFERENCES teachers(id),
    report_period_start DATE NOT NULL,
    report_period_end   DATE NOT NULL,
    avg_achievement     NUMERIC(5,2),
    avg_homework_rate   NUMERIC(5,2),
    avg_exam_readiness  NUMERIC(5,2),
    summary             JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 수업 일정
CREATE TABLE lesson_schedules (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_group_id  BIGINT NOT NULL REFERENCES class_groups(id),
    teacher_id      BIGINT REFERENCES teachers(id),
    scheduled_date  DATE NOT NULL,
    start_time      TIME,
    end_time        TIME,
    topic           TEXT,
    status          TEXT DEFAULT 'scheduled'   -- scheduled, completed, cancelled
);

-- 수업 준비 카드
CREATE TABLE lesson_preps (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_schedule_id      BIGINT NOT NULL UNIQUE REFERENCES lesson_schedules(id),
    weak_topic_overview     JSONB,   -- 취약점 요약
    homework_reflection     JSONB,   -- 숙제 반영 현황
    materials_needed        JSONB,   -- 필요 자료 목록
    ai_suggestions          TEXT,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 수업 자료
CREATE TABLE lesson_materials (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_schedule_id  BIGINT NOT NULL REFERENCES lesson_schedules(id),
    material_type       TEXT NOT NULL,  -- 'worksheet', 'explanation', 'quiz', 'reference'
    title               TEXT NOT NULL,
    description         TEXT
);

-- 수업 전/중/후 액션
CREATE TABLE lesson_next_actions (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    lesson_schedule_id  BIGINT NOT NULL REFERENCES lesson_schedules(id),
    phase               lesson_phase NOT NULL,
    action_text         TEXT NOT NULL,
    priority            INT DEFAULT 0,
    is_done             BOOLEAN NOT NULL DEFAULT FALSE
);

-- 선생님 설정
CREATE TABLE teacher_settings (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id      BIGINT NOT NULL REFERENCES teachers(id),
    setting_key     TEXT NOT NULL,
    setting_value   JSONB NOT NULL DEFAULT '{}',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, setting_key)
);

-- ============================================================
-- 인덱스
-- ============================================================

CREATE INDEX idx_students_school        ON students(school_id);
CREATE INDEX idx_students_grade         ON students(grade);
CREATE INDEX idx_students_status        ON students(status);
CREATE INDEX idx_students_code          ON students(student_code);

CREATE INDEX idx_enrollments_student    ON enrollments(student_id);
CREATE INDEX idx_enrollments_class      ON enrollments(class_group_id);
CREATE INDEX idx_enrollments_active     ON enrollments(class_group_id) WHERE is_active = TRUE;

CREATE INDEX idx_class_groups_teacher   ON class_groups(teacher_id);
CREATE INDEX idx_class_groups_track     ON class_groups(track);
CREATE INDEX idx_class_groups_grade     ON class_groups(grade);
CREATE INDEX idx_class_groups_active    ON class_groups(id) WHERE is_active = TRUE;

CREATE INDEX idx_exams_class            ON exams(class_group_id);
CREATE INDEX idx_exams_date             ON exams(exam_date);

CREATE INDEX idx_readiness_student      ON student_exam_readiness(student_id);
CREATE INDEX idx_readiness_exam         ON student_exam_readiness(exam_id);

CREATE INDEX idx_profiles_student       ON student_profiles(student_id);
CREATE INDEX idx_weak_topics_student    ON student_weak_topics(student_id);
CREATE INDEX idx_feedback_student       ON student_feedback_logs(student_id);
CREATE INDEX idx_timelines_student      ON student_timelines(student_id);
CREATE INDEX idx_achieve_trend_student  ON student_achievement_trends(student_id, session_date);

CREATE INDEX idx_curriculum_class       ON class_curriculums(class_group_id);
CREATE INDEX idx_roadmap_curriculum     ON curriculum_roadmap_items(curriculum_id);
CREATE INDEX idx_subtopics_roadmap      ON curriculum_subtopics(roadmap_item_id);

CREATE INDEX idx_assignments_class      ON assignments(class_group_id);
CREATE INDEX idx_assignments_due        ON assignments(due_date);
CREATE INDEX idx_assignments_status     ON assignments(status);

CREATE INDEX idx_submissions_assignment ON student_submissions(assignment_id);
CREATE INDEX idx_submissions_student    ON student_submissions(student_id);
CREATE INDEX idx_submissions_status     ON student_submissions(submit_status);
CREATE INDEX idx_submissions_repeat     ON student_submissions(student_id) WHERE is_repeat_nonsubmit = TRUE;
CREATE INDEX idx_submissions_review     ON student_submissions(assignment_id) WHERE needs_review = TRUE;

CREATE INDEX idx_omr_submission         ON submission_omr_items(submission_id);
CREATE INDEX idx_mistake_items_analysis ON common_mistake_items(analysis_id);

CREATE INDEX idx_reflections_class      ON lesson_reflections(class_group_id);
CREATE INDEX idx_refl_indiv_reflection  ON lesson_reflection_individuals(reflection_id);

CREATE INDEX idx_issues_type            ON issues(issue_type);
CREATE INDEX idx_issues_urgency         ON issues(urgency);
CREATE INDEX idx_issues_status          ON issues(status);
CREATE INDEX idx_issues_student         ON issues(student_id);
CREATE INDEX idx_issues_class           ON issues(class_group_id);
CREATE INDEX idx_issues_occurred        ON issues(occurred_at DESC);
CREATE INDEX idx_issues_unread          ON issues(id) WHERE status = 'unread';
CREATE INDEX idx_issues_detail          ON issues USING gin(detail);

CREATE INDEX idx_reports_student_sid    ON reports_student(student_id);
CREATE INDEX idx_reports_period         ON reports_student(report_period_start, report_period_end);
CREATE INDEX idx_metrics_report         ON report_period_metrics(report_id, metric_date);

CREATE INDEX idx_reports_class_cid      ON reports_class(class_group_id);

CREATE INDEX idx_schedules_class        ON lesson_schedules(class_group_id, scheduled_date);
CREATE INDEX idx_schedules_date         ON lesson_schedules(scheduled_date);
CREATE INDEX idx_actions_schedule       ON lesson_next_actions(lesson_schedule_id);
CREATE INDEX idx_materials_schedule     ON lesson_materials(lesson_schedule_id);

CREATE INDEX idx_settings_teacher       ON teacher_settings(teacher_id);

-- ============================================================
-- 코멘트 (주요 테이블)
-- ============================================================

COMMENT ON TABLE teachers                   IS '강사/선생님 테이블';
COMMENT ON TABLE schools                    IS '학교 목록';
COMMENT ON TABLE class_groups               IS '반 정보. class_name은 생성 컬럼으로 자동 조합됨';
COMMENT ON TABLE students                   IS '학생 기본 정보';
COMMENT ON TABLE enrollments                IS '학생-반 수강 매핑 (N:M)';
COMMENT ON TABLE exams                      IS '시험 일정';
COMMENT ON TABLE student_exam_readiness     IS '학생별 시험 준비도';
COMMENT ON TABLE student_profiles           IS '학생 현재 학습 상태';
COMMENT ON TABLE student_goal_profiles      IS '학생 목표/레벨 설정';
COMMENT ON TABLE student_studyti_tags       IS '학습 성향 태그';
COMMENT ON TABLE student_weak_topics        IS '취약 주제';
COMMENT ON TABLE student_feedback_logs      IS '강사 피드백 로그';
COMMENT ON TABLE student_timelines          IS '학생별 마일스톤 타임라인';
COMMENT ON TABLE student_achievement_trends IS '회차별 성취도 추이';
COMMENT ON TABLE class_curriculums          IS '반별 커리큘럼 현황';
COMMENT ON TABLE curriculum_roadmap_items   IS '커리큘럼 로드맵 단원별 항목';
COMMENT ON TABLE curriculum_subtopics       IS '로드맵 세부 주제';
COMMENT ON TABLE assignments                IS '반별 과제';
COMMENT ON TABLE student_submissions        IS '학생별 과제 제출 상태';
COMMENT ON TABLE submission_omr_items       IS 'OMR 답안 항목';
COMMENT ON TABLE submission_ocr_reviews     IS 'OCR 검토 필요 항목';
COMMENT ON TABLE common_mistake_analyses    IS '과제별 공통 오답 분석';
COMMENT ON TABLE common_mistake_items       IS '공통 오답 항목';
COMMENT ON TABLE lesson_reflections         IS '수업 반영 포인트';
COMMENT ON TABLE lesson_reflection_individuals IS '개별 피드백 필요 학생';
COMMENT ON TABLE issues                     IS '이슈 목록. detail은 issue_type별 JSONB 구조';
COMMENT ON TABLE reports_student            IS '학생별 리포트';
COMMENT ON TABLE report_period_metrics      IS '리포트 기간별 메트릭 추이';
COMMENT ON TABLE reports_class              IS '반별 리포트';
COMMENT ON TABLE lesson_schedules           IS '수업 일정';
COMMENT ON TABLE lesson_preps               IS '수업 준비 카드';
COMMENT ON TABLE lesson_materials           IS '수업 자료';
COMMENT ON TABLE lesson_next_actions        IS '수업 전/중/후 액션 아이템';
COMMENT ON TABLE teacher_settings           IS '강사 설정값';

COMMENT ON COLUMN issues.detail IS
    'issue_type별 구조:
     unsubmitted: {kind, assignment_title, due_date, missed_count, teacher_memo, next_action}
     exam_imminent: {kind, exam_date, progress_status, needs_reinforcement, needs_plan_adjust, note}
     progress_delay: {kind, planned_unit, actual_unit, delay_weeks, reason, adjustment_needed}
     question: {kind, question_text, related_unit, assignment_title, needs_in_class_explanation}
     ocr_review: {kind, assignment_title, submitted_at, ocr_summary, review_reason}
     common_mistake: {kind, top_mistake_question, mistake_type, concept_to_re_explain[], today_lesson_recommendation}
     focus_management: {kind, reasons[], recent_trend, teacher_note}';
