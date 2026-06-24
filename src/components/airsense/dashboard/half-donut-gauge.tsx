"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";

/** Light gray arc for remainder / uncertainty slices (theme uses oklch, not hsl) */
export const UNCERTAINTY_ARC_COLOR = "var(--border)";

/** Half-donut arc (opens upward); cy places the flat baseline near the chart bottom */
export const HALF_DONUT = {
  startAngle: 180,
  endAngle: 0,
  innerRadius: 80,
  outerRadius: 110,
  cx: "50%",
  cy: "100%",
  paddingAngle: 2,
} as const;

interface HalfDonutGaugeProps {
  config: ChartConfig;
  data: Array<{ key: string; name: string; value: number; fill: string }>;
  label: ReactNode;
  tooltip?: ReactNode;
  paddingAngle?: number;
}

export function HalfDonutGauge({
  config,
  data,
  label,
  tooltip,
  paddingAngle,
}: HalfDonutGaugeProps) {
  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-[280px]">
      <ChartContainer
        config={config}
        className="h-full w-full"
        initialDimension={{ width: 280, height: 140 }}
      >
        <PieChart>
          {tooltip}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            {...HALF_DONUT}
            paddingAngle={paddingAngle ?? HALF_DONUT.paddingAngle}
            strokeWidth={2}
            stroke="var(--background)"
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[10%] text-center"
        aria-hidden
      >
        {label}
      </div>
    </div>
  );
}
