"use client";

import { LogOut } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { logout } from "@/lib/actions/authenticate";

export function LogoutButton() {
  return (
    <form action={logout}>
      <SidebarMenuButton className="cursor-pointer">
        <LogOut size={18}></LogOut>
        <span>LogOut</span>
      </SidebarMenuButton>
    </form>
  );
}
