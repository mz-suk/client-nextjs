import type { SWRConfiguration } from 'swr';

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
  keepPreviousData: true,
};

export const swrConfigSSG: SWRConfiguration = {
  ...swrConfig,
  revalidateOnMount: true,
};

export const swrConfigCSR: SWRConfiguration = {
  ...swrConfig,
  revalidateOnMount: false,
};
