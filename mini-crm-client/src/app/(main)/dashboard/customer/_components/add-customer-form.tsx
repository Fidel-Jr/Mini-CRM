"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

async function createCustomer(data: CustomerForm) {
  const response = await fetch("https://localhost:7187/api/Customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || err.name || "Failed to create customer");
  }

  return response.json();
}

export function AddCustomerForm() {
  const queryClient = useQueryClient();

  const form = useForm<CustomerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      website: "",
      email: "",
      phone: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(
        <span>Customer created successfully</span>,
        {
          description: <span className="text-green-600">"{variables.name}" has been added to your customers.</span>,
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

  const onSubmit = (data: CustomerForm) => mutation.mutate(data);
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
          name="name"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label htmlFor="customer-name" className="text-sm font-semibold text-gray-700">
                Name
              </Label>
              <Input
                {...field}
                id="customer-name"
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
              <Label htmlFor="customer-industry" className="text-sm font-semibold text-gray-700">
                Industry
              </Label>
              <Input
                {...field}
                id="customer-industry"
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
              <Label htmlFor="customer-website" className="text-sm font-semibold text-gray-700">
                Website
              </Label>
              <Input
                {...field}
                id="customer-website"
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
              <Label htmlFor="customer-email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                {...field}
                id="customer-email"
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
              <Label htmlFor="customer-phone" className="text-sm font-semibold text-gray-700">
                Phone
              </Label>
              <Input
                {...field}
                id="customer-phone"
                type="tel"
                placeholder="+1 234 567 8900"
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
  );
}