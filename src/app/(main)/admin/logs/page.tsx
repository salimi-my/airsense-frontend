import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLogsContent } from "@/components/airsense/admin-logs-content";
import { PageHero } from "@/components/airsense/ui-primitives";
import { isUserAdmin } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Admin Logs — AirSense",
};

export default async function AdminLogsPage() {
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Administration"
        title="System Logs"
        description="Monitor station data ingestion and anonymised AI assessment requests for audit and demo validation."
      />
      <AdminLogsContent />
    </div>
  );
}
