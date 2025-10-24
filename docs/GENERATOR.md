# 🎨 코드 제너레이터 가이드

Plop.js 기반 코드 제너레이터를 사용하여 FSD 아키텍처를 준수하는 코드를 자동 생성합니다.

## 📦 설치

이미 설치되어 있습니다. 추가 설치 불필요.

```bash
# 설치 확인
pnpm plop --version
```

## 🚀 사용법

### 대화형 모드

```bash
pnpm generate
```

선택 가능한 제너레이터 목록이 표시됩니다:

- Feature
- Component
- Hook
- Page

### 직접 실행

특정 제너레이터를 바로 실행:

```bash
# Feature 생성
pnpm generate:feature

# Component 생성
pnpm generate:component

# Hook 생성
pnpm generate:hook

# Page 생성
pnpm generate:page
```

---

## 📋 제너레이터 상세

### 1. Feature 제너레이터

**전체 FSD Feature 구조를 생성합니다** (Entity + Feature with API, Hooks, UI)

```bash
pnpm generate:feature
# 또는
pnpm generate
> Feature 선택
```

**질문:**

1. Feature 이름? (예: product, order, comment)
2. API 엔드포인트? (예: /products)
3. State management 방식? (SWR, TanStack Query, 둘 다)
4. 단일 항목 조회 API 생성? (getOne)

**생성되는 구조:**

```
src/
├── entities/
│   └── {name}/
│       ├── model/
│       │   ├── types.ts          # 타입 정의
│       │   └── index.ts
│       └── index.ts
│
└── features/
    └── {name}-list/
        ├── api/
        │   ├── get{Name}s.ts     # 목록 조회
        │   ├── get{Name}.ts      # 단일 조회 (옵션)
        │   └── index.ts
        ├── hooks/
        │   ├── use{Name}s.ts     # SWR 훅 (옵션)
        │   ├── use{Name}.ts      # SWR 훅 (옵션)
        │   ├── use{Name}sQuery.ts # TanStack Query 훅 (옵션)
        │   ├── use{Name}Query.ts  # TanStack Query 훅 (옵션)
        │   └── index.ts
        ├── ui/
        │   ├── {Name}List.tsx
        │   ├── {Name}List.module.css
        │   └── index.ts
        └── index.ts
```

**예제:**

```bash
$ pnpm generate:feature

? Feature 이름은? product
? API 엔드포인트는? /products
? State management 방식은? 둘 다
? 단일 항목 조회 API도 생성하시겠습니까? Yes

✨ 생성 완료!
```

**생성 후 작업:**

1. `entities/product/model/types.ts` - 필드 정의
2. `features/product-list/ui/ProductList.tsx` - UI 커스터마이징
3. `app/products/page.tsx` - 페이지 생성 (수동)

---

### 2. Component 제너레이터

**공유 UI 컴포넌트를 생성합니다** (shared/ui)

```bash
pnpm generate:component
```

**질문:**

1. 컴포넌트 이름? (예: Button, Card)
2. CSS Module 생성? (Yes/No)

**생성되는 구조:**

```
src/shared/ui/
└── {Name}/
    ├── {Name}.tsx
    ├── {Name}.module.css   # 옵션
    └── index.ts
```

**예제:**

```bash
$ pnpm generate:component

? 컴포넌트 이름은? Button
? CSS Module을 생성하시겠습니까? Yes

✨ 생성 완료!
```

**사용:**

```typescript
import { Button } from '@/shared/ui/Button';

<Button>클릭</Button>
```

---

### 3. Hook 제너레이터

**커스텀 훅을 생성합니다** (shared/hooks)

```bash
pnpm generate:hook
```

**질문:**

1. Hook 이름? (use 제외, 예: LocalStorage, WindowSize)

**생성되는 구조:**

```
src/shared/hooks/
├── use{Name}.ts
└── index.ts              # 자동으로 export 추가
```

**예제:**

```bash
$ pnpm generate:hook

? Hook 이름은? LocalStorage

✨ 생성 완료!
```

**사용:**

```typescript
import { useLocalStorage } from '@/shared/hooks';

const { value, setValue } = useLocalStorage();
```

---

### 4. Page 제너레이터

**Next.js 페이지를 생성합니다** (app directory)

```bash
pnpm generate:page
```

**질문:**

1. 페이지 경로? (예: dashboard, settings/profile)
2. 페이지 타입? (Server Component / Client Component)

**생성되는 구조:**

```
src/app/
└── {path}/
    └── page.tsx
```

**예제:**

```bash
$ pnpm generate:page

? 페이지 경로는? dashboard
? 페이지 타입은? Server Component

✨ 생성 완료!
```

---

## 💡 실전 예제

### 예제 1: 상품(Product) 기능 추가

```bash
# 1. Feature 생성
$ pnpm generate:feature

? Feature 이름은? product
? API 엔드포인트는? /products
? State management 방식은? 둘 다
? 단일 항목 조회 API도 생성하시겠습니까? Yes

# 2. 타입 정의
# src/entities/product/model/types.ts 수정
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

# 3. UI 수정
# src/features/product-list/ui/ProductList.tsx 커스터마이징

# 4. 페이지 생성
$ pnpm generate:page

? 페이지 경로는? products
? 페이지 타입은? Server Component

# 5. 페이지 연결
# src/app/products/page.tsx
import { ProductList } from '@/features/product-list';

export default function ProductsPage() {
  return <ProductList />;
}
```

**결과:** 완전히 동작하는 상품 목록 기능 완성! (약 5분 소요)

---

### 예제 2: 재사용 가능한 Card 컴포넌트

```bash
# Component 생성
$ pnpm generate:component

? 컴포넌트 이름은? Card
? CSS Module을 생성하시겠습니까? Yes

# 수정
# src/shared/ui/Card/Card.tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

# 사용
import { Card } from '@/shared/ui/Card';

<Card title="제목">내용</Card>
```

---

## 🎯 베스트 프랙티스

### 1. 네이밍 컨벤션

**Feature:**

- ✅ 단수형: `product`, `user`, `order`
- ❌ 복수형: `products`, `users`, `orders`
- 자동으로 복수형으로 변환됨

**Component:**

- ✅ PascalCase: `Button`, `UserCard`, `NavBar`
- ❌ camelCase: `button`, `userCard`

**Hook:**

- ✅ PascalCase (use 제외): `LocalStorage`, `WindowSize`
- ❌ camelCase 또는 use 포함: `localStorage`, `useLocalStorage`

### 2. 생성 후 확인 사항

**Feature 생성 후:**

- [ ] Entity 타입 정의 완성
- [ ] API 엔드포인트 확인
- [ ] UI 컴포넌트 커스터마이징
- [ ] 페이지 연결

**Component 생성 후:**

- [ ] Props 타입 정의
- [ ] 스타일링 완성
- [ ] 사용 예제 추가

**Hook 생성 후:**

- [ ] 로직 구현
- [ ] 타입 정의
- [ ] 테스트 추가

### 3. 커스터마이징

생성된 코드는 **시작점**입니다. 프로젝트 요구사항에 맞게 수정하세요.

```typescript
// 생성된 코드 (기본)
export interface Product {
  id: number;
  // TODO: 필드 정의
}

// 커스터마이징
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
}
```

---

## 🔧 템플릿 수정

템플릿 파일은 `templates/` 디렉토리에 있습니다.

```
templates/
├── entity/
│   └── types.ts.hbs
├── feature/
│   ├── api/
│   ├── hooks/
│   └── ui/
├── component/
├── hook/
└── page/
```

**템플릿 수정 예시:**

```handlebars
{{! templates/entity/types.ts.hbs }}
export interface
{{pascalCase name}}
{ id: number; name: string; // 기본 필드 추가 createdAt: string; // 기본 필드 추가 // TODO: 추가 필드 정의 }
```

**템플릿 문법:**

- `{{pascalCase name}}` - PascalCase 변환
- `{{camelCase name}}` - camelCase 변환
- `{{#if condition}}...{{/if}}` - 조건문
- `{{#each array}}...{{/each}}` - 반복문

---

## 📊 시간 절약 효과

| 작업      | 수동 | 제너레이터      | 절약    |
| --------- | ---- | --------------- | ------- |
| Feature   | 30분 | 5분 + 10분 수정 | **50%** |
| Component | 10분 | 2분 + 3분 수정  | **50%** |
| Hook      | 5분  | 1분 + 2분 수정  | **40%** |
| Page      | 5분  | 30초 + 2분 수정 | **50%** |

**연간 절약 (팀 4명):**

- Feature 주 2개: **~50시간/년**
- Component 주 3개: **~30시간/년**
- Hook 주 1개: **~10시간/년**
- **총: ~90시간/년 절약**

---

## ❓ 트러블슈팅

### 생성이 안 됨

```bash
# plop 버전 확인
pnpm plop --version

# 재설치
pnpm add -D plop
```

### 템플릿 에러

```bash
Error: Missing helper: "eq"
```

**해결:** `plopfile.js`에 helper 추가 필요 (이미 설정됨)

### 기존 파일 덮어쓰기

제너레이터는 **기존 파일을 덮어쓰지 않습니다**.
기존 파일이 있으면 에러가 발생합니다.

**해결:**

1. 파일 삭제 후 재생성
2. 다른 이름으로 생성

---

## 🎓 추가 학습

- [Plop.js 공식 문서](https://plopjs.com/)
- [Handlebars 템플릿](https://handlebarsjs.com/)
- [FSD 아키텍처](https://feature-sliced.design/)

---

## 💬 피드백

제너레이터 개선 제안이나 버그 리포트는 이슈로 등록해주세요.

**원하는 제너레이터:**

- API Function
- Zustand Store
- Validation Schema (Zod)
- Test File

언제든지 요청하세요!
