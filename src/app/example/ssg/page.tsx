import { getUsers } from '@/domains/user/services';

import { UserListClient } from './UserListClient';

/**
 * SSG + TanStack Query 예제
 * - 빌드 타임에 데이터를 prefetch
 * - 클라이언트에서 TanStack Query로 상태 관리
 * - 자동 리페치, 캐싱, 백그라운드 업데이트 지원
 */
export default async function SSGPage() {
  // 서버에서 초기 데이터 가져오기 (SSG)
  const initialUsers = await getUsers();

  return <UserListClient initialUsers={initialUsers} />;
}
