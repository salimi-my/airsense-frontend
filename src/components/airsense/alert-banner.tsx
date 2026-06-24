"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

import { useAlerts } from "@/hooks/use-stations";
import { cn } from "@/lib/utils";
import type { AqiAlert, Station } from "@/types/airsense";

interface AlertBannerProps {
  className?: string;
  /** User's selected home station — enables split home vs valley messaging */
  homeStation?: Station | null;
}

function getBannerGradient(worstAqi: number): string {
  if (worstAqi > 300) return "from-purple-800 to-purple-600";
  if (worstAqi > 200) return "from-red-700 to-red-500";
  return "from-orange-600 to-amber-500";
}

function buildBannerContent(
  alerts: AqiAlert[],
  homeStation: Station | null | undefined,
): { title: string; description: string } {
  const worst = alerts.reduce((max, alert) =>
    alert.aqi > max.aqi ? alert : max,
  );

  const homeReading = homeStation?.latest_reading;
  const homeAlert = homeStation
    ? alerts.find((alert) => alert.id === homeStation.id)
    : undefined;
  const otherAlerts = homeStation
    ? alerts.filter((alert) => alert.id !== homeStation.id)
    : alerts;

  // No home station — valley-wide alert only
  if (!homeStation || !homeReading) {
    return {
      title: `Valley Air Quality Alert — ${worst.category} (AQI ${worst.aqi})`,
      description: `${alerts.map((a) => a.name).join(" · ")} — ${worst.message}`,
    };
  }

  // Home station is healthy, but other valley stations are alerting
  if (!homeAlert && otherAlerts.length > 0) {
    const otherNames = otherAlerts.map((a) => a.name).join(" · ");
    const worstOther = otherAlerts.reduce((max, alert) =>
      alert.aqi > max.aqi ? alert : max,
    );

    return {
      title: `Valley alert — ${worstOther.name} is ${worstOther.category} (AQI ${worstOther.aqi})`,
      description: `Your station, ${homeStation.name}, is ${homeReading.category} (AQI ${homeReading.aqi}). ${otherNames} — ${worstOther.message}`,
    };
  }

  // Home station is unhealthy (may include other alerting stations)
  if (homeAlert) {
    const title = `Alert at your home station — ${homeAlert.category} (AQI ${homeAlert.aqi})`;
    const description =
      otherAlerts.length > 0
        ? `${homeStation.name} — ${homeAlert.message}. Also unhealthy: ${otherAlerts.map((a) => `${a.name} (AQI ${a.aqi})`).join(" · ")}`
        : `${homeStation.name} — ${homeAlert.message}`;

    return { title, description };
  }

  return {
    title: `Valley Air Quality Alert — ${worst.category} (AQI ${worst.aqi})`,
    description: `${alerts.map((a) => a.name).join(" · ")} — ${worst.message}`,
  };
}

export function AlertBanner({ className, homeStation }: AlertBannerProps) {
  const { alerts, hasAlerts, isLoading } = useAlerts();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !hasAlerts || dismissed) {
    return null;
  }

  const worst = alerts.reduce((max, alert) =>
    alert.aqi > max.aqi ? alert : max,
  );

  const { title, description } = buildBannerContent(alerts, homeStation);

  return (
    <div
      className={cn(
        "relative rounded-xl bg-gradient-to-r px-4 py-3.5 text-sm text-white shadow-md",
        getBannerGradient(worst.aqi),
        className,
      )}
      role="alert"
    >
      <div className="flex w-full items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-white/90">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1.5 hover:bg-white/15"
          aria-label="Dismiss alert"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
