import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
          <li>
            <Link href="/example-api-usage">API 사용 예제</Link>
          </li>
          <li>
            <Link href="/example-isr">ISR 예제</Link>
          </li>
          <li>
            <Link href="/api/health">Health Check</Link>
          </li>
        </ol>
      </main>
    </div>
  );
}
