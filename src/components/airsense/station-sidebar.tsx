"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { AQI_COLORS } from "@/constants/airsense";
import type { Station } from "@/types/airsense";

interface StationSidebarProps {
  stations: Station[];
}

export function StationSidebar({ stations }: StationSidebarProps) {
  const sorted = [...stations].sort(
    (a, b) => (b.latest_reading?.aqi ?? 0) - (a.latest_reading?.aqi ?? 0),
  );

  return (
    <div className="airsense-surface flex h-full flex-col rounded-2xl">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">Station Rankings</h2>
        <p className="text-muted-foreground text-xs">Sorted by current AQI</p>
      </div>
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {sorted.map((station, index) => {
          const reading = station.latest_reading;
          const color = reading
            ? AQI_COLORS[reading.color_class]
            : "#94a3b8";

          return (
            <Link
              key={station.id}
              href={`/stations/${station.id}`}
              className="group hover:bg-primary/5 flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-border hover:shadow-sm"
            >
              <span className="text-muted-foreground w-5 text-xs font-medium">
                {index + 1}
              </span>
              <span
                className="h-10 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{station.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {station.city} · {reading?.category ?? "No data"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-lg px-2.5 py-1 text-sm font-bold text-white tabular-nums"
                  style={{ backgroundColor: color }}
                >
                  {reading?.aqi ?? "—"}
                </span>
                <ChevronRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
