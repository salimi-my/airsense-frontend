import type { Metadata } from "next";
import Image from "next/image";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot Password — AirSense",
  description:
    "This is the forgot password page of the AirSense web application where you can apply to reset your password.",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid min-h-[450px] p-0 md:grid-cols-2">
        <ForgotPasswordForm />
        <div className="bg-primary/15 dark:bg-primary/95 hidden items-center justify-center p-4 md:flex">
          <Image
            src="/forgot-vector.svg"
            alt="Forgot password"
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
