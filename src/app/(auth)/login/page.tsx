import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import LoginForm from "@/components/auth/login-form";
import { LoginFormSkeleton } from "@/components/auth/login-form-skeleton";
import { OAuthMessageHandler } from "@/components/auth/oauth-message-handler";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login — AirSense",
  description:
    "This is the login page of the AirSense web application where you can access all the tools and features provided by the application.",
};

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <OAuthMessageHandler />
      </Suspense>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid min-h-[450px] p-0 md:grid-cols-2">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
          <div className="bg-primary/15 dark:bg-primary/95 hidden items-center justify-center p-4 md:flex">
            <Image
              src="/login-vector-2.svg"
              alt="Login"
              width={351}
              height={209}
              priority
              className="h-auto max-h-none w-full opacity-95"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
