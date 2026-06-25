"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usersSchema } from "./users-table/schema";


export const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required." }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required." }),

  email: z
    .email({ message: "Please enter a valid email address." }),

  role: z
    .string()
    .min(1, { message: "Please select a role." }),

  joinedDate: z.string({
    message: "Please select a joined date.",
  }),
});

type UserForm = z.infer<typeof formSchema>;

async function fetchRoles(): Promise<string[]> {
    const response = await fetch(
        "/api/users/roles"
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch users: ${response.status}`
        );
    }

    return response.json();
}

async function createUser(data: UserForm) {
  const response = await fetch(
        "/api/users",
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        }
    );

    if (!response.ok) {

        const err = await response.json().catch(() => ({}));

        throw new Error(
            err.message ??
            err.name ??
            "Failed to create user"
        );
    }

    return response.json();
}

export function AddUserForm() {
  const queryClient = useQueryClient();

  const {
    data: roles = [],
  } = useQuery({
      queryKey: ["roles"],
      queryFn: fetchRoles,
  });


  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        joinedDate: "",
    },
});

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        <span>User created successfully</span>,
        {
          description: <span className="text-green-600">"{variables.email}" has been added to your users.</span>,
        }
      );
      form.reset();
    },
    onError: (error) => {
      const isNetworkError = error instanceof TypeError;

      toast.error(isNetworkError ? "Network Error" : "Create customer failed", {
        description: (
          <span className="text-red-600">
            {isNetworkError ? "Could not connect to the server." : error.message}
          </span>
        ),
      });
    },
  });

  const onSubmit = (data: UserForm) => mutation.mutate(data);
  const isSubmitting = mutation.isPending;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col flex-1 min-h-0 gap-6"
    >
      <div className="grid flex-1 min-h-0 auto-rows-min gap-6 px-6 py-6 overflow-y-auto">

        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label htmlFor="user-first-name" className="text-sm font-semibold text-gray-700">
                First Name
              </Label>
              <Input
                {...field}
                id="user-first-name"
                placeholder="Enter firstname"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary h-11"
              />
              {fieldState.invalid && (
                <p className="text-sm text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label htmlFor="user-last-name" className="text-sm font-semibold text-gray-700">
                Last Name
              </Label>
              <Input
                {...field}
                id="user-last-name"
                placeholder="Enter lastname"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary h-11"
              />
              {fieldState.invalid && (
                <p className="text-sm text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label htmlFor="user-email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                {...field}
                id="user-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary h-11"
              />
              {fieldState.invalid && (
                <p className="text-sm text-red-600">{fieldState.error?.message}</p>
              )}
            </div>
          )}
        />

        
        <Controller
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                <Label
                    htmlFor="role"
                    className="text-sm font-semibold text-gray-700"
                >
                    Role
                </Label>

                <Select
                    value={field.value}
                    onValueChange={field.onChange}
                >
                    <SelectTrigger
                    id="role"
                    aria-invalid={fieldState.invalid}
                    className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary !h-11 w-full"
                    >
                    <SelectValue placeholder="Select a role" />
                    </SelectTrigger>

                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem
                                key={role}
                                value={role}
                            >
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {fieldState.invalid && (
                    <p className="text-sm text-red-600">
                    {fieldState.error?.message}
                    </p>
                )}
                </div>
            )}
        />

        <Controller
            control={form.control}
            name="joinedDate"
            render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                <Label
                    htmlFor="joined-date"
                    className="text-sm font-semibold text-gray-700"
                >
                    Joined Date
                </Label>

                <Input
                    {...field}
                    id="joined-date"
                    type="date"
                    aria-invalid={fieldState.invalid}
                    className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary h-11"
                />

                {fieldState.invalid && (
                    <p className="text-sm text-red-600">
                    {fieldState.error?.message}
                    </p>
                )}
                </div>
            )}
        />

        <span className="text-muted-foreground text-sm">Default Password: Firstname + Lastname + 123!</span>

      </div>

      <SheetFooter className="pt-6 border-t border-gray-100 gap-3">
        <Button
          type="submit"
          className="font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 px-6 py-4.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        <SheetClose asChild>
          <Button
            variant="outline"
            className="font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 px-6 py-2.5"
            disabled={isSubmitting}
          >
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}