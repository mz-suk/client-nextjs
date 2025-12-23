import { getUsers, UserListHybrid } from '@/domains/user';

export default async function ExampleHybridPage() {
  const users = await getUsers();

  return <UserListHybrid initialUsers={users} />;
}
