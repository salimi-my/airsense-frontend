"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function OAuthDashboardMessageHandler() {
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
      const newUrl = params.toString()
        ? `/dashboard?${params.toString()}`
        : "/dashboard";
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  return null;
}
