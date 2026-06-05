## 목표
"Calm academic journal" 디자인 방향으로 학생 AI 학습 플래너의 1~5단계를 구현합니다. AI 기능(6~10단계)은 다음 턴에 진행합니다.

## 범위 (이번 턴)
- 1단계: UI 셸 + 메인 대시보드 화면 구조
- 2단계: 할 일 생성/수정/삭제/완료 (CRUD)
- 3단계: 카테고리 시스템 (기본 8과목 + 사용자 추가/수정/삭제, 이름+색상)
- 4단계: 월간 캘린더에 시작일~마감일 색상 바 표시 (Google Calendar 스타일, 겹침 시 줄 분리)
- 5단계: 루틴 시스템 (매일/평일/주말/특정요일/사용자 지정 반복, 캘린더 표시)

## 인증 & 데이터 저장
- Lovable Cloud 활성화, 이메일+구글 로그인
- 보호 라우트는 `_authenticated/` 아래 배치
- 테이블: `profiles`, `categories`, `tasks`, `routines`
  - 모두 `user_id` FK + RLS (auth.uid() 본인만)
  - `tasks`: title, description, category_id, start_date, due_date, estimated_minutes, importance(1~3), progress(0~100), completed, created_at
  - `categories`: name, color (hex), is_default
  - `routines`: title, category_id, repeat_type(daily/weekday/weekend/custom), repeat_days(int[]), start_time(optional)
- 첫 로그인 시 기본 8개 카테고리(국어/수학/영어/사회/과학/한국사/예체능/기타) 자동 시드 (DB trigger)

## 라우트 구조
```
src/routes/
  __root.tsx                  (Providers + 인증 리스너)
  index.tsx                   (랜딩 → /auth 또는 /dashboard 리다이렉트)
  auth.tsx                    (로그인/회원가입)
  _authenticated/
    route.tsx                 (Supabase 통합 관리, 자동 생성)
    dashboard.tsx             (메인: 캘린더 + 오늘 할 일)
    tasks.tsx                 (할 일 전체 목록 + 필터/정렬)
    categories.tsx            (카테고리 관리)
    routines.tsx              (루틴 관리)
```
하단 탭 네비게이션: 홈 · 할 일 · 루틴 · 카테고리

## 화면 구성 (선택된 디자인 기준)
- 배경 `#fdfaf6` (warm cream), Noto Sans KR, 카테고리별 파스텔 색상
- 헤더: "○월 학습 리포트" + AI 분석 버튼 (이번 턴은 비활성/placeholder)
- 캘린더 카드 (rounded-[20px], ring-1): 월 그리드, 일정은 시작일~마감일 절대 위치 색상 바
- 카테고리 칩 필터 (가로 스크롤)
- "오늘의 할 일" 리스트: 점(과목색) + 제목 + 진행률 바 + D-day/시간 chip
- "학습 루틴" 그리드 (Daily/Weekly 라벨)
- 우하단 플로팅 + 버튼 → 할 일 생성 다이얼로그

## 핵심 컴포넌트
- `MonthCalendar` — 월 6주 그리드, props로 tasks/routines 받아 레인 배치 알고리즘(겹침 시 별도 줄). 날짜 클릭 시 선택일 변경
- `TaskCard` — 진행률 + D-day 배지, 클릭 시 편집 시트
- `TaskFormDialog` — 제목/설명/카테고리/시작일/마감일/예상시간/중요도
- `CategoryManager` — 색상 팔레트로 선택, CRUD
- `RoutineFormDialog` — 반복 방식 선택 UI
- 모두 shadcn(Dialog, Sheet, Calendar, Select, Slider) 사용

## 정렬/필터 (이번 턴 부분 구현)
- 할 일 목록 페이지에 마감일 가까운 순(기본), 마감 늦은 순, 생성일순, 중요도순, 카테고리/완료여부 필터

## 데이터 흐름
- `createServerFn` + `requireSupabaseAuth`로 모든 CRUD 정의 (`src/lib/tasks.functions.ts`, `categories.functions.ts`, `routines.functions.ts`)
- TanStack Query `queryOptions` + `useSuspenseQuery` 패턴
- 변경 시 `queryClient.invalidateQueries`

## 이번 턴에서 안 하는 것 (다음 단계 예고)
- 6단계 AI 가이드라인 분석 (텍스트 → 체크리스트)
- 7단계 AI 학습 계획 자동 생성
- 8단계 AI 재계획
- 9단계 통계 화면
- 10단계 디자인/UX 마감

각 단계가 끝나면 진행 상황을 알려드리고, 승낙하시면 6단계(AI 가이드라인 분석)부터 이어서 구현합니다.