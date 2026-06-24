"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { AQI_COLORS } from "@/constants/airsense";
import type { Station } from "@/types/airsense";

import { HalfDonutGauge } from "./half-donut-gauge";

const BAND_KEYS = [
  { key: "good", label: "Good", colorClass: "good" },
  { key: "moderate", label: "Moderate", colorClass: "moderate" },
  { key: "unhealthy", label: "Unhealthy", colorClass: "unhealthy" },
  {
    key: "veryUnhealthy",
    label: "Very Unhealthy",
    colorClass: "very-unhealthy",
  },
  { key: "hazardous", label: "Hazardous", colorClass: "hazardous" },
] as const;

const chartConfig = {
  good: { label: "Good", color: AQI_COLORS.good },
  moderate: { label: "Moderate", color: AQI_COLORS.moderate },
  unhealthy: { label: "Unhealthy", color: AQI_COLORS.unhealthy },
  veryUnhealthy: {
    label: "Very Unhealthy",
    color: AQI_COLORS["very-unhealthy"],
  },
  hazardous: { label: "Hazardous", color: AQI_COLORS.hazardous },
} satisfies ChartConfig;

function countStationsByBand(stations: Station[]) {
  const counts: Record<string, number> = {
    good: 0,
    moderate: 0,
    unhealthy: 0,
    veryUnhealthy: 0,
    hazardous: 0,
  };

  for (const station of stations) {
    const colorClass = station.latest_reading?.color_class;
    if (!colorClass) continue;

    const key =
      colorClass === "very-unhealthy" ? "veryUnhealthy" : colorClass;

    if (key in counts) {
      counts[key]++;
    }
  }

  return counts;
}

interface ValleyBandRadialChartProps {
  stations: Station[];
  isLoading: boolean;
}

export function ValleyBandRadialChart({
  stations,
  isLoading,
}: ValleyBandRadialChartProps) {
  if (isLoading) {
    return <ValleyBandRadialChartSkeleton />;
  }

  const withReadings = stations.filter((s) => s.latest_reading);
  const counts = countStationsByBand(withReadings);
  const activeBands = BAND_KEYS.filter((band) => counts[band.key] > 0);
  const total = withReadings.length;
  const unhealthyCount =
    counts.unhealthy + counts.veryUnhealthy + counts.hazardous;

  if (total === 0 || activeBands.length === 0) {
    return (
      <Card className="border-sidebar-border flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-base">Valley Station Mix</CardTitle>
          <CardDescription>AQI bands across Klang Valley</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-1 items-center justify-center pb-6 text-sm">
          No station readings available
        </CardContent>
      </Card>
    );
  }

  const pieData = activeBands.map((band) => ({
    key: band.key,
    name: band.label,
    value: counts[band.key],
    fill: AQI_COLORS[band.colorClass],
  }));

  return (
    <Card className="border-sidebar-border flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Valley Station Mix</CardTitle>
        <CardDescription>AQI bands across Klang Valley stations</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-end justify-center pb-0">
        <HalfDonutGauge
          config={chartConfig}
          data={pieData}
          tooltip={
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          }
          label={
            <>
              <p className="text-2xl font-bold leading-none">{total}</p>
              <p className="text-muted-foreground mt-1 text-xs leading-none">
                Stations
              </p>
            </>
          }
        />
      </CardContent>
      <CardFooter className="flex-col gap-1 pt-2 text-center text-sm">
        <p className="leading-none font-medium">
          {unhealthyCount > 0
            ? `${unhealthyCount} of ${total} stations are unhealthy`
            : `All ${total} stations are moderate or better`}
        </p>
        <p className="text-muted-foreground leading-none text-xs">
          Slice size = share of stations in each AQI band
        </p>
      </CardFooter>
    </Card>
  );
}

export function ValleyBandRadialChartSkeleton() {
  return (
    <Card className="border-sidebar-border flex flex-col">
      <CardHeader className="items-center pb-0">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-2 h-4 w-48" />
      </CardHeader>
      <CardContent className="flex flex-1 items-end justify-center pb-0">
        <Skeleton className="mx-auto aspect-[2/1] w-full max-w-[280px] rounded-t-full" />
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-2">
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="mx-auto h-3 w-52" />
      </CardFooter>
    </Card>
  );
}
