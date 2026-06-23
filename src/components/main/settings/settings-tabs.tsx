"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import { ContentCard } from "@/components/layout/content-card";
import { Accounts } from "@/components/main/settings/accounts";
import { PasswordForm } from "@/components/main/settings/password-form";
import { ProfileForm } from "@/components/main/settings/profile-form";
import { SecurityForm } from "@/components/main/settings/security-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isOAuthEnabled } from "@/constants/routes";
import type { User } from "@/types";

interface SettingsTabsProps {
  user: User;
  initialTab: string;
}

export function SettingsTabs({ user, initialTab }: SettingsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") || initialTab;
  const activeTab =
    rawTab === "accounts" && !isOAuthEnabled() ? "profile" : rawTab;

  // Redirect to profile if user navigated to accounts tab but OAuth is disabled
  useEffect(() => {
    if (searchParams.get("tab") === "accounts" && !isOAuthEnabled()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "profile");
      router.replace(`/settings?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`/settings?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <Tabs
      orientation="vertical"
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full flex-col items-start justify-center gap-4 lg:flex lg:flex-row"
    >
      <TabsList className={`grid h-auto w-full shrink-0 gap-1 lg:w-60 lg:grid-cols-1 ${isOAuthEnabled() ? "grid-cols-2" : "grid-cols-3"}`}>
        <TabsTrigger
          value="profile"
          className="data-[state=inactive]:hover:bg-sidebar underline-offset-2 hover:cursor-pointer !justify-center lg:!justify-start"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="data-[state=inactive]:hover:bg-sidebar underline-offset-2 hover:cursor-pointer !justify-center lg:!justify-start"
        >
          Password
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="data-[state=inactive]:hover:bg-sidebar underline-offset-2 hover:cursor-pointer !justify-center lg:!justify-start"
        >
          Security
        </TabsTrigger>
        {isOAuthEnabled() && (
          <TabsTrigger
            value="accounts"
            className="data-[state=inactive]:hover:bg-sidebar underline-offset-2 hover:cursor-pointer !justify-center lg:!justify-start"
          >
            Accounts
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="profile" className="mt-2 w-full lg:mt-0">
        <ContentCard
          title="Profile Information"
          description="Here's your profile section where you can view and manage your profile."
        >
          <ProfileForm user={user} />
        </ContentCard>
      </TabsContent>
      <TabsContent value="password" className="mt-2 w-full lg:mt-0">
        <ContentCard
          title="Password Settings"
          description={
            user.has_password
              ? "Here's your password section where you can change your password."
              : "Create a password to enable email and password login."
          }
        >
          <PasswordForm user={user} />
        </ContentCard>
      </TabsContent>
      <TabsContent value="security" className="mt-2 w-full lg:mt-0">
        <ContentCard
          title="Security Settings"
          description="Here's your security section where you can setup, enable or disable two-factor authentication."
        >
          <SecurityForm user={user} />
        </ContentCard>
      </TabsContent>
      {isOAuthEnabled() && (
        <TabsContent value="accounts" className="mt-2 w-full lg:mt-0">
          <ContentCard
            title="Accounts"
            description="Manage your linked OAuth accounts for simplified login."
          >
            <Accounts user={user} />
          </ContentCard>
        </TabsContent>
      )}
    </Tabs>
  );
}
