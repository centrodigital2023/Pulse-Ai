import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, RefreshCw, ArrowLeft, MessageCircle } from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";

export const Route = createFileRoute("/pago-fallido")({
  head: () => ({
    meta: [
      { title: "Pago no procesado — PULSE AI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagoFallido,
});

const COMMON_REASONS = [
  { icon: "💳", title: "Fondos insuficientes", desc: "Verifica el saldo disponible en tu tarjeta o cuenta." },
  { icon: "🔒", title: "Tarjeta bloqueada", desc: "Puede que tu banco haya bloqueado el pago. Comunícate con tu banco." },
  { icon: "📋", title: "Datos incorrectos", desc: "Verifica el número, fecha de vencimiento y CVV de tu tarjeta." },
  { icon: "🌐", title: "Límite de transacciones", desc: "Algunos bancos limitan pagos internacionales o por internet." },
];

function PagoFallido() {
  return (
    <>
      <SiteNav />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="relative mx-auto size-24 mb-5">
              <div className="absolute inset-0 rounded-full bg-red-500/10 border-2 border-red-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <XCircle className="size-12 text-red-400" />
              </div>
            </div>
            <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">Pago no procesado</div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-2">Algo salió mal</h1>
            <p className="text-muted-foreground text-sm">
              No se realizó ningún cobro. Puedes intentar nuevamente con otro método de pago.
            </p>
          </div>

          {/* Common reasons */}
          <div className="rounded-2xl bg-surface border border-border p-5">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Posibles causas</div>
            <div className="space-y-3">
              {COMMON_REASONS.map(r => (
                <div key={r.title} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{r.icon}</span>
                  <div>
                    <div className="text-sm font-semibold">{r.title}</div>
                    <div className="text-[11px] text-muted-foreground">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              to="/checkout"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <RefreshCw className="size-4" /> Intentar nuevamente
            </Link>
            <a
              href="https://wa.me/573147444715?text=Tuve%20un%20problema%20con%20mi%20pago%20en%20PULSE%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#25D366]/30 bg-[#25D366]/5 text-[#25D366] font-semibold px-5 py-3.5 rounded-xl hover:bg-[#25D366]/10 transition-colors text-sm"
            >
              <MessageCircle className="size-4" /> Hablar con soporte por WhatsApp
            </a>
            <Link
              to="/marketplace"
              className="flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors"
            >
              <ArrowLeft className="size-4" /> Volver al Marketplace
            </Link>
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            También puedes escribirnos a{" "}
            <a href="mailto:centrodigital2023@gmail.com" className="text-primary hover:underline">
              centrodigital2023@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
