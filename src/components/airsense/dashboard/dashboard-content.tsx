"use client";

import axios from "@/lib/axios";
import { Activity, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

import { AlertBanner } from "@/components/airsense/alert-banner";
import { AQIMapDynamic } from "@/components/airsense/aqi-map-dynamic";
import { AssessmentConfidenceRadialChart } from "@/components/airsense/dashboard/assessment-confidence-radial-chart";
import { DashboardAdminStrip } from "@/components/airsense/dashboard/dashboard-admin-strip";
import { DashboardTrendChartSkeleton } from "@/components/airsense/dashboard/dashboard-chart-skeletons";
import { DashboardStatsCards } from "@/components/airsense/dashboard/dashboard-stats-cards";
import { RecentAssessments } from "@/components/airsense/dashboard/recent-assessments";
import { ValleyBandRadialChart } from "@/components/airsense/dashboard/valley-band-radial-chart";
import { TrendChart } from "@/components/airsense/trend-chart";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { HEALTH_PROFILE_STORAGE_KEY } from "@/constants/airsense";
import { API_ENDPOINTS } from "@/constants/routes";
import { useAutoNearestStation } from "@/hooks/use-auto-nearest-station";
import { useDashboard, useMyAssessments } from "@/hooks/use-dashboard";
import { useStationReadings } from "@/hooks/use-station";
import { useStations } from "@/hooks/use-stations";
import { useUser } from "@/hooks/use-user";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  if (hour >= 18 && hour < 21) return "Good evening";
  return "Good night";
}

function getHealthProfileBadges(): string[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
  if (!stored) return [];

  try {
    const profile = JSON.parse(stored) as {
      age_group?: string;
      conditions?: string[];
      activity?: string;
    };

    return [
      profile.age_group,
      ...(profile.conditions ?? []).filter((c) => c !== "none"),
      profile.activity?.replace(/_/g, " "),
    ].filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export function DashboardContent() {
  const { user, mutate: mutateUser, isAdmin } = useUser();
  const {
    dashboard,
    isLoading: dashboardLoading,
    mutate: mutateDashboard,
  } = useDashboard();
  const { assessments, isLoading: assessmentsLoading } = useMyAssessments(10);
  const { stations, isLoading: stationsLoading } = useStations();
  const { mutate: globalMutate } = useSWRConfig();

  const preferredStationId =
    dashboard?.preferred_station?.id ?? user?.preferred_station_id ?? null;

  const { readings, isLoading: readingsLoading } = useStationReadings(
    preferredStationId ?? 0,
  );

  const [isUpdatingStation, setIsUpdatingStation] = useState(false);

  const { detectNearest, isResolving, geoStatus, geoError, result } =
    useAutoNearestStation({ auto: true });

  const stationOptions = useMemo(
    () =>
      stations.map((station) => ({
        value: station.id,
        label: `${station.name} (${station.city})`,
      })),
    [stations],
  );

  const firstName = user?.name?.split(" ")[0] ?? null;
  const greeting = getGreeting();
  const healthProfileBadges = getHealthProfileBadges();

  async function handleStationChange(stationId: number) {
    if (!user) return;

    setIsUpdatingStation(true);
    try {
      await axios.patch("/api/users/update-profile", {
        name: user.name,
        preferred_station_id: stationId,
      });
      await mutateUser();
      await mutateDashboard();
      await globalMutate(API_ENDPOINTS.DASHBOARD);
      toast.success("Home station updated");
    } catch {
      toast.error("Failed to update home station");
    } finally {
      setIsUpdatingStation(false);
    }
  }

  const isGeoLoading =
    isResolving || geoStatus === "loading" || isUpdatingStation;

  if (dashboardLoading && !dashboard) {
    return <Skeleton className="min-h-[560px] w-full rounded-2xl" />;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
        <div className="min-w-0">
          <h1 className="text-lg leading-tight font-semibold">
            {greeting}
            {firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="text-muted-foreground truncate text-sm">
            Your air quality snapshot for Klang Valley
          </p>
          {healthProfileBadges.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {healthProfileBadges.map((badge) => (
                <span
                  key={badge}
                  className="bg-muted rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                >
                  {badge.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
          <div className="flex w-full min-w-0 items-center sm:w-auto">
            <div className="border-input text-primary flex h-8 shrink-0 items-center gap-1.5 rounded-s-md border border-r-0 bg-teal-300/10 px-2 text-sm dark:bg-teal-900/30">
              <MapPin className="size-4" />
              Station
            </div>
            <Combobox
              options={stationOptions}
              value={preferredStationId ?? undefined}
              onValueChange={(value) => handleStationChange(Number(value))}
              placeholder={
                isGeoLoading ? "Detecting nearest station…" : "Select station…"
              }
              searchPlaceholder="Search station…"
              emptyText="No station found."
              className="h-8 min-w-0 flex-1 rounded-s-none xl:w-[280px]"
              disabled={isGeoLoading || stationsLoading}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            disabled={isGeoLoading}
            onClick={() => detectNearest(true)}
          >
            <Navigation className="mr-1.5 size-4" />
            Use my location
          </Button>
          <Button asChild size="sm" className="h-8 shrink-0">
            <Link
              href={
                preferredStationId
                  ? `/assess?station=${preferredStationId}`
                  : "/assess"
              }
            >
              <Activity className="mr-1.5 size-4" />
              Assess My Risk
            </Link>
          </Button>
        </div>
      </div>

      <AlertBanner homeStation={dashboard?.preferred_station} />

      {geoStatus === "denied" && (
        <p className="text-muted-foreground text-xs">
          Location access denied — select a station manually or try again.
        </p>
      )}
      {geoError && geoStatus !== "denied" && (
        <p className="text-muted-foreground text-xs">{geoError}</p>
      )}
      {result.stationId && !result.withinCoverage && result.distanceKm && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-50">
          You&apos;re outside our monitored area. Showing nearest station:{" "}
          {result.stationName} ({result.distanceKm} km away).
        </div>
      )}

      <DashboardStatsCards dashboard={dashboard} isLoading={dashboardLoading} />

      <div className="grid gap-4 max-md:gap-3 xl:grid-cols-12 xl:items-stretch">
        <div className="flex flex-col xl:col-span-7">
          {preferredStationId && readingsLoading ? (
            <DashboardTrendChartSkeleton />
          ) : preferredStationId && readings.length > 0 ? (
            <div className="airsense-surface flex h-full min-h-[420px] min-w-0 flex-col rounded-2xl p-6">
              <TrendChart
                className="flex-1"
                readings={readings}
                stationName={
                  dashboard?.preferred_station?.name ?? "Your station"
                }
              />
            </div>
          ) : (
            <div className="airsense-surface flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl p-8 text-center">
              <MapPin className="text-muted-foreground mb-3 size-8" />
              <p className="text-sm font-medium">No home station selected</p>
              <p className="text-muted-foreground mt-1 max-w-sm text-xs">
                Choose a station from the dropdown or use your location to see a
                7-day AQI trend for your area.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => detectNearest(true)}
              >
                <Navigation className="mr-1.5 size-4" />
                Use my location
              </Button>
            </div>
          )}
        </div>
        <div className="flex min-h-0 flex-col xl:col-span-5">
          <RecentAssessments
            assessments={assessments}
            isLoading={assessmentsLoading}
            stationId={preferredStationId}
          />
        </div>
      </div>

      <div className="grid gap-4 max-md:gap-3 sm:grid-cols-2">
        <ValleyBandRadialChart
          stations={stations}
          isLoading={stationsLoading}
        />
        <AssessmentConfidenceRadialChart
          lastAssessment={dashboard?.last_assessment}
          isLoading={dashboardLoading}
          stationId={preferredStationId}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Valley Map Preview</h2>
          <Link
            href="/map"
            className="text-primary text-xs font-medium hover:underline"
          >
            View full map →
          </Link>
        </div>
        <div className="airsense-map-frame h-[280px] min-h-[280px] overflow-hidden xl:h-[480px] xl:min-h-[480px]">
          {!stationsLoading && (
            <AQIMapDynamic
              stations={stations}
              minHeight="100%"
              className="h-full w-full"
            />
          )}
          {stationsLoading && (
            <Skeleton className="h-full w-full rounded-2xl" />
          )}
        </div>
      </div>

      {isAdmin && dashboard?.admin && (
        <DashboardAdminStrip admin={dashboard.admin} />
      )}
    </div>
  );
}
