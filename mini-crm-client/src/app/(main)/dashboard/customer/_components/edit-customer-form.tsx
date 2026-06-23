"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  industry: z.string().min(1, { message: "Industry is required." }),
  website: z
    .string()
    .url({ message: "Please enter a valid website URL." })
    .optional()
    .or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional().or(z.literal("")),
});

type CustomerForm = z.infer<typeof formSchema>;

interface Customer {
  id: number;
  name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
}

interface EditCustomerSheetProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function updateCustomer(customer: Customer) {
    const response = await fetch(
        `/api/customers/${customer.id}`,
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
            "Failed to update customer"
        );
    }

    const text = await response.text();

    return text
        ? JSON.parse(text)
        : null;
}

export function EditCustomerSheet({ customer, open, onOpenChange }: EditCustomerSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<CustomerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer.name,
      industry: customer.industry,
      website: customer.website,
      email: customer.email,
      phone: customer.phone,
    },
  });

  // Sync form when customer prop changes (e.g. opening a different row)
  React.useEffect(() => {
    form.reset({
      name: customer.name,
      industry: customer.industry,
      website: customer.website,
      email: customer.email,
      phone: customer.phone,
    });
  }, [customer, form]);

  const mutation = useMutation({
    mutationFn: (data: CustomerForm) => updateCustomer({ ...data,
  id: customer.id,
  website: data.website ?? "",
  phone: data.phone ?? "", }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully", {
        description: (
          <span className="text-green-600">
            "{variables.name}" has been updated.
          </span>
        ),
      });
      onOpenChange(false);
    },
    onError: (error) => {
      const isNetworkError = error instanceof TypeError;
      toast.error(isNetworkError ? "Network Error" : "Update customer failed", {
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
              name="name"
              render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                  <Label htmlFor="edit-customer-name" className="text-sm font-semibold text-gray-700">
                    Name
                  </Label>
                  <Input
                    {...field}
                    id="edit-customer-name"
                    placeholder="Enter customer name"
                    autoComplete="name"
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
              name="industry"
              render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                  <Label htmlFor="edit-customer-industry" className="text-sm font-semibold text-gray-700">
                    Industry
                  </Label>
                  <Input
                    {...field}
                    id="edit-customer-industry"
                    placeholder="Enter industry"
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
              name="website"
              render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                  <Label htmlFor="edit-customer-website" className="text-sm font-semibold text-gray-700">
                    Website
                  </Label>
                  <Input
                    {...field}
                    id="edit-customer-website"
                    type="url"
                    placeholder="https://example.com"
                    autoComplete="url"
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
                  <Label htmlFor="edit-customer-email" className="text-sm font-semibold text-gray-700">
                    Email
                  </Label>
                  <Input
                    {...field}
                    id="edit-customer-email"
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
              name="phone"
              render={({ field, fieldState }) => (
                <div className="grid gap-3" data-invalid={fieldState.invalid}>
                  <Label htmlFor="edit-customer-phone" className="text-sm font-semibold text-gray-700">
                    Phone
                  </Label>
                  <Input
                    {...field}
                    id="edit-customer-phone"
                    type="tel"
                    placeholder="+63 912 333 3333"
                    autoComplete="tel"
                    aria-invalid={fieldState.invalid}
                    className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary h-11"
                  />
                  {fieldState.invalid && (
                    <p className="text-sm text-red-600">{fieldState.error?.message}</p>
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