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

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const buildURL = (baseURL: string, endpoint: string, params?: Record<string, unknown>): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;

  // 절대 URL인 경우
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

  // 상대 경로인 경우 (클라이언트 환경)
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
