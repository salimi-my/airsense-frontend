import type { Metadata } from "next";
import Image from "next/image";

import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify Email — AirSense",
  description:
    "This is the verify email page of the AirSense web application where you can verify your email address.",
};

export default function VerifyEmailPage() {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid min-h-[450px] p-0 md:grid-cols-2">
        <VerifyEmailForm />
        <div className="bg-primary/15 dark:bg-primary/95 hidden items-center justify-center p-4 md:flex">
          <Image
            src="/verify-email-vector.svg"
            alt="Verify email"
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
