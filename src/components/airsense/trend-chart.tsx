"use client";

import { useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ReadingPoint } from "@/types/airsense";
import { cn } from "@/lib/utils";

type TrendMetric = "aqi" | "pm25";

interface TrendChartProps {
  readings: ReadingPoint[];
  stationName: string;
  className?: string;
}

const METRIC_CONFIG = {
  aqi: {
    label: "AQI",
    dataKey: "aqi" as const,
    domain: [0, 320] as [number, number],
    referenceLines: [
      { y: 50, stroke: "#22c55e" },
      { y: 100, stroke: "#eab308" },
      { y: 200, stroke: "#f97316" },
    ],
    formatValue: (value: number) => String(Math.round(value)),
  },
  pm25: {
    label: "PM2.5",
    dataKey: "pm25" as const,
    domain: null,
    referenceLines: [
      { y: 15, stroke: "#22c55e" },
      { y: 35, stroke: "#eab308" },
      { y: 55, stroke: "#f97316" },
    ],
    formatValue: (value: number) => value.toFixed(1),
  },
} satisfies Record<
  TrendMetric,
  {
    label: string;
    dataKey: "aqi" | "pm25";
    domain: [number, number] | null;
    referenceLines: { y: number; stroke: string }[];
    formatValue: (value: number) => string;
  }
>;

function downsampleReadings(readings: ReadingPoint[], maxPoints = 48): ReadingPoint[] {
  if (readings.length <= maxPoints) {
    return readings;
  }

  const step = Math.ceil(readings.length / maxPoints);
  const sampled = readings.filter((_, index) => index % step === 0);

  const last = readings[readings.length - 1];
  if (sampled[sampled.length - 1]?.id !== last.id) {
    sampled.push(last);
  }

  return sampled;
}

function pm25Domain(readings: ReadingPoint[]): [number, number] {
  const max = readings.reduce((peak, reading) => Math.max(peak, reading.pm25 ?? 0), 0);
  return [0, Math.max(80, Math.ceil(max / 10) * 10)];
}

function TrendTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  metric: TrendMetric;
}) {
  if (!active || !payload?.length || payload[0]?.value == null) {
    return null;
  }

  const config = METRIC_CONFIG[metric];
  const value = payload[0].value as number;
  const unit = metric === "pm25" ? " µg/m³" : "";

  return (
    <div
      className="rounded-xl border px-3 py-2 text-sm shadow-sm"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
      }}
    >
      <p className="text-muted-foreground mb-1 text-xs">{label}</p>
      <p className="font-medium tabular-nums">
        <span style={{ color: "#0284c7" }}>{config.label}</span>
        {" : "}
        {config.formatValue(value)}
        {unit}
      </p>
    </div>
  );
}

export function TrendChart({ readings, stationName, className }: TrendChartProps) {
  const gradientId = useId();
  const [metric, setMetric] = useState<TrendMetric>("aqi");

  const hasPm25Data = useMemo(
    () => readings.some((reading) => reading.pm25 != null),
    [readings],
  );

  const sampled = useMemo(() => downsampleReadings(readings), [readings]);

  const data = useMemo(
    () =>
      sampled.map((reading) => ({
        time: reading.fetched_at
          ? new Date(reading.fetched_at).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
          })
          : "",
        aqi: reading.aqi,
        pm25: reading.pm25,
      })),
    [sampled],
  );

  const config = METRIC_CONFIG[metric];
  const yDomain =
    config.domain ?? pm25Domain(sampled.filter((reading) => reading.pm25 != null));

  if (readings.length === 0) {
    return (
      <div
        className={cn(
          "bg-muted/30 flex min-h-[280px] flex-1 items-center justify-center rounded-xl",
          className,
        )}
      >
        <p className="text-muted-foreground text-sm">No historical data available</p>
      </div>
    );
  }

  if (metric === "pm25" && !hasPm25Data) {
    return (
      <div className={cn("flex min-h-0 flex-col gap-4", className)}>
        <ChartHeader
          stationName={stationName}
          metric={metric}
          hasPm25Data={hasPm25Data}
          onMetricChange={setMetric}
        />
        <div className="bg-muted/30 flex min-h-[280px] flex-1 items-center justify-center rounded-xl">
          <p className="text-muted-foreground text-sm">No PM2.5 historical data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      <ChartHeader
        stationName={stationName}
        metric={metric}
        hasPm25Data={hasPm25Data}
        onMetricChange={setMetric}
      />
      <div className="h-[280px] w-full min-w-0 shrink-0 touch-pan-y">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={32}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 11 }}
              width={36}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<TrendTooltip metric={metric} />} />
            {config.referenceLines.map((line) => (
              <ReferenceLine
                key={line.y}
                y={line.y}
                stroke={line.stroke}
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
            ))}
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke="#0284c7"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 5, fill: "#0284c7" }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartHeader({
  stationName,
  metric,
  hasPm25Data,
  onMetricChange,
}: {
  stationName: string;
  metric: TrendMetric;
  hasPm25Data: boolean;
  onMetricChange: (metric: TrendMetric) => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold">7-Day Trend</h3>
        <p className="text-muted-foreground text-sm">{stationName}</p>
      </div>
      <ToggleGroup
        type="single"
        value={metric}
        onValueChange={(value) => {
          if (value) {
            onMetricChange(value as TrendMetric);
          }
        }}
        variant="outline"
        size="sm"
        spacing={0}
        aria-label="Trend metric"
      >
        <ToggleGroupItem value="aqi" className="px-3 text-xs">
          AQI
        </ToggleGroupItem>
        <ToggleGroupItem
          value="pm25"
          disabled={!hasPm25Data}
          className="px-3 text-xs"
          title={hasPm25Data ? undefined : "No PM2.5 data for this station"}
        >
          PM2.5
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
