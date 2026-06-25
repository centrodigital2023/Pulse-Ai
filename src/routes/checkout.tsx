import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/user-store";
import {
  Shield, Lock, Check, CreditCard, Smartphone, Globe,
  ArrowLeft, Zap, CheckCircle2, Banknote,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pagar de forma segura — PULSE AI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function fmtCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

// Métodos que Mercado Pago ofrece en su checkout (solo informativo aquí).
const PAY_METHODS = [
  { icon: <CreditCard className="size-4" />, label: "Tarjetas", color: "text-primary" },
  { icon: <Globe className="size-4" />, label: "PSE", color: "text-blue-400" },
  { icon: <Smartphone className="size-4" />, label: "Nequi", color: "text-purple-400" },
  { icon: <Smartphone className="size-4" />, label: "Daviplata", color: "text-red-400" },
  { icon: <Banknote className="size-4" />, label: "Efecty", color: "text-yellow-400" },
];

function Checkout() {
  const { user } = useAuth();
  const { pendingCheckoutItems, addOrder, clearCart } = useUserStore();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(!user);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"payment" | "done">("payment");

  const checkoutItems = pendingCheckoutItems;
  const total = checkoutItems.reduce((sum, i) => sum + i.price, 0);

  // Redirect if cart is empty (and not on the success screen)
  useEffect(() => {
    if (checkoutItems.length === 0 && step === "payment") {
      navigate({ to: "/marketplace" });
    }
  }, [checkoutItems.length, step, navigate]);

  const handlePay = async () => {
    if (checkoutItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/mp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          planId: checkoutItems[0]?.id,
          price: total,
          planName: checkoutItems[0]?.name ?? "",
          userEmail: user?.email,
          items: checkoutItems.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            image: i.image,
            vendor: i.vendor,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.initPoint) {
          // Redirect directly to Mercado Pago hosted checkout (one step).
          window.location.href = data.initPoint;
          return;
        }
      }

      // Demo mode (no MP token configured): simulate success.
      addOrder({
        items: checkoutItems,
        subtotal: total,
        discount: 0,
        creditUsed: 0,
        total,
        status: "completed",
        paymentMethod: "Mercado Pago",
      });
      clearCart();
      setStep("done");
      setSuccess(true);
    } catch {
      toast.error("No pudimos iniciar el pago. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (success && step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative mx-auto size-28">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="size-14 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">Pago aprobado</div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">¡Compra exitosa!</h1>
            <p className="text-muted-foreground text-sm">
              Activamos tu acceso y enviamos los detalles a{" "}
              <span className="text-foreground font-medium">{user?.email || "tu email"}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/mis-compras"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3.5 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Zap className="size-4" /> Ir a Mis Compras
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors"
            >
              <ArrowLeft className="size-4" /> Seguir explorando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuth && !user && (
        <AuthModal
          onClose={() => { setShowAuth(false); if (!user) navigate({ to: "/marketplace" }); }}
          defaultTab="register"
          onSuccess={() => setShowAuth(false)}
        />
      )}

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <Link to="/marketplace"><Logo /></Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-emerald-400" />
            <span className="hidden sm:block">Pago 100% seguro</span>
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 space-y-5">
          {/* Back link */}
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3.5" /> Volver a la tienda
          </Link>

          {/* Order summary */}
          <div className="rounded-2xl bg-surface border border-border p-5">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Tu pedido</div>
            <div className="space-y-3 pb-4 border-b border-border max-h-64 overflow-y-auto">
              {checkoutItems.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <img
                    src={item.image} alt={item.name}
                    className="size-14 rounded-xl object-cover border border-border shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-tight line-clamp-2">{item.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.vendor}</div>
                  </div>
                  <div className="text-sm font-bold text-primary shrink-0">{fmtCOP(item.price)}</div>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-between items-center">
              <span className="font-bold">Total <span className="text-[10px] font-normal text-muted-foreground">COP</span></span>
              <div className="text-2xl font-extrabold tracking-tight">{fmtCOP(total)}</div>
            </div>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all font-extrabold text-primary-foreground text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 disabled:opacity-60"
          >
            {loading ? (
              <div className="size-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="size-5" />
                Pagar {fmtCOP(total)}
              </>
            )}
          </button>

          {/* No-account note */}
          <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3 flex items-start gap-2.5">
            <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-300 leading-relaxed">
              <strong>No necesitas crear una cuenta en Mercado Pago.</strong> Elige tarjeta, PSE, Nequi, Daviplata o Efecty en la siguiente pantalla y paga como invitado.
            </p>
          </div>

          {/* Available methods */}
          <div className="rounded-xl border border-border p-4">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 text-center">Métodos disponibles</div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {PAY_METHODS.map(m => (
                <div key={m.label} className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1.5 bg-surface">
                  <span className={m.color}>{m.icon}</span>
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
            {[
              { icon: <Shield className="size-3.5 text-emerald-400" />, label: "Garantía 7 días" },
              { icon: <Lock className="size-3.5 text-primary" />, label: "SSL 256-bit" },
              { icon: <Globe className="size-3.5 text-[#009EE3]" />, label: "Mercado Pago · PCI DSS" },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {t.icon} {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
