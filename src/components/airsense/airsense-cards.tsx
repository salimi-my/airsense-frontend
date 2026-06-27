import {
  AlertTriangle,
  Brain,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AQI_COLORS, RISK_COLORS, RISK_GRADIENTS } from "@/constants/airsense";
import { ConfidenceBar } from "@/components/airsense/ui-primitives";
import { Badge } from "@/components/ui/badge";
import type { AssessmentResult, PredictionData } from "@/types/airsense";
import { cn } from "@/lib/utils";

export function RiskCard({
  assessment,
  className,
}: {
  assessment: AssessmentResult;
  className?: string;
}) {
  const color = RISK_COLORS[assessment.risk] ?? "#94a3b8";
  const gradient = RISK_GRADIENTS[assessment.risk] ?? RISK_GRADIENTS.Low;

  return (
    <div className={cn("airsense-surface overflow-hidden rounded-2xl", className)}>
      <div className={cn("bg-gradient-to-br p-6 md:p-8", gradient)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Brain className="size-4" />
              AI Risk Assessment
            </div>
            <p className="text-muted-foreground text-sm">
              {assessment.station_name} · AQI {assessment.current_aqi}
            </p>
          </div>
          <Badge
            className="border-0 px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            {assessment.risk} Risk
          </Badge>
        </div>

        <p className="mt-6 text-lg leading-relaxed font-medium">
          {assessment.advice}
        </p>
      </div>

      <div className="space-y-5 p-6 md:p-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ShieldAlert className="text-primary size-4" />
            Recommended precautions
          </div>
          <ul className="grid gap-2 sm:grid-cols-1">
            {assessment.precautions.map((item) => (
              <li
                key={item}
                className="bg-muted/50 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
              >
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ConfidenceBar value={assessment.confidence} color={color} />

        {(assessment.low_confidence || assessment.used_fallback) && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-900 dark:text-amber-100">
            {assessment.low_confidence &&
              "Low confidence result — consult a healthcare professional if unsure. "}
            {assessment.used_fallback &&
              "AI service used fallback guidance based on AQI thresholds."}
          </div>
        )}

        <p className="text-muted-foreground text-xs italic">
          AirSense provides informational guidance only and is not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
}

export function PredictionCard({
  prediction,
  stationName,
}: {
  prediction: PredictionData;
  stationName: string;
}) {
  if (prediction.message && prediction.predicted_aqi === 0) {
    return (
      <div className="airsense-surface rounded-2xl p-6">
        <div className="flex items-center gap-2 font-semibold">
          <TrendingUp className="text-primary size-4" />
          24-Hour AQI Forecast
        </div>
        <p className="text-muted-foreground mt-3 text-sm">{prediction.message}</p>
      </div>
    );
  }

  const color = AQI_COLORS[prediction.color_class] ?? "#94a3b8";

  return (
    <div className="airsense-surface overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-2 font-semibold">
          <Sparkles className="text-primary size-4" />
          24-Hour AI Forecast
        </div>
        <span className="text-muted-foreground text-sm">{stationName}</span>
      </div>
      <div className="flex flex-wrap items-center gap-6 p-6 md:p-8">
        <div
          className="relative flex size-24 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 12px 40px ${color}55`,
          }}
        >
          {prediction.predicted_aqi}
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold">{prediction.category}</p>
          <ConfidenceBar value={prediction.confidence} color={color} />
        </div>
      </div>
      {prediction.message && (
        <p className="text-muted-foreground border-t px-6 py-3 text-sm">
          {prediction.message}
        </p>
      )}
      <p className="text-muted-foreground border-t px-6 py-3 text-xs italic">
        {prediction.disclaimer}
      </p>
    </div>
  );
}

export function StaleDataNotice({ stale }: { stale: boolean }) {
  if (!stale) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-amber-500/5 px-4 py-3 text-sm text-amber-950 dark:text-amber-50">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p>
        Data may be outdated. Last successful fetch was more than 2 hours ago.
      </p>
    </div>
  );
}
