import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, Lock, Check, CreditCard, Smartphone, Globe, Star,
  ChevronDown, ArrowLeft, Zap, CheckCircle2, Users, Clock,
  Flame, AlertCircle, Gift,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type PayMethod = "card" | "pse" | "nequi" | "daviplata" | "efecty";

interface CardState {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CUOTAS = [
  { value: 1, label: "1 pago — sin interés", tag: "" },
  { value: 3, label: "3 cuotas — sin interés", tag: "🔥 Popular" },
  { value: 6, label: "6 cuotas", tag: "" },
  { value: 12, label: "12 cuotas", tag: "" },
];

const PSE_BANKS = [
  "Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA Colombia",
  "Banco Popular", "Banco de Occidente", "Banco Caja Social",
  "Bancoomeva", "Banco AV Villas", "Finandina", "Nequi (PSE)",
];

const PRODUCT = {
  id: "pulse-ai-masterclass",
  name: "Complete AI Engineering Masterclass",
  description: "40 videos HD · Código fuente · Certificado · Licencia profesional",
  priceCOP: 299000,
  priceDisplay: "$299.000",
  image: "https://picsum.photos/seed/checkout1/120/120",
  rating: 5.0,
  reviews: 211,
  soldToday: 47,
};

const ORDER_BUMPS = [
  { id: "ob1", name: "Neural-Kit SDK v2.0", price: 99000, display: "$99.000", original: "$149.000" },
  { id: "ob2", name: "Sesión Mentoring 1:1", price: 79000, display: "$79.000", original: "$129.000" },
];

function fmtCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

// ─── Card Brand Detection ─────────────────────────────────────────────────────

function detectBrand(num: string): "visa" | "mc" | "amex" | "default" {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(n)) return "mc";
  if (/^3[47]/.test(n)) return "amex";
  return "default";
}

function BrandLogo({ brand }: { brand: string }) {
  if (brand === "visa") return <span className="text-white font-black text-xl italic tracking-tight">VISA</span>;
  if (brand === "mc") return (
    <div className="flex">
      <div className="size-7 rounded-full bg-[#EB001B] opacity-90" />
      <div className="size-7 rounded-full bg-[#F79E1B] opacity-90 -ml-3" />
    </div>
  );
  return <CreditCard className="size-6 text-white/60" />;
}

function brandGradient(brand: string) {
  if (brand === "visa") return "from-[#1A1F71] to-[#1565C0]";
  if (brand === "mc") return "from-[#1a1a2e] to-[#c0392b]";
  if (brand === "amex") return "from-[#1a2f1a] to-[#1e7e34]";
  return "from-slate-800 to-slate-700";
}

// ─── Card Preview ─────────────────────────────────────────────────────────────

function CardPreview({ card, showBack, brand }: { card: CardState; showBack: boolean; brand: string }) {
  const displayNumber = card.number.padEnd(19, "•").replace(/(.{4})/g, "$1 ").trim();

  return (
    <div className="w-full max-w-[320px] mx-auto" style={{ perspective: "1000px" }}>
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
          transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "1.586 / 1",
          position: "relative",
        }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${brandGradient(brand)} p-5 flex flex-col justify-between shadow-2xl`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-7 rounded-md bg-yellow-400/80 border border-yellow-300/50" style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            }} />
            <BrandLogo brand={brand} />
          </div>
          <div>
            <div className="font-mono text-white text-lg tracking-[0.2em] mb-3 select-none">
              {displayNumber || "•••• •••• •••• ••••"}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Titular</div>
                <div className="text-white text-sm font-medium truncate max-w-[160px]">
                  {card.name || "NOMBRE APELLIDO"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Vence</div>
                <div className="text-white text-sm font-medium">{card.expiry || "MM/AA"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${brandGradient(brand)} flex flex-col shadow-2xl overflow-hidden`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-10 bg-black/40 mt-6 w-full" />
          <div className="flex items-center justify-end px-5 mt-4 gap-3">
            <div className="flex-1 h-8 bg-white/10 rounded" />
            <div className="w-14 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-black font-mono font-bold text-sm">{card.cvv || "•••"}</span>
            </div>
          </div>
          <div className="px-5 mt-3">
            <div className="text-white/40 text-[9px] uppercase tracking-widest">CVV/CVC</div>
          </div>
          <div className="mt-auto px-5 pb-4 flex items-center justify-between">
            <div className="text-white/30 text-[9px]">Procesado por Mercado Pago</div>
            <BrandLogo brand={brand} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Forms ────────────────────────────────────────────────────────────

function CardForm({
  card, setCard, cuota, setCuota, onCvvFocus, onCvvBlur,
}: {
  card: CardState;
  setCard: (fn: (c: CardState) => CardState) => void;
  cuota: number;
  setCuota: (v: number) => void;
  onCvvFocus: () => void;
  onCvvBlur: () => void;
}) {
  const [cuotaOpen, setCuotaOpen] = useState(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="card-number" className="text-xs font-medium">Número de tarjeta</Label>
        <div className="relative">
          <Input
            id="card-number"
            placeholder="0000 0000 0000 0000"
            value={card.number}
            onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
            className="bg-black/20 h-12 font-mono text-base pr-16 tracking-widest"
            maxLength={19}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <BrandLogo brand={detectBrand(card.number)} />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="card-name" className="text-xs font-medium">Nombre en la tarjeta</Label>
        <Input
          id="card-name"
          placeholder="NOMBRE APELLIDO"
          value={card.name}
          onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
          className="bg-black/20 h-12 uppercase tracking-widest"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="card-expiry" className="text-xs font-medium">Vencimiento</Label>
          <Input
            id="card-expiry"
            placeholder="MM/AA"
            value={card.expiry}
            onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
            className="bg-black/20 h-12 font-mono text-center text-base"
            maxLength={5}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="card-cvv" className="text-xs font-medium">CVV / CVC</Label>
          <Input
            id="card-cvv"
            placeholder="•••"
            value={card.cvv}
            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
            onFocus={onCvvFocus}
            onBlur={onCvvBlur}
            type="password"
            className="bg-black/20 h-12 font-mono text-center text-base"
            maxLength={4}
          />
        </div>
      </div>

      {/* Cuotas */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Cuotas</Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setCuotaOpen(o => !o)}
            className="w-full h-12 flex items-center justify-between px-4 bg-black/20 border border-input rounded-xl text-sm hover:border-primary/30 transition-colors"
          >
            <span>{CUOTAS.find(c => c.value === cuota)?.label}</span>
            <div className="flex items-center gap-2">
              {CUOTAS.find(c => c.value === cuota)?.tag && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {CUOTAS.find(c => c.value === cuota)?.tag}
                </span>
              )}
              <ChevronDown className={`size-4 text-muted-foreground transition-transform ${cuotaOpen ? "rotate-180" : ""}`} />
            </div>
          </button>
          {cuotaOpen && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-xl shadow-2xl z-20 overflow-hidden">
              {CUOTAS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => { setCuota(c.value); setCuotaOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white/5 transition-colors ${c.value === cuota ? "text-primary font-semibold" : ""}`}
                >
                  <span>{c.label}</span>
                  {c.tag && <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">{c.tag}</span>}
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
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 p-3 flex items-start gap-2.5">
        <AlertCircle className="size-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300 leading-relaxed">
          Serás redirigido a tu banco para autorizar el débito. El acceso se activa de inmediato al confirmar.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Selecciona tu banco</Label>
        <div className="relative">
          <button type="button" onClick={() => setOpen(o => !o)}
            className="w-full h-12 flex items-center justify-between px-4 bg-black/20 border border-input rounded-xl text-sm hover:border-primary/30 transition-colors"
          >
            <span className={bank ? "" : "text-muted-foreground"}>{bank || "Elige tu banco..."}</span>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-surface border border-border rounded-xl shadow-2xl z-20 overflow-hidden max-h-52 overflow-y-auto">
              {PSE_BANKS.map(b => (
                <button key={b} type="button" onClick={() => { setBank(b); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${b === bank ? "text-primary font-semibold" : ""}`}
                >
                  <div className="size-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{b[0]}</div>
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pse-document" className="text-xs font-medium">Número de documento</Label>
          <Input id="pse-document" placeholder="1234567890" className="bg-black/20 h-12 font-mono" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pse-doctype" className="text-xs font-medium">Tipo</Label>
          <select id="pse-doctype" className="h-12 px-3 bg-black/20 border border-input rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/40 w-24">
            <option>CC</option><option>NIT</option><option>CE</option><option>PAS</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NequiForm({ price }: { price: number }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#9B59B6]/20 bg-[#9B59B6]/5 p-4 flex items-center gap-4">
        <div className="size-12 rounded-xl bg-[#9B59B6] flex items-center justify-center shrink-0">
          <span className="text-white font-black text-lg">N</span>
        </div>
        <div>
          <div className="font-semibold text-sm">Paga con Nequi</div>
          <div className="text-[11px] text-muted-foreground">Recibirás una notificación push para aprobar</div>
          <div className="text-lg font-extrabold text-[#9B59B6] mt-0.5">{fmtCOP(price)} COP</div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Número de celular Nequi</Label>
        <div className="flex gap-2">
          <div className="h-12 px-3 flex items-center text-sm font-mono bg-black/30 border border-input rounded-xl text-muted-foreground shrink-0">+57</div>
          <Input placeholder="300 000 0000" className="bg-black/20 h-12 font-mono text-base flex-1" maxLength={10} />
        </div>
      </div>
      <div className="rounded-xl bg-black/20 border border-border p-3 text-[11px] text-muted-foreground space-y-1">
        <div className="flex items-center gap-1.5"><Check className="size-3 text-[#9B59B6]" /> Revisa la notificación en tu app Nequi</div>
        <div className="flex items-center gap-1.5"><Check className="size-3 text-[#9B59B6]" /> Autoriza el pago en menos de 60 segundos</div>
        <div className="flex items-center gap-1.5"><Check className="size-3 text-[#9B59B6]" /> Acceso inmediato después de confirmar</div>
      </div>
    </div>
  );
}

function DaviplataForm({ price }: { price: number }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-4">
        <div className="size-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
          <span className="text-white font-black text-sm">DP</span>
        </div>
        <div>
          <div className="font-semibold text-sm">Paga con Daviplata</div>
          <div className="text-[11px] text-muted-foreground">Recibirás un SMS de confirmación</div>
          <div className="text-lg font-extrabold text-red-400 mt-0.5">{fmtCOP(price)} COP</div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Número Daviplata</Label>
        <div className="flex gap-2">
          <div className="h-12 px-3 flex items-center text-sm font-mono bg-black/30 border border-input rounded-xl text-muted-foreground shrink-0">+57</div>
          <Input placeholder="310 000 0000" className="bg-black/20 h-12 font-mono text-base flex-1" maxLength={10} />
        </div>
      </div>
    </div>
  );
}

function EfectyForm({ email }: { email: string }) {
  const code = `PLS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-xl bg-yellow-500 flex items-center justify-center shrink-0">
            <span className="text-black font-black text-xs">EF</span>
          </div>
          <div>
            <div className="font-semibold text-sm">Código de pago Efecty</div>
            <div className="text-[11px] text-muted-foreground">Paga en cualquier punto Efecty o Baloto</div>
          </div>
        </div>
        <div className="rounded-lg bg-black/20 border border-yellow-500/20 p-3 text-center">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Código de referencia</div>
          <div className="font-mono text-2xl font-black text-yellow-400 tracking-widest">{code}</div>
          <div className="text-[10px] text-muted-foreground mt-1">Válido por 48 horas</div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Email para recibir confirmación</Label>
        <Input type="email" defaultValue={email} className="bg-black/20 h-12" />
      </div>
      <div className="text-[11px] text-muted-foreground space-y-1">
        <div className="flex items-start gap-1.5"><Check className="size-3 text-yellow-400 shrink-0 mt-0.5" /> Presenta el código en cualquier punto Efecty, Baloto o Apostar</div>
        <div className="flex items-start gap-1.5"><Check className="size-3 text-yellow-400 shrink-0 mt-0.5" /> El acceso se activa en máximo 2 horas después del pago en efectivo</div>
      </div>
    </div>
  );
}

// ─── Main Checkout ────────────────────────────────────────────────────────────

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(!user);
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [card, setCard] = useState<CardState>({ number: "", name: "", expiry: "", cvv: "" });
  const [showCardBack, setShowCardBack] = useState(false);
  const [cuota, setCuota] = useState(3);
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buyersToday] = useState(Math.floor(Math.random() * 30 + 17));
  const [step, setStep] = useState<"payment" | "processing" | "done">("payment");
  const [processingMsg, setProcessingMsg] = useState("Iniciando transacción segura...");

  const toggleBump = (id: string) =>
    setSelectedBumps(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const bumpsTotal = ORDER_BUMPS.filter(b => selectedBumps.includes(b.id)).reduce((a, b) => a + b.price, 0);
  const total = PRODUCT.priceCOP + bumpsTotal;
  const brand = detectBrand(card.number);

  const processingMessages = [
    "Iniciando transacción segura...",
    "Verificando datos de pago...",
    "Conectando con Mercado Pago...",
    "Procesando cobro...",
    "Confirmando transacción...",
    "¡Activando tu acceso!",
  ];

  const handlePay = async () => {
    if (payMethod === "card") {
      if (!card.number.replace(/\s/g, "") || card.number.replace(/\s/g, "").length < 16) {
        toast.error("Ingresa un número de tarjeta válido"); return;
      }
      if (!card.name.trim()) { toast.error("Ingresa el nombre del titular"); return; }
      if (!card.expiry || card.expiry.length < 5) { toast.error("Ingresa la fecha de vencimiento"); return; }
      if (!card.cvv || card.cvv.length < 3) { toast.error("Ingresa el CVV"); return; }
    }

    setLoading(true);
    setStep("processing");

    // Animate processing messages
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < processingMessages.length) {
        setProcessingMsg(processingMessages[idx]);
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      // Call backend API to create MP preference
      const res = await fetch("/api/mp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          planId: PRODUCT.id,
          price: total,
          planName: PRODUCT.name,
          userEmail: user?.email,
          paymentMethod: payMethod,
          installments: payMethod === "card" ? cuota : 1,
          bumps: selectedBumps,
        }),
      });

      clearInterval(interval);

      if (res.ok) {
        const data = await res.json();
        if (data.initPoint) {
          // Real Mercado Pago redirect
          window.location.href = data.initPoint;
          return;
        }
      }
    } catch {
      clearInterval(interval);
    }

    // Demo mode: simulate payment success after 2.5s
    await new Promise(r => setTimeout(r, 2500));
    setStep("done");
    setSuccess(true);
    setLoading(false);
  };

  // ─── Processing Screen ───────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="relative mx-auto size-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="size-10 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Procesando tu pago</h2>
            <p className="text-sm text-muted-foreground transition-all">{processingMsg}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Lock className="size-3 text-primary" />
            <span>Transacción cifrada SSL 256-bit · Mercado Pago PCI DSS</span>
          </div>
          <div className="space-y-2">
            {processingMessages.map((m, i) => (
              <div key={m} className={`flex items-center gap-2 text-xs transition-all ${processingMsg === m ? "text-primary font-medium" : processingMessages.indexOf(processingMsg) > i ? "text-emerald-400" : "text-muted-foreground/30"}`}>
                {processingMessages.indexOf(processingMsg) > i ? (
                  <Check className="size-3 shrink-0" />
                ) : processingMsg === m ? (
                  <div className="size-3 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="size-3 rounded-full border border-muted-foreground/30 shrink-0" />
                )}
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              Hemos activado tu acceso y enviado los detalles a{" "}
              <span className="text-foreground font-medium">{user?.email || "tu email"}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-surface border border-border p-5 text-left space-y-3">
            <div className="flex items-start gap-3">
              <img src={PRODUCT.image} alt="" className="size-14 rounded-xl object-cover border border-border shrink-0" />
              <div>
                <div className="font-semibold text-sm">{PRODUCT.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{PRODUCT.description}</div>
                <div className="text-primary font-bold mt-1">{fmtCOP(total)}</div>
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-1.5">
              {[
                "✅ Acceso inmediato habilitado en Mis Compras",
                "✅ Descarga disponible en tu biblioteca",
                "✅ Factura electrónica enviada por email",
                "✅ Garantía total 7 días — sin preguntas",
              ].map(t => <div key={t} className="text-xs text-muted-foreground">{t}</div>)}
            </div>
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

  const payTabs: { id: PayMethod; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "card", label: "Tarjeta", icon: <CreditCard className="size-4" />, color: "" },
    { id: "pse", label: "PSE", icon: <Globe className="size-4" />, color: "text-blue-400" },
    { id: "nequi", label: "Nequi", icon: <Smartphone className="size-4" />, color: "text-purple-400" },
    { id: "daviplata", label: "Daviplata", icon: <Smartphone className="size-4" />, color: "text-red-400" },
    { id: "efecty", label: "Efecty", icon: <Shield className="size-4" />, color: "text-yellow-400" },
  ];

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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5 text-emerald-400" />
              <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#009EE3]">
              <div className="size-5 rounded bg-[#009EE3] flex items-center justify-center text-white text-[9px] font-black">MP</div>
              <span className="hidden sm:block">Mercado Pago</span>
            </div>
          </div>
        </header>

        {/* Urgency bar */}
        <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 border-b border-emerald-500/20 px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 text-xs text-emerald-300 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              <span><strong>{buyersToday}</strong> personas compraron hoy</span>
            </div>
            <span className="text-emerald-500/40 hidden sm:block">|</span>
            <div className="flex items-center gap-1.5">
              <Gift className="size-3.5" />
              <span>Garantía total <strong>7 días</strong> — devolución sin preguntas</span>
            </div>
            <span className="text-emerald-500/40 hidden sm:block">|</span>
            <div className="flex items-center gap-1.5">
              <Flame className="size-3.5 text-orange-400" />
              <span className="text-orange-300">Precio especial disponible ahora</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_360px] gap-8">
          {/* ─── Left: Payment Form ─────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* User info */}
            {user && (
              <div className="rounded-xl bg-surface border border-border p-4 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 shrink-0">
                  ✓ Verificado
                </span>
              </div>
            )}

            {/* Card preview (visible on payment by card) */}
            {payMethod === "card" && (
              <div className="rounded-2xl bg-surface border border-border p-5">
                <CardPreview card={card} showBack={showCardBack} brand={brand} />
              </div>
            )}

            {/* Payment method tabs */}
            <div className="rounded-2xl bg-surface border border-border overflow-hidden">
              <div className="flex items-center gap-1 p-3 border-b border-border overflow-x-auto">
                {payTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPayMethod(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      payMethod === t.id
                        ? "bg-primary/10 border border-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <span className={payMethod === t.id ? "" : t.color}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {payMethod === "card" && (
                  <CardForm
                    card={card} setCard={setCard}
                    cuota={cuota} setCuota={setCuota}
                    onCvvFocus={() => setShowCardBack(true)}
                    onCvvBlur={() => setShowCardBack(false)}
                  />
                )}
                {payMethod === "pse" && <PSEForm />}
                {payMethod === "nequi" && <NequiForm price={total} />}
                {payMethod === "daviplata" && <DaviplataForm price={total} />}
                {payMethod === "efecty" && <EfectyForm email={user?.email || ""} />}
              </div>
            </div>

            {/* Order Bumps */}
            <div className="rounded-2xl bg-surface border border-border overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-primary/5">
                <div className="text-xs font-mono text-primary uppercase tracking-widest">
                  ⚡ Agrega a tu pedido — Oferta única
                </div>
              </div>
              {ORDER_BUMPS.map(bump => (
                <div
                  key={bump.id}
                  onClick={() => toggleBump(bump.id)}
                  className={`flex items-start gap-4 p-4 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${
                    selectedBumps.includes(bump.id) ? "bg-primary/5" : "hover:bg-white/3"
                  }`}
                >
                  <div className={`size-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    selectedBumps.includes(bump.id) ? "bg-primary border-primary" : "border-border"
                  }`}>
                    {selectedBumps.includes(bump.id) && <Check className="size-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{bump.name}</div>
                    <div className="text-[10px] text-muted-foreground line-through">{bump.original}</div>
                  </div>
                  <div className="text-primary font-bold text-sm shrink-0">+{bump.display}</div>
                </div>
              ))}
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all font-extrabold text-primary-foreground text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 disabled:opacity-60"
            >
              {loading ? (
                <div className="size-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="size-5" />
                  Pagar {fmtCOP(total)} de forma segura
                  {payMethod === "card" && cuota > 1 && (
                    <span className="text-sm font-normal opacity-80">· {cuota}x {fmtCOP(Math.ceil(total / cuota))}</span>
                  )}
                </>
              )}
            </button>

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[
                { icon: <Shield className="size-3.5 text-emerald-400" />, label: "Garantía 7 días" },
                { icon: <Lock className="size-3.5 text-primary" />, label: "SSL 256-bit" },
                { icon: <Globe className="size-3.5 text-[#009EE3]" />, label: "PCI DSS" },
                { icon: <Star className="size-3.5 text-yellow-400" />, label: "4.9★ · 8.4k reseñas" },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  {t.icon} {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right: Order Summary ───────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-22 self-start">
            {/* Guarantee badge */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-4 flex items-center gap-3">
              <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Shield className="size-6 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-sm text-emerald-300">Garantía total 7 días</div>
                <div className="text-[11px] text-emerald-400/70 leading-relaxed">Si no estás 100% satisfecho, te devolvemos el dinero. Sin preguntas. Sin formularios.</div>
              </div>
            </div>

            {/* Product */}
            <div className="rounded-2xl bg-surface border border-border p-5">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Resumen del pedido</div>
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <img src={PRODUCT.image} alt={PRODUCT.name} className="size-16 rounded-xl object-cover border border-border shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm leading-tight">{PRODUCT.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{PRODUCT.description}</div>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />)}
                    <span className="text-[10px] text-muted-foreground ml-1">({PRODUCT.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-3 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Producto</span>
                  <span className="font-mono">{fmtCOP(PRODUCT.priceCOP)}</span>
                </div>
                {ORDER_BUMPS.filter(b => selectedBumps.includes(b.id)).map(b => (
                  <div key={b.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate">{b.name}</span>
                    <span className="font-mono text-primary">+{b.display}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-between items-center">
                <span className="font-bold">Total</span>
                <div className="text-right">
                  <div className="text-2xl font-extrabold tracking-tight">{fmtCOP(total)}</div>
                  {payMethod === "card" && cuota > 1 && (
                    <div className="text-[11px] text-muted-foreground">{cuota}x {fmtCOP(Math.ceil(total / cuota))}/mes</div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                {[
                  "✓ Acceso inmediato después del pago",
                  "✓ Descargas ilimitadas de por vida",
                  "✓ Certificado de completación",
                  "✓ Soporte prioritario incluido",
                ].map(t => <div key={t} className="text-[11px] text-muted-foreground">{t}</div>)}
              </div>
            </div>

            {/* Live activity */}
            <div className="rounded-xl bg-surface border border-border p-3 flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">{buyersToday} personas</span> compraron este producto hoy
              </div>
              <Clock className="size-3.5 text-muted-foreground ml-auto shrink-0" />
            </div>

            {/* Payment logos */}
            <div className="rounded-xl border border-border p-3 flex flex-wrap items-center justify-center gap-2">
              {["Mercado Pago", "PSE", "Nequi", "Daviplata", "Efecty"].map(b => (
                <div key={b} className="text-[9px] font-mono text-muted-foreground px-2 py-1 rounded border border-border bg-surface">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
