import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area, AreaChart, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAnimatedCounter, useInView } from "@/hooks/useAnimatedCounter";
import {
  Bot, TrendingUp, ArrowUpRight, Zap,
  Target, Users, DollarSign, Download, Star, Package,
  ChevronRight, Flame, Inbox,
} from "lucide-react";
import { useMyProducts, useMyOrders, useMyCustomers } from "@/lib/db";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Resumen — PULSE AI Dashboard" }] }),
  component: Overview,
});

// ─── Animated KPI card ────────────────────────────────────────────────────────

function KpiCard({ label, rawValue, prefix = "", suffix = "", icon: Icon, color }: {
  label: string; rawValue: number; prefix?: string; suffix?: string;
  icon: React.ElementType; color: string;
}) {
  const { ref, inView } = useInView();
  const count = useAnimatedCounter(rawValue, 1600, inView);
  const display = rawValue >= 1_000_000
    ? `${prefix}${(rawValue / 1_000_000).toFixed(1)}M${suffix}`
    : rawValue >= 1_000
    ? `${prefix}${(rawValue / 1_000).toFixed(0)}k${suffix}`
    : `${prefix}${count}${suffix}`;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${color.replace("text-", "bg-")}`} />
      <div className="relative flex items-start justify-between mb-4">
        <div className="size-9 rounded-xl flex items-center justify-center bg-black/20">
          <Icon className={`size-4.5 ${color}`} />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
          <ArrowUpRight className="size-3" />
          nuevo
        </div>
      </div>
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-extrabold tracking-tight tabular-nums">
        {inView ? display : `${prefix}0${suffix}`}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, title, desc, action, to }: {
  icon: React.ElementType; title: string; desc: string; action?: string; to?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      <div className="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">{desc}</div>
      </div>
      {action && to && (
        <Link to={to as "/dashboard"} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
          {action} <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions() {
  const actions = [
    { label: "Nuevo producto", icon: Package, to: "/dashboard/products/new", color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
    { label: "Ver analytics", icon: TrendingUp, to: "/dashboard/analytics", color: "bg-blue-400/10 text-blue-400 border-blue-400/20 hover:bg-blue-400/20" },
    { label: "Mis afiliados", icon: Users, to: "/dashboard/affiliates", color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/20" },
    { label: "Marketplace", icon: Flame, to: "/dashboard/marketplace", color: "bg-orange-400/10 text-orange-400 border-orange-400/20 hover:bg-orange-400/20" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(a => (
        <Link
          key={a.label}
          to={a.to as "/dashboard"}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${a.color}`}
        >
          <a.icon className="size-4 shrink-0" />
          {a.label}
        </Link>
      ))}
    </div>
  );
}

// ─── AI Insights placeholder ──────────────────────────────────────────────────

function AIInsightsPanel() {
  return (
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Insights</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-surface border border-border px-2 py-0.5 rounded-full">
          Próximamente
        </span>
      </div>
      <EmptyState
        icon={Bot}
        title="Los insights se generan solos"
        desc="Cuando tengas ventas, el motor de IA detectará oportunidades y alertas en tiempo real."
        action="Ver módulo IA"
        to="/dashboard/ai"
      />
    </div>
  );
}

// ─── Goals progress ──────────────────────────────────────────────────────────

function GoalsProgress({ revenue, customers, downloads }: {
  revenue: number; customers: number; downloads: number;
}) {
  const goals = [
    { label: "Primera venta", current: revenue > 0 ? 1 : 0, target: 1, color: "bg-primary", icon: DollarSign },
    { label: "10 clientes", current: Math.min(customers, 10), target: 10, color: "bg-blue-400", icon: Users },
    { label: "50 descargas", current: Math.min(downloads, 50), target: 50, color: "bg-emerald-400", icon: Download },
    { label: "Rating 5.0", current: 0, target: 5, color: "bg-yellow-400", icon: Star },
  ];

  return (
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Metas de inicio</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">{new Date().toLocaleDateString("es-CO", { month: "long", year: "numeric" })}</span>
      </div>
      <div className="space-y-4">
        {goals.map(g => {
          const pct = Math.min(100, g.target > 0 ? Math.round((g.current / g.target) * 100) : 0);
          return (
            <div key={g.label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5">
                  <g.icon className="size-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{g.label}</span>
                </div>
                <span className="font-bold tabular-nums">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                <div className={`h-full rounded-full ${g.color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Overview ────────────────────────────────────────────────────────────

const PERIODS = ["Hoy", "7 días", "30 días", "90 días"] as const;

function Overview() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>("30 días");
  const { data: products = [], isLoading: loadingProducts } = useMyProducts();
  const { data: orders = [], isLoading: loadingOrders } = useMyOrders();
  const { data: customers = [], isLoading: loadingCustomers } = useMyCustomers();

  const isLoading = loadingProducts || loadingOrders || loadingCustomers;

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalSales = orders.length;
  const totalCustomers = customers.length;
  const liveProducts = products.filter(p => p.status === "live").length;

  const revenueByMonth = orders.reduce<Record<string, { revenue: number; sales: number }>>((acc, o) => {
    const m = new Date(o.created_at).toLocaleDateString("es-CO", { month: "short" });
    if (!acc[m]) acc[m] = { revenue: 0, sales: 0 };
    acc[m].revenue += o.amount;
    acc[m].sales += 1;
    return acc;
  }, {});

  const chartData = Object.entries(revenueByMonth).map(([month, vals]) => ({
    month,
    revenue: vals.revenue,
    mrr: vals.sales,
  }));

  return (
    <DashboardLayout
      title="Resumen General"
      breadcrumb={["Dashboard", "Resumen"]}
      actions={
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"}`}
            >
              {p}
            </button>
          ))}
        </div>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">

          {/* Quick actions */}
          <QuickActions />

          {/* Animated KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Ingresos Netos" rawValue={totalRevenue} prefix="$" icon={DollarSign} color="text-primary" />
            <KpiCard label="Clientes Totales" rawValue={totalCustomers} icon={Users} color="text-blue-400" />
            <KpiCard label="Ventas Totales" rawValue={totalSales} icon={TrendingUp} color="text-emerald-400" />
            <KpiCard label="Productos Activos" rawValue={liveProducts} icon={Package} color="text-yellow-400" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold">Ingresos & Ventas por mes</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Histórico real de tus transacciones</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Ingresos</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-400" /> Ventas</span>
                </div>
              </div>
              {chartData.length === 0 ? (
                <EmptyState
                  icon={TrendingUp}
                  title="Aquí verás tu curva de crecimiento"
                  desc="Las gráficas se alimentan automáticamente con cada venta que hagas."
                  action="Crear mi primer producto"
                  to="/dashboard/products/new"
                />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.146 162.5)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="oklch(0.7 0.146 162.5)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.62 0.13 200)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="oklch(0.62 0.13 200)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
                    <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.195 0.005 285.8)", border: "1px solid oklch(0.3 0.006 286)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "oklch(0.985 0 0)" }}
                      formatter={(v: number, name: string) => name === "revenue" ? [`$${v.toLocaleString()}`, "Ingresos"] : [v, "Ventas"]}
                    />
                    <Area type="monotone" dataKey="revenue" name="revenue" stroke="oklch(0.7 0.146 162.5)" strokeWidth={2.5} fill="url(#rev)" />
                    <Area type="monotone" dataKey="mrr" name="mrr" stroke="oklch(0.62 0.13 200)" strokeWidth={2} fill="url(#mrr)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent orders */}
            <div className="rounded-2xl bg-surface border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </div>
                <h3 className="text-sm font-semibold">Órdenes recientes</h3>
              </div>
              {orders.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="Sin ventas aún"
                  desc="Cuando alguien compre uno de tus productos, aparecerá aquí en tiempo real."
                />
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 6).map(o => (
                    <div key={o.id} className="flex gap-3 group">
                      <div className="size-8 rounded-xl bg-primary/10 border border-primary/15 shrink-0 flex items-center justify-center text-[10px] font-bold text-primary">
                        {(o.buyer_email ?? "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs leading-snug font-bold truncate">{o.product_name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {o.buyer_email ?? "Comprador"} · ${o.amount.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <AIInsightsPanel />

            {/* Goals */}
            <GoalsProgress revenue={totalRevenue} customers={totalCustomers} downloads={totalSales} />

            {/* Conversion funnel */}
            <div className="rounded-2xl bg-surface border border-border p-5">
              <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> Embudo de conversión
              </h3>
              {totalSales === 0 ? (
                <EmptyState
                  icon={TrendingUp}
                  title="Sin datos de embudo"
                  desc="El embudo se construye desde tus primeras visitas y ventas reales."
                />
              ) : (
                <div className="space-y-4">
                  {[
                    { stage: "Órdenes pagadas", count: totalSales, pct: 100 },
                    { stage: "Clientes únicos", count: totalCustomers, pct: totalSales > 0 ? Math.round((totalCustomers / totalSales) * 100) : 0 },
                  ].map(f => (
                    <div key={f.stage}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{f.stage}</span>
                        <span className="font-mono font-bold">{f.count.toLocaleString()} <span className="text-muted-foreground font-normal">({f.pct}%)</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{ width: `${f.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">Ingresos totales</div>
                    <div className="text-2xl font-extrabold text-primary mt-1">${totalRevenue.toLocaleString("es-CO")}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bar chart — sales by month */}
          <div className="rounded-2xl bg-surface border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold">Ventas por mes</h3>
              <Link to="/dashboard/analytics" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                Ver analytics completos <ChevronRight className="size-3" />
              </Link>
            </div>
            {chartData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">Sin datos aún</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
                  <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "oklch(0.27 0.006 286 / 0.4)" }}
                    contentStyle={{ background: "oklch(0.195 0.005 285.8)", border: "1px solid oklch(0.3 0.006 286)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v.toLocaleString()}`, "Ventas"]}
                  />
                  <Bar dataKey="mrr" name="mrr" fill="oklch(0.7 0.146 162.5)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Zap CTA if no products yet */}
          {liveProducts === 0 && (
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">¡Publica tu primer producto y empieza a ganar!</div>
                <div className="text-xs text-muted-foreground mt-1">PULSE AI maneja los pagos, licencias, descargas y soporte por ti.</div>
              </div>
              <Link
                to="/dashboard/products/new"
                className="shrink-0 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Crear producto
              </Link>
            </div>
          )}

        </div>
      )}
    </DashboardLayout>
  );
}
