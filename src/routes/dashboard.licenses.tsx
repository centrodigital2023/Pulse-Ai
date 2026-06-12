import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, Plus, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useMyLicenses, useCreateLicense } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/licenses")({
  head: () => ({ meta: [{ title: "Claves de Licencia — PULSE AI Dashboard" }] }),
  component: Licenses,
});

function Licenses() {
  const { user } = useAuth();
  const { data: keys, isLoading } = useMyLicenses();
  const createLicense = useCreateLicense();

  const copy = (k: string) => {
    navigator.clipboard?.writeText(k);
    toast.success("Clave copiada al portapapeles");
  };

  const generate = async () => {
    try {
      await createLicense.mutateAsync({ product_name: "Emisión manual" });
      toast.success("Nueva clave de licencia generada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo generar la clave");
    }
  };

  return (
    <DashboardLayout
      title="Claves de Licencia"
      breadcrumb={["Dashboard", "Claves de Licencia"]}
      actions={<Button variant="contrast" size="sm" disabled={createLicense.isPending} onClick={generate}><Plus className="size-4" /> Generar clave</Button>}
    >
      {!user ? (
        <div className="rounded-xl bg-surface border border-border p-12 text-center text-sm text-muted-foreground">
          Inicia sesión para gestionar tus claves de licencia.
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : !keys || keys.length === 0 ? (
        <div className="rounded-xl bg-surface border border-border p-12 text-center text-sm text-muted-foreground">
          Aún no has generado claves de licencia.
        </div>
      ) : (
        <div className="grid gap-3">
          {keys.map((l) => (
            <div key={l.id} className="rounded-xl bg-surface border border-border p-4 flex flex-wrap items-center gap-4">
              <code className="font-mono text-sm text-primary bg-black/40 border border-border px-3 py-2 rounded flex-1 min-w-[240px]">
                {l.key}
              </code>
              <div className="text-xs text-muted-foreground">
                <div className="text-foreground">{l.product_name}</div>
                {l.customer_name}
              </div>
              <div className="text-xs font-mono">
                {l.activations}/{l.activation_limit} <span className="text-muted-foreground">activaciones</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  l.status === "active" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                {l.status.toUpperCase()}
              </span>
              <Button variant="outline" size="sm" onClick={() => copy(l.key)}>
                <Copy className="size-3.5" /> Copiar
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl bg-surface border border-border p-6">
        <h3 className="text-sm font-semibold mb-2">API de Verificación</h3>
        <p className="text-xs text-muted-foreground mb-3">Tu software valida las claves al iniciar contra este endpoint.</p>
        <code className="block font-mono text-xs bg-black/40 border border-border rounded p-3 text-muted-foreground overflow-x-auto">
          POST https://api.pulseai.io/v2/license/verify {"{ key, product_id, device_id }"}
        </code>
      </div>
    </DashboardLayout>
  );
}
