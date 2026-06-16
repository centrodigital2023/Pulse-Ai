import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useSellerStats } from "@/lib/db";
import {
  TrendingUp, Users, DollarSign, Star, Package,
  ChevronRight, Flame, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Resumen — PULSE AI Dashboard" }] }),
  component: Overview,
});

const money = (n: number) =>
  `$${n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toLocaleString()}`;

// ─── Today's live ticker ──────────────────────────────────────────────────────

function TodayTicker({ stats }: { stats: ReturnType<typeof useSellerStats>["data"] }) {
  const items = [
    { label: "Ingresos hoy", value: money(stats?.revenueToday ?? 0), icon: DollarSign, color: "text-emerald-400" },
    { label: "Ventas hoy", value: String(stats?.salesToday ?? 0), icon: Package, color: "text-primary" },
    { label: "Nuevos clientes", value: String(stats?.newCustomersToday ?? 0), icon: Users, color: "text-blue-400" },
    { label: "Productos activos", value: String(stats?.productsLive ?? 0), icon: Star, color: "text-yellow-400" },
  ];

  return (
    <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </div>
        <span className="text-xs font-mono text-primary uppercase tracking-widest">En vivo · Hoy</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(m => (
          <div key={m.label} className="text-center">
            <m.icon className={`size-4 mx-auto mb-1 ${m.color}`} />
            <div className="text-xl font-extrabold tracking-tight">{m.value}</div>
            <div className="text-[10px] text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon: Icon, color }: {
  label: string; value: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="group relative p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${color.replace("text-", "bg-")}`} />
      <div className="relative flex items-start justify-between mb-4">
        <div className={`size-9 rounded-xl flex items-center justify-center ${color.replace("text-", "bg-").replace("primary", "primary/10").replace("blue-400", "blue-400/10").replace("emerald-400", "emerald-400/10").replace("yellow-400", "yellow-400/10")}`}>
          <Icon className={`size-4.5 ${color}`} />
        </div>
      </div>
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-extrabold tracking-tight tabular-nums">{value}</div>
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rounded-2xl bg-surface border border-dashed border-border p-10 text-center">
      <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
        <Sparkles className="size-6 text-primary" />
      </div>
      <h3 className="text-base font-semibold mb-1">Aún no tienes ventas</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
        Publica tu primer producto y tus ingresos, clientes y actividad aparecerán aquí en tiempo real.
      </p>
      <Link
        to="/dashboard/products/new"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Package className="size-4" /> Crear primer producto
      </Link>
    </div>
  );
}

// ─── Main Overview ────────────────────────────────────────────────────────────

const PERIODS = ["Hoy", "7 días", "30 días", "90 días"] as const;

function Overview() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>("30 días");
  const { data: stats, isLoading } = useSellerStats();

  const hasData = !!stats && (stats.salesTotal > 0 || stats.productsTotal > 0);
  const hasSales = !!stats && stats.salesTotal > 0;

  const kpis = [
    { label: "Ingresos netos", value: money(stats?.revenueTotal ?? 0), icon: DollarSign, color: "text-primary" },
    { label: "Ventas totales", value: String(stats?.salesTotal ?? 0), icon: Package, color: "text-blue-400" },
    { label: "Clientes", value: String(stats?.customersTotal ?? 0), icon: Users, color: "text-emerald-400" },
    { label: "Productos", value: String(stats?.productsTotal ?? 0), icon: Star, color: "text-yellow-400" },
  ];

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
      <div className="space-y-6">
        <TodayTicker stats={stats} />
        <QuickActions />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(k => (
            <KpiCard key={k.label} label={k.label} value={k.value} icon={k.icon} color={k.color} />
          ))}
        </div>

        {isLoading ? (
          <div className="rounded-2xl bg-surface border border-border p-10 text-center text-sm text-muted-foreground">
            Cargando datos…
          </div>
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue chart */}
            <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold">Ingresos</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span className="size-2 rounded-full bg-primary" /> Ingresos
                </span>
              </div>
              {hasSales ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={stats!.revenueSeries} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.146 162.5)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="oklch(0.7 0.146 162.5)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
                    <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.195 0.005 285.8)", border: "1px solid oklch(0.3 0.006 286)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "oklch(0.985 0 0)" }}
                      formatter={(v: number) => [`$${v.toLocaleString()}`, "Ingresos"]}
                    />
                    <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="oklch(0.7 0.146 162.5)" strokeWidth={2.5} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                  Tus ingresos aparecerán aquí con la primera venta.
                </div>
              )}
            </div>

            {/* Live activity */}
            <div className="rounded-2xl bg-surface border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </div>
                <h3 className="text-sm font-semibold">Actividad reciente</h3>
              </div>
              {stats!.activity.length ? (
                <div className="space-y-3">
                  {stats!.activity.map(a => (
                    <div key={a.id} className="flex gap-3 group">
                      <div className="size-8 rounded-xl bg-primary/10 border border-primary/15 shrink-0 flex items-center justify-center text-[10px] font-bold text-primary">
                        {a.who.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs leading-snug">
                          <span className="font-bold">{a.who}</span>{" "}
                          <span className="text-muted-foreground">{a.action}</span>{" "}
                          <span className="text-primary font-medium">{a.target}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{a.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">Sin actividad todavía.</p>
              )}
              <Link to="/dashboard/analytics" className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                Ver analytics <ChevronRight className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
