"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  CheckIcon,
  CircleCheckBig,
  EyeIcon,
  EyeOffIcon,
  Timer,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import axios from "@/lib/axios";
import { showErrorToast } from "@/lib/error-handler";
import { cn } from "@/lib/utils";
import { CreatePasswordSchema, UpdatePasswordSchema } from "@/schemas";
import type { User } from "@/types";

const INITIAL_COUNTDOWN = 10;
const COUNTDOWN_INTERVAL = 1000;

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

interface PasswordFormProps {
  user: User;
}

export function PasswordForm({ user }: PasswordFormProps) {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const hasPassword = user.has_password;

  const updateForm = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: standardSchemaResolver(UpdatePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const createForm = useForm<z.infer<typeof CreatePasswordSchema>>({
    resolver: standardSchemaResolver(CreatePasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  // Active form alias — used for shared operations like reset
  const form = hasPassword ? updateForm : createForm;

  // Countdown timer effect — auto-logs out the user when it reaches zero
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showSuccessDialog && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, COUNTDOWN_INTERVAL);
    } else if (showSuccessDialog && countdown === 0) {
      logout();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSuccessDialog, countdown, logout]);

  const onSubmit = async (
    values: z.infer<typeof UpdatePasswordSchema | typeof CreatePasswordSchema>,
  ) => {
    try {
      setIsLoading(true);
      const endpoint = "/api/users/update-password";
      const response = await axios.patch(endpoint, values);

      if (response.status === 200) {
        // Show toast notification
        toast.success(response.data.message);
        // Reset form
        form.reset();
        // Show success dialog and start the logout countdown
        setShowSuccessDialog(true);
        // Reset countdown in case the dialog was previously dismissed
        setCountdown(INITIAL_COUNTDOWN);
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginNow = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowSuccessDialog(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Watch password value in real-time to drive the strength indicator
  const newPassword = hasPassword
    ? // eslint-disable-next-line react-hooks/incompatible-library
      updateForm.watch("password")
    : createForm.watch("password");

  // Map each requirement against the current password value
  const passwordStrength = useMemo(() => {
    return passwordRequirements.map((req) => ({
      met: req.regex.test(newPassword || ""),
      text: req.text,
    }));
  }, [newPassword]);

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
    <>
      {/* Password Form */}
      {hasPassword ? (
        <form
          onSubmit={updateForm.handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col gap-3"
        >
          <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
            <Controller
              control={updateForm.control}
              name="old_password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-old-password">
                    Current Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="update-old-password"
                      type={isOldPasswordVisible ? "text" : "password"}
                      disabled={isLoading}
                      placeholder="Enter current password"
                      className="pr-10"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setIsOldPasswordVisible(!isOldPasswordVisible)
                      }
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                      tabIndex={-1}
                    >
                      {isOldPasswordVisible ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                      <span className="sr-only">
                        {isOldPasswordVisible
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
              control={updateForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-new-password">
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="update-new-password"
                      type={isNewPasswordVisible ? "text" : "password"}
                      disabled={isLoading}
                      placeholder="Enter new password"
                      className="pr-10"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                      tabIndex={-1}
                    >
                      {isNewPasswordVisible ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                      <span className="sr-only">
                        {isNewPasswordVisible
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>

                  {/* Password strength indicator — only shown once the user starts typing */}
                  {newPassword && (
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
              control={updateForm.control}
              name="password_confirmation"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="update-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="update-confirm-password"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      disabled={isLoading}
                      placeholder="Enter confirm password"
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
          </FieldGroup>

          <div className="mt-4 flex justify-end gap-2">
            <Button disabled={isLoading} type="submit">
              {isLoading && (
                <>
                  <Spinner className="size-4" />
                  <span>Updating...</span>
                </>
              )}
              {!isLoading && <span>Update Password</span>}
            </Button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={createForm.handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex flex-col gap-3"
        >
          <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
            <Controller
              control={createForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="create-password"
                      type={isNewPasswordVisible ? "text" : "password"}
                      disabled={isLoading}
                      placeholder="Enter password"
                      className="pr-10"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                      tabIndex={-1}
                    >
                      {isNewPasswordVisible ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                      <span className="sr-only">
                        {isNewPasswordVisible
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>

                  {/* Password strength indicator — only shown once the user starts typing */}
                  {newPassword && (
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
              control={createForm.control}
              name="password_confirmation"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="create-confirm-password"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      disabled={isLoading}
                      placeholder="Confirm password"
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
          </FieldGroup>

          <div className="mt-4 flex justify-end gap-2">
            <Button disabled={isLoading} type="submit">
              {isLoading && (
                <>
                  <Spinner className="size-4" />
                  <span>Creating...</span>
                </>
              )}
              {!isLoading && <span>Create Password</span>}
            </Button>
          </div>
        </form>
      )}

      {/* Success Alert Dialog — shown after password update/create, auto-logs out via countdown */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CircleCheckBig className="size-6" />
              <span>
                {hasPassword
                  ? "Password Updated Successfully!"
                  : "Password Created Successfully!"}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {hasPassword
                ? "Your password has been updated successfully. For security reasons, you will be redirected to the login page to sign in with your new password."
                : "Your password has been created successfully. You can now use your email and password to login. For security reasons, you will be redirected to the login page."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="bg-secondary flex items-center justify-center gap-2 rounded-lg py-3">
              <Timer className="size-4" />
              <span className="text-sm font-medium">
                Redirecting in {countdown} seconds...
              </span>
            </div>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleLoginNow();
              }}
              disabled={isLoggingOut}
              className="w-full"
            >
              {isLoggingOut ? (
                <>
                  <Spinner className="!size-4" />
                  Logging out...
                </>
              ) : (
                "Login Now"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
