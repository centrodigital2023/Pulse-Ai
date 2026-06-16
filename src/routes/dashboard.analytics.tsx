import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useMyOrders, useMyProducts, useMyCustomers } from "@/lib/db";
import { TrendingUp, BarChart3, Globe, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics — PULSE AI Dashboard" }] }),
  component: Analytics,
});

const COLORS = [
  "oklch(0.7 0.146 162.5)",
  "oklch(0.62 0.13 200)",
  "oklch(0.7 0.12 80)",
  "oklch(0.6 0.2 290)",
  "oklch(0.65 0.2 20)",
];

const tooltipStyle = {
  background: "oklch(0.195 0.005 285.8)",
  border: "1px solid oklch(0.3 0.006 286)",
  borderRadius: 8,
  fontSize: 12,
};

function EmptyChart({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
      <div className="size-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{desc}</div>
      </div>
    </div>
  );
}

function Analytics() {
  const { data: orders = [], isLoading: loadingOrders } = useMyOrders();
  const { data: products = [], isLoading: loadingProducts } = useMyProducts();
  const { data: customers = [] } = useMyCustomers();

  const isLoading = loadingOrders || loadingProducts;

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const totalCustomers = customers.length;
  const totalSales = orders.length;
  const liveProducts = products.filter(p => p.status === "live").length;

  // Revenue series grouped by month
  const revenueByMonth = orders.reduce<Record<string, { revenue: number; mrr: number }>>((acc, o) => {
    const m = new Date(o.created_at).toLocaleDateString("es-CO", { month: "short" });
    if (!acc[m]) acc[m] = { revenue: 0, mrr: 0 };
    acc[m].revenue += o.amount;
    acc[m].mrr += 1;
    return acc;
  }, {});
  const revenueSeries = Object.entries(revenueByMonth).map(([month, v]) => ({ month, ...v }));

  // Revenue by product
  const revenueByProduct = Object.values(
    orders.reduce<Record<string, { name: string; revenue: number }>>((acc, o) => {
      if (!acc[o.product_name]) acc[o.product_name] = { name: o.product_name, revenue: 0 };
      acc[o.product_name].revenue += o.amount;
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const kpis = [
    { label: "Ingresos Netos", value: `$${totalRevenue.toLocaleString("es-CO")}`, delta: totalSales > 0 ? `${totalSales} ventas` : "Sin ventas aún", positive: true },
    { label: "Clientes Totales", value: totalCustomers.toString(), delta: totalCustomers > 0 ? "desde el inicio" : "Sin clientes aún", positive: true },
    { label: "Ventas Totales", value: totalSales.toString(), delta: liveProducts > 0 ? `${liveProducts} productos activos` : "Publica productos", positive: true },
    { label: "Productos Activos", value: liveProducts.toString(), delta: products.length > 0 ? `${products.length} total` : "Sin productos aún", positive: true },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics" breadcrumb={["Dashboard", "Analytics"]}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-surface border border-border animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Analytics"
      breadcrumb={["Dashboard", "Analytics"]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Últimos 30 días</Button>
          <Button variant="contrast" size="sm" disabled={orders.length === 0}>Exportar CSV</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(m => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="text-xs font-mono text-muted-foreground mb-1">{m.label}</div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className={`text-[10px] mt-2 ${m.positive ? "text-primary" : "text-destructive"}`}>{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Revenue over time */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold">Ingresos & Ventas por mes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Datos reales de tus transacciones</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Ingresos</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: COLORS[1] }} /> Ventas</span>
            </div>
          </div>
          {revenueSeries.length === 0 ? (
            <EmptyChart icon={TrendingUp} title="Sin datos aún" desc="Cada venta que hagas aparecerá automáticamente en esta gráfica." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueSeries} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[1]} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => name === "revenue" ? [`$${v.toLocaleString()}`, "Ingresos"] : [v, "Ventas"]} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke={COLORS[0]} strokeWidth={2} fill="url(#rev)" />
                <Area type="monotone" dataKey="mrr" name="mrr" stroke={COLORS[1]} strokeWidth={2} fill="url(#mrr)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue by product */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-6">Ingresos por Producto</h3>
            {revenueByProduct.length === 0 ? (
              <EmptyChart icon={BarChart3} title="Sin ventas por producto" desc="Las ventas de cada producto aparecerán aquí comparadas entre sí." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueByProduct} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" horizontal={false} />
                  <XAxis type="number" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" stroke="oklch(0.712 0.013 286)" fontSize={10} tickLine={false} axisLine={false} width={90} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Conversion funnel from real data */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-6">Resumen de Conversión</h3>
            {totalSales === 0 ? (
              <EmptyChart icon={TrendingUp} title="Sin datos de conversión" desc="El embudo de conversión se construye automáticamente con tus ventas reales." />
            ) : (
              <div className="space-y-4">
                {[
                  { stage: "Órdenes totales", count: totalSales, pct: 100 },
                  { stage: "Clientes únicos", count: totalCustomers, pct: totalSales > 0 ? Math.round((totalCustomers / totalSales) * 100) : 0 },
                  { stage: "Ingresos promedio/venta", count: Math.round(totalRevenue / totalSales), pct: 100, prefix: "$" },
                ].map((f, i) => (
                  <div key={f.stage}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{f.stage}</span>
                      <span className="font-mono">{f.prefix}{f.count.toLocaleString("es-CO")} <span className="text-muted-foreground">· {f.pct}%</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Geographic distribution placeholder */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Distribución Geográfica</h3>
            <EmptyChart icon={Globe} title="Próximamente" desc="La distribución geográfica se conectará a los datos de ubicación de tus compradores." />
          </div>

          {/* Cohort retention placeholder */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Retención por Cohorte</h3>
            <EmptyChart icon={Users} title="Próximamente" desc="El análisis de cohortes estará disponible cuando tengas suficientes ventas recurrentes." />
          </div>
        </div>

        {/* Revenue split pie */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Distribución de Ingresos por Producto</h3>
          {revenueByProduct.length === 0 ? (
            <EmptyChart icon={BarChart3} title="Sin datos" desc="El gráfico circular aparece cuando tengas ventas de múltiples productos." />
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={revenueByProduct} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="revenue" paddingAngle={3}>
                    {revenueByProduct.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {revenueByProduct.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="size-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <div className="flex-1 text-sm truncate">{item.name}</div>
                    <div className="font-mono text-sm">${item.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground w-10 text-right">
                      {((item.revenue / revenueByProduct.reduce((a, b) => a + b.revenue, 0)) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
