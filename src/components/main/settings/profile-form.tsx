"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { AvatarUpload } from "@/components/main/settings/avatar-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Spinner } from "@/components/ui/spinner";
import { useEmailChange } from "@/hooks/use-email-change";
import axios from "@/lib/axios";
import { showErrorToast } from "@/lib/error-handler";
import { capitalizeWords } from "@/lib/utils";
import { Mars, Transgender, Venus } from "lucide-react";
import { EmailChangeRequestSchema, ProfileSchema } from "@/schemas";
import { User } from "@/types";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChangeDialogOpen, setIsEmailChangeDialogOpen] = useState(false);
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);

  const {
    status: emailChangeStatus,
    isLoading: isStatusLoading,
    requestEmailChange,
    cancelEmailChange,
    resendEmailChange,
    mutate,
  } = useEmailChange();

  // Handle email verification redirect — reads the `email-change` query param
  // set by the server after the user clicks the verification link in their email
  useEffect(() => {
    const emailChanged = searchParams.get("email-change");

    if (emailChanged !== null) {
      if (emailChanged === "1") {
        toast.success("Email address changed successfully!");
        // Refresh the email change status and user data
        mutate();
        router.refresh();
      } else if (emailChanged === "0") {
        toast.error(
          "Failed to verify your email. The link may have expired or is invalid.",
        );
      }

      // Clean up the URL parameter so it doesn't persist on refresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("email-change");
      const newUrl = params.toString()
        ? `/settings?${params.toString()}`
        : "/settings";
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router, mutate]);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: standardSchemaResolver(ProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone || undefined,
      gender: user.gender ?? undefined,
    },
  });

  const emailChangeForm = useForm<z.infer<typeof EmailChangeRequestSchema>>({
    resolver: standardSchemaResolver(EmailChangeRequestSchema),
    defaultValues: {
      new_email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.patch("/api/users/update-profile", values);

      if (response.status === 200) {
        toast.success(response.data.message);
        router.refresh();
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailChangeRequest = async (
    values: z.infer<typeof EmailChangeRequestSchema>,
  ) => {
    try {
      setIsEmailChangeLoading(true);

      const response = await requestEmailChange(
        values.new_email,
        values.password,
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsEmailChangeDialogOpen(false);
        emailChangeForm.reset();
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsEmailChangeLoading(false);
    }
  };

  const handleCancelEmailChange = async () => {
    try {
      setIsCancelLoading(true);

      const response = await cancelEmailChange();

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsCancelDialogOpen(false);
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsCancelLoading(false);
    }
  };

  const handleResendEmailChange = async () => {
    try {
      setIsResendLoading(true);

      const response = await resendEmailChange();

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AvatarUpload user={user} />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-name">Name</FieldLabel>
              <Input
                {...field}
                id="profile-name"
                disabled={isLoading}
                placeholder="Enter name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email Display - Readonly with change option */}
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="flex items-center gap-2">
            <Input
              value={user.email}
              readOnly
              className="cursor-not-allowed opacity-60"
            />
            <Button
              type="button"
              variant="outline"
              disabled={
                isStatusLoading ||
                (emailChangeStatus?.has_pending_change ?? false)
              }
              onClick={() => setIsEmailChangeDialogOpen(true)}
            >
              Change
            </Button>
          </div>
          {!isStatusLoading && emailChangeStatus?.has_pending_change && (
            <div className="rounded-md border border-yellow-500 bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pending email change</p>
                  <p className="text-xs">
                    Verification sent to: {emailChangeStatus.pending_email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isResendLoading}
                    onClick={handleResendEmailChange}
                    className="border-yellow-600 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-200 dark:hover:bg-yellow-900"
                  >
                    {isResendLoading && (
                      <>
                        <Spinner className="size-3" />
                        <span>Resending...</span>
                      </>
                    )}
                    {!isResendLoading && <span>Resend</span>}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isResendLoading}
                    onClick={() => setIsCancelDialogOpen(true)}
                    className="border-yellow-600 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-200 dark:hover:bg-yellow-900"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field className="gap-2" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-phone">Phone Number</FieldLabel>
              <PhoneInput
                {...field}
                id="profile-phone"
                disabled={isLoading}
                international={false}
                defaultCountry="MY"
                placeholder="Enter phone number"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="gender"
          render={({ field, fieldState }) => (
            <Field className="gap-2" data-invalid={fieldState.invalid}>
              <FieldLabel>Gender</FieldLabel>
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                disabled={isLoading}
              >
                <FieldLabel htmlFor="profile-gender-male">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Mars className="size-3.5" /> Male
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="male" id="profile-gender-male" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="profile-gender-female">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Venus className="size-3.5" /> Female
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="female" id="profile-gender-female" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="profile-gender-other">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Transgender className="size-3.5" /> Other
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="other" id="profile-gender-other" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Role Display - Readonly */}
        <div className="space-y-2">
          <Label>Role</Label>
          <Input
            value={user.role ? capitalizeWords(user.role.name) : "No Role"}
            readOnly
            className="cursor-not-allowed opacity-60"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <>
                <Spinner className="size-4" />
                <span>Saving...</span>
              </>
            )}
            {!isLoading && <span>Save Changes</span>}
          </Button>
        </div>
      </form>

      {/* Email Change Dialog */}
      <Dialog
        open={isEmailChangeDialogOpen}
        onOpenChange={setIsEmailChangeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>
              Enter your new email address and current password. A verification
              link will be sent to your new email address.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={emailChangeForm.handleSubmit(onEmailChangeRequest)}
            className="space-y-4"
          >
            <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
              <Controller
                control={emailChangeForm.control}
                name="new_email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email-change-new-email">
                      New Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email-change-new-email"
                      type="email"
                      disabled={isEmailChangeLoading}
                      placeholder="Enter new email address"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={emailChangeForm.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email-change-password">
                      Current Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email-change-password"
                      type="password"
                      disabled={isEmailChangeLoading}
                      placeholder="Enter your current password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isEmailChangeLoading}
                onClick={() => {
                  setIsEmailChangeDialogOpen(false);
                  emailChangeForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEmailChangeLoading}>
                {isEmailChangeLoading && (
                  <>
                    <Spinner className="size-4" />
                    <span>Requesting...</span>
                  </>
                )}
                {!isEmailChangeLoading && <span>Request Change</span>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Email Change Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Email Change?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your pending email change to{" "}
              <strong>{emailChangeStatus?.pending_email}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelLoading}>
              No, Keep It
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isCancelLoading}
              onClick={(e) => {
                e.preventDefault();
                handleCancelEmailChange();
              }}
            >
              {isCancelLoading && (
                <>
                  <Spinner className="size-4" />
                  <span>Cancelling...</span>
                </>
              )}
              {!isCancelLoading && <span>Yes, Cancel Change</span>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
