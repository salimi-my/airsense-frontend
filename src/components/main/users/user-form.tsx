"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Mars, Transgender, Venus } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DialogClose } from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useInfinitePaginatedOptions } from "@/hooks/use-infinite-paginated-options";
import axios from "@/lib/axios";
import { showErrorToast } from "@/lib/error-handler";
import { capitalizeWords } from "@/lib/utils";
import { UserSchema } from "@/schemas";
import type { RoleWithUsersCount, User } from "@/types";

interface UserFormProps {
  user?: User;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutate: () => void;
}

export function UserForm({ user, setOpen, mutate }: UserFormProps) {
  const [loading, setLoading] = useState(false);

  const rolesQuery = useInfinitePaginatedOptions<
    RoleWithUsersCount,
    RoleWithUsersCount
  >({
    endpoint: "/api/roles",
    mapOption: (role) => role,
    getItemId: (role) => role.id,
  });

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: standardSchemaResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender ?? undefined,
      role_id: user?.role_id || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    try {
      setLoading(true);

      let response;
      if (user) {
        response = await axios.patch(`/api/users/${user.id}`, values);
      } else {
        response = await axios.post("/api/users", values);
      }

      if (response.status === 201 || response.status === 200) {
        const message = response.data.message;
        toast.success(message);

        mutate();

        setOpen(false);
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <FieldGroup className="gap-4 [&>[data-slot=field]]:gap-2">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-name">Name</FieldLabel>
              <Input
                {...field}
                id="user-name"
                disabled={loading}
                placeholder="Enter name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <Input
                {...field}
                id="user-email"
                type="email"
                disabled={loading}
                placeholder="Enter email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-phone">Phone Number</FieldLabel>
              <PhoneInput
                {...field}
                id="user-phone"
                disabled={loading}
                international={false}
                defaultCountry="MY"
                placeholder="Enter phone number"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="gender"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Gender</FieldLabel>
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={field.onChange}
                className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                disabled={loading}
              >
                <FieldLabel htmlFor="user-gender-male">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Mars className="size-3.5" /> Male
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="male" id="user-gender-male" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="user-gender-female">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Venus className="size-3.5" /> Female
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="female" id="user-gender-female" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="user-gender-other">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <Transgender className="size-3.5" /> Other
                      </FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="other" id="user-gender-other" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="role_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Role</FieldLabel>
              <Combobox
                options={rolesQuery.options.map((role) => ({
                  value: role.id,
                  label: capitalizeWords(role.name),
                }))}
                value={field.value}
                onValueChange={(value) => field.onChange(Number(value))}
                aria-invalid={fieldState.invalid}
                placeholder="Select role"
                searchPlaceholder="Search role..."
                emptyText="No role found."
                disabled={loading}
                hasMore={rolesQuery.hasMore}
                isLoadingMore={rolesQuery.isLoadingMore}
                onLoadMore={rolesQuery.loadMore}
                onSearch={rolesQuery.setSearch}
                searchValue={rolesQuery.search}
                isFetching={rolesQuery.isFetching}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-4 flex justify-end gap-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button disabled={loading} type="submit">
          {loading && (
            <>
              <Spinner className="!size-4" />
              <span>{user ? "Saving..." : "Creating..."}</span>
            </>
          )}
          {!loading && <span>{user ? "Save Changes" : "Create"}</span>}
        </Button>
      </div>
    </form>
  );
}
