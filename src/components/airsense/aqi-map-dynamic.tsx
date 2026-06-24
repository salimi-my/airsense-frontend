"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const AQIMapDynamic = dynamic(
  () => import("./aqi-map").then((mod) => mod.AQIMap),
  {
    ssr: false,
    loading: () => <Skeleton className="min-h-[500px] w-full rounded-lg" />,
  },
);
