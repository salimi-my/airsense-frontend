"use client";

import { MailPlus } from "lucide-react";
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
import axios from "@/lib/axios";
import { showErrorToast } from "@/lib/error-handler";
import type { User } from "@/types";

interface UserResendPasswordResetProps {
  user: User;
}

export function UserResendPasswordReset({
  user,
}: UserResendPasswordResetProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleResendPasswordReset = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/resend-password-reset", {
        user_id: user.id,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="group w-full justify-start px-2">
          <MailPlus className="mr-2 size-4" aria-hidden="true" />
          <span>Reset Password</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resend Password Reset Link</AlertDialogTitle>
          <AlertDialogDescription>
            This will send a password reset link to {user.email}. Are you sure
            you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleResendPasswordReset();
            }}
          >
            {loading ? (
              <>
                <Spinner className="!size-4" />
                Sending...
              </>
            ) : (
              <>Send Reset Link</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
