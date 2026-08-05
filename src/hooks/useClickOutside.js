import { useEffect } from "react";

/**
 * Calls `handler` whenever a pointer event occurs outside of `ref`'s element.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    if (!handler) return;

    const listener = (event) => {
      const element = ref?.current;

      if (!element || element.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;
