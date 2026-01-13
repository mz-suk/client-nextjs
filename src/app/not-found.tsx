import Link from 'next/link';

import styles from './not-found.module.scss';

/**
 * 404 Not Found 페이지
 *
 * @description 존재하지 않는 페이지 접근 시 표시
 * - app/not-found.tsx에 배치하여 전역 404 처리
 * - 특정 경로의 404는 해당 경로에 not-found.tsx 추가
 * - notFound() 함수로 명시적 트리거 가능
 * - Server Component로 작성 (클라이언트 코드 사용 불가)
 */
export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>페이지를 찾을 수 없습니다</h2>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>

        <Link href="/" className={styles.button}>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
