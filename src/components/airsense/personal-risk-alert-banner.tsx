"use client";

import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

interface PersonalRiskAlertBannerProps {
  risk: string;
  advice: string;
  className?: string;
}

export function PersonalRiskAlertBanner({
  risk,
  advice,
  className,
}: PersonalRiskAlertBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl bg-gradient-to-r from-red-700 to-red-500 px-4 py-3.5 text-sm text-white shadow-md",
        className,
      )}
      role="alert"
    >
      <div className="flex w-full items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            Personal Health Alert — {risk} Risk
          </p>
          <p className="mt-1 text-white/90">{advice}</p>
        </div>
      </div>
    </div>
  );
}
