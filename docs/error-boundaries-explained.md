# Next.js 에러 바운더리 설명

## error.tsx vs global-error.tsx

### error.tsx (페이지별 에러 바운더리)

**역할:**

- 특정 라우트 세그먼트의 에러를 포착
- Server Component와 Client Component의 렌더링 에러 처리
- **루트 레이아웃(`app/layout.tsx`)은 포착하지 못함**

**적용 범위:**

```
app/
├── layout.tsx          ❌ error.tsx가 포착 못함
├── error.tsx           ✅ 이 파일
├── page.tsx            ✅ 포착됨
└── dashboard/
    ├── layout.tsx      ✅ 포착됨
    ├── error.tsx       ✅ 우선 적용 (더 가까운 에러 바운더리)
    └── page.tsx        ✅ 포착됨
```

**특징:**

- 'use client' 필수 (클라이언트 컴포넌트)
- `reset()` 함수로 에러 복구 시도 가능
- 개발/프로덕션 모두 작동
- 에러 발생 시 해당 세그먼트만 대체

**사용 시나리오:**

- 일반적인 페이지 에러
- 데이터 fetching 실패
- 컴포넌트 렌더링 에러
- 비즈니스 로직 에러

---

### global-error.tsx (전역 에러 바운더리)

**역할:**

- **루트 레이아웃(`app/layout.tsx`)의 에러를 포착**
- 최상위 레벨의 치명적인 에러 처리
- error.tsx가 포착하지 못한 에러의 최후 방어선

**적용 범위:**

```
app/
├── layout.tsx          ✅ global-error.tsx가 포착
├── global-error.tsx    ✅ 이 파일
├── error.tsx           ❌ 루트 레이아웃 에러는 포착 못함
└── page.tsx            ❌ error.tsx가 먼저 포착
```

**특징:**

- 'use client' 필수
- `<html>`, `<body>` 태그를 직접 포함해야 함 (루트 레이아웃 대체)
- **프로덕션에서만 활성화** (개발 모드에서는 error.tsx 사용)
- 매우 드물게 발생

**사용 시나리오:**

- 루트 레이아웃 에러
- 전역 Provider 에러
- 치명적인 시스템 에러
- 복구 불가능한 에러

---

## 에러 처리 계층 구조

```
┌─────────────────────────────────────────────────────────┐
│                   global-error.tsx                      │
│              (루트 레이아웃 에러만 포착)                  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │              app/layout.tsx                       │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │           error.tsx                         │ │ │
│  │  │      (페이지 에러 포착)                      │ │ │
│  │  │                                             │ │ │
│  │  │  ┌───────────────────────────────────────┐ │ │ │
│  │  │  │        page.tsx                       │ │ │ │
│  │  │  │    (일반 페이지 컴포넌트)              │ │ │ │
│  │  │  └───────────────────────────────────────┘ │ │ │
│  │  │                                             │ │ │
│  │  │  ┌───────────────────────────────────────┐ │ │ │
│  │  │  │    dashboard/                         │ │ │ │
│  │  │  │    ├── error.tsx (우선 적용)          │ │ │ │
│  │  │  │    └── page.tsx                       │ │ │ │
│  │  │  └───────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 에러 처리 우선순위

1. **가장 가까운 error.tsx** (해당 세그먼트)
2. **상위 error.tsx** (부모 세그먼트)
3. **루트 error.tsx** (app/error.tsx)
4. **global-error.tsx** (루트 레이아웃 에러만)

**예시:**

```
app/
├── layout.tsx
├── global-error.tsx
├── error.tsx           ← 3순위
├── page.tsx            → error.tsx가 포착
└── dashboard/
    ├── error.tsx       ← 1순위 (가장 가까움)
    └── page.tsx        → dashboard/error.tsx가 포착
```

---

## 실전 예제

### 1. 일반 페이지 에러 (error.tsx)

```tsx
// app/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div>
      <h2>페이지 오류</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 2. 특정 경로 에러 (dashboard/error.tsx)

```tsx
// app/dashboard/error.tsx
'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div>
      <h2>대시보드 오류</h2>
      <p>대시보드를 불러올 수 없습니다.</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

### 3. 전역 치명적 에러 (global-error.tsx)

```tsx
// app/global-error.tsx
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div>
          <h2>심각한 오류</h2>
          <p>애플리케이션에 치명적인 문제가 발생했습니다.</p>
          <button onClick={() => window.location.reload()}>새로고침</button>
        </div>
      </body>
    </html>
  );
}
```

---

## 언제 무엇을 사용할까?

### error.tsx를 사용하는 경우 (대부분)

- ✅ 일반적인 페이지 에러
- ✅ 데이터 fetching 실패
- ✅ 컴포넌트 렌더링 에러
- ✅ 사용자 액션으로 인한 에러
- ✅ 복구 가능한 에러

### global-error.tsx를 사용하는 경우 (드물게)

- ✅ 루트 레이아웃 에러
- ✅ 전역 Provider 초기화 실패
- ✅ 치명적인 시스템 에러
- ✅ 복구 불가능한 에러

---

## 주의사항

### ❌ 흔한 실수

1. **global-error.tsx에서 <html>, <body> 빠뜨리기**

   ```tsx
   // ❌ 잘못된 예
   export default function GlobalError({ error }) {
     return <div>Error</div>;
   }

   // ✅ 올바른 예
   export default function GlobalError({ error }) {
     return (
       <html>
         <body>
           <div>Error</div>
         </body>
       </html>
     );
   }
   ```

2. **개발 모드에서 global-error.tsx가 안 보인다고 삭제하기**
   - global-error.tsx는 프로덕션에서만 작동
   - 개발 모드에서는 error.tsx가 대신 사용됨
   - 삭제하지 말고 유지할 것

3. **error.tsx로 루트 레이아웃 에러를 잡으려고 시도**
   - error.tsx는 루트 레이아웃 에러를 포착할 수 없음
   - 반드시 global-error.tsx 필요

---

## 결론

### 둘 다 필요합니다!

- **error.tsx**: 일반적인 페이지 에러 처리 (99%)
- **global-error.tsx**: 루트 레이아웃 에러 처리 (1%)

### 역할 분담

| 파일             | 포착 범위            | 사용 빈도 | 프로덕션 필수 |
| ---------------- | -------------------- | --------- | ------------- |
| error.tsx        | 페이지/컴포넌트 에러 | 높음      | ✅            |
| global-error.tsx | 루트 레이아웃 에러   | 낮음      | ✅            |

### 권장 사항

1. 항상 **error.tsx**와 **global-error.tsx** 둘 다 구현
2. error.tsx는 사용자 친화적인 UI 제공
3. global-error.tsx는 최소한의 UI + 외부 모니터링 통합
4. 개발 중에는 error.tsx만 보이지만, 프로덕션에서는 둘 다 필요
