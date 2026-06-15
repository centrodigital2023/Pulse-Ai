import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2, Download, Zap, Mail, Shield, Gift,
  TrendingUp, Star, Copy, ArrowRight,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { useAuth } from "@/lib/auth-context";
import { useConfetti } from "@/components/ui/Confetti";
import { useUserStore } from "@/lib/user-store";
import { toast } from "sonner";

export const Route = createFileRoute("/pago-exitoso")({
  head: () => ({
    meta: [
      { title: "¡Compra Exitosa! — PULSE AI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagoExitoso,
});

function PagoExitoso() {
  const { user } = useAuth();
  const { affiliateCode } = useUserStore();
  const search = useSearch({ strict: false }) as Record<string, string>;
  const isPending = search.status === "pending";
  const burst = useConfetti();
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!isPending) {
      const t = setTimeout(() => burst(), 400);
      const t2 = setTimeout(() => burst(window.innerWidth * 0.25, window.innerHeight * 0.35), 700);
      const t3 = setTimeout(() => burst(window.innerWidth * 0.75, window.innerHeight * 0.35), 1000);
      return () => { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [isPending]);

  const refLink = `https://pulseai.co/marketplace?ref=${affiliateCode || "PULSEAI"}`;

  const shareOnWhatsApp = () => {
    const msg = encodeURIComponent(`🎉 Acabo de comprar un producto digital increíble en PULSE AI. ¡El marketplace digital premium de Colombia! 🔥\n\n👉 ${refLink}`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setShared(true);
    toast.success("¡Compartido en WhatsApp! Ganarás comisión si alguien compra con tu link.");
  };

  const copyRef = () => {
    navigator.clipboard?.writeText(refLink);
    setShared(true);
    toast.success("Link de referido copiado. ¡Compártelo y gana $25.000 por cada amigo!");
  };

  return (
    <>
      <SiteNav />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full space-y-6">

          {/* ─── Hero celebration ─── */}
          <div className="text-center">
            <div className="relative mx-auto size-32 mb-6">
              {/* Outer pulse ring */}
              <div className={`absolute inset-0 rounded-full animate-ping ${isPending ? "bg-yellow-500/20" : "bg-emerald-500/15"}`} style={{ animationDuration: "2s" }} />
              {/* Middle ring */}
              <div className={`absolute inset-2 rounded-full ${isPending ? "bg-yellow-500/10 border-2 border-yellow-500/30" : "bg-emerald-500/10 border-2 border-emerald-500/30"}`} />
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2 className={`size-16 ${isPending ? "text-yellow-400" : "text-emerald-400"}`} />
              </div>
              {/* Sparkle dots */}
              {!isPending && (
                <>
                  <div className="absolute -top-1 -right-1 size-4 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="absolute -bottom-1 -left-1 size-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-1 -left-2 size-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.8s" }} />
                </>
              )}
            </div>

            <div className={`text-xs font-mono uppercase tracking-widest mb-2 ${isPending ? "text-yellow-400" : "text-emerald-400"}`}>
              {isPending ? "Pago en proceso" : "¡Pago aprobado! ✓"}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              {isPending ? "¡Pago recibido!" : "¡Bienvenido al club! 🚀"}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {isPending
                ? "Tu pago está siendo procesado. Te notificaremos en máximo 2 horas cuando se confirme."
                : `Acceso activado y factura enviada a ${user?.email || "tu email"}.`
              }
            </p>
          </div>

          {/* ─── Status card ─── */}
          <div className={`rounded-2xl border p-5 space-y-3 ${isPending ? "bg-yellow-500/5 border-yellow-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
            {[
              { label: "Estado", value: isPending ? "⏳ Pendiente de confirmación" : "✅ Aprobado y activo", hi: !isPending },
              { label: "Plataforma", value: "Mercado Pago · Cifrado SSL", hi: false },
              { label: "Garantía", value: "30 días — devolución sin preguntas", hi: false },
              { label: "Acceso", value: "Inmediato · Biblioteca personal", hi: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={item.hi ? "text-emerald-400 font-bold" : "font-medium"}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* ─── What happens next ─── */}
          {!isPending && (
            <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
              <div className="text-sm font-bold">¿Qué sigue?</div>
              {[
                { icon: <Mail className="size-4 text-primary shrink-0" />, text: "Revisa tu email — el acceso y la factura están en tu bandeja." },
                { icon: <Download className="size-4 text-emerald-400 shrink-0" />, text: "Descarga en cualquier momento desde Mi Biblioteca." },
                { icon: <Shield className="size-4 text-yellow-400 shrink-0" />, text: "30 días de garantía. Si algo no funciona, devolvemos el dinero sin preguntas." },
                { icon: <Star className="size-4 text-orange-400 shrink-0" />, text: "Deja tu reseña y sube de nivel en el sistema de lealtad PULSE AI." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* ─── VIRAL referral block ─── */}
          {!isPending && (
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="size-5 text-primary" />
                <div className="text-sm font-bold text-primary">Gana $25.000 COP por cada amigo que compre</div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Comparte tu experiencia y tu link único. Cada vez que alguien compre con tu referido, recibes $25.000 en crédito.</p>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 mb-3">
                <span className="text-xs font-mono text-muted-foreground flex-1 truncate">{refLink}</span>
                <button onClick={copyRef} className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
                  <Copy className="size-3.5" /> Copiar
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={shareOnWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#25D366]/90 transition-colors"
                >
                  <TrendingUp className="size-4" /> WhatsApp
                </button>
                <button
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔥 Acabo de comprar en PULSE AI — el mejor marketplace digital de Latinoamérica. ¡Te lo recomiendo! 👉 ${refLink}`)}`, "_blank");
                    setShared(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-black/80 transition-colors"
                >
                  <span className="font-bold">𝕏</span> Twitter
                </button>
              </div>
              {shared && (
                <p className="text-center text-xs text-emerald-400 mt-3 font-medium">
                  ¡Gracias por compartir! Tu comisión se acredita automáticamente 💚
                </p>
              )}
            </div>
          )}

          {/* ─── CTAs ─── */}
          <div className="flex flex-col gap-3">
            <Link
              to="/mis-compras"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/25"
            >
              <Zap className="size-4" /> Ir a Mis Compras → Descargar ahora
            </Link>
            <Link
              to="/library"
              className="flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors"
            >
              <Download className="size-4" /> Mi Biblioteca Digital
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
            >
              <ArrowRight className="size-4" /> Seguir explorando el marketplace
            </Link>
          </div>

          {/* ─── Support ─── */}
          <p className="text-center text-[11px] text-muted-foreground">
            ¿Tienes dudas?{" "}
            <a href="https://wa.me/573147444715" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp</a>
            {" "}·{" "}
            <a href="mailto:centrodigital2023@gmail.com" className="text-primary hover:underline">Email</a>
            {" "}· Respuesta en menos de 2 horas
          </p>
        </div>
      </div>
    </>
  );
}
