import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, Lock, Check, CreditCard, Smartphone, Globe, Star,
  ChevronDown, ArrowLeft, Zap, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — PULSE AI" }] }),
  component: Checkout,
});

type PayMethod = "card" | "pse" | "nequi" | "daviplata" | "efecty";

const CUOTAS = [
  { value: 1, label: "1 cuota sin interés" },
  { value: 3, label: "3 cuotas sin interés" },
  { value: 6, label: "6 cuotas" },
  { value: 12, label: "12 cuotas" },
  { value: 24, label: "24 cuotas" },
];

const PSE_BANKS = [
  "Bancolombia", "Banco de Bogotá", "Davivienda",
  "BBVA", "Banco Popular", "Banco Caja Social",
  "Bancoomeva", "Nequi (PSE)", "Banco AV Villas",
];

const product = {
  name: "Complete AI Engineering Masterclass",
  price: 299000,
  priceUSD: 299,
  description: "40 videos HD · Código fuente · Certificado · Licencia profesional",
  rating: 5.0,
  reviews: 211,
  image: "https://picsum.photos/seed/checkout/120/120",
};

const orderBumps = [
  { id: "ob1", name: "Neural-Kit SDK", desc: "El toolkit de ML para poner en práctica lo aprendido", price: 99000, priceUSD: 99, originalPrice: 149000 },
  { id: "ob2", name: "Sesión Mentoring 1:1 (60 min)", desc: "Sesión privada con el instructor para acelerar tu progreso", price: 79000, priceUSD: 79, originalPrice: 129000 },
];

function fmtCOP(n: number) {
  return "COP $" + n.toLocaleString("es-CO");
}

function MPLogo() {
  return (
    <svg viewBox="0 0 120 24" className="h-5 w-auto" fill="none">
      <text x="0" y="19" fontFamily="system-ui" fontWeight="bold" fontSize="18" fill="#009ee3">Mercado</text>
      <text x="72" y="19" fontFamily="system-ui" fontWeight="bold" fontSize="18" fill="#fff">Pago</text>
    </svg>
  );
}

function CardForm({ cuota, setCuota }: { cuota: number; setCuota: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Número de tarjeta</Label>
        <div className="relative">
          <Input placeholder="0000 0000 0000 0000" className="bg-black/20 h-11 font-mono pr-20" maxLength={19} />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <div className="h-5 w-8 rounded bg-[#1A1F71] flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
            <div className="h-5 w-8 rounded bg-[#EB001B]/80 flex items-center justify-center text-[8px] font-bold text-white">MC</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Vencimiento</Label>
          <Input placeholder="MM/AA" className="bg-black/20 h-11 font-mono" maxLength={5} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">CVV</Label>
          <Input placeholder="123" className="bg-black/20 h-11 font-mono" maxLength={4} type="password" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Nombre en la tarjeta</Label>
        <Input placeholder="ALEX RIVERA" className="bg-black/20 h-11 uppercase" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Cuotas</Label>
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full h-11 flex items-center justify-between px-3 bg-black/20 border border-input rounded-md text-sm"
          >
            <span>{CUOTAS.find(c => c.value === cuota)?.label}</span>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl z-20 overflow-hidden">
              {CUOTAS.map(c => (
                <button
                  key={c.value}
                  onClick={() => { setCuota(c.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${c.value === cuota ? "text-primary font-semibold" : ""}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PSEForm() {
  const [bank, setBank] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
        Serás redirigido a tu banco para autorizar el pago de forma segura.
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Banco</Label>
        <div className="relative">
          <button
            onClick={() => setBankOpen(o => !o)}
            className="w-full h-11 flex items-center justify-between px-3 bg-black/20 border border-input rounded-md text-sm"
          >
            <span className={bank ? "" : "text-muted-foreground"}>{bank || "Selecciona tu banco"}</span>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${bankOpen ? "rotate-180" : ""}`} />
          </button>
          {bankOpen && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
              {PSE_BANKS.map(b => (
                <button
                  key={b}
                  onClick={() => { setBank(b); setBankOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${b === bank ? "text-primary font-semibold" : ""}`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_140px] gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Número de documento</Label>
          <Input placeholder="CC 1234567890" className="bg-black/20 h-11 font-mono" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tipo de persona</Label>
          <select className="w-full h-11 px-3 bg-black/20 border border-input rounded-md text-sm text-foreground focus:outline-none">
            <option value="natural">Natural</option>
            <option value="juridica">Jurídica</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NequiForm() {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-[#9B59B6]/10 border border-[#9B59B6]/20 text-xs text-purple-300">
        Recibirás una notificación push en tu app Nequi para aprobar el pago.
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Número de celular Nequi</Label>
        <div className="flex gap-2">
          <span className="h-11 px-3 flex items-center text-sm font-mono bg-black/30 border border-input rounded-md text-muted-foreground">+57</span>
          <Input placeholder="300 000 0000" className="bg-black/20 h-11 font-mono flex-1" maxLength={10} />
        </div>
      </div>
    </div>
  );
}

function DaviplataForm() {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
        Recibirás un SMS de confirmación en tu número Daviplata.
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Número Daviplata</Label>
        <div className="flex gap-2">
          <span className="h-11 px-3 flex items-center text-sm font-mono bg-black/30 border border-input rounded-md text-muted-foreground">+57</span>
          <Input placeholder="310 000 0000" className="bg-black/20 h-11 font-mono flex-1" maxLength={10} />
        </div>
      </div>
    </div>
  );
}

function EfectyForm({ email }: { email: string }) {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
        Recibirás un código de pago en tu email. Págalo en cualquier punto Efecty o Baloto.
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Email para recibir el código</Label>
        <Input type="email" value={email} readOnly className="bg-black/20 h-11 font-mono" />
      </div>
      <p className="text-[11px] text-muted-foreground">El código expira en 48 horas. El acceso se activa automáticamente al verificar el pago.</p>
    </div>
  );
}

function SuccessPage({ productName, email }: { productName: string; email: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="size-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-12 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">¡Compra exitosa!</h1>
          <p className="text-muted-foreground text-sm">
            Hemos enviado el acceso a <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-5 text-left space-y-3">
          <h3 className="font-semibold text-sm">Producto adquirido</h3>
          <div className="text-sm text-muted-foreground">{productName}</div>
          <div className="space-y-1.5 pt-2 border-t border-border">
            {[
              "✓ Acceso inmediato habilitado",
              "✓ Descarga disponible en Mis Compras",
              "✓ Factura electrónica enviada por email",
              "✓ Garantía de devolución 30 días",
            ].map(t => <div key={t} className="text-[12px] text-muted-foreground">{t}</div>)}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            to="/mis-compras"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Zap className="size-4" />
            Ir a Mis Compras
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Seguir explorando
          </Link>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cuota, setCuota] = useState(1);
  const [email, setEmail] = useState(user?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleBump = (id: string) =>
    setSelectedBumps(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const bumpsTotal = orderBumps.filter(b => selectedBumps.includes(b.id)).reduce((a, b) => a + b.price, 0);
  const total = product.price + bumpsTotal;

  const handlePurchase = () => {
    if (!user && !email) { toast.error("Ingresa tu email para continuar"); return; }
    if (!user) { setShowAuth(true); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2200);
  };

  if (success) return <SuccessPage productName={product.name} email={email || user?.email || ""} />;

  const payTabs: { id: PayMethod; label: string; icon: typeof CreditCard }[] = [
    { id: "card", label: "Tarjeta", icon: CreditCard },
    { id: "pse", label: "PSE", icon: Globe },
    { id: "nequi", label: "Nequi", icon: Smartphone },
    { id: "daviplata", label: "Daviplata", icon: Smartphone },
    { id: "efecty", label: "Efecty", icon: Shield },
  ];

  return (
    <>
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          defaultTab="register"
          onSuccess={() => setShowAuth(false)}
        />
      )}

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <Link to="/marketplace"><Logo /></Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5 text-primary" />
              <span>Pago 100% seguro — SSL 256-bit</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-4 px-2 rounded bg-[#009ee3]/10 border border-[#009ee3]/20 flex items-center">
                <MPLogo />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Left */}
          <div className="space-y-6">
            {/* Guest email or user info */}
            {user ? (
              <div className="rounded-xl bg-surface border border-border p-4 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {user.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5">Verificado</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-surface border border-border p-5 space-y-3">
                <h2 className="font-bold text-sm">Información de contacto</h2>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-black/20 h-11"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <button onClick={() => setShowAuth(true)} className="text-primary hover:underline font-medium">
                    Inicia sesión
                  </button>{" "}
                  para comprar más rápido.
                </p>
              </div>
            )}

            {/* Order Bumps */}
            <div className="rounded-xl bg-surface border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-primary/5">
                <div className="text-xs font-mono text-primary uppercase tracking-widest">⚡ Oferta Especial — Solo con esta compra</div>
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
                        <span className="text-[10px] text-muted-foreground line-through">{fmtCOP(bump.originalPrice)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{bump.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-primary text-sm">+{fmtCOP(bump.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mercado Pago payment block */}
            <div className="rounded-xl bg-surface border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <div className="flex-1">
                  <h2 className="font-bold text-sm">Método de pago</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Procesado de forma segura por Mercado Pago</p>
                </div>
                <div className="h-7 px-3 rounded-lg bg-[#009ee3]/10 border border-[#009ee3]/20 flex items-center">
                  <MPLogo />
                </div>
              </div>

              {/* Method tabs */}
              <div className="flex border-b border-border overflow-x-auto">
                {payTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPayMethod(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                      payMethod === t.id
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <t.icon className="size-3.5 shrink-0" />
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {payMethod === "card" && <CardForm cuota={cuota} setCuota={setCuota} />}
                {payMethod === "pse" && <PSEForm />}
                {payMethod === "nequi" && <NequiForm />}
                {payMethod === "daviplata" && <DaviplataForm />}
                {payMethod === "efecty" && <EfectyForm email={email || user?.email || ""} />}
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="contrast"
              size="lg"
              className="w-full text-base font-bold h-14 text-lg"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando pago...
                </div>
              ) : (
                <>
                  <Zap className="size-5" />
                  {`Pagar ${fmtCOP(total)}`}
                  {cuota > 1 && payMethod === "card" && ` · ${cuota}x ${fmtCOP(Math.ceil(total / cuota))}`}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-6 text-[10px] text-muted-foreground flex-wrap">
              {[
                { icon: Shield, label: "Garantía 30 días" },
                { icon: Lock, label: "SSL 256-bit" },
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

              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <img src={product.image} alt={product.name} className="size-16 rounded-xl object-cover border border-border shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight">{product.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{product.description}</div>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-primary text-primary" />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">({product.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">{product.name}</span>
                  <span className="font-mono shrink-0">{fmtCOP(product.price)}</span>
                </div>
                {orderBumps.filter(b => selectedBumps.includes(b.id)).map((b) => (
                  <div key={b.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate pr-2">{b.name}</span>
                    <span className="font-mono text-primary shrink-0">+{fmtCOP(b.price)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center mb-1">
                <span className="font-bold">Total</span>
                <span className="text-xl font-extrabold tracking-tight">{fmtCOP(total)}</span>
              </div>
              {cuota > 1 && payMethod === "card" && (
                <div className="text-[11px] text-muted-foreground text-right">{cuota}x {fmtCOP(Math.ceil(total / cuota))} / mes</div>
              )}

              <div className="mt-5 space-y-1.5">
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

            <div className="rounded-xl border border-border p-4 flex flex-wrap items-center justify-center gap-3">
              {["Mercado Pago", "SSL 256-bit", "PCI DSS"].map(b => (
                <div key={b} className="text-[10px] font-mono text-muted-foreground px-2 py-1 rounded bg-surface border border-border">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
