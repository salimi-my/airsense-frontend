"use client";

import { Ellipsis, UserIcon } from "lucide-react";
import Link from "next/link";

import { UserDelete } from "@/components/main/users/user-delete";
import { UserEdit } from "@/components/main/users/user-edit";
import { UserResendPasswordReset } from "@/components/main/users/user-resend-password-reset";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types";

interface UserCellActionsProps {
  user: User;
  loggedInUser: User | undefined;
  mutate: () => void;
}

export function UserCellActions({
  user,
  loggedInUser,
  mutate,
}: UserCellActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="data-[state=open]:bg-muted flex size-8 p-0"
        >
          <Ellipsis className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {loggedInUser?.id !== user.id && (
          <>
            <DropdownMenuItem asChild>
              <UserEdit user={user} mutate={mutate} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <UserResendPasswordReset user={user} />
            </DropdownMenuItem>
          </>
        )}
        {loggedInUser?.id === user.id && (
          <DropdownMenuItem asChild>
            <Link
              href="/settings?tab=profile"
              className="cursor-pointer text-sm font-medium"
            >
              <UserIcon
                className="mr-2 size-4 text-sm font-medium"
                aria-hidden="true"
              />
              Profile
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <UserDelete user={user} mutate={mutate} loggedInUser={loggedInUser} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
