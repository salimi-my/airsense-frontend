import { Metadata } from "next";
import { redirect } from "next/navigation";

import { ContentCard } from "@/components/layout/content-card";
import { UsersTable } from "@/components/main/users/users-table";
import { isUserAdmin } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "All Users — AirSense",
  description:
    "This is the users page of the AirSense web application where you can access all the users.",
};

export default async function UsersPage() {
  // Check if user has admin role
  const userIsAdmin = await isUserAdmin();

  if (!userIsAdmin) {
    redirect("/unauthorized");
  }

  return (
    <ContentCard
      title="Users List"
      description="Here's the listing of all the users."
    >
      <UsersTable />
    </ContentCard>
  );
}
