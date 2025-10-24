import { API_CONFIG, APP_METADATA, SERVER_CONFIG, isDebug, isDev } from '@/shared/config/constants';
import { parsed } from '@/shared/config/env';
import styles from './page.module.css';

export default function EnvCheckPage() {
  const buildTime = new Date().toISOString();

  const envData = {
    buildInfo: {
      buildTime,
      nodeEnv: parsed.NODE_ENV,
      isDev,
      isDebug,
      isAnalyze: parsed.ANALYZE,
    },
    apiConfig: {
      baseUrl: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      acceptLanguage: API_CONFIG.ACCEPT_LANGUAGE,
    },
    appMetadata: {
      name: APP_METADATA.NAME,
      description: APP_METADATA.DESCRIPTION,
      version: APP_METADATA.VERSION,
    },
    serverConfig: {
      apiTargetUrl: SERVER_CONFIG.API_TARGET_URL || '(서버 전용 - 클라이언트에서는 undefined)',
    },
    rawEnv: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
      NEXT_PUBLIC_FEATURE_DEBUG: process.env.NEXT_PUBLIC_FEATURE_DEBUG,
      NEXT_PUBLIC_API_ACCEPT_LANGUAGE: process.env.NEXT_PUBLIC_API_ACCEPT_LANGUAGE,
      API_TARGET_URL: process.env.API_TARGET_URL,
      NODE_ENV: process.env.NODE_ENV,
      ANALYZE: process.env.ANALYZE,
    },
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>환경 변수 확인 페이지</h1>
        <p>빌드 환경에 따른 환경 변수 적용 상태를 확인합니다</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>📦 빌드 정보</h2>
          <div className={styles.card}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>빌드 시간</td>
                  <td className={styles.value}>{envData.buildInfo.buildTime}</td>
                </tr>
                <tr>
                  <td className={styles.label}>NODE_ENV</td>
                  <td className={styles.value}>
                    <span className={envData.buildInfo.nodeEnv === 'production' ? styles.prod : styles.dev}>{envData.buildInfo.nodeEnv}</span>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>isDev</td>
                  <td className={styles.value}>{envData.buildInfo.isDev ? '✅' : '❌'}</td>
                </tr>
                <tr>
                  <td className={styles.label}>isDebug</td>
                  <td className={styles.value}>{envData.buildInfo.isDebug ? '✅' : '❌'}</td>
                </tr>
                <tr>
                  <td className={styles.label}>isAnalyze</td>
                  <td className={styles.value}>{envData.buildInfo.isAnalyze ? '✅' : '❌'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🌐 API 설정</h2>
          <div className={styles.card}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>BASE_URL</td>
                  <td className={styles.value}>{envData.apiConfig.baseUrl}</td>
                </tr>
                <tr>
                  <td className={styles.label}>TIMEOUT</td>
                  <td className={styles.value}>{envData.apiConfig.timeout}ms</td>
                </tr>
                <tr>
                  <td className={styles.label}>ACCEPT_LANGUAGE</td>
                  <td className={styles.value}>{envData.apiConfig.acceptLanguage}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>ℹ️ 앱 메타데이터</h2>
          <div className={styles.card}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>NAME</td>
                  <td className={styles.value}>{envData.appMetadata.name}</td>
                </tr>
                <tr>
                  <td className={styles.label}>DESCRIPTION</td>
                  <td className={styles.value}>{envData.appMetadata.description}</td>
                </tr>
                <tr>
                  <td className={styles.label}>VERSION</td>
                  <td className={styles.value}>{envData.appMetadata.version}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🔒 서버 전용 설정</h2>
          <div className={styles.card}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>API_TARGET_URL</td>
                  <td className={styles.value}>{envData.serverConfig.apiTargetUrl}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🔍 Raw 환경 변수 (process.env)</h2>
          <div className={styles.card}>
            <pre className={styles.json}>{JSON.stringify(envData.rawEnv, null, 2)}</pre>
          </div>
        </section>

        <section className={styles.section}>
          <h2>📋 테스트 방법</h2>
          <div className={styles.card}>
            <div className={styles.instructions}>
              <h3>1. 개발 환경 (.env.development)</h3>
              <code className={styles.code}>pnpm dev</code>
              <p>→ NODE_ENV=development, isDev=true</p>

              <h3>2. 프로덕션 빌드 (.env.production)</h3>
              <code className={styles.code}>pnpm build</code>
              <code className={styles.code}>pnpm start</code>
              <p>→ NODE_ENV=production, isDev=false</p>

              <h3>3. 프로덕션 개발 모드</h3>
              <code className={styles.code}>pnpm dev:prod</code>
              <p>→ NODE_ENV=production이지만 dev 서버</p>

              <h3>4. 번들 분석 모드</h3>
              <code className={styles.code}>pnpm analyze</code>
              <p>→ ANALYZE=true, 번들 분석 리포트 생성</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>⚠️ 주의사항</h2>
          <div className={styles.card}>
            <ul className={styles.notes}>
              <li>
                <strong>NEXT_PUBLIC_*</strong> 접두사가 있는 변수만 클라이언트에서 접근 가능
              </li>
              <li>
                <strong>API_TARGET_URL</strong>은 서버 전용 변수로 클라이언트에서는 undefined
              </li>
              <li>환경 변수는 빌드 시점에 정적으로 치환됨 (런타임 변경 불가)</li>
              <li>
                .env 파일 우선순위:{' '}
                <code>
                  .env.{'{'}mode{'}'}.local
                </code>{' '}
                &gt;{' '}
                <code>
                  .env.{'{'}mode{'}'}
                </code>{' '}
                &gt; <code>.env.local</code> &gt; <code>.env</code>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
