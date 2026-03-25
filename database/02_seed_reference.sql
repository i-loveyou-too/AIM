-- ============================================================
-- 02_seed_reference.sql
-- 기준 데이터: 선생님 / 학교 / 반 (class_groups)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 선생님 (3명)
-- ────────────────────────────────────────────────────────────
INSERT INTO teachers (name, role, initials, email, phone) VALUES
    ('김민정', '원장 강사',  '김', 'minjeong@aimmath.kr',  '010-1234-5678'),
    ('박준혁', '수학 강사',  '박', 'junhyuk@aimmath.kr',   '010-2345-6789'),
    ('이수진', '수학 강사',  '이', 'soojin@aimmath.kr',    '010-3456-7890');

-- ────────────────────────────────────────────────────────────
-- 학교 (10개)
-- ────────────────────────────────────────────────────────────
INSERT INTO schools (name, district) VALUES
    ('서울고등학교',   '강남구'),
    ('강남고등학교',   '강남구'),
    ('서초고등학교',   '서초구'),
    ('청운고등학교',   '서초구'),
    ('수서고등학교',   '강남구'),
    ('한빛고등학교',   '송파구'),
    ('대치고등학교',   '강남구'),
    ('압구정고등학교', '강남구'),
    ('목동고등학교',   '양천구'),
    ('잠실고등학교',   '송파구');

-- ────────────────────────────────────────────────────────────
-- 반 (class_groups) — 최소 18개
-- 내신반: grade × naesin_subject × level
-- 수능반: grade × suneung_subject × level
-- ────────────────────────────────────────────────────────────

-- 내신반 — 고1
INSERT INTO class_groups (teacher_id, grade, track, naesin_subject, level, max_students) VALUES
    (1, 'grade1', 'naesin', 'math1',      'A', 10),  -- 고1 내신 수학1 A반
    (1, 'grade1', 'naesin', 'math1',      'B', 10),  -- 고1 내신 수학1 B반
    (2, 'grade1', 'naesin', 'math2',      'A', 10),  -- 고1 내신 수학2 A반
    (2, 'grade1', 'naesin', 'math2',      'B', 10);  -- 고1 내신 수학2 B반

-- 내신반 — 고2
INSERT INTO class_groups (teacher_id, grade, track, naesin_subject, level, max_students) VALUES
    (1, 'grade2', 'naesin', 'math1',      'A', 10),  -- 고2 내신 수학1 A반
    (1, 'grade2', 'naesin', 'calculus',   'A', 10),  -- 고2 내신 미적분 A반
    (2, 'grade2', 'naesin', 'calculus',   'B', 10),  -- 고2 내신 미적분 B반
    (3, 'grade2', 'naesin', 'prob_stats', 'A', 10),  -- 고2 내신 확률과통계 A반
    (3, 'grade2', 'naesin', 'prob_stats', 'B', 10),  -- 고2 내신 확률과통계 B반
    (2, 'grade2', 'naesin', 'geometry',   'A', 10);  -- 고2 내신 기하 A반

-- 내신반 — 고3
INSERT INTO class_groups (teacher_id, grade, track, naesin_subject, level, max_students) VALUES
    (1, 'grade3', 'naesin', 'calculus',   'A', 8),   -- 고3 내신 미적분 A반
    (1, 'grade3', 'naesin', 'calculus',   'B', 8),   -- 고3 내신 미적분 B반
    (2, 'grade3', 'naesin', 'calculus',   'C', 8),   -- 고3 내신 미적분 C반
    (3, 'grade3', 'naesin', 'prob_stats', 'A', 8);   -- 고3 내신 확률과통계 A반

-- 수능반 — 고2
INSERT INTO class_groups (teacher_id, grade, track, suneung_subject, level, max_students) VALUES
    (1, 'grade2', 'suneung', 'common_calculus',    'A', 10),  -- 고2 수능 공통+미적분 A반
    (2, 'grade2', 'suneung', 'common_prob_stats',  'B', 10);  -- 고2 수능 공통+확률과통계 B반

-- 수능반 — 고3
INSERT INTO class_groups (teacher_id, grade, track, suneung_subject, level, max_students) VALUES
    (1, 'grade3', 'suneung', 'common_calculus',    'A', 10),  -- 고3 수능 공통+미적분 A반
    (1, 'grade3', 'suneung', 'common_calculus',    'B', 10),  -- 고3 수능 공통+미적분 B반
    (2, 'grade3', 'suneung', 'common_geometry',    'A', 10),  -- 고3 수능 공통+기하 A반
    (3, 'grade3', 'suneung', 'common_prob_stats',  'A', 10),  -- 고3 수능 공통+확률과통계 A반
    (3, 'grade3', 'suneung', 'common_prob_stats',  'B', 10);  -- 고3 수능 공통+확률과통계 B반

-- 확인용 쿼리 (필요시 실행):
-- SELECT id, class_name, grade, track, level, max_students FROM class_groups ORDER BY grade, track, level;