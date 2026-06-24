import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type {
  PredictionApiResponse,
  StationApiResponse,
  StationReadingsApiResponse,
} from "@/types/airsense";

export function useStation(id: number) {
  const { data, error, isLoading } = useSWR<StationApiResponse>(
    id ? `/api/stations/${id}` : null,
    fetcher,
  );

  return {
    station: data?.data ?? null,
    error,
    isLoading,
  };
}

export function useStationReadings(id: number, days = 7) {
  const { data, error, isLoading } = useSWR<StationReadingsApiResponse>(
    id ? `/api/stations/${id}/readings?days=${days}` : null,
    fetcher,
  );

  return {
    station: data?.data.station ?? null,
    readings: data?.data.readings ?? [],
    error,
    isLoading,
  };
}

export function useStationPrediction(id: number) {
  const { data, error, isLoading } = useSWR<PredictionApiResponse>(
    id ? `/api/stations/${id}/prediction` : null,
    fetcher,
  );

  return {
    prediction: data?.data.prediction ?? null,
    error,
    isLoading,
  };
}
