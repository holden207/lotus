"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  reservationChartData,
  revenueChartData,
  sourceChannelsData,
} from "@/lib/admin-data";

const reservationChartConfig = {
  confirmadas: { label: "Confirmadas", color: "var(--color-chart-2)" },
  pendentes: { label: "Pendentes", color: "var(--color-chart-4)" },
  canceladas: { label: "Canceladas", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

const revenueChartConfig = {
  value: { label: "Receita", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

const sourceChartConfig = {
  Site: { label: "Site", color: "var(--color-chart-1)" },
  Instagram: { label: "Instagram", color: "var(--color-chart-2)" },
  Google: { label: "Google", color: "var(--color-chart-3)" },
  Indicação: { label: "Indicação", color: "var(--color-chart-4)" },
  Outros: { label: "Outros", color: "var(--color-chart-5)" },
} satisfies ChartConfig;

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Resumo de reservas</CardTitle>
          <Select defaultValue="7d">
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={reservationChartConfig} className="aspect-[4/3] h-[200px] w-full">
            <AreaChart data={reservationChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="confirmadas"
                stackId="1"
                stroke="var(--color-confirmadas)"
                fill="var(--color-confirmadas)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="pendentes"
                stackId="1"
                stroke="var(--color-pendentes)"
                fill="var(--color-pendentes)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="canceladas"
                stackId="1"
                stroke="var(--color-canceladas)"
                fill="var(--color-canceladas)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>Confirmadas (72)</span>
            <span>Pendentes (28)</span>
            <span>Canceladas (4)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Receita dos últimos 30 dias</CardTitle>
            <p className="mt-1 text-lg font-semibold text-foreground">
              R$ 96.540{" "}
              <span className="text-xs font-normal text-emerald-600">↑ 0%</span>
            </p>
          </div>
          <Select defaultValue="30d">
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="aspect-[4/3] h-[200px] w-full">
            <BarChart data={revenueChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Canais de origem</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={sourceChartConfig} className="mx-auto aspect-square h-[200px]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={sourceChannelsData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                strokeWidth={2}
              >
                {sourceChannelsData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
          <p className="mt-2 text-center text-xs text-muted-foreground">Total de 128 reservas</p>
        </CardContent>
      </Card>
    </div>
  );
}
