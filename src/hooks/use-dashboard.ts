import useSWR from "swr";

import { API_ENDPOINTS } from "@/constants/routes";
import { fetcher } from "@/lib/fetcher";
import type { DashboardApiResponse, MyAssessmentsApiResponse } from "@/types/airsense";

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardApiResponse>(
    API_ENDPOINTS.DASHBOARD,
    fetcher,
  );

  return {
    dashboard: data?.data,
    error,
    isLoading,
    mutate,
  };
}

export function useMyAssessments(perPage = 10) {
  const { data, error, isLoading, mutate } = useSWR<MyAssessmentsApiResponse>(
    `${API_ENDPOINTS.ME_ASSESSMENTS}?per_page=${perPage}`,
    fetcher,
  );

  return {
    assessments: data?.data.data ?? [],
    error,
    isLoading,
    mutate,
  };
}
