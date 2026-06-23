"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function OAuthMessageHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const requires2FA = searchParams.get("requires_2fa");

    if (error) {
      toast.error(error);

      // Remove the error param from the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("error");
      const newUrl = params.toString()
        ? `/login?${params.toString()}`
        : "/login";
      router.replace(newUrl);
    } else if (requires2FA === "true") {
      // Show info toast for OAuth 2FA requirement
      toast.info(
        "Two-factor authentication required. Please enter your authentication code.",
      );
      // Don't remove requires_2fa and email params - let LoginForm handle them
    }
  }, [searchParams, router]);

  return null;
}
