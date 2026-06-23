import { Skeleton } from "@/components/ui/skeleton";

export function LoginFormSkeleton() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex h-full flex-col justify-center gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Skeleton className="h-[14px] w-12" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Skeleton className="h-[14px] w-16" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Remember me & Forgot password */}
        <div className="-mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-4 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-28" />
        </div>

        {/* Login button */}
        <Skeleton className="h-9 w-full" />

        {/* OAuth buttons space */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2">
                <Skeleton className="h-5 w-24" />
              </span>
            </div>
          </div>
          <div className="grid gap-3 min-[900px]:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>

        {/* Register link */}
        <Skeleton className="mx-auto h-5 w-56" />
      </div>
    </div>
  );
}
