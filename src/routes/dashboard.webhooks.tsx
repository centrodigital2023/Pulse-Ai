import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { webhookEvents, webhookLog } from "@/lib/mock-data";

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
          <div className="space-y-2">
            {webhookLog.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-md bg-black/20 border border-border px-3 py-2.5">
                <div className="min-w-0">
                  <code className="text-xs font-mono text-foreground">{w.event}</code>
                  <div className="text-[10px] text-muted-foreground truncate">{w.url}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{w.time}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      w.status === "delivered" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {w.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
