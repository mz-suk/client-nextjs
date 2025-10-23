import type { Nation, NationSearchParams } from '@/entities/nation';
import { fetchAPI } from '@/shared/api';
import { logger } from '@/shared/lib';
import type { ApiResponse } from '@/shared/types';

export async function getNations(params?: NationSearchParams): Promise<Nation[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.keyword) {
      queryParams.append('keyword', params.keyword);
    }

    const url = `/common/search/nations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetchAPI<ApiResponse<Nation[]>>(url);

    if (response.resultCode !== 200) {
      logger.error('국가 검색 실패:', response.resultMessage);
      throw new Error(response.resultMessage || '국가 검색에 실패했습니다.');
    }

    return response.result || [];
  } catch (error) {
    logger.error('getNations 에러:', error);
    throw error;
  }
}
