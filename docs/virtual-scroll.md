# Virtual Scroll

TanStack Virtual을 활용한 대용량 데이터 렌더링 최적화

## 개요

화면에 보이는 영역의 아이템만 DOM에 렌더링하여 대용량 데이터를 효율적으로 처리하는 가상 스크롤 구현입니다.

## 기능

- **성능 최적화**: 가상화로 대량 아이템 렌더링
- **가변 높이**: `measureElement`로 동적 높이 자동 측정
- **무한 스크롤**: `useInfiniteQuery`와 loader-row 패턴
- **중복 방지**: `useRef` 기반 페치 상태 관리
- **스크롤 복원**: 인덱스 기반 위치 저장/복원
- **접근성**: ARIA 속성, 시맨틱 HTML 지원
- **타입 안전**: TypeScript 완벽 지원

→ [TanStack Virtual 공식 문서](https://tanstack.com/virtual/latest)

## 아키텍처

```
src/
├── shared/
│   ├── ui/
│   │   └── VirtualList.tsx          # Virtual List 컴포넌트
│   ├── hooks/
│   │   └── useScrollRestoration.ts  # 스크롤 저장/복원 훅
│   └── stores/
│       └── useVirtualScrollStore.ts # 스크롤 상태 Store (Zustand)
└── app/example/virtual-scroll/
    ├── page.tsx                     # 목록 페이지
    ├── useVirtualScrollList.ts      # 비즈니스 로직 훅
    └── detail/page.tsx              # 상세 페이지
```

## 사용 방법

### 1. 기본 사용

```tsx
import { VirtualList } from '@shared/ui';

function MyList() {
  const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  return <VirtualList data={items} estimateSize={100} renderItem={item => <div>{item.name}</div>} />;
}
```

### 2. 무한 스크롤

```tsx
import { VirtualList } from '@shared/ui';

function InfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts();
  const posts = data?.pages.flatMap(page => page) ?? [];

  return (
    <VirtualList
      data={posts}
      estimateSize={120}
      onLoadMore={fetchNextPage}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      renderItem={post => <PostCard post={post} />}
    />
  );
}
```

### 3. 스크롤 위치 복원

```tsx
import { VirtualList } from '@shared/ui';
import { useScrollRestoration } from '@shared/hooks';

function ListWithRestore() {
  const { savedState, rememberIndex, markRestored, isRestoring } = useScrollRestoration({
    key: 'my-list',
  });

  const restoreState = savedState && isRestoring ? { startIndex: savedState.startIndex, offsetInItem: 0 } : null;

  return (
    <VirtualList
      data={items}
      estimateSize={100}
      restoreState={restoreState}
      onRestoreComplete={markRestored}
      renderItem={(item, index) => (
        <button type="button" onClick={() => rememberIndex(index, items.length)}>
          {item.name}
        </button>
      )}
    />
  );
}
```

## API

### VirtualList Props

| Prop                | Type                                                   | Required | Description                        |
| ------------------- | ------------------------------------------------------ | -------- | ---------------------------------- |
| `data`              | `T[]`                                                  | ✓        | 렌더링할 데이터 배열               |
| `estimateSize`      | `number`                                               | ✓        | 각 아이템의 예상 높이 (px)         |
| `renderItem`        | `(item: T, index: number) => ReactNode`                | ✓        | 아이템 렌더링 함수                 |
| `restoreState`      | `{ startIndex: number; offsetInItem: number } \| null` | -        | 복원할 스크롤 상태                 |
| `onRestoreComplete` | `() => void`                                           | -        | 복원 완료 콜백                     |
| `overscan`          | `number`                                               | -        | 뷰포트 밖 미리 렌더링 수 (기본: 5) |
| `onLoadMore`        | `() => void`                                           | -        | 로더가 뷰포트에 들어올 때 호출     |
| `hasMore`           | `boolean`                                              | -        | 더 로드할 데이터 존재 여부         |
| `isLoadingMore`     | `boolean`                                              | -        | 로딩 중 여부                       |
| `renderLoader`      | `({ hasMore, isLoadingMore }) => ReactNode`            | -        | 로더 UI 커스터마이즈               |
| `className`         | `string`                                               | -        | 추가 CSS 클래스                    |

### useScrollRestoration

```tsx
const {
  savedState, // 저장된 상태 { startIndex, offsetInItem, dataLength } | undefined
  rememberIndex, // (index: number, dataLength: number, offsetInItem?: number) => void
  markRestored, // () => void
  clearScroll, // () => void
  isRestoring, // boolean
} = useScrollRestoration({
  key?: string, // 기본값: pathname
  autoClear?: boolean // 기본값: true
});
```

## 동적 높이 처리

`measureElement`가 각 아이템의 실제 높이를 자동으로 측정하고 캐싱합니다.

### 작동 원리

1. **초기 렌더링**: `estimateSize`로 지정한 예상 높이로 배치
2. **실제 측정**: DOM 렌더링 후 실제 높이 측정
3. **자동 조정**: 측정된 높이로 스크롤 위치 재계산
4. **캐싱**: 측정된 높이는 캐싱되어 재사용

### 주의

- `estimateSize`는 실제 평균 높이에 가깝게 설정
- 이미지 등 비동기 콘텐츠 로드 완료 후 자동 재측정
- 아이템 내용 변경 시 자동 재측정

## 무한 스크롤 중복 호출 방지

### 문제

- `virtualItems`를 useEffect 의존성에 포함하면 스크롤마다 effect 재실행
- `isFetchingNextPage`가 즉시 true로 바뀌지 않아 중복 호출

### 해결

`useRef`로 페치 상태 관리:

```tsx
const isFetchingRef = useRef(false);

useEffect(() => {
  isFetchingRef.current = isLoadingMore;
}, [isLoadingMore]);

useEffect(() => {
  const [lastItem] = [...virtualItems].reverse();
  if (!lastItem || !onLoadMore || !hasMore || isFetchingRef.current) return;

  if (lastItem.index >= data.length - 1) {
    isFetchingRef.current = true;
    onLoadMore();
  }
}, [hasMore, onLoadMore, data.length, virtualItems]);
```

## 스크롤 복원

1. **저장**: `rememberIndex(index, dataLength)`로 인덱스 저장
2. **복원 준비**: 필요한 페이지 자동 로드
3. **위치 복원**: `scrollToIndex(..., { align: 'start' })`로 상단 배치
4. **정리**: `markRestored()` 호출 후 자동 정리

## 예제

`/example/virtual-scroll`에서 확인 가능
