import { Metadata } from "next";
import { Suspense } from "react";

import { RiskAssessmentForm } from "@/components/airsense/risk-assessment-form";
import { PageHero } from "@/components/airsense/ui-primitives";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Risk Assessment — AirSense",
  description:
    "AI-powered personalized health risk assessment based on air quality and your health profile.",
};

export default function AssessPage() {
  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="AI Decision Support"
        title="Personal Health Risk Assessment"
        description="Combine live air quality at your chosen station with your age, health profile, and planned activity. Our Random Forest model on Hugging Face returns a tailored risk level and precautions."
      />
      <Suspense fallback={<Skeleton className="min-h-[480px] w-full rounded-2xl" />}>
        <RiskAssessmentForm />
      </Suspense>
    </div>
  );
}
