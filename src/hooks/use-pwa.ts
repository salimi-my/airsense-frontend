import * as React from "react";

type PwaMode = "pwa" | "browser";

function determinePwaMode(): PwaMode {
  if (typeof window === "undefined") return "browser";

  const isStandaloneMedia =
    window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  // iOS Safari prior to display-mode support
  const isNavigatorStandalone =
    (navigator as unknown as { standalone?: boolean })?.standalone === true;

  return isStandaloneMedia || isNavigatorStandalone ? "pwa" : "browser";
}

export function usePwaMode(): PwaMode {
  const [mode, setMode] = React.useState<PwaMode>(() => {
    // Avoid SSR mismatch; compute on client
    return typeof window === "undefined" ? "browser" : determinePwaMode();
  });

  React.useEffect(() => {
    const update = () => setMode(determinePwaMode());

    // Listen to display-mode changes when supported
    const mql = window.matchMedia?.("(display-mode: standalone)");
    mql?.addEventListener?.("change", update);

    // App installed event (can indicate transition to standalone on next launch)
    window.addEventListener("appinstalled", update);

    // Fallback: listen to focus which often accompanies mode changes after install/open
    window.addEventListener("focus", update);

    // Initial sync
    update();

    return () => {
      mql?.removeEventListener?.("change", update);
      window.removeEventListener("appinstalled", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  return mode;
}

export function useIsPwa(): boolean {
  const mode = usePwaMode();
  return mode === "pwa";
}
