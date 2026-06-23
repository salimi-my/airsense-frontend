"use client";

import { Shield, ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { RecoveryCodesManagement } from "@/components/main/settings/recovery-codes-management";
import { TwoFactorQRSetup } from "@/components/main/settings/two-factor-qr-setup";
import { TwoFactorRecoveryCodes } from "@/components/main/settings/two-factor-recovery-codes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast } from "@/lib/error-handler";
import { TwoFactorEnableData, TwoFactorSetupData, User } from "@/types";

interface SecurityFormProps {
  user: User;
}

type SetupStep = "disabled" | "setting-up" | "showing-codes" | "enabled";

export function SecurityForm({ user }: SecurityFormProps) {
  const { setupTwoFactor, disableTwoFactor } = useAuth();
  const [step, setStep] = useState<SetupStep>(
    user.two_factor_enabled ? "enabled" : "disabled",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  // Local override for immediate UI updates after enable/disable actions
  const [twoFactorEnabledOverride, setTwoFactorEnabledOverride] = useState<
    boolean | null
  >(null);
  const isTwoFactorEnabled =
    twoFactorEnabledOverride ?? user.two_factor_enabled;

  const handleStartSetup = async () => {
    try {
      setIsLoading(true);
      const data = await setupTwoFactor();
      setSetupData(data);
      setStep("setting-up");
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupSuccess = (data: TwoFactorEnableData) => {
    setRecoveryCodes(data.recovery_codes);
    setStep("showing-codes");
  };

  const handleSetupCancel = () => {
    setSetupData(null);
    setStep("disabled");
  };

  const handleCodesClose = () => {
    setRecoveryCodes([]);
    setStep("enabled");
    setTwoFactorEnabledOverride(true);
  };

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true);
      await disableTwoFactor();
      setStep("disabled");
      setTwoFactorEnabledOverride(false);
      toast.success("Two-factor authentication has been disabled");
      setOpen(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "setting-up" && setupData) {
    return (
      <TwoFactorQRSetup
        setupData={setupData}
        onSuccess={handleSetupSuccess}
        onCancel={handleSetupCancel}
      />
    );
  }

  if (step === "showing-codes" && recoveryCodes.length > 0) {
    return (
      <TwoFactorRecoveryCodes
        recoveryCodes={recoveryCodes}
        onClose={handleCodesClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Main 2FA Status */}
      <div className="space-y-4 rounded-lg border p-6">
        <div className="flex justify-between max-xl:flex-col max-xl:gap-4 xl:items-center">
          <div className="flex items-center gap-1.5 max-xl:order-2 max-xl:items-start">
            {isTwoFactorEnabled ? (
              <ShieldCheck className="size-8 shrink-0 text-green-600" />
            ) : (
              <ShieldX className="size-8 shrink-0 text-gray-400" />
            )}
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-muted-foreground text-sm text-pretty">
                Add an extra layer of security to your account using Google
                Authenticator or any compatible TOTP app.
              </p>
            </div>
          </div>
          <Badge
            variant={isTwoFactorEnabled ? "default" : "secondary"}
            className="max-xl:order-1"
          >
            {isTwoFactorEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>

        {!isTwoFactorEnabled ? (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="mb-2 font-medium">
                Why enable two-factor authentication?
              </h4>
              <ul className="text-muted-foreground list-outside list-disc space-y-1 ps-4 text-sm">
                <li>
                  Protects your account even if your password is compromised
                </li>
                <li>Generates time-based codes using your mobile device</li>
                <li>
                  Works with Google Authenticator, Authy, and other TOTP apps
                </li>
                <li>Includes recovery codes for emergency access</li>
              </ul>
            </div>

            <Button
              onClick={handleStartSetup}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner className="!size-4" />
                  Setting up...
                </>
              ) : (
                <>
                  <Shield className="!size-4" />
                  <span className="block max-xl:hidden">
                    Enable Two-Factor Authentication
                  </span>
                  <span className="hidden max-xl:block">Enable 2FA</span>
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-center gap-1.5 max-xl:items-start">
                <ShieldCheck className="size-6 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Two-factor authentication is active
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Your account is protected with an additional security layer.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  className="max-xl:w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="!size-4" />
                      Disabling...
                    </>
                  ) : (
                    <>
                      <ShieldX className="!size-4" />
                      <span className="block max-xl:hidden">
                        Disable Two-Factor Authentication
                      </span>
                      <span className="hidden max-xl:block">Disable 2FA</span>
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Disable Two-Factor Authentication?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the additional security layer from your
                    account. You will only need your password to log in. Are you
                    sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDisable2FA();
                    }}
                    variant="destructive"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="!size-4" />
                        Disabling...
                      </>
                    ) : (
                      <>Continue</>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Codes Management - Only show when 2FA is enabled */}
      {isTwoFactorEnabled && step === "enabled" && <RecoveryCodesManagement />}
    </div>
  );
}
