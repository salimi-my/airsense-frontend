"use client";

import { createContext, useContext } from "react";

import { useUserSWR, type UserSession } from "@/hooks/use-user-swr";

const UserContext = createContext<UserSession | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const session = useUserSWR();

  return (
    <UserContext.Provider value={session}>{children}</UserContext.Provider>
  );
}

/** Returns the shared user session when inside UserProvider, otherwise null. */
export function useOptionalUserContext(): UserSession | null {
  return useContext(UserContext);
}
