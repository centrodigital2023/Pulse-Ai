import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { affiliates, affiliateCommissionSeries } from "@/lib/mock-data";
import { TrendingUp, DollarSign, Users, Link, Copy, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/affiliates")({
  head: () => ({ meta: [{ title: "Afiliados — PULSE AI Dashboard" }] }),
  component: Affiliates,
});

const tooltipStyle = {
  background: "oklch(0.195 0.005 285.8)",
  border: "1px solid oklch(0.3 0.006 286)",
  borderRadius: 8,
  fontSize: 12,
};

const totalCommissions = affiliates.reduce((a, b) => a + b.commission, 0);
const totalRevenue = affiliates.reduce((a, b) => a + b.revenue, 0);
const totalConversions = affiliates.reduce((a, b) => a + b.conversions, 0);
const totalPending = affiliates.reduce((a, b) => a + b.pending, 0);

function Affiliates() {
  const copyLink = (handle: string) => {
    navigator.clipboard?.writeText(`https://pulseai.io/ref/${handle}`);
    toast.success("Enlace copiado al portapapeles");
  };

  return (
    <DashboardLayout
      title="Centro de Afiliados"
      breadcrumb={["Dashboard", "Afiliados"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.success("Invitación enviada")}>
          <Plus className="size-4" /> Invitar afiliado
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "AFILIADOS ACTIVOS", value: affiliates.filter(a => a.status === "active").length.toString(), delta: "+2 este mes", positive: true },
            { icon: TrendingUp, label: "CONVERSIONES", value: totalConversions.toLocaleString(), delta: "+18% vs mes anterior", positive: true },
            { icon: DollarSign, label: "INGRESOS REFERIDOS", value: `$${totalRevenue.toLocaleString()}`, delta: "desde afiliados", positive: true },
            { icon: DollarSign, label: "COMISIONES PENDIENTES", value: `$${totalPending.toLocaleString()}`, delta: "próximo pago: Jul 1", positive: false },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="size-3.5 text-muted-foreground" />
                <div className="text-xs font-mono text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className={`text-[10px] mt-1 ${m.positive ? "text-primary" : "text-muted-foreground"}`}>{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Commission chart */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold">Comisiones Pagadas vs Pendientes</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Total acumulado: ${totalCommissions.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Pagadas</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-2" /> Pendientes</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={affiliateCommissionSeries} margin={{ left: -10, right: 0, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.006 286)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.712 0.013 286)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
              <Bar dataKey="paid" name="Pagadas" stackId="a" fill="oklch(0.7 0.146 162.5)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" name="Pendientes" stackId="a" fill="oklch(0.62 0.13 200)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Affiliates table */}
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Afiliados</h3>
            <span className="text-xs text-muted-foreground">{affiliates.length} afiliados</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-black/10">
                  <th className="text-left p-4 text-xs font-mono text-muted-foreground">AFILIADO</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">REFERENCIAS</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">CONVERSIONES</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">INGRESOS</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">COMISIÓN</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">TASA</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">ESTADO</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a) => (
                  <tr key={a.id} className="border-b border-border hover:bg-black/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono">
                          {a.initials}
                        </div>
                        <div>
                          <div className="font-medium">{a.name}</div>
                          <div className="text-[10px] text-muted-foreground">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-xs">{a.referrals.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-xs">{a.conversions}</td>
                    <td className="p-4 text-right font-mono text-xs">${a.revenue.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-xs text-primary">${a.commission.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-xs">{a.rate}%</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        a.status === "active" ? "bg-primary/20 text-primary" :
                        a.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copyLink(a.email.split("@")[0])}>
                        <Copy className="size-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral link generator */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Tu Enlace de Referidos</h3>
          </div>
          <div className="flex gap-3">
            <code className="flex-1 bg-black/50 border border-border px-4 py-3 rounded font-mono text-sm text-primary">
              https://pulseai.io/ref/tu-usuario
            </code>
            <Button variant="secondary" onClick={() => { navigator.clipboard?.writeText("https://pulseai.io/ref/tu-usuario"); toast.success("Enlace copiado"); }}>
              <Copy className="size-3.5" /> Copiar
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Ganas una comisión del 20% en cada venta durante los primeros 12 meses del cliente referido.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
