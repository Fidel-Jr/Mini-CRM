"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * All supported quick create types
 */
export type QuickCreateType =
  | "customer"
  | "contact"
  | "opportunity";

interface QuickCreateContextType {
  openSheet: (type: QuickCreateType) => void;
  closeSheet: () => void;
  isOpen: boolean;
  type: QuickCreateType | null;
}

const QuickCreateContext = createContext<QuickCreateContextType | null>(null);

export function QuickCreateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<QuickCreateType | null>(null);

  const openSheet = (t: QuickCreateType) => {
    setType(t);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setIsOpen(false);
    setType(null);
  };

  return (
    <QuickCreateContext.Provider
      value={{
        openSheet,
        closeSheet,
        isOpen,
        type,
      }}
    >
      {children}
    </QuickCreateContext.Provider>
  );
}

export function useQuickCreate() {
  const context = useContext(QuickCreateContext);

  if (!context) {
    throw new Error(
      "useQuickCreate must be used within QuickCreateProvider"
    );
  }

  return context;
}