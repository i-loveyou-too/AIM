-- ============================================================
-- 05_seed_assignments.sql
-- 과제 / 제출 현황 / OMR / OCR / 공통오답 / 수업반영
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- assignments — 반별 과제
-- class_group_id: 11=고3내신미적분A, 12=고3내신미적분B, 13=고3내신미적분C
--                 14=고3내신확통A,   6=고2내신미적분A,  7=고2내신미적분B
--                 17=고3수능미적분A, 1=고1내신수학1A
-- ────────────────────────────────────────────────────────────
INSERT INTO assignments (class_group_id, teacher_id, title, issued_date, due_date, total_questions, status, top_mistake_topic, repeat_nonsubmit_count) VALUES
-- 고3 내신 미적분 A반
(11, 1, '수열의 극한 — 기본 계산 20문항',       '2025-03-22', '2025-03-25', 20, 'needs_reinforcement', '∞-∞ 꼴 유리화',          1),
(11, 1, '미분법 기초 — 도함수 정의 10문항',      '2025-03-15', '2025-03-18', 10, 'reviewed',            '합성함수 미분 체인룰',    0),
-- 고3 내신 미적분 B반
(12, 1, '등비수열 심화 + 수렴 조건 — 15문항',   '2025-03-20', '2025-03-24', 15, 'reviewed',            '급수 수렴 경계 케이스',   0),
(12, 1, '수열의 극한 — 응용 12문항',             '2025-03-24', '2025-03-27', 12, 'active',              '최고차항 분리',           0),
-- 고3 내신 미적분 C반
(13, 2, '등비수열 심화 + 점화식 — 15문항',      '2025-03-22', '2025-03-27', 15, 'due_soon',            '점화식 → 일반항 유도',    2),
(13, 2, '수열 기초 복습 — 10문항',               '2025-03-13', '2025-03-17', 10, 'reviewed',            '등차수열 일반항',         1),
-- 고3 내신 확통 A반
(14, 1, '순열과 조합 — 기본 15문항',             '2025-03-21', '2025-03-25', 15, 'reviewed',            '원형 순열',               0),
(14, 1, '조건부확률 — 10문항',                   '2025-03-24', '2025-03-28', 10, 'active',              '조건부확률 적용',         0),
-- 고2 내신 미적분 A반
(6,  1, '함수의 극한 — 기본 20문항',             '2025-03-22', '2025-03-26', 20, 'active',              '∞/∞ 꼴 극한',             0),
(6,  1, '연속함수 — 기본 10문항',                '2025-03-15', '2025-03-19', 10, 'reviewed',            '불연속점 판별',           0),
-- 고2 내신 미적분 B반
(7,  2, '함수의 극한 — 기초 15문항',             '2025-03-21', '2025-03-26', 15, 'active',              '좌·우극한 계산',          1),
-- 고3 수능 공통+미적분 A반
(17, 1, '미적분 실전 모의 — 15문항',             '2025-03-20', '2025-03-24', 15, 'reviewed',            '치환적분 범위 재설정',    0),
(17, 1, '공통수학 확률 — 집중 10문항',           '2025-03-24', '2025-03-28', 10, 'active',              '조건부확률 베이즈',       0),
-- 고1 내신 수학1 A반
(1,  3, '이차함수 — 기본 15문항',                '2025-03-21', '2025-03-25', 15, 'due_soon',            '꼭짓점 공식 응용',        0),
(1,  3, '집합과 명제 — 10문항',                  '2025-03-14', '2025-03-18', 10, 'reviewed',            '명제의 역·이·대우',       0);

-- ────────────────────────────────────────────────────────────
-- student_submissions — 고3 내신 미적분 A반 (assignment_id=1)
-- 수강생: student_id 1,3,5,8,14,17,21,26
-- ────────────────────────────────────────────────────────────
INSERT INTO student_submissions (assignment_id, student_id, submit_status, submitted_at, submission_type, ocr_summary, correct_count, total_questions, question_text, is_repeat_nonsubmit, needs_review) VALUES
(1, 1,  'completed', '2025-03-25 14:32:00', 'photo',
 '20문항 중 14문항 풀이 확인. 분수형 극한 3문항 오답. 유리화 과정 생략 패턴.',
 NULL, NULL,
 '7번 ∞-∞ 유리화할 때 부호 방향이 헷갈려요. 다음 수업에서 다시 풀어주세요.',
 FALSE, TRUE),
(1, 3,  'completed', '2025-03-25 16:10:00', 'omr',
 NULL, 6, 10, NULL, FALSE, TRUE),
(1, 5,  'completed', '2025-03-25 20:15:00', 'photo',
 '20문항 전체 제출. 풀이 깔끔. 14~17번 극한값 오답 집중.',
 NULL, NULL, NULL, FALSE, FALSE),
(1, 8,  'completed', '2025-03-25 22:08:00', 'omr',
 NULL, 2, 5,
 '5번이 왜 ①이 아닌지 이해가 안 돼요. 분자 분모를 같이 나누는 거 아닌가요?',
 FALSE, TRUE),
(1, 14, 'completed', '2025-03-26 08:30:00', 'photo',
 '20문항 사진 3장 제출. OCR 인식률 낮음 — 손글씨 흐릿. 직접 검토 필요.',
 NULL, NULL, NULL, FALSE, TRUE),
(1, 17, 'completed', '2025-03-25 19:00:00', 'photo',
 '풀이 전반 안정적. 10번·15번 부등식 방향 오답.',
 NULL, NULL, NULL, FALSE, FALSE),
(1, 21, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE),
(1, 26, 'partial', '2025-03-25 23:50:00', 'photo',
 '20문항 중 12문항만 제출. 나머지 미완성.',
 NULL, NULL,
 '13번부터 시간이 부족해서 못 풀었어요. 이 유형 따로 설명 가능한가요?',
 FALSE, TRUE);

-- ────────────────────────────────────────────────────────────
-- student_submissions — 고3 내신 미적분 C반 (assignment_id=5)
-- 수강생: 4,7,16,27,32,37,42
-- ────────────────────────────────────────────────────────────
INSERT INTO student_submissions (assignment_id, student_id, submit_status, submitted_at, submission_type, ocr_summary, correct_count, total_questions, question_text, is_repeat_nonsubmit, needs_review) VALUES
(5, 4,  'completed', '2025-03-24 21:00:00', 'photo',
 '점화식 유도 파트 오답 3개. 등비수열 적용은 안정적.',
 NULL, NULL, NULL, FALSE, TRUE),
(5, 7,  'completed', '2025-03-24 18:40:00', 'photo',
 '전체 15문항 제출. 심화 문제 오답 집중.',
 NULL, NULL,
 '9번 점화식에서 공비를 어떻게 찾는 건지 모르겠어요.',
 FALSE, TRUE),
(5, 16, 'completed', '2025-03-24 20:00:00', 'photo',
 '전반 무난. 14번 응용 문제 오답.',
 NULL, NULL, NULL, FALSE, FALSE),
(5, 27, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE),
(5, 32, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE),
(5, 37, 'partial', '2025-03-25 01:00:00', 'photo',
 '10문항까지만 제출.',
 NULL, NULL,
 '11번 이후 심화 파트 어디서부터 공부해야 할지 모르겠어요.',
 FALSE, TRUE),
(5, 42, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE);

-- ────────────────────────────────────────────────────────────
-- student_submissions — 고3 수능 미적분 A반 (assignment_id=12)
-- 수강생: 10,18,24,30,35,38,41,43,45
-- ────────────────────────────────────────────────────────────
INSERT INTO student_submissions (assignment_id, student_id, submit_status, submitted_at, submission_type, ocr_summary, correct_count, total_questions, question_text, is_repeat_nonsubmit, needs_review) VALUES
(12, 10, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE),
(12, 18, 'completed', '2025-03-24 22:00:00', 'omr', NULL, 9, 15, NULL, FALSE, FALSE),
(12, 24, 'completed', '2025-03-24 20:30:00', 'omr', NULL, 13, 15, NULL, FALSE, FALSE),
(12, 30, 'completed', '2025-03-24 19:00:00', 'photo',
 '전체 15문항. 치환적분 범위 설정 2문항 오답.',
 NULL, NULL, NULL, FALSE, TRUE),
(12, 35, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE),
(12, 38, 'completed', '2025-03-23 21:00:00', 'omr', NULL, 14, 15, NULL, FALSE, FALSE),
(12, 41, 'completed', '2025-03-23 18:00:00', 'omr', NULL, 15, 15, NULL, FALSE, FALSE),
(12, 43, 'completed', '2025-03-24 16:00:00', 'photo',
 '전체 15문항 제출. 정적분 응용 파트 안정적.',
 NULL, NULL, NULL, FALSE, FALSE),
(12, 45, 'completed', '2025-03-24 17:30:00', 'omr', NULL, 11, 15,
 '12번 치환적분 범위 재설정이 헷갈려요.',
 FALSE, TRUE);

-- ────────────────────────────────────────────────────────────
-- student_submissions — 고2 내신 미적분 A반 (assignment_id=9)
-- 수강생: 46,47,53,54,61,66,76,77,86,91
-- ────────────────────────────────────────────────────────────
INSERT INTO student_submissions (assignment_id, student_id, submit_status, submitted_at, submission_type, ocr_summary, correct_count, total_questions, question_text, is_repeat_nonsubmit, needs_review) VALUES
(9, 46, 'completed', '2025-03-26 19:00:00', 'photo',
 '20문항 전체 제출. ∞/∞ 꼴 극한 5번·8번 오답.',
 NULL, NULL, NULL, FALSE, TRUE),
(9, 47, 'completed', '2025-03-26 20:30:00', 'omr', NULL, 17, 20, NULL, FALSE, FALSE),
(9, 53, 'completed', '2025-03-26 22:00:00', 'photo',
 '전체 제출. 3번·7번 극한값 계산 오류.',
 NULL, NULL,
 '3번에서 분자가 0이 되면 극한값이 무조건 0인가요?',
 FALSE, TRUE),
(9, 54, 'completed', '2025-03-25 18:00:00', 'omr', NULL, 19, 20, NULL, FALSE, FALSE),
(9, 61, 'completed', '2025-03-25 21:00:00', 'photo',
 '풀이 과정 매우 깔끔. 20문항 중 18문항 정답.',
 NULL, NULL, NULL, FALSE, FALSE),
(9, 66, 'completed', '2025-03-26 09:00:00', 'photo',
 '전체 제출. 우극한·좌극한 비교 문항 2개 오답.',
 NULL, NULL, NULL, FALSE, TRUE),
(9, 76, 'partial', '2025-03-26 23:55:00', 'photo',
 '15문항까지만 제출. 16~20번 미완성.',
 NULL, NULL,
 '16번 이후 ε-δ 논법 부분이 어려워요.',
 FALSE, TRUE),
(9, 77, 'completed', '2025-03-26 17:00:00', 'omr', NULL, 16, 20, NULL, FALSE, FALSE),
(9, 86, 'completed', '2025-03-25 16:00:00', 'omr', NULL, 18, 20, NULL, FALSE, FALSE),
(9, 91, 'not_submitted', NULL, NULL, NULL, NULL, NULL, NULL, FALSE, FALSE);

-- ────────────────────────────────────────────────────────────
-- OMR 답안 항목 (submission_omr_items)
-- submission_id 참조: assignment_id=1의 student_id=3 → id=2
--                     assignment_id=1의 student_id=8 → id=4
-- ────────────────────────────────────────────────────────────

-- 과제1, 학생 3 (박지호) OMR — submission_id=2
INSERT INTO submission_omr_items (submission_id, question_num, student_answer, correct_answer, is_correct) VALUES
(2, 1,  '②', '②', TRUE),
(2, 2,  '③', '③', TRUE),
(2, 3,  '①', '④', FALSE),
(2, 4,  '②', '②', TRUE),
(2, 5,  '⑤', '③', FALSE),
(2, 6,  '③', '③', TRUE),
(2, 7,  '②', '④', FALSE),
(2, 8,  '①', '①', TRUE),
(2, 9,  '④', '④', TRUE),
(2, 10, '③', '②', FALSE);

-- 과제1, 학생 8 (임준서) OMR — submission_id=4
INSERT INTO submission_omr_items (submission_id, question_num, student_answer, correct_answer, is_correct) VALUES
(4, 1, '②', '②', TRUE),
(4, 2, '①', '③', FALSE),
(4, 3, '④', '④', TRUE),
(4, 4, '③', '②', FALSE),
(4, 5, '①', '③', FALSE);

-- 과제12, 학생 18 (전지원) OMR — 수능반 — submission_id 계산
-- assignment_id=12 submissions: 10=s17, 18=s18, 24=s19, 30=s20, 35=s21, 38=s22, 41=s23, 43=s24, 45=s25
-- 단순화를 위해 시퀀스 id는 실제 삽입 순서에 따라 결정됨 → 서브쿼리로 참조

-- OMR 삽입 (assignment_id=12, student_id=18)
INSERT INTO submission_omr_items (submission_id, question_num, student_answer, correct_answer, is_correct)
SELECT s.id, q.question_num, q.student_answer, q.correct_answer, q.is_correct
FROM student_submissions s
CROSS JOIN (VALUES
    (1, '②', '②', TRUE), (2, '③', '③', TRUE), (3, '①', '④', FALSE),
    (4, '②', '②', TRUE), (5, '③', '③', TRUE), (6, '④', '④', TRUE),
    (7, '③', '①', FALSE),(8, '①', '①', TRUE), (9, '④', '④', TRUE),
    (10,'②', '③', FALSE),(11,'③', '③', TRUE), (12,'①', '①', TRUE),
    (13,'④', '②', FALSE),(14,'②', '②', TRUE), (15,'③', '③', TRUE)
) AS q(question_num, student_answer, correct_answer, is_correct)
WHERE s.assignment_id = 12 AND s.student_id = 18;

-- OMR 삽입 (assignment_id=12, student_id=41 — 만점)
INSERT INTO submission_omr_items (submission_id, question_num, student_answer, correct_answer, is_correct)
SELECT s.id, q.question_num, q.answer, q.answer, TRUE
FROM student_submissions s
CROSS JOIN (VALUES
    (1,'②'),(2,'③'),(3,'④'),(4,'②'),(5,'③'),
    (6,'④'),(7,'①'),(8,'①'),(9,'④'),(10,'③'),
    (11,'③'),(12,'①'),(13,'②'),(14,'②'),(15,'③')
) AS q(question_num, answer)
WHERE s.assignment_id = 12 AND s.student_id = 41;

-- ────────────────────────────────────────────────────────────
-- OCR 검토 (submission_ocr_reviews)
-- assignment_id=1, student_id=14 — OCR 인식 불가
-- ────────────────────────────────────────────────────────────
INSERT INTO submission_ocr_reviews (submission_id, review_reason, reviewer_note, is_resolved)
SELECT id, 'OCR 인식률 30% 미만 — 손글씨 흐릿. 답안 추출 실패.', '직접 채점 또는 재제출 요청 필요', FALSE
FROM student_submissions WHERE assignment_id = 1 AND student_id = 14;

-- assignment_id=9, student_id=53 — 극한 오답 OCR 검토
INSERT INTO submission_ocr_reviews (submission_id, review_reason, reviewer_note, is_resolved)
SELECT id, 'OCR로 오답 패턴 확인. 분자 처리 오류 반복.', '수업 중 직접 확인 권장', FALSE
FROM student_submissions WHERE assignment_id = 9 AND student_id = 53;

-- ────────────────────────────────────────────────────────────
-- 공통 오답 분석 (common_mistake_analyses + items)
-- ────────────────────────────────────────────────────────────

-- 과제 1 (고3 내신 미적분 A반 — 수열의 극한)
INSERT INTO common_mistake_analyses (assignment_id, weak_concept_summary, repeat_mistake_patterns, explanation_needed, top_questions) VALUES
(1,
 '["유리화 절차 — 분자·분모 동시 곱셈 후 약분 과정 자동화 필요", "최고차항 분리 — 분모 최고차항으로 나누는 순서 이해 부족", "부등식 음수 곱셈 시 방향 전환 — 반복 실수"]'::jsonb,
 '["분모 유리화 단계 생략", "부등식 방향 전환 누락 (음수 곱셈)", "치환 후 범위 재설정 빠뜨림"]'::jsonb,
 '["∞-∞ 꼴 유리화 절차 — 칠판 직접 서술 반복", "최고차항 분리법 4단계 — 순서 카드 활용 권장", "부등식 방향 전환 규칙 — 개념 교정 후 재확인"]'::jsonb,
 '["7번: ∞-∞ 유리화할 때 부호 방향", "5번: 분자 분모를 같이 나누는 순서", "13번 이후 시간 부족 — 속도 훈련 필요"]'::jsonb);

INSERT INTO common_mistake_items (analysis_id, rank, question_num, topic, mistake_type, incorrect_count, total_students)
SELECT id, rank, question_num, topic, mistake_type::mistake_type, incorrect_count, total_students
FROM common_mistake_analyses cma
CROSS JOIN (VALUES
    (1, 7,  '∞-∞ 꼴 유리화',           'calc_error'::mistake_type,        5, 6),
    (2, 3,  '분수형 극한값 계산',        'procedure_missing'::mistake_type, 4, 6),
    (3, 10, '최고차항 분리 극한',        'concept_confusion'::mistake_type, 3, 6),
    (4, 15, '부등식 방향 전환 (음수)',   'concept_confusion'::mistake_type, 3, 6),
    (5, 5,  '수렴·발산 판별',           'description_error'::mistake_type, 2, 6)
) AS v(rank, question_num, topic, mistake_type, incorrect_count, total_students)
WHERE cma.assignment_id = 1;

-- 과제 5 (고3 내신 미적분 C반 — 등비수열+점화식)
INSERT INTO common_mistake_analyses (assignment_id, weak_concept_summary, repeat_mistake_patterns, explanation_needed, top_questions) VALUES
(5,
 '["점화식 풀이 절차 — 초기 조건 설정부터 일반항까지 흐름 이해 부족", "등비수열 공비 계산 — 기계적 적용 수준 미달"]'::jsonb,
 '["점화식 → 일반항 변환 절차 혼동", "등비수열 공비를 분수로 표현할 때 부호 오류"]'::jsonb,
 '["점화식 풀이 3단계 절차 — 순서대로 칠판 연습", "등비수열 공비 계산 반복 훈련"]'::jsonb,
 '["9번: 점화식에서 공비 찾는 법", "11번 이후 심화 파트 접근 방법"]'::jsonb);

INSERT INTO common_mistake_items (analysis_id, rank, question_num, topic, mistake_type, incorrect_count, total_students)
SELECT id, rank, question_num, topic, mistake_type::mistake_type, incorrect_count, total_students
FROM common_mistake_analyses cma
CROSS JOIN (VALUES
    (1, 9,  '점화식 → 일반항 유도',    'procedure_missing'::mistake_type, 4, 3),
    (2, 12, '등비수열 공비 계산',       'calc_error'::mistake_type,        3, 3),
    (3, 14, '수열 심화 응용',           'concept_confusion'::mistake_type, 2, 3),
    (4, 6,  '점화식 초기 조건 설정',    'concept_confusion'::mistake_type, 2, 3),
    (5, 15, '극한값 연결 응용',         'description_error'::mistake_type, 2, 3)
) AS v(rank, question_num, topic, mistake_type, incorrect_count, total_students)
WHERE cma.assignment_id = 5;

-- 과제 12 (고3 수능 미적분 A반 — 실전 모의)
INSERT INTO common_mistake_analyses (assignment_id, weak_concept_summary, repeat_mistake_patterns, explanation_needed, top_questions) VALUES
(12,
 '["치환적분 범위 재설정 — 치환 후 적분 범위 변환 절차 이해 부족", "정적분 부호 처리 — 피적분함수 부호 방향 혼동"]'::jsonb,
 '["치환 후 범위 재설정 빠뜨림", "정적분 음수 구간 부호 처리 실수"]'::jsonb,
 '["치환적분 범위 변환 4단계 — 칠판 서술 연습", "정적분 넓이·부호 규칙 재확인"]'::jsonb,
 '["12번: 치환적분 범위 재설정 절차", "9번: 정적분 음수 구간 처리"]'::jsonb);

INSERT INTO common_mistake_items (analysis_id, rank, question_num, topic, mistake_type, incorrect_count, total_students)
SELECT id, rank, question_num, topic, mistake_type::mistake_type, incorrect_count, total_students
FROM common_mistake_analyses cma
CROSS JOIN (VALUES
    (1, 12, '치환적분 범위 재설정',     'procedure_missing'::mistake_type, 3, 7),
    (2, 9,  '정적분 부호 처리',         'concept_confusion'::mistake_type, 2, 7),
    (3, 7,  '부분적분 순서 선택',       'procedure_missing'::mistake_type, 2, 7),
    (4, 14, '정적분 넓이 응용',         'calc_error'::mistake_type,        2, 7),
    (5, 3,  '도함수 조건 활용',         'description_error'::mistake_type, 1, 7)
) AS v(rank, question_num, topic, mistake_type, incorrect_count, total_students)
WHERE cma.assignment_id = 12;

-- ────────────────────────────────────────────────────────────
-- 수업 반영 (lesson_reflections + individuals)
-- ────────────────────────────────────────────────────────────

-- 고3 내신 미적분 A반 — 과제 1 반영 (urgency=high)
INSERT INTO lesson_reflections (assignment_id, class_group_id, urgency, re_explain_topics, reinforcement_items, question_reflection_items, homework_follow_up) VALUES
(1, 11, 'high',
 '["∞-∞ 꼴 유리화 절차 — 7번 기반 재풀이", "최고차항 분리법 4단계 — 칠판 순서 연습", "수렴·발산 서술형 논리 흐름"]'::jsonb,
 '["분수형 극한 5문항 추가 — 유형별 반복", "부등식 방향 전환 집중 3문제", "풀이 속도 훈련 — 마지막 5문항 타이머 적용"]'::jsonb,
 '["김민주 질문 — 7번 ∞-∞ 유리화 방향 수업 초반 반드시 다루기", "임준서 질문 — 5번 분자·분모 나누기 순서 개념 정리"]'::jsonb,
 '다음 숙제는 분량 줄이고 핵심 유형 5~7문항 집중 제시');

-- 개별 피드백
INSERT INTO lesson_reflection_individuals (reflection_id, student_id, student_name, reason)
SELECT r.id, s.id, s.name, reason
FROM lesson_reflections r
CROSS JOIN (VALUES
    (21, '박서율',  '반복 미제출 — 제출 독려 + 이유 확인 필요'),
    (26, '윤수빈',  '부분 제출 — 13번 이후 개념 미흡, 개별 설명 필요'),
    (14, '신유준',  'OCR 인식 불가 — 직접 검토 또는 재제출 요청')
) AS v(student_id, student_name, reason)
JOIN students s ON s.id = v.student_id
WHERE r.assignment_id = 1;

-- 고3 내신 미적분 C반 — 과제 5 반영 (urgency=medium)
INSERT INTO lesson_reflections (assignment_id, class_group_id, urgency, re_explain_topics, reinforcement_items, question_reflection_items, homework_follow_up) VALUES
(5, 13, 'medium',
 '["점화식 풀이 3단계 절차", "등비수열 공비 계산 반복 훈련"]'::jsonb,
 '["점화식 → 일반항 5문항 집중 반복", "공비 분수형 계산 2~3문제 추가"]'::jsonb,
 '["강서연 질문 — 9번 점화식 공비 찾기 수업 중 다루기", "배하은 질문 — 11번 이후 심화 접근법 안내"]'::jsonb,
 '미제출 2명 다음 수업 전 제출 완료 확인 후 진행');

-- 개별 피드백
INSERT INTO lesson_reflection_individuals (reflection_id, student_id, student_name, reason)
SELECT r.id, s.id, s.name, reason
FROM lesson_reflections r
CROSS JOIN (VALUES
    (27, '강민준', '반복 미제출 2회 — 이유 확인 필요'),
    (32, '장하윤', '반복 미제출 2회 — 이유 확인 필요'),
    (37, '배하은', '부분 제출 — 심화 파트 접근법 개별 안내')
) AS v(student_id, student_name, reason)
JOIN students s ON s.id = v.student_id
WHERE r.assignment_id = 5;

-- 고3 수능 미적분 A반 — 과제 12 반영
INSERT INTO lesson_reflections (assignment_id, class_group_id, urgency, re_explain_topics, reinforcement_items, question_reflection_items, homework_follow_up) VALUES
(12, 17, 'medium',
 '["치환적분 범위 재설정 4단계 절차 재설명", "정적분 부호 처리 규칙 재확인"]'::jsonb,
 '["치환적분 유형 5문항 집중 반복", "정적분 넓이·부호 2~3문제 추가"]'::jsonb,
 '["정재호 질문 — 12번 치환적분 범위 절차 수업 중 다루기"]'::jsonb,
 '미제출 2명(오민재·권재윤) 다음 수업 전 제출 확인');

-- 개별 피드백
INSERT INTO lesson_reflection_individuals (reflection_id, student_id, student_name, reason)
SELECT r.id, s.id, s.name, reason
FROM lesson_reflections r
CROSS JOIN (VALUES
    (10, '오민재',  '반복 미제출 — 집중관리 학생, 면담 우선'),
    (35, '권재윤',  '미제출 + 집중관리 — 개별 확인 필요'),
    (30, '오서현',  '치환적분 범위 오답 2개 — 개별 설명 필요')
) AS v(student_id, student_name, reason)
JOIN students s ON s.id = v.student_id
WHERE r.assignment_id = 12;
