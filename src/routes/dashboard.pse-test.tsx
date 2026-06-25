import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Landmark,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Search,
} from "lucide-react";
import { verifyPSEBanks, type PSEVerificationResult } from "@/lib/pse-test.functions";

export const Route = createFileRoute("/dashboard/pse-test")({
  head: () => ({ meta: [{ title: "Verificación PSE — PULSE AI Dashboard" }] }),
  component: PSETest,
});

function PSETest() {
  const verify = useServerFn(verifyPSEBanks);
  const [query, setQuery] = useState("");

  const mutation = useMutation<PSEVerificationResult>({
    mutationFn: () => verify(),
  });

  const result = mutation.data;
  const banks = result?.banks ?? [];
  const filtered = banks.filter((b) =>
    b.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <DashboardLayout
      title="Verificación de pagos PSE"
      breadcrumb={["Dashboard", "Verificación PSE"]}
      actions={
        <Button
          variant="contrast"
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Verificando…
            </>
          ) : (
            <>
              <RefreshCw className="size-4" /> Ejecutar verificación
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-6 max-w-3xl">
        {/* Intro */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Prueba de disponibilidad por banco</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Consulta en vivo a Mercado Pago la lista de bancos habilitados para pagar con
            PSE en tu cuenta. Cada banco se marca como disponible o no disponible según la
            respuesta real de la pasarela. Los compradores pueden pagar como invitados, sin
            registrarse en Mercado Pago.
          </p>
        </div>

        {/* Empty / initial state */}
        {!result && !mutation.isPending && (
          <div className="rounded-xl bg-surface border border-border p-10 text-center">
            <Landmark className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Aún no has ejecutado la verificación.
            </p>
            <Button
              variant="contrast"
              size="sm"
              className="mt-4"
              onClick={() => mutation.mutate()}
            >
              <RefreshCw className="size-4" /> Ejecutar verificación
            </Button>
          </div>
        )}

        {mutation.isPending && (
          <div className="rounded-xl bg-surface border border-border p-10 text-center">
            <Loader2 className="size-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Consultando Mercado Pago…
            </p>
          </div>
        )}

        {mutation.isError && (
          <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5 flex items-start gap-3">
            <XCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-red-300">Error de verificación</div>
              <p className="text-xs text-muted-foreground mt-1">
                No se pudo completar la verificación. Inténtalo de nuevo.
              </p>
            </div>
          </div>
        )}

        {result && (
          <>
            {/* Status summary */}
            <div className="grid sm:grid-cols-3 gap-3">
              <StatusCard
                ok={result.connected}
                label="Conexión Mercado Pago"
                value={result.connected ? "Conectado" : "Sin conexión"}
              />
              <StatusCard
                ok={result.pseEnabled}
                label="PSE habilitado"
                value={result.pseEnabled ? "Activo" : "Inactivo"}
              />
              <StatusCard
                ok={result.total > 0}
                label="Bancos disponibles"
                value={String(result.total)}
              />
            </div>

            {result.message && (
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 flex items-start gap-3">
                <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{result.message}</p>
              </div>
            )}

            {/* Bank list */}
            {banks.length > 0 && (
              <div className="rounded-xl bg-surface border border-border p-5 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-sm font-semibold">Resultado por banco</h3>
                  <div className="relative">
                    <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Buscar banco…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="h-9 pl-8 bg-black/20 w-56"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {filtered.map((bank) => (
                    <div
                      key={bank.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Landmark className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs truncate">{bank.name}</span>
                      </div>
                      {bank.available ? (
                        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20 gap-1 shrink-0">
                          <CheckCircle2 className="size-3" /> Disponible
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1 shrink-0">
                          <XCircle className="size-3" /> No disp.
                        </Badge>
                      )}
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-xs text-muted-foreground col-span-full py-4 text-center">
                      Ningún banco coincide con “{query}”.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatusCard({ ok, label, value }: { ok: boolean; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </div>
      <div className="flex items-center gap-2">
        {ok ? (
          <CheckCircle2 className="size-4 text-emerald-400" />
        ) : (
          <XCircle className="size-4 text-red-400" />
        )}
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
}
