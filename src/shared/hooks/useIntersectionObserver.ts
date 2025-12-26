import { useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  onIntersect: () => void;
  enabled?: boolean;
}

/**
 * Intersection Observer 커스텀 훅
 *
 * @example
 * ```tsx
 * const ref = useIntersectionObserver({
 *   onIntersect: fetchNextPage,
 *   enabled: hasNextPage,
 * });
 *
 * return <div ref={ref} />;
 * ```
 */
export function useIntersectionObserver({ threshold = 0.1, root = null, rootMargin = '0px', onIntersect, enabled = true }: UseIntersectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, root, rootMargin, onIntersect, enabled]);

  return ref;
}
