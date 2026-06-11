import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  revenueSeries, geographicData, revenueByProduct,
  cohortData, funnel, metrics,
} from "@/lib/mock-data";

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

function Analytics() {
  return (
    <DashboardLayout
      title="Analytics"
      breadcrumb={["Dashboard", "Analytics"]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Últimos 30 días</Button>
          <Button variant="contrast" size="sm">Exportar CSV</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
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
              <h3 className="text-sm font-semibold">Ingresos & MRR</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Ingresos totales y MRR mensual</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: COLORS[1] }} /> MRR</span>
            </div>
          </div>
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
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS[0]} strokeWidth={2} fill="url(#rev)" />
              <Area type="monotone" dataKey="mrr" name="MRR" stroke={COLORS[1]} strokeWidth={2} fill="url(#mrr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue by product */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-6">Ingresos por Producto</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByProduct} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.712 0.013 286)" fontSize={10} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion funnel */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-6">Funnel de Conversión</h3>
            <div className="space-y-4">
              {funnel.map((f, i) => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{f.stage}</span>
                    <span className="font-mono">{f.count.toLocaleString()} <span className="text-muted-foreground">· {f.pct}%</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${f.pct}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Geographic distribution */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Distribución Geográfica</h3>
            <div className="space-y-3">
              {geographicData.map((g) => (
                <div key={g.country} className="flex items-center gap-3">
                  <div className="w-8 text-[10px] font-mono text-muted-foreground shrink-0">{g.code}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="truncate">{g.country}</span>
                      <span className="font-mono shrink-0 ml-2">${g.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground w-8 text-right shrink-0">{g.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cohort retention */}
          <div className="rounded-xl bg-surface border border-border p-6 overflow-x-auto">
            <h3 className="text-sm font-semibold mb-4">Retención por Cohorte</h3>
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr>
                  <th className="text-left text-muted-foreground font-normal pb-3 pr-3">Cohorte</th>
                  {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => (
                    <th key={m} className="text-center text-muted-foreground font-normal pb-3 px-1 min-w-[36px]">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-1">
                {cohortData.map((row) => (
                  <tr key={row.cohort}>
                    <td className="text-muted-foreground pr-3 py-1">{row.cohort}</td>
                    {[row.month0, row.month1, row.month2, row.month3, row.month4, row.month5].map((v, i) => (
                      <td key={i} className="px-1 py-1 text-center">
                        {v > 0 ? (
                          <span
                            className="inline-flex items-center justify-center w-full px-1 py-0.5 rounded text-[10px] font-mono"
                            style={{
                              background: `oklch(0.7 0.146 162.5 / ${v / 100 * 0.4})`,
                              color: v > 50 ? "oklch(0.7 0.146 162.5)" : "oklch(0.712 0.013 286)",
                            }}
                          >
                            {v}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue split pie */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Distribución de Ingresos por Categoría</h3>
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
                  <div className="flex-1 text-sm">{item.name}</div>
                  <div className="font-mono text-sm">${item.revenue.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground w-10 text-right">
                    {((item.revenue / revenueByProduct.reduce((a, b) => a + b.revenue, 0)) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
