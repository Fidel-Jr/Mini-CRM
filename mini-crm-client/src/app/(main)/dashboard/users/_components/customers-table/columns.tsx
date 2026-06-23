"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { CustomerRow } from "./schema";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditCustomerSheet } from "../edit-customer-form";
import { ViewProfile } from "../../view-profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/auth-context";

const healthStripSlots = Array.from({ length: 18 }, (_, index) => ({
  id: `strip-${index + 1}`,
  threshold: index + 1,
}));

// function getHealthScore(health: CustomerRow["health"]) {
//   switch (health) {
//     case "On Track":
//       return 18;
//     case "Needs Review":
//       return 11;
//     case "At Risk":
//       return 7;
//     case "On Hold":
//       return 4;
//     default:
//       return 0;
//   }
// }

export const customersColumns: ColumnDef<CustomerRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all customers"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.email}`}
      />
    ),
    enableHiding: false,
  },
  {
  accessorKey: "user",
  header: "User",
    cell: ({ row }) => {
      const user = row.original;

      const initials =
        `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

      return (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="
                flex h-9.5 w-9.5 items-center justify-center
                rounded-full
                border border-orange-200
                bg-orange-50
                text-lg font-semibold
                text-orange-600
              "
            >
              {initials}
            </div>

            <div
              className="
                absolute
                -bottom-0.5
                -right-0.5
                h-3.5 w-3.5
                rounded-full
                border-2 border-background
                bg-primary
              "
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium tracking-tight">
              {user.firstName} {user.lastName}
            </span>

            <span className="text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full px-2.5">
        {row.original.role}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
  accessorKey: "status",
  header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusStyles = {
        Active:
          "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
        Deactivated:
          "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
        Suspended:
          "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
      };

      return (
        <Badge
          variant="outline"
          className={
            statusStyles[status as keyof typeof statusStyles] ??
            "bg-gray-100 text-gray-800 border-gray-200"
          }
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "joinedDate",
    header: "Joined Date",
    cell: ({ row }) => <div className="text-sm">{row.original.joinedDate || "No Date"}</div>,
  },
  
  {
    id: "actions",

    header: () => <div className="text-right">Actions</div>,

    cell: ({ row }) => {
      const userRow = row.original;
      const [isOpen, setIsOpen] = React.useState(false);
      const [isViewOpen, setIsViewOpen] = React.useState(false);
      const queryClient = useQueryClient();
      const {user} = useAuth();

      const deactivateMutation = useMutation({

        mutationFn: async () => {

            const response = await fetch(
                `/api/users/${userRow.id}/deactivate`,
                {
                    method: "PATCH"
                }
            );

            if (!response.ok) {

                const err = await response.json()
                    .catch(() => ({}));

                throw new Error(
                    err.message ??
                    err.Message ??
                    "Failed to deactivate user"
                );
            }

            const text = await response.text();

            return text
                ? JSON.parse(text)
                : null;
        },


        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["users"]
            });

            toast.success(
                "User deactivated",
                {
                    description:
                        `${userRow.firstName} ${userRow.lastName} has been deactivated.`
                }
            );
        },


        onError: (error) => {

            toast.error(
                "Deactivate failed",
                {
                    description: error.message
                }
            );
        }

    });

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-muted-foreground hover:bg-muted"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
                View Profile
              </DropdownMenuItem>
              {user?.roles?.includes('Admin') && (
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  Edit User
                </DropdownMenuItem>)}

              {user?.roles?.includes('Admin') && (
              <DropdownMenuSeparator />)}

              {user?.roles?.includes('Admin') && (
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                disabled={deactivateMutation.isPending || userRow.status === "Deactivated"}
                onClick={() => deactivateMutation.mutate()}
              >
                {deactivateMutation.isPending ? "Deactivating..." : "Deactivate User"}
            </DropdownMenuItem>  )}
            </DropdownMenuContent>
          </DropdownMenu>

          {isOpen && (
            <EditCustomerSheet
              customer={userRow}
              open={isOpen}
              onOpenChange={setIsOpen}
            />
          )}

          {isViewOpen && (
          <ViewProfile
            customer={userRow}
            open={isViewOpen}
            onOpenChange={setIsViewOpen}
            onEdit={() => setIsOpen(true)}
          />
        )}
        </div>
      );
    },

    enableHiding: false,
  },
];
