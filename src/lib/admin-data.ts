import property1 from "@/assets/property-1.png";
import property2 from "@/assets/property-2.png";
import property3 from "@/assets/property-3.png";

export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export type RecentProperty = {
  id: string;
  title: string;
  location: string;
  image: string;
  status: "Publicado" | "Em destaque" | "Rascunho";
  price: string;
  beds: number;
  baths: number;
  area: number;
};

// todo

export type RecentReservation = {
  id: string;
  customer: string;
  initials: string;
  property: string;
  status: "Confirmada" | "Pendente";
  date: string;
  total: string;
};

export type Activity = {
  id: string;
  type: "property" | "reservation" | "review";
  title: string;
  description: string;
  minutesAgo: number;
  rating?: number;
};

export const stats: StatCard[] = [
  { label: "Imóveis ativos", value: "42", change: "↑ 0% vs mês anterior", trend: "up" },
  { label: "Reservas confirmadas", value: "128", change: "↑ 0% vs mês anterior", trend: "up" },
  { label: "Receita (mês)", value: "R$ 96.540", change: "↑ 0% vs mês anterior", trend: "up" },
  { label: "Novos clientes", value: "36", change: "↑ 0% vs mês anterior", trend: "up" },
];

export const recentProperties: RecentProperty[] = [
  {
    id: "1",
    title: "Apartamento Jardins",
    location: "Jardins, São Paulo",
    image: property1,
    status: "Publicado",
    price: "R$ 1.850.000",
    beds: 3,
    baths: 2,
    area: 120,
  },
  {
    id: "2",
    title: "Casa Alto da Boa Vista",
    location: "Alto da Boa Vista, SP",
    image: property2,
    status: "Em destaque",
    price: "R$ 3.200.000",
    beds: 4,
    baths: 3,
    area: 280,
  },
  {
    id: "3",
    title: "Cobertura Itaim Bibi",
    location: "Itaim Bibi, São Paulo",
    image: property3,
    status: "Publicado",
    price: "R$ 4.500.000",
    beds: 4,
    baths: 4,
    area: 350,
  },
  {
    id: "4",
    title: "Studio Vila Olímpia",
    location: "Vila Olímpia, São Paulo",
    image: property1,
    status: "Rascunho",
    price: "R$ 680.000",
    beds: 1,
    baths: 1,
    area: 45,
  },
  {
    id: "5",
    title: "Apartamento Moema",
    location: "Moema, São Paulo",
    image: property2,
    status: "Publicado",
    price: "R$ 1.120.000",
    beds: 2,
    baths: 2,
    area: 85,
  },
];

export const recentReservations: RecentReservation[] = [
  {
    id: "1",
    customer: "Maria Silva",
    initials: "MS",
    property: "Apartamento Jardins",
    status: "Confirmada",
    date: "22 Jun 2024",
    total: "R$ 4.200",
  },
  {
    id: "2",
    customer: "João Santos",
    initials: "JS",
    property: "Casa Alto da Boa Vista",
    status: "Pendente",
    date: "21 Jun 2024",
    total: "R$ 8.500",
  },
  {
    id: "3",
    customer: "Ana Costa",
    initials: "AC",
    property: "Cobertura Itaim Bibi",
    status: "Confirmada",
    date: "20 Jun 2024",
    total: "R$ 12.000",
  },
  {
    id: "4",
    customer: "Pedro Lima",
    initials: "PL",
    property: "Studio Vila Olímpia",
    status: "Confirmada",
    date: "19 Jun 2024",
    total: "R$ 2.800",
  },
  {
    id: "5",
    customer: "Carla Mendes",
    initials: "CM",
    property: "Apartamento Moema",
    status: "Pendente",
    date: "18 Jun 2024",
    total: "R$ 3.600",
  },
];

export const reservationChartData = [
  { day: "Seg", confirmadas: 12, pendentes: 4, canceladas: 1 },
  { day: "Ter", confirmadas: 15, pendentes: 3, canceladas: 0 },
  { day: "Qua", confirmadas: 10, pendentes: 6, canceladas: 1 },
  { day: "Qui", confirmadas: 18, pendentes: 5, canceladas: 0 },
  { day: "Sex", confirmadas: 14, pendentes: 4, canceladas: 1 },
  { day: "Sáb", confirmadas: 8, pendentes: 3, canceladas: 1 },
  { day: "Dom", confirmadas: 6, pendentes: 3, canceladas: 0 },
];

export const revenueChartData = [
  { day: "1", value: 2800 },
  { day: "5", value: 4200 },
  { day: "10", value: 3100 },
  { day: "15", value: 5600 },
  { day: "20", value: 4800 },
  { day: "25", value: 6200 },
  { day: "30", value: 5400 },
];

export const sourceChannelsData = [
  { name: "Site", value: 45, fill: "var(--color-chart-1)" },
  { name: "Instagram", value: 25, fill: "var(--color-chart-2)" },
  { name: "Google", value: 15, fill: "var(--color-chart-3)" },
  { name: "Indicação", value: 10, fill: "var(--color-chart-4)" },
  { name: "Outros", value: 5, fill: "var(--color-chart-5)" },
];

export const activities: Activity[] = [
  {
    id: "1",
    type: "property",
    title: "Novo imóvel cadastrado",
    description: "Apartamento Jardins foi publicado",
    minutesAgo: 120,
  },
  {
    id: "2",
    type: "reservation",
    title: "Nova reserva recebida",
    description: "Maria Silva reservou Apartamento Jardins",
    minutesAgo: 180,
  },
  {
    id: "3",
    type: "review",
    title: "Nova avaliação",
    description: "João Santos avaliou Casa Alto da Boa Vista",
    minutesAgo: 300,
    rating: 5,
  },
  {
    id: "4",
    type: "reservation",
    title: "Reserva confirmada",
    description: "Ana Costa — Cobertura Itaim Bibi",
    minutesAgo: 480,
  },
  {
    id: "5",
    type: "property",
    title: "Imóvel atualizado",
    description: "Studio Vila Olímpia — preço alterado",
    minutesAgo: 1440,
  },
];
