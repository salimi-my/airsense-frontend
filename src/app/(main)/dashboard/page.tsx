import { Metadata } from "next";
import { Suspense } from "react";

import { DashboardContent } from "@/components/airsense/dashboard/dashboard-content";
import { DashboardContentSkeleton } from "@/components/airsense/dashboard/dashboard-chart-skeletons";
import { OAuthDashboardMessageHandler } from "@/components/main/oauth-dashboard-message-handler";

export const metadata: Metadata = {
  title: "Dashboard — AirSense",
  description:
    "Your personalized air quality dashboard with home station AQI, risk assessments, and valley alerts.",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Suspense fallback={null}>
        <OAuthDashboardMessageHandler />
      </Suspense>
      <Suspense fallback={<DashboardContentSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
