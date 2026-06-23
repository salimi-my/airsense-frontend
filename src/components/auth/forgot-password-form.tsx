"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { ForgotPasswordSchema } from "@/schemas";
import { AuthErrors } from "@/types";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: standardSchemaResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    setIsLoading(true);

    try {
      await forgotPassword({
        ...values,
        setErrors: (newErrors: AuthErrors) => {
          setErrors(newErrors);
          // If there are server-side errors, stop the loading state immediately
          const hasErrors = Object.values(newErrors).some(
            (errorArray) => errorArray && errorArray.length > 0,
          );
          if (hasErrors) {
            setIsLoading(false);
          }
        },
        setMessage: (newMessage: string | null) => {
          setMessage(newMessage);
        },
      });

      setIsLoading(false);
    } catch {
      // Only stop loading on an unexpected exception; successful requests
      // and server-side errors are handled above
      setIsLoading(false);
    }
  };

  // Flattens all field-level server errors into a single banner message
  const getErrorMessage = () => {
    const allErrors = Object.values(errors).flat();
    return allErrors.length > 0 ? allErrors[0] : undefined;
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 md:p-8">
      <div className="flex h-full flex-col justify-center gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground text-balance">
            Enter your email and we will send you a link to reset your password
          </p>
        </div>
        <FormError message={getErrorMessage()} />
        {!isLoading && getErrorMessage() === undefined && message && (
          <FormSuccess message={message} />
        )}
        <FieldGroup>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="forgot-email"
                  type="email"
                  disabled={isLoading}
                  placeholder="Enter email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? (
            <>
              <Spinner className="size-4" />
              Sending...
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </Button>

        <div className="-mt-2">
          <Link
            href="/login"
            className="group -ml-1 inline-flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="size-4" />
            <span className="relative overflow-hidden">
              Back to Login
              <span className="absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 transform bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"></span>
            </span>
          </Link>
        </div>
      </div>
    </form>
  );
}
