"use client";

import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLoginPage } from "@/components/admin/AdminLoginPage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { useHydrated } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/admin_page")({
  component: AdminLayout,
});

function AdminLayout() {
  const hydrated = useHydrated();
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());

  if (!hydrated) {
    return <div className="min-h-svh bg-cream" />;
  }

  if (!authenticated) {
    return <AdminLoginPage onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <AdminAuthProvider onLogout={() => setAuthenticated(false)}>
      <SidebarProvider defaultOpen className="admin-shell min-h-svh">
        <SidebarInset className="bg-cream">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </AdminAuthProvider>
  );
}
