"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Shield, Calendar, X, User2, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import React from "react";
import { useAuth } from "@/app/contexts/auth-context";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Suspended" | "Deactivated";
  joinedDate: string;
  profileImage?: File;
  profileImageUrl?: string;
}

interface ViewCustomerProfileProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const statusStyles: Record<Customer["status"], string> = {
  Active: "bg-green-100 text-green-800 border-green-200",
  Deactivated: "bg-red-100 text-red-800 border-red-200",
  Suspended: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusIcons: Record<Customer["status"], React.ElementType> = {
  Active: CheckCircle2,
  Suspended: PauseCircle,
  Deactivated: XCircle,
};

const statusIconColors: Record<Customer["status"], string> = {
  Active: "bg-green-100 text-green-600",
  Suspended: "bg-orange-100 text-orange-600",
  Deactivated: "bg-red-100 text-red-600",
};

export function ViewProfile({ customer, open, onOpenChange, onEdit  }: ViewCustomerProfileProps) {
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const initials = `${customer.firstName?.[0] ?? ""}${customer.lastName?.[0] ?? ""}`;
  const {user} = useAuth();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full sm:!w-[500px] !max-w-none sm:!max-w-none rounded-t-2xl sm:rounded-2xl shadow-xl p-0 overflow-hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>{fullName}&apos;s profile</SheetTitle>
        </SheetHeader>

        <SheetClose asChild>
          <button
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:bg-white hover:text-gray-900 shadow-sm"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </SheetClose>

        {/* Header band */}
         <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/60 px-6 pt-10 pb-8 flex flex-col items-center text-center">
            {customer.profileImageUrl ? (
                <img
                src={customer.profileImageUrl}
                alt={fullName}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                />
            ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-orange-200 text-3xl font-semibold text-orange-700 shadow-md">
                {initials}
                </div>
            )}

            <h2 className="mt-4 text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">{customer.email}</p>

            <Badge variant="outline" className={`mt-3 rounded-full px-3 ${statusStyles[customer.status]}`}>
                {customer.status}
            </Badge>
            </div>

            <Separator />

            {/* Details */}
            <div className="px-6 py-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <User2 className="size-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fullname</span>
                    <span className="text-sm font-medium text-gray-800">{customer.firstName + " " + customer.lastName}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Mail className="size-4" />
                </div>
                <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</span>
                <span className="text-sm font-medium text-gray-800">{customer.email}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Shield className="size-4" />
                </div>
                <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role</span>
                <span className="text-sm font-medium text-gray-800">{customer.role}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${statusIconColors[customer.status]}`}>
                    {React.createElement(statusIcons[customer.status], { className: "size-4" })}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
                    <span className="text-sm font-medium text-gray-800">{customer.status}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Calendar className="size-4" />
                </div>
                <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</span>
                <span className="text-sm font-medium text-gray-800">{customer.joinedDate || "No date"}</span>
                </div>
            </div>
         </div>
        </div>

            <Separator />

            <div className="px-6 py-4 flex flex-col gap-3">
              {user?.roles?.includes('Admin') && (
            <Button
                className="font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 px-6 py-4.5"
                onClick={() => {
                onOpenChange(false);
                onEdit();
                }}
            >
                Edit
            </Button> )}
            <Button
                variant="outline"
                className="font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 px-6 py-2.5"
                onClick={() => onOpenChange(false)}
            >
                Close
            </Button>
            </div>
      </SheetContent>
    </Sheet>
  );
}