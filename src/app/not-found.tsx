import Link from 'next/link';

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
      }}
    >
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#0070f3' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>페이지를 찾을 수 없습니다</h2>
      <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '600px' }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>

      <Link
        href="/"
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid #0070f3',
          background: '#0070f3',
          color: 'white',
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
