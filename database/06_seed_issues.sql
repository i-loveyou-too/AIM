-- ============================================================
-- 06_seed_issues.sql
-- 이슈 목록 — 다양한 type / urgency / status 분포
-- ============================================================

INSERT INTO issues (issue_type, urgency, status, student_id, class_group_id, title, description, occurred_at, detail)
VALUES

-- ── 긴급 이슈 ──────────────────────────────────────────────

-- 시험 임박 — 고3 내신 미적분 C반 (exam D-16)
('exam_imminent', 'critical', 'unread',
 4, 13,
 '고3 내신 미적분 C반 — 최예린 시험 D-16, 진도 미달 위험',
 '시험까지 16일 남았으나 극한 기초 단원 이제 진입. 목표 점수 달성 어려움.',
 '2025-03-25',
 '{"kind": "exam", "exam_date": "2025-04-10", "progress_status": "극한 기초 진입 (예정 대비 2단원 지연)", "needs_reinforcement": true, "needs_plan_adjust": true, "note": "치환적분 범위 오류 지속. 다음 수업 재설명 필수."}'::jsonb),

-- 공통 오답 반영 — 고3 내신 미적분 A반
('common_mistake', 'critical', 'unread',
 NULL, 11,
 '고3 내신 미적분 A반 — ∞-∞ 유리화 오답률 83%',
 '6명 중 5명이 7번 문제 오답. 다음 수업에서 재설명하지 않으면 같은 실수 반복됨.',
 '2025-03-25',
 '{"kind": "commonMistake", "top_mistake_question": "7번 — ∞-∞ 꼴 유리화", "mistake_type": "계산 실수 (분모 유리화 단계 생략)", "concept_to_re_explain": ["∞-∞ 꼴 유리화 절차 4단계", "최고차항 분리법 순서 카드", "부등식 방향 전환 음수 곱셈 개념 교정"], "today_lesson_recommendation": "수업 초반 7번 기반 재풀이 10분 배치. 칠판 서술 연습 병행."}'::jsonb),

-- 미제출 반복 — 박서율 (3회)
('unsubmitted', 'critical', 'unread',
 21, 11,
 '박서율 — 3회 연속 과제 미제출',
 '최근 3회 연속 미제출. 마감일 경과 후에도 제출 없음. 학부모 연락 또는 직접 면담 필요.',
 '2025-03-25',
 '{"kind": "unsubmitted", "assignment_title": "수열의 극한 — 기본 계산 20문항", "due_date": "2025-03-25", "missed_count": 3, "teacher_memo": "지난 주부터 수업 참여도도 낮아짐. 외부 요인 파악 필요.", "next_action": "다음 수업 전 개별 면담 또는 학부모 연락"}'::jsonb),

-- OCR 검토 필요 — 신유준
('ocr_review', 'critical', 'unread',
 14, 11,
 '신유준 — OCR 인식 불가, 직접 검토 필요',
 '사진 3장 제출했으나 손글씨 흐릿. OCR 결과 신뢰 불가. 직접 채점 또는 재제출 요청.',
 '2025-03-25',
 '{"kind": "ocr", "assignment_title": "수열의 극한 — 기본 계산 20문항", "submitted_at": "2025-03-26 08:30", "ocr_summary": "사진 3장 제출 — 손글씨 인식률 30% 미만. 답안 추출 실패.", "review_reason": "직접 검토 또는 재제출 요청 필요. 점수 미반영 상태."}'::jsonb),

-- 시험 임박 + 진도 미달 — 임지안 (고3 수능 B반)
('exam_imminent', 'critical', 'unread',
 28, 18,
 '임지안 — 수능 대비반 급수 단원 미완, 시험 D-8 (중간고사)',
 '중간고사 D-8. 급수·극한 단원 35% 미완. 보강 즉시 배치 필요.',
 '2025-03-25',
 '{"kind": "exam", "exam_date": "2025-04-02", "progress_status": "급수·극한 35% 미완 (예정 대비 2주 지연)", "needs_reinforcement": true, "needs_plan_adjust": true, "note": "숙제 제출률 50%. 보강 우선 배치 필요."}'::jsonb),

-- ── 높음 이슈 ──────────────────────────────────────────────

-- 질문 있음 — 김민주
('question', 'high', 'unread',
 1, 11,
 '김민주 — ∞-∞ 유리화 방향 질문',
 '7번 문제에서 유리화할 때 부호 방향 헷갈린다는 질문. 다음 수업 초반에 반드시 다뤄야 함.',
 '2025-03-25',
 '{"kind": "question", "question_text": "7번 문제에서 ∞-∞ 형태를 유리화할 때 부호 방향이 헷갈려요.", "related_unit": "수열의 극한 — ∞-∞ 꼴", "assignment_title": "수열의 극한 — 기본 계산 20문항", "needs_in_class_explanation": true}'::jsonb),

-- 질문 있음 — 임준서
('question', 'high', 'unread',
 8, 11,
 '임준서 — 분자·분모 나누기 순서 질문',
 '5번 OMR 오답 후 질문 남김. 분자 분모를 나누는 순서에 대한 개념 혼동.',
 '2025-03-25',
 '{"kind": "question", "question_text": "5번이 왜 ①이 아닌지 이해가 안 돼요. 분자 분모를 같이 나누는 거 아닌가요?", "related_unit": "분수형 극한값 계산", "assignment_title": "수열의 극한 — 기본 계산 20문항", "needs_in_class_explanation": true}'::jsonb),

-- 미제출 — 강민준 (2회)
('unsubmitted', 'high', 'unread',
 27, 13,
 '강민준 — 2회 연속 과제 미제출 (미적분 C반)',
 '수학 C반 이번 과제 미제출. 지난 주에도 미제출. 개별 확인 필요.',
 '2025-03-24',
 '{"kind": "unsubmitted", "assignment_title": "등비수열 심화 + 점화식 — 15문항", "due_date": "2025-03-27", "missed_count": 2, "teacher_memo": "지난 주 이유 미파악. 다음 수업 전 확인 요망.", "next_action": "다음 수업 전 개별 연락"}'::jsonb),

-- OMR 오답 다수 — 박지호
('omr_many_wrong', 'high', 'unread',
 3, 11,
 '박지호 — OMR 정답률 60% (10문항 중 6개)',
 '3번·5번·7번·10번 오답. 극한값 계산 유형에서 반복 오류 패턴.',
 '2025-03-25',
 '{"kind": "unsubmitted", "assignment_title": "수열의 극한 — 기본 계산 20문항", "due_date": "2025-03-25", "missed_count": 0, "teacher_memo": "3번·5번·7번·10번 오답 집중. 개념 이해보다 절차 혼동.", "next_action": "다음 수업 해당 유형 개별 확인"}'::jsonb),

-- 집중 관리 — 오민재
('focus_management', 'high', 'acknowledged',
 10, 17,
 '오민재 — 반복 미제출 + 수업 태도 저하',
 '3회 연속 미제출. 수업 중 딴짓 관찰. 외부 요인 파악 필요. 학부모 연락 완료.',
 '2025-03-22',
 '{"kind": "focus", "reasons": ["3회 연속 미제출", "수업 집중도 저하", "학부모 연락 완료"], "recent_trend": "최근 3주 참여도 하락. 성취도도 감소.", "teacher_note": "다음 수업 집중 관찰. 면담 일정 잡기."}'::jsonb),

-- 진도 지연 — 김민주
('progress_delay', 'high', 'acknowledged',
 1, 11,
 '김민주 — 진도 계획 대비 1단원 지연',
 '미분법 응용 단원 1회 추가 소요. 현재 예정보다 1단원 뒤처진 상태.',
 '2025-03-22',
 '{"kind": "progress", "planned_unit": "미분법 응용 (3/22 완료 예정)", "actual_unit": "미분법 기초 진행 중", "delay_weeks": 1, "reason": "미분 기초에서 추가 1회 소요", "adjustment_needed": "계획 1주 재조정. 시험 전 핵심 범위 우선 설정."}'::jsonb),

-- ── 중간 이슈 ──────────────────────────────────────────────

-- 질문 있음 — 강서연 (점화식)
('question', 'medium', 'unread',
 7, 13,
 '강서연 — 점화식 공비 찾기 질문',
 '9번 점화식에서 공비를 어떻게 찾는지 모르겠다는 질문.',
 '2025-03-24',
 '{"kind": "question", "question_text": "9번 점화식에서 공비를 어떻게 찾는 건지 모르겠어요.", "related_unit": "등비수열 — 공비 계산", "assignment_title": "등비수열 심화 + 점화식 — 15문항", "needs_in_class_explanation": true}'::jsonb),

-- 집중 관리 — 윤수빈 (부분 제출 + 속도 부족)
('focus_management', 'medium', 'acknowledged',
 26, 11,
 '윤수빈 — 부분 제출 + 풀이 속도 부족',
 '13번 이후 시간 부족으로 부분 제출. 심화 파트 개념 미흡. 개별 설명 1회 필요.',
 '2025-03-25',
 '{"kind": "focus", "reasons": ["부분 제출 — 13번 이후 미완성", "풀이 속도 부족", "심화 파트 개념 미흡"], "recent_trend": "최근 2주 완성도 낮아지는 추세", "teacher_note": "다음 수업 13번 이후 유형 개별 설명. 분량 조절 고려."}'::jsonb),

-- 시험 임박 — 정소연 (수능 공통+미적분 A반 → 내신 준비)
('exam_imminent', 'medium', 'unread',
 64, 15,
 '정소연 — 고2 내신 D-29, 삼각함수 파트 미흡',
 '최근 삼각함수 그래프 단원 오답 반복. 시험 전 집중 보강 권장.',
 '2025-03-24',
 '{"kind": "exam", "exam_date": "2025-04-23", "progress_status": "함수 극한 진입. 삼각함수 그래프 복습 필요", "needs_reinforcement": true, "needs_plan_adjust": false, "note": "수능반 병행 중. 내신 집중도 분산."}'::jsonb),

-- 진도 지연 — 고3 내신 미적분 C반 전체
('progress_delay', 'medium', 'acknowledged',
 NULL, 13,
 '고3 내신 미적분 C반 — 미제출 2명으로 진도 조율 필요',
 '강민준·장하윤 미제출로 다음 수업 진도 진행 전 제출 완료 확인 필요.',
 '2025-03-24',
 '{"kind": "progress", "planned_unit": "극한과 연속 (3/27 계속 예정)", "actual_unit": "점화식 심화 마무리 중", "delay_weeks": 0, "reason": "미제출 2명 처리 후 다음 단원 진입", "adjustment_needed": "다음 수업 전 미제출 완료 확인 후 진도 여부 결정"}'::jsonb),

-- OCR 검토 — 신하윤 (고2 미적분 A반)
('ocr_review', 'medium', 'unread',
 53, 6,
 '신하윤 — 극한 오답 OCR 검토 필요',
 '3번 분자 처리 오류 OCR로 확인됨. 수업 중 직접 설명 권장.',
 '2025-03-26',
 '{"kind": "ocr", "assignment_title": "함수의 극한 — 기본 20문항", "submitted_at": "2025-03-26 22:00", "ocr_summary": "3번·7번 극한값 계산 오류. 분자 0 처리 혼동.", "review_reason": "수업 중 직접 설명 권장"}'::jsonb),

-- ── 낮음 이슈 ──────────────────────────────────────────────

-- 계획 조정 필요 — 고3 내신 미적분 B반
('plan_adjustment', 'low', 'acknowledged',
 NULL, 12,
 '고3 내신 미적분 B반 — 급수 파트 1주 늦춤 계획 조정',
 '등비수열 심화 1회 추가로 급수 파트 진입 1주 지연. 조정 완료.',
 '2025-03-20',
 '{"kind": "progress", "planned_unit": "급수 파트 (3/20 시작 예정)", "actual_unit": "등비수열 심화 진행 중", "delay_weeks": 1, "reason": "등비수열 심화 이해도 개인차 큼", "adjustment_needed": "계획 1주 수정. 시험 일정 내 완성 가능."}'::jsonb),

-- 질문 있음 — 배다은 (고2 미적분 A반)
('question', 'low', 'unread',
 76, 6,
 '배다은 — 16번 이후 ε-δ 논법 질문',
 '16번 이후 ε-δ 논법 부분이 어렵다는 질문. 심화 파트 선택적 설명 고려.',
 '2025-03-26',
 '{"kind": "question", "question_text": "16번 이후 ε-δ 논법 부분이 어려워요.", "related_unit": "함수의 극한 — ε-δ 논법", "assignment_title": "함수의 극한 — 기본 20문항", "needs_in_class_explanation": false}'::jsonb),

-- 집중 관리 — 박지훈 (고2 수능 확통반)
('focus_management', 'medium', 'unread',
 60, 16,
 '박지훈 — 3회 연속 미제출 (집중 관리 시작)',
 '고2 수능반 3회 연속 미제출. 집중관리 시작. 주 2회 체크인 진행 예정.',
 '2025-03-23',
 '{"kind": "focus", "reasons": ["3회 연속 미제출", "수업 불규칙 참여"], "recent_trend": "입학 초기보다 의욕 저하 관찰", "teacher_note": "주 2회 체크인 시작. 학부모 연락 여부 고려."}'::jsonb),

-- OMR 오답 다수 — 정재호 (수능 미적분 A반)
('omr_many_wrong', 'medium', 'unread',
 45, 17,
 '정재호 — OMR 정답률 73% (15문항 중 11개)',
 '12번·3번 오답. 치환적분 범위 재설정 패턴 반복.',
 '2025-03-24',
 '{"kind": "unsubmitted", "assignment_title": "미적분 실전 모의 — 15문항", "due_date": "2025-03-24", "missed_count": 0, "teacher_memo": "12번 치환 범위 재설정. 3번 도함수 조건 오류.", "next_action": "다음 수업 치환적분 절차 재확인"}'::jsonb),

-- 미제출 — 권재윤 (수능 A반)
('unsubmitted', 'high', 'unread',
 35, 17,
 '권재윤 — 수능 A반 과제 미제출 + 집중 관리',
 '수능 모의 과제 미제출. 집중 관리 학생. 다음 수업 전 개별 확인 필요.',
 '2025-03-24',
 '{"kind": "unsubmitted", "assignment_title": "미적분 실전 모의 — 15문항", "due_date": "2025-03-24", "missed_count": 2, "teacher_memo": "집중관리 학생. 지각·미제출 반복 패턴.", "next_action": "개별 면담 + 학부모 연락"}'::jsonb),

-- 공통 오답 — 고3 내신 미적분 C반
('common_mistake', 'high', 'unread',
 NULL, 13,
 '고3 내신 미적분 C반 — 점화식→일반항 오답률 높음',
 '3명 중 4문항 오답 집중. 다음 수업 절차 재설명 필수.',
 '2025-03-24',
 '{"kind": "commonMistake", "top_mistake_question": "9번 — 점화식 → 일반항 유도", "mistake_type": "절차 누락", "concept_to_re_explain": ["점화식 풀이 3단계 절차", "등비수열 공비 계산", "초기 조건 설정"], "today_lesson_recommendation": "수업 초반 점화식 절차 카드 활용 10분 연습."}'::jsonb);

-- ────────────────────────────────────────────────────────────
-- 이슈 요약 조회 예시 쿼리
-- ────────────────────────────────────────────────────────────

/*
-- 1. 전체 이슈 요약 (상태별 카운트)
SELECT
    status,
    COUNT(*) AS issue_count,
    COUNT(*) FILTER (WHERE urgency = 'critical') AS critical_count,
    COUNT(*) FILTER (WHERE urgency = 'high')     AS high_count,
    COUNT(*) FILTER (WHERE urgency = 'medium')   AS medium_count,
    COUNT(*) FILTER (WHERE urgency = 'low')      AS low_count
FROM issues
GROUP BY status
ORDER BY status;

-- 2. 미확인 이슈 목록 (긴급도 순)
SELECT
    i.id,
    i.issue_type,
    i.urgency,
    s.name AS student_name,
    cg.class_name,
    i.title,
    i.occurred_at
FROM issues i
LEFT JOIN students  s  ON i.student_id     = s.id
LEFT JOIN class_groups cg ON i.class_group_id = cg.id
WHERE i.status = 'unread'
ORDER BY
    CASE i.urgency WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END,
    i.occurred_at DESC;

-- 3. 반복 미제출 학생 조회
SELECT
    s.name,
    cg.class_name,
    (i.detail->>'missed_count')::int AS missed_count,
    i.detail->>'next_action'         AS next_action,
    i.occurred_at
FROM issues i
JOIN students s     ON i.student_id     = s.id
JOIN class_groups cg ON i.class_group_id = cg.id
WHERE i.issue_type = 'unsubmitted'
  AND (i.detail->>'missed_count')::int >= 2
ORDER BY missed_count DESC;

-- 4. 시험 임박 학생 목록
SELECT
    s.name,
    cg.class_name,
    i.detail->>'exam_date'         AS exam_date,
    i.detail->>'progress_status'   AS progress_status,
    (i.detail->>'needs_reinforcement')::boolean AS needs_reinforcement,
    i.urgency,
    i.occurred_at
FROM issues i
JOIN students s       ON i.student_id     = s.id
JOIN class_groups cg  ON i.class_group_id = cg.id
WHERE i.issue_type = 'exam_imminent'
  AND i.status != 'resolved'
ORDER BY (i.detail->>'exam_date')::date;

-- 5. 오늘 수업 반영이 필요한 이슈 (공통 오답 + 질문)
SELECT
    cg.class_name,
    i.issue_type,
    i.urgency,
    i.title,
    i.detail->>'today_lesson_recommendation' AS lesson_rec,
    i.detail->>'question_text'               AS question_text
FROM issues i
JOIN class_groups cg ON i.class_group_id = cg.id
WHERE i.issue_type IN ('common_mistake', 'question')
  AND i.status = 'unread'
ORDER BY cg.class_name, i.urgency;

-- 6. 집중 관리 학생 목록
SELECT
    s.name,
    cg.class_name,
    i.detail->'reasons'         AS reasons,
    i.detail->>'recent_trend'   AS recent_trend,
    i.detail->>'teacher_note'   AS teacher_note,
    i.status,
    i.occurred_at
FROM issues i
JOIN students s       ON i.student_id     = s.id
JOIN class_groups cg  ON i.class_group_id = cg.id
WHERE i.issue_type = 'focus_management'
ORDER BY i.urgency, i.occurred_at DESC;

-- 7. 반별 이슈 카운트 요약
SELECT
    cg.class_name,
    COUNT(*) AS total_issues,
    COUNT(*) FILTER (WHERE i.status = 'unread')     AS unread,
    COUNT(*) FILTER (WHERE i.urgency = 'critical')  AS critical,
    COUNT(*) FILTER (WHERE i.issue_type = 'unsubmitted') AS unsubmitted
FROM issues i
JOIN class_groups cg ON i.class_group_id = cg.id
GROUP BY cg.id, cg.class_name
ORDER BY critical DESC, unread DESC;
*/
