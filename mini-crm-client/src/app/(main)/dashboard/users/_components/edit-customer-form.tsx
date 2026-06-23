"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required." }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required." }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),

  role: z
    .string()
    .min(1, { message: "Please select a role." }),

  joinedDate: z
    .string()
    .min(1, { message: "Please select a joined date." }),

  status: z.enum(["Active", "Suspended", "Deactivated"], {
    message: "Please select a valid status.",
  }),
});

type CustomerForm = z.infer<typeof formSchema>;

interface Customer {
  id: string,
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Suspended" | "Deactivated";
  joinedDate: string;
  profileImage?: File;
}

interface EditCustomerSheetProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function fetchRoles(): Promise<string[]> {
    const response = await fetch(
        "/api/users/roles"
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch roles: ${response.status}`
        );
    }

    return response.json();
}

async function updateCustomer(customer: Customer) {
  const response = await fetch(
        `/api/users/${customer.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(customer),
        }
    );

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));

        throw new Error(
            err.message ||
            err.name ||
            "Failed to update user"
        );
    }

    const text = await response.text();

    return text
        ? JSON.parse(text)
        : null;
}

export function EditCustomerSheet({ customer, open, onOpenChange }: EditCustomerSheetProps) {
  const queryClient = useQueryClient();

  const {
    data: roles = [],
  } = useQuery({
      queryKey: ["roles"],
      queryFn: fetchRoles,
  });

  const form = useForm<CustomerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      status: "Active",
      joinedDate: "",
    },
  });

  // Sync form when customer prop changes (e.g. opening a different row)
  React.useEffect(() => {
  if (!customer) return;

    form.reset({
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      email: customer.email ?? "",
      role: customer.role ?? "",
      status: customer.status ?? "Active",
      joinedDate: customer.joinedDate ?? "",
    });
  }, [customer, form]);

  const mutation = useMutation({
    mutationFn: (data: CustomerForm) => updateCustomer({ ...data,
  id: customer.id,
  joinedDate: data.joinedDate ?? "", }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Customer updated successfully", {
        description: (
          <span className="text-green-600">
            "{variables.email}" has been updated.
          </span>
        ),
      });
    },
    onError: (error) => {
      const isNetworkError = error instanceof TypeError;
      toast.error(isNetworkError ? "Network Error" : "Update user failed", {
        description: (
          <span className="text-red-600">
            {isNetworkError ? "Could not connect to the server." : error.message}
          </span>
        ),
      });
    },
  });

  const onSubmit = (data: CustomerForm) => mutation.mutate(data);
  const isSubmitting = mutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full sm:!w-[500px] !max-w-none sm:!max-w-none rounded-t-2xl sm:rounded-2xl shadow-xl">
        <SheetHeader className="pb-6 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold">Edit Customer</SheetTitle>
          <SheetDescription className="text-gray-600 text-base">
            Update customer information below. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

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
              name="status"
              render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                  <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                    Status
                  </Label>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="status"
                      aria-invalid={fieldState.invalid}
                      className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary !h-11 w-full"
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Deactivated">Deactivated</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <p className="text-sm text-red-600">{fieldState.error?.message}</p>
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
      </SheetContent>
    </Sheet>
  );
}