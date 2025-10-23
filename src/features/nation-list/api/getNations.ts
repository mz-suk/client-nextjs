import type { Nation } from '@/entities/nation';
import { fetchAPI } from '@/shared/api';
import type { ApiResponse } from '@/shared/types';

export async function getNations(): Promise<Nation[]> {
  try {
    const response = await fetchAPI<ApiResponse<Nation[]>>('/common/search/nations');
    return response.result || [];
  } catch {
    return [];
  }
}
