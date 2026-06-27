"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function RiskAssessmentLoadingCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "airsense-surface flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-8 text-center",
        className,
      )}
    >
      <Loader2 className="text-primary mb-4 size-10 animate-spin" />
      <p className="text-lg font-medium">AI is warming up, please wait a moment...</p>
      <p className="text-muted-foreground mt-2 text-sm">
        Analysing air quality and your health profile.
      </p>
    </div>
  );
}
