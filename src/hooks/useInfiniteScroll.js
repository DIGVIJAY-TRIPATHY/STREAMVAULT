import { useEffect, useRef } from "react";

/**
 * Observes a sentinel element and calls `onIntersect` whenever it enters
 * the viewport. Returns a ref to attach to the sentinel element.
 */
export function useInfiniteScroll(onIntersect, options = {}) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onIntersect);

  callbackRef.current = onIntersect;

  useEffect(() => {
    const element = sentinelRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbackRef.current?.();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.root, options.rootMargin, options.threshold]);

  return sentinelRef;
}

export default useInfiniteScroll;
