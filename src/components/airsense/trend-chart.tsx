"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ReadingPoint } from "@/types/airsense";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  readings: ReadingPoint[];
  stationName: string;
  className?: string;
}

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

export function TrendChart({ readings, stationName, className }: TrendChartProps) {
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

  const sampled = downsampleReadings(readings);
  const data = sampled.map((reading) => ({
    time: reading.fetched_at
      ? new Date(reading.fetched_at).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
        })
      : "",
    aqi: reading.aqi,
  }));

  return (
    <div className={cn("flex min-h-0 flex-col gap-4", className)}>
      <div>
        <h3 className="font-semibold">7-Day Trend</h3>
        <p className="text-muted-foreground text-sm">{stationName}</p>
      </div>
      <div className="h-[280px] w-full min-w-0 shrink-0 touch-pan-y">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
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
              domain={[0, 320]}
              tick={{ fontSize: 11 }}
              width={36}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--card)",
              }}
            />
            <ReferenceLine y={50} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ReferenceLine y={100} stroke="#eab308" strokeDasharray="4 4" strokeOpacity={0.6} />
            <ReferenceLine y={200} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.6} />
            <Area type="monotone" dataKey="aqi" stroke="none" fill="url(#aqiGradient)" />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#0284c7"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#0284c7" }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
