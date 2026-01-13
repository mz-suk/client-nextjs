'use client';

import { ExampleLayout, PostList } from '@domains/example';
import { Accordion } from '@shared/ui/Accordion';
/**
 * CSR (Client-Side Rendering) 데이터 패칭 예제
 *
 * 사용 사례:
 * - 실시간 데이터 (예: 주식 시세, 채팅)
 * - 사용자별 개인화 데이터 (예: 대시보드, 마이페이지)
 * - SEO가 중요하지 않은 프라이빗 경로
 */
export default function CSRPage() {
  return (
    <ExampleLayout
      title="CSR 데이터 패칭"
      description="클라이언트 사이드에서만 데이터를 가져옵니다. 실시간성이나 보안이 필요한 데이터에 적합합니다."
      tip='네트워크 탭에서 "Slow 3G"로 설정하면 전역 로딩 상태를 명확하게 확인할 수 있습니다.'
    >
      <Accordion.Root>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>질문 1</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>답변 내용이 여기에 들어갑니다.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>질문 2</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>두 번째 답변 내용입니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <PostList />
    </ExampleLayout>
  );
}
