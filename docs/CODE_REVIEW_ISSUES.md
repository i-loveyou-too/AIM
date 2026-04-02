# 코드 리뷰 - 발견된 문제 및 해결 체크리스트

> 작성일: 2026-04-01  
> 리뷰 범위: 프론트엔드 (Next.js 14) + 백엔드 (Django) 전체  
> 업데이트: 2026-04-01 (프론트엔드 심층 리뷰 + gitignore/middleware 추가)

---

## 체크리스트 요약

### 긴급 (즉시 조치)
- [ ] API 엔드포인트 인증 검사 추가
- [ ] `@csrf_exempt` 제거
- [ ] `.env.local.save` git history에서 제거 + DB 비밀번호 변경
- [ ] 학생 API `request.user` 기반 인증 로직 완성

### 높음
- [ ] JSON 파싱 오류 처리 (400 반환)
- [ ] 로그인 Rate Limiting 구현
- [ ] CORS 설정 환경별 분리

### 중간
- [ ] `teacher_api/views.py` 파일 기능별 분리
- [ ] raw SQL → Django ORM 마이그레이션
- [ ] 의존성 버전 고정 (`requirements.txt`)
- [ ] 유틸 함수 `utils/converters.py`로 분리
- [ ] 로깅/모니터링 설정 추가

### 낮음
- [ ] 한글 문자열 상수 파일 분리
- [ ] API 문서화 (Swagger/OpenAPI)
- [ ] 테스트 코드 작성

### 긴급 추가 발견
- [x] `.env.local.save` `.gitignore`에 추가 (현재 누락)
- [x] Next.js 라우트 보호 미들웨어 없음 (`src/middleware.ts` 부재)

### 프론트엔드 추가 발견
- [ ] `any` 타입 제거 (5개 파일)
- [ ] 동적 라우트 ID 빈 문자열 반환 수정
- [ ] `<a>` 태그 → `<Link>` 컴포넌트 변경
- [ ] `error.tsx` console.error 프로덕션 노출 제거
- [ ] 고정 배열 `useMemo` 제거 → 상수로 분리

---

## 1. 보안 문제

### 1-1. API 엔드포인트 인증 없음 `[긴급]`

**파일**: `backend/teacher_api/views.py`

**문제**:
`teacher_api`의 대부분 API 함수에 인증 데코레이터가 전혀 없어, 로그인하지 않은 사용자도 학생 목록·성적·약점 등 민감 정보에 자유롭게 접근 가능.

```python
# 현재 — 인증 없음
@require_GET
def teacher_students(request):
    query = """SELECT * FROM v_student_list ORDER BY student_id DESC LIMIT 100"""
    data = fetch_all_dict(query)
    return JsonResponse(data, safe=False)
```

**해결 방법**:
```python
from django.contrib.auth.decorators import login_required

@login_required
@require_GET
def teacher_students(request):
    ...
```

또는 DRF 사용 시 `permission_classes = [IsAuthenticated]` 추가.

- [ ] **해결**: 모든 teacher_api 뷰에 `@login_required` 추가

---

### 1-2. `@csrf_exempt` 사용 `[긴급]`

**파일**: `backend/teacher_api/views.py`

**문제**:
`ocr_request` 엔드포인트가 CSRF 보호를 완전히 해제하고 있어, 외부 공격자가 사용자 브라우저를 통해 해당 API를 임의 호출 가능.

```python
# 현재
@csrf_exempt
@require_POST
def ocr_request(request):
    ...
```

**해결 방법**:
- `@csrf_exempt` 제거
- 또는 API 토큰(Authorization 헤더) 기반 인증으로 대체

- [ ] **해결**: `@csrf_exempt` 제거 후 인증 방식 적용

---

### 1-3. DB 비밀번호 및 환경변수 노출 `[긴급]`

**파일**: `.env.local.save` (git 추적 파일)

**문제**:
`.env.local.save` 파일이 git에 커밋되어 DB 호스트, 사용자명, 비밀번호가 이미 노출됨.

**해결 방법**:
```bash
# git history에서 제거
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local.save" \
  --prune-empty --tag-name-filter cat -- --all

# .gitignore에 추가
echo ".env.local.save" >> .gitignore
```

- [ ] **해결**: `.env.local.save` git history에서 완전 제거
- [ ] **해결**: DB 비밀번호 즉시 변경 (이미 노출됨)
- [ ] **해결**: `.gitignore`에 `.env*.save` 패턴 추가

---

### 1-4. Open Redirect 잠재 위험 `[낮음]`

**파일**: `backend/accounts/views.py`

**문제**:
`//evil.com` 형태의 URL이 `/`로 시작하므로 현재 검증 로직을 통과할 수 있음.

```python
def _resolve_next_path(raw_next: Optional[str]) -> str:
    if isinstance(raw_next, str) and raw_next.startswith("/"):
        return raw_next  # //evil.com 통과 가능
    return "/dashboard"
```

**해결 방법**:
```python
from django.utils.http import url_has_allowed_host_and_scheme

def _resolve_next_path(raw_next: Optional[str]) -> str:
    if isinstance(raw_next, str) and url_has_allowed_host_and_scheme(
        raw_next, allowed_hosts={request.get_host()}
    ):
        return raw_next
    return "/dashboard"
```

- [ ] **해결**: `url_has_allowed_host_and_scheme()` 적용

---

## 2. 인증/인가 문제

### 2-1. 학생 API 인증 로직 미완성 `[긴급]`

**파일**: `backend/config/views.py`

**문제**:
학생 관련 API 다수에 `# TODO: 실제 인증 기능 도입 시 request.user를 사용` 주석이 남아 있고, 현재 모든 학생 API가 특정 사용자 확인 없이 동작하거나 하드코딩된 ID를 사용 중.

```python
# TODO: 실제 인증 기능 도입 시 request.user를 사용하여 student_id를 식별하도록 수정
# TODO: 실제 DB 연동 지점 - v_student_today_tasks...
# TODO: 실제 AI 엔진 또는 DB 기반 템플릿 매핑...
```

**해결 방법**:
- `request.user`를 통해 로그인된 사용자 확인
- 사용자-학생 매핑 테이블에서 `student_id` 조회
- 본인 데이터만 반환하도록 쿼리 조건 추가

- [ ] **해결**: TODO 전부 실제 구현으로 대체

---

### 2-2. 교사별 데이터 격리 없음 `[높음]`

**파일**: `backend/teacher_api/views.py`

**문제**:
교사가 로그인해도 자신이 담당하는 학생/반이 아닌 전체 데이터에 접근 가능. 예를 들어 A 교사가 B 교사의 학생 정보를 조회할 수 있음.

```python
# 현재 — 전체 조회
query = """SELECT * FROM v_student_list ORDER BY student_id DESC LIMIT 100"""
```

**해결 방법**:
```python
# 수정 — 로그인한 교사의 담당 학생만 조회
query = """
    SELECT * FROM v_student_list
    WHERE teacher_id = %s
    ORDER BY student_id DESC
"""
data = fetch_all_dict(query, [request.user.id])
```

- [ ] **해결**: 모든 teacher_api 조회에 `teacher_id` 필터 추가

---

## 3. 입력 검증 및 에러 처리

### 3-1. JSON 파싱 오류를 조용히 무시 `[높음]`

**파일**: `backend/accounts/views.py`

**문제**:
잘못된 JSON 요청이 들어올 때 빈 dict를 반환하며 조용히 실패. 클라이언트는 요청이 성공했다고 착각하지만 데이터는 처리되지 않음.

```python
def _parse_request_json(request) -> Dict[str, Any]:
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}  # 조용히 실패
```

**해결 방법**:
```python
def _parse_request_json(request) -> Dict[str, Any]:
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except UnicodeDecodeError:
        raise ValueError("요청 인코딩이 올바르지 않습니다.")
    except json.JSONDecodeError:
        raise ValueError("올바른 JSON 형식이 아닙니다.")

# 호출부에서
try:
    body = _parse_request_json(request)
except ValueError as e:
    return JsonResponse({"detail": str(e)}, status=400)
```

- [ ] **해결**: 파싱 실패 시 400 Bad Request 반환

---

### 3-2. 광범위한 예외 처리 `[중간]`

**파일**: `backend/teacher_api/views.py`

**문제**:
`except Exception:` 으로 모든 예외를 한꺼번에 잡아, 실제 버그가 숨겨짐.

```python
except Exception:
    return JsonResponse({"detail": "invalid JSON"}, status=400)
```

**해결 방법**:
- 예외 타입 구체화
- 예외 로깅 추가: `logger.exception("ocr_request 처리 중 오류")`
- 클라이언트에 적절한 메시지 반환

- [ ] **해결**: 예외 세분화 + 로깅 추가

---

## 4. 속도 제한 (Rate Limiting)

### 4-1. 로그인 브루트포스 방어 없음 `[높음]`

**파일**: `backend/accounts/views.py`

**문제**:
로그인 시도 횟수 제한이 없어 자동화된 비밀번호 대입 공격에 취약.

**해결 방법**:
```bash
pip install django-ratelimit
```

```python
from ratelimit.decorators import ratelimit

@ratelimit(key="ip", rate="5/m", method="POST", block=True)
def login_view(request):
    ...
```

또는 `django-axes` 패키지로 계정 잠금 기능 추가.

- [ ] **해결**: Rate Limiting 또는 계정 잠금 적용

---

## 5. CORS 설정

### 5-1. 환경별 분리 안 됨 `[중간]`

**파일**: `backend/config/settings.py`

**문제**:
로컬 개발 포트가 `.env.local`에 하드코딩되어, 프로덕션 배포 시 설정을 빠뜨리면 잘못된 오리진이 허용될 수 있음.

```
DJANGO_CORS_ALLOWED_ORIGINS=http://127.0.0.1:3007,http://127.0.0.1:3000
```

**해결 방법**:
- `.env.development`, `.env.production` 등으로 환경별 파일 분리
- CI/CD 파이프라인에서 환경변수 주입 확인

- [ ] **해결**: 환경별 CORS 설정 명시

---

## 6. 코드 구조 및 유지보수성

### 6-1. `teacher_api/views.py` 2100줄 초과 `[중간]`

**파일**: `backend/teacher_api/views.py`

**문제**:
단일 파일에 모든 teacher API 로직이 집중되어 있어 탐색, 테스트, 수정이 어려움.

**해결 방법**:
```
backend/teacher_api/
├── views/
│   ├── __init__.py
│   ├── lessons.py       # 수업 관련
│   ├── assignments.py   # 과제 관련
│   ├── students.py      # 학생 관련
│   ├── reports.py       # 리포트 관련
│   └── curriculum.py    # 커리큘럼 관련
└── utils/
    └── converters.py    # to_int, to_float, format_date 등
```

- [ ] **해결**: 기능별 파일 분리

---

### 6-2. 유틸 함수 분산 `[낮음]`

**파일**: `backend/teacher_api/views.py` (73~224줄)

**문제**:
`to_float`, `to_int`, `to_json`, `format_date`, `format_mmdd` 등 변환/포매팅 함수가 views.py 안에 섞여 있음.

**해결 방법**:
`backend/teacher_api/utils/converters.py`로 분리 후 import.

- [ ] **해결**: 유틸 함수 별도 파일로 분리

---

### 6-3. raw SQL 남용 `[중간]`

**파일**: `backend/teacher_api/views.py`

**문제**:
Django ORM 대신 raw SQL을 직접 작성해 보안 패치, 쿼리 최적화, 유지보수가 어려움. 특히 동적 조건 추가 시 오류 위험 높음.

**해결 방법**:
- 신규 기능부터 Django ORM 또는 DRF Serializer 사용
- 기존 쿼리는 점진적으로 ORM으로 대체

- [ ] **해결**: 신규 API부터 ORM 사용 원칙 적용

---

## 7. 의존성 관리

### 7-1. 백엔드 의존성 버전 미고정 `[중간]`

**파일**: `backend/requirements.txt`

**문제**:
`>=` 조건만 명시되어 있어, 의도치 않은 메이저 업데이트로 호환성 깨질 수 있음.

```
# 현재
django>=4.2
psycopg2-binary
django-cors-headers
djangorestframework
```

**해결 방법**:
```
# 개선
Django==4.2.11
psycopg2-binary==2.9.9
django-cors-headers==4.3.1
djangorestframework==3.14.0
```

또는 `pip-tools`로 `requirements.in` → `requirements.txt` 고정 관리.

- [ ] **해결**: 모든 의존성 버전 핀 고정

---

## 8. 로깅 및 모니터링

### 8-1. 로깅 설정 없음 `[중간]`

**파일**: `backend/config/settings.py`

**문제**:
인증 시도, DB 쿼리 오류, 예외 발생 등이 전혀 기록되지 않아 운영 중 문제 추적 불가.

**해결 방법**:
`settings.py`에 LOGGING 설정 추가:

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
        "file": {
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs/django.log",
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": "INFO",
    },
    "loggers": {
        "django.request": {
            "handlers": ["file"],
            "level": "WARNING",
            "propagate": False,
        },
    },
}
```

- [ ] **해결**: Django 로깅 설정 추가
- [ ] **해결**: 인증 시도 로그 기록 추가

---

## 9. 미완성 기능

### 9-1. TODO 주석으로 남겨진 미구현 로직 `[높음]`

**파일**: `backend/config/views.py`

**문제**:
프로덕션에서 동작해야 할 기능들이 TODO 주석 또는 mock 데이터로 대체되어 있음.

목록:
- 학생 오늘의 과제 실제 DB 연동
- 학생 AI 리포트 실제 엔진 연결
- 학생 식별 로직 (`request.user` 기반)

- [ ] **해결**: 프로덕션 배포 전 모든 TODO 구현 완료 또는 명시적 비활성화 처리

---

---

## 10. 프론트엔드 추가 발견 문제

### 10-1. `any` 타입 남용 `[중간]`

**파일**:
- `src/components/reports/report-hub-tabs.tsx`
- `src/components/curriculum/curriculum-content.tsx`
- `src/app/dashboard/assignments/page.tsx`
- `src/app/dashboard/settings/page.tsx`
- `src/app/dashboard/curriculum/page.tsx`

**문제**:
```typescript
// report-hub-tabs.tsx
type Props = {
  data: {
    studentReports: any[];      // any
    classReports: any[];        // any
    periodReports: Record<string, any>;  // any
  };
};
```

`strict: true` 설정이 되어 있음에도 any가 곳곳에 남아 있음. 타입 에러가 런타임에서야 발견됨.

**해결 방법**: 각 데이터 구조에 맞는 인터페이스 정의 (`StudentReport`, `ClassReport` 등)

- [ ] **해결**: 5개 파일의 `any` 타입 구체적 인터페이스로 대체

---

### 10-2. 동적 라우트 ID 빈 문자열 반환 `[중간]`

**파일**: `src/lib/services/teacher.service.ts`

**문제**:
```typescript
function resolveStudentRouteId(row: TeacherStudentListItem): string {
  const directId = toRouteStudentId(row.student_id);
  if (directId) return directId;
  // ...
  return "";  // 빈 문자열 반환 → /dashboard/students/ 같은 깨진 URL 생성
}
```

student_id를 찾지 못하면 빈 문자열을 반환해 잘못된 라우트로 이동함.

**해결 방법**:
```typescript
function resolveStudentRouteId(row: TeacherStudentListItem): string | null {
  // ...
  return null;  // 호출 측에서 null 체크 후 링크 비활성화
}
```

- [ ] **해결**: `null` 반환으로 변경 후 호출 측에서 링크 조건부 렌더링

---

### 10-3. `<a>` 태그 직접 사용 `[낮음]`

**파일**: `src/components/dashboard/today-schedule.tsx`

**문제**:
```typescript
<a href="/dashboard/today-lessons">  // Next.js Link 미사용
```

Next.js에서 `<a>` 태그 직접 사용 시 클라이언트 사이드 네비게이션 없이 풀 페이지 리로드 발생.

**해결 방법**:
```typescript
import Link from "next/link";
<Link href="/dashboard/today-lessons">
```

- [ ] **해결**: `<a>` → `<Link>` 변경

---

### 10-4. `error.tsx` console.error 프로덕션 노출 `[낮음]`

**파일**: `src/app/error.tsx`

**문제**:
```typescript
useEffect(() => {
  console.error(error);  // 프로덕션에서도 콘솔에 출력됨
}, [error]);
```

**해결 방법**:
```typescript
useEffect(() => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
}, [error]);
```

- [ ] **해결**: `NODE_ENV` 체크 추가

---

### 10-5. 고정 배열에 불필요한 `useMemo` `[낮음]`

**파일**: `src/components/students/student-directory.tsx`

**문제**:
```typescript
// 변하지 않는 고정 배열인데 useMemo로 감싸고 있음 — 매 렌더마다 비교 비용만 발생
const gradeOptions = useMemo(() => ["고1", "고2", "고3"], []);
```

**해결 방법**:
```typescript
// 컴포넌트 외부 상수로 분리
const GRADE_OPTIONS = ["고1", "고2", "고3"] as const;
```

- [ ] **해결**: 고정 옵션 배열 컴포넌트 외부 상수로 이동

---

---

## 11. 추가 발견 문제

### 11-1. `.env.local.save`가 `.gitignore`에서 누락 `[긴급]`

**파일**: `.gitignore`

**문제**:
`.gitignore`에 `.env.local`은 있지만 `.env.local.save`는 없음. 그래서 현재 git이 이 파일을 추적 중이고 (`git status`에서 `M .env.local.save` 확인), DB 비밀번호·호스트·사용자명이 그대로 노출된 상태.

```
# 현재 .gitignore
.env.local      ← 있음
# .env.local.save ← 없음!
```

**해결 방법**:
```bash
# .gitignore에 추가
echo ".env*.save" >> .gitignore

# git 추적에서 제거
git rm --cached .env.local.save
git commit -m "chore: remove sensitive env backup from tracking"
```

- [x] **해결**: `.gitignore`에 `.env*.save` 패턴 추가 후 캐시 제거

---

### 11-2. Next.js 라우트 보호 미들웨어 없음 `[긴급]`

**파일**: `src/middleware.ts` (존재하지 않음)

**문제**:
`src/middleware.ts`가 없어서 `/dashboard/**`, `/student/**` 등 보호되어야 할 라우트가 Next.js 레벨에서 전혀 차단되지 않음. 현재는 각 페이지 컴포넌트에서 개별적으로 처리하거나 API 응답에만 의존하는 구조.

브라우저에서 `/dashboard`로 직접 접근 시 렌더링이 시작된 후에야 리다이렉트가 발생 — UX 깜빡임 + 서버 리소스 낭비.

**해결 방법**:
```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const sessionCookie = request.cookies.get("sessionid");

  if (!isPublic && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [x] **해결**: `src/middleware.ts` 생성하여 미인증 접근 차단

---

### 11-3. 개발용 계정 기본값이 `teacher/teacher` `[낮음]`

**파일**: `backend/accounts/management/commands/ensure_dev_teacher.py`

**문제**:
```python
parser.add_argument("--password", default="teacher", ...)
```

CLI 인자 없이 실행하면 username=`teacher`, password=`teacher`로 계정 생성됨. 실수로 프로덕션 DB에 실행될 경우 즉시 로그인 가능한 계정이 생성됨.

또한 이 파일 자체가 git에 untracked 상태 — 팀원이 해당 커맨드를 모를 수 있음.

**해결 방법**:
- `default` 제거 후 필수 인자로 변경 (`required=True`)
- 또는 `DEBUG=True` 환경에서만 동작하도록 가드 추가:
```python
from django.conf import settings
if not settings.DEBUG:
    self.stderr.write("This command is only available in DEBUG mode.")
    return
```
- git에 추가해서 팀 전체가 공유

- [x] **해결**: DEBUG 환경 가드 추가
- [ ] **해결**: `backend/accounts/management/` git에 추가

---

## 긍정적인 부분 (유지할 것)

- 프론트엔드 TypeScript 타입 안전성 잘 구현됨
- 로그인/로그아웃 시 CSRF 토큰 처리 올바름 (`src/lib/api/auth.ts`)
- 로그인 오류 메시지 통일 ("아이디 또는 비밀번호가 올바르지 않습니다") — 사용자 열거 방지
- `.env.example` 제공으로 팀 설정 가이드 존재
- 로그인 후 리다이렉트 시 상대 경로만 허용

---

## 참고 — 우선순위 매트릭스

| # | 문제 | 심각도 | 난이도 | 우선순위 |
|---|------|--------|--------|----------|
| 1 | API 인증 없음 | 높음 | 중간 | 1순위 |
| 2 | 학생 TODO 미구현 | 높음 | 높음 | 1순위 |
| 3 | DB 비밀번호 노출 | 높음 | 낮음 | 1순위 |
| 4 | csrf_exempt 제거 | 높음 | 낮음 | 1순위 |
| 5 | Rate Limiting | 높음 | 낮음 | 2순위 |
| 6 | JSON 오류 처리 | 중간 | 낮음 | 2순위 |
| 7 | CORS 환경 분리 | 중간 | 낮음 | 2순위 |
| 8 | views.py 분리 | 중간 | 높음 | 3순위 |
| 9 | ORM 마이그레이션 | 중간 | 높음 | 3순위 |
| 10 | 의존성 버전 고정 | 중간 | 낮음 | 2순위 |
| 11 | 로깅 설정 | 중간 | 낮음 | 2순위 |
| 12 | Open Redirect | 낮음 | 낮음 | 3순위 |
| 13 | 유틸 함수 분리 | 낮음 | 낮음 | 4순위 |
| 14 | any 타입 남용 (FE 5개 파일) | 중간 | 중간 | 2순위 |
| 15 | 동적 라우트 ID 빈 문자열 | 중간 | 낮음 | 2순위 |
| 16 | `<a>` → `<Link>` 변경 | 낮음 | 낮음 | 4순위 |
| 17 | error.tsx console.error 노출 | 낮음 | 낮음 | 3순위 |
| 18 | 불필요한 useMemo | 낮음 | 낮음 | 4순위 |
