import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { metrics, revenueSeries, funnel, activity } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Resumen — PULSE AI Dashboard" }] }),
  component: Overview,
});

function Overview() {
  return (
    <DashboardLayout
      title="Resumen General"
      breadcrumb={["Dashboard", "Resumen"]}
      actions={<Button variant="outline" size="sm">Últimos 30 días</Button>}
    >
      <div className="space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="text-xs font-mono text-muted-foreground mb-1">{m.label}</div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className={`text-[10px] mt-2 ${m.positive ? "text-primary" : "text-destructive"}`}>{m.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gráfica de ingresos */}
          <div className="lg:col-span-2 rounded-xl bg-surface border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold">Ingresos & MRR</h3>
              <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Ingresos</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-2" /> MRR</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueSeries} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.146 162.5)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.7 0.146 162.5)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.195 0.005 285.8)",
                    border: "1px solid oklch(0.3 0.006 286)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "oklch(0.985 0 0)" }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="oklch(0.7 0.146 162.5)" strokeWidth={2} fill="url(#rev)" />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="oklch(0.62 0.13 200)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Actividad en tiempo real */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Actividad en tiempo real</h3>
            <div className="space-y-4">
              {activity.map((a) => (
                <div key={a.id} className="flex gap-3">
                  <div className="size-8 rounded-lg bg-secondary shrink-0 flex items-center justify-center text-[10px] font-mono">
                    {a.who.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs">
                      <span className="font-bold">{a.who}</span> {a.action}{" "}
                      <span className="text-primary">{a.target}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel + descargas */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-6">Embudo de conversión</h3>
            <div className="space-y-4">
              {funnel.map((f) => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{f.stage}</span>
                    <span className="font-mono">{f.count.toLocaleString()} <span className="text-muted-foreground">· {f.pct}%</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-6">Descargas por mes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueSeries} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
                <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "oklch(0.27 0.006 286 / 0.4)" }}
                  contentStyle={{
                    background: "oklch(0.195 0.005 285.8)",
                    border: "1px solid oklch(0.3 0.006 286)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v.toLocaleString()}`, "Descargas"]}
                />
                <Bar dataKey="mrr" name="Descargas" fill="oklch(0.7 0.146 162.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
