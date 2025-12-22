# 상태 관리

## 상태 분류

| 상태 타입           | 도구           | 예시                    |
| ------------------- | -------------- | ----------------------- |
| **서버 상태**       | TanStack Query | API 데이터, 사용자 목록 |
| **클라이언트 상태** | Zustand        | 모달, 테마, UI 설정     |
| **URL 상태**        | Next.js        | 페이지 파라미터, 쿼리   |

## Zustand

경량 클라이언트 상태 관리 (~1KB)

### 기본 사용

**스토어 생성**

```typescript
// domains/counter/stores/useCounterStore.ts
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterStore>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

**컴포넌트에서 사용**

```typescript
'use client';
import { useCounterStore } from '@/domains/counter';

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**부분 선택 (리렌더링 최적화)**

```typescript
// ✅ count만 구독
const count = useCounterStore(state => state.count);

// ❌ 전체 스토어 구독 (불필요한 리렌더링)
const { count, increment } = useCounterStore();
```

## 고급 기능

### Persist (LocalStorage)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    set => ({
      theme: 'light' as 'light' | 'dark',
      toggleTheme: () =>
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

### DevTools

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(set => ({
    count: 0,
    increment: () => set(state => ({ count: state.count + 1 })),
  }))
);
```

Redux DevTools에서 상태 변경 추적 가능

### 비동기 액션

```typescript
export const useUserStore = create<UserStore>(set => ({
  user: null,
  isLoading: false,

  fetchUser: async (id: number) => {
    set({ isLoading: true });
    try {
      const user = await getUser(id);
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  logout: () => set({ user: null }),
}));
```

### 여러 스토어 조합

```typescript
export const useCartActions = () => {
  const addToCart = useCartStore(state => state.addItem);
  const incrementCount = useCounterStore(state => state.increment);

  return {
    addAndCount: item => {
      addToCart(item);
      incrementCount();
    },
  };
};
```

## 실전 예제

### 모달 관리

```typescript
// shared/stores/useModalStore.ts
export const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  content: null,
  open: content => set({ isOpen: true, content }),
  close: () => set({ isOpen: false, content: null }),
}));
```

```typescript
// 사용
const { open, close } = useModalStore();

<button onClick={() => open(<LoginForm />)}>로그인</button>
```

### 장바구니

```typescript
export const useCartStore = create<CartStore>(
  persist(
    set => ({
      items: [],

      addItem: item =>
        set(state => ({
          items: [...state.items, item],
        })),

      removeItem: id =>
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set(state => ({
          items: state.items.map(item => (item.id === id ? { ...item, quantity } : item)),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'cart' }
  )
);
```

### 필터 상태

```typescript
export const useFilterStore = create<FilterStore>(set => ({
  search: '',
  category: 'all',
  sortBy: 'name',

  setSearch: search => set({ search }),
  setCategory: category => set({ category }),
  setSortBy: sortBy => set({ sortBy }),
  reset: () => set({ search: '', category: 'all', sortBy: 'name' }),
}));
```

## 베스트 프랙티스

### 1. 작은 스토어 여러 개

```typescript
// ✅ 기능별 분리
useModalStore;
useThemeStore;
useCartStore;

// ❌ 거대한 단일 스토어
useGlobalStore;
```

### 2. 선택자 사용

```typescript
// ✅ 필요한 것만 구독
const count = useStore(state => state.count);

// ❌ 전체 구독
const { count, user, theme } = useStore();
```

### 3. 서버 데이터는 TanStack Query

```typescript
// ❌ Zustand로 서버 데이터
const users = useStore(state => state.users);

// ✅ TanStack Query로 서버 데이터
const { data: users } = useUsers();
```

### 4. 타입 안전성

```typescript
// ✅ 인터페이스 정의
interface CounterStore {
  count: number;
  increment: () => void;
}

export const useCounterStore = create<CounterStore>(...);
```

## 선택 가이드

| 상황                 | 도구                    |
| -------------------- | ----------------------- |
| API 데이터           | TanStack Query          |
| UI 상태 (모달, 테마) | Zustand                 |
| 폼 상태              | React Hook Form         |
| URL 파라미터         | Next.js useSearchParams |
| 전역 설정            | Zustand + Persist       |

## 참고

- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [TanStack Query 문서](https://tanstack.com/query/latest)
