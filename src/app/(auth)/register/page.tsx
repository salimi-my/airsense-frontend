import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { isRegistrationEnabled, LOGIN_ROUTE } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Register — AirSense",
  description:
    "Create a new account to access all the tools and features provided by the AirSense web application.",
};

export default function RegisterPage() {
  // Redirect to login if registration is disabled
  if (!isRegistrationEnabled()) {
    redirect(LOGIN_ROUTE);
  }

  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="grid min-h-[450px] p-0 md:grid-cols-2">
        <RegisterForm />
        <div className="bg-primary/15 dark:bg-primary/95 hidden items-center justify-center p-4 md:flex">
          <Image
            src="/login-vector-1.svg"
            alt="Register"
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
