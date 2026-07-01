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
  file: z
    .instanceof(File, { message: "Please select a file." })
});

type CustomerForm = z.infer<typeof formSchema>;

async function uploadCustomerFile(data: CustomerForm) {
  const formData = new FormData();
  formData.append("file", data.file);

  const response = await fetch(
        "/api/documents/upload",
        {
            method: "POST",
            body: formData
        }
    );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to upload file");
  }

  return response.json();
}

export function AddCustomerForm() {
  const queryClient = useQueryClient();

  const form = useForm<CustomerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        file: undefined as unknown as File,
    },
  });

  const mutation = useMutation({
    mutationFn: uploadCustomerFile,
    onSuccess: () => {
        queryClient.invalidateQueries({
        queryKey: ["documents"],
        });

         toast.success(
            <span>File uploaded successfully</span>,
            {
            description: (
                <span className="text-green-600">
                Your document has been uploaded and processed.
                </span>
            ),
            }
        );

        form.reset();
    },
        onError: (error) => {
            const isNetworkError = error instanceof TypeError;

            toast.error(
                isNetworkError ? "Network Error" : "Upload failed",
                {
                description: (
                    <span className="text-red-600">
                    {isNetworkError
                        ? "Could not connect to the server."
                        : error.message}
                    </span>
                ),
                }
            );
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
        <div className="px-6 py-6 flex-1">
            <Controller
            control={form.control}
            name="file"
            render={({ field: { onChange }, fieldState }) => (
                <div className="grid gap-3">
                <Label
                    htmlFor="customer-file"
                    className="text-sm font-semibold text-gray-700"
                >
                    Upload File
                </Label>

                <Input
                    id="customer-file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                    }}
                    className="h-11"
                />

                <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, MD
                </p>

                {fieldState.error && (
                    <p className="text-sm text-red-600">
                    {fieldState.error.message}
                    </p>
                )}
                </div>
            )}
            />
        </div>

        <SheetFooter className="pt-6 border-t gap-3">
            <Button
            type="submit"
            className="font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 px-6 py-4.5"
            disabled={isSubmitting}
            >
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
                </>
            ) : (
                "Upload File"
            )}
            </Button>

            <SheetClose asChild>
            <Button
                variant="outline"
                disabled={isSubmitting}
            >
                Close
            </Button>
            </SheetClose>
        </SheetFooter>
        </form>
  );
}