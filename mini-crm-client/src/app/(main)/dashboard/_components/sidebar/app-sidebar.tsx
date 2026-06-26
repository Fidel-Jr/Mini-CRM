"use client";

import Link from "next/link";
import { Command } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { APP_CONFIG } from "@/config/app-config";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useAuth } from "@/app/contexts/auth-context";



export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {

 const { user, loading } = useAuth();

 const filteredSidebarItems = sidebarItems
  .map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (!item.roles) {
        return true;
      }

      if (!user) {
        return false;
      }

      return item.roles.some(role =>
        user.roles.includes(role)
      );
    })
  }))
  .filter(group => group.items.length > 0);


  const {
    sidebarVariant,
    sidebarCollapsible,
    isSynced

  } = usePreferencesStore(

    useShallow((s) => ({

      sidebarVariant: s.sidebarVariant,

      sidebarCollapsible: s.sidebarCollapsible,

      isSynced: s.isSynced,

    }))
  );

  const variant =
    isSynced
      ? sidebarVariant
      : props.variant;


  const collapsible =
    isSynced
      ? sidebarCollapsible
      : props.collapsible;



  return (

    <Sidebar
      {...props}
      variant={variant}
      collapsible={collapsible}
    >


      <SidebarHeader>

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton asChild>

              <Link
                href="/dashboard"
                prefetch={false}
              >

                <Command />

                <span className="font-semibold text-base">

                  {APP_CONFIG.name}

                </span>

              </Link>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarHeader>



      <SidebarContent>

        <NavMain items={filteredSidebarItems} />

      </SidebarContent>



      <SidebarFooter>

        {!loading && user && (

          <NavUser
            user={user}
          />

        )}

      </SidebarFooter>



    </Sidebar>

  );
}