import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, Link, Copy, Plus, Inbox } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/affiliates")({
  head: () => ({ meta: [{ title: "Afiliados — PULSE AI Dashboard" }] }),
  component: Affiliates,
});

function Affiliates() {
  const { user } = useAuth();
  const handle = user?.email?.split("@")[0] ?? "tu-usuario";
  const refLink = `https://pulseai.co/ref/${handle}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(refLink);
    toast.success("Enlace de afiliado copiado");
  };

  return (
    <DashboardLayout
      title="Centro de Afiliados"
      breadcrumb={["Dashboard", "Afiliados"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.info("Invita afiliados compartiendo tu enlace")}>
          <Plus className="size-4" /> Invitar afiliado
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats — start at zero, grow with real data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "AFILIADOS ACTIVOS", value: "0", delta: "Invita a tu primer afiliado" },
            { icon: TrendingUp, label: "CONVERSIONES", value: "0", delta: "Sin conversiones aún" },
            { icon: DollarSign, label: "INGRESOS REFERIDOS", value: "$0", delta: "Activa afiliados y escala" },
            { icon: DollarSign, label: "COMISIONES PENDIENTES", value: "$0", delta: "Los pagos son cada 15 días" },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="size-3.5 text-muted-foreground" />
                <div className="text-xs font-mono text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="text-[10px] mt-1 text-muted-foreground">{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Referral link — always real and functional */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Tu Enlace de Afiliado</h3>
          </div>
          <div className="flex gap-3">
            <code className="flex-1 bg-black/50 border border-border px-4 py-3 rounded font-mono text-sm text-primary truncate">
              {refLink}
            </code>
            <Button variant="secondary" onClick={copyLink}>
              <Copy className="size-3.5" /> Copiar
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Ganas comisión por cada compra generada con tu enlace. Los pagos se acreditan automáticamente cada 15 días.
          </p>
        </div>

        {/* Commission rates */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Estructura de Comisiones</h3>
          <div className="space-y-3">
            {[
              { label: "Software & SaaS", pct: 30, color: "bg-blue-500" },
              { label: "Cursos & Educación", pct: 35, color: "bg-primary" },
              { label: "Templates & Recursos", pct: 40, color: "bg-emerald-500" },
              { label: "eBooks & Guías", pct: 35, color: "bg-purple-500" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-primary">{item.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliates table — empty state */}
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Mis Afiliados</h3>
            <span className="text-xs text-muted-foreground">0 afiliados</span>
          </div>
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-6">
            <div className="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Inbox className="size-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold">Aún no tienes afiliados</div>
              <div className="text-xs text-muted-foreground mt-1 max-w-sm">
                Comparte tu enlace de afiliado con creadores de contenido, influencers o cualquier persona que quiera ganar comisión vendiendo tus productos.
              </div>
            </div>
            <Button variant="contrast" size="sm" className="mt-2" onClick={copyLink}>
              <Copy className="size-4" /> Copiar enlace de afiliado
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
