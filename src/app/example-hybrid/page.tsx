import { getUsers, UserListHybrid } from '@/features/user-list';

export default async function ExampleHybridPage() {
  const users = await getUsers();

  return <UserListHybrid initialUsers={users} />;
}
