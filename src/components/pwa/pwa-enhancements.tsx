"use client";

import dynamic from "next/dynamic";

const InstallPrompt = dynamic(
  () => import("@/components/pwa/install-prompt").then((m) => m.InstallPrompt),
  { ssr: false },
);

const PullToRefresh = dynamic(
  () => import("@/components/pwa/pull-to-refresh").then((m) => m.PullToRefresh),
  { ssr: false },
);

export function PwaEnhancements() {
  return (
    <>
      <PullToRefresh />
      <InstallPrompt />
    </>
  );
}
