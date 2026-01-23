import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { BreadcrumbWrapper } from "@/components/layout/breadcrumb-wrapper";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          ["--sidebar-width" as any]: "12rem",
          ["--sidebar-width-mobile" as any]: "12rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarTrigger className="ml-2 mt-2" />
      <main className="p-6 pr-14 w-full">
        <BreadcrumbWrapper />
        {children}
      </main>
    </SidebarProvider>
  );
}
