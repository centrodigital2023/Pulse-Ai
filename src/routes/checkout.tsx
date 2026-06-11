import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Check, CreditCard, Smartphone, Globe, Plus, Star } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — PULSE AI" }] }),
  component: Checkout,
});

const product = {
  name: "Complete AI Engineering Masterclass",
  price: 299,
  description: "40 videos HD · Código fuente · Certificado · Licencia profesional",
  rating: 5.0,
  reviews: 211,
};

const orderBumps = [
  { id: "ob1", name: "Neural-Kit SDK", desc: "El toolkit de ML que necesitas para poner en práctica lo aprendido", price: 99, originalPrice: 149 },
  { id: "ob2", name: "1:1 Mentorship Session (60 min)", desc: "Sesión privada con el instructor para acelerar tu aprendizaje", price: 79, originalPrice: 129 },
];

const paymentMethods = [
  { id: "card", label: "Tarjeta de crédito / débito", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Globe },
  { id: "apple", label: "Apple Pay", icon: Smartphone },
  { id: "mercadopago", label: "Mercado Pago", icon: Globe },
];

function Checkout() {
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleBump = (id: string) =>
    setSelectedBumps((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const bumpsTotal = orderBumps.filter(b => selectedBumps.includes(b.id)).reduce((a, b) => a + b.price, 0);
  const total = product.price + bumpsTotal;

  const handlePurchase = () => {
    if (!email) { toast.error("Ingresa tu email para continuar"); return; }
    setLoading(true);
    setTimeout(() => {
      toast.success("¡Compra exitosa! Revisa tu email para acceder a tu biblioteca.");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <Logo />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 text-primary" />
          <span>Pago seguro con SSL</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Left: Form */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h2 className="font-bold text-lg">Información de contacto</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Alex Rivera" className="bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input placeholder="Rivera" className="bg-black/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="alex@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/20"
              />
              <p className="text-[10px] text-muted-foreground">Recibirás el acceso en este email</p>
            </div>
          </div>

          {/* Order Bumps */}
          <div className="rounded-xl bg-surface border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-primary/5">
              <div className="text-xs font-mono text-primary uppercase tracking-widest">Oferta Especial — Solo con esta compra</div>
            </div>
            <div className="divide-y divide-border">
              {orderBumps.map((bump) => (
                <div
                  key={bump.id}
                  onClick={() => toggleBump(bump.id)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors ${
                    selectedBumps.includes(bump.id) ? "bg-primary/5" : "hover:bg-black/5"
                  }`}
                >
                  <div className={`size-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    selectedBumps.includes(bump.id) ? "bg-primary border-primary" : "border-border bg-black/20"
                  }`}>
                    {selectedBumps.includes(bump.id) && <Check className="size-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{bump.name}</span>
                      <span className="text-[10px] text-muted-foreground line-through">${bump.originalPrice}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{bump.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-primary">+${bump.price}</div>
                    <div className="text-[10px] text-primary">
                      Ahorra ${bump.originalPrice - bump.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h2 className="font-bold">Método de pago</h2>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-colors ${
                    paymentMethod === pm.id
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-black/20 border-border text-muted-foreground hover:border-primary/20"
                  }`}
                >
                  <pm.icon className="size-4 shrink-0" />
                  {pm.label}
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Número de tarjeta</Label>
                  <Input placeholder="1234 5678 9012 3456" className="bg-black/20 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Vencimiento</Label>
                    <Input placeholder="MM/AA" className="bg-black/20 font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input placeholder="123" className="bg-black/20 font-mono" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nombre en la tarjeta</Label>
                  <Input placeholder="ALEX RIVERA" className="bg-black/20" />
                </div>
              </div>
            )}

            {paymentMethod === "mercadopago" && (
              <div className="p-4 rounded-lg bg-black/20 border border-border text-center">
                <p className="text-sm text-muted-foreground mb-3">Serás redirigido a Mercado Pago para completar el pago.</p>
                <p className="text-xs text-muted-foreground">PSE · Nequi · Daviplata · Efectivo</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <Button
            variant="contrast"
            size="lg"
            className="w-full text-base font-bold"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? "Procesando..." : `Completar compra — $${total}`}
          </Button>

          <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground">
            {[
              { icon: Shield, label: "Garantía 30 días" },
              { icon: Lock, label: "Pago seguro SSL" },
              { icon: Globe, label: "Acceso inmediato" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1.5">
                <t.icon className="size-3.5 text-primary" />
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-xl bg-surface border border-border p-6">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Resumen del pedido</div>

            {/* Product */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-lg font-bold shrink-0">
                AI
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{product.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{product.description}</div>
                <div className="flex items-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-primary text-primary" />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-1">({product.reviews} reseñas)</span>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 py-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{product.name}</span>
                <span className="font-mono">${product.price}</span>
              </div>
              {orderBumps.filter(b => selectedBumps.includes(b.id)).map((b) => (
                <div key={b.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate">{b.name}</span>
                  <span className="font-mono text-primary">+${b.price}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-extrabold tracking-tight">${total}</span>
            </div>

            {/* Trust badges */}
            <div className="mt-6 space-y-2">
              {[
                "✓ Acceso inmediato después del pago",
                "✓ Descargas ilimitadas de por vida",
                "✓ Licencia profesional incluida",
                "✓ Garantía de devolución 30 días",
              ].map((t) => (
                <div key={t} className="text-[11px] text-muted-foreground">{t}</div>
              ))}
            </div>
          </div>

          {/* Secure badges */}
          <div className="rounded-xl border border-border p-4 flex flex-wrap items-center justify-center gap-4">
            {["Stripe", "PayPal", "SSL 256-bit", "PCI DSS"].map((b) => (
              <div key={b} className="text-[10px] font-mono text-muted-foreground px-2 py-1 rounded bg-surface border border-border">{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
