import { getUsers, UserListSSG } from '@/features/user-list';

export default async function ExampleSsgPage() {
  const users = await getUsers();
  const timestamp = new Date().toLocaleString('ko-KR');

  return <UserListSSG users={users} timestamp={timestamp} />;
}
