"use client";

import { AxiosError } from "axios";
import { useMemo } from "react";
import useSWR, { useSWRConfig, type KeyedMutator } from "swr";

import { API_ENDPOINTS, HTTP_STATUS } from "@/constants";
import { USER_SWR_CONFIG, userFetcher } from "@/lib/user-swr";
import type { ApiResponse, User } from "@/types";

export interface UserSession {
  user: User | undefined;
  isLoading: boolean;
  error: AxiosError | undefined;
  mutate: KeyedMutator<ApiResponse<User>>;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
}

interface UseUserSWROptions {
  /** When true, skips the SWR subscription (e.g. when reading from UserProvider context). */
  disabled?: boolean;
}

export function useUserSWR({
  disabled = false,
}: UseUserSWROptions = {}): UserSession {
  const { fallback } = useSWRConfig();
  const hasUserFallback = Object.prototype.hasOwnProperty.call(
    fallback ?? {},
    API_ENDPOINTS.USER,
  );

  const {
    data: userResponse,
    error,
    mutate,
    isLoading,
  } = useSWR<ApiResponse<User>, AxiosError>(
    disabled ? null : API_ENDPOINTS.USER,
    userFetcher,
    {
      ...USER_SWR_CONFIG,
      revalidateOnMount: !hasUserFallback,
    },
  );

  const user = userResponse?.data;

  const isAuthenticated = useMemo(() => {
    if (!user) return false;
    if (error?.response?.status === HTTP_STATUS.UNAUTHORIZED) return false;
    return true;
  }, [user, error]);

  const isEmailVerified = useMemo(
    () => Boolean(user?.email_verified_at),
    [user?.email_verified_at],
  );

  const isAdmin = useMemo(
    () => user?.role?.name === "admin",
    [user?.role?.name],
  );

  return {
    user,
    isLoading,
    error,
    mutate,
    isAuthenticated,
    isEmailVerified,
    isAdmin,
  };
}
