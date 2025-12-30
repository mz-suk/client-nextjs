import Link from 'next/link';

/**
 * 404 Not Found 페이지
 * 존재하지 않는 페이지에 접근했을 때 표시됩니다.
 *
 * Next.js 모범 사례:
 * - app/not-found.tsx에 배치하여 전역 404 처리
 * - 특정 경로의 404는 해당 경로에 not-found.tsx 추가
 * - notFound() 함수로 명시적으로 404 트리거 가능
 * - Server Component로 작성 (클라이언트 코드 사용 불가)
 */
export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      }}
    >
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '8rem', margin: 0, color: '#0070f3', fontWeight: '700', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '2rem', margin: '1.5rem 0 0.5rem', color: '#1e293b', fontWeight: '600' }}>페이지를 찾을 수 없습니다</h2>
        <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>

        <Link
          href="/"
          style={{
            padding: '0.875rem 2rem',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '8px',
            border: 'none',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
