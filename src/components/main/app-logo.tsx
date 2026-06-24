import Image from "next/image";
import Link from "next/link";

import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

export function AppLogo({ name }: { name: string }) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      asChild
    >
      <Link href="/dashboard" onClick={() => setOpenMobile(false)}>
        <div className="bg-primary text-primary-foreground dark:bg-primary flex aspect-square size-8 items-center justify-center rounded-lg">
          <Image
            src="/airsense.png"
            alt={`${name} Logo`}
            className="mt-0"
            width={18}
            height={18}
          />
        </div>
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate text-base font-bold">{name}</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
}
