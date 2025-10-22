import { env, isDev, isProd } from '@/shared/config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: isDev ? 'development' : isProd ? 'production' : 'unknown',
    config: {
      apiUrl: env.API_URL,
      timeout: env.API_TIMEOUT,
      debug: env.FEATURE_DEBUG,
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}
