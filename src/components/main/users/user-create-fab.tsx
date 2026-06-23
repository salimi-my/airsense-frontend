"use client";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";

import { UserForm } from "@/components/main/users/user-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsPwa } from "@/hooks/use-pwa";
import { cn } from "@/lib/utils";

interface UserCreateFabProps {
  mutate: () => void;
}

export function UserCreateFab({ mutate }: UserCreateFabProps) {
  const [open, setOpen] = useState(false);
  const [rotated, setRotated] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPwa = useIsPwa();

  const handleFabClick = () => {
    if (rotated) return;
    setRotated(true);
    timeoutRef.current = setTimeout(() => setOpen(true), 180);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setRotated(false);
      clearTimeout(timeoutRef.current ?? undefined);
      timeoutRef.current = null;
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        size="icon"
        className={cn(
          "fixed right-5 z-50 mb-0! size-12 rounded-full shadow-lg",
          isPwa ? "bottom-[calc(5rem+12px)]" : "bottom-5",
        )}
        aria-label="Create new user"
        onClick={handleFabClick}
      >
        <Plus
          className={cn(
            "size-6 transition-transform duration-200",
            rotated ? "rotate-[135deg]" : "rotate-0",
          )}
        />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user here and click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UserForm setOpen={setOpen} mutate={mutate} />
      </DialogContent>
    </Dialog>
  );
}
