export const createHeaders = (body?: unknown, customHeaders?: HeadersInit, acceptLanguage?: string): HeadersInit => {
  const headers: Record<string, string> = { accept: '*/*' };

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (acceptLanguage) {
    headers['Accept-Language'] = acceptLanguage;
  }

  return { ...headers, ...customHeaders };
};

export const serializeBody = (body: unknown): BodyInit | undefined => {
  if (!body) return undefined;
  if (body instanceof FormData) return body;
  return JSON.stringify(body);
};

export const buildURL = (baseURL: string, endpoint: string, params?: Record<string, unknown>): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;

  if (normalizedBase.startsWith('http://') || normalizedBase.startsWith('https://')) {
    const url = new URL(normalizedEndpoint, normalizedBase);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  let url = normalizedBase + normalizedEndpoint;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};

/**
 * Zod 스키마를 사용하여 데이터 유효성 검사
 * @param schema Zod 스키마
 * @param data 검사할 데이터
 * @returns 유효성 검사가 통과된 데이터
 * @throws ZodError 유효성 검사 실패 시
 */
import type { z } from 'zod';

export const validateResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  return schema.parse(data);
};
