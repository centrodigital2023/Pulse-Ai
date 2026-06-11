import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/email")({
  head: () => ({ meta: [{ title: "Flujos de Email — PULSE AI Dashboard" }] }),
  component: EmailFlows,
});

const flow = [
  { day: "Día 0", title: "Recibo de compra", desc: "Enviado al instante con enlaces de descarga y clave de licencia." },
  { day: "Día 1", title: "Cómo leer la guía PDF", desc: "Recorrido por la documentación incluida en el producto." },
  { day: "Día 3", title: "Ve los módulos de video", desc: "Recordatorio para comenzar el curso." },
  { day: "Día 7", title: "¿Necesitas ayuda?", desc: "Oferta de soporte + invitación al canal de Discord." },
];

function EmailFlows() {
  return (
    <DashboardLayout
      title="Flujos de Email"
      breadcrumb={["Dashboard", "Flujos de Email"]}
      actions={<Button variant="contrast" size="sm" onClick={() => toast.success("Flujo activado")}>Activar flujo</Button>}
    >
      <div className="rounded-xl bg-surface border border-border p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Automatización post-compra</h3>
        </div>
        <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {flow.map((f) => (
            <div key={f.day} className="relative">
              <span className="absolute -left-6 top-1 size-3.5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                <span className="size-1.5 rounded-full bg-primary" />
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase mb-1">
                <Clock className="size-3" /> {f.day}
              </div>
              <div className="text-sm font-medium">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
