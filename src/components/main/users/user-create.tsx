"use client";

import { Plus } from "lucide-react";
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

interface UserCreateProps {
  mutate: () => void;
}

export function UserCreate({ mutate }: UserCreateProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Create New
        </Button>
      </DialogTrigger>
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
