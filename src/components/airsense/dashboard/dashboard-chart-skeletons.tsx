import { AssessmentConfidenceRadialChartSkeleton } from "@/components/airsense/dashboard/assessment-confidence-radial-chart";
import { DashboardStatsCardsSkeleton } from "@/components/airsense/dashboard/dashboard-stats-cards";
import { RecentAssessmentsSkeleton } from "@/components/airsense/dashboard/recent-assessments";
import { ValleyBandRadialChartSkeleton } from "@/components/airsense/dashboard/valley-band-radial-chart";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardTrendChartSkeleton() {
  return (
    <div className="airsense-surface flex h-full min-h-[420px] min-w-0 flex-col gap-4 rounded-2xl p-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="min-h-[280px] w-full flex-1 rounded-xl" />
    </div>
  );
}

export function DashboardMapPreviewSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-[280px] w-full rounded-2xl xl:h-[480px]" />
    </div>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="min-w-0 space-y-6">
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center xl:w-auto">
          <Skeleton className="h-8 w-full sm:w-64" />
          <Skeleton className="h-8 w-full sm:w-32" />
          <Skeleton className="h-8 w-full sm:w-36" />
        </div>
      </div>

      <DashboardStatsCardsSkeleton />

      <div className="grid gap-4 max-md:gap-3 xl:grid-cols-12 xl:items-stretch">
        <div className="flex flex-col xl:col-span-7">
          <DashboardTrendChartSkeleton />
        </div>
        <div className="flex min-h-0 flex-col xl:col-span-5">
          <RecentAssessmentsSkeleton />
        </div>
      </div>

      <DashboardMapPreviewSkeleton />

      <div className="grid gap-4 max-md:gap-3 lg:grid-cols-2">
        <ValleyBandRadialChartSkeleton />
        <AssessmentConfidenceRadialChartSkeleton />
      </div>
    </div>
  );
}
