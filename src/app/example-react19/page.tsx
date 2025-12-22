import { UserListWithUse } from '@/domains/user';
import { Suspense } from 'react';

import { Button } from '@base-ui/react/button';
import styles from './page.module.scss';

export default function ExampleReact19Page() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>}>
      <UserListWithUse />
      <Button className={styles.Button}>Submit</Button>
    </Suspense>
  );
}
