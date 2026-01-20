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
      style={{
        "--sidebar-width": "12rem",
        "--sidebar-width-mobile": "12rem",
      }}
    >
      <AppSidebar />
      <SidebarTrigger className="ml-2 mt-2" />
      <main className="p-6">
        <BreadcrumbWrapper />
        {children}
      </main>
    </SidebarProvider>
  );
}
