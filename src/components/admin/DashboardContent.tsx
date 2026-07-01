"use client";

import { lazy, Suspense, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  DollarSign,
  Maximize,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { RelativeTime } from "@/components/admin/RelativeTime";
import { ActivityRelativeTime } from "@/components/admin/ActivityRelativeTime";
import { ReservationCalendar } from "@/components/admin/ReservationCalendar";
import { AddPropertyModal } from "@/components/admin/AddPropertyModal";
import { useHydrated } from "@/hooks/use-hydrated";
import { useSystemTime } from "@/hooks/use-system-time";
import { cn } from "@/lib/utils";
import { isInCurrentMonth as isStoredDateInCurrentMonth } from "@/lib/time";
import { deleteInquiry, deleteProperty, type Inquiry } from "@/lib/properties";
import {
  activities,
  stats,
  type RecentProperty,
  type RecentReservation,
} from "@/lib/admin-data";
import type { Property } from "@/lib/properties";

const DashboardCharts = lazy(() =>
  import("@/components/admin/DashboardCharts").then((m) => ({ default: m.DashboardCharts })),
);

const statIcons = [Building2, CalendarDays, DollarSign, Users];

function StatusBadge({
  status,
  reservationCount,
}: {
  status: RecentProperty["status"] | RecentReservation["status"] | "Reserva";
  reservationCount?: number;
}) {
  const styles: Record<string, string> = {
    Publicado: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Confirmada: "border-emerald-200 bg-emerald-50 text-emerald-700",
    "Em destaque": "border-amber-200 bg-amber-50 text-amber-700",
    Pendente: "border-amber-200 bg-amber-50 text-amber-700",
    Reserva: "border-blue-200 bg-blue-50 text-blue-700",
    Rascunho: "border-border bg-muted text-muted-foreground",
  };

  const label =
    status === "Reserva" && reservationCount !== undefined && reservationCount > 0
      ? `Reserva ${reservationCount}`
      : status;

  return (
    <Badge variant="outline" className={cn("shrink-0 whitespace-nowrap font-normal", styles[status])}>
      {label}
    </Badge>
  );
}

function isInCurrentMonth(createdAt: string, now: Date): boolean {
  return isStoredDateInCurrentMonth(createdAt, now);
}

function countCustomersThisMonth(inquiries: Inquiry[], now: Date): number {
  return inquiries.filter((inquiry) => isInCurrentMonth(inquiry.createdAt, now)).length;
}

function countListingsThisMonth(properties: Property[], now: Date): number {
  return properties.filter((property) => isInCurrentMonth(property.createdAt, now)).length;
}

function countConfirmedReservationsThisMonth(inquiries: Inquiry[], now: Date): number {
  return inquiries.filter(
    (inquiry) => isInCurrentMonth(inquiry.createdAt, now) && inquiry.readAt !== null,
  ).length;
}

function formatMonthlyRevenue(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

function StatsRow({
  hydrated,
  monthlyListingCount,
  monthlyConfirmedReservations,
  monthlyRevenue,
  monthlyCustomerCount,
}: {
  hydrated: boolean;
  monthlyListingCount: number;
  monthlyConfirmedReservations: number;
  monthlyRevenue: number;
  monthlyCustomerCount: number;
}) {
  const displayStats = stats.map((stat, index) => {
    if (index === 0) return { ...stat, value: String(monthlyListingCount) };
    if (index === 1) return { ...stat, value: String(monthlyConfirmedReservations) };
    if (index === 2) return { ...stat, value: formatMonthlyRevenue(monthlyRevenue) };
    if (index === 3) return { ...stat, value: String(monthlyCustomerCount) };
    return stat;
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {displayStats.map((stat, i) => {
        const Icon = statIcons[i];
        return (
          <Card key={stat.label} className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    i === 0 && "bg-blue-50 text-blue-600",
                    i === 1 && "bg-emerald-50 text-emerald-600",
                    i === 2 && "bg-amber-50 text-amber-600",
                    i === 3 && "bg-violet-50 text-violet-600",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{stat.label}</p>
              {hydrated ? (
                <p className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</p>
              ) : (
                <Skeleton className="mt-1 h-8 w-16" />
              )}
              <p className="mt-1 text-xs text-emerald-600">{stat.change}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function propertyStatus(
  property: Property,
  reservationCount: number,
): RecentProperty["status"] | "Reserva" {
  if (reservationCount > 0) return "Reserva";
  if (property.badge === "DESTAQUE") return "Em destaque";
  if (property.badge === "LANÇAMENTO") return "Publicado";
  return "Publicado";
}

function PropertyListingRow({
  property,
  reservationCountByPropertySlug,
}: {
  property: Property;
  reservationCountByPropertySlug: Map<string, number>;
}) {
  const reservationCount = reservationCountByPropertySlug.get(property.slug) ?? 0;
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteProperty(property.slug);
      toast.success(`Imóvel "${property.title}" excluído com sucesso.`);
      await router.invalidate();
      setDeleteOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível excluir o imóvel.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <article className="flex items-start gap-3 rounded-lg border border-border/50 p-2.5 transition-colors hover:bg-muted/30">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="size-14 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
            <div className="min-w-0 flex-1 basis-[min(100%,10rem)]">
              <p className="break-words text-sm font-medium leading-snug">{property.title}</p>
              <p className="mt-0.5 break-words text-xs leading-snug text-muted-foreground">
                {property.location}
              </p>
            </div>
            <StatusBadge
              status={propertyStatus(property, reservationCount)}
              reservationCount={reservationCount > 0 ? reservationCount : undefined}
            />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="shrink-0 text-sm font-semibold text-gold-dark">{property.price}</p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex shrink-0 items-center gap-0.5">
                <BedDouble className="h-3 w-3 shrink-0" />
                {property.beds}
              </span>
              <span className="inline-flex shrink-0 items-center gap-0.5">
                <Bath className="h-3 w-3 shrink-0" />
                {property.baths}
              </span>
              <span className="inline-flex shrink-0 items-center gap-0.5">
                <Maximize className="h-3 w-3 shrink-0" />
                {property.area}m²
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menu do imóvel</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </article>

      <AddPropertyModal open={editOpen} onOpenChange={setEditOpen} property={property} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O imóvel &quot;{property.title}&quot; será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RecentPropertiesCard({
  properties,
  reservationCountByPropertySlug,
}: {
  properties: Property[];
  reservationCountByPropertySlug: Map<string, number>;
}) {
  const [showAll, setShowAll] = useState(false);
  const initialVisible = 6;
  const visibleProperties = showAll ? properties : properties.slice(0, initialVisible);
  const hasMore = properties.length > initialVisible;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Imóveis recentes</CardTitle>
        {hasMore && !showAll ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-gold hover:text-gold-dark"
            onClick={() => setShowAll(true)}
          >
            Ver todas
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        {properties.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum imóvel cadastrado ainda.
          </p>
        ) : (
          <div className="max-h-[min(28rem,60vh)] overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-gutter:stable]">
            <div className="space-y-3 pr-1 pb-2">
              {visibleProperties.map((property) => (
                <PropertyListingRow
                  key={property.slug}
                  property={property}
                  reservationCountByPropertySlug={reservationCountByPropertySlug}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function ReservationListingRow({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isUnread = inquiry.readAt === null;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteInquiry(inquiry.id);
      toast.success(`Reserva de "${inquiry.name}" excluída com sucesso.`);
      await router.invalidate();
      setDeleteOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível excluir a reserva.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-2.5 transition-colors",
          isUnread
            ? "border-border/70 bg-cream"
            : "border-border/50 hover:bg-muted/30",
        )}
      >
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-gold-soft text-xs font-medium text-gold-dark">
            {getInitials(inquiry.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-medium leading-snug">{inquiry.name}</p>
          <p className="mt-0.5 break-words text-xs text-muted-foreground">
            {inquiry.propertyTitle ?? "Imóvel não informado"}
          </p>
          <p className="mt-1 break-words text-xs text-muted-foreground">
            {inquiry.phone} · {inquiry.email}
          </p>
          {inquiry.message ? (
            <p className="mt-1 break-words text-xs leading-snug text-foreground/80">
              {inquiry.message}
            </p>
          ) : null}
          <p className="mt-1.5 text-xs text-muted-foreground">
            <RelativeTime date={inquiry.createdAt} />
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
          aria-label="Excluir reserva"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A reserva de &quot;{inquiry.name}&quot; será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function RecentReservationsCard({ inquiries }: { inquiries: Inquiry[] }) {
  const [showAll, setShowAll] = useState(false);
  const initialVisible = 6;
  const visibleInquiries = showAll ? inquiries : inquiries.slice(0, initialVisible);
  const hasMore = inquiries.length > initialVisible;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Reservas recentes</CardTitle>
        {hasMore && !showAll ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-gold hover:text-gold-dark"
            onClick={() => setShowAll(true)}
          >
            Ver todas
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        {inquiries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma reserva recebida ainda.
          </p>
        ) : (
          <div className="max-h-[min(28rem,60vh)] overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-gutter:stable]">
            <div className="space-y-3 pr-1 pb-2">
              {visibleInquiries.map((inquiry) => (
                <ReservationListingRow key={inquiry.id} inquiry={inquiry} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CalendarAndActivities() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Calendário de reservas</CardTitle>
          <div className="flex items-center gap-1">
            <Select defaultValue="month">
              <SelectTrigger className="h-7 w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mês</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="day">Dia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ReservationCalendar />
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm bg-emerald-500" />
              Check-in
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm bg-gold" />
              Check-out
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Atividades recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-3 pl-1">
                {index < activities.length - 1 && (
                  <span className="absolute left-[15px] top-8 h-[calc(100%+4px)] w-px bg-border" />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    activity.type === "property" && "bg-blue-50 text-blue-600",
                    activity.type === "reservation" && "bg-emerald-50 text-emerald-600",
                    activity.type === "review" && "bg-amber-50 text-amber-600",
                  )}
                >
                  {activity.type === "review" ? (
                    <Star className="h-4 w-4" />
                  ) : activity.type === "property" ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <CalendarDays className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <ActivityRelativeTime minutesAgo={activity.minutesAgo} />
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  {activity.rating && (
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: activity.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function buildReservationCountByPropertySlug(inquiries: Inquiry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const inquiry of inquiries) {
    if (!inquiry.propertySlug) continue;
    counts.set(inquiry.propertySlug, (counts.get(inquiry.propertySlug) ?? 0) + 1);
  }
  return counts;
}

export function DashboardContent({
  recentProperties,
  recentInquiries,
}: {
  recentProperties: Property[];
  recentInquiries: Inquiry[];
}) {
  const hydrated = useHydrated();
  const now = useSystemTime();
  const reservationCountByPropertySlug = buildReservationCountByPropertySlug(recentInquiries);
  const monthlyListingCount =
    hydrated && now ? countListingsThisMonth(recentProperties, now) : 0;
  const monthlyConfirmedReservations =
    hydrated && now ? countConfirmedReservationsThisMonth(recentInquiries, now) : 0;
  const monthlyRevenue = 0;
  const monthlyCustomerCount =
    hydrated && now ? countCustomersThisMonth(recentInquiries, now) : 0;

  return (
    <div className="space-y-6">
      <StatsRow
        hydrated={hydrated}
        monthlyListingCount={monthlyListingCount}
        monthlyConfirmedReservations={monthlyConfirmedReservations}
        monthlyRevenue={monthlyRevenue}
        monthlyCustomerCount={monthlyCustomerCount}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <RecentPropertiesCard
          properties={recentProperties}
          reservationCountByPropertySlug={reservationCountByPropertySlug}
        />
        <RecentReservationsCard inquiries={recentInquiries} />
      </div>
      <Suspense
        fallback={
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-border/60 shadow-sm">
                <CardContent className="p-5">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <DashboardCharts />
      </Suspense>
      <CalendarAndActivities />
    </div>
  );
}
