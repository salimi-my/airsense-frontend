import { ContentCard } from "@/components/layout/content-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="w-full flex-col items-start justify-center gap-4 lg:flex lg:flex-row">
      <Skeleton className="h-9 w-full shrink-0 lg:h-[116px] lg:w-60" />

      <div className="mt-6 w-full lg:mt-0">
        <ContentCard
          title="Profile Information"
          description="Here's your profile section where you can view and manage your profile."
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="size-24 rounded-full" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
