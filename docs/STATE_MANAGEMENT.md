# 상태 관리 가이드

> **Zustand** - 경량 클라이언트 상태 관리

## 상태 분류

| 상태 타입      | 도구           | 예시                     |
| -------------- | -------------- | ------------------------ |
| **서버**       | TanStack Query | API 데이터, 사용자 목록  |
| **클라이언트** | Zustand        | 모달, 테마, 필터         |
| **URL**        | Next.js Params | 페이지 ID, 쿼리 파라미터 |

---

## Zustand 기본

### 1. 스토어 생성

```typescript
// shared/store/useModalStore.ts
import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
```

### 2. 컴포넌트에서 사용

```typescript
'use client';

export function Modal() {
  const { isOpen, close } = useModalStore();

  if (!isOpen) return null;
  return <div onClick={close}>모달</div>;
}

export function Button() {
  const open = useModalStore((state) => state.open);
  return <button onClick={open}>열기</button>;
}
```

---

## 고급 기능

### Persist (LocalStorage 저장)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    set => ({
      theme: 'light',
      setTheme: theme => set({ theme }),
    }),
    { name: 'theme-storage' }
  )
);
```

### 비동기 액션

```typescript
export const useUserStore = create<UserStore>(set => ({
  user: null,

  fetchUser: async (id: number) => {
    const user = await getUser(id);
    set({ user });
  },

  logout: () => set({ user: null }),
}));
```

### DevTools 연동

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(set => ({
    count: 0,
    increment: () => set(state => ({ count: state.count + 1 })),
  }))
);
```

---

## 베스트 프랙티스

### 1. 작은 스토어 여러 개

```typescript
// ✅ Good: 기능별 분리
useModalStore;
useThemeStore;
useCartStore;

// ❌ Bad: 거대한 단일 스토어
useGlobalStore;
```

### 2. 선택자 사용 (리렌더링 최적화)

```typescript
// ✅ Good: 필요한 것만 구독
const count = useStore(state => state.count);

// ❌ Bad: 전체 스토어 구독
const { count, user, theme } = useStore();
```

### 3. 서버 데이터는 React Query 사용

```typescript
// ❌ Bad: Zustand로 서버 데이터
const users = useUserStore(state => state.users);

// ✅ Good: React Query로 서버 데이터
const { data: users } = useUsers();
```

---

## 실전 예제

### 테마 전환

```typescript
// shared/store/useThemeStore.ts
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'theme' }
  )
);

// 사용
'use client';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return <button onClick={toggleTheme}>{theme}</button>;
}
```

### 장바구니

```typescript
export const useCartStore = create<CartStore>(set => ({
  items: [],

  addItem: item => set(state => ({ items: [...state.items, item] })),

  removeItem: id =>
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    })),

  clear: () => set({ items: [] }),
}));
```

---

📚 **상세 문서**: [Zustand Docs](https://zustand-demo.pmnd.rs/)
