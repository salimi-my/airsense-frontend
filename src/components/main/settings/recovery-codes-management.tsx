"use client";

import { Copy, Download, EyeOff, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { API_ENDPOINTS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast } from "@/lib/error-handler";

export function RecoveryCodesManagement() {
  const { getRecoveryCodesStatus, regenerateRecoveryCodes } = useAuth();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [showNewCodes, setShowNewCodes] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    data: status,
    isLoading,
    error,
    mutate,
  } = useSWR(API_ENDPOINTS.TWO_FACTOR_RECOVERY_CODES, getRecoveryCodesStatus, {
    revalidateOnFocus: true,
    errorRetryCount: 3,
  });

  const handleRegenerateCodes = async () => {
    try {
      setIsRegenerating(true);
      const result = await regenerateRecoveryCodes();
      setNewCodes(result.recovery_codes);
      setShowNewCodes(true);
      await mutate(); // Refresh status with SWR
      toast.success("Recovery codes regenerated successfully");
      setOpen(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const downloadNewCodes = () => {
    const content = [
      "Two-Factor Authentication Recovery Codes",
      "============================================",
      "",
      "Save these recovery codes in a safe place.",
      "You can use each code only once to access your account",
      "if you lose access to your authenticator app.",
      "",
      ...newCodes.map((code, index) => `${index + 1}. ${code}`),
      "",
      "Generated on: " + new Date().toLocaleString(),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Recovery codes downloaded");
  };

  const copyNewCodes = async () => {
    try {
      await navigator.clipboard.writeText(newCodes.join("\n"));
      toast.success("Recovery codes copied to clipboard");
    } catch {
      toast.error("Failed to copy recovery codes");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Status Card Skeleton */}
        <div className="space-y-4 rounded-lg border p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-80" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border p-6">
        <p className="text-destructive text-center">
          Failed to load recovery codes status. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Shield className="h-5 w-5" />
            Recovery Codes
          </h3>
          <p className="text-muted-foreground text-sm">
            Use recovery codes to access your account if you lose your
            authenticator device.
          </p>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0">
          <div className="space-y-1">
            <p className="text-sm font-medium">Recovery Codes Status</p>
            <div className="flex items-center gap-2">
              <Badge
                variant={status.has_unused_codes ? "default" : "destructive"}
              >
                {status.unused_codes} of {status.total_codes} unused
              </Badge>
              {status.used_codes > 0 && (
                <Badge variant="secondary">{status.used_codes} used</Badge>
              )}
            </div>
          </div>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isRegenerating}>
                {isRegenerating ? (
                  <>
                    <Spinner className="!size-4" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RotateCcw className="!size-4" />
                    Regenerate Codes
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate Recovery Codes?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will invalidate all your current recovery codes and
                  generate new ones. Make sure you save the new codes in a safe
                  place.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegenerateCodes();
                  }}
                >
                  {isRegenerating ? (
                    <>
                      <Spinner className="!size-4" />
                      Regenerating...
                    </>
                  ) : (
                    <>Regenerate Codes</>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {!status.has_unused_codes && (
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
            <p className="text-destructive text-sm">
              <strong>Warning:</strong> You have no unused recovery codes left.
              Generate new codes immediately to maintain account access.
            </p>
          </div>
        )}
      </div>

      {/* New Codes Display */}
      {showNewCodes && newCodes.length > 0 && (
        <div className="space-y-4 rounded-lg border p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-green-600">
                New Recovery Codes Generated
              </h3>
              <p className="text-muted-foreground text-sm text-pretty">
                Save these codes in a safe place. Your old codes have been
                invalidated.
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowNewCodes(false)}
            >
              <EyeOff className="!size-4" />
            </Button>
          </div>
          <div className="bg-muted grid gap-2 rounded-lg p-4 font-mono text-sm md:grid-cols-2">
            {newCodes.map((code, index) => (
              <div
                key={index}
                className="bg-background rounded border p-2 text-center"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={copyNewCodes}>
              <Copy className="size-4" />
              Copy Codes
            </Button>
            <Button variant="outline" onClick={downloadNewCodes}>
              <Download className="size-4" />
              Download Codes
            </Button>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> Save these codes now. Each code can
              only be used once.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
