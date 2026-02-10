"use client";

import {
  Home,
  Users,
  LogOut,
  Turtle,
  Map,
  Trees,
  ListTodo,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "@/auth/auth";
import { LogoutButton } from "./logout-button";
import { useUser } from "@/contexts/user-context";
import { Role } from "@/generated/prisma/client";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Users",
    url: "/home/users",
    icon: Users,
    roles: ["ADMIN", "SUPER_ADMIN"] as Role[],
  },
  {
    title: "Animals",
    url: "/home/animals",
    icon: Turtle,
  },
  {
    title: "Habitats",
    url: "/home/habitats",
    icon: Trees,
  },
  {
    title: "Tasks",
    url: "/home/tasks",
    icon: ListTodo,
  },
  {
    title: "Zoo Map",
    url: "/home/map",
    icon: Map,
  },
];

export function AppSidebar() {
  const user = useUser();
  const visibleItems = items.filter((item) => {
    if (!item.roles) return true; // vizibil pentru toți
    if (!user?.role) return false;
    return item.roles.includes(user.role);
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
