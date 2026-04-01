# DB 재생성 절차

PostgreSQL 15+ 기준. 아래 순서대로 실행하면 에러 없이 완료된다.

## 전제 조건

- PostgreSQL 실행 중
- DB: `aimon_Teacher` / User: `postgres` / Port: `5432`

## 초기화 순서

```sql
-- 1. 스키마 생성 (테이블, 인덱스, VIEW 포함)
\i database/01_create_schema.sql

-- 2. 기준 데이터 (선생님 3명, 학교 10개, 반)
\i database/02_seed_reference.sql

-- 3. 학생 데이터 (120명)
\i database/03_seed_students.sql

-- 4. 성취/시험/리포트 데이터
\i database/04_seed_academics.sql

-- 5. 과제/제출 데이터
\i database/05_seed_assignments.sql

-- 6. 이슈 데이터
\i database/06_seed_issues.sql

-- 7. VIEW 생성
\i database/07_views_and_queries.sql

-- 8. 데모 데이터 보강 (운영형 MVP용)
\i database/08_seed_demo_updates.sql
```

## 터미널에서 한 번에 실행

```bash
cd "/Users/kyunglim/에임 온"
psql -U postgres -d aimon_Teacher \
  -f database/01_create_schema.sql \
  -f database/02_seed_reference.sql \
  -f database/03_seed_students.sql \
  -f database/04_seed_academics.sql \
  -f database/05_seed_assignments.sql \
  -f database/06_seed_issues.sql \
  -f database/07_views_and_queries.sql
```

## 완료 확인 쿼리

```sql
SELECT COUNT(*) FROM v_student_list;       -- 약 100건
SELECT COUNT(*) FROM v_class_list;         -- 약 21건
SELECT COUNT(*) FROM v_today_lessons;      -- 오늘 수업 건수
SELECT * FROM v_student_detail WHERE student_id = 1;
```

## 주의사항

- 재실행 시 `01_create_schema.sql`에 `DROP TABLE IF EXISTS` 포함 여부 확인 후 실행
- 시드 데이터는 멱등성 보장 안 됨 → 재실행 전 DB 초기화 권장
