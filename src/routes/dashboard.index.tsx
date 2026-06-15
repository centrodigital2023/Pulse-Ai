import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart,
  ResponsiveContainer, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { metrics, revenueSeries, funnel, activity, aiInsights } from "@/lib/mock-data";
import { useAnimatedCounter, useInView } from "@/hooks/useAnimatedCounter";
import {
  Bot, TrendingUp, ArrowUpRight, ArrowDownRight, Zap,
  Target, Users, DollarSign, Download, Star, Package,
  ChevronRight, Flame, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Resumen — PULSE AI Dashboard" }] }),
  component: Overview,
});

// ─── Animated KPI card ────────────────────────────────────────────────────────

function KpiCard({ label, rawValue, value, delta, positive, icon: Icon, color }: {
  label: string; rawValue: number; value: string;
  delta: string; positive: boolean;
  icon: React.ElementType; color: string;
}) {
  const { ref, inView } = useInView();
  const count = useAnimatedCounter(rawValue, 1600, inView);
  const isMonetary = value.startsWith("$");
  const displayValue = isMonetary
    ? `$${count >= 1000000 ? (count / 1000000).toFixed(1) + "M" : count >= 1000 ? (count / 1000).toFixed(0) + "k" : count}`
    : value;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${color.replace("text-", "bg-")}`} />

      <div className="relative flex items-start justify-between mb-4">
        <div className={`size-9 rounded-xl flex items-center justify-center ${color.replace("text-", "bg-").replace("primary", "primary/10").replace("blue-400", "blue-400/10").replace("emerald-400", "emerald-400/10").replace("rose-400", "rose-400/10")}`}>
          <Icon className={`size-4.5 ${color}`} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {delta}
        </div>
      </div>

      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-extrabold tracking-tight tabular-nums">
        {inView && isMonetary ? displayValue : value}
      </div>
    </div>
  );
}

// ─── Today's live ticker ──────────────────────────────────────────────────────

function TodayTicker() {
  const todayMetrics = [
    { label: "Ingresos hoy", value: "$847.200", icon: DollarSign, color: "text-emerald-400" },
    { label: "Ventas hoy", value: "12", icon: Package, color: "text-primary" },
    { label: "Nuevos clientes", value: "8", icon: Users, color: "text-blue-400" },
    { label: "Rating promedio", value: "4.9 ⭐", icon: Star, color: "text-yellow-400" },
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
        {todayMetrics.map(m => (
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

// ─── AI Insights panel ────────────────────────────────────────────────────────

function AIInsightsPanel() {
  const [applied, setApplied] = useState<Set<number>>(new Set());

  const apply = (i: number) => {
    setApplied(s => new Set(s).add(i));
    toast.success("💡 Insight aplicado — campaña iniciada automáticamente");
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Insights</h3>
        <span className="ml-auto text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
          {aiInsights.length} nuevos
        </span>
      </div>
      <div className="space-y-3">
        {aiInsights.slice(0, 3).map((insight, i) => (
          <div key={i} className={`p-3 rounded-xl border transition-all ${applied.has(i) ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-black/10 hover:border-primary/20"}`}>
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {insight.kind === "opportunity" ? <TrendingUp className="size-3.5 text-primary" /> :
                 insight.kind === "risk" ? <AlertCircle className="size-3.5 text-yellow-400" /> :
                 <Target className="size-3.5 text-blue-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold mb-1">{insight.title}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{insight.body}</p>
                <div className={`mt-1.5 text-[10px] font-mono font-bold uppercase tracking-wide ${insight.impact === "high" ? "text-emerald-400" : insight.impact === "medium" ? "text-yellow-400" : "text-muted-foreground"}`}>
                  Impacto {insight.impact === "high" ? "alto" : insight.impact === "medium" ? "medio" : "bajo"}
                </div>
              </div>
              {!applied.has(i) && (
                <button
                  onClick={() => apply(i)}
                  className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <Zap className="size-3" /> Aplicar
                </button>
              )}
              {applied.has(i) && (
                <span className="shrink-0 text-[10px] font-bold text-emerald-400">✓ Aplicado</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link to="/dashboard/ai" className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
        Ver todos los insights <ChevronRight className="size-3" />
      </Link>
    </div>
  );
}

// ─── Goals progress ──────────────────────────────────────────────────────────

function GoalsProgress() {
  const goals = [
    { label: "Ingresos del mes", current: 8400000, target: 12000000, color: "bg-primary", icon: DollarSign },
    { label: "Nuevos clientes", current: 47, target: 100, color: "bg-blue-400", icon: Users },
    { label: "Descargas completadas", current: 312, target: 500, color: "bg-emerald-400", icon: Download },
    { label: "Rating promedio", current: 49, target: 50, color: "bg-yellow-400", icon: Star },
  ];

  return (
    <div className="rounded-2xl bg-surface border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Metas del mes</h3>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">Junio 2025</span>
      </div>
      <div className="space-y-4">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
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

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions() {
  const actions = [
    { label: "Nuevo producto", icon: Package, to: "/dashboard/products/new", color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
    { label: "Ver analytics", icon: TrendingUp, to: "/dashboard/analytics", color: "bg-blue-400/10 text-blue-400 border-blue-400/20 hover:bg-blue-400/20" },
    { label: "Mis afiliados", icon: Users, to: "/dashboard/affiliates", color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/20" },
    { label: "Flash sale", icon: Flame, to: "/dashboard/marketplace", color: "bg-orange-400/10 text-orange-400 border-orange-400/20 hover:bg-orange-400/20" },
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

// ─── Main Overview ────────────────────────────────────────────────────────────

const PERIODS = ["Hoy", "7 días", "30 días", "90 días"] as const;

function Overview() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>("30 días");

  const kpiIcons = [DollarSign, Users, TrendingUp, Star];
  const kpiColors = ["text-primary", "text-blue-400", "text-emerald-400", "text-yellow-400"];
  const kpiRaw = [412840, 8420, 562, 94];

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

        {/* Live ticker */}
        <TodayTicker />

        {/* Quick actions */}
        <QuickActions />

        {/* Animated KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <KpiCard
              key={m.label}
              label={m.label}
              rawValue={kpiRaw[i]}
              value={m.value}
              delta={m.delta}
              positive={m.positive}
              icon={kpiIcons[i]}
              color={kpiColors[i]}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold">Ingresos & MRR</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Comparado con el período anterior</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Ingresos</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-400" /> MRR</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueSeries} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
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
                  formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="oklch(0.7 0.146 162.5)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="oklch(0.62 0.13 200)" strokeWidth={2} fill="url(#mrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Live activity */}
          <div className="rounded-2xl bg-surface border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </div>
              <h3 className="text-sm font-semibold">Actividad en vivo</h3>
            </div>
            <div className="space-y-3">
              {activity.slice(0, 6).map(a => (
                <div key={a.id} className="flex gap-3 group">
                  <div className="size-8 rounded-xl bg-primary/10 border border-primary/15 shrink-0 flex items-center justify-center text-[10px] font-bold text-primary">
                    {a.who.split(" ").map(n => n[0]).join("")}
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
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <AIInsightsPanel />

          {/* Goals */}
          <GoalsProgress />

          {/* Conversion funnel */}
          <div className="rounded-2xl bg-surface border border-border p-5">
            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" /> Embudo de conversión
            </h3>
            <div className="space-y-4">
              {funnel.map(f => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{f.stage}</span>
                    <span className="font-mono font-bold">{f.count.toLocaleString()} <span className="text-muted-foreground font-normal">({f.pct}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">Conversión total</div>
              <div className="text-2xl font-extrabold text-primary mt-1">5.62%</div>
              <div className="text-[10px] text-emerald-400 font-mono">+0.8pp vs mes anterior</div>
            </div>
          </div>
        </div>

        {/* Revenue by product bar */}
        <div className="rounded-2xl bg-surface border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold">Descargas por mes</h3>
            <Link to="/dashboard/analytics" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              Ver analytics completos <ChevronRight className="size-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueSeries} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "oklch(0.27 0.006 286 / 0.4)" }}
                contentStyle={{ background: "oklch(0.195 0.005 285.8)", border: "1px solid oklch(0.3 0.006 286)", borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`${v.toLocaleString()}`, "Descargas"]}
              />
              <Bar dataKey="mrr" name="Descargas" fill="oklch(0.7 0.146 162.5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
}
