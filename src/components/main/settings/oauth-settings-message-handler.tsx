"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function OAuthSettingsMessageHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);
    } else if (error) {
      toast.error(error);
    }

    // Remove the params from the URL if they exist
    if (success || error) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      params.delete("error");

      // Preserve the tab parameter
      const tab = searchParams.get("tab");
      const newUrl = params.toString()
        ? `/settings?${params.toString()}`
        : tab
          ? `/settings?tab=${tab}`
          : "/settings";

      router.replace(newUrl);
    }
  }, [searchParams, router]);

  return null;
}
