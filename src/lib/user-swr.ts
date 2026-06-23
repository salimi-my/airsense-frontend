import { AxiosError } from "axios";

import { HTTP_STATUS } from "@/constants";
import axios from "@/lib/axios";
import type { ApiResponse, User } from "@/types";

export const userFetcher = async (url: string): Promise<ApiResponse<User>> => {
  const response = await axios.get<ApiResponse<User>>(url);
  return response.data;
};

export const USER_SWR_CONFIG = {
  shouldRetryOnError: (error: AxiosError) => {
    const status = error?.response?.status;
    return (
      status !== HTTP_STATUS.UNAUTHORIZED &&
      status !== HTTP_STATUS.EMAIL_VERIFICATION_REQUIRED
    );
  },
  dedupingInterval: 5 * 60 * 1000,
} as const;
