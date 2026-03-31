-- ============================================================
-- 03_seed_students.sql
-- 학생 데이터 — 120명 이상
-- status 분포: stable(40%) / rising(25%) / warning(20%) / urgent(10%) / focus(5%)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- students 삽입
-- school_id: 1=서울고 2=강남고 3=서초고 4=청운고 5=수서고
--            6=한빛고 7=대치고 8=압구정고 9=목동고 10=잠실고
-- ────────────────────────────────────────────────────────────

INSERT INTO students (student_code, name, school_id, grade, status, note) VALUES
-- ── 고3 학생 (45명) ──────────────────────────────────────────
('AIM_24001', '김민주', 1, 'grade3', 'rising',  '최근 2주 함수·미분 성취도 빠르게 상승. 시험 전 응용 마무리 필요.'),
('AIM_24002', '이서준', 1, 'grade3', 'urgent',  '기본 문제 안정적이나 시험 전 서술형 마무리 필요.'),
('AIM_24003', '박지호', 2, 'grade3', 'stable',  '전반적으로 안정적. 급수 단원 복습 한 번 더 필요.'),
('AIM_24004', '최예린', 2, 'grade3', 'warning', '미적분 응용 단원에서 반복 실수. 수업 집중 보강 요망.'),
('AIM_24005', '정하늘', 3, 'grade3', 'stable',  '확률과 통계 단원 마무리 단계. 심화 문제 정확도 높음.'),
('AIM_24006', '윤도현', 3, 'grade3', 'rising',  '수능 모의 점수 꾸준히 상승 중. 이번 주 기하 진입.'),
('AIM_24007', '강서연', 4, 'grade3', 'warning', '진도는 유지되나 숙제 제출률 낮음. 집중 확인 필요.'),
('AIM_24008', '임준서', 4, 'grade3', 'stable',  '공통수학 영역 완성. 선택과목 전환 시기.'),
('AIM_24009', '한지수', 5, 'grade3', 'urgent',  '시험까지 D-12. 극한 단원 미완. 보강 일정 조율 필요.'),
('AIM_24010', '오민재', 5, 'grade3', 'focus',   '3회 연속 미제출. 수업 집중도도 낮아짐. 면담 필요.'),
('AIM_24011', '서하린', 6, 'grade3', 'stable',  '수능 대비 실전 모의 정답률 78%. 안정적으로 유지 중.'),
('AIM_24012', '장예찬', 6, 'grade3', 'rising',  '미적분 치환적분 이후 점수 상승. 마무리 단계.'),
('AIM_24013', '문채원', 7, 'grade3', 'warning', '진도 지연 1.5단원. 시험 전 핵심 범위 재조정 권장.'),
('AIM_24014', '신유준', 7, 'grade3', 'stable',  '풀이 속도·정확도 모두 양호. 상위권 유지 중.'),
('AIM_24015', '권도윤', 8, 'grade3', 'rising',  '확률과통계 심화 완성. 최근 2주 오답 수 감소.'),
('AIM_24016', '류하은', 8, 'grade3', 'warning', '미적분 응용 오답 반복. 개념 재정리 필요.'),
('AIM_24017', '배준혁', 9, 'grade3', 'stable',  '수능 모의 원점수 88점. 선택과목 완성도 높음.'),
('AIM_24018', '전지원', 9, 'grade3', 'urgent',  '목표 점수 대비 현재 17점 부족. 집중 보강 필수.'),
('AIM_24019', '홍소연', 10,'grade3', 'stable',  '리듬감 있게 진도 유지. 약점 주제 자가 보완 잘 됨.'),
('AIM_24020', '조현우', 10,'grade3', 'rising',  '등비수열 이후 꾸준한 상승세. 합격 가능성 높아짐.'),
('AIM_24021', '박서율', 1, 'grade3', 'stable',  '수능 미적분 파트 전반 안정적. 응용 마무리 중.'),
('AIM_24022', '김도은', 2, 'grade3', 'focus',   '반복 오답 패턴 지속. 개별 보충 수업 배치 필요.'),
('AIM_24023', '이찬희', 3, 'grade3', 'warning', '숙제는 잘 하나 시험 준비도 낮음. 실전 훈련 보강.'),
('AIM_24024', '최민서', 4, 'grade3', 'stable',  '공통수학 완성. 선택과목 기하 A반 이동 예정.'),
('AIM_24025', '정유진', 5, 'grade3', 'rising',  '미적분 치환·부분 적분 정복 후 급상승.'),
('AIM_24026', '윤수빈', 6, 'grade3', 'stable',  '확통 A반 최상위권. 목표 점수 초과 달성 중.'),
('AIM_24027', '강민준', 7, 'grade3', 'warning', '개념 이해는 있으나 실전 문제에서 실수 반복.'),
('AIM_24028', '임지안', 8, 'grade3', 'urgent',  '시험 D-8. 극한·급수 범위 70% 미완. 긴급 보강.'),
('AIM_24029', '한규민', 9, 'grade3', 'stable',  '수능 모의 성적 꾸준. 취약 단원 스스로 보완 중.'),
('AIM_24030', '오서현', 10,'grade3', 'rising',  '기하 파트 진입 후 성취도 급상승. 집중력 우수.'),
('AIM_24031', '서준혁', 1, 'grade3', 'stable',  '전반적으로 균형 잡힌 학습 패턴.'),
('AIM_24032', '장하윤', 2, 'grade3', 'warning', '서술형 답안 논리 구성 약함. 다음 수업 중점 보완.'),
('AIM_24033', '문준서', 3, 'grade3', 'stable',  '확통 B반 평균 이상. 꾸준한 상승 기대.'),
('AIM_24034', '신아린', 4, 'grade3', 'rising',  '미적분 속도·정확도 모두 향상. 상위반 이동 검토.'),
('AIM_24035', '권재윤', 5, 'grade3', 'focus',   '잦은 지각 + 미제출 2회. 학부모 연락 필요.'),
('AIM_24036', '류예원', 6, 'grade3', 'stable',  '수능 모의 안정적 유지. 실전 감각 좋음.'),
('AIM_24037', '배하은', 7, 'grade3', 'warning', '기하 파트 개념 혼동 반복. 1회 추가 설명 필요.'),
('AIM_24038', '전민찬', 8, 'grade3', 'stable',  '공통수학 90점대 안정. 선택 준비 순조로움.'),
('AIM_24039', '홍도현', 9, 'grade3', 'urgent',  '목표 점수 90, 현재 72. 6주 안에 격차 좁혀야 함.'),
('AIM_24040', '조서연', 10,'grade3', 'stable',  '꾸준한 제출과 질문. 모범적 학습 태도 유지.'),
('AIM_24041', '박민혁', 1, 'grade3', 'rising',  '최근 3회 연속 만점 근접. 모의 최고점 갱신 중.'),
('AIM_24042', '김소율', 2, 'grade3', 'warning', '진도 지연 2단원. 커리큘럼 재조정 논의 필요.'),
('AIM_24043', '이준혁', 3, 'grade3', 'stable',  '수능 기하 파트 전반 안정. 심화 문제 집중 중.'),
('AIM_24044', '최다은', 4, 'grade3', 'stable',  'OMR 정답률 88%. 실수 유형 거의 사라짐.'),
('AIM_24045', '정재호', 5, 'grade3', 'rising',  '확통 파트 완성 후 모의 점수 8점 상승.'),

-- ── 고2 학생 (48명) ──────────────────────────────────────────
('AIM_24046', '강지은', 1, 'grade2', 'stable',  '미적분 기초 단계 안정적으로 이수 중.'),
('AIM_24047', '임서윤', 2, 'grade2', 'rising',  '수학2 연속 고득점. 미적분 파트 진입 준비.'),
('AIM_24048', '한정민', 3, 'grade2', 'warning', '확통 단원 오답 반복. 개념 재확인 필요.'),
('AIM_24049', '오채린', 4, 'grade2', 'stable',  '내신 수학1 기초 완성. 수학2 전환 시점.'),
('AIM_24050', '서도윤', 5, 'grade2', 'urgent',  '내신 D-10. 지수·로그 범위 미완.'),
('AIM_24051', '장아름', 6, 'grade2', 'stable',  '기하 파트 이해도 높음. 심화 가능.'),
('AIM_24052', '문서준', 7, 'grade2', 'warning', '미적분 극한값 계산 반복 오류.'),
('AIM_24053', '신하윤', 8, 'grade2', 'rising',  '최근 3회 평균 +7점 상승. 집중력 향상.'),
('AIM_24054', '권지현', 9, 'grade2', 'stable',  '수학2 중단원 마무리. 숙제 제출률 100%.'),
('AIM_24055', '류민지', 10,'grade2', 'warning', '수업 이해는 있으나 혼자 풀 때 흔들림.'),
('AIM_24056', '배수현', 1, 'grade2', 'stable',  '확통 B반 꾸준 상위권. 안정 유지.'),
('AIM_24057', '전예은', 2, 'grade2', 'rising',  '기하 파트 이해 빠름. 상위반 이동 고려.'),
('AIM_24058', '홍민재', 3, 'grade2', 'urgent',  '시험 D-7. 삼각함수 범위 절반 미완.'),
('AIM_24059', '조하린', 4, 'grade2', 'stable',  '미적분 B반. 꾸준한 제출·참여.'),
('AIM_24060', '박지훈', 5, 'grade2', 'focus',   '미제출 3회 연속. 집중관리 시작.'),
('AIM_24061', '김서아', 6, 'grade2', 'stable',  '수학1 A반 상위권. 수학2 선행 준비.'),
('AIM_24062', '이태준', 7, 'grade2', 'warning', '수업 중 이해하나 복습 안 함. 오답 반복.'),
('AIM_24063', '최지훈', 8, 'grade2', 'stable',  '기하 이해도 우수. 증명 문제 추가 연습 중.'),
('AIM_24064', '정소연', 9, 'grade2', 'rising',  '수능반 전환 후 성취도 급상승.'),
('AIM_24065', '윤태민', 10,'grade2', 'warning', '확통 개념 설명 후 적용에서 막힘.'),
('AIM_24066', '강채원', 1, 'grade2', 'stable',  '미적분 A반 중상위권. 안정적 학습 패턴.'),
('AIM_24067', '임도연', 2, 'grade2', 'rising',  '내신 수학1 완성 후 미적분 선행 시작.'),
('AIM_24068', '한성민', 3, 'grade2', 'stable',  '기하 파트 완성. 증명 문제 여전히 강점.'),
('AIM_24069', '오재현', 4, 'grade2', 'warning', '미적분 치환 범위 설정 오류 반복.'),
('AIM_24070', '서예린', 5, 'grade2', 'stable',  '확통 A반. 조합·확률 단원 우수.'),
('AIM_24071', '장재훈', 6, 'grade2', 'rising',  '수능반 전환 3주 만에 적응 완료.'),
('AIM_24072', '문지아', 7, 'grade2', 'warning', '삼각함수 공식 암기 불완전. 반복 오답 패턴.'),
('AIM_24073', '신준호', 8, 'grade2', 'stable',  '기하 파트 심화까지 도달. 상위권 유지.'),
('AIM_24074', '권서연', 9, 'grade2', 'stable',  '수학2 B반. 적분 기초 완성. 꾸준히 진행 중.'),
('AIM_24075', '류지호', 10,'grade2', 'urgent',  '내신 D-9. 급수·미적분 범위 절반 미달.'),
('AIM_24076', '배다은', 1, 'grade2', 'stable',  '미적분 A반. 정적분 응용 파트 진입.'),
('AIM_24077', '전소희', 2, 'grade2', 'rising',  '확통 완성 후 미적분 파트 속도 붙음.'),
('AIM_24078', '홍준석', 3, 'grade2', 'warning', '수업 빠짐 1회 + 미제출 1회. 모니터링 필요.'),
('AIM_24079', '조민수', 4, 'grade2', 'stable',  '내신 수학1. 삼각함수까지 안정 완성.'),
('AIM_24080', '박하린', 5, 'grade2', 'warning', '이차함수 이후 진도 지연. 보강 일정 논의.'),
('AIM_24081', '김예준', 6, 'grade2', 'stable',  '수능 공통 파트 80% 완성. 선택과목 준비 중.'),
('AIM_24082', '이서율', 7, 'grade2', 'rising',  '지난 달 대비 숙제 제출률 +20%. 의지 향상.'),
('AIM_24083', '최재원', 8, 'grade2', 'stable',  '기하 B반. 꾸준한 상위권.'),
('AIM_24084', '정하은', 9, 'grade2', 'warning', '확통 순열·조합 단원 반복 실수.'),
('AIM_24085', '윤민호', 10,'grade2', 'focus',   '진도 지연 + 질문 없음. 집중 관리 시작.'),
('AIM_24086', '강준영', 1, 'grade2', 'stable',  '내신 미적분 A반. 고득점 유지 중.'),
('AIM_24087', '임채연', 2, 'grade2', 'rising',  '최근 4회 연속 평균 이상. 상승 추세 강함.'),
('AIM_24088', '한도윤', 3, 'grade2', 'warning', '수능반 공통 파트 오답 반복. 집중 확인.'),
('AIM_24089', '오시현', 4, 'grade2', 'stable',  '기하 A반. 공간 감각 우수. 심화 도달.'),
('AIM_24090', '서재민', 5, 'grade2', 'stable',  '확통 B반. 조건부 확률 완성. 안정적.'),
('AIM_24091', '장도현', 6, 'grade2', 'rising',  '미적분 A반. 치환 적분 완성 후 급상승.'),
('AIM_24092', '문혜린', 7, 'grade2', 'warning', '수학2 서술형 점수 낮음. 풀이 논리 보완 필요.'),
('AIM_24093', '신성호', 8, 'grade2', 'stable',  '기하 B반. 벡터 파트 완성. 순조로운 진도.'),

-- ── 고1 학생 (32명) ──────────────────────────────────────────
('AIM_24094', '권아린', 9, 'grade1', 'rising',  '수학1 A반. 다항함수 완성. 꾸준한 성장세.'),
('AIM_24095', '류태윤', 10,'grade1', 'stable',  '수학1 기초 안정. 중단원 마무리 단계.'),
('AIM_24096', '배지현', 1, 'grade1', 'warning', '수학1 함수 단원 오답 반복. 추가 설명 필요.'),
('AIM_24097', '전도연', 2, 'grade1', 'stable',  '수학2 B반. 수열 파트 이해도 높음.'),
('AIM_24098', '홍수진', 3, 'grade1', 'rising',  '최근 2회 연속 90점 이상. 수학1 완성 단계.'),
('AIM_24099', '조민아', 4, 'grade1', 'stable',  '수학1 B반. 지수·로그 완성. 안정적 진도.'),
('AIM_24100', '박서연', 5, 'grade1', 'warning', '수학2 진도 지연. 수열 전 범위 미완.'),
('AIM_24101', '김준혁', 6, 'grade1', 'stable',  '수학1 A반 상위권. 심화 문제 도전 중.'),
('AIM_24102', '이아린', 7, 'grade1', 'rising',  '최근 개념 정리 후 빠른 속도 향상.'),
('AIM_24103', '최예은', 8, 'grade1', 'stable',  '수학2 A반. 꾸준한 제출·참여.'),
('AIM_24104', '정민준', 9, 'grade1', 'warning', '수학1 이차방정식 파트 반복 오답.'),
('AIM_24105', '윤서현', 10,'grade1', 'stable',  '수학2 B반. 수열 심화 도달. 안정적.'),
('AIM_24106', '강민서', 1, 'grade1', 'rising',  '수학1 완성. 수학2 선행 시작.'),
('AIM_24107', '임지은', 2, 'grade1', 'focus',   '미제출 2회. 수업 집중도 낮음. 집중관리.'),
('AIM_24108', '한예진', 3, 'grade1', 'stable',  '수학1 A반. 함수 심화 도달.'),
('AIM_24109', '오성민', 4, 'grade1', 'warning', '수학1 집합·명제 파트 혼동.'),
('AIM_24110', '서지윤', 5, 'grade1', 'stable',  '수학2 A반. 꾸준히 상위권 유지.'),
('AIM_24111', '장현우', 6, 'grade1', 'rising',  '수학1 연속 2회 만점. 우수 학생.'),
('AIM_24112', '문채은', 7, 'grade1', 'stable',  '수학2 B반. 등차수열 완성 단계.'),
('AIM_24113', '신도현', 8, 'grade1', 'warning', '수학1 함수 합성 파트 이해 미흡.'),
('AIM_24114', '권재민', 9, 'grade1', 'stable',  '수학1 B반. 꾸준한 발전세.'),
('AIM_24115', '류서아', 10,'grade1', 'rising',  '최근 4회 평균 5점 상승. 집중력 향상.'),
('AIM_24116', '배준서', 1, 'grade1', 'stable',  '수학1 A반. 이차함수 완성. 다음 단원 준비.'),
('AIM_24117', '전하윤', 2, 'grade1', 'warning', '수학2 수열 파트 개념 불명확.'),
('AIM_24118', '홍지민', 3, 'grade1', 'stable',  '수학1 B반. 지수함수 완성.'),
('AIM_24119', '조예린', 4, 'grade1', 'rising',  '최근 수학1 파트 급성장. 상위권 진입 중.'),
('AIM_24120', '박태준', 5, 'grade1', 'stable',  '수학2 B반. 안정적 학습 태도.'),
('AIM_24121', '김소현', 6, 'grade1', 'warning', '수학1 로그 계산 실수 반복.'),
('AIM_24122', '이도준', 7, 'grade1', 'stable',  '수학2 A반. 등비수열 완성. 빠른 진도.'),
('AIM_24123', '최서영', 8, 'grade1', 'stable',  '수학1 A반. 상위권 안정.'),
('AIM_24124', '정민서', 9, 'grade1', 'rising',  '함수 파트 이후 빠른 성장.'),
('AIM_24125', '윤지훈', 10,'grade1', 'warning', '수학1 집합 단원 이해 부족. 반복 설명 필요.');

-- ────────────────────────────────────────────────────────────
-- enrollments (학생-반 수강 배정)
-- class_groups id 참고:
--   1=고1내신수학1A, 2=고1내신수학1B, 3=고1내신수학2A, 4=고1내신수학2B
--   5=고2내신수학1A, 6=고2내신미적분A, 7=고2내신미적분B
--   8=고2내신확통A,  9=고2내신확통B,  10=고2내신기하A
--   11=고3내신미적분A, 12=고3내신미적분B, 13=고3내신미적분C, 14=고3내신확통A
--   15=고2수능공통+미적분A, 16=고2수능공통+확통B
--   17=고3수능공통+미적분A, 18=고3수능공통+미적분B
--   19=고3수능공통+기하A, 20=고3수능공통+확통A, 21=고3수능공통+확통B
-- ────────────────────────────────────────────────────────────

-- 고3 내신 미적분 A반 (class_group_id=11) — 상위권 학생들
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (1,  11), -- 김민주
    (3,  11), -- 박지호
    (5,  11), -- 정하늘
    (8,  11), -- 임준서
    (14, 11), -- 신유준
    (17, 11), -- 배준혁
    (21, 11), -- 박서율
    (26, 11); -- 윤수빈

-- 고3 내신 미적분 B반 (class_group_id=12) — 중간~중상위
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (2,  12), -- 이서준
    (6,  12), -- 윤도현
    (12, 12), -- 장예찬
    (15, 12), -- 권도윤
    (20, 12), -- 조현우
    (25, 12), -- 정유진
    (31, 12), -- 서준혁
    (34, 12); -- 신아린

-- 고3 내신 미적분 C반 (class_group_id=13) — 보강 필요 학생들
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (4,  13), -- 최예린
    (7,  13), -- 강서연
    (16, 13), -- 류하은
    (27, 13), -- 강민준
    (32, 13), -- 장하윤
    (37, 13), -- 배하은
    (42, 13); -- 김소율

-- 고3 내신 확통 A반 (class_group_id=14)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (11, 14), -- 서하린
    (13, 14), -- 문채원
    (19, 14), -- 홍소연
    (23, 14), -- 이찬희
    (33, 14), -- 문준서
    (36, 14), -- 류예원
    (40, 14), -- 조서연
    (44, 14); -- 최다은

-- 고3 수능 공통+미적분 A반 (class_group_id=17) — 최상위
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (10, 17), -- 오민재  (focus 학생 포함)
    (18, 17), -- 전지원
    (24, 17), -- 최민서
    (30, 17), -- 오서현
    (35, 17), -- 권재윤 (focus)
    (38, 17), -- 전민찬
    (41, 17), -- 박민혁
    (43, 17), -- 이준혁
    (45, 17); -- 정재호(수능반)

-- 고3 수능 공통+미적분 B반 (class_group_id=18)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (9,  18), -- 한지수
    (22, 18), -- 김도은 (focus)
    (28, 18), -- 임지안
    (29, 18), -- 한규민
    (39, 18); -- 홍도현

-- 고3 수능 공통+기하 A반 (class_group_id=19)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (24, 19), -- 최민서
    (43, 19); -- 이준혁

-- 고2 내신 미적분 A반 (class_group_id=6)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (46, 6),  -- 강지은
    (47, 6),  -- 임서윤
    (53, 6),  -- 신하윤
    (54, 6),  -- 권지현
    (61, 6),  -- 김서아
    (66, 6),  -- 강채원
    (76, 6),  -- 배다은
    (77, 6),  -- 전소희
    (86, 6),  -- 강준영
    (91, 6);  -- 장도현

-- 고2 내신 미적분 B반 (class_group_id=7)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (48, 7),  -- 한정민
    (52, 7),  -- 문서준
    (55, 7),  -- 류민지
    (59, 7),  -- 조하린
    (62, 7),  -- 이태준
    (69, 7),  -- 오재현
    (80, 7),  -- 박하린
    (87, 7),  -- 임채연
    (88, 7),  -- 한도윤
    (92, 7);  -- 문혜린

-- 고2 내신 확통 A반 (class_group_id=8)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (50, 8),  -- 서도윤
    (56, 8),  -- 배수현
    (57, 8),  -- 전예은
    (70, 8),  -- 서예린
    (74, 8),  -- 권서연
    (84, 8),  -- 정하은
    (90, 8);  -- 서재민

-- 고2 내신 확통 B반 (class_group_id=9)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (65, 9),  -- 윤태민
    (72, 9),  -- 문지아
    (78, 9),  -- 홍준석
    (82, 9),  -- 이서율
    (85, 9),  -- 윤민호 (focus)
    (93, 9);  -- 신성호

-- 고2 내신 기하 A반 (class_group_id=10)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (51, 10), -- 장아름
    (63, 10), -- 최지훈
    (67, 10), -- 임도연
    (68, 10), -- 한성민
    (73, 10), -- 신준호
    (83, 10), -- 최재원
    (89, 10); -- 오시현

-- 고2 수능 공통+미적분 A반 (class_group_id=15)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (64, 15), -- 정소연
    (71, 15), -- 장재훈
    (79, 15), -- 조민수
    (81, 15), -- 김예준
    (91, 15); -- 장도현 (미적분A반과 중복 없도록 관리)

-- 고2 수능 공통+확통 B반 (class_group_id=16)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (58, 16), -- 홍민재
    (60, 16), -- 박지훈 (focus)
    (75, 16); -- 류지호

-- 고1 내신 수학1 A반 (class_group_id=1)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (94,  1),  -- 권아린
    (98,  1),  -- 홍수진
    (101, 1),  -- 김준혁
    (106, 1),  -- 강민서
    (108, 1),  -- 한예진
    (110, 1),  -- 서지윤
    (111, 1),  -- 장현우
    (116, 1),  -- 배준서
    (123, 1),  -- 최서영
    (124, 1);  -- 정민서

-- 고1 내신 수학1 B반 (class_group_id=2)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (95,  2),  -- 류태윤
    (96,  2),  -- 배지현
    (99,  2),  -- 조민아
    (104, 2),  -- 정민준
    (113, 2),  -- 신도현
    (114, 2),  -- 권재민
    (118, 2),  -- 홍지민
    (119, 2),  -- 조예린
    (121, 2),  -- 김소현
    (125, 2);  -- 윤지훈

-- 고1 내신 수학2 A반 (class_group_id=3)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (97,  3),  -- 전도연
    (103, 3),  -- 최예은
    (107, 3),  -- 임지은 (focus)
    (115, 3),  -- 류서아
    (120, 3),  -- 박태준
    (122, 3);  -- 이도준

-- 고1 내신 수학2 B반 (class_group_id=4)
INSERT INTO enrollments (student_id, class_group_id) VALUES
    (100, 4),  -- 박서연
    (102, 4),  -- 이아린
    (105, 4),  -- 윤서현
    (109, 4),  -- 오성민
    (112, 4),  -- 문채은
    (117, 4);  -- 전하윤

-- student_profiles 초기값 삽입 (전 학생)
INSERT INTO student_profiles (student_id, recent_progress_unit, recent_tag, current_score, assignment_done, assignment_total, overdue_assignments)
SELECT
    s.id,
    CASE s.grade
        WHEN 'grade3' THEN (ARRAY['수열의 극한 심화','미적분 II','확률과 통계','기하 벡터','수능 모의 A형','정적분 응용','급수와 수렴','치환적분'])[ceil(random()*8)::int]
        WHEN 'grade2' THEN (ARRAY['미적분 기초','수학2 함수','기하 원뿔곡선','확통 조합','수열 일반항','로그함수','삼각함수 그래프','이차곡선'])[ceil(random()*8)::int]
        WHEN 'grade1' THEN (ARRAY['수학1 이차함수','집합과 명제','수학2 수열','지수·로그','삼각함수 기초','함수의 연속','등차수열','이차방정식'])[ceil(random()*8)::int]
    END,
    'Ch.' || lpad((floor(random()*15+1))::text, 2, '0'),
    (CASE s.status
        WHEN 'rising'  THEN floor(random()*15+75)
        WHEN 'stable'  THEN floor(random()*15+68)
        WHEN 'warning' THEN floor(random()*15+55)
        WHEN 'urgent'  THEN floor(random()*15+50)
        WHEN 'focus'   THEN floor(random()*20+45)
    END)::int,
    (CASE s.status
        WHEN 'rising'  THEN floor(random()*5+15)
        WHEN 'stable'  THEN floor(random()*5+13)
        WHEN 'warning' THEN floor(random()*5+9)
        WHEN 'urgent'  THEN floor(random()*5+7)
        WHEN 'focus'   THEN floor(random()*5+4)
    END)::int,
    20,
    (CASE s.status
        WHEN 'rising'  THEN 0
        WHEN 'stable'  THEN floor(random()*2)
        WHEN 'warning' THEN floor(random()*3+1)
        WHEN 'urgent'  THEN floor(random()*3+1)
        WHEN 'focus'   THEN floor(random()*3+2)
    END)::int
FROM students s;

-- student_goal_profiles 초기값 삽입
INSERT INTO student_goal_profiles (student_id, goal_score, current_level, study_goal, studyti_summary)
SELECT
    s.id,
    (CASE s.status
        WHEN 'rising'  THEN floor(random()*10+85)
        WHEN 'stable'  THEN floor(random()*10+80)
        WHEN 'warning' THEN floor(random()*10+75)
        WHEN 'urgent'  THEN floor(random()*10+85)
        WHEN 'focus'   THEN floor(random()*10+70)
    END)::int,
    (CASE s.status
        WHEN 'rising'  THEN (ARRAY['중상','상','최상'])[ceil(random()*3)::int]
        WHEN 'stable'  THEN (ARRAY['중','중상'])[ceil(random()*2)::int]
        WHEN 'warning' THEN (ARRAY['중하','중'])[ceil(random()*2)::int]
        WHEN 'urgent'  THEN (ARRAY['중하','중'])[ceil(random()*2)::int]
        WHEN 'focus'   THEN '중하'
    END),
    (ARRAY[
        '수능 1등급 달성',
        '내신 1등급 유지',
        '수능 2등급 진입',
        '내신 2등급 달성',
        '기초 개념 완성 후 실전 도전'
    ])[ceil(random()*5)::int],
    (ARRAY[
        '차분하게 오개념을 짚고 넘어가는 타입. 반복 훈련 효과 큼.',
        '빠른 이해력을 가졌으나 복습 부족. 정기 점검 필요.',
        '꼼꼼하고 신중하나 풀이 속도 개선 필요.',
        '의욕적이고 질문이 많음. 개념 연결 능력 우수.',
        '수업 집중도 높으나 자습 시간 확보 어려움.'
    ])[ceil(random()*5)::int]
FROM students s;
