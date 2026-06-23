"use client";

import { format } from "date-fns";
import {
  CircleCheckBig,
  CircleX,
  FileSearchCorner,
  ShieldUser,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";

import { PhoneDisplay } from "@/components/main/phone-display";
import { UserCellActions } from "@/components/main/users/user-cell-actions";
import { UserForm } from "@/components/main/users/user-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TableCell, TableRow } from "@/components/ui/table";
import { GENDER_CONFIG } from "@/constants/gender";
import { capitalizeWords, getInitials } from "@/lib/utils";
import type { PaginatedResponse, User } from "@/types";

interface UserTableRowItemProps {
  user: User;
  isSelected: boolean;
  isLoggedInUser: boolean;
  onToggleSelect: (id: number) => void;
  onUserClick: (user: User) => void;
  loggedInUser: User | undefined;
  mutate: () => void;
}

const UserTableRowItem = memo(function UserTableRowItem({
  user,
  isSelected,
  isLoggedInUser,
  onToggleSelect,
  onUserClick,
  loggedInUser,
  mutate,
}: UserTableRowItemProps) {
  const gender = user.gender ? GENDER_CONFIG[user.gender] : null;
  const GenderIcon = gender?.icon ?? UserRound;

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          aria-label={`Select ${user.name}`}
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(user.id)}
          disabled={isLoggedInUser}
        />
      </TableCell>
      <TableCell>
        <button
          onClick={() => onUserClick(user)}
          className="group/user flex cursor-pointer items-center gap-2 px-1 py-1.5 text-left text-sm"
        >
          <Avatar className="h-8 w-8 rounded-full transition-transform duration-300 ease-in-out group-hover/user:scale-[1.15]">
            <AvatarImage
              src={user?.avatar_url || ""}
              alt={user?.name}
              loading="lazy"
            />
            <AvatarFallback className="rounded-full bg-zinc-200/50 dark:bg-zinc-700/60">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="text-left font-semibold">
              <span className="after:bg-primary relative truncate after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out group-hover/user:after:origin-bottom-left group-hover/user:after:scale-x-100">
                {user?.name}
              </span>
              {isLoggedInUser && (
                <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                  (You)
                </span>
              )}
            </div>
          </div>
        </button>
      </TableCell>
      <TableCell>
        <Link
          href={`mailto:${user.email}`}
          className="link-hover after:h-[1px]"
        >
          {user.email}
        </Link>
      </TableCell>
      <TableCell>
        {user.role ? (
          <Badge
            variant={user.role.name === "admin" ? "default" : "outline"}
            className="min-w-20 text-nowrap"
          >
            {user.role.name === "admin" ? <ShieldUser /> : <UserRound />}{" "}
            {capitalizeWords(user.role.name)}
          </Badge>
        ) : (
          <Badge variant="secondary" className="min-w-20 text-nowrap">
            <UserRound /> No Role
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant={gender ? "outline" : "secondary"}
          className="min-w-20 text-nowrap"
        >
          <GenderIcon className="size-4" /> {gender?.label ?? "Unknown"}
        </Badge>
      </TableCell>
      <TableCell>
        <PhoneDisplay phone={user.phone} />
      </TableCell>
      <TableCell>
        {user.email_verified_at ? (
          <Badge
            variant="outline"
            className="min-w-[90px] border-green-500 text-nowrap text-green-500 dark:border-green-400 dark:text-green-400"
          >
            <CircleCheckBig className="size-4" /> Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="min-w-[90px] text-nowrap">
            <CircleX className="size-4" /> Unverified
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {user.created_at ? format(user.created_at, "dd MMM yyyy") : "N/A"}
      </TableCell>
      <TableCell>
        <UserCellActions
          user={user}
          loggedInUser={loggedInUser}
          mutate={mutate}
        />
      </TableCell>
    </TableRow>
  );
});

interface UsersTableRowProps {
  results: PaginatedResponse<User> | undefined;
  loggedInUser: User | undefined;
  selectedIds: Set<number>;
  handleToggleSelect: (id: number) => void;
  mutate: () => void;
}

export function UsersTableRow({
  results,
  loggedInUser,
  selectedIds,
  handleToggleSelect,
  mutate,
}: UsersTableRowProps) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = useCallback(
    (user: User) => {
      if (user.id === loggedInUser?.id) {
        router.push("/settings?tab=profile");
        return;
      }
      setSelectedUser(user);
      setEditDialogOpen(true);
    },
    [loggedInUser?.id, router],
  );

  return (
    <>
      {results &&
        results.data.length > 0 &&
        results.data.map((user) => (
          <UserTableRowItem
            key={user.id}
            user={user}
            isSelected={selectedIds.has(user.id)}
            isLoggedInUser={user.id === loggedInUser?.id}
            onToggleSelect={handleToggleSelect}
            onUserClick={handleUserClick}
            loggedInUser={loggedInUser}
            mutate={mutate}
          />
        ))}

      {results && results.data.length === 0 && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={999}>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileSearchCorner />
                </EmptyMedia>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </TableCell>
        </TableRow>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              setOpen={setEditDialogOpen}
              user={selectedUser}
              mutate={mutate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
