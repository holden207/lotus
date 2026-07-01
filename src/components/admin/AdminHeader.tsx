"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Bell, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { AddPropertyModal } from "@/components/admin/AddPropertyModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  fetchNotificationCount,
  fetchUnreadInquiries,
  markNotificationsRead,
  postNotification,
} from "@/lib/properties";

export function AdminHeader() {
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2 py-1.5 transition-colors hover:bg-muted/50 sm:gap-3 sm:px-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Administrador</p>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Meu perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    </header>
  );
}
