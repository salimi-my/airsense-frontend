"use client";

import { Loader } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useIsPwa } from "@/hooks/use-pwa";
import { cn } from "@/lib/utils";

const detectIsIOS = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

const subscribe = () => () => {};
let cachedIsIOS: boolean | null = null;
const getIsIOSSnapshot = (): boolean => {
  if (cachedIsIOS === null) {
    cachedIsIOS = detectIsIOS();
  }
  return cachedIsIOS;
};
const getIsIOSServerSnapshot = (): boolean => false;

export function PullToRefresh() {
  const isPwa = useIsPwa();
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isIOS = useSyncExternalStore(
    subscribe,
    getIsIOSSnapshot,
    getIsIOSServerSnapshot,
  );
  const touchStartY = useRef(0);
  const pullStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;
  const MAX_PULL_DISTANCE = 120;
  const INDICATOR_HEIGHT = 80;

  useEffect(() => {
    if (!isPwa || !isIOS) return;

    const isTouchInsideDrawer = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;

      return (
        !!target.closest("[data-vaul-drawer]") ||
        !!target.closest('[role="dialog"]') ||
        !!target.closest("[data-drawer]")
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isTouchInsideDrawer(e.target)) {
        touchStartY.current = 0;
        return;
      }

      const isAtTop = window.scrollY === 0;
      if (!isAtTop || isRefreshing) return;

      touchStartY.current = e.touches[0].clientY;
      pullStartY.current = window.scrollY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === 0 || isRefreshing) return;

      if (isTouchInsideDrawer(e.target)) {
        touchStartY.current = 0;
        setPullDistance(0);
        return;
      }

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;

      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();

        const resistance = 2.5;
        const distance = Math.min(diff / resistance, MAX_PULL_DISTANCE);
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance === 0 || isRefreshing) {
        touchStartY.current = 0;
        return;
      }

      if (pullDistance >= PULL_THRESHOLD) {
        setIsRefreshing(true);

        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setPullDistance(0);
      }

      touchStartY.current = 0;
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPwa, isIOS, pullDistance, isRefreshing]);

  if (!isPwa || !isIOS) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex justify-center"
      style={{
        transform: `translateY(${pullDistance > 0 || isRefreshing ? pullDistance - INDICATOR_HEIGHT : -INDICATOR_HEIGHT}px)`,
        transition:
          pullDistance === 0 && !isRefreshing
            ? "transform 0.3s ease-out"
            : "none",
      }}
    >
      <div className="bg-background/90 mt-4 flex items-center justify-center rounded-full p-3 shadow-lg backdrop-blur-sm">
        <Loader
          className={cn(
            "text-primary size-6",
            (isRefreshing || pullDistance >= PULL_THRESHOLD) && "animate-spin",
          )}
          style={
            isRefreshing || pullDistance >= PULL_THRESHOLD
              ? undefined
              : { transform: `rotate(${pullDistance * 2}deg)` }
          }
        />
      </div>
    </div>
  );
}
