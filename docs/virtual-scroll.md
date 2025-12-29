# Virtual Scroll

TanStack Virtual을 활용한 대용량 데이터 렌더링 최적화 및 스크롤 위치 복원

## 개요

Virtual Scroll은 화면에 보이는 영역의 아이템만 DOM에 렌더링하여 대용량 데이터를 효율적으로 처리합니다.

## 주요 기능

- **성능 최적화**: 가상화를 통해 수천 개 아이템도 부드럽게 렌더링
- **무한 스크롤**: TanStack Query의 useInfiniteQuery와 통합
- **정확한 스크롤 복원**: 인덱스 기반 복원으로 오차 없는 위치 복원
- **타입 안전**: 완전한 TypeScript 지원

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

### 3. 스크롤 위치 저장/복원

```tsx
import { VirtualList } from '@shared/ui';
import { useScrollRestoration } from '@shared/hooks';

function ListWithRestore() {
  const { savedState, saveScroll, markRestored } = useScrollRestoration({
    key: 'my-list',
  });

  return (
    <VirtualList
      data={items}
      estimateSize={100}
      restoreState={savedState}
      onRestoreComplete={markRestored}
      onScrollChange={saveScroll}
      renderItem={item => <div>{item.name}</div>}
    />
  );
}
```

## API

### VirtualList Props

| Prop                | Type                                           | Required | Description                               |
| ------------------- | ---------------------------------------------- | -------- | ----------------------------------------- |
| `data`              | `T[]`                                          | ✓        | 렌더링할 데이터 배열                      |
| `estimateSize`      | `number`                                       | ✓        | 각 아이템의 예상 높이 (px)                |
| `renderItem`        | `(item: T, index: number) => ReactNode`        | ✓        | 아이템 렌더링 함수                        |
| `onScrollChange`    | `(info: ScrollInfo) => void`                   | -        | 스크롤 정보 변경 콜백                     |
| `restoreState`      | `{ startIndex: number; offsetInItem: number }` | -        | 복원할 스크롤 상태                        |
| `onRestoreComplete` | `() => void`                                   | -        | 복원 완료 콜백                            |
| `overscan`          | `number`                                       | -        | 뷰포트 밖 미리 렌더링 아이템 수 (기본: 5) |
| `onLoadMore`        | `() => void`                                   | -        | 무한 스크롤 로드 콜백                     |
| `hasMore`           | `boolean`                                      | -        | 더 로드할 데이터 존재 여부                |
| `isLoadingMore`     | `boolean`                                      | -        | 로딩 중 여부                              |

### useScrollRestoration Hook

```tsx
const {
  savedState, // 저장된 스크롤 상태 { startIndex, offsetInItem, dataLength }
  saveScroll, // 저장 함수 (Throttle 적용)
  markRestored, // 복원 완료 표시 함수
  clearScroll, // 상태 삭제 함수
  isRestoring, // 복원 진행 중 여부
} = useScrollRestoration({ key: 'unique-key' });
```

## 스크롤 복원 메커니즘

### 기존 방식 (offset 기반) - 문제점

offset(scrollTop)을 저장하면 아이템 크기 측정 차이로 복원 위치가 부정확함.

### 개선 방식 (인덱스 기반)

1. **저장**: 첫 번째 보이는 아이템의 인덱스 + 아이템 내 세부 오프셋 저장
2. **복원**: `scrollToIndex()`로 해당 인덱스로 이동 후 세부 오프셋 적용
3. **장점**: 아이템 크기와 무관하게 정확한 위치 복원

```
저장되는 정보:
- startIndex: 화면 최상단의 아이템 인덱스
- offsetInItem: 해당 아이템이 얼마나 스크롤되었는지 (px)
- dataLength: 복원에 필요한 최소 데이터 개수
```

## 예제

- 목록 페이지: `/example/virtual-scroll`
- 상세 페이지: `/example/virtual-scroll/detail?id={postId}`
