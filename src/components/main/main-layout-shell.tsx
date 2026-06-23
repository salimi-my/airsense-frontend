import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppSidebar } from "@/components/main/app-sidebar";
import { BreadcrumbContent } from "@/components/main/breadcrumb-content";
import { Footer } from "@/components/main/footer";
import { Header } from "@/components/main/header";
import { SWRProvider } from "@/components/providers/swr-provider";
import { UserProvider } from "@/components/providers/user-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/server-auth";

export function MainLayoutFallback() {
  return (
    <div className="bg-background min-h-svh">
      <div className="bg-background/80 fixed inset-x-0 top-0 z-40 h-16 border-b backdrop-blur">
        <Skeleton className="mx-4 mt-4 h-8 w-48" />
      </div>
      <div className="mx-auto mt-16 max-w-screen-xl space-y-6 p-4">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export async function MainLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const isAdmin = user.role?.name === "admin";

  return (
    <SWRProvider user={user}>
      <UserProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar isAdmin={isAdmin} />
          <SidebarInset className="overflow-x-hidden">
            <Header user={user} />
            <div className="mt-16 flex min-h-[calc(100svh-160px)] flex-1 flex-col gap-6 p-4">
              <BreadcrumbContent />
              {children}
            </div>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </SWRProvider>
  );
}
