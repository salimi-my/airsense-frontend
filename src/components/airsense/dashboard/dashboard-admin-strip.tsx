"use client";

import { AlertTriangle, ClipboardList, Database } from "lucide-react";
import Link from "next/link";

import type { DashboardAdminStats } from "@/types/airsense";
import { cn } from "@/lib/utils";

interface DashboardAdminStripProps {
  admin: DashboardAdminStats;
}

export function DashboardAdminStrip({ admin }: DashboardAdminStripProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">System Overview</h2>
        <Link
          href="/admin/logs"
          className="text-primary text-xs font-medium hover:underline"
        >
          View system logs →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        <AdminCard
          label="Assessments today"
          value={admin.assessments_today}
          icon={ClipboardList}
        />
        <AdminCard
          label="Stale stations"
          value={admin.stale_stations_count}
          icon={AlertTriangle}
          accent={
            admin.stale_stations_count > 0 ? "text-orange-600" : undefined
          }
        />
        <AdminCard
          label="Last data fetch"
          value={
            admin.last_fetch_at
              ? new Date(admin.last_fetch_at).toLocaleString()
              : "—"
          }
          icon={Database}
          isText
          className="col-span-2 xl:col-span-1"
        />
      </div>
    </div>
  );
}

function AdminCard({
  label,
  value,
  icon: Icon,
  accent,
  isText = false,
  className,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
  isText?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("airsense-surface rounded-xl p-4", className)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <Icon className={`size-4 ${accent ?? "text-muted-foreground"}`} />
      </div>
      <p
        className={`font-semibold ${isText ? "text-sm" : "text-2xl tabular-nums"}`}
      >
        {value}
      </p>
    </div>
  );
}
