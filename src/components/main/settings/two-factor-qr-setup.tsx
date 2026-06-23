"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast } from "@/lib/error-handler";
import { EnableTwoFactorSchema } from "@/schemas";
import { TwoFactorEnableData, TwoFactorSetupData } from "@/types";

interface TwoFactorQRSetupProps {
  setupData: TwoFactorSetupData;
  onSuccess: (data: TwoFactorEnableData) => void;
  onCancel: () => void;
}

export function TwoFactorQRSetup({
  setupData,
  onSuccess,
  onCancel,
}: TwoFactorQRSetupProps) {
  const { enableTwoFactor } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const form = useForm<z.infer<typeof EnableTwoFactorSchema>>({
    resolver: standardSchemaResolver(EnableTwoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EnableTwoFactorSchema>) => {
    try {
      setIsLoading(true);
      const result = await enableTwoFactor({
        setErrors,
        code: values.code,
      });

      toast.success("Two-factor authentication has been enabled successfully!");
      onSuccess(result);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-lg border p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Set up Two-Factor Authentication
          </h2>
          <p className="text-muted-foreground text-sm">
            Follow these steps to enable two-factor authentication using Google
            Authenticator or any compatible TOTP app.
          </p>
        </div>

        {/* Step 1: Download App */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              Step 1: Download an Authenticator App
            </h3>
            <p className="text-muted-foreground text-sm">
              Download and install an authenticator app such as Google
              Authenticator, Authy, or Microsoft Authenticator on your mobile
              device.
            </p>
          </div>

          {/* Download Links */}
          <div className="flex flex-wrap gap-2 pb-1.5">
            <a
              href="https://apps.apple.com/app/google-authenticator/id388497605"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/app-store.svg"
                alt="Download Google Authenticator on the App Store"
                width={169}
                height={49}
                className="h-[49px] w-auto"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/google-play.svg"
                alt="Get Google Authenticator on Google Play"
                width={169}
                height={49}
                className="h-[49px] w-auto"
              />
            </a>
          </div>
        </div>

        {/* Step 2: Scan QR Code */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Step 2: Scan the QR Code</h3>
          <div className="flex flex-col items-start space-y-4">
            <div className="flex size-[350px] max-w-fit items-center justify-center rounded-lg border bg-white p-4">
              <div
                className="size-[320px] max-w-fit max-[425px]:h-[220px] max-[375px]:h-[150px] [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: setupData.qr_code_svg }}
              />
            </div>

            {/* Alternative: Manual Entry */}
            <details className="w-full max-w-[350px]">
              <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
                Can&apos;t scan? Enter this code manually
              </summary>
              <div className="bg-muted mt-2 rounded-md p-3">
                <p className="font-mono text-sm break-all">
                  {setupData.secret}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Enter this code in your authenticator app along with your
                  account name.
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* Step 3: Enter Verification Code */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">
            Step 3: Enter Verification Code
          </h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="2fa-setup-code">
                    6-digit code from your authenticator app
                  </FieldLabel>
                  <div className="flex justify-start">
                    <InputOTP
                      {...field}
                      id="2fa-setup-code"
                      maxLength={6}
                      aria-invalid={fieldState.invalid}
                    >
                      <InputOTPGroup className="gap-1.5 md:grid md:w-full md:grid-cols-6 [&>[data-slot=input-otp-slot]]:border-l">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            className="max-[768px]:size-12 max-[425px]:size-10 max-[375px]:size-8 md:h-14 md:w-[58px]"
                            index={i}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {/* Client-side validation error */}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {/* Server-side validation error returned from the API */}
                  {errors.code && <FieldError>{errors.code[0]}</FieldError>}
                </Field>
              )}
            />

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="max-md:text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="max-md:text-xs"
              >
                {isLoading && (
                  <>
                    <Spinner className="!size-4" />
                    <span>Enabling...</span>
                  </>
                )}
                {!isLoading && (
                  <>
                    <span className="block max-xl:hidden">
                      Enable Two-Factor Authentication
                    </span>
                    <span className="hidden max-xl:block">Enable 2FA</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
