"use client";

import { SWRConfig } from "swr";

import { API_ENDPOINTS } from "@/constants/routes";
import type { ApiResponse, User } from "@/types";

interface SWRProviderProps {
  user: User;
  children: React.ReactNode;
}

/**
 * Global SWR configuration:
 * - Provides server-fetched user as fallback so useUser()/useAuth() never block on first render.
 * - Disables revalidation on window focus — admin data doesn't change on tab switch.
 * - Sets a 60s deduping interval to prevent redundant requests across sibling components.
 * - Disables revalidation on reconnect to avoid a burst of requests after a network hiccup.
 *
 * Per-hook overrides (e.g. revalidateOnFocus: true in use-auth.ts) still take precedence.
 */
export function SWRProvider({ user, children }: SWRProviderProps) {
  const fallbackUser: ApiResponse<User> = {
    success: true,
    data: user,
    message: "",
    timestamp: new Date().toISOString(),
  };

  return (
    <SWRConfig
      value={{
        fallback: { [API_ENDPOINTS.USER]: fallbackUser },
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60_000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
