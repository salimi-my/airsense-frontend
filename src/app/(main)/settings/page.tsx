import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OAuthSettingsMessageHandler } from "@/components/main/settings/oauth-settings-message-handler";
import { SettingsTabs } from "@/components/main/settings/settings-tabs";
import { isOAuthEnabled } from "@/constants/routes";
import { getUser } from "@/lib/server-auth";

export const metadata: Metadata = {
  title: "Settings — AirSense",
  description:
    "This is the settings page of the AirSense web application where you can view and manage your account's settings.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { tab = "profile" } = await searchParams;

  // Redirect to profile if accounts tab is requested but OAuth is disabled
  if (tab === "accounts" && !isOAuthEnabled()) {
    redirect("/settings?tab=profile");
  }

  if (
    tab !== "profile" &&
    tab !== "password" &&
    tab !== "security" &&
    tab !== "accounts"
  ) {
    redirect("/settings");
  }

  const user = await getUser();

  if (!user) redirect("/login");

  return (
    <>
      <Suspense fallback={null}>
        <OAuthSettingsMessageHandler />
      </Suspense>
      <SettingsTabs user={user} initialTab={tab as string} />
    </>
  );
}
