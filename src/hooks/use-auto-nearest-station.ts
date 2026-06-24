"use client";

import axios from "@/lib/axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { GEO_ATTEMPTED_STORAGE_KEY } from "@/constants/airsense";
import { API_ENDPOINTS } from "@/constants/routes";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useUser } from "@/hooks/use-user";
import type { NearbyStationApiResponse } from "@/types/airsense";

interface AutoNearestResult {
  stationId: number | null;
  stationName: string | null;
  withinCoverage: boolean;
  distanceKm: number | null;
}

interface UseAutoNearestStationOptions {
  /** Run automatically on mount */
  auto?: boolean;
  /** When true, only returns nearest station without saving to profile */
  skipSave?: boolean;
  /** When false, auto-detect works for guests. Default true. */
  requireUser?: boolean;
  /** When true, auto-detect even if the user already has a preferred station */
  ignorePreferredStation?: boolean;
  /** When false, retry geo even if already attempted this session. Default true. */
  rememberSessionAttempt?: boolean;
  onResolved?: (result: AutoNearestResult) => void;
  onSettled?: () => void;
}

export function useAutoNearestStation(
  options: UseAutoNearestStationOptions = {},
) {
  const {
    auto = false,
    skipSave = false,
    requireUser = true,
    ignorePreferredStation = false,
    rememberSessionAttempt = true,
    onResolved,
    onSettled,
  } = options;
  const { user, mutate: mutateUser } = useUser();
  const { mutate: globalMutate } = useSWRConfig();
  const { coords, status, error, requestLocation } = useGeolocation();

  const [isResolving, setIsResolving] = useState(false);
  const [result, setResult] = useState<AutoNearestResult>({
    stationId: null,
    stationName: null,
    withinCoverage: true,
    distanceKm: null,
  });

  const onResolvedRef = useRef(onResolved);
  const onSettledRef = useRef(onSettled);
  const userRef = useRef(user);
  const pendingResolveRef = useRef(false);
  const forceDetectRef = useRef(false);
  const isResolvingRef = useRef(false);

  useEffect(() => {
    onResolvedRef.current = onResolved;
  }, [onResolved]);

  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const resolveNearest = useCallback(
    async (lat: number, lng: number, force = false) => {
      if (isResolvingRef.current) return null;

      isResolvingRef.current = true;
      setIsResolving(true);

      try {
        const response = await axios.get<NearbyStationApiResponse>(
          API_ENDPOINTS.STATIONS_NEARBY(lat, lng),
        );

        const nearby = response.data.data;
        const stationId = nearby.station.id;
        const stationName = nearby.station.name;
        const currentUser = userRef.current;

        const resolved: AutoNearestResult = {
          stationId,
          stationName,
          withinCoverage: nearby.within_coverage,
          distanceKm: nearby.distance_km,
        };

        setResult(resolved);
        onResolvedRef.current?.(resolved);

        if (!skipSave && currentUser) {
          await axios.patch("/api/users/update-profile", {
            name: currentUser.name,
            preferred_station_id: stationId,
          });
          await mutateUser();
          await globalMutate(API_ENDPOINTS.DASHBOARD);
        }

        if (force || !skipSave) {
          toast.success(`Using nearest station: ${stationName}`);
        }

        if (!nearby.within_coverage) {
          toast.warning(
            `You're outside our monitored area. Nearest station is ${stationName} (${nearby.distance_km} km away).`,
          );
        }

        return resolved;
      } catch {
        if (!skipSave) {
          toast.error("Could not find nearest station.");
        }
        return null;
      } finally {
        isResolvingRef.current = false;
        setIsResolving(false);
        onSettledRef.current?.();
      }
    },
    [globalMutate, mutateUser, skipSave],
  );

  const detectNearest = useCallback(
    (force = false) => {
      if (!force) {
        sessionStorage.setItem(GEO_ATTEMPTED_STORAGE_KEY, "1");
      }
      forceDetectRef.current = force;
      pendingResolveRef.current = true;
      requestLocation();
    },
    [requestLocation],
  );

  useEffect(() => {
    if (!auto) return;
    if (requireUser && !user) return;
    if (!ignorePreferredStation && user?.preferred_station_id) return;
    if (
      rememberSessionAttempt &&
      sessionStorage.getItem(GEO_ATTEMPTED_STORAGE_KEY)
    ) {
      return;
    }

    detectNearest(false);
  }, [
    auto,
    detectNearest,
    ignorePreferredStation,
    rememberSessionAttempt,
    requireUser,
    user,
  ]);

  useEffect(() => {
    if (!pendingResolveRef.current) return;

    if (status === "denied" || status === "error") {
      pendingResolveRef.current = false;
      forceDetectRef.current = false;
      onSettledRef.current?.();
      return;
    }

    if (status !== "success" || !coords) return;

    pendingResolveRef.current = false;
    const force = forceDetectRef.current;
    forceDetectRef.current = false;

    resolveNearest(coords.lat, coords.lng, force);
  }, [coords, resolveNearest, status]);

  return {
    detectNearest,
    isResolving,
    geoStatus: status,
    geoError: error,
    result,
  };
}
