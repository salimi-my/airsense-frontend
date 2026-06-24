import { Skeleton } from "@/components/ui/skeleton";

export function DashboardTrendChartSkeleton() {
  return (
    <div className="airsense-surface flex h-full min-h-[420px] min-w-0 flex-col gap-4 rounded-2xl p-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="min-h-[280px] w-full flex-1 rounded-xl" />
    </div>
  );
}
