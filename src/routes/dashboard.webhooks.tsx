import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { webhookEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/webhooks")({
  head: () => ({ meta: [{ title: "Webhooks — PULSE AI Dashboard" }] }),
  component: Webhooks,
});

function Webhooks() {
  return (
    <DashboardLayout title="Webhooks" breadcrumb={["Dashboard", "Webhooks"]}>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
          <h3 className="text-sm font-semibold">Endpoint</h3>
          <div className="space-y-2">
            <Label htmlFor="url">URL de destino</Label>
            <Input id="url" placeholder="https://api.tuapp.dev/pulse" defaultValue="https://api.acme.dev/pulse" />
          </div>
          <div className="space-y-2">
            <Label>Eventos suscritos</Label>
            <div className="space-y-2">
              {webhookEvents.map((e) => (
                <div key={e} className="flex items-center justify-between rounded-md bg-black/20 border border-border px-3 py-2">
                  <code className="text-xs font-mono">{e}</code>
                  <Switch defaultChecked={e !== "order.refunded"} />
                </div>
              ))}
            </div>
          </div>
          <Button variant="contrast" size="sm" onClick={() => toast.success("Endpoint guardado")}>Guardar endpoint</Button>
        </div>

        <div className="rounded-xl bg-surface border border-border p-6">
          <h3 className="text-sm font-semibold mb-4">Entregas recientes</h3>
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center text-muted-foreground">
            <code className="text-[11px] font-mono bg-black/20 border border-border rounded px-3 py-1.5">Sin entregas aún</code>
            <p className="text-xs max-w-[220px]">Cada vez que un evento ocurra, el log aparecerá aquí con el estado HTTP de la entrega.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
