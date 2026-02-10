import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { BreadcrumbWrapper } from "@/components/layout/breadcrumb-wrapper";
import { auth } from "@/auth/auth";
import { UserProvider } from "@/contexts/user-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await auth();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }
    : null;

  return (
    <UserProvider user={user}>
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
        <SidebarTrigger className="ml-2 mt-2 sticky" />
        <main className="p-6 pr-14 flex-1 flex min-w-0  flex-col">
          <BreadcrumbWrapper />
          {children}
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
