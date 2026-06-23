"use client";

import { format } from "date-fns";
import {
  Calendar,
  CircleCheckBig,
  CircleX,
  FileSearchCorner,
  Mail,
  Phone,
  ShieldUser,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { PhoneDisplay } from "@/components/main/phone-display";
import { UserCellActions } from "@/components/main/users/user-cell-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GENDER_CONFIG } from "@/constants/gender";
import { capitalizeWords, getInitials } from "@/lib/utils";
import type { PaginatedResponse, User } from "@/types";

interface UserCardRowItemProps {
  user: User;
  isSelected: boolean;
  isLoggedInUser: boolean;
  onToggleSelect: (id: number) => void;
  loggedInUser: User | undefined;
  mutate: () => void;
}

const UserCardRowItem = memo(function UserCardRowItem({
  user,
  isSelected,
  isLoggedInUser,
  onToggleSelect,
  loggedInUser,
  mutate,
}: UserCardRowItemProps) {
  const gender = user.gender ? GENDER_CONFIG[user.gender] : null;
  const GenderIcon = gender?.icon ?? UserRound;

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <Checkbox
          aria-label={`Select ${user.name}`}
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(user.id)}
          onClick={(e) => e.stopPropagation()}
          disabled={isLoggedInUser}
          className="disabled:bg-muted-foreground/10 mt-1"
        />

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage
                src={user?.avatar_url || ""}
                alt={user?.name}
                loading="lazy"
              />
              <AvatarFallback className="rounded-full bg-zinc-200/50 dark:bg-zinc-700/60">
                {getInitials(user?.name || "")}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center text-sm leading-tight font-semibold">
                    <span className="inline-block max-w-[130px] truncate">
                      {user?.name}
                    </span>
                    {isLoggedInUser && (
                      <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                        (You)
                      </span>
                    )}
                  </p>

                  <div>
                    {user.role ? (
                      <Badge
                        variant={
                          user.role.name === "admin" ? "default" : "outline"
                        }
                        className="px-1.5 text-[10px] leading-none text-nowrap"
                      >
                        {user.role.name === "admin" ? (
                          <ShieldUser className="size-3" />
                        ) : (
                          <UserRound className="size-3" />
                        )}
                        {capitalizeWords(user.role.name)}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="px-1.5 text-[10px] leading-none text-nowrap"
                      >
                        <UserRound className="size-3" /> No Role
                      </Badge>
                    )}
                  </div>
                </div>
                <UserCellActions
                  user={user}
                  loggedInUser={loggedInUser}
                  mutate={mutate}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="text-muted-foreground size-3 flex-shrink-0" />
              <Link
                href={`mailto:${user.email}`}
                className="link-hover max-w-[220px] truncate after:h-px"
                onClick={(e) => e.stopPropagation()}
              >
                {user.email}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Phone className="text-muted-foreground size-3 flex-shrink-0" />
              <PhoneDisplay phone={user.phone} className="text-xs" />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <GenderIcon className="text-muted-foreground size-3 flex-shrink-0" />
              <span>{gender?.label ?? "Unknown"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user.email_verified_at ? (
              <Badge
                variant="outline"
                className="border-green-500 px-1.5 text-[10px] leading-none text-nowrap text-green-500 dark:border-green-400 dark:text-green-400"
              >
                <CircleCheckBig className="size-3" /> Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="px-1.5 text-[10px] leading-none text-nowrap"
              >
                <CircleX className="size-3" /> Unverified
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="text-[10px] font-normal text-nowrap"
            >
              <Calendar className="size-3" />
              {user.created_at ? format(user.created_at, "dd MMM yyyy") : "N/A"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
});

interface UsersCardRowProps {
  results: PaginatedResponse<User> | undefined;
  loggedInUser: User | undefined;
  selectedIds: Set<number>;
  handleToggleSelect: (id: number) => void;
  mutate: () => void;
}

export function UsersCardRow({
  results,
  loggedInUser,
  selectedIds,
  handleToggleSelect,
  mutate,
}: UsersCardRowProps) {
  return (
    <div className="space-y-3">
      {results && results.data.length > 0 ? (
        results.data.map((user) => (
          <UserCardRowItem
            key={user.id}
            user={user}
            isSelected={selectedIds.has(user.id)}
            isLoggedInUser={user.id === loggedInUser?.id}
            onToggleSelect={handleToggleSelect}
            loggedInUser={loggedInUser}
            mutate={mutate}
          />
        ))
      ) : (
        <Empty className="border">
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
      )}
    </div>
  );
}
