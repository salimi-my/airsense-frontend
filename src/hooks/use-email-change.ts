import { AxiosError } from "axios";
import useSWR from "swr";

import axios from "@/lib/axios";
import { fetcher } from "@/lib/fetcher";
import type { EmailChangeStatus } from "@/types";

interface EmailChangeStatusResponse {
  success: boolean;
  data: EmailChangeStatus;
  message: string;
  timestamp: string;
}

export function useEmailChangeStatus() {
  const { data, error, isLoading, mutate } = useSWR<
    EmailChangeStatusResponse,
    AxiosError
  >("/api/users/email-change/status", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    status: data?.data ?? null,
    error,
    isLoading,
    mutate,
  };
}

export function useEmailChange() {
  const { status, isLoading, mutate } = useEmailChangeStatus();

  const requestEmailChange = async (newEmail: string, password: string) => {
    const response = await axios.post("/users/email-change/request", {
      new_email: newEmail,
      password,
    });

    // Revalidate the status after successful request
    await mutate();

    return response;
  };

  const cancelEmailChange = async () => {
    const response = await axios.delete("/api/users/email-change/cancel");

    // Revalidate the status after successful cancellation
    await mutate();

    return response;
  };

  const resendEmailChange = async () => {
    const response = await axios.post("/api/users/email-change/resend");

    return response;
  };

  return {
    status,
    isLoading,
    requestEmailChange,
    cancelEmailChange,
    resendEmailChange,
    mutate,
  };
}
