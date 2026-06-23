"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  CheckIcon,
  ChevronLeft,
  EyeIcon,
  EyeOffIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";
import { PasswordResetSchema } from "@/schemas";
import { AuthErrors } from "@/types";

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character",
  },
];

interface PasswordResetFormProps {
  token: string;
  email: string | string[];
}

export function PasswordResetForm({ token, email }: PasswordResetFormProps) {
  const { resetPassword } = useAuth({ middleware: "guest" });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: standardSchemaResolver(PasswordResetSchema),
    defaultValues: {
      email: Array.isArray(email) ? email[0] : email,
      token: token,
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof PasswordResetSchema>) => {
    setIsLoading(true);

    try {
      await resetPassword({
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

  // Watch password value in real-time to drive the strength indicator
  // eslint-disable-next-line react-hooks/incompatible-library
  const password = form.watch("password");

  // Map each requirement against the current password value
  const passwordStrength = useMemo(() => {
    return passwordRequirements.map((req) => ({
      met: req.regex.test(password || ""),
      text: req.text,
    }));
  }, [password]);

  const strengthScore = useMemo(() => {
    return passwordStrength.filter((req) => req.met).length;
  }, [passwordStrength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-destructive";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-amber-500";
    if (score === 4) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score <= 3) return "Medium password";
    if (score === 4) return "Strong password";
    return "Very strong password";
  };

  // Locks the form after a successful reset to prevent resubmission
  const isSuccessfullyReset = Boolean(
    !isLoading && message && !getErrorMessage(),
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 md:p-8">
      <div className="flex h-full flex-col justify-center gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Password Reset</h1>
          <p className="text-muted-foreground text-balance">
            Create a new password for your account
          </p>
        </div>
        <FormError message={getErrorMessage()} />
        {!isLoading && getErrorMessage() === undefined && message && (
          <FormSuccess message={message} />
        )}
        <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="reset-email"
                  type="email"
                  disabled={isLoading || isSuccessfullyReset}
                  placeholder="Enter email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-password">New Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="reset-password"
                    type={isPasswordVisible ? "text" : "password"}
                    disabled={isLoading || isSuccessfullyReset}
                    placeholder="Enter new password"
                    className="pr-10"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    tabIndex={-1}
                    disabled={isLoading || isSuccessfullyReset}
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                    <span className="sr-only">
                      {isPasswordVisible ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>

                {/* Password strength indicator — only shown once the user starts typing */}
                {password && (
                  <>
                    <div className="mt-3 flex h-1 w-full gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "h-full flex-1 rounded-full transition-all duration-500 ease-out",
                            index < strengthScore
                              ? getStrengthColor(strengthScore)
                              : "bg-border",
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-foreground mt-3 text-xs font-medium">
                      {getStrengthText(strengthScore)}. Must contain:
                    </p>

                    <ul className="mt-2 space-y-1.5">
                      {passwordStrength.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckIcon className="size-3.5 text-green-600 dark:text-green-400" />
                          ) : (
                            <XIcon className="text-muted-foreground size-3.5" />
                          )}
                          <span
                            className={cn(
                              "text-xs",
                              req.met
                                ? "text-green-600 dark:text-green-400"
                                : "text-muted-foreground",
                            )}
                          >
                            {req.text}
                            <span className="sr-only">
                              {req.met
                                ? " - Requirement met"
                                : " - Requirement not met"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password_confirmation"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-confirm-password">
                  Confirm New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="reset-confirm-password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    disabled={isLoading || isSuccessfullyReset}
                    placeholder="Confirm new password"
                    className="pr-10"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                    className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    tabIndex={-1}
                    disabled={isLoading || isSuccessfullyReset}
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                    <span className="sr-only">
                      {isConfirmPasswordVisible
                        ? "Hide password"
                        : "Show password"}
                    </span>
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          disabled={isLoading || isSuccessfullyReset}
          type="submit"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Spinner className="size-4" />
              Resetting...
            </>
          ) : (
            <span>Reset Password</span>
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
