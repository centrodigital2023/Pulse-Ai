import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { licenseKeys as initial } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/licenses")({
  head: () => ({ meta: [{ title: "License Keys — PULSE AI Dashboard" }] }),
  component: Licenses,
});

function genKey() {
  const block = () => Math.random().toString(36).toUpperCase().slice(2, 6);
  return `PNS-${block()}-${block()}-${block()}-NEW`;
}

function Licenses() {
  const [keys, setKeys] = useState(initial);

  const copy = (k: string) => {
    navigator.clipboard?.writeText(k);
    toast.success("License key copied");
  };

  const generate = () => {
    setKeys((k) => [
      { id: crypto.randomUUID(), key: genKey(), product: "Neural-Kit SDK", customer: "Manual issue", activations: 0, limit: 3, status: "active" as const, type: "professional" as const, expiresAt: "Dec 31, 2025" },
      ...k,
    ]);
    toast.success("New license key generated");
  };

  return (
    <DashboardLayout
      title="License Keys"
      breadcrumb={["Dashboard", "License Keys"]}
      actions={<Button variant="contrast" size="sm" onClick={generate}><Plus className="size-4" /> Generate key</Button>}
    >
      <div className="grid gap-3">
        {keys.map((l) => (
          <div key={l.id} className="rounded-xl bg-surface border border-border p-4 flex flex-wrap items-center gap-4">
            <code className="font-mono text-sm text-primary bg-black/40 border border-border px-3 py-2 rounded flex-1 min-w-[240px]">
              {l.key}
            </code>
            <div className="text-xs text-muted-foreground">
              <div className="text-foreground">{l.product}</div>
              {l.customer}
            </div>
            <div className="text-xs font-mono">
              {l.activations}/{l.limit} <span className="text-muted-foreground">activations</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                l.status === "active" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}
            >
              {l.status.toUpperCase()}
            </span>
            <Button variant="outline" size="sm" onClick={() => copy(l.key)}>
              <Copy className="size-3.5" /> Copy
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-surface border border-border p-6">
        <h3 className="text-sm font-semibold mb-2">Verification API</h3>
        <p className="text-xs text-muted-foreground mb-3">Your software validates keys at startup against this endpoint.</p>
        <code className="block font-mono text-xs bg-black/40 border border-border rounded p-3 text-muted-foreground overflow-x-auto">
          POST https://api.pulseai.io/v2/license/verify {"{ key, product_id, device_id }"}
        </code>
      </div>
    </DashboardLayout>
  );
}
