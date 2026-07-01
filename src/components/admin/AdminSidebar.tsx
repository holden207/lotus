import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Building2,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  FileText,
  HelpCircle,
  Image,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Quote,
  Settings,
  Star,
  Users,
  Plug,
  Shield,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "GESTÃO",
    items: [
      { label: "Imóveis", icon: Building2, href: "#" },
      { label: "Reservas", icon: CalendarDays, href: "#" },
      { label: "Clientes", icon: Users, href: "#" },
      { label: "Mensagens", icon: MessageSquare, href: "#" },
      { label: "Pagamentos", icon: CreditCard, href: "#" },
      { label: "Avaliações", icon: Star, href: "#" },
    ],
  },
  {
    label: "CONTEÚDO",
    items: [
      { label: "Páginas", icon: FileText, href: "#" },
      { label: "Banners", icon: Megaphone, href: "#" },
      { label: "Depoimentos", icon: Quote, href: "#" },
      { label: "Mídia", icon: Image, href: "#" },
    ],
  },
  {
    label: "CONFIGURAÇÕES",
    items: [
      { label: "Usuários", icon: Users, href: "#" },
      { label: "Funções", icon: Shield, href: "#" },
      { label: "Configurações", icon: Settings, href: "#" },
      { label: "Integrações", icon: Plug, href: "#" },
    ],
  },
];

function CollapseButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Recolher menu</span>
    </button>
  );
}

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <Link to="/admin_page" className="flex flex-col items-center gap-2 group-data-[collapsible=icon]:px-0">
          <img
            src={logo}
            alt="Lótus Imóveis"
            className="h-12 w-auto brightness-110 group-data-[collapsible=icon]:h-8"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup className="px-2 pt-3">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive
                  className={cn(
                    "data-[active=true]:bg-gold data-[active=true]:text-primary-foreground",
                    "data-[active=true]:hover:bg-gold/90 data-[active=true]:hover:text-primary-foreground",
                  )}
                >
                  <Link to="/admin_page">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-2">
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-[0.15em] text-sidebar-foreground/45">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Suporte">
              <a href="#">
                <LifeBuoy />
                <span>Suporte</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Central de ajuda">
              <a href="#">
                <HelpCircle />
                <span>Central de ajuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <CollapseButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
