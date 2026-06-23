import { Metadata } from "next";
import { Suspense } from "react";

import { OAuthDashboardMessageHandler } from "@/components/main/oauth-dashboard-message-handler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard — AirSense",
  description:
    "This is the dashboard page of the AirSense web application where you can access all the tools and features provided by the application.",
};

export default function DashbardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Suspense fallback={null}>
        <OAuthDashboardMessageHandler />
      </Suspense>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="border-sidebar-border rounded-lg border ring-0">
          <CardHeader>
            <CardTitle>{``}</CardTitle>
            <CardDescription>{``}</CardDescription>
          </CardHeader>
          <CardContent className="h-[120px]">{``}</CardContent>
        </Card>
        <Card className="border-sidebar-border rounded-lg border ring-0">
          <CardHeader>
            <CardTitle>{``}</CardTitle>
            <CardDescription>{``}</CardDescription>
          </CardHeader>
          <CardContent className="h-[120px]">{``}</CardContent>
        </Card>
        <Card className="border-sidebar-border rounded-lg border ring-0">
          <CardHeader>
            <CardTitle>{``}</CardTitle>
            <CardDescription>{``}</CardDescription>
          </CardHeader>
          <CardContent className="h-[120px]">{``}</CardContent>
        </Card>
      </div>
      <Card className="border-sidebar-border rounded-lg border ring-0">
        <CardHeader>
          <CardTitle>{``}</CardTitle>
          <CardDescription>{``}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[900px]">{``}</CardContent>
      </Card>
    </div>
  );
}
