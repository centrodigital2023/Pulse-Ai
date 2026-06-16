import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { automationFlows } from "@/lib/mock-data";
import { Zap, Mail, Clock, GitBranch, Tag, Webhook, Plus, Play, Pause, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/automation")({
  head: () => ({ meta: [{ title: "Automatización — PULSE AI Dashboard" }] }),
  component: Automation,
});

const stepIcon = {
  email: Mail,
  wait: Clock,
  condition: GitBranch,
  tag: Tag,
  webhook: Webhook,
} as const;

const stepColor = {
  email: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  wait: "text-muted-foreground bg-secondary border-border",
  condition: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  tag: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  webhook: "text-orange-400 bg-orange-400/10 border-orange-400/20",
} as const;

function Automation() {
  const [selected, setSelected] = useState(automationFlows[0]?.id ?? "");
  const flow = automationFlows.find((f) => f.id === selected);

  const toggle = () => {
    if (!flow) return;
    toast.success(flow.status === "active" ? "Flujo pausado" : "Flujo activado");
  };

  if (automationFlows.length === 0 || !flow) {
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
        <div className="rounded-xl bg-surface border border-border p-12 text-center">
          <Zap className="size-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aún no tienes flujos de automatización</h3>
          <p className="text-sm text-muted-foreground mb-4">Crea secuencias de emails, esperas y condiciones para automatizar tu marketing.</p>
          <Button variant="contrast" onClick={() => toast.success("Nuevo flujo creado")}>
            <Plus className="size-4" /> Crear mi primer flujo
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* Flow list */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Flujos de Automatización</div>
          {automationFlows.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelected(f.id)}
              className={`w-full p-4 rounded-xl border text-left transition-colors ${
                f.id === selected ? "bg-primary/10 border-primary/30" : "bg-surface border-border hover:border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-sm font-medium">{f.name}</div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono shrink-0 ${
                  f.status === "active" ? "bg-primary/20 text-primary" :
                  f.status === "paused" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {f.status.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mb-2">Trigger: {f.trigger}</div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="size-3" /> {f.enrolled}</span>
                <span className="flex items-center gap-1"><TrendingUp className="size-3" /> {f.enrolled > 0 ? `${Math.round((f.completed / f.enrolled) * 100)}%` : "—"}</span>
                {f.revenue > 0 && <span className="text-primary">${f.revenue.toLocaleString()}</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Flow detail */}
        <div className="space-y-4">
          <div className="rounded-xl bg-surface border border-border p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-lg">{flow.name}</h2>
                <div className="text-xs text-muted-foreground mt-1">
                  Trigger: <span className="font-mono text-primary">{flow.trigger}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={toggle}>
                  {flow.status === "active" ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Activar</>}
                </Button>
                <Button variant="contrast" size="sm" onClick={() => toast.success("Cambios guardados")}>
                  Guardar
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Inscritos", value: flow.enrolled.toLocaleString() },
                { label: "Completados", value: flow.completed.toLocaleString() },
                { label: "Ingresos", value: flow.revenue > 0 ? `$${flow.revenue.toLocaleString()}` : "—" },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-black/20 border border-border text-center">
                  <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label.toUpperCase()}</div>
                  <div className="font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Flow steps */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-px before:bg-border">
              {flow.steps.map((step, i) => {
                const Icon = stepIcon[step.kind];
                return (
                  <div key={step.id} className="relative group">
                    <div className={`absolute -left-6 top-3 size-5 rounded border flex items-center justify-center ${stepColor[step.kind]}`}>
                      <Icon className="size-3" />
                    </div>
                    <div className="bg-surface border border-border rounded-lg p-4 hover:border-primary/20 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{step.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{step.meta}</div>
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                          Paso {i + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add step button */}
              <div className="relative">
                <div className="absolute -left-6 top-3 size-5 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <Plus className="size-3 text-muted-foreground/50" />
                </div>
                <button
                  onClick={() => toast("Selector de paso (demo)")}
                  className="w-full border border-dashed border-border rounded-lg p-4 text-left text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  + Agregar paso al flujo
                </button>
              </div>
            </div>
          </div>

          {/* Trigger selector */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-3">Trigger del Flujo</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["order.created", "course.completed", "subscription.created", "license.activated", "affiliate.conversion", "subscription.at_risk"].map((t) => (
                <div
                  key={t}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors text-[11px] font-mono ${
                    t === flow.trigger ? "bg-primary/10 border-primary/30 text-primary" : "bg-black/20 border-border text-muted-foreground hover:border-primary/20"
                  }`}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
