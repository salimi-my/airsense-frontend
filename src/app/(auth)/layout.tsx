import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { AuthenticatedUserRedirect } from "@/components/auth/authenticated-user-redirect";
import { Footer } from "@/components/auth/footer";
import { ModeToggle } from "@/components/mode-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center p-6 pt-20 md:p-10">
      <Suspense fallback={null}>
        <AuthenticatedUserRedirect />
      </Suspense>
      <Link href="/" className="absolute top-5 left-5 flex items-center gap-2">
        <div className="bg-primary text-primary-foreground dark:bg-primary flex aspect-square size-7 items-center justify-center rounded-lg">
          <Image
            src="/airsense.png"
            alt={`AirSense Logo`}
            className="mt-0"
            width={14}
            height={14}
          />
        </div>
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate text-base font-bold">AirSense</span>
        </div>
      </Link>
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-[54rem]">
        {children}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
