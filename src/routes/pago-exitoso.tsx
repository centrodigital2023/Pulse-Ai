import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Download, Zap, ArrowLeft, Mail, Shield } from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/pago-exitoso")({
  head: () => ({
    meta: [
      { title: "¡Pago Aprobado! — PULSE AI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagoExitoso,
});

function PagoExitoso() {
  const { user } = useAuth();
  const search = useSearch({ strict: false }) as Record<string, string>;
  const isPending = search.status === "pending";

  return (
    <>
      <SiteNav />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-8">
          {/* Icon */}
          <div className="text-center">
            <div className="relative mx-auto size-28 mb-6">
              <div className={`absolute inset-0 rounded-full ${isPending ? "bg-yellow-500/10 border-2 border-yellow-500/30" : "bg-emerald-500/10 border-2 border-emerald-500/30"} animate-pulse`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2 className={`size-14 ${isPending ? "text-yellow-400" : "text-emerald-400"}`} />
              </div>
            </div>
            <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isPending ? "text-yellow-400" : "text-emerald-400"}`}>
              {isPending ? "Pago en proceso" : "Pago aprobado ✓"}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">
              {isPending ? "¡Pago recibido!" : "¡Compra exitosa!"}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isPending
                ? "Tu pago está siendo procesado. Te notificaremos en máximo 2 horas cuando se confirme."
                : `Hemos activado tu acceso y enviado los detalles a ${user?.email || "tu email"}.`
              }
            </p>
          </div>

          {/* Details */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Detalles de la compra</div>
            <div className="space-y-2">
              {[
                { label: "Estado", value: isPending ? "⏳ Pendiente de confirmación" : "✅ Aprobado", highlight: !isPending },
                { label: "Plataforma", value: "Mercado Pago", highlight: false },
                { label: "Garantía", value: "7 días — devolución sin preguntas", highlight: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={item.highlight ? "text-emerald-400 font-semibold" : "font-medium"}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's next */}
          {!isPending && (
            <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
              <div className="text-sm font-bold">¿Qué sigue ahora?</div>
              <div className="space-y-3">
                {[
                  { icon: <Mail className="size-4 text-primary" />, text: "Revisa tu email — el acceso y la factura ya están en tu bandeja." },
                  { icon: <Download className="size-4 text-emerald-400" />, text: "En Mis Compras puedes descargar todos tus productos en cualquier momento." },
                  { icon: <Shield className="size-4 text-yellow-400" />, text: "Tienes 7 días de garantía total. Si algo no funciona, te devolvemos el dinero." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="shrink-0 mt-0.5">{item.icon}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              to="/mis-compras"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <Zap className="size-4" /> Ir a Mis Compras
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors"
            >
              <ArrowLeft className="size-4" /> Volver al Marketplace
            </Link>
          </div>

          {/* Support */}
          <p className="text-center text-[11px] text-muted-foreground">
            ¿Tienes dudas?{" "}
            <a href="https://wa.me/573147444715" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Escríbenos por WhatsApp
            </a>
            {" "}o a{" "}
            <a href="mailto:centrodigital2023@gmail.com" className="text-primary hover:underline">
              centrodigital2023@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
