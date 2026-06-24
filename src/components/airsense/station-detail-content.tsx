"use client";

import Link from "next/link";
import {
  Cloud,
  Droplets,
  Gauge,
  MapPin,
  Thermometer,
  Wind,
} from "lucide-react";

import {
  PredictionCard,
  StaleDataNotice,
} from "@/components/airsense/airsense-cards";
import { TrendChart } from "@/components/airsense/trend-chart";
import { PageHero } from "@/components/airsense/ui-primitives";
import { AQI_COLORS } from "@/constants/airsense";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useStationPrediction,
  useStationReadings,
} from "@/hooks/use-station";

export function StationDetailContent({ id }: { id: number }) {
  const { station, readings, isLoading } = useStationReadings(id);
  const { prediction, isLoading: predictionLoading } = useStationPrediction(id);

  if (isLoading || !station) {
    return <Skeleton className="min-h-[480px] w-full rounded-2xl" />;
  }

  const reading = station.latest_reading;
  const color = reading ? AQI_COLORS[reading.color_class] : "#94a3b8";

  const metrics = [
    { label: "PM2.5", value: reading?.pm25 ?? "—", unit: "µg/m³", icon: Droplets },
    { label: "PM10", value: reading?.pm10 ?? "—", unit: "µg/m³", icon: Cloud },
    { label: "NO₂", value: reading?.no2 ?? "—", unit: "µg/m³", icon: Wind },
    { label: "O₃", value: reading?.o3 ?? "—", unit: "µg/m³", icon: Wind },
    { label: "Temperature", value: reading?.temperature ?? "—", unit: "°C", icon: Thermometer },
    { label: "Humidity", value: reading?.humidity ?? "—", unit: "%", icon: Droplets },
  ];

  return (
    <div className="min-w-0 space-y-6">
      <PageHero
        eyebrow={station.city}
        title={station.name}
        description={`Live pollutant readings and 7-day trends for this monitoring station.`}
        action={
          <Button asChild size="lg">
            <Link href={`/assess?station=${station.id}`}>
              <Gauge className="mr-2 size-4" />
              Assess My Risk
            </Link>
          </Button>
        }
      />

      <StaleDataNotice stale={reading?.stale ?? true} />

      <div
        className="airsense-surface relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${color}18 0%, transparent 55%)`,
        }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              Current Air Quality Index
            </p>
            <div className="flex items-end gap-3">
              <span
                className="text-6xl font-bold tracking-tight tabular-nums md:text-7xl"
                style={{ color }}
              >
                {reading?.aqi ?? "—"}
              </span>
              <span
                className="mb-2 rounded-full px-3 py-1 text-sm font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {reading?.category ?? "Unknown"}
              </span>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="size-4" />
            {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="airsense-surface rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                {metric.label}
              </p>
              <metric.icon className="text-primary size-4 opacity-70" />
            </div>
            <p className="text-2xl font-semibold tabular-nums">
              {metric.value}
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                {metric.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="airsense-surface min-w-0 rounded-2xl p-6">
        <TrendChart readings={readings} stationName={station.name} />
      </div>

      {predictionLoading ? (
        <Skeleton className="h-48 w-full rounded-2xl" />
      ) : prediction ? (
        <PredictionCard prediction={prediction} stationName={station.name} />
      ) : null}

      <p className="text-muted-foreground text-center text-xs">
        Data:{" "}
        <a href="https://aqicn.org" target="_blank" rel="noopener noreferrer" className="underline">
          WAQI
        </a>{" "}
        · Official:{" "}
        <a
          href="https://apims.doe.gov.my"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          DOE APIMS
        </a>
      </p>
    </div>
  );
}
