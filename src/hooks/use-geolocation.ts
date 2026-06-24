"use client";

import { useCallback, useState } from "react";

export type GeolocationStatus =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "error";

interface GeolocationCoords {
  lat: number;
  lng: number;
}

interface UseGeolocationResult {
  coords: GeolocationCoords | null;
  status: GeolocationStatus;
  error: string | null;
  requestLocation: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("success");
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setStatus("denied");
          setError("Location access denied.");
        } else {
          setStatus("error");
          setError(geoError.message || "Unable to retrieve location.");
        }
      },
      {
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  return { coords, status, error, requestLocation };
}
