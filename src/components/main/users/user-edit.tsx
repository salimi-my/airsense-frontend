"use client";

import { Edit } from "lucide-react";
import { useState } from "react";

import { UserForm } from "@/components/main/users/user-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { User } from "@/types";

interface UserEditProps {
  user: User;
  mutate: () => void;
}

export function UserEdit({ user, mutate }: UserEditProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2">
          <Edit className="mr-2 size-4" aria-hidden="true" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UserForm setOpen={setOpen} user={user} mutate={mutate} />
      </DialogContent>
    </Dialog>
  );
}
