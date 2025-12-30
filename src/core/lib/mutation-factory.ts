import {
  type DefaultError,
  type QueryClient,
  type QueryKey,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';

/**
 * Mutation Factory Helpers
 *
 * React Query v5 + React 19 최적화된 Mutation 패턴
 * Optimistic Updates, 자동 캐시 무효화 등의 기능 제공
 */

type MutationConfig<TData, TVariables, TError = DefaultError, TContext = unknown> = Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;

interface MutationContext<TData> {
  previousData?: TData;
}

interface OptimisticUpdateConfig<TData, TVariables> {
  queryKey: QueryKey;
  updater: (oldData: TData, variables: TVariables) => TData;
}

/**
 * 기본 Mutation Hook 생성
 *
 * @param mutationFn Mutation 함수
 * @param config Mutation 옵션 (invalidateKeys 포함)
 * @returns Mutation hook
 *
 * @example
 * export const useUpdatePost = createMutation(
 *   ({ id, data }: UpdatePostParams) => postApi.update(id, data),
 *   {
 *     invalidateKeys: [postKeys.details(), postKeys.lists()],
 *     onSuccess: () => toast.success('수정 완료'),
 *   }
 * );
 */
export const createMutation = <TData, TVariables, TError = DefaultError, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config?: Omit<MutationConfig<TData, TVariables, TError, TContext>, 'onSuccess'> & {
    invalidateKeys?: QueryKey[];
    onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  }
): (() => UseMutationResult<TData, TError, TVariables, TContext>) => {
  return () => {
    const queryClient = useQueryClient();
    const { invalidateKeys, onSuccess: customOnSuccess, ...restConfig } = config ?? {};

    const options: UseMutationOptions<TData, TError, TVariables, TContext> = {
      ...restConfig,
      mutationFn,
      onSuccess: (data, variables, context) => {
        if (invalidateKeys) {
          invalidateKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
        if (customOnSuccess) {
          customOnSuccess(data, variables, context);
        }
      },
    };

    return useMutation(options);
  };
};

/**
 * Optimistic Update를 지원하는 Mutation Hook 생성
 *
 * @param mutationFn Mutation 함수
 * @param optimisticConfig Optimistic update 설정
 * @param config 추가 Mutation 옵션
 * @returns Mutation hook
 *
 * @example
 * export const useUpdatePost = createOptimisticMutation(
 *   ({ id, data }: UpdatePostParams) => postApi.update(id, data),
 *   {
 *     queryKey: postKeys.detail(id),
 *     updater: (oldPost, { data }) => ({ ...oldPost, ...data }),
 *   },
 *   {
 *     invalidateKeys: [postKeys.lists()],
 *   }
 * );
 */
interface OptimisticMutationContext<TData, TContext = unknown> {
  previousData?: TData;
  userContext?: TContext;
}

export const createOptimisticMutation = <TData, TVariables, TError = DefaultError, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  optimisticConfig: OptimisticUpdateConfig<TData, TVariables>,
  config?: Omit<MutationConfig<TData, TVariables, TError>, 'onMutate' | 'onError' | 'onSuccess'> & {
    invalidateKeys?: QueryKey[];
    onMutate?: (variables: TVariables) => Promise<TContext | void> | TContext | void;
    onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
    onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  }
): (() => UseMutationResult<TData, TError, TVariables, OptimisticMutationContext<TData, TContext>>) => {
  return () => {
    const queryClient = useQueryClient();
    const { invalidateKeys, onMutate, onError, onSuccess, ...mutationConfig } = config ?? {};

    const options: UseMutationOptions<TData, TError, TVariables, OptimisticMutationContext<TData, TContext>> = {
      mutationFn,
      ...mutationConfig,
      onMutate: async variables => {
        await queryClient.cancelQueries({ queryKey: optimisticConfig.queryKey });

        const previousData = queryClient.getQueryData<TData>(optimisticConfig.queryKey);

        if (previousData) {
          queryClient.setQueryData(optimisticConfig.queryKey, optimisticConfig.updater(previousData, variables));
        }

        const userContext = await onMutate?.(variables);

        return { previousData, userContext } as OptimisticMutationContext<TData, TContext>;
      },
      onError: (error, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(optimisticConfig.queryKey, context.previousData);
        }
        onError?.(error, variables, context?.userContext);
      },
      onSuccess: (data, variables, context) => {
        if (invalidateKeys) {
          invalidateKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
        onSuccess?.(data, variables, context?.userContext);
      },
    };

    return useMutation(options);
  };
};

/**
 * List 추가를 위한 Optimistic Mutation
 *
 * @param mutationFn Mutation 함수
 * @param config List mutation 설정
 * @returns Mutation hook
 *
 * @example
 * export const useCreatePost = createOptimisticListMutation(
 *   (data: CreatePostDto) => postApi.create(data),
 *   {
 *     listQueryKey: postKeys.lists(),
 *     generateOptimisticItem: (variables) => ({
 *       id: -Date.now(),
 *       ...variables,
 *       createdAt: new Date().toISOString(),
 *     }),
 *     position: 'start',
 *     invalidateKeys: [postKeys.lists()],
 *   }
 * );
 */
export const createOptimisticListMutation = <TData extends { id: string | number }, TVariables, TError = DefaultError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  config: {
    listQueryKey: QueryKey;
    generateOptimisticItem: (variables: TVariables) => TData;
    position?: 'start' | 'end';
    invalidateKeys?: QueryKey[];
  }
): (() => UseMutationResult<TData, TError, TVariables, MutationContext<TData[]>>) => {
  return () => {
    const queryClient = useQueryClient();
    const { listQueryKey, generateOptimisticItem, position = 'start', invalidateKeys } = config;

    const options: UseMutationOptions<TData, TError, TVariables, MutationContext<TData[]>> = {
      mutationFn,
      onMutate: async variables => {
        await queryClient.cancelQueries({ queryKey: listQueryKey });

        const previousList = queryClient.getQueryData<TData[]>(listQueryKey);
        const optimisticItem = generateOptimisticItem(variables);

        if (previousList) {
          const newList = position === 'start' ? [optimisticItem, ...previousList] : [...previousList, optimisticItem];
          queryClient.setQueryData(listQueryKey, newList);
        }

        return { previousData: previousList };
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(listQueryKey, context.previousData);
        }
      },
      onSuccess: () => {
        if (invalidateKeys) {
          invalidateKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          queryClient.invalidateQueries({ queryKey: listQueryKey });
        }
      },
    };

    return useMutation(options);
  };
};

/**
 * List 삭제를 위한 Optimistic Mutation
 *
 * @param mutationFn Mutation 함수
 * @param config Delete mutation 설정
 * @returns Mutation hook
 *
 * @example
 * export const useDeletePost = createOptimisticDeleteMutation(
 *   (id: number) => postApi.delete(id),
 *   {
 *     listQueryKey: postKeys.lists(),
 *     getId: (id) => id,
 *     invalidateKeys: [postKeys.details()],
 *   }
 * );
 */
export const createOptimisticDeleteMutation = <TData extends { id: string | number }, TVariables, TError = DefaultError>(
  mutationFn: (variables: TVariables) => Promise<void>,
  config: {
    listQueryKey: QueryKey;
    getId: (variables: TVariables) => string | number;
    invalidateKeys?: QueryKey[];
  }
): (() => UseMutationResult<void, TError, TVariables, MutationContext<TData[]>>) => {
  return () => {
    const queryClient = useQueryClient();
    const { listQueryKey, getId, invalidateKeys } = config;

    const options: UseMutationOptions<void, TError, TVariables, MutationContext<TData[]>> = {
      mutationFn,
      onMutate: async variables => {
        await queryClient.cancelQueries({ queryKey: listQueryKey });

        const previousList = queryClient.getQueryData<TData[]>(listQueryKey);
        const targetId = getId(variables);

        if (previousList) {
          const newList = previousList.filter(item => item.id !== targetId);
          queryClient.setQueryData(listQueryKey, newList);
        }

        return { previousData: previousList };
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(listQueryKey, context.previousData);
        }
      },
      onSuccess: () => {
        if (invalidateKeys) {
          invalidateKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        }
      },
    };

    return useMutation(options);
  };
};

/**
 * 여러 쿼리를 무효화하는 헬퍼 함수
 */
export const invalidateQueries = (queryClient: QueryClient, keys: QueryKey[]) => {
  return Promise.all(keys.map(key => queryClient.invalidateQueries({ queryKey: key })));
};
