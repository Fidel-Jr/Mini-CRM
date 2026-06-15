"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useQuickCreate } from "@/app/quick-create-provider";

import { AddCustomerForm } from "@/app/(main)/dashboard/customer/_components/add-customer-form";
import { AddContactForm } from "@/app/(main)/dashboard/contact/_components/add-contact-form";
import { AddOpportunityForm } from "@/app/(main)/dashboard/opportunity/_components/add-opportunity-form";
import { AddNoteForm } from "@/app/(main)/dashboard/note/_components/add-note-form";

export function SheetForm() {
  const { isOpen, closeSheet, type } = useQuickCreate();

  const renderForm = () => {
    switch (type) {
      case "customer":
        return <AddCustomerForm />;
      case "contact":
        return <AddContactForm />;
      case "opportunity":
        return <AddOpportunityForm />;
      case "note":
        return <AddNoteForm />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="!w-full sm:!w-[500px] !max-w-none sm:!max-w-none rounded-t-2xl sm:rounded-2xl shadow-xl">
        <SheetHeader className="pb-6 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold">
            {type === "customer" && "New Customer"}
            {type === "contact" && "New Contact"}
            {type === "opportunity" && "New Opportunity"}
            {type === "note" && "New Note"}
          </SheetTitle>
          <SheetDescription className="text-gray-600 text-base">
            Add new {type === "customer" && "Add Customer"}
            {type === "contact" && "Add Contact"}
            {type === "opportunity" && "Add Opportunity" } {type === "note" && "New Note"} here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

          {renderForm()}
      </SheetContent>
    </Sheet>
  );
}