# ⚡ React Compiler v1.0 가이드

React Compiler는 자동 메모이제이션을 통해 React 앱을 최적화하는 빌드 타임 도구입니다.

> **참고:** [React Compiler v1.0 공식 블로그](https://react.dev/blog/2025/10/07/react-compiler-1)

---

## 📊 적용 완료

✅ **React Compiler v1.0** 적용됨  
✅ **자동 메모이제이션** 활성화  
✅ **컴파일러 기반 린트 규칙** 통합

### 빌드 확인

```
Experiments (use with caution):
  ✓ reactCompiler
  · optimizePackageImports
```

---

## 🎯 React Compiler란?

React Compiler는 컴포넌트와 훅을 자동으로 메모이제이션하여 최적화합니다.

### 주요 특징

**1. 자동 메모이제이션**

- `useMemo`, `useCallback`, `React.memo` 수동 작성 불필요
- 컴파일 타임에 자동 최적화
- 조건부 메모이제이션 가능 (수동으로는 불가능)

**2. 정밀한 최적화**

- Control Flow Graph (CFG) 기반 분석
- 데이터 플로우 및 가변성 이해
- 필요한 부분만 선택적 메모이제이션

**3. Rules of React 검증**

- 자동으로 React 규칙 위반 감지
- ESLint 통합으로 린트 단계에서 확인
- 잠재적 버그 조기 발견

---

## 💡 동작 방식

### Before: 수동 메모이제이션

```typescript
// ❌ 수동으로 메모이제이션 필요
function Component({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  const handleClick = useCallback(() => {
    doSomething(processedData);
  }, [processedData]);

  return <Child onClick={handleClick} data={processedData} />;
}
```

### After: React Compiler (자동)

```typescript
// ✅ 컴파일러가 자동으로 최적화
function Component({ data }) {
  const processedData = expensiveOperation(data);

  const handleClick = () => {
    doSomething(processedData);
  };

  return <Child onClick={handleClick} data={processedData} />;
}
```

**컴파일러가 자동으로:**

- `processedData` 메모이제이션
- `handleClick` 함수 메모이제이션
- 필요한 경우에만 재계산

---

## 🚀 설치 및 설정

### 1. 패키지 설치

```bash
pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest
pnpm add --save-dev eslint-plugin-react-hooks@latest
```

### 2. Next.js 설정

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

### 3. ESLint 설정

```javascript
// eslint.config.mjs
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  reactHooks.configs.flat.recommended,
  // ...
];
```

---

## 📋 컴파일러 기반 린트 규칙

React Compiler는 ESLint 규칙을 통해 Rules of React 위반을 감지합니다.

### 주요 규칙

**1. set-state-in-render**

- 렌더링 중 setState 호출로 인한 무한 루프 방지

```typescript
// ❌ 잘못된 패턴
function Component() {
  const [count, setCount] = useState(0);
  setCount(1); // 렌더링 루프 발생!
  return <div>{count}</div>;
}

// ✅ 올바른 패턴
function Component() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(1);
  }, []);
  return <div>{count}</div>;
}
```

**2. set-state-in-effect**

- Effect 내부의 비용이 많이 드는 작업 플래그

```typescript
// ⚠️ 경고
useEffect(() => {
  const data = expensiveOperation(); // 비용이 큼
  setState(data);
}, []);
```

**3. refs**

- 렌더링 중 안전하지 않은 ref 접근 방지

```typescript
// ❌ 잘못된 패턴
function Component() {
  const ref = useRef();
  const value = ref.current; // 렌더링 중 접근
  return <div ref={ref}>{value}</div>;
}

// ✅ 올바른 패턴
function Component() {
  const ref = useRef();
  useEffect(() => {
    const value = ref.current; // Effect에서 접근
  }, []);
  return <div ref={ref} />;
}
```

---

## 🔧 useMemo/useCallback은 언제 사용하나?

### 기본 전략

**새로운 코드:**

- 컴파일러에 맡기기
- 필요한 경우에만 `useMemo`/`useCallback` 사용

**기존 코드:**

- 기존 메모이제이션 유지 (제거 시 컴파일 출력 변경 가능)
- 신중하게 테스트 후 제거

### Escape Hatch

컴파일러가 자동 최적화하지만, 세밀한 제어가 필요한 경우 여전히 사용 가능:

```typescript
function Component({ data }) {
  // Effect 의존성으로 사용되는 값
  const expensiveValue = useMemo(() => {
    return computeExpensive(data);
  }, [data]);

  useEffect(() => {
    // expensiveValue가 실제로 변경될 때만 실행
    doSomething(expensiveValue);
  }, [expensiveValue]);

  return <div>{expensiveValue}</div>;
}
```

**사용 시점:**

- Effect 의존성으로 사용되는 값
- 매우 비싼 계산
- 외부 라이브러리와의 통합

---

## 📊 성능 개선

### 실제 프로덕션 사례 (Meta Quest Store)

- ⚡ 초기 로드: **최대 12% 개선**
- 🚀 페이지 전환: **최대 12% 개선**
- 🎯 특정 인터랙션: **2.5배 빠름**
- 💾 메모리 사용량: **중립적**

### 이 프로젝트

**번들 크기 비교:**

Before (React Compiler 적용 전):

```
First Load JS: 187 KB
```

After (React Compiler 적용 후):

```
First Load JS: 188 KB (+1 KB)
```

**개선 사항:**

- ✅ 자동 메모이제이션으로 불필요한 리렌더링 방지
- ✅ 런타임 성능 향상
- ✅ 개발자가 메모이제이션 코드 작성 불필요

---

## 🔍 컴파일러 작동 확인

### Playground에서 확인

React Compiler Playground: https://playground.react.dev

코드를 입력하면 컴파일러가 어떻게 최적화하는지 확인 가능

### 빌드 로그 확인

```bash
pnpm build
```

출력에서 다음 확인:

```
Experiments (use with caution):
  ✓ reactCompiler  ← 이 표시가 있으면 활성화됨
```

---

## 🎯 조건부 메모이제이션

React Compiler의 강력한 기능: 조건부로도 메모이제이션 가능!

```typescript
export default function ThemeProvider(props) {
  if (!props.children) {
    return null;
  }

  // 조건부 return 이후에도 메모이제이션 가능!
  const theme = mergeTheme(props.theme, use(ThemeContext));

  return (
    <ThemeContext value={theme}>
      {props.children}
    </ThemeContext>
  );
}
```

**수동 메모이제이션으로는 불가능:**

- `useMemo`는 조건부 사용 불가 (Hooks 규칙)
- 컴파일러는 CFG 분석으로 가능

---

## ⚠️ 주의사항

### 1. 업그레이드 전략

**좋은 테스트 커버리지가 있는 경우:**

```bash
pnpm add --save-dev babel-plugin-react-compiler@latest
```

**테스트가 부족한 경우:**

```bash
pnpm add --save-dev --save-exact babel-plugin-react-compiler@1.0.0
```

SemVer 범위 대신 정확한 버전 고정 권장

### 2. 메모이제이션 변경

컴파일러 버전 업그레이드 시 메모이제이션 방식이 변경될 수 있음:

- 더 세밀하고 정밀해질 수 있음
- 드물게 예상치 못한 결과 발생 가능

**권장사항:**

- Rules of React 준수
- End-to-End 테스트 작성
- 신중한 업그레이드

### 3. useEffect 의존성

```typescript
// 예: 이전에 메모이제이션된 값이 useEffect 의존성인 경우
useEffect(() => {
  // 메모이제이션 변경 시 실행 빈도 변경 가능
  doSomething(memoizedValue);
}, [memoizedValue]);
```

---

## 🆚 React Compiler vs 수동 메모이제이션

| 항목            | 수동 메모이제이션 | React Compiler |
| --------------- | ----------------- | -------------- |
| **작성 시간**   | 느림              | 빠름 (자동)    |
| **유지보수**    | 어려움            | 쉬움           |
| **조건부 메모** | 불가능            | 가능           |
| **정밀도**      | 개발자 의존       | 자동 분석      |
| **버그 위험**   | 높음              | 낮음           |
| **코드 가독성** | 낮음              | 높음           |

---

## 🔗 호환성

### React 버전

- ✅ React 19 (권장)
- ✅ React 18
- ✅ React 17

### 빌드 도구

- ✅ Next.js 15.3.1+ (swc 지원)
- ✅ Vite
- ✅ Babel
- ✅ Rsbuild
- 🧪 swc (experimental)

---

## 📚 추가 학습

### 공식 문서

- [React Compiler v1.0 블로그](https://react.dev/blog/2025/10/07/react-compiler-1)
- [React Compiler Playground](https://playground.react.dev)
- [React Compiler 문서](https://react.dev/learn/react-compiler)

### 사례 연구

- [Sanity Studio](https://www.sanity.io/blog/react-compiler)
- [Wakelet](https://medium.com/the-wake/adopting-react-compiler-at-wakelet-6c6c88be3e33)

---

## 💬 FAQ

### Q: 기존 useMemo/useCallback을 모두 제거해야 하나요?

**A:** 아니요. 기존 코드는 유지하는 것을 권장합니다. 제거 시 컴파일 출력이 변경될 수 있습니다.

### Q: 성능이 항상 개선되나요?

**A:** 대부분의 경우 개선되지만, 프로젝트마다 다를 수 있습니다. 측정을 권장합니다.

### Q: 프로덕션에 사용해도 안전한가요?

**A:** 네. Meta에서 이미 프로덕션 환경에서 사용 중이며, v1.0은 안정 버전입니다.

### Q: 컴파일 시간이 느려지나요?

**A:** Next.js 15.3.1+는 swc 지원으로 빌드 성능이 크게 향상되었습니다.

### Q: 모든 컴포넌트가 최적화되나요?

**A:** 컴파일러가 분석 가능하고 Rules of React를 준수하는 컴포넌트만 최적화됩니다.

---

## ✅ 체크리스트

React Compiler 활용하기:

- [x] React Compiler 설치
- [x] Next.js 설정에 `reactCompiler: true` 추가
- [x] ESLint 플러그인 최신 버전으로 업데이트
- [ ] 기존 useMemo/useCallback 검토
- [ ] 성능 측정 (Lighthouse, React DevTools Profiler)
- [ ] E2E 테스트 실행
- [ ] Rules of React 위반 수정

---

**프로젝트 상태:** ✅ React Compiler v1.0 적용 완료

**다음 단계:** 성능 측정 및 최적화 모니터링
