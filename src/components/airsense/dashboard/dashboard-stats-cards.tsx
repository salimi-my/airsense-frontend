"use client";

import { CheckCircle, ClipboardList, MapPin, Wind } from "lucide-react";

import { AQI_COLORS, RISK_COLORS } from "@/constants/airsense";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/types/airsense";

interface DashboardStatsCardsProps {
  dashboard: DashboardData | undefined;
  isLoading: boolean;
}

export function DashboardStatsCards({
  dashboard,
  isLoading,
}: DashboardStatsCardsProps) {
  if (isLoading) {
    return <DashboardStatsCardsSkeleton />;
  }

  if (!dashboard) return null;

  const preferredAqi = dashboard.preferred_station?.latest_reading?.aqi;
  const preferredColor =
    dashboard.preferred_station?.latest_reading?.color_class;
  const riskLevel = dashboard.last_assessment?.risk_level;

  return (
    <div className="grid grid-cols-2 gap-4 max-md:gap-2 xl:grid-cols-4">
      <CardStat
        title="My Risk"
        icon={CheckCircle}
        iconClass={riskLevel ? "" : "text-muted-foreground"}
        value={
          riskLevel ? (
            <Badge
              className="border-0 text-sm font-semibold text-white"
              style={{ backgroundColor: RISK_COLORS[riskLevel] }}
            >
              {riskLevel}
            </Badge>
          ) : (
            "Not assessed"
          )
        }
        subtitle={
          riskLevel
            ? dashboard.last_assessment?.station_name ?? "Latest assessment"
            : "Complete a risk assessment"
        }
      />

      <CardStat
        title="Home Station AQI"
        icon={Wind}
        value={preferredAqi ?? "—"}
        valueClass="tabular-nums"
        subtitle={
          dashboard.preferred_station
            ? `${dashboard.preferred_station.name} · ${dashboard.preferred_station.latest_reading?.category ?? "No data"}`
            : "Select a station"
        }
        accent={
          preferredColor ? AQI_COLORS[preferredColor] : undefined
        }
      />

      <CardStat
        title="Active Alerts"
        icon={MapPin}
        iconClass={
          dashboard.active_alerts_count > 0
            ? "text-orange-600"
            : "text-emerald-600"
        }
        value={dashboard.active_alerts_count}
        subtitle="Unhealthy stations (AQI > 100)"
      />

      <CardStat
        title="Assessments"
        icon={ClipboardList}
        value={dashboard.assessment_count_week}
        subtitle="This week"
      />
    </div>
  );
}

function CardStat({
  title,
  icon: Icon,
  value,
  subtitle,
  iconClass,
  valueClass,
  accent,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  subtitle: string;
  iconClass?: string;
  valueClass?: string;
  accent?: string;
}) {
  return (
    <div className="airsense-surface gap-4 rounded-xl p-4 max-md:gap-2 max-md:py-3">
      <div className="mb-3 flex items-center justify-between max-md:mb-2">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide md:text-sm">
          {title}
        </p>
        <Icon className={`size-4 ${iconClass ?? "text-muted-foreground"}`} />
      </div>
      <div
        className={`text-lg font-bold md:text-2xl ${valueClass ?? ""}`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
    </div>
  );
}

export function DashboardStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 max-md:gap-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="airsense-surface rounded-xl p-4 max-md:py-3">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="mb-2 h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
