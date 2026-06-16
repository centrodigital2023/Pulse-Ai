import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Zap, Mail, Clock, GitBranch, Tag, Webhook, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/automation")({
  head: () => ({ meta: [{ title: "Automatización — PULSE AI Dashboard" }] }),
  component: Automation,
});

const flowTypes = [
  { icon: Mail, label: "Email de bienvenida", desc: "Envía un email al instante cuando alguien compra.", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  { icon: Clock, label: "Secuencia drip", desc: "Serie de emails espaciados en el tiempo para onboarding.", color: "text-muted-foreground bg-secondary border-border" },
  { icon: GitBranch, label: "Flujo condicional", desc: "Bifurca el flujo según el comportamiento del usuario.", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  { icon: Tag, label: "Etiquetado automático", desc: "Agrupa clientes por comportamiento y segmento.", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  { icon: Webhook, label: "Webhook trigger", desc: "Dispara acciones en sistemas externos al ocurrir un evento.", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
];

function Automation() {
  return (
    <DashboardLayout
      title="Automatización de Marketing"
      breadcrumb={["Dashboard", "Automatización"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.success("Nuevo flujo creado")}>
          <Plus className="size-4" /> Nuevo flujo
        </Button>
      }
    >
      <div className="space-y-6">

        {/* Empty state hero */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-10 flex flex-col items-center text-center gap-4">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="size-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-1">Sin flujos de automatización aún</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Crea tu primer flujo automático y deja que PULSE AI envíe emails, segmente clientes y ejecute acciones sin que tengas que hacer nada.
            </p>
          </div>
          <Button variant="contrast" onClick={() => toast.success("¡Flujo creado! Configura los pasos en el editor.")}>
            <Plus className="size-4" /> Crear mi primer flujo
          </Button>
        </div>

        {/* Available flow templates */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Tipos de automatización disponibles</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flowTypes.map(ft => (
              <div
                key={ft.label}
                className="rounded-xl bg-surface border border-border p-5 hover:border-primary/30 transition-colors cursor-pointer group"
                onClick={() => toast.success(`Plantilla "${ft.label}" lista — configura los pasos`)}
              >
                <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono mb-3 ${ft.color}`}>
                  <ft.icon className="size-3.5" />
                  {ft.label}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{ft.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">¿Cómo funciona?</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Define el trigger", desc: "Elige qué evento inicia el flujo: compra, registro, abandono de carrito, etc." },
              { n: "2", title: "Configura los pasos", desc: "Arrastra emails, esperas, condiciones y webhooks en el editor visual." },
              { n: "3", title: "Activa y mide", desc: "El flujo corre automáticamente. Ve tasas de apertura, clicks y conversiones en tiempo real." },
            ].map(s => (
              <div key={s.n} className="flex gap-3">
                <div className="size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {s.n}
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">{s.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
