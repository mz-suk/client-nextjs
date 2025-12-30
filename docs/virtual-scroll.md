# Virtual Scroll

TanStack Virtual을 활용한 대용량 데이터 렌더링 최적화 및 스크롤 위치 복원

## 개요

Virtual Scroll은 화면에 보이는 영역의 아이템만 DOM에 렌더링하여 대용량 데이터를 효율적으로 처리합니다.

## 주요 기능

- **성능 최적화**: 가상화를 통해 수천 개 아이템도 부드럽게 렌더링
- **가변 높이 지원**: `measureElement`로 동적 높이 자동 측정 및 캐싱
- **무한 스크롤**: TanStack Query의 `useInfiniteQuery`와 loader-row 패턴 결합
- **중복 호출 방지**: `useRef` 기반 페치 상태 관리로 API 중복 호출 완벽 차단
- **정확한 복원**: 상세 이동 시 클릭한 아이템 인덱스를 저장해 뒤로가기 시 상단에 배치
- **타입 안전**: 완전한 TypeScript 지원
- 참고: [TanStack Virtual 공식 문서](https://tanstack.com/virtual/latest), [Dynamic 예제](https://tanstack.com/virtual/latest/docs/framework/react/examples/dynamic), [Infinite Scroll 예제](https://tanstack.com/virtual/latest/docs/framework/react/examples/infinite-scroll)

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
      renderLoader={({ isLoadingMore }) => (
        <div style={{ padding: 16, textAlign: 'center' }}>{isLoadingMore ? '다음 페이지를 불러오는 중...' : '스크롤하면 더 불러옵니다'}</div>
      )}
      renderItem={post => <PostCard post={post} />}
    />
  );
}
```

### 3. 스크롤 위치 저장/복원

상세 페이지로 이동하기 직전에 클릭한 아이템의 인덱스를 저장해 뒤로가기 시 상단에 노출합니다.

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

| Prop                | Type                                           | Required | Description                                   |
| ------------------- | ---------------------------------------------- | -------- | --------------------------------------------- |
| `data`              | `T[]`                                          | ✓        | 렌더링할 데이터 배열                          |
| `estimateSize`      | `number`                                       | ✓        | 각 아이템의 예상 높이 (px, 대략치)            |
| `renderItem`        | `(item: T, index: number) => ReactNode`        | ✓        | 아이템 렌더링 함수                            |
| `restoreState`      | `{ startIndex: number; offsetInItem: number }` | -        | 복원할 스크롤 상태 (startIndex를 상단에 맞춤) |
| `onRestoreComplete` | `() => void`                                   | -        | 복원 완료 콜백                                |
| `overscan`          | `number`                                       | -        | 뷰포트 밖 미리 렌더링 아이템 수 (기본: 5)     |
| `onLoadMore`        | `() => void`                                   | -        | 로더 행이 뷰포트에 들어올 때 호출             |
| `hasMore`           | `boolean`                                      | -        | 더 로드할 데이터 존재 여부                    |
| `isLoadingMore`     | `boolean`                                      | -        | 로딩 중 여부                                  |
| `renderLoader`      | `({ hasMore, isLoadingMore }) => ReactNode`    | -        | 로더 행 UI 커스터마이즈                       |
| `className`         | `string`                                       | -        | 추가 CSS 클래스                               |

### useScrollRestoration Hook

```tsx
const {
  savedState, // 저장된 스크롤 상태 { startIndex, offsetInItem, dataLength }
  rememberIndex, // 상세 이동 직전 클릭 인덱스 저장
  markRestored, // 복원 완료 표시 함수
  clearScroll, // 상태 수동 삭제 함수
  isRestoring, // 복원 진행 중 여부
} = useScrollRestoration({ key: 'unique-key' });
```

## 동적 높이 처리

TanStack Virtual의 `measureElement`는 각 아이템의 실제 높이를 자동으로 측정하고 캐싱합니다.

### 작동 원리

1. **초기 렌더링**: `estimateSize`로 지정한 예상 높이로 아이템 배치
2. **실제 측정**: `measureElement` ref를 통해 DOM 렌더링 후 실제 높이 측정
3. **자동 조정**: 측정된 높이로 가상 스크롤 위치 재계산 및 업데이트
4. **캐싱**: 한 번 측정된 높이는 캐싱되어 재사용

### 주의사항

- `estimateSize`는 실제 평균 높이에 가깝게 설정할수록 초기 렌더링이 안정적입니다
- 이미지 등 비동기 로드 콘텐츠는 로드 완료 후 자동으로 재측정됩니다
- 아이템 내용이 변경되면 자동으로 높이가 재측정됩니다

## 무한 스크롤 중복 호출 방지

### 문제

- `virtualItems`를 useEffect 의존성에 포함하면 스크롤할 때마다 effect가 재실행됨
- TanStack Query의 `isFetchingNextPage`가 즉시 true로 바뀌지 않아 중복 호출 발생 가능

### 해결 방법

`useRef`로 페치 상태를 직접 관리하여 중복 호출을 완벽히 차단:

```tsx
const isFetchingRef = useRef(false);

// isLoadingMore 변경 시 ref 동기화
useEffect(() => {
  isFetchingRef.current = isLoadingMore;
}, [isLoadingMore]);

// 무한 스크롤 트리거
useEffect(() => {
  const [lastItem] = [...virtualItems].reverse();
  if (!lastItem || !onLoadMore) return;

  // ref로 중복 호출 완벽 차단
  if (lastItem.index >= data.length - 1 && hasMore && !isFetchingRef.current) {
    isFetchingRef.current = true;
    onLoadMore();
  }
}, [hasMore, onLoadMore, data.length, virtualItems]);
```

### 핵심 포인트

1. **`isFetchingRef`**: 페치 시작 시 즉시 true로 설정하여 중복 호출 차단
2. **동기화 effect**: `isLoadingMore` prop 변경 시 ref 업데이트
3. **마지막 아이템 추적**: `data.length - 1` 인덱스 도달 시 1회만 호출

## 스크롤 복원 메커니즘

1. **저장**: 상세 이동 직전에 `rememberIndex(index, dataLength)`로 클릭 인덱스를 저장
2. **복원 준비**: 복원 시 `savedState.startIndex`를 포함할 때까지 필요한 페이지를 자동 로드
3. **위치 복원**: `scrollToIndex(..., { align: 'start' })`로 해당 인덱스를 리스트 상단에 배치
4. **정리**: `onRestoreComplete`에서 `markRestored()` 호출 후 상태 자동 정리

저장되는 정보:

- `startIndex`: 클릭한 아이템 인덱스
- `offsetInItem`: 기본 0 (필요 시 미세 조정)
- `dataLength`: 복원에 필요한 최소 데이터 개수

## 예제

- 목록 페이지: `/example/virtual-scroll`
- 상세 페이지: `/example/virtual-scroll/detail?id={postId}`

## 추가 개선 아이디어

### 1. 가상 키보드 대응

모바일 환경에서 가상 키보드가 나타날 때 스크롤 위치 보정:

```tsx
useEffect(() => {
  const handleResize = () => {
    // 키보드 나타남/사라짐 감지 후 스크롤 위치 재조정
    virtualizer.measure();
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 2. 스켈레톤 UI

초기 로딩 시 스켈레톤 UI 표시:

```tsx
<VirtualList renderItem={item => (item ? <PostCard post={item} /> : <PostCardSkeleton />)} />
```

### 3. 에러 바운더리

무한 스크롤 중 에러 처리:

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfinitePosts();

if (error) {
  return <ErrorMessage error={error} onRetry={fetchNextPage} />;
}
```
