"use client";

import { useEffect } from "react";

const SW_UPDATE_CHECK_KEY = "sw-update-checked";

async function clearStaleServiceWorkerCaches() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void clearStaleServiceWorkerCaches();
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered successfully:",
          registration.scope,
        );

        if (sessionStorage.getItem(SW_UPDATE_CHECK_KEY) !== "1") {
          sessionStorage.setItem(SW_UPDATE_CHECK_KEY, "1");
          registration.update();
        }
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }, []);

  return null;
}
