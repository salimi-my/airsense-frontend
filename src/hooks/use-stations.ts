import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { AlertsApiResponse, StationsApiResponse } from "@/types/airsense";

export function useStations() {
  const { data, error, isLoading, mutate } = useSWR<StationsApiResponse>(
    "/api/stations",
    fetcher,
  );

  return {
    stations: data?.data.stations ?? [],
    lastUpdated: data?.data.last_updated ?? null,
    stale: data?.data.stale ?? false,
    error,
    isLoading,
    mutate,
  };
}

export function useAlerts() {
  const { data, error, isLoading } = useSWR<AlertsApiResponse>(
    "/api/stations/alerts",
    fetcher,
    { refreshInterval: 60000 },
  );

  return {
    alerts: data?.data.alerts ?? [],
    hasAlerts: data?.data.has_alerts ?? false,
    error,
    isLoading,
  };
}
