import type { ReactNode } from "react";

import { Command } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full rounded-3xl bg-primary lg:flex">
          <div className="absolute top-10 space-y-1 px-10 text-primary-foreground">
            <Command className="size-10" />
            <h1 className="font-medium text-2xl">{APP_CONFIG.name}</h1>
            {/* <p className="text-sm">Lead. Qualified. Proposal. Won.</p> */}
            <p className="text-sm opacity-90">
              Manage customers, opportunities, and company knowledge in one place.
            </p>

            <p className="mt-5 max-w-lg text-sm leading-6 opacity-90">
              Mini CRM is a small Customer Relationship Management (CRM) application for managing customers, contacts, and opportunities, enhanced with an AI knowledge assistant powered by company documents and basic dashboard analytics.
              This is a personal project built to showcase full-stack development skills, including authentication, authorization, relational database design, RESTful API development, business workflow implementation, and Retrieval-Augmented Generation (RAG) using Large Language Models.
            </p>

            <p className="mt-4 max-w-lg text-sm leading-6 opacity-80">
              The interface is based on the next-shadcn-admin-dashboard template by
              <span className="font-semibold"> arhamkhnz</span>, customized and extended
              to support CRM workflows and AI features.
            </p>
            <Separator className="mt-5 mb-5"/>
            <p className="mt-2 text-sm leading-6 opacity-80">
              Feel free to explore the application using the provided demo
              accounts.
            </p>
            
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">
                Demo Environment
              </h2>

              <p className="text-sm leading-6 opacity-90">
                This is a personal project intended to showcase CRM and AI capabilities. Please use the provided demo credentials to explore the application.
              </p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="flex-1 space-y-1 text-primary-foreground">
              <h2 className="font-medium">
              Demo Credentials
            </h2>

            <div className="space-y-2 text-sm opacity-90">
              <p>
                <span className="font-medium">Admin</span><br />
                admin@example.com -
                Admin@12345
              </p>

              <p>
                <span className="font-medium">Sales Representative</span><br />
                salesrep@example.com - 
                Salesrep@12345
              </p>
            </div>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}