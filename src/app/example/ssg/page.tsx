import { Prefetch } from '@core/lib';
import { PostListSuspense, postQueries } from '@domains/example';

import { ExampleLayout } from '../_components';

export default async function SSGPage() {
  return (
    <ExampleLayout
      title="SSG + CSR 하이브리드"
      description="서버에서 미리 가져온 데이터를 기반으로 렌더링하므로 로딩 없이 즉시 화면이 보입니다."
      tip="페이지 소스 보기를 하면 데이터가 HTML에 포함되어 있는 것을 확인할 수 있습니다."
    >
      <Prefetch queries={[postQueries.list()]}>
        <PostListSuspense />
      </Prefetch>
    </ExampleLayout>
  );
}
