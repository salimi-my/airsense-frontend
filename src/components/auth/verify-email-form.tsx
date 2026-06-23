"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { AuthErrors } from "@/types";

export function VerifyEmailForm() {
  const { logout, resendEmailVerification } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/dashboard",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthErrors>({});

  const handleResendVerificationEmail = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await resendEmailVerification({ setErrors, setMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the first error message from any field
  const getErrorMessage = () => {
    const allErrors = Object.values(errors).flat();
    return allErrors.length > 0 ? allErrors[0] : undefined;
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex h-full flex-col justify-center gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Verify Email Address</h1>
          <p className="text-muted-foreground text-balance">
            Click the link sent to your email to verify your email address.
          </p>
        </div>
        <FormError message={getErrorMessage()} />
        {message === "Verification link sent successfully" && (
          <FormSuccess message="Verification link sent to your email" />
        )}
        <Button
          disabled={isLoading}
          type="button"
          className="w-full"
          onClick={handleResendVerificationEmail}
        >
          {isLoading ? (
            <>
              <Spinner className="size-4" />
              Sending verification email...
            </>
          ) : (
            <span>Resend Verification Email</span>
          )}
        </Button>
        <Button
          variant="outline"
          className="bg-sidebar dark:bg-sidebar -mt-3 h-8 w-full cursor-pointer"
          onClick={logout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </div>
  );
}
