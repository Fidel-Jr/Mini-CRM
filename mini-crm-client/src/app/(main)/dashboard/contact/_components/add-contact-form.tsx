"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";

const formSchema = z.object({
  customerId: z
    .number()
    .min(1, { message: "Customer is required." }),
  firstName: z.string().min(1, { message: "First Name is required." }),
  lastName: z.string().optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email address." }),
  position: z.string().min(1, { message: "Position is required." }),
});

type ContactForm = z.infer<typeof formSchema>;

async function createContact(data: ContactForm) {
  const response = await fetch(
        "/api/contacts",
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
            "Failed to create customer"
        );
    }

    return response.json();
}

  type Customer = {
      id: number;
      name: string;
  };

  async function getCustomers(): Promise<Customer[]> {
    const response = await fetch(
        "/api/customers"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await response.json();

    return data.customers;
  }

export function AddContactForm() {
  const queryClient = useQueryClient();

  const form = useForm<ContactForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: 0,
      firstName: "",
      lastName: "",
      email: "",
      position: "",
    },
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["companies"], // renamed, distinct from contacts
    queryFn: getCustomers,
  });


  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success(
        <span>Customer created successfully</span>,
        {
          description: <span className="text-green-600">"{variables.firstName}" has been added to your contacts.</span>,
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

  const onSubmit = (data: ContactForm) => mutation.mutate(data);
  const isSubmitting = mutation.isPending;
  const [open, setOpen] = useState(false);
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col flex-1 min-h-0 gap-6"
    >
      <div className="grid flex-1 min-h-0 auto-rows-min gap-6 px-6 py-6 overflow-y-auto">
        <Controller
          control={form.control}
          name="customerId"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label className="text-sm font-semibold text-gray-700">
                Customer
              </Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-11 font-normal"
                    aria-invalid={fieldState.invalid}
                  >
                    {field.value
                      ? customers.find((c) => c.id === field.value)?.name
                      : "Select a customer..."}

                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search customer..." />

                    <CommandList>
                      <CommandEmpty>
                        No customer found.
                      </CommandEmpty>

                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={() => {
                              field.onChange(customer.id);
                              setOpen(false);
                            }}
                          >
                            {customer.name}

                            <Check
                              className={`ml-auto ${
                                field.value === customer.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label htmlFor="contact-person-firstname" className="text-sm font-semibold text-gray-700">
                First Name
              </Label>
              <Input
                {...field}
                id="contact-person-firstname"
                placeholder="Enter firstname"
                autoComplete="firstName"
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
              <Label htmlFor="contact-person-lastname" className="text-sm font-semibold text-gray-700">
                Last Name
              </Label>
              <Input
                {...field}
                id="contact-person-lastname"
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
          name="position"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label htmlFor="contact-person-position" className="text-sm font-semibold text-gray-700">
                Phone
              </Label>
              <Input
                {...field}
                id="contact-person-position"
                type="text"
                placeholder="Enter position"
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