// components/SheetForm.tsx
"use client";

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import { useQuickCreate } from "@/app/quick-create-provider"
import { AddOpportunityForm } from "./add-opportunity-form"

export function SheetForm() {
  const { isOpen, closeSheet } = useQuickCreate()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="py-5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Add Opportunity
        </Button>
      </SheetTrigger>
      
      <SheetContent className="!w-full sm:!w-[500px] !max-w-none sm:!max-w-none rounded-t-2xl sm:rounded-2xl shadow-xl">
        <SheetHeader className="pb-6 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold">New Opportunity</SheetTitle>
          <SheetDescription className="text-gray-600 text-base">
            Add new opportunity here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        
        <AddOpportunityForm />
      </SheetContent>
    </Sheet>
  )
}