"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { isOAuthEnabled, isRegistrationEnabled } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { LoginSchema, VerifyCodeSchema } from "@/schemas";
import type { AuthErrors } from "@/types";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, verifyTwoFactor } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [require2FA, setRequire2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const lastCodeLengthRef = useRef(0);

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: standardSchemaResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const verifyCodeForm = useForm<z.infer<typeof VerifyCodeSchema>>({
    resolver: standardSchemaResolver(VerifyCodeSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);

    verifyCodeForm.setValue("email", values.email);
    verifyCodeForm.setValue("code", "");
    setUseRecoveryCode(false); // Always start with TOTP
    lastCodeLengthRef.current = 0; // Reset for new 2FA session

    try {
      await login({
        ...values,
        setRequire2FA: (is2FARequired: boolean) => {
          setRequire2FA(is2FARequired);
          if (is2FARequired) {
            setIsLoading(false);
          }
        },
        setErrors: (newErrors: AuthErrors) => {
          setErrors(newErrors);
          // If there are errors, set loading to false
          const hasErrors = Object.values(newErrors).some(
            (errorArray) => errorArray && errorArray.length > 0,
          );
          if (hasErrors) {
            setIsLoading(false);
          }
        },
      });
      // If we reach here and 2FA is not required and no errors, login was successful
      // Keep loading state true for successful login (user will be redirected)
    } catch {
      // Only set loading to false on exception
      setIsLoading(false);
    }
  };

  const handleVerifyCode = useCallback(
    async (values: z.infer<typeof VerifyCodeSchema>) => {
      setIsLoading(true);

      try {
        await verifyTwoFactor({
          ...values,
          setErrors: (newErrors: AuthErrors) => {
            setErrors(newErrors);
            // If there are errors, set loading to false
            const hasErrors = Object.values(newErrors).some(
              (errorArray) => errorArray && errorArray.length > 0,
            );
            if (hasErrors) {
              setIsLoading(false);
            }
          },
        });
        // If we reach here and no errors, 2FA verification was successful
        // Keep loading state true for successful verification (user will be redirected)
      } catch {
        // Only set loading to false on exception
        setIsLoading(false);
      }
    },
    [verifyTwoFactor],
  );

  // Auto-submit when all 6 digits are entered in 2FA verification (TOTP only)
  useEffect(() => {
    if (!require2FA || isLoading || useRecoveryCode) return;

    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = verifyCodeForm.watch((value, { name }) => {
      if (name === "code") {
        const currentLength = value.code?.length || 0;

        // Only auto-submit if we just reached 6 digits (not if we already had 6)
        if (currentLength === 6 && lastCodeLengthRef.current < 6) {
          verifyCodeForm.handleSubmit(handleVerifyCode)();
        }

        lastCodeLengthRef.current = currentLength;
      }
    });

    return () => subscription.unsubscribe();
  }, [
    require2FA,
    isLoading,
    useRecoveryCode,
    handleVerifyCode,
    verifyCodeForm,
  ]);

  // Detect OAuth 2FA requirement from URL parameters
  useEffect(() => {
    const requires2FA = searchParams.get("requires_2fa");
    const email = searchParams.get("email");

    if (requires2FA === "true" && email) {
      // Auto-trigger 2FA mode for OAuth users
      verifyCodeForm.setValue("email", email);
      verifyCodeForm.setValue("code", "");
      setUseRecoveryCode(false);
      lastCodeLengthRef.current = 0;
      setRequire2FA(true);

      // Clean up URL parameters
      const params = new URLSearchParams(searchParams.toString());
      params.delete("requires_2fa");
      params.delete("email");
      const newUrl = params.toString()
        ? `/login?${params.toString()}`
        : "/login";
      router.replace(newUrl);
    }
  }, [searchParams, router, verifyCodeForm]);

  const renderHeader = (title: string, desc: string) => (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-pretty">{desc}</p>
    </div>
  );

  const renderButton = (text: string) => (
    <Button disabled={isLoading} type="submit" className="w-full">
      {isLoading ? (
        <>
          <Spinner className="!size-4" />
          {text === "Login" ? "Logging in..." : "Verifying..."}
        </>
      ) : (
        <span>{text}</span>
      )}
    </Button>
  );

  const renderBackButton = () => (
    <div className="-mt-2">
      <Link
        href="/login"
        className="group -ml-1 inline-flex items-center gap-1 text-sm"
        onClick={(e) => {
          e.preventDefault();
          loginForm.reset();
          verifyCodeForm.reset();
          setIsLoading(false);
          setErrors({});
          setRequire2FA(false);
          setUseRecoveryCode(false);
          lastCodeLengthRef.current = 0;
          router.refresh();
        }}
      >
        <ChevronLeft className="size-4" />
        <span className="relative overflow-hidden">
          Back to Login
          <span className="absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 transform bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"></span>
        </span>
      </Link>
    </div>
  );

  // Get the first error message from any field
  const getErrorMessage = () => {
    const allErrors = Object.values(errors).flat();
    return allErrors.length > 0 ? allErrors[0] : undefined;
  };

  if (require2FA) {
    return (
      <form
        key="2fa-form"
        onSubmit={verifyCodeForm.handleSubmit(handleVerifyCode)}
        className="p-6 md:p-8"
      >
        <div className="flex h-full flex-col justify-center gap-6">
          {renderHeader(
            useRecoveryCode
              ? "Enter Recovery Code"
              : "Enter Authentication Code",
            useRecoveryCode
              ? "Enter one of your recovery codes to access your account"
              : "Enter the 6-digit code from your authenticator app",
          )}
          <FormError message={getErrorMessage()} />
          <input type="hidden" {...verifyCodeForm.register("email")} />
          <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
            <Controller
              control={verifyCodeForm.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="2fa-code">
                    {useRecoveryCode ? "Recovery Code" : "Authentication Code"}
                  </FieldLabel>
                  {useRecoveryCode ? (
                    <Input
                      {...field}
                      id="2fa-code"
                      autoFocus
                      placeholder="Enter recovery code"
                      aria-invalid={fieldState.invalid}
                      className="font-mono"
                    />
                  ) : (
                    <InputOTP
                      {...field}
                      id="2fa-code"
                      autoFocus
                      maxLength={6}
                      aria-invalid={fieldState.invalid}
                    >
                      <InputOTPGroup className="grid w-full grid-cols-6 gap-1.5 md:gap-2.5 [&>[data-slot=input-otp-slot]]:border-l">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            className="max-[768px]:size-12 max-[425px]:size-10 max-[375px]:size-8 md:h-14 md:w-[58px]"
                            index={i}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="-mt-4 -mb-2 flex justify-start">
            <button
              type="button"
              onClick={() => {
                setUseRecoveryCode(!useRecoveryCode);
                verifyCodeForm.setValue("code", "");
                setErrors({});
                lastCodeLengthRef.current = 0;
              }}
              className="link-hover cursor-pointer text-sm"
            >
              {useRecoveryCode
                ? "Use authenticator app instead"
                : "Use recovery code instead"}
            </button>
          </div>

          {renderButton("Verify")}
          {renderBackButton()}
        </div>
      </form>
    );
  }

  return (
    <form
      key="login-form"
      onSubmit={loginForm.handleSubmit(handleLogin)}
      className="p-6 md:p-8"
    >
      <div className="flex h-full flex-col justify-center gap-6">
        {renderHeader("Welcome back", "Login to your AirSense account")}
        <FormError message={getErrorMessage()} />
        <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
          <Controller
            control={loginForm.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
                  disabled={isLoading}
                  type="email"
                  placeholder="email@example.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={loginForm.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="login-password"
                  disabled={isLoading}
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={loginForm.control}
            name="remember"
            render={({ field }) => (
              <Field orientation="horizontal" className="-mt-1">
                <div className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="login-remember"
                    name={field.name}
                    className="cursor-pointer"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? true : false)
                    }
                  />
                  <FieldLabel
                    htmlFor="login-remember"
                    className="text-sm font-normal"
                  >
                    Remember me
                  </FieldLabel>
                </div>
                <Link
                  href="/forgot-password"
                  className="group relative ml-auto inline-block overflow-hidden text-sm"
                >
                  <span>Forgot password?</span>
                  <span className="absolute bottom-0 left-0 h-[1px] w-full origin-right scale-x-0 transform bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"></span>
                </Link>
              </Field>
            )}
          />
        </FieldGroup>
        {renderButton("Login")}
        {isOAuthEnabled() && <OAuthButtons variant="login" />}
        {isRegistrationEnabled() && (
          <div className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}
