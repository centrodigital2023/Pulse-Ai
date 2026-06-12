import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Check, ChevronRight, Upload, Shield, User, FileText,
  Package, Clock, Star, DollarSign, Zap, ArrowLeft,
  Camera, X, Building,
} from "lucide-react";

export const Route = createFileRoute("/vender")({
  head: () => ({
    meta: [
      { title: "Vende en PULSE AI — Registrarse como Vendedor" },
      { name: "description", content: "Regístrate como vendedor en PULSE AI. Carga tus productos digitales y empieza a ganar hoy." },
    ],
  }),
  component: VenderPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 — Cuenta
  name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  // Step 2 — Verificación
  cedulaFront: File | null;
  cedulaBack: File | null;
  recibo: File | null;
  // Step 3 — Negocio
  storeName: string;
  storeDesc: string;
  category: string;
  website: string;
  // Step 4 — Primer producto
  productName: string;
  productDesc: string;
  productPrice: string;
  productCategory: string;
  productFile: File | null;
  productImage: File | null;
}

const COUNTRIES = ["Colombia", "México", "Argentina", "Chile", "Perú", "Ecuador", "España", "Estados Unidos", "Otro"];
const CATEGORIES = ["Software & SaaS", "Cursos & Educación", "Plantillas & Recursos", "eBooks & Guías", "Servicios", "Diseño", "Marketing", "Finanzas"];

const STEPS = [
  { label: "Cuenta", icon: User },
  { label: "Verificación", icon: Shield },
  { label: "Negocio", icon: Building },
  { label: "Producto", icon: Package },
];

// ─── File Upload Zone ─────────────────────────────────────────────────────────

function FileZone({ label, hint, accept, file, onChange, icon: Icon }: {
  label: string; hint: string; accept: string;
  file: File | null; onChange: (f: File) => void; icon: typeof Camera;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div
        onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors flex flex-col items-center gap-3 text-center ${
          file ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-surface/50"
        }`}
      >
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { if (e.target.files?.[0]) onChange(e.target.files[0]); }} />
        {file ? (
          <>
            <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Check className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary truncate max-w-[200px]">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · Listo</p>
            </div>
          </>
        ) : (
          <>
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center">
              <Icon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Seleccionar archivo</span> o arrastrar aquí
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Step indicators ──────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.label} className="flex items-center flex-1">
            <div className={`flex flex-col items-center gap-1 ${i < STEPS.length - 1 ? "w-full" : ""}`}>
              <div className={`size-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                done ? "bg-primary border-primary text-primary-foreground" :
                active ? "border-primary text-primary bg-primary/10" :
                "border-border text-muted-foreground"
              }`}>
                {done ? <Check className="size-4" /> : <s.icon className="size-4" />}
              </div>
              <span className={`text-[10px] font-medium hidden sm:block ${active ? "text-primary" : done ? "text-primary/70" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Benefits sidebar ─────────────────────────────────────────────────────────

function BenefitsSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 shrink-0">
      <div className="rounded-2xl bg-surface border border-border p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Zap className="size-4 text-primary" /> ¿Por qué vender en PULSE AI?
        </h3>
        <div className="space-y-4">
          {[
            { icon: DollarSign, title: "Gana hasta el 90%", desc: "Comisión más alta del mercado latinoamericano." },
            { icon: Zap, title: "Pagos semanales", desc: "Recibe tus ganancias cada lunes vía Mercado Pago o transferencia." },
            { icon: Star, title: "Panel profesional", desc: "Analytics, automatización, cursos, afiliados — todo en uno." },
            { icon: Shield, title: "100% seguro", desc: "Protección anti-fraude y disputas gestionadas por PULSE AI." },
            { icon: Clock, title: "Publicación en minutos", desc: "Sube tu producto y empieza a vender el mismo día." },
          ].map(b => (
            <div key={b.title} className="flex gap-3">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <b.icon className="size-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{b.title}</div>
                <div className="text-[11px] text-muted-foreground">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
        <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-3">Vendedores exitosos</div>
        {[
          { name: "DevCraft Studio", revenue: "$128,400", products: 12 },
          { name: "Neural Works", revenue: "$94,200", products: 8 },
          { name: "Pixel Factory", revenue: "$71,600", products: 24 },
        ].map(v => (
          <div key={v.name} className="flex items-center gap-3 py-2.5 border-b border-primary/10 last:border-0">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
              {v.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{v.name}</div>
              <div className="text-[10px] text-muted-foreground">{v.products} productos</div>
            </div>
            <div className="text-xs font-bold text-primary">{v.revenue}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function VenderPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", country: "Colombia", password: "",
    cedulaFront: null, cedulaBack: null, recibo: null,
    storeName: "", storeDesc: "", category: "Software & SaaS", website: "",
    productName: "", productDesc: "", productPrice: "", productCategory: "Software & SaaS",
    productFile: null, productImage: null,
  });

  const set = (k: keyof FormData, v: string | File | null) =>
    setForm(f => ({ ...f, [k]: v }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.phone || !form.password) {
        toast.error("Completa todos los campos obligatorios");
        return false;
      }
      if (form.password.length < 8) {
        toast.error("La contraseña debe tener al menos 8 caracteres");
        return false;
      }
    }
    if (step === 1) {
      if (!form.cedulaFront || !form.recibo) {
        toast.error("Debes subir al menos la cédula (frente) y el recibo de servicios");
        return false;
      }
    }
    if (step === 2) {
      if (!form.storeName || !form.storeDesc) {
        toast.error("Completa el nombre y descripción de tu tienda");
        return false;
      }
    }
    if (step === 3) {
      if (!form.productName || !form.productPrice) {
        toast.error("Ingresa el nombre y precio de tu primer producto");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 4) setStep(s => s + 1);
  };

  // ── Step 0: Account ────────────────────────────────────────────────────────
  const renderStep0 = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Crear tu cuenta</h2>
        <p className="text-sm text-muted-foreground mt-1">Necesitamos tus datos básicos para empezar.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seller-name">Nombre completo <span className="text-destructive">*</span></Label>
          <Input id="seller-name" placeholder="Carlos Rivera" value={form.name} onChange={e => set("name", e.target.value)} className="bg-black/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seller-phone">Teléfono <span className="text-destructive">*</span></Label>
          <Input id="seller-phone" placeholder="+57 310 555 6677" value={form.phone} onChange={e => set("phone", e.target.value)} className="bg-black/20" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="seller-email">Email <span className="text-destructive">*</span></Label>
        <Input id="seller-email" type="email" placeholder="tu@email.com" value={form.email} onChange={e => set("email", e.target.value)} className="bg-black/20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seller-password">Contraseña <span className="text-destructive">*</span></Label>
        <Input id="seller-password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => set("password", e.target.value)} className="bg-black/20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seller-country">País</Label>
        <select
          id="seller-country"
          value={form.country}
          onChange={e => set("country", e.target.value)}
          className="w-full bg-black/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
        >
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );

  // ── Step 1: Documents ──────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Verificar identidad</h2>
        <p className="text-sm text-muted-foreground mt-1">Necesitamos verificar que eres una persona real para proteger a los compradores.</p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <Shield className="size-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">¿Por qué pedimos documentos?</p>
          <p className="text-muted-foreground text-xs">Verificamos la identidad de todos los vendedores para garantizar un marketplace seguro. Tus documentos son encriptados y solo usados para validación.</p>
        </div>
      </div>

      <FileZone
        label="Cédula / DNI — Frente *"
        hint="JPG, PNG o PDF — máximo 5 MB"
        accept="image/*,.pdf"
        file={form.cedulaFront}
        onChange={f => set("cedulaFront", f)}
        icon={Camera}
      />
      <FileZone
        label="Cédula / DNI — Reverso (opcional)"
        hint="JPG, PNG o PDF — máximo 5 MB"
        accept="image/*,.pdf"
        file={form.cedulaBack}
        onChange={f => set("cedulaBack", f)}
        icon={Camera}
      />
      <FileZone
        label="Recibo de servicios públicos *"
        hint="Agua, luz, gas o teléfono — no mayor a 3 meses. JPG, PNG o PDF"
        accept="image/*,.pdf"
        file={form.recibo}
        onChange={f => set("recibo", f)}
        icon={FileText}
      />

      <p className="text-[11px] text-muted-foreground">Los documentos son revisados por nuestro equipo en un plazo de 24 horas hábiles. Recibirás un email de confirmación.</p>
    </div>
  );

  // ── Step 2: Business ───────────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Tu tienda</h2>
        <p className="text-sm text-muted-foreground mt-1">Configura el perfil de tu negocio en el marketplace.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="store-name">Nombre de la tienda <span className="text-destructive">*</span></Label>
        <Input id="store-name" placeholder="Mi Estudio Digital" value={form.storeName} onChange={e => set("storeName", e.target.value)} className="bg-black/20" />
        <p className="text-[10px] text-muted-foreground">Este nombre aparecerá en el marketplace como el creador de tus productos.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="store-desc">Descripción de tu tienda <span className="text-destructive">*</span></Label>
        <Textarea
          id="store-desc"
          rows={3}
          placeholder="Creamos herramientas y recursos digitales para desarrolladores y diseñadores…"
          value={form.storeDesc}
          onChange={e => set("storeDesc", e.target.value)}
          className="bg-black/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="store-category">Categoría principal</Label>
        <select
          id="store-category"
          value={form.category}
          onChange={e => set("category", e.target.value)}
          className="w-full bg-black/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="store-website">Sitio web o red social (opcional)</Label>
        <Input id="store-website" placeholder="https://tuweb.com o @tuhandle" value={form.website} onChange={e => set("website", e.target.value)} className="bg-black/20" />
      </div>
    </div>
  );

  // ── Step 3: First Product ──────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Tu primer producto</h2>
        <p className="text-sm text-muted-foreground mt-1">Agrega tu primer producto al marketplace. Puedes editarlo después.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-name">Nombre del producto <span className="text-destructive">*</span></Label>
        <Input id="product-name" placeholder="Mi Increíble Curso de React" value={form.productName} onChange={e => set("productName", e.target.value)} className="bg-black/20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-desc">Descripción</Label>
        <Textarea
          id="product-desc"
          rows={3}
          placeholder="Describe lo que incluye tu producto, para quién es y qué aprenderán o recibirán..."
          value={form.productDesc}
          onChange={e => set("productDesc", e.target.value)}
          className="bg-black/20"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-price">Precio (USD) <span className="text-destructive">*</span></Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              id="product-price"
              type="number"
              placeholder="49"
              min="1"
              className="bg-black/20 pl-7"
              value={form.productPrice}
              onChange={e => set("productPrice", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-category">Categoría</Label>
          <select
            id="product-category"
            value={form.productCategory}
            onChange={e => set("productCategory", e.target.value)}
            className="w-full bg-black/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <FileZone
        label="Archivo del producto"
        hint="ZIP, PDF, MP4, o cualquier formato — hasta 10 GB"
        accept="*"
        file={form.productFile}
        onChange={f => set("productFile", f)}
        icon={Upload}
      />
      <FileZone
        label="Imagen de portada (opcional)"
        hint="JPG o PNG — mínimo 600×400px recomendado"
        accept="image/*"
        file={form.productImage}
        onChange={f => set("productImage", f)}
        icon={Camera}
      />
    </div>
  );

  // ── Step 4: Success ────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="text-center py-8 space-y-6">
      <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
        <Check className="size-10 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">¡Solicitud enviada!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Hola <strong>{form.name.split(" ")[0]}</strong>, recibimos tu solicitud para vender en PULSE AI. Nuestro equipo revisará tus documentos en las próximas <strong>24 horas hábiles</strong>.
        </p>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6 max-w-sm mx-auto text-left space-y-3">
        <h3 className="text-sm font-bold">¿Qué pasa ahora?</h3>
        {[
          { step: "1", label: "Revisamos tus documentos", time: "< 24 horas" },
          { step: "2", label: "Te enviamos el email de aprobación", time: "Al aprobar" },
          { step: "3", label: "Configuras tu tienda y publicas", time: "Inmediato" },
          { step: "4", label: "Empiezas a recibir pagos", time: "Semanal" },
        ].map(s => (
          <div key={s.step} className="flex items-start gap-3">
            <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">{s.step}</div>
            <div className="flex-1">
              <div className="text-sm">{s.label}</div>
              <div className="text-[10px] text-muted-foreground">{s.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="contrast" asChild className="gap-2">
          <Link to="/marketplace">Ver el Marketplace</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );

  const stepContent = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">¿Ya tienes cuenta?</span>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Iniciar sesión</Link>
          </Button>
        </div>
      </header>

      {/* Hero strip */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Zap className="size-5 text-primary" />
            <h1 className="font-semibold text-sm">Registro de Vendedores — Empieza a vender hoy, gratis</h1>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
            {["✓ 0% comisión el primer mes", "✓ Pago semanal garantizado", "✓ Soporte en español"].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex gap-10">
        {/* Form area */}
        <div className="flex-1 min-w-0">
          {step < 4 && <StepBar current={step} />}

          <div className="rounded-2xl bg-surface border border-border p-8">
            {step < 4 ? stepContent[step]() : renderSuccess()}
          </div>

          {step < 4 && (
            <div className="flex items-center justify-between mt-6">
              {step > 0 ? (
                <Button variant="outline" className="gap-2" onClick={() => setStep(s => s - 1)}>
                  <ArrowLeft className="size-4" /> Anterior
                </Button>
              ) : (
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <X className="size-3.5" /> Cancelar
                </Link>
              )}

              <Button
                variant="contrast"
                className="gap-2 px-8 font-bold"
                onClick={step === 3 ? () => { if (validateStep()) { setStep(4); toast.success("¡Solicitud enviada correctamente!"); } } : next}
              >
                {step === 3 ? "Enviar solicitud" : "Continuar"}
                {step < 3 && <ChevronRight className="size-4" />}
              </Button>
            </div>
          )}
        </div>

        <BenefitsSidebar />
      </div>
    </div>
  );
}
