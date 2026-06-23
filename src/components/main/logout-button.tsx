import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

export function LogoutButton() {
  const { state } = useSidebar();
  const { logout } = useAuth();

  return (
    <SidebarMenuButton asChild tooltip="Logout">
      <Button
        variant="outline"
        className="bg-sidebar dark:bg-sidebar h-8 w-full cursor-pointer"
        onClick={logout}
      >
        <LogOut />
        {state !== "collapsed" && <span>Logout</span>}
      </Button>
    </SidebarMenuButton>
  );
}
