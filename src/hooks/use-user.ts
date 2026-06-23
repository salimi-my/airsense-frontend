"use client";

import { useOptionalUserContext } from "@/components/providers/user-provider";
import type { UserSession } from "@/hooks/use-user-swr";

/**
 * Read-only access to the current user session.
 * Must be used within the main layout UserProvider.
 */
export function useUser(): UserSession {
  const session = useOptionalUserContext();

  if (!session) {
    throw new Error("useUser must be used within UserProvider");
  }

  return session;
}
