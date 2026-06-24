"use client";

import { Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { RISK_COLORS } from "@/constants/airsense";
import type { DashboardLastAssessment } from "@/types/airsense";

import {
  HalfDonutGauge,
  UNCERTAINTY_ARC_COLOR,
} from "./half-donut-gauge";

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "var(--primary)",
  },
  remainder: {
    label: "Uncertainty",
    color: UNCERTAINTY_ARC_COLOR,
  },
} satisfies ChartConfig;

function getConfidenceColor(pct: number): string {
  if (pct >= 70) return "#22c55e";
  if (pct >= 50) return "#eab308";
  return "#f97316";
}

interface AssessmentConfidenceRadialChartProps {
  lastAssessment: DashboardLastAssessment | null | undefined;
  isLoading: boolean;
  stationId?: number | null;
}

export function AssessmentConfidenceRadialChart({
  lastAssessment,
  isLoading,
  stationId,
}: AssessmentConfidenceRadialChartProps) {
  if (isLoading) {
    return <AssessmentConfidenceRadialChartSkeleton />;
  }

  const assessHref = stationId ? `/assess?station=${stationId}` : "/assess";

  if (!lastAssessment || lastAssessment.confidence == null) {
    return (
      <Card className="border-sidebar-border flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-base">Model Confidence</CardTitle>
          <CardDescription>From your latest AI risk assessment</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center pb-4">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Brain />
              </EmptyMedia>
              <EmptyTitle>No assessment yet</EmptyTitle>
              <EmptyDescription>
                Run a risk assessment to see how confident the AI model is in
                your result.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm" asChild>
                <Link href={assessHref}>Assess My Risk</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  const pct = Math.round(lastAssessment.confidence * 100);
  const fillColor =
    RISK_COLORS[lastAssessment.risk_level] ?? getConfidenceColor(pct);
  const remainder = 100 - pct;

  const pieData = [
    {
      key: "confidence",
      name: "Confidence",
      value: pct,
      fill: fillColor,
    },
    ...(remainder > 0
      ? [
          {
            key: "remainder",
            name: "Uncertainty",
            value: remainder,
            fill: UNCERTAINTY_ARC_COLOR,
          },
        ]
      : []),
  ];

  return (
    <Card className="border-sidebar-border flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Model Confidence</CardTitle>
        <CardDescription>
          Latest assessment — {lastAssessment.station_name ?? "your station"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-end justify-center pb-0">
        <HalfDonutGauge
          config={chartConfig}
          data={pieData}
          paddingAngle={0}
          label={
            <>
              <p className="text-2xl font-bold leading-none">{pct}%</p>
              <p className="text-muted-foreground mt-1 text-xs leading-none">
                {lastAssessment.risk_level} risk
              </p>
            </>
          }
        />
      </CardContent>
      <CardFooter className="flex-col gap-1 pt-2 text-center text-sm">
        <p className="leading-none font-medium">
          AI model confidence in your {lastAssessment.risk_level} risk result
        </p>
        <p className="text-muted-foreground leading-none text-xs">
          Red arc = {pct}% confidence · gray = remaining uncertainty
        </p>
      </CardFooter>
    </Card>
  );
}

export function AssessmentConfidenceRadialChartSkeleton() {
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
        <Skeleton className="mx-auto h-4 w-44" />
        <Skeleton className="mx-auto h-3 w-56" />
      </CardFooter>
    </Card>
  );
}
