import * as React from "react";

type ScrollPosition = {
  x: number | null;
  y: number | null;
};

type ScrollToFunction = (...args: [ScrollToOptions] | [number, number]) => void;

/**
 * Hook to track window scroll position and provide methods to scroll.
 * Uses rAF-based throttling so state updates are capped at ~60fps,
 * preventing a re-render on every pixel scrolled.
 * @returns [scrollPosition, scrollTo]
 */
export function useWindowScroll(): [ScrollPosition, ScrollToFunction] {
  const [state, setState] = React.useState<ScrollPosition>({
    x: null,
    y: null,
  });

  const scrollTo = React.useCallback(
    (...args: [ScrollToOptions] | [number, number]) => {
      if (typeof window === "undefined") return;

      if (typeof args[0] === "object") {
        window.scrollTo(args[0]);
      } else if (typeof args[0] === "number" && typeof args[1] === "number") {
        window.scrollTo(args[0], args[1]);
      } else {
        throw new Error(
          `Invalid arguments passed to scrollTo. See here for more info. https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo`,
        );
      }
    },
    [],
  );

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setState({ x: window.scrollX, y: window.scrollY });
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return [state, scrollTo];
}
