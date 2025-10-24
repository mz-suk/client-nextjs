import { Suspense } from 'react';
import { UserListWithUse } from '@/features/user-list/ui/UserListWithUse';

export default function ExampleReact19Page() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>}>
      <UserListWithUse />
    </Suspense>
  );
}
