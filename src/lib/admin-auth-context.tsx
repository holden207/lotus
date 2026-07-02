"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { setAdminAuthenticated } from "@/lib/admin-auth";

type AdminAuthContextValue = {
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

type AdminAuthProviderProps = {
  children: ReactNode;
  onLogout: () => void;
};

export function AdminAuthProvider({ children, onLogout }: AdminAuthProviderProps) {
  const logout = useCallback(() => {
    setAdminAuthenticated(false);
    onLogout();
  }, [onLogout]);

  return <AdminAuthContext.Provider value={{ logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
