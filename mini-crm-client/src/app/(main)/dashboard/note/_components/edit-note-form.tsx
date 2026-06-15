"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  customerId: z
    .number()
    .min(1, { message: "Customer is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  
});

type NoteForm = z.input<typeof formSchema>;

interface Note {
  id: number;
  customerId: number;
  content: string;
}

interface EditNoteSheetProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Customer = {
    id: number;
    name: string;
};

async function getCustomers(): Promise<Customer[]> {
    const response = await fetch("https://localhost:7187/api/Customers");

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await response.json();

    return data.customers;
  }

async function updateNote(note: Note) {
  const response = await fetch(`https://localhost:7187/api/notes/${note.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || err.name || "Failed to update note");
  }

  // Handle 204 No Content or any empty body response
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}


export function EditNoteSheet({ note, open, onOpenChange }: EditNoteSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<NoteForm>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        customerId: 0,
        content: "",
      },
    });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // Sync form when customer prop changes (e.g. opening a different row)
  React.useEffect(() => {
    form.reset({
      customerId: note.customerId,
      content: note.content,
     
    });
  }, [note, form]);

  const mutation = useMutation({
    mutationFn: (data: NoteForm) => updateNote({ ...data,
    id: note.id,}),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("note updated successfully", {
        description: (
          <span className="text-green-600">
            Note has been updated.
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

  const onSubmit = (data: NoteForm) => mutation.mutate(data);
  const isSubmitting = mutation.isPending;
  const [openCombo, setOpenCombo] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full sm:!w-[500px] !max-w-none sm:!max-w-none rounded-t-2xl sm:rounded-2xl shadow-xl">
        <SheetHeader className="pb-6 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold">Edit Note</SheetTitle>
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
          name="customerId"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label className="text-sm font-semibold text-gray-700">
                Customer
              </Label>

              <Popover open={openCombo} onOpenChange={setOpenCombo}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombo}
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
                              setOpenCombo(false);
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
          name="content"
          render={({ field, fieldState }) => (
            <div className="grid gap-3" data-invalid={fieldState.invalid}>
              <Label
                htmlFor="note-content"
                className="text-sm font-semibold text-gray-700"
              >
                Content
              </Label>

              <Textarea
                {...field}
                id="note-content"
                placeholder="Write content"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="rounded-lg border-gray-200 focus:border-primary focus:ring-primary min-h-32"
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