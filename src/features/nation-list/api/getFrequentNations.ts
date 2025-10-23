import type { Nation } from '@/entities/nation';
import { fetchAPI } from '@/shared/api';
import { logger } from '@/shared/lib';
import type { ApiResponse } from '@/shared/types';

export async function getFrequentNations(): Promise<Nation[]> {
  try {
    const response = await fetchAPI<ApiResponse<Nation[]>>('/common/nation/frequent');

    if (response.resultCode !== 200) {
      logger.error('자주 사용하는 국가 조회 실패:', response.resultMessage);
      throw new Error(response.resultMessage || '자주 사용하는 국가 조회에 실패했습니다.');
    }

    return response.result || [];
  } catch (error) {
    logger.error('getFrequentNations 에러:', error);
    throw error;
  }
}
