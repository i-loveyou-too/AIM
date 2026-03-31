-- ============================================================
-- 08_seed_demo_updates.sql
-- 운영형 MVP 화면 활성화를 위한 추가 데이터 보강 (INSERT 중심)
-- 대상 DB: aimon_Teacher
-- 원칙: DROP/TRUNCATE/DELETE 금지, 기존 스키마 유지, 중복 방지
-- ============================================================

BEGIN;

-- ============================================================
-- classes
-- 반 데이터 보강 (3개)
-- ============================================================

-- 고1 내신 기하 A반
INSERT INTO class_groups (teacher_id, grade, track, naesin_subject, level, max_students, is_active)
SELECT t.id, 'grade1', 'naesin', 'geometry', 'A', 10, TRUE
FROM teachers t
WHERE t.name = '김민정'
  AND NOT EXISTS (
    SELECT 1
    FROM class_groups cg
    WHERE cg.grade = 'grade1'
      AND cg.track = 'naesin'
      AND cg.naesin_subject = 'geometry'
      AND cg.level = 'A'
  );

-- 고2 내신 수학2 A반
INSERT INTO class_groups (teacher_id, grade, track, naesin_subject, level, max_students, is_active)
SELECT t.id, 'grade2', 'naesin', 'math2', 'A', 10, TRUE
FROM teachers t
WHERE t.name = '박준혁'
  AND NOT EXISTS (
    SELECT 1
    FROM class_groups cg
    WHERE cg.grade = 'grade2'
      AND cg.track = 'naesin'
      AND cg.naesin_subject = 'math2'
      AND cg.level = 'A'
  );

-- 고3 수능 공통+기하 B반
INSERT INTO class_groups (teacher_id, grade, track, suneung_subject, level, max_students, is_active)
SELECT t.id, 'grade3', 'suneung', 'common_geometry', 'B', 10, TRUE
FROM teachers t
WHERE t.name = '이수진'
  AND NOT EXISTS (
    SELECT 1
    FROM class_groups cg
    WHERE cg.grade = 'grade3'
      AND cg.track = 'suneung'
      AND cg.suneung_subject = 'common_geometry'
      AND cg.level = 'B'
  );

-- verify
-- SELECT id, class_name, grade, track, level, is_active
-- FROM class_groups
-- WHERE (grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A')
--    OR (grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A')
--    OR (grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B');

-- ============================================================
-- students
-- 학생 데이터 보강 (12명)
-- ============================================================

INSERT INTO students (student_code, name, school_id, grade, status, note)
SELECT v.student_code, v.name, sc.id, v.grade::student_grade, v.status::student_status, v.note
FROM (
  VALUES
    ('AIM_26001', '김학생1', '서울고등학교', 'grade1', 'stable',  '기하 기본 개념은 안정적이며 서술형 표현을 보강 중'),
    ('AIM_26002', '김학생2', '강남고등학교', 'grade1', 'rising',  '도형 좌표 파트 성취도 상승 중'),
    ('AIM_26003', '박학생1', '서초고등학교', 'grade1', 'warning', '개념 이해는 가능하나 실수 빈도가 높음'),
    ('AIM_26004', '박학생2', '잠실고등학교', 'grade1', 'stable',  '수업 참여도가 높고 과제 성실'),
    ('AIM_26005', '이학생1', '대치고등학교', 'grade2', 'stable',  '수학2 함수 단원 안정적으로 진행'),
    ('AIM_26006', '이학생2', '목동고등학교', 'grade2', 'rising',  '수열 단원 점수 상승세'),
    ('AIM_26007', '최학생1', '한빛고등학교', 'grade2', 'warning', '지수/로그 계산 실수 반복'),
    ('AIM_26008', '최학생2', '청운고등학교', 'grade2', 'stable',  '내신 대비 과제 수행률 우수'),
    ('AIM_26009', '정학생1', '수서고등학교', 'grade3', 'warning', '수능 기하 도형 방정식 파트 보강 필요'),
    ('AIM_26010', '정학생2', '압구정고등학교', 'grade3', 'urgent',  '시험 임박, 시간 배분 훈련 필요'),
    ('AIM_26011', '윤학생1', '잠실고등학교', 'grade3', 'stable',  '개념 이해는 좋으나 실전 속도 개선 필요'),
    ('AIM_26012', '윤학생2', '서울고등학교', 'grade3', 'rising',  '기하 파트 정답률 개선 중')
) AS v(student_code, name, school_name, grade, status, note)
JOIN schools sc ON sc.name = v.school_name
WHERE NOT EXISTS (
  SELECT 1
  FROM students s
  WHERE s.student_code = v.student_code
);

-- verify
-- SELECT student_code, name, grade, status
-- FROM students
-- WHERE student_code LIKE 'AIM_260%'
-- ORDER BY student_code;

-- ============================================================
-- enrollments
-- 반 ↔ 학생 연결
-- ============================================================

WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
target_students AS (
  SELECT *
  FROM (
    VALUES
      ('AIM_26001', 'g1_geo_a'),
      ('AIM_26002', 'g1_geo_a'),
      ('AIM_26003', 'g1_geo_a'),
      ('AIM_26004', 'g1_geo_a'),
      ('AIM_26005', 'g2_math2_a'),
      ('AIM_26006', 'g2_math2_a'),
      ('AIM_26007', 'g2_math2_a'),
      ('AIM_26008', 'g2_math2_a'),
      ('AIM_26009', 'g3_su_geo_b'),
      ('AIM_26010', 'g3_su_geo_b'),
      ('AIM_26011', 'g3_su_geo_b'),
      ('AIM_26012', 'g3_su_geo_b')
  ) AS t(student_code, class_key)
)
INSERT INTO enrollments (student_id, class_group_id, enrolled_at, is_active)
SELECT s.id, cm.class_group_id, CURRENT_DATE - INTERVAL '3 days', TRUE
FROM target_students ts
JOIN students s ON s.student_code = ts.student_code
JOIN class_map cm ON cm.class_key = ts.class_key
WHERE cm.class_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM enrollments en
    WHERE en.student_id = s.id
      AND en.class_group_id = cm.class_group_id
  );

-- verify
-- SELECT cg.class_name, COUNT(*) AS enrolled
-- FROM enrollments en
-- JOIN class_groups cg ON cg.id = en.class_group_id
-- JOIN students s ON s.id = en.student_id
-- WHERE s.student_code LIKE 'AIM_260%'
-- GROUP BY cg.class_name
-- ORDER BY cg.class_name;

-- ============================================================
-- academic goals
-- 시험/목표/성취 데이터 보강
-- ============================================================

-- exams
WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
)
INSERT INTO exams (class_group_id, exam_name, exam_date, scope_start, scope_end, total_score)
SELECT cm.class_group_id, v.exam_name, CURRENT_DATE + v.dday, v.scope_start, v.scope_end, 100
FROM (
  VALUES
    ('g1_geo_a',  '2026년 2학기 중간고사', 21, '도형의 방정식 기초', '원과 직선'),
    ('g2_math2_a','2026년 2학기 중간고사', 17, '지수함수', '수열 응용'),
    ('g3_su_geo_b','2026 수능 대비 모의평가', 12, '공통수학', '기하 전범위')
) AS v(class_key, exam_name, dday, scope_start, scope_end)
JOIN class_map cm ON cm.class_key = v.class_key
WHERE cm.class_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM exams e
    WHERE e.class_group_id = cm.class_group_id
      AND e.exam_name = v.exam_name
      AND e.exam_date = CURRENT_DATE + v.dday
  );

-- student_profiles
INSERT INTO student_profiles (
  student_id, recent_progress_unit, recent_tag, current_score,
  assignment_done, assignment_total, overdue_assignments, extra_info
)
SELECT s.id, v.recent_progress_unit, v.recent_tag, v.current_score,
       v.assignment_done, v.assignment_total, v.overdue_assignments,
       v.extra_info::jsonb
FROM (
  VALUES
    ('AIM_26001', '도형의 방정식 기초', 'Ch.01', 78, 4, 6, 0, '{"attendance":"good"}'),
    ('AIM_26002', '직선과 원의 위치관계', 'Ch.02', 82, 5, 6, 0, '{"attendance":"good"}'),
    ('AIM_26003', '원의 방정식 심화', 'Ch.03', 69, 3, 6, 1, '{"attention":"needs-check"}'),
    ('AIM_26004', '도형의 이동', 'Ch.03', 75, 4, 6, 0, '{"memo":"steady"}'),
    ('AIM_26005', '지수함수', 'Ch.01', 74, 5, 7, 0, '{"attendance":"good"}'),
    ('AIM_26006', '로그함수', 'Ch.02', 80, 6, 7, 0, '{"memo":"rising"}'),
    ('AIM_26007', '수열의 극한', 'Ch.03', 68, 3, 7, 1, '{"attention":"calculation"}'),
    ('AIM_26008', '등차/등비수열', 'Ch.03', 76, 5, 7, 0, '{"memo":"stable"}'),
    ('AIM_26009', '벡터와 도형', 'Ch.01', 71, 4, 8, 1, '{"exam_mode":"on"}'),
    ('AIM_26010', '도형의 방정식 실전', 'Ch.02', 63, 3, 8, 2, '{"exam_mode":"urgent"}'),
    ('AIM_26011', '공간도형 기초', 'Ch.02', 77, 5, 8, 0, '{"memo":"consistent"}'),
    ('AIM_26012', '기하 실전 문제', 'Ch.03', 84, 6, 8, 0, '{"memo":"strong"}')
) AS v(student_code, recent_progress_unit, recent_tag, current_score, assignment_done, assignment_total, overdue_assignments, extra_info)
JOIN students s ON s.student_code = v.student_code
WHERE NOT EXISTS (
  SELECT 1
  FROM student_profiles sp
  WHERE sp.student_id = s.id
);

-- student_goal_profiles
INSERT INTO student_goal_profiles (
  student_id, goal_score, current_level, study_goal, studyti_summary, exam_target_date
)
SELECT s.id, v.goal_score, v.current_level, v.study_goal, v.studyti_summary, CURRENT_DATE + v.target_dday
FROM (
  VALUES
    ('AIM_26001', 88, '중상', '내신 1등급 진입', '개념 이해가 빠르고 복습 루틴이 안정적', 25),
    ('AIM_26002', 92, '상',   '기하 상위권 유지', '문제 접근 속도가 빠르며 정확도 상승 중', 25),
    ('AIM_26003', 82, '중',   '실수 줄이기',       '개념 이해는 가능하나 계산 실수 빈도 높음', 25),
    ('AIM_26004', 85, '중상', '서술형 완성',       '과제 수행 성실, 서술형 표현 보강 필요', 25),
    ('AIM_26005', 86, '중상', '수학2 안정화',      '기본기는 좋고 응용 파트 강화 필요', 20),
    ('AIM_26006', 90, '상',   '내신 1등급',        '최근 상승세 뚜렷, 계획 실행력 우수', 20),
    ('AIM_26007', 80, '중',   '오답률 감소',       '지수/로그 계산 실수 교정이 핵심', 20),
    ('AIM_26008', 87, '중상', '수열 완성',         '꾸준한 학습 태도로 안정적 성장', 20),
    ('AIM_26009', 84, '중상', '수능 기하 안정권',  '개념 이해는 좋으나 시간 배분 부족', 15),
    ('AIM_26010', 78, '중',   '기본 점수 회복',    '시험 압박이 높아 루틴 재정비 필요', 15),
    ('AIM_26011', 88, '중상', '실전 완성',         '문제 해결력은 좋고 속도 개선 필요', 15),
    ('AIM_26012', 93, '상',   '기하 최상위권',     '정확도 높고 실전형 문제 대응력 우수', 15)
) AS v(student_code, goal_score, current_level, study_goal, studyti_summary, target_dday)
JOIN students s ON s.student_code = v.student_code
WHERE NOT EXISTS (
  SELECT 1
  FROM student_goal_profiles gp
  WHERE gp.student_id = s.id
);

-- student_exam_readiness
WITH student_exam AS (
  SELECT
    s.id AS student_id,
    (
      SELECT e.id
      FROM enrollments en
      JOIN exams e ON e.class_group_id = en.class_group_id
      WHERE en.student_id = s.id
        AND en.is_active = TRUE
        AND e.exam_date >= CURRENT_DATE
      ORDER BY e.exam_date
      LIMIT 1
    ) AS exam_id
  FROM students s
  WHERE s.student_code LIKE 'AIM_260%'
)
INSERT INTO student_exam_readiness (
  student_id, exam_id, readiness_score, progress_status,
  needs_reinforcement, needs_plan_adjust, note
)
SELECT s.id, se.exam_id, v.readiness_score, v.progress_status,
       v.needs_reinforcement, v.needs_plan_adjust, v.note
FROM (
  VALUES
    ('AIM_26001', 76, '개념 정리 진행', FALSE, FALSE, '기하 기본 문제 풀이 안정'),
    ('AIM_26002', 82, '실전 문제 병행', FALSE, FALSE, '상위권 유지'),
    ('AIM_26003', 61, '보강 필요', TRUE, TRUE, '계산 실수 교정 필수'),
    ('AIM_26004', 72, '안정 진행', FALSE, FALSE, '서술형 보강 중'),
    ('AIM_26005', 74, '개념 정리 진행', FALSE, FALSE, '로그함수 파트 강화'),
    ('AIM_26006', 79, '실전 문제 병행', FALSE, FALSE, '수열 응용 안정화'),
    ('AIM_26007', 63, '보강 필요', TRUE, TRUE, '지수/로그 계산 오답 반복'),
    ('AIM_26008', 75, '안정 진행', FALSE, FALSE, '제출률 양호'),
    ('AIM_26009', 70, '실전 대비', FALSE, FALSE, '수능형 기하 적응 중'),
    ('AIM_26010', 55, '집중 보강', TRUE, TRUE, '시간 관리/기본기 보강 필요'),
    ('AIM_26011', 73, '안정 진행', FALSE, FALSE, '속도 훈련 필요'),
    ('AIM_26012', 85, '상위권 유지', FALSE, FALSE, '고난도 문제까지 소화 중')
) AS v(student_code, readiness_score, progress_status, needs_reinforcement, needs_plan_adjust, note)
JOIN students s ON s.student_code = v.student_code
JOIN student_exam se ON se.student_id = s.id
WHERE se.exam_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM student_exam_readiness ser
    WHERE ser.student_id = s.id
      AND ser.exam_id = se.exam_id
  );

-- student_weak_topics
INSERT INTO student_weak_topics (student_id, topic, severity, note)
SELECT s.id, v.topic, v.severity::urgency_level, v.note
FROM (
  VALUES
    ('AIM_26003', '원의 방정식 부호 처리', 'high',   '부호 전환 실수 반복'),
    ('AIM_26007', '로그 계산 기초',         'high',   '밑변환 적용 순서 혼동'),
    ('AIM_26010', '도형 방정식 시간 관리',  'medium', '풀이 속도 부족'),
    ('AIM_26011', '공간도형 좌표 해석',     'medium', '문제 해석 속도 개선 필요')
) AS v(student_code, topic, severity, note)
JOIN students s ON s.student_code = v.student_code
WHERE NOT EXISTS (
  SELECT 1
  FROM student_weak_topics wt
  WHERE wt.student_id = s.id
    AND wt.topic = v.topic
);

-- student_feedback_logs
INSERT INTO student_feedback_logs (student_id, teacher_id, feedback_text, next_action, logged_at)
SELECT s.id, cg.teacher_id, v.feedback_text, v.next_action, NOW() - INTERVAL '1 day'
FROM (
  VALUES
    ('AIM_26003', '부호 실수가 반복되어 검산 루틴을 도입해야 합니다.', '검산 체크리스트 5문항 적용'),
    ('AIM_26007', '로그 계산에서 기초 실수가 반복됩니다. 공식 정리 후 재풀이가 필요합니다.', '기초 10문항 재제출'),
    ('AIM_26010', '시험 임박으로 시간 배분 훈련이 가장 중요합니다.', '타이머 풀이 3세트'),
    ('AIM_26011', '문제 해석은 정확하나 풀이 속도가 느립니다.', '속도 훈련 15분 과제')
) AS v(student_code, feedback_text, next_action)
JOIN students s ON s.student_code = v.student_code
JOIN enrollments en ON en.student_id = s.id AND en.is_active = TRUE
JOIN class_groups cg ON cg.id = en.class_group_id
WHERE NOT EXISTS (
  SELECT 1
  FROM student_feedback_logs fl
  WHERE fl.student_id = s.id
    AND fl.feedback_text = v.feedback_text
);

-- verify
-- SELECT COUNT(*) FROM exams WHERE exam_name LIKE '2026%';
-- SELECT COUNT(*) FROM student_exam_readiness ser JOIN students s ON s.id=ser.student_id WHERE s.student_code LIKE 'AIM_260%';
-- SELECT s.student_code, gp.goal_score, gp.exam_target_date
-- FROM student_goal_profiles gp JOIN students s ON s.id=gp.student_id
-- WHERE s.student_code LIKE 'AIM_260%' ORDER BY s.student_code;

-- ============================================================
-- plans
-- 전용 plan 테이블은 없으므로 class_curriculums + curriculum_roadmap_items로 수동 계획 반영
-- ============================================================

-- class_curriculums
WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
class_exam AS (
  SELECT cm.class_key, cm.class_group_id,
         (
           SELECT e.id
           FROM exams e
           WHERE e.class_group_id = cm.class_group_id
             AND e.exam_date >= CURRENT_DATE
           ORDER BY e.exam_date
           LIMIT 1
         ) AS exam_id
  FROM class_map cm
)
INSERT INTO class_curriculums (
  class_group_id, exam_id, total_period_weeks, total_units, remaining_units,
  remaining_lessons, planned_progress, actual_progress, status, delay_units,
  reinforcement_units, weekly_target, completion_chance, next_checkpoint
)
SELECT ce.class_group_id, ce.exam_id,
       v.total_period_weeks, v.total_units, v.remaining_units, v.remaining_lessons,
       v.planned_progress, v.actual_progress, v.status::curriculum_status,
       v.delay_units, v.reinforcement_units, v.weekly_target, v.completion_chance, v.next_checkpoint
FROM (
  VALUES
    ('g1_geo_a',   8, 16, 10, 12, 38.0, 33.0, 'slightly_delayed', 1, 1, '주 2단원', '보통', '도형 방정식 심화 완료'),
    ('g2_math2_a', 8, 18, 11, 13, 42.0, 39.0, 'on_track',         0, 1, '주 2단원', '높음', '수열 응용 단원 완료'),
    ('g3_su_geo_b',6, 14, 9,  10, 48.0, 44.0, 'slightly_delayed', 1, 2, '주 3단원', '보통', '수능 기하 실전 파트 진입')
 ) AS v(class_key, total_period_weeks, total_units, remaining_units, remaining_lessons, planned_progress, actual_progress, status, delay_units, reinforcement_units, weekly_target, completion_chance, next_checkpoint)
JOIN class_exam ce ON ce.class_key = v.class_key
WHERE ce.class_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM class_curriculums cc
    WHERE cc.class_group_id = ce.class_group_id
  );

-- curriculum_roadmap_items
WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
curr_map AS (
  SELECT cm.class_key, cc.id AS curriculum_id
  FROM class_map cm
  JOIN class_curriculums cc ON cc.class_group_id = cm.class_group_id
),
roadmap_data AS (
  SELECT *
  FROM (
    VALUES
      ('g1_geo_a', 1, '도형의 방정식 핵심 정리', 0, 10, 45.0, 40.0, 'on_track', '개념+기본 예제', '기본 과제 12문항', '부호 실수 유의', '오답노트 1회', TRUE),
      ('g1_geo_a', 2, '원/직선 심화 및 내신 대비', 11, 21, 60.0, 50.0, 'slightly_delayed', '심화 문제 풀이', '심화 과제 10문항', '접선 조건 혼동', '개별 보강 1회', TRUE),
      ('g2_math2_a', 1, '지수·로그 함수 정리', 0, 9, 50.0, 46.0, 'on_track', '핵심 공식 정리', '기본+응용 과제 14문항', '밑변환 실수', '오답 재풀이', TRUE),
      ('g2_math2_a', 2, '수열 응용/실전 문항', 10, 20, 65.0, 58.0, 'slightly_delayed', '응용 문항 집중', '실전 과제 12문항', '점화식 전개 누락', '서술형 보강', TRUE),
      ('g3_su_geo_b', 1, '수능 기하 핵심 유형', 0, 7, 55.0, 51.0, 'on_track', '실전 유형 반복', '모의 과제 15문항', '도형 해석 속도', '속도 훈련', TRUE),
      ('g3_su_geo_b', 2, '실전 모의 + 오답 교정', 8, 14, 70.0, 62.0, 'slightly_delayed', '모의 1회 진행', '오답 교정 과제', '시간 배분 불안', '개별 피드백', TRUE)
  ) AS v(class_key, sort_order, title, start_offset, end_offset, planned_progress, actual_progress, status, lesson_note, assignment_note, common_mistake_note, reinforcement_note, can_finish_before_exam)
)
INSERT INTO curriculum_roadmap_items (
  curriculum_id, title, period_start, period_end, planned_progress, actual_progress,
  status, lesson_note, assignment_note, common_mistake_note, reinforcement_note,
  can_finish_before_exam, sort_order
)
SELECT cm.curriculum_id, rd.title,
       CURRENT_DATE + rd.start_offset, CURRENT_DATE + rd.end_offset,
       rd.planned_progress, rd.actual_progress,
       rd.status::curriculum_status,
       rd.lesson_note, rd.assignment_note, rd.common_mistake_note, rd.reinforcement_note,
       rd.can_finish_before_exam, rd.sort_order
FROM roadmap_data rd
JOIN curr_map cm ON cm.class_key = rd.class_key
WHERE NOT EXISTS (
  SELECT 1
  FROM curriculum_roadmap_items cri
  WHERE cri.curriculum_id = cm.curriculum_id
    AND cri.title = rd.title
);

-- verify
-- SELECT cg.class_name, cc.status, cc.planned_progress, cc.actual_progress
-- FROM class_curriculums cc JOIN class_groups cg ON cg.id=cc.class_group_id
-- WHERE cg.id IN (
--   SELECT MIN(id) FROM class_groups WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
--   UNION ALL
--   SELECT MIN(id) FROM class_groups WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
--   UNION ALL
--   SELECT MIN(id) FROM class_groups WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
-- );

-- ============================================================
-- assignments
-- 과제 데이터 보강 (12개)
-- ============================================================

WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id, MIN(teacher_id) AS teacher_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id, MIN(teacher_id) AS teacher_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id, MIN(teacher_id) AS teacher_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
assignment_data AS (
  SELECT *
  FROM (
    VALUES
      ('g1_geo_a',  '도형의 방정식 기본 12문항',     -2,  2, 12, 'active',              '좌표 대입 실수', 0),
      ('g1_geo_a',  '원과 직선 위치관계 10문항',     -5,  1, 10, 'due_soon',            '접선 판별식',   0),
      ('g1_geo_a',  '내신 대비 기하 서술형 8문항',   -8, -1,  8, 'reviewed',            '서술형 논리 전개', 0),
      ('g1_geo_a',  '도형의 이동 복습 10문항',       -1,  4, 10, 'needs_reinforcement', '이동 후 식 정리', 1),
      ('g2_math2_a','지수함수 기본 15문항',          -3,  3, 15, 'active',              '지수 법칙 적용', 0),
      ('g2_math2_a','로그함수 응용 12문항',          -6,  1, 12, 'due_soon',            '밑변환 계산',   1),
      ('g2_math2_a','수열 기초 확인 10문항',         -9, -2, 10, 'reviewed',            '일반항 설정',   0),
      ('g2_math2_a','수열 실전 14문항',              -2,  5, 14, 'active',              '점화식 전개',   0),
      ('g3_su_geo_b','수능 기하 핵심 15문항',        -3,  2, 15, 'active',              '벡터 내적 해석', 0),
      ('g3_su_geo_b','도형 방정식 실전 12문항',      -7,  1, 12, 'due_soon',            '도형 조건 정리', 1),
      ('g3_su_geo_b','기하 모의 미니 10문항',        -10, -2,10, 'reviewed',            '시간 배분',     0),
      ('g3_su_geo_b','수능 대비 오답 교정 8문항',    -1,  6,  8, 'needs_reinforcement', '반복 오답 유형', 1)
  ) AS v(class_key, title, issued_offset, due_offset, total_questions, status, top_mistake_topic, repeat_nonsubmit_count)
)
INSERT INTO assignments (
  class_group_id, teacher_id, title, issued_date, due_date, total_questions, status, top_mistake_topic, repeat_nonsubmit_count
)
SELECT cm.class_group_id, cm.teacher_id, ad.title,
       CURRENT_DATE + ad.issued_offset,
       CURRENT_DATE + ad.due_offset,
       ad.total_questions,
       ad.status::assignment_status,
       ad.top_mistake_topic,
       ad.repeat_nonsubmit_count
FROM assignment_data ad
JOIN class_map cm ON cm.class_key = ad.class_key
WHERE cm.class_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM assignments a
    WHERE a.class_group_id = cm.class_group_id
      AND a.title = ad.title
      AND a.due_date = CURRENT_DATE + ad.due_offset
  );

-- verify
-- SELECT cg.class_name, COUNT(*) AS assignment_count
-- FROM assignments a
-- JOIN class_groups cg ON cg.id = a.class_group_id
-- WHERE a.title LIKE '도형의 방정식%' OR a.title LIKE '지수함수%' OR a.title LIKE '수능 기하%'
-- GROUP BY cg.class_name;

-- ============================================================
-- submissions
-- 제출 데이터 보강 (18개)
-- ============================================================

WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
submission_data AS (
  SELECT *
  FROM (
    VALUES
      ('g1_geo_a',  '도형의 방정식 기본 12문항',   'AIM_26001', 'completed',     18, 'photo',  9, 12, NULL,                                              FALSE, TRUE),
      ('g1_geo_a',  '도형의 방정식 기본 12문항',   'AIM_26002', 'completed',     20, 'omr',   10, 12, NULL,                                              FALSE, FALSE),
      ('g1_geo_a',  '도형의 방정식 기본 12문항',   'AIM_26003', 'partial',       10, 'photo',  6, 10, '7번 도형 조건 정리 방식이 헷갈립니다.',             FALSE, TRUE),
      ('g1_geo_a',  '원과 직선 위치관계 10문항',   'AIM_26001', 'completed',     30, 'photo',  8, 10, NULL,                                              FALSE, FALSE),
      ('g1_geo_a',  '원과 직선 위치관계 10문항',   'AIM_26003', 'not_submitted', NULL, NULL,  NULL, NULL, NULL,                                             TRUE,  FALSE),
      ('g1_geo_a',  '원과 직선 위치관계 10문항',   'AIM_26004', 'completed',     26, 'omr',    9, 10, NULL,                                              FALSE, FALSE),
      ('g2_math2_a','지수함수 기본 15문항',        'AIM_26005', 'completed',     16, 'photo', 12, 15, NULL,                                              FALSE, FALSE),
      ('g2_math2_a','지수함수 기본 15문항',        'AIM_26006', 'completed',     14, 'omr',   13, 15, NULL,                                              FALSE, FALSE),
      ('g2_math2_a','지수함수 기본 15문항',        'AIM_26007', 'partial',        8, 'photo',  7, 12, '로그 계산에서 밑변환 순서가 자주 틀립니다.',         FALSE, TRUE),
      ('g2_math2_a','로그함수 응용 12문항',        'AIM_26005', 'completed',     28, 'photo', 10, 12, NULL,                                              FALSE, FALSE),
      ('g2_math2_a','로그함수 응용 12문항',        'AIM_26007', 'not_submitted', NULL, NULL,  NULL, NULL, NULL,                                             TRUE,  FALSE),
      ('g2_math2_a','로그함수 응용 12문항',        'AIM_26008', 'completed',     24, 'omr',    9, 12, NULL,                                              FALSE, FALSE),
      ('g3_su_geo_b','수능 기하 핵심 15문항',      'AIM_26009', 'completed',     12, 'photo', 11, 15, NULL,                                              FALSE, TRUE),
      ('g3_su_geo_b','수능 기하 핵심 15문항',      'AIM_26010', 'partial',        6, 'photo',  6, 10, '시간이 부족해서 뒤쪽 문항을 못 풀었습니다.',          FALSE, TRUE),
      ('g3_su_geo_b','수능 기하 핵심 15문항',      'AIM_26011', 'completed',     10, 'omr',   12, 15, NULL,                                              FALSE, FALSE),
      ('g3_su_geo_b','도형 방정식 실전 12문항',    'AIM_26009', 'completed',     22, 'photo',  9, 12, NULL,                                              FALSE, TRUE),
      ('g3_su_geo_b','도형 방정식 실전 12문항',    'AIM_26010', 'not_submitted', NULL, NULL,  NULL, NULL, NULL,                                             TRUE,  FALSE),
      ('g3_su_geo_b','도형 방정식 실전 12문항',    'AIM_26012', 'completed',     18, 'omr',   11, 12, NULL,                                              FALSE, FALSE)
  ) AS v(class_key, assignment_title, student_code, submit_status, submitted_hours_ago, submission_type, correct_count, total_questions, question_text, is_repeat_nonsubmit, needs_review)
)
INSERT INTO student_submissions (
  assignment_id, student_id, submit_status, submitted_at, submission_type, ocr_summary,
  correct_count, total_questions, question_text, is_repeat_nonsubmit, needs_review
)
SELECT a.id, s.id,
       sd.submit_status::submit_status,
       CASE
         WHEN sd.submit_status = 'not_submitted' THEN NULL
         ELSE NOW() - (sd.submitted_hours_ago || ' hours')::interval
       END AS submitted_at,
       CASE
         WHEN sd.submit_status = 'not_submitted' THEN NULL
         ELSE sd.submission_type::submission_type
       END AS submission_type,
       NULL AS ocr_summary, -- 운영형 MVP 우선: OCR 데이터 미사용
       sd.correct_count,
       sd.total_questions,
       sd.question_text,
       sd.is_repeat_nonsubmit,
       sd.needs_review
FROM submission_data sd
JOIN class_map cm ON cm.class_key = sd.class_key
JOIN assignments a ON a.class_group_id = cm.class_group_id AND a.title = sd.assignment_title
JOIN students s ON s.student_code = sd.student_code
WHERE NOT EXISTS (
  SELECT 1
  FROM student_submissions ss
  WHERE ss.assignment_id = a.id
    AND ss.student_id = s.id
);

-- verify
-- SELECT a.title, ss.submit_status, COUNT(*) AS cnt
-- FROM student_submissions ss
-- JOIN assignments a ON a.id = ss.assignment_id
-- WHERE a.title IN ('도형의 방정식 기본 12문항', '지수함수 기본 15문항', '수능 기하 핵심 15문항')
-- GROUP BY a.title, ss.submit_status
-- ORDER BY a.title, ss.submit_status;

-- ============================================================
-- reports
-- 수동 리포트 데이터 보강 (학생/반)
-- ============================================================

-- reports_student
INSERT INTO reports_student (
  student_id, teacher_id, report_period_start, report_period_end, overall_status,
  summary_insight, achievement_score, progress_rate, homework_rate, weak_topic_count,
  exam_readiness_score, plan_stability, teacher_comment, next_lesson_direction
)
SELECT s.id, cg.teacher_id, CURRENT_DATE - 14, CURRENT_DATE,
       v.overall_status::report_overall_status,
       v.summary_insight, v.achievement_score, v.progress_rate, v.homework_rate, v.weak_topic_count,
       v.exam_readiness_score, v.plan_stability, v.teacher_comment, v.next_lesson_direction
FROM (
  VALUES
    ('AIM_26001', 'good',    '기하 기본 문제 풀이 안정, 서술형 표현 보강 필요', 78, 66.0, 82.0, 1, 76, '보통', '개념은 안정적입니다. 서술형 완성도를 높여봅시다.', '서술형 5문항 집중'),
    ('AIM_26002', 'excellent','도형 좌표 해석이 매우 안정적이며 성장세가 좋음',   84, 70.0, 88.0, 0, 82, '높음', '상위권 흐름 유지 중입니다.', '심화 유형 확장'),
    ('AIM_26003', 'caution', '계산 실수 빈도가 높아 재검산 루틴이 필요',            68, 54.0, 61.0, 2, 61, '낮음', '속도보다 정확도부터 회복합시다.', '부호/계산 교정'),
    ('AIM_26004', 'good',    '기본기는 안정적이며 제출 성실도가 높음',               75, 62.0, 84.0, 1, 72, '보통', '좋은 학습 태도를 유지하고 있습니다.', '내신형 응용 확장'),
    ('AIM_26005', 'good',    '지수함수 파트 안정, 응용 문제 보강 단계',               77, 64.0, 85.0, 1, 74, '보통', '응용 문항 완성도를 올려봅시다.', '응용 10문항'),
    ('AIM_26006', 'good',    '수열 파트 상승세, 실전 정답률 개선 중',                 81, 68.0, 88.0, 1, 79, '높음', '꾸준히 성장 중입니다.', '실전 타이머 훈련'),
    ('AIM_26007', 'critical','로그 계산 실수가 누적되어 집중 교정 필요',             64, 52.0, 58.0, 2, 63, '낮음', '기초 계산 정확도 회복이 우선입니다.', '기초 재학습'),
    ('AIM_26008', 'good',    '제출률이 좋고 학습 패턴이 안정적',                      76, 63.0, 86.0, 1, 75, '보통', '현재 페이스를 유지합시다.', '수열 응용 강화'),
    ('AIM_26009', 'good',    '수능 기하 적응 중, 약점 보강 필요',                      74, 60.0, 79.0, 1, 70, '보통', '실전형 문항을 늘려봅시다.', '기하 실전 세트'),
    ('AIM_26010', 'critical','시간 배분 문제로 제출/완료율 저조',                      61, 48.0, 52.0, 2, 55, '낮음', '학습 루틴 재정비가 필요합니다.', '시간관리 훈련'),
    ('AIM_26011', 'good',    '개념 이해는 좋고 실전 속도 개선 단계',                  78, 65.0, 82.0, 1, 73, '보통', '풀이 속도를 올리면 성과가 더 좋아집니다.', '속도 중심 실전'),
    ('AIM_26012', 'excellent','고난도 문항 처리 능력이 우수',                          86, 72.0, 90.0, 0, 85, '높음', '상위권 유지가 가능합니다.', '난도 상향 학습')
) AS v(student_code, overall_status, summary_insight, achievement_score, progress_rate, homework_rate, weak_topic_count, exam_readiness_score, plan_stability, teacher_comment, next_lesson_direction)
JOIN students s ON s.student_code = v.student_code
LEFT JOIN enrollments en ON en.student_id = s.id AND en.is_active = TRUE
LEFT JOIN class_groups cg ON cg.id = en.class_group_id
WHERE NOT EXISTS (
  SELECT 1
  FROM reports_student rs
  WHERE rs.student_id = s.id
    AND rs.report_period_start = CURRENT_DATE - 14
    AND rs.report_period_end = CURRENT_DATE
);

-- report_period_metrics (수동 지표)
WITH target_reports AS (
  SELECT rs.id, rs.achievement_score, rs.homework_rate, rs.progress_rate, rs.report_period_start, rs.report_period_end
  FROM reports_student rs
  JOIN students s ON s.id = rs.student_id
  WHERE s.student_code LIKE 'AIM_260%'
    AND rs.report_period_start = CURRENT_DATE - 14
    AND rs.report_period_end = CURRENT_DATE
),
metrics AS (
  SELECT id AS report_id, 'achievement'::text AS metric_name, achievement_score::numeric AS metric_value, report_period_start + 7 AS metric_date
  FROM target_reports
  UNION ALL
  SELECT id AS report_id, 'achievement', achievement_score::numeric, report_period_end
  FROM target_reports
  UNION ALL
  SELECT id AS report_id, 'homework_rate', homework_rate::numeric, report_period_start + 7
  FROM target_reports
  UNION ALL
  SELECT id AS report_id, 'homework_rate', homework_rate::numeric, report_period_end
  FROM target_reports
  UNION ALL
  SELECT id AS report_id, 'progress_rate', progress_rate::numeric, report_period_start + 7
  FROM target_reports
  UNION ALL
  SELECT id AS report_id, 'progress_rate', progress_rate::numeric, report_period_end
  FROM target_reports
)
INSERT INTO report_period_metrics (report_id, metric_name, metric_value, metric_date)
SELECT m.report_id, m.metric_name, m.metric_value, m.metric_date
FROM metrics m
WHERE NOT EXISTS (
  SELECT 1
  FROM report_period_metrics rpm
  WHERE rpm.report_id = m.report_id
    AND rpm.metric_name = m.metric_name
    AND rpm.metric_date = m.metric_date
);

-- reports_class
WITH class_map AS (
  SELECT MIN(id) AS class_group_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT MIN(id)
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT MIN(id)
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
class_stats AS (
  SELECT
    cg.id AS class_group_id,
    cg.teacher_id,
    ROUND(AVG(rs.achievement_score)::numeric, 2) AS avg_achievement,
    ROUND(AVG(rs.homework_rate)::numeric, 2) AS avg_homework_rate,
    ROUND(AVG(rs.exam_readiness_score)::numeric, 2) AS avg_exam_readiness
  FROM class_groups cg
  JOIN class_map cm ON cm.class_group_id = cg.id
  JOIN enrollments en ON en.class_group_id = cg.id AND en.is_active = TRUE
  JOIN reports_student rs ON rs.student_id = en.student_id
  WHERE rs.report_period_start = CURRENT_DATE - 14
    AND rs.report_period_end = CURRENT_DATE
  GROUP BY cg.id, cg.teacher_id
)
INSERT INTO reports_class (
  class_group_id, teacher_id, report_period_start, report_period_end,
  avg_achievement, avg_homework_rate, avg_exam_readiness, summary
)
SELECT
  cs.class_group_id,
  cs.teacher_id,
  CURRENT_DATE - 14,
  CURRENT_DATE,
  cs.avg_achievement,
  cs.avg_homework_rate,
  cs.avg_exam_readiness,
  jsonb_build_object(
    'status', 'manual',
    'note', '운영형 MVP 수동 집계 리포트',
    'updated_by', '08_seed_demo_updates.sql'
  )
FROM class_stats cs
WHERE NOT EXISTS (
  SELECT 1
  FROM reports_class rc
  WHERE rc.class_group_id = cs.class_group_id
    AND rc.report_period_start = CURRENT_DATE - 14
    AND rc.report_period_end = CURRENT_DATE
);

-- verify
-- SELECT COUNT(*) FROM reports_student rs JOIN students s ON s.id=rs.student_id WHERE s.student_code LIKE 'AIM_260%';
-- SELECT COUNT(*) FROM reports_class WHERE report_period_end = CURRENT_DATE;

-- ============================================================
-- today lessons
-- 오늘 수업/최근 수업 카드가 비지 않도록 일정/준비 데이터 보강
-- ============================================================

-- lesson_schedules
WITH class_map AS (
  SELECT 'g1_geo_a' AS class_key, MIN(id) AS class_group_id, MIN(teacher_id) AS teacher_id
  FROM class_groups
  WHERE grade='grade1' AND track='naesin' AND naesin_subject='geometry' AND level='A'
  UNION ALL
  SELECT 'g2_math2_a' AS class_key, MIN(id) AS class_group_id, MIN(teacher_id) AS teacher_id
  FROM class_groups
  WHERE grade='grade2' AND track='naesin' AND naesin_subject='math2' AND level='A'
  UNION ALL
  SELECT 'g3_su_geo_b' AS class_key, MIN(id) AS class_group_id, MIN(teacher_id) AS teacher_id
  FROM class_groups
  WHERE grade='grade3' AND track='suneung' AND suneung_subject='common_geometry' AND level='B'
),
schedule_data AS (
  SELECT *
  FROM (
    VALUES
      ('g1_geo_a',   1, '18:00', '20:00', '도형의 방정식 핵심 유형 정리', 'scheduled'),
      ('g1_geo_a',   3, '18:00', '20:00', '원과 직선 서술형 훈련',       'scheduled'),
      ('g2_math2_a', 1, '20:10', '22:10', '지수·로그 실전 문제 풀이',    'scheduled'),
      ('g2_math2_a', 4, '20:10', '22:10', '수열 응용 집중 보강',         'scheduled'),
      ('g3_su_geo_b',2, '19:00', '21:00', '수능 기하 실전 모의',         'scheduled'),
      ('g3_su_geo_b',5, '19:00', '21:00', '도형 방정식 오답 교정',       'scheduled')
  ) AS v(class_key, day_offset, start_time, end_time, topic, status)
)
INSERT INTO lesson_schedules (
  class_group_id, teacher_id, scheduled_date, start_time, end_time, topic, status
)
SELECT cm.class_group_id, cm.teacher_id,
       CURRENT_DATE + sd.day_offset,
       sd.start_time::time, sd.end_time::time, sd.topic, sd.status
FROM schedule_data sd
JOIN class_map cm ON cm.class_key = sd.class_key
WHERE cm.class_group_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM lesson_schedules ls
    WHERE ls.class_group_id = cm.class_group_id
      AND ls.scheduled_date = CURRENT_DATE + sd.day_offset
      AND ls.start_time = sd.start_time::time
      AND ls.topic = sd.topic
  );

-- lesson_preps (ai_suggestions는 의도적으로 NULL 유지)
INSERT INTO lesson_preps (
  lesson_schedule_id, weak_topic_overview, homework_reflection, materials_needed, ai_suggestions
)
SELECT
  ls.id,
  jsonb_build_array('최근 오답 상위 유형 2개 재설명', '핵심 개념 정의 재확인'),
  jsonb_build_array('미제출 학생 체크', '질문 문항 우선 해결'),
  jsonb_build_array('개념 요약 프린트', '단원별 미니퀴즈'),
  NULL
FROM lesson_schedules ls
WHERE ls.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
  AND ls.topic IN (
    '도형의 방정식 핵심 유형 정리',
    '원과 직선 서술형 훈련',
    '지수·로그 실전 문제 풀이',
    '수열 응용 집중 보강',
    '수능 기하 실전 모의',
    '도형 방정식 오답 교정'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM lesson_preps lp
    WHERE lp.lesson_schedule_id = ls.id
  );

-- lesson_materials
INSERT INTO lesson_materials (lesson_schedule_id, material_type, title, description)
SELECT ls.id, 'worksheet', ls.topic || ' 워크시트', '수동 운영형 MVP용 기본 자료'
FROM lesson_schedules ls
WHERE ls.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
  AND ls.topic IN (
    '도형의 방정식 핵심 유형 정리',
    '원과 직선 서술형 훈련',
    '지수·로그 실전 문제 풀이',
    '수열 응용 집중 보강',
    '수능 기하 실전 모의',
    '도형 방정식 오답 교정'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM lesson_materials lm
    WHERE lm.lesson_schedule_id = ls.id
      AND lm.title = ls.topic || ' 워크시트'
  );

-- lesson_next_actions
INSERT INTO lesson_next_actions (lesson_schedule_id, phase, action_text, priority, is_done)
SELECT ls.id, x.phase::lesson_phase, x.action_text, x.priority, FALSE
FROM lesson_schedules ls
CROSS JOIN (
  VALUES
    ('before', '수업 전 미제출/질문 학생 목록 확인', 1),
    ('during', '핵심 오답 유형 2개 재설명', 1),
    ('after',  '개별 피드백 및 다음 과제 공지', 1)
) AS x(phase, action_text, priority)
WHERE ls.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
  AND ls.topic IN (
    '도형의 방정식 핵심 유형 정리',
    '원과 직선 서술형 훈련',
    '지수·로그 실전 문제 풀이',
    '수열 응용 집중 보강',
    '수능 기하 실전 모의',
    '도형 방정식 오답 교정'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM lesson_next_actions lna
    WHERE lna.lesson_schedule_id = ls.id
      AND lna.phase = x.phase::lesson_phase
      AND lna.action_text = x.action_text
  );

-- verify
-- SELECT scheduled_date, topic, status
-- FROM lesson_schedules
-- WHERE scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
-- ORDER BY scheduled_date, start_time;
-- SELECT COUNT(*) FROM lesson_preps lp
-- JOIN lesson_schedules ls ON ls.id = lp.lesson_schedule_id
-- WHERE ls.scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7;

-- ============================================================
-- settings
-- 설정 화면 fallback 완화를 위한 최소 설정값 보강
-- ============================================================

WITH settings_seed AS (
  SELECT *
  FROM (
    VALUES
      (
        'notification_settings',
        '[
          {"key":"exam_alert","label":"시험 임박 알림","description":"D-14 이내 시험 예정 학생 발생 시 알림","enabled":true},
          {"key":"missing_hw","label":"미제출 알림","description":"숙제 미제출 2회 이상 학생 발생 시 알림","enabled":true},
          {"key":"question_alert","label":"질문 등록 알림","description":"학생이 질문을 새로 등록할 때 알림","enabled":true},
          {"key":"plan_delay","label":"계획 지연 알림","description":"진도 달성률이 목표 대비 낮을 때 알림","enabled":true},
          {"key":"lesson_issue","label":"수업 반영 필요 이슈 알림","description":"이슈함에 긴급 이슈가 등록될 때 알림","enabled":true}
        ]'::jsonb
      ),
      (
        'report_settings',
        '{"defaultPeriod":"4주","defaultView":"학생별","examEmphasisDDay":"D-14"}'::jsonb
      ),
      (
        'lesson_settings',
        '{"defaultDuration":"90분","showNextAction":true,"showLessonMemo":true,"todayPageInfoScope":"전체"}'::jsonb
      ),
      (
        'assignment_settings',
        '{"defaultDeadlineTime":"23:59","allowPhotoSubmit":true,"allowOMRSubmit":true,"questionEnabled":true,"commonMistakeAlert":true}'::jsonb
      )
  ) AS v(setting_key, setting_value)
)
INSERT INTO teacher_settings (teacher_id, setting_key, setting_value)
SELECT t.id, ss.setting_key, ss.setting_value
FROM teachers t
CROSS JOIN settings_seed ss
WHERE NOT EXISTS (
  SELECT 1
  FROM teacher_settings ts
  WHERE ts.teacher_id = t.id
    AND ts.setting_key = ss.setting_key
);

-- verify
-- SELECT teacher_id, setting_key
-- FROM teacher_settings
-- WHERE setting_key IN ('notification_settings', 'report_settings', 'lesson_settings', 'assignment_settings')
-- ORDER BY teacher_id, setting_key;

COMMIT;

-- ============================================================
-- 전체 확인용 쿼리 (수동 실행)
-- ============================================================
-- SELECT COUNT(*) AS classes_total FROM class_groups;
-- SELECT COUNT(*) AS students_total FROM students;
-- SELECT COUNT(*) AS assignments_total FROM assignments;
-- SELECT COUNT(*) AS submissions_total FROM student_submissions;
-- SELECT COUNT(*) AS reports_student_total FROM reports_student;
-- SELECT COUNT(*) AS schedules_next_7d
-- FROM lesson_schedules
-- WHERE scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7;
