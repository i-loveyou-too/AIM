-- ============================================================
-- 07_views_and_queries.sql
-- 프론트 탭별 VIEW 및 SELECT 예시
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- VIEW 1: v_student_list — 학생 목록 탭
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_student_list AS
SELECT
    s.id                        AS student_id,
    s.student_code,
    s.name,
    sc.name                     AS school_name,
    s.grade,
    s.status,
    cg.class_name,
    cg.track,
    sp.recent_progress_unit,
    sp.recent_tag,
    sp.current_score            AS score,
    sp.assignment_done,
    sp.assignment_total,
    sp.overdue_assignments,
    CASE WHEN sp.assignment_total > 0
         THEN ROUND(sp.assignment_done::numeric / sp.assignment_total * 100, 1)
         ELSE 0
    END                         AS assignment_rate,
    (
        SELECT string_agg(wt.topic, ', ')
        FROM student_weak_topics wt
        WHERE wt.student_id = s.id
        ORDER BY wt.severity DESC, wt.created_at DESC
        LIMIT 2
    )                           AS top_weak_topics,
    (
        SELECT e.exam_date
        FROM exams e
        JOIN enrollments en ON en.class_group_id = e.class_group_id
        WHERE en.student_id = s.id
          AND e.exam_date >= CURRENT_DATE
        ORDER BY e.exam_date
        LIMIT 1
    )                           AS next_exam_date,
    (
        SELECT (e.exam_date - CURRENT_DATE)
        FROM exams e
        JOIN enrollments en ON en.class_group_id = e.class_group_id
        WHERE en.student_id = s.id
          AND e.exam_date >= CURRENT_DATE
        ORDER BY e.exam_date
        LIMIT 1
    )                           AS exam_days_left,
    s.note
FROM students s
LEFT JOIN schools     sc ON s.school_id        = sc.id
LEFT JOIN enrollments en ON en.student_id      = s.id AND en.is_active = TRUE
LEFT JOIN class_groups cg ON en.class_group_id = cg.id
LEFT JOIN student_profiles sp ON sp.student_id = s.id;

-- ────────────────────────────────────────────────────────────
-- VIEW 2: v_class_list — 반 목록 탭
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_class_list AS
SELECT
    cg.id                       AS class_group_id,
    cg.class_name,
    cg.grade,
    cg.track,
    cg.level,
    t.name                      AS teacher_name,
    COUNT(en.student_id)        AS enrolled_count,
    cg.max_students,
    (
        SELECT e.exam_date
        FROM exams e
        WHERE e.class_group_id = cg.id
          AND e.exam_date >= CURRENT_DATE
        ORDER BY e.exam_date
        LIMIT 1
    )                           AS next_exam_date,
    (
        SELECT (e.exam_date - CURRENT_DATE)
        FROM exams e
        WHERE e.class_group_id = cg.id
          AND e.exam_date >= CURRENT_DATE
        ORDER BY e.exam_date
        LIMIT 1
    )                           AS exam_days_left,
    ROUND(AVG(sp.current_score)::numeric, 1) AS avg_score,
    ROUND(AVG(
        CASE WHEN sp.assignment_total > 0
             THEN sp.assignment_done::numeric / sp.assignment_total * 100
             ELSE NULL END
    )::numeric, 1)              AS avg_assignment_rate,
    cc.status                   AS curriculum_status,
    cc.actual_progress,
    cc.planned_progress,
    cc.delay_units,
    cg.is_active
FROM class_groups cg
LEFT JOIN teachers t        ON cg.teacher_id   = t.id
LEFT JOIN enrollments en    ON en.class_group_id = cg.id AND en.is_active = TRUE
LEFT JOIN student_profiles sp ON sp.student_id  = en.student_id
LEFT JOIN class_curriculums cc ON cc.class_group_id = cg.id
GROUP BY cg.id, t.name, cc.status, cc.actual_progress, cc.planned_progress, cc.delay_units;

-- ────────────────────────────────────────────────────────────
-- VIEW 3: v_student_detail — 학생 상세 탭
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_student_detail AS
SELECT
    s.id                        AS student_id,
    s.student_code,
    s.name,
    sc.name                     AS school_name,
    s.grade,
    s.status,
    s.note,
    -- 수강 반
    cg.class_name,
    cg.track,
    -- 현재 학습 상태
    sp.recent_progress_unit,
    sp.recent_tag,
    sp.current_score,
    sp.assignment_done,
    sp.assignment_total,
    sp.overdue_assignments,
    -- 목표 프로파일
    gp.goal_score,
    gp.current_level,
    gp.study_goal,
    gp.studyti_summary,
    -- 시험 정보
    e.exam_date                 AS next_exam_date,
    ser.readiness_score         AS exam_readiness,
    ser.needs_reinforcement,
    ser.progress_status         AS exam_progress_status,
    -- 취약 주제 (jsonb 배열)
    (
        SELECT jsonb_agg(jsonb_build_object('topic', wt.topic, 'severity', wt.severity))
        FROM student_weak_topics wt
        WHERE wt.student_id = s.id
        ORDER BY wt.severity DESC
    )                           AS weak_topics,
    -- 최근 피드백
    fl.feedback_text            AS latest_feedback,
    fl.next_action              AS latest_next_action,
    fl.logged_at                AS feedback_logged_at,
    -- 학습 성향 태그 (jsonb 배열)
    (
        SELECT jsonb_agg(st.tag)
        FROM student_studyti_tags st
        WHERE st.student_id = s.id
    )                           AS studyti_tags
FROM students s
LEFT JOIN schools         sc  ON s.school_id          = sc.id
LEFT JOIN enrollments     en  ON en.student_id         = s.id AND en.is_active = TRUE
LEFT JOIN class_groups    cg  ON en.class_group_id     = cg.id
LEFT JOIN student_profiles sp ON sp.student_id         = s.id
LEFT JOIN student_goal_profiles gp ON gp.student_id   = s.id
LEFT JOIN LATERAL (
    SELECT e.exam_date, se.readiness_score, se.needs_reinforcement, se.progress_status
    FROM exams e
    JOIN student_exam_readiness se ON se.exam_id = e.id AND se.student_id = s.id
    WHERE e.class_group_id = cg.id
      AND e.exam_date >= CURRENT_DATE
    ORDER BY e.exam_date
    LIMIT 1
) AS edata ON TRUE
LEFT JOIN exams e         ON e.exam_date = edata.exam_date AND e.class_group_id = cg.id
LEFT JOIN student_exam_readiness ser ON ser.student_id = s.id AND ser.exam_id = e.id
LEFT JOIN LATERAL (
    SELECT feedback_text, next_action, logged_at
    FROM student_feedback_logs
    WHERE student_id = s.id
    ORDER BY logged_at DESC
    LIMIT 1
) fl ON TRUE;

-- ────────────────────────────────────────────────────────────
-- VIEW 4: v_report_hub_student — 리포트 허브 학생별
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_report_hub_student AS
SELECT
    rs.id                       AS report_id,
    s.id                        AS student_id,
    s.student_code,
    s.name,
    sc.name                     AS school_name,
    s.grade,
    cg.class_name,
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
    rs.created_at
FROM reports_student rs
JOIN students      s   ON rs.student_id      = s.id
LEFT JOIN schools  sc  ON s.school_id        = sc.id
LEFT JOIN enrollments en ON en.student_id   = s.id AND en.is_active = TRUE
LEFT JOIN class_groups cg ON en.class_group_id = cg.id;

-- ────────────────────────────────────────────────────────────
-- VIEW 5: v_report_hub_class — 리포트 허브 반별
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_report_hub_class AS
SELECT
    cg.id                       AS class_group_id,
    cg.class_name,
    cg.grade,
    cg.track,
    COUNT(DISTINCT en.student_id)        AS student_count,
    ROUND(AVG(sp.current_score)::numeric, 1)  AS avg_score,
    ROUND(AVG(
        CASE WHEN sp.assignment_total > 0
             THEN sp.assignment_done::numeric / sp.assignment_total * 100
             ELSE NULL END
    )::numeric, 1)                       AS avg_homework_rate,
    ROUND(AVG(ser.readiness_score)::numeric, 1) AS avg_readiness,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status IN ('urgent', 'focus')) AS at_risk_count,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'rising')             AS rising_count,
    cc.status                   AS curriculum_status,
    cc.actual_progress,
    cc.planned_progress
FROM class_groups cg
LEFT JOIN enrollments en       ON en.class_group_id = cg.id AND en.is_active = TRUE
LEFT JOIN students s           ON en.student_id     = s.id
LEFT JOIN student_profiles sp  ON sp.student_id     = s.id
LEFT JOIN exams ex             ON ex.class_group_id = cg.id AND ex.exam_date >= CURRENT_DATE
LEFT JOIN student_exam_readiness ser ON ser.student_id = en.student_id AND ser.exam_id = ex.id
LEFT JOIN class_curriculums cc ON cc.class_group_id = cg.id
GROUP BY cg.id, cc.status, cc.actual_progress, cc.planned_progress;

-- ────────────────────────────────────────────────────────────
-- VIEW 6: v_today_lessons — 오늘 수업 탭
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_today_lessons AS
SELECT
    ls.id                       AS schedule_id,
    ls.scheduled_date,
    ls.start_time,
    ls.end_time,
    cg.class_name,
    cg.grade,
    cg.track,
    t.name                      AS teacher_name,
    ls.topic,
    ls.status,
    COUNT(en.student_id)        AS student_count,
    -- 오늘 제출 현황 요약
    (
        SELECT COUNT(*)
        FROM student_submissions ss2
        JOIN assignments a2 ON ss2.assignment_id = a2.id
        WHERE a2.class_group_id = cg.id
          AND ss2.submit_status = 'not_submitted'
    )                           AS unsubmitted_count,
    -- 검토 필요 수
    (
        SELECT COUNT(*)
        FROM student_submissions ss3
        JOIN assignments a3 ON ss3.assignment_id = a3.id
        WHERE a3.class_group_id = cg.id
          AND ss3.needs_review = TRUE
    )                           AS needs_review_count,
    -- 이슈 수
    (
        SELECT COUNT(*)
        FROM issues i
        WHERE i.class_group_id = cg.id
          AND i.status = 'unread'
    )                           AS open_issue_count,
    lp.weak_topic_overview,
    lp.homework_reflection,
    lp.materials_needed,
    lp.ai_suggestions
FROM lesson_schedules ls
JOIN class_groups cg    ON ls.class_group_id = cg.id
JOIN teachers t         ON ls.teacher_id     = t.id
LEFT JOIN enrollments en ON en.class_group_id = cg.id AND en.is_active = TRUE
LEFT JOIN lesson_preps lp ON lp.lesson_schedule_id = ls.id
WHERE ls.scheduled_date = CURRENT_DATE
GROUP BY ls.id, cg.id, t.name, lp.weak_topic_overview, lp.homework_reflection, lp.materials_needed, lp.ai_suggestions;

-- ────────────────────────────────────────────────────────────
-- VIEW 7: v_assignment_status — 과제 현황 탭
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_assignment_status AS
SELECT
    a.id                        AS assignment_id,
    cg.class_name,
    cg.id                       AS class_group_id,
    a.title                     AS assignment_title,
    a.issued_date,
    a.due_date,
    a.total_questions,
    a.status,
    a.top_mistake_topic,
    COUNT(ss.id)                AS total_submissions,
    COUNT(ss.id) FILTER (WHERE ss.submit_status = 'completed') AS completed_count,
    COUNT(ss.id) FILTER (WHERE ss.submit_status = 'partial')   AS partial_count,
    COUNT(ss.id) FILTER (WHERE ss.submit_status = 'not_submitted') AS not_submitted_count,
    COUNT(ss.id) FILTER (WHERE ss.submission_type = 'photo')   AS photo_count,
    COUNT(ss.id) FILTER (WHERE ss.submission_type = 'omr')     AS omr_count,
    COUNT(ss.id) FILTER (WHERE ss.question_text IS NOT NULL)   AS question_count,
    COUNT(ss.id) FILTER (WHERE ss.is_repeat_nonsubmit = TRUE)  AS repeat_nonsubmit_count,
    COUNT(ss.id) FILTER (WHERE ss.needs_review = TRUE)         AS needs_review_count,
    CASE WHEN COUNT(en.student_id) > 0
         THEN ROUND(
             COUNT(ss.id) FILTER (WHERE ss.submit_status IN ('completed','partial'))::numeric
             / COUNT(en.student_id) * 100, 1)
         ELSE 0
    END                         AS submission_rate
FROM assignments a
JOIN class_groups cg    ON a.class_group_id  = cg.id
LEFT JOIN enrollments en ON en.class_group_id = cg.id AND en.is_active = TRUE
LEFT JOIN student_submissions ss ON ss.assignment_id = a.id
GROUP BY a.id, cg.id, cg.class_name;

-- ────────────────────────────────────────────────────────────
-- VIEW 8: v_issue_summary — 이슈 요약 탭
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_issue_summary AS
SELECT
    i.id,
    i.issue_type,
    i.urgency,
    i.status,
    s.name                      AS student_name,
    s.id                        AS student_id,
    cg.class_name,
    cg.id                       AS class_group_id,
    i.title,
    i.description,
    i.occurred_at,
    i.detail,
    i.resolved_at,
    -- 긴급도 정렬용 숫자
    CASE i.urgency
        WHEN 'critical' THEN 1
        WHEN 'high'     THEN 2
        WHEN 'medium'   THEN 3
        WHEN 'low'      THEN 4
    END                         AS urgency_order
FROM issues i
LEFT JOIN students    s  ON i.student_id     = s.id
LEFT JOIN class_groups cg ON i.class_group_id = cg.id;

-- ────────────────────────────────────────────────────────────
-- VIEW 9: v_exam_imminent_students — 시험 임박 학생 (7일 이내)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_exam_imminent_students AS
SELECT
    s.id                        AS student_id,
    s.name,
    s.status,
    sc.name                     AS school_name,
    cg.class_name,
    e.exam_name,
    e.exam_date,
    (e.exam_date - CURRENT_DATE) AS days_left,
    ser.readiness_score,
    ser.needs_reinforcement,
    ser.progress_status,
    ser.note
FROM students s
JOIN enrollments en     ON en.student_id      = s.id AND en.is_active = TRUE
JOIN class_groups cg    ON en.class_group_id  = cg.id
JOIN exams e            ON e.class_group_id   = cg.id
LEFT JOIN schools sc    ON s.school_id        = sc.id
LEFT JOIN student_exam_readiness ser ON ser.student_id = s.id AND ser.exam_id = e.id
WHERE e.exam_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY e.exam_date, ser.readiness_score NULLS LAST;

-- ────────────────────────────────────────────────────────────
-- VIEW 10: v_repeat_nonsubmit — 반복 미제출 학생
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_repeat_nonsubmit AS
SELECT
    s.id                        AS student_id,
    s.name,
    s.status,
    cg.class_name,
    COUNT(ss.id)                AS total_nonsubmit_count,
    MAX(a.due_date)             AS last_due_date,
    (
        SELECT fl.feedback_text
        FROM student_feedback_logs fl
        WHERE fl.student_id = s.id
        ORDER BY fl.logged_at DESC
        LIMIT 1
    )                           AS latest_teacher_note
FROM students s
JOIN enrollments en        ON en.student_id     = s.id AND en.is_active = TRUE
JOIN class_groups cg       ON en.class_group_id = cg.id
JOIN student_submissions ss ON ss.student_id    = s.id
JOIN assignments a         ON ss.assignment_id  = a.id
WHERE ss.submit_status = 'not_submitted'
GROUP BY s.id, s.name, s.status, cg.class_name
HAVING COUNT(ss.id) >= 2
ORDER BY total_nonsubmit_count DESC;

-- ────────────────────────────────────────────────────────────
-- VIEW 11: v_curriculum_dashboard — 커리큘럼 탭 대시보드
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_curriculum_dashboard AS
SELECT
    cg.id                       AS class_group_id,
    cg.class_name,
    cg.grade,
    cg.track,
    e.exam_date,
    (e.exam_date - CURRENT_DATE) AS days_to_exam,
    cc.total_period_weeks,
    cc.total_units,
    cc.remaining_units,
    cc.remaining_lessons,
    cc.planned_progress,
    cc.actual_progress,
    (cc.actual_progress - cc.planned_progress) AS progress_gap,
    cc.status,
    cc.delay_units,
    cc.reinforcement_units,
    cc.weekly_target,
    cc.completion_chance,
    cc.next_checkpoint,
    -- 위험 신호 여부
    CASE
        WHEN cc.status IN ('delayed', 'at_risk') THEN TRUE
        ELSE FALSE
    END                         AS is_at_risk,
    t.name                      AS teacher_name
FROM class_groups cg
JOIN teachers t     ON cg.teacher_id     = t.id
LEFT JOIN class_curriculums cc ON cc.class_group_id = cg.id
LEFT JOIN exams e   ON cc.exam_id        = e.id
WHERE cg.is_active = TRUE
ORDER BY days_to_exam NULLS LAST;

-- ────────────────────────────────────────────────────────────
-- 자주 쓰는 SELECT 쿼리 모음
-- ────────────────────────────────────────────────────────────

-- A. 특정 학생 상세 조회 (student_id = 1)
/*
SELECT * FROM v_student_detail WHERE student_id = 1;
*/

-- B. 특정 반 과제 현황 (class_group_id = 11)
/*
SELECT * FROM v_assignment_status WHERE class_group_id = 11;
*/

-- C. 오늘 수업 전체 조회
/*
SELECT * FROM v_today_lessons ORDER BY start_time;
*/

-- D. 긴급 + 높음 이슈만 조회
/*
SELECT * FROM v_issue_summary
WHERE status != 'resolved'
  AND urgency_order <= 2
ORDER BY urgency_order, occurred_at DESC;
*/

-- E. 시험 임박 30일 이내 전체 학생
/*
SELECT * FROM v_exam_imminent_students;
*/

-- F. 반복 미제출 학생 전체
/*
SELECT * FROM v_repeat_nonsubmit;
*/

-- G. 학생 성취도 추이 (학생 id=1, 최근 8회차)
/*
SELECT session_num, session_date, score, note
FROM student_achievement_trends
WHERE student_id = 1
ORDER BY session_num;
*/

-- H. 반별 평균 성취도 + 숙제율 비교
/*
SELECT
    class_name,
    avg_score,
    avg_homework_rate,
    avg_readiness,
    at_risk_count,
    rising_count
FROM v_report_hub_class
ORDER BY avg_score DESC;
*/

-- I. 커리큘럼 위험 반 조회
/*
SELECT class_name, days_to_exam, progress_gap, status, delay_units
FROM v_curriculum_dashboard
WHERE is_at_risk = TRUE
ORDER BY days_to_exam NULLS LAST;
*/

-- J. 학생 리포트 허브 — 주의/위험 학생
/*
SELECT
    name, class_name, overall_status,
    achievement_score, homework_rate, exam_readiness_score,
    summary_insight
FROM v_report_hub_student
WHERE overall_status IN ('caution', 'critical')
ORDER BY exam_readiness_score;
*/

-- K. 반별 과제 공통 오답 TOP3
/*
SELECT
    cg.class_name,
    a.title         AS assignment_title,
    mi.rank,
    mi.topic,
    mi.mistake_type,
    mi.incorrect_count,
    mi.total_students,
    ROUND(mi.incorrect_count::numeric / NULLIF(mi.total_students,0) * 100, 1) AS error_rate_pct
FROM common_mistake_items mi
JOIN common_mistake_analyses cma ON mi.analysis_id  = cma.id
JOIN assignments a               ON cma.assignment_id = a.id
JOIN class_groups cg             ON a.class_group_id  = cg.id
WHERE mi.rank <= 3
ORDER BY cg.class_name, mi.rank;
*/

-- L. 수업 준비 카드 — 특정 수업 일정 (schedule_id=1)
/*
SELECT
    ls.scheduled_date,
    ls.start_time,
    ls.end_time,
    cg.class_name,
    ls.topic,
    lp.weak_topic_overview,
    lp.homework_reflection,
    lp.materials_needed,
    lp.ai_suggestions,
    (
        SELECT jsonb_agg(jsonb_build_object(
            'phase', lna.phase,
            'action', lna.action_text,
            'priority', lna.priority,
            'done', lna.is_done
        ) ORDER BY lna.priority)
        FROM lesson_next_actions lna
        WHERE lna.lesson_schedule_id = ls.id
    ) AS next_actions
FROM lesson_schedules ls
JOIN class_groups cg ON ls.class_group_id = cg.id
LEFT JOIN lesson_preps lp ON lp.lesson_schedule_id = ls.id
WHERE ls.id = 1;
*/
