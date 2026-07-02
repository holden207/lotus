"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Bell, ChevronDown, KeyRound, Link2, LogOut, Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { AddPropertyModal } from "@/components/admin/AddPropertyModal";
import { ChangeLinkageInfoModal } from "@/components/admin/ChangeLinkageInfoModal";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { cn } from "@/lib/utils";
import {
  fetchNotificationCount,
  fetchUnreadInquiries,
  markNotificationsRead,
  postNotification,
} from "@/lib/properties";

export function AdminHeader() {
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changeLinkageOpen, setChangeLinkageOpen] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["notification-count"],
    queryFn: fetchNotificationCount,
    refetchInterval: 15_000,
  });

  async function handleNotificationClick() {
    if (dispatching) return;

    setDispatching(true);
    try {
      const unread = await fetchUnreadInquiries();
      if (unread.length === 0) {
        toast.info("Nenhuma reserva nova no momento.");
        return;
      }

      await Promise.all(
        unread.map((inquiry) =>
          postNotification({
            name: inquiry.name,
            date: inquiry.createdAt,
          }),
        ),
      );

      await markNotificationsRead(unread.map((inquiry) => inquiry.id));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notification-count"] }),
        router.invalidate(),
      ]);

      toast.success(
        unread.length === 1
          ? `1 notificação de reserva enviada.`
          : `${unread.length} notificações de reserva enviadas.`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível processar as notificações.");
    } finally {
      setDispatching(false);
    }
  }

  function handleWithdrawMembership() {
    logout();
    toast.success("Associação encerrada. Faça login novamente para acessar o painel.");
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-cream/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 px-4 py-4 lg:px-6 lg:py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <SidebarTrigger className="mt-0.5 lg:hidden" />
            <div>
              <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
                Bem-vindo(a), Admin! 👋
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Veja o que está acontecendo na Lótus Imóveis hoje.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Configurações">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                  <KeyRound className="h-4 w-4" />
                  Alterar senha
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChangeLinkageOpen(true)}>
                  <Link2 className="h-4 w-4" />
                  Alterar informações de contato
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleWithdrawMembership}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Encerrar associação
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleNotificationClick}
              disabled={dispatching}
              aria-label={
                notificationCount > 0
                  ? `${notificationCount} notificações de reserva`
                  : "Notificações de reserva"
              }
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span
                  className={cn(
                    "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full",
                    "border-2 border-blue-500 bg-blue-500 px-1 text-[10px] font-semibold leading-none text-white",
                  )}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            className="h-10 rounded-md bg-gold px-5 text-primary-foreground hover:bg-gold-dark"
            onClick={() => setAddPropertyOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar imóvel
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </div>
      </div>

      <AddPropertyModal open={addPropertyOpen} onOpenChange={setAddPropertyOpen} />
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <ChangeLinkageInfoModal open={changeLinkageOpen} onOpenChange={setChangeLinkageOpen} />
    </header>
  );
}
