/**
 * 공통 유틸리티 타입
 */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ValueOf<T> = T[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * 객체의 특정 키를 필수로 만드는 타입
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * 객체의 특정 키를 옵셔널로 만드는 타입
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Promise에서 Resolve되는 타입 추출
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * 비어있지 않은 배열 타입
 */
export type NonEmptyArray<T> = [T, ...T[]];
