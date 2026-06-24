import { Metadata } from "next";
import { Suspense } from "react";

import { MapContent } from "@/components/airsense/map-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Air Map — AirSense",
  description:
    "Interactive map of Klang Valley air quality monitoring stations with live AQI readings.",
};

export default function MapPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Suspense fallback={<Skeleton className="min-h-[500px] w-full rounded-lg" />}>
        <MapContent />
      </Suspense>
    </div>
  );
}
