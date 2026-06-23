"use client";

import { Trash2 } from "lucide-react";
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

interface UserDeleteProps {
  user: User;
  loggedInUser: User | undefined;
  mutate: () => void;
}

export function UserDelete({ user, loggedInUser, mutate }: UserDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await axios.delete(`/api/users/${user.id}`);

      if (response.status === 200) {
        mutate();

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
          <Trash2
            className="group-hover:text-destructive mr-2 size-4"
            aria-hidden="true"
          />
          <span className="group-hover:text-destructive">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {loggedInUser?.id === user.id ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>This is your account</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be done. You cannot delete your own account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-primary dark:!bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:!bg-primary/90 hover:text-primary-foreground border-0">
                Okay, got it
              </AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete user
                and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    Deleting...
                  </>
                ) : (
                  <>Continue</>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
