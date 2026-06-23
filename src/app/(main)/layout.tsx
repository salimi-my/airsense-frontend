import { Suspense } from "react";

import {
  MainLayoutFallback,
  MainLayoutShell,
} from "@/components/main/main-layout-shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<MainLayoutFallback />}>
      <MainLayoutShell>{children}</MainLayoutShell>
    </Suspense>
  );
}
