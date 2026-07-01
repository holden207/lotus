import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin_page")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider defaultOpen className="admin-shell min-h-svh">
      <AdminSidebar />
      <SidebarInset className="bg-cream">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
