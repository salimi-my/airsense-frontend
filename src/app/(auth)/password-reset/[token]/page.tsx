import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Password Reset — AirSense",
  description:
    "This is the password reset page of the AirSense web application where you can reset your password.",
};

type Params = Promise<{ token: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function PasswordResetSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid min-h-[450px] p-0 md:grid-cols-2">
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

async function PasswordResetContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { token } = await params;
  const resolvedSearchParams = await searchParams;
  const email =
    typeof resolvedSearchParams.email === "string"
      ? resolvedSearchParams.email
      : "";

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid min-h-[450px] p-0 md:grid-cols-2">
        <PasswordResetForm token={token} email={email} />
        <div className="bg-primary/15 dark:bg-primary/95 hidden items-center justify-center p-4 md:flex">
          <Image
            src="/password-vector.svg"
            alt="Reset password"
            width={351}
            height={209}
            priority
            className="h-auto max-h-none w-full opacity-95"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PasswordResetPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<PasswordResetSkeleton />}>
      <PasswordResetContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
