"use client";

import { Copy, Download, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { showErrorToast } from "@/lib/error-handler";

interface TwoFactorRecoveryCodesProps {
  recoveryCodes: string[];
  onClose: () => void;
}

export function TwoFactorRecoveryCodes({
  recoveryCodes,
  onClose,
}: TwoFactorRecoveryCodesProps) {
  const { regenerateRecoveryCodes } = useAuth();
  const [codes, setCodes] = useState(recoveryCodes);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [open, setOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      toast.success("Recovery codes copied to clipboard");
    } catch {
      toast.error("Failed to copy recovery codes");
    }
  };

  const downloadCodes = () => {
    const content = [
      "Two-Factor Authentication Recovery Codes",
      "============================================",
      "",
      "Save these recovery codes in a safe place.",
      "You can use each code only once to access your account",
      "if you lose access to your authenticator app.",
      "",
      ...codes.map((code, index) => `${index + 1}. ${code}`),
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

  const handleRegenerateCodes = async () => {
    try {
      setIsRegenerating(true);
      const result = await regenerateRecoveryCodes();
      setCodes(result.recovery_codes);
      toast.success("Recovery codes regenerated successfully");
      setOpen(false);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 max-xl:items-start">
          <Shield className="!size-6 shrink-0 text-green-600 max-xl:mt-1" />
          <h2 className="text-xl font-semibold text-green-600">
            Two-Factor Authentication Enabled!
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Your recovery codes are listed below. Save them in a safe place - you
          can use each code only once.
        </p>
      </div>
      {/* Recovery Codes Grid */}
      <div className="bg-muted grid gap-2 rounded-lg p-4 font-mono text-sm md:grid-cols-2">
        {codes.map((code, index) => (
          <div
            key={index}
            className="bg-background rounded border p-2 text-center"
          >
            {code}
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-yellow-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important: Save these recovery codes now
            </p>
            <ul className="list-outside list-disc space-y-1 ps-4 text-xs text-yellow-700 dark:text-yellow-300">
              <li>Each code can only be used once</li>
              <li>Store them in a secure password manager</li>
              <li>
                You can use these codes if you lose access to your authenticator
                app
              </li>
              <li>Never share these codes with anyone</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={copyToClipboard}>
          <Copy className="size-4" />
          Copy Codes
        </Button>

        <Button variant="outline" onClick={downloadCodes}>
          <Download className="size-4" />
          Download
        </Button>

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

      {/* Done Button */}
      <div className="border-t pt-4">
        <Button onClick={onClose} className="w-full max-sm:text-xs">
          I&apos;ve Saved My Recovery Codes
        </Button>
      </div>
    </div>
  );
}
