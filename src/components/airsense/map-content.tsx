"use client";

import Link from "next/link";
import { Activity, MapPin, Wind } from "lucide-react";

import { AQIMapDynamic } from "@/components/airsense/aqi-map-dynamic";
import { StaleDataNotice } from "@/components/airsense/airsense-cards";
import { StationSidebar } from "@/components/airsense/station-sidebar";
import { AqiLegend, PageHero } from "@/components/airsense/ui-primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStations } from "@/hooks/use-stations";
import { cn } from "@/lib/utils";

export function MapContent() {
  const { stations, stale, isLoading, lastUpdated } = useStations();

  if (isLoading) {
    return <Skeleton className="min-h-[560px] w-full rounded-2xl" />;
  }

  const withReadings = stations.filter((s) => s.latest_reading);
  const avgAqi = withReadings.length
    ? Math.round(
        withReadings.reduce((sum, s) => sum + (s.latest_reading?.aqi ?? 0), 0) /
          withReadings.length,
      )
    : 0;
  const worst = withReadings.reduce(
    (max, s) =>
      (s.latest_reading?.aqi ?? 0) > (max.latest_reading?.aqi ?? 0) ? s : max,
    withReadings[0],
  );
  const unhealthyCount = withReadings.filter(
    (s) => (s.latest_reading?.aqi ?? 0) > 100,
  ).length;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Klang Valley · SDG 11"
        title="Live Air Quality Map"
        description="Explore real-time AQI across Malaysian urban monitoring stations and drill into station details."
        action={
          <Button asChild size="lg" className="shadow-md">
            <Link href="/assess">
              <Activity className="mr-2 size-4" />
              Assess My Risk
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Stations monitored",
            value: stations.length,
            icon: MapPin,
            accent: "text-primary",
          },
          {
            label: "Valley average AQI",
            value: avgAqi || "—",
            icon: Wind,
            accent: "text-sky-600 dark:text-sky-400",
          },
          {
            label: "Unhealthy stations",
            value: unhealthyCount,
            icon: Activity,
            accent: unhealthyCount > 0 ? "text-orange-600" : "text-emerald-600",
          },
        ].map((stat) => (
          <div key={stat.label} className="airsense-surface rounded-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </p>
              <stat.icon className={cn("size-4", stat.accent)} />
            </div>
            <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
            {stat.label === "Valley average AQI" && worst?.latest_reading && (
              <p className="text-muted-foreground mt-1 text-xs">
                Highest: {worst.name} ({worst.latest_reading.aqi})
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <AqiLegend compact />
        {lastUpdated && (
          <p className="text-muted-foreground text-xs">
            Updated {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      <StaleDataNotice stale={stale} />

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="airsense-map-frame min-h-[520px]">
          <AQIMapDynamic stations={stations} />
        </div>
        <StationSidebar stations={stations} />
      </div>
    </div>
  );
}
