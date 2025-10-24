import { getUser, getUsers } from '@/features/user-list/api';
import Link from 'next/link';
import { Suspense } from 'react';

// SSG: 빌드 시 정적 페이지 생성 대상 지정
export async function generateStaticParams() {
  const users = await getUsers();

  // 처음 10명만 빌드 시 생성 (나머지는 404)
  return users.slice(0, 10).map(user => ({
    id: user.id.toString(),
  }));
}

// SSG: 빌드 시 데이터 페칭
export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(Number(id));

  return (
    <main style={{ padding: '2rem' }}>
      <h1>사용자 상세 (SSG)</h1>
      <p>✅ 빌드 시 생성된 정적 페이지</p>

      <Suspense fallback={<div>로딩 중...</div>}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}>
          <h2>{user.name}</h2>
          <p>📧 {user.email}</p>
          <p>🌐 {user.website}</p>
          <p>🏢 {user.company.name}</p>
        </div>
      </Suspense>

      <Link href="/example-ssg" style={{ display: 'block', marginTop: '2rem' }}>
        ← 목록으로
      </Link>
    </main>
  );
}
