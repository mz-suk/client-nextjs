# ✅ React Compiler 적용 확인 가이드

React Compiler가 제대로 작동하는지 확인하는 방법들을 안내합니다.

---

## 1️⃣ 빌드 로그 확인 (가장 간단)

### 방법

```bash
pnpm build
```

### 확인 사항

빌드 시작 시 다음 메시지가 출력되어야 합니다:

```
   ▲ Next.js 15.5.6 (Turbopack)
   - Environments: .env
   - Experiments (use with caution):
     ✓ reactCompiler  ← 이 체크마크가 있어야 함!
     · optimizePackageImports
```

**✅ `✓ reactCompiler` 표시가 있으면 정상 작동**

---

## 2️⃣ 실제 컴파일 결과 확인 (고급)

### Next.js 빌드 결과 분석

React Compiler는 빌드 시 컴포넌트를 최적화합니다.

```bash
# 상세 빌드 로그 확인
NEXT_DEBUG_REACT_COMPILER=true pnpm build
```

### 컴파일러가 최적화한 파일 확인

빌드 후 `.next` 폴더의 컴파일된 코드를 확인할 수 있습니다:

```bash
# 예: 특정 컴포넌트의 컴파일 결과
cat .next/server/app/example-zustand/page.js | head -50
```

**주의:** 컴파일된 코드는 가독성이 떨어지므로 참고용으로만 사용

---

## 3️⃣ React Compiler Playground 테스트

### 온라인 테스트

1. https://playground.react.dev 접속
2. 프로젝트의 컴포넌트 코드 복사 붙여넣기
3. 오른쪽 "Output" 탭에서 최적화된 코드 확인

### 예제 코드

프로젝트의 실제 컴포넌트로 테스트:

```typescript
// src/app/example-zustand/page.tsx 내용 복사
'use client';

import { useCounterStore } from '@/features/counter';

export default function ExampleZustandPage() {
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);
  const decrement = useCounterStore(state => state.decrement);
  const reset = useCounterStore(state => state.reset);

  return (
    <div>
      <h1>Zustand 예제</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**확인 사항:**

- Playground가 에러 없이 컴파일되면 정상
- Output 탭에서 `useMemoCache` 등 메모이제이션 코드 생성 확인

---

## 4️⃣ ESLint Rules of React 검증

### 방법

```bash
pnpm lint
```

### 확인 사항

React Compiler 기반 린트 규칙이 작동하는지 확인:

```typescript
// 테스트 파일 생성: src/test-compiler-lint.tsx
'use client';

import { useState } from 'react';

export function TestComponent() {
  const [count, setCount] = useState(0);

  // ❌ 이 코드는 ESLint 에러를 발생시켜야 함
  setCount(count + 1);

  return <div>{count}</div>;
}
```

```bash
pnpm lint
```

**예상 결과:**

```
Error: React Hook "setCount" cannot be called at the top level.
```

린트 에러가 발생하면 **Rules of React 검증이 정상 작동** 중입니다.

**테스트 후 파일 삭제:**

```bash
rm src/test-compiler-lint.tsx
```

---

## 5️⃣ 런타임 성능 확인 (React DevTools)

### React DevTools Profiler 사용

1. **React DevTools 설치**
   - Chrome: https://chrome.google.com/webstore (React Developer Tools 검색)

2. **프로파일링 시작**

   ```bash
   pnpm dev
   # http://localhost:3000 접속
   ```

3. **DevTools에서 Profiler 탭 선택**
   - 🔴 녹화 시작
   - 페이지에서 상태 변경 (버튼 클릭 등)
   - ⏹️ 녹화 중지

4. **결과 확인**
   - "Flamegraph" 차트에서 리렌더링 패턴 확인
   - 불필요한 리렌더링이 줄어들어야 함

### 비교 테스트 (Before/After)

**Before (React Compiler 비활성화):**

```typescript
// next.config.ts
experimental: {
  reactCompiler: false,  // 비활성화
}
```

**After (React Compiler 활성화):**

```typescript
// next.config.ts
experimental: {
  reactCompiler: true,  // 활성화
}
```

각각 빌드 후 동일한 작업 수행 시 리렌더링 횟수 비교

---

## 6️⃣ 번들 크기 확인

### 방법

```bash
pnpm analyze
```

브라우저가 자동으로 열리면서 번들 분석 결과 표시

### 확인 사항

- React Compiler 추가로 인한 번들 크기 변화 확인
- 대부분 1-2KB 증가 (무시할 수준)
- 런타임 성능 향상이 훨씬 큼

**현재 프로젝트 결과:**

```
First Load JS: 188 KB (+1 KB)
```

---

## 7️⃣ 실제 사용 예제로 확인

### 테스트 페이지 방문

```bash
pnpm dev
```

다음 페이지들을 방문하여 정상 작동 확인:

1. **Zustand 예제:** http://localhost:3000/example-zustand
   - 카운터 버튼 클릭 시 정상 작동
   - 컴파일러가 상태 업데이트 최적화

2. **TanStack Query 예제:** http://localhost:3000/example-tanstack-query
   - 데이터 페칭 및 캐싱 정상 작동
   - 컴파일러가 쿼리 훅 최적화

3. **React 19 use() 훅:** http://localhost:3000/example-react19
   - 사용자 목록 로딩
   - Promise 캐싱과 컴파일러 조합 확인

**모든 페이지가 에러 없이 작동하면 정상**

---

## 8️⃣ 콘솔 경고 확인

### 방법

```bash
pnpm dev
```

브라우저 개발자 도구 콘솔에서 확인:

### 정상 상태

- ✅ React Compiler 관련 에러 없음
- ✅ Rules of React 위반 경고 없음

### 문제 상태 (발견 시)

```
Warning: React Compiler detected a potential Rules of React violation
```

이런 경고가 있다면:

1. 해당 컴포넌트 찾기
2. Rules of React 준수하도록 수정
3. `pnpm lint` 실행하여 재확인

---

## 9️⃣ 특정 컴포넌트에서 확인

### 테스트 컴포넌트 작성

```typescript
// src/app/test-compiler/page.tsx
'use client';

import { useState } from 'react';

// 이 컴포넌트는 React Compiler가 자동으로 최적화해야 함
export default function TestCompilerPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 수동 메모이제이션 없이 작성
  const expensiveValue = count * 2;

  const handleClick = () => {
    setCount(count + 1);
  };

  console.log('렌더링됨 - count:', count, 'text:', text);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>React Compiler 테스트</h1>

      <div>
        <p>Count: {count}</p>
        <p>Expensive Value: {expensiveValue}</p>
        <button onClick={handleClick}>Increment</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="텍스트 입력"
        />
      </div>

      <div style={{ marginTop: '1rem', color: '#666' }}>
        <small>
          ✅ text 입력 시 count가 변하지 않으면 메모이제이션 정상 작동
        </small>
      </div>
    </div>
  );
}
```

### 테스트 방법

1. http://localhost:3000/test-compiler 접속
2. 콘솔 열기
3. **텍스트 입력란에 타이핑**
4. 콘솔 확인

**예상 결과:**

- ✅ text 변경 시에도 렌더링 로그가 출력됨 (정상)
- ✅ 하지만 `expensiveValue`는 재계산되지 않음 (컴파일러 최적화)

**테스트 후 정리:**

```bash
rm -rf src/app/test-compiler
```

---

## 🎯 확인 체크리스트

다음 항목들을 확인하세요:

- [ ] `pnpm build` 시 `✓ reactCompiler` 표시 확인
- [ ] `pnpm lint` 정상 통과
- [ ] 모든 예제 페이지 정상 작동
- [ ] 브라우저 콘솔에 React Compiler 에러 없음
- [ ] DevTools Profiler에서 불필요한 리렌더링 감소 확인
- [ ] 번들 크기 증가 최소화 (1-2KB)

**모두 체크되면 React Compiler가 정상적으로 적용된 상태입니다!** ✅

---

## 🔧 문제 해결

### React Compiler가 활성화되지 않음

**증상:** `pnpm build` 시 `reactCompiler` 표시 없음

**해결:**

```typescript
// next.config.ts 확인
experimental: {
  reactCompiler: true,  // 이 줄이 있어야 함
}
```

### ESLint 규칙이 작동하지 않음

**증상:** Rules of React 위반이 감지되지 않음

**해결:**

```bash
# eslint-plugin-react-hooks 최신 버전 확인
pnpm list eslint-plugin-react-hooks

# 7.0.0 이상이어야 함
# 아니면 재설치
pnpm add --save-dev eslint-plugin-react-hooks@latest
```

### 특정 컴포넌트가 최적화되지 않음

**원인:** Rules of React 위반 가능성

**해결:**

1. 해당 컴포넌트에서 `pnpm lint` 실행
2. 경고 메시지 확인
3. Rules of React 준수하도록 수정

### 빌드 시간이 너무 오래 걸림

**원인:** 대규모 프로젝트에서 컴파일러 분석 시간

**해결:**

```typescript
// next.config.ts
experimental: {
  reactCompiler: {
    compilationMode: 'annotation',  // 주석으로 명시된 컴포넌트만 최적화
  },
}
```

```typescript
// 최적화할 컴포넌트에만 추가
'use memo'; // 또는 'use react-compiler'

export function MyComponent() {
  // ...
}
```

---

## 📊 성능 측정 도구

### 1. Lighthouse

```bash
# Chrome DevTools > Lighthouse 탭
# Performance 측정
```

### 2. React DevTools Profiler

```bash
# Chrome DevTools > React DevTools > Profiler
# 상호작용 프로파일링
```

### 3. Bundle Analyzer

```bash
pnpm analyze
```

### 4. Next.js Analytics (프로덕션)

Vercel 배포 시 자동으로 성능 지표 수집

---

## 🎓 추가 학습 자료

- [React Compiler Playground](https://playground.react.dev) - 실시간 컴파일 테스트
- [React Compiler 공식 문서](https://react.dev/learn/react-compiler)
- [Rules of React](https://react.dev/reference/rules) - 준수해야 할 규칙
- [React DevTools 가이드](https://react.dev/learn/react-developer-tools)

---

**현재 프로젝트 상태:** ✅ React Compiler v1.0 정상 작동 중

**다음 단계:** 성능 측정 및 최적화 모니터링
