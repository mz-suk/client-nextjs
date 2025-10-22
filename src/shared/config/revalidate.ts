export const revalidateConfig = {
  static: 3600,
  dynamic: 60,
  short: 30,
  long: 86400,
} as const;

export type RevalidateTime = (typeof revalidateConfig)[keyof typeof revalidateConfig];
