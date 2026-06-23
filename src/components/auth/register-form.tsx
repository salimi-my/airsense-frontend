"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { isOAuthEnabled } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import type { AuthErrors } from "@/types";

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

export default function RegisterForm() {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: standardSchemaResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  });

  const handleRegister = async (values: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true);

    // Exclude `terms` from the API payload — it is client-side only and
    // not expected by the server registration endpoint
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { terms, ...registerData } = values;

    try {
      await register({
        ...registerData,
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
      });
      // If we reach here with no errors, registration was successful —
      // keep loading true so the UI stays disabled while the redirect fires
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
      met: req.regex.test(password),
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

  return (
    <form
      onSubmit={form.handleSubmit(handleRegister)}
      autoComplete="off"
      className="p-6 md:p-8"
    >
      <div className="flex h-full flex-col justify-center gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-pretty">
            Enter your information to get started
          </p>
        </div>
        <FormError message={getErrorMessage()} />
        <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="register-name"
                  disabled={isLoading}
                  type="text"
                  placeholder="John Doe"
                  autoComplete="off"
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
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="register-email"
                  disabled={isLoading}
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="off"
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
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="register-password"
                    disabled={isLoading}
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
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
                <FieldLabel htmlFor="register-confirm-password">
                  Confirm Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="register-confirm-password"
                    disabled={isLoading}
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
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

          <Controller
            control={form.control}
            name="terms"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1">
                <Field
                  orientation="horizontal"
                  className="-mt-1 items-start"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id="register-terms"
                    name={field.name}
                    className="mt-0.5 cursor-pointer"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? true : false)
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel
                    htmlFor="register-terms"
                    className="text-muted-foreground group block cursor-pointer gap-0 text-sm font-normal"
                  >
                    <span className="me-1">
                      By signing up, you agree to the
                    </span>
                    <Link
                      href="#"
                      className="group/link text-primary inline bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-[position:100%_100%] bg-no-repeat text-sm transition-[background-size] duration-300 hover:bg-[length:100%_1px] hover:bg-[position:0%_100%]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </Link>
                    <span className="mx-1">and</span>
                    <Link
                      href="#"
                      className="group/link text-primary inline bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-[position:100%_100%] bg-no-repeat text-sm transition-[background-size] duration-300 hover:bg-[length:100%_1px] hover:bg-[position:0%_100%]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </FieldLabel>
                </Field>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
        </FieldGroup>

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? (
            <>
              <Spinner className="!size-4" />
              Creating account...
            </>
          ) : (
            <span>Create account</span>
          )}
        </Button>
        {isOAuthEnabled() && <OAuthButtons variant="register" />}
        <div className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0"
          >
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
