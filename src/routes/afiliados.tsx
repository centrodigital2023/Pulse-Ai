import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp, DollarSign, Users, Link2, Copy, Check, ChevronDown, ChevronUp,
  Zap, Shield, Star, BarChart3, Share2, Gift, Rocket, ArrowRight,
  Package, BookOpen, Code2, Image, MessageSquare, ExternalLink,
  Wallet, Clock, CheckCircle2, Globe, Trophy, Target, Flame,
  Lightbulb, Award, Play, ChevronRight,
} from "lucide-react";
import { SiteNav, BackToMarketplace } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth-context";
import { useUserStore, fmtCOP, type AffiliateLink } from "@/lib/user-store";
import { useAllListings } from "@/lib/products-store";
import { toast } from "sonner";

export const Route = createFileRoute("/afiliados")({
  head: () => ({
    meta: [
      { title: "Programa de Afiliados Colombia | Gana hasta 40% de Comisión — PULSE AI" },
      { name: "description", content: "Gana hasta 40% de comisión como afiliado PULSE AI. Comparte tu enlace, vende productos digitales y cobra cada 15 días. Sin inversión, sin inventario. El programa de afiliados más rentable de Colombia." },
      { name: "keywords", content: "programa afiliados colombia, ganar dinero afiliados, comisiones productos digitales, marketing de afiliados colombia, ingresos pasivos online colombia, afiliados mercado pago" },
      { property: "og:title", content: "Programa de Afiliados PULSE AI — Gana hasta 40% de Comisión" },
      { property: "og:description", content: "Comparte un enlace, gana comisiones. Sin inversión, sin inventario. Cobros cada 15 días con Mercado Pago." },
      { property: "og:url", content: "https://pulseai.co/afiliados" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://pulseai.co/afiliados" }],
  }),
  component: AfiliadosPage,
});

// ─── Commission table ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "books", label: "E-books y Guías", icon: BookOpen, rate: 40, color: "text-emerald-400" },
  { key: "education", label: "Cursos Online", icon: Star, rate: 35, color: "text-yellow-400" },
  { key: "software", label: "Software y Apps", icon: Code2, rate: 30, color: "text-blue-400" },
  { key: "resources", label: "Templates y Recursos", icon: Image, rate: 25, color: "text-purple-400" },
  { key: "services", label: "Servicios Digitales", icon: Zap, rate: 20, color: "text-primary" },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  { q: "¿Cuánto puedo ganar como afiliado?", a: "No hay límite. Afiliados activos ganan entre $500.000 y $10.000.000 COP al mes dependiendo del volumen de ventas. Las comisiones van del 20% al 40% según la categoría." },
  { q: "¿Cuándo recibo mis pagos?", a: "Los pagos se procesan cada 15 días. Puedes retirar tus comisiones a tu cuenta bancaria colombiana (Bancolombia, Nequi, Davivienda, etc.) cuando alcances $50.000 COP mínimo." },
  { q: "¿Necesito tener un producto propio?", a: "¡No! Como afiliado puedes elegir entre miles de productos del marketplace y venderlos a tu audiencia. Tú compartes el enlace y nosotros nos encargamos de todo lo demás: entrega, soporte y pagos." },
  { q: "¿Cuánto tiempo dura la cookie de seguimiento?", a: "La cookie dura 30 días. Si alguien hace clic en tu enlace y compra dentro de los próximos 30 días, la comisión es tuya." },
  { q: "¿Puedo ser afiliado de varios productos al mismo tiempo?", a: "Sí, puedes generar enlaces de afiliado para cualquier producto del marketplace y promoverlos simultáneamente en tus canales." },
  { q: "¿Hay algún costo para registrarse?", a: "No. El registro como afiliado es completamente gratuito. Nunca te cobraremos por usar la plataforma de afiliados." },
];

// ─── Landing page ──────────────────────────────────────────────────────────────

function AffiliateLanding({ onRegister }: { onRegister: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
            <Zap className="size-3" /> PROGRAMA DE AFILIADOS GRATUITO
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            Gana hasta <span className="text-primary">40% de comisión</span><br />vendiendo en internet
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Elige entre miles de productos digitales premium, comparte tu enlace único y recibe comisiones automáticas por cada venta. <strong className="text-foreground">Sin producto propio. Sin experiencia requerida.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button size="lg" variant="contrast" className="gap-2 text-base font-bold px-8 py-4 h-auto" onClick={onRegister}>
              <Rocket className="size-5" /> Registrarme gratis ahora
            </Button>
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              ¿Cómo funciona? <ArrowRight className="size-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "Gratis", label: "Sin costo de registro" },
              { value: "Hasta 40%", label: "Comisión máxima" },
              { value: "30 días", label: "Duración de cookie" },
              { value: "Instantáneo", label: "Acceso a tus enlaces" },
            ].map(s => (
              <div key={s.label} className="bg-surface/60 backdrop-blur border border-border rounded-2xl py-4 px-3">
                <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div id="como-funciona" className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Cómo funciona</h2>
          <p className="text-muted-foreground">4 pasos simples para empezar a ganar dinero hoy</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", icon: Gift, title: "Regístrate gratis", desc: "Crea tu cuenta de afiliado en menos de 2 minutos. Sin costo, sin tarjeta de crédito." },
            { step: "02", icon: Package, title: "Elige tus productos", desc: "Explora miles de productos digitales y selecciona los que mejor se adapten a tu audiencia." },
            { step: "03", icon: Share2, title: "Comparte tu enlace", desc: "Genera tu enlace único y compártelo en redes sociales, WhatsApp, email o tu blog." },
            { step: "04", icon: DollarSign, title: "Cobra tus comisiones", desc: "Gana hasta 40% por cada venta. Pagos automáticos cada 15 días a tu cuenta bancaria." },
          ].map((item, i) => (
            <div key={i} className="relative bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group">
              <div className="text-6xl font-black text-primary/10 absolute top-4 right-4 select-none">{item.step}</div>
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="size-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commission table */}
      <div className="bg-surface/50 border-y border-border py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Comisiones por categoría</h2>
            <p className="text-muted-foreground">Cuánto ganas por cada categoría de producto vendido</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat.key} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all">
                <div className="size-12 rounded-xl bg-primary/5 border border-border flex items-center justify-center shrink-0">
                  <cat.icon className={`size-6 ${cat.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{cat.label}</div>
                  <div className="text-xs text-muted-foreground">Por cada venta</div>
                </div>
                <div className={`text-3xl font-black ${cat.color}`}>{cat.rate}%</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Las comisiones se calculan sobre el precio final de venta (IVA incluido) y se acreditan en tu cuenta dentro de las 24 horas posteriores a la compra.</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Todo lo que necesitas para vender</h2>
          <p className="text-muted-foreground">Herramientas profesionales incluidas sin costo adicional</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Link2, title: "Links únicos de seguimiento", desc: "URLs únicas por producto con seguimiento de clicks y conversiones en tiempo real." },
            { icon: BarChart3, title: "Dashboard de estadísticas", desc: "Visualiza clicks, conversiones, ingresos y tendencias en tu panel personalizado." },
            { icon: MessageSquare, title: "Materiales de marketing", desc: "Textos persuasivos, banners y templates listos para compartir en tus canales." },
            { icon: Shield, title: "Cookie de 30 días", desc: "Si alguien hace clic hoy y compra en 30 días, la comisión es tuya. Siempre." },
            { icon: Wallet, title: "Pagos automáticos", desc: "Recibe tus comisiones cada 15 días en tu cuenta Bancolombia, Nequi o Daviplata." },
            { icon: Globe, title: "Vende en toda Latinoamérica", desc: "Los productos son digitales. Tu audiencia puede estar en cualquier país de habla hispana." },
          ].map((f, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-all">
              <f.icon className="size-6 text-primary mb-3" />
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <div className="bg-primary/5 border-y border-primary/10 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-10">Lo que dicen nuestros afiliados</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Carlos M.", city: "Bogotá", amount: "$4.2M/mes", text: "En 3 meses pasé de 0 a ganar más de $4 millones al mes. Solo comparto los links en mis historias de Instagram." },
              { name: "Laura P.", city: "Medellín", amount: "$1.8M/mes", text: "Soy profesora y en mis ratos libres genero ingresos extra. Lo mejor es que es pasivo: el link trabaja por mí." },
              { name: "Diego R.", city: "Cali", amount: "$7.6M/mes", text: "Tengo un canal de YouTube sobre tecnología. Los productos de software se venden solos. Es increíble." },
            ].map((t, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6 text-left">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="size-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-primary">{t.amount}</div>
                    <div className="text-[10px] text-muted-foreground">promedio</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-3">Preguntas frecuentes</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-sm">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="size-4 text-muted-foreground shrink-0" /> : <ChevronDown className="size-4 text-muted-foreground shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-y border-primary/20 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">¿Listo para empezar a ganar?</h2>
          <p className="text-muted-foreground mb-8">Empieza a generar ingresos con PULSE AI hoy mismo. Registro gratuito, sin compromisos.</p>
          <Button size="lg" variant="contrast" className="gap-2 text-base font-bold px-10 py-4 h-auto" onClick={onRegister}>
            <Rocket className="size-5" /> Registrarme como afiliado gratis
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Sin tarjeta de crédito · Sin cuotas mensuales · Cancela cuando quieras</p>
        </div>
      </div>
    </div>
  );
}

// ─── Affiliate Dashboard ───────────────────────────────────────────────────────

function AffiliateDashboard() {
  const {
    affiliateCode, affiliateEarnings, affiliatePendingEarnings,
    affiliateTotalClicks, affiliateTotalConversions, affiliateLinks,
    affiliatePayments, generateAffiliateLink, trackAffiliateClick,
  } = useUserStore();
  const allListings = useAllListings();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [generatedLink, setGeneratedLink] = useState<AffiliateLink | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [marketingTab, setMarketingTab] = useState<"texto" | "banner" | "email">("texto");

  const conversionRate = affiliateTotalClicks > 0 ? ((affiliateTotalConversions / affiliateTotalClicks) * 100).toFixed(1) : "0.0";

  const handleGenerate = () => {
    if (!selectedProduct) { toast.error("Selecciona un producto"); return; }
    const listing = allListings.find(l => l.id === selectedProduct);
    if (!listing) return;
    const link = generateAffiliateLink({ id: listing.id, name: listing.name, image: listing.image, price: listing.price, category: listing.category });
    setGeneratedLink(link);
    toast.success("¡Enlace generado! Cópialo y compártelo.");
  };

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    trackAffiliateClick(id);
    setCopiedId(id);
    toast.success("¡Enlace copiado al portapapeles!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareOnWhatsApp = (link: AffiliateLink) => {
    const text = `🚀 Te comparto este increíble producto digital: *${link.productName}* por solo ${fmtCOP(link.productPrice)} COP.\n\nDescárgalo aquí: ${link.url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const marketingTexts = generatedLink ? [
    { platform: "Instagram/Facebook", text: `💥 ¡OFERTA IMPERDIBLE! ${generatedLink.productName} — solo ${fmtCOP(generatedLink.productPrice)} COP. Descarga instantánea 📲 Link en mi bio ➡️ ${generatedLink.url} #ProductosDigitales #Colombia #Emprendimiento` },
    { platform: "WhatsApp", text: `Hola 👋 Te recomiendo este producto digital: *${generatedLink.productName}*\n💰 Precio: ${fmtCOP(generatedLink.productPrice)}\n⚡ Descarga inmediata\n🔗 ${generatedLink.url}` },
    { platform: "Email", text: `Asunto: Te recomiendo este producto que me cambió la vida\n\nHola [nombre],\n\nQuiero compartirte algo que me pareció increíble: ${generatedLink.productName}.\n\nPuedes descargarlo aquí: ${generatedLink.url}\n\nPrecio: ${fmtCOP(generatedLink.productPrice)} — con descarga inmediata.\n\n¡Espero que te sea muy útil!` },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-2">
            <CheckCircle2 className="size-3" /> Afiliado Verificado
          </div>
          <h1 className="text-2xl font-black">Panel de Afiliado</h1>
          <div className="text-sm text-muted-foreground mt-1 font-mono">Código: <span className="font-bold text-foreground">{affiliateCode}</span></div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { navigator.clipboard.writeText(`https://pulseai.io/marketplace?ref=${affiliateCode}`); toast.success("Link de afiliado copiado"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/20 text-sm text-primary hover:bg-primary/5 transition-colors font-medium"
          >
            <Link2 className="size-4" /> Copiar mi link
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Ganancias totales", value: fmtCOP(affiliateEarnings), icon: DollarSign, color: "text-emerald-400", sub: "Acumulado" },
          { label: "Pendiente de pago", value: fmtCOP(affiliatePendingEarnings), icon: Clock, color: "text-yellow-400", sub: "Próximo ciclo" },
          { label: "Clicks totales", value: affiliateTotalClicks.toLocaleString("es-CO"), icon: TrendingUp, color: "text-blue-400", sub: "En todos tus links" },
          { label: "Tasa de conversión", value: `${conversionRate}%`, icon: BarChart3, color: "text-primary", sub: `${affiliateTotalConversions} ventas` },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
            <s.icon className={`size-5 mb-2 ${s.color}`} />
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs font-medium text-foreground mt-0.5">{s.label}</div>
            <div className="text-[10px] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Link generator */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Link2 className="size-5 text-primary" /> Generador de enlaces de afiliado
        </h2>
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="flex-1 min-w-0 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="">— Selecciona un producto —</option>
            {allListings.slice(0, 20).map(l => (
              <option key={l.id} value={l.id}>{l.name} — {fmtCOP(l.price)}</option>
            ))}
          </select>
          <Button variant="contrast" className="gap-2 shrink-0" onClick={handleGenerate}>
            <Zap className="size-4" /> Generar enlace
          </Button>
        </div>

        {generatedLink && (
          <div className="mt-5 space-y-4">
            <div className="bg-background border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs font-bold text-primary">Tu enlace de afiliado</div>
                <span className="text-[10px] text-muted-foreground bg-surface px-2 py-0.5 rounded-full border border-border">{generatedLink.commissionRate}% comisión</span>
              </div>
              <div className="flex items-center gap-3">
                <input value={generatedLink.url} readOnly className="flex-1 bg-transparent text-xs font-mono text-muted-foreground min-w-0" />
                <button onClick={() => copyLink(generatedLink.url, generatedLink.id)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shrink-0 ${copiedId === generatedLink.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"}`}>
                  {copiedId === generatedLink.id ? <Check className="size-3" /> : <Copy className="size-3" />}
                  {copiedId === generatedLink.id ? "Copiado" : "Copiar"}
                </button>
                <button onClick={() => shareOnWhatsApp(generatedLink)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all shrink-0">
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Marketing materials */}
            <div>
              <div className="text-xs font-bold mb-2">Materiales de marketing listos para usar</div>
              <div className="flex gap-1 mb-3">
                {(["texto", "banner", "email"] as const).map(t => (
                  <button key={t} onClick={() => setMarketingTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${marketingTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                    {t === "texto" ? "Red Social" : t === "banner" ? "WhatsApp" : "Email"}
                  </button>
                ))}
              </div>
              {marketingTexts.map((mt, i) => (
                <div key={i} className={`${(marketingTab === "texto" && i === 0) || (marketingTab === "banner" && i === 1) || (marketingTab === "email" && i === 2) ? "block" : "hidden"}`}>
                  <div className="relative">
                    <pre className="bg-background border border-border rounded-xl p-4 text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto">{mt.text}</pre>
                    <button onClick={() => { navigator.clipboard.writeText(mt.text); toast.success("Texto copiado"); }} className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-surface border border-border px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                      <Copy className="size-3" /> Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* My links */}
      {affiliateLinks.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" /> Mis enlaces activos
          </h2>
          <div className="space-y-3">
            {affiliateLinks.map(link => (
              <div key={link.id} className="bg-background border border-border rounded-xl p-4">
                <div className="flex items-start gap-4 flex-wrap">
                  <img src={link.productImage} alt={link.productName} className="size-14 rounded-xl object-cover border border-border shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{link.productName}</div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{link.url}</div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><TrendingUp className="size-3" /> {link.clicks} clicks</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users className="size-3" /> {link.conversions} ventas</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{fmtCOP(link.earnings)} ganados</span>
                      <span className="text-[10px] text-primary font-bold">{link.commissionRate}% comisión</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => copyLink(link.url, link.id)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${copiedId === link.id ? "border-emerald-500/20 text-emerald-400" : "border-border text-muted-foreground hover:text-primary hover:border-primary/20"}`}>
                      {copiedId === link.id ? <Check className="size-3" /> : <Copy className="size-3" />}
                      {copiedId === link.id ? "Copiado" : "Copiar"}
                    </button>
                    <button onClick={() => shareOnWhatsApp(link)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-[#25D366] hover:border-[#25D366]/20 transition-all">
                      <ExternalLink className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      {affiliatePayments.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Wallet className="size-5 text-primary" /> Historial de pagos
          </h2>
          <div className="space-y-2">
            {affiliatePayments.map(p => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-background border border-border rounded-xl">
                <div>
                  <div className="text-sm font-medium">Pago de comisiones</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(p.date).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-400">{fmtCOP(p.amount)}</div>
                  <div className={`text-[10px] font-bold ${p.status === "paid" ? "text-emerald-400" : "text-yellow-400"}`}>
                    {p.status === "paid" ? "✓ Pagado" : "⏳ Pendiente"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Próximo pago estimado</span>
            <div className="text-right">
              <div className="font-extrabold text-primary">{fmtCOP(affiliatePendingEarnings)}</div>
              <div className="text-[10px] text-muted-foreground">En los próximos 15 días</div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Goals */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Target className="size-5 text-primary" /> Metas del mes
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Alcanza tus metas y desbloquea bonos adicionales.</p>
        <div className="space-y-5">
          {[
            { label: "Clicks generados", current: affiliateTotalClicks, goal: 500, unit: "clicks", reward: "$15.000 bono", color: "bg-blue-400" },
            { label: "Ventas concretadas", current: affiliateTotalConversions, goal: 10, unit: "ventas", reward: "$50.000 bono", color: "bg-emerald-400" },
            { label: "Comisiones ganadas", current: affiliateEarnings, goal: 500000, unit: "COP", reward: "Nivel Diamante", color: "bg-primary", isCurrency: true },
          ].map(g => {
            const pct = Math.min(100, (g.current / g.goal) * 100);
            return (
              <div key={g.label}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">{g.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {g.isCurrency ? fmtCOP(g.current) : g.current.toLocaleString("es-CO")} / {g.isCurrency ? fmtCOP(g.goal) : g.goal.toLocaleString("es-CO")} {!g.isCurrency && g.unit}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-black/20 overflow-hidden mb-1.5">
                  <div className={`h-full rounded-full ${g.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{Math.round(pct)}% completado</span>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                    <Gift className="size-3" /> {g.reward}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Trophy className="size-5 text-yellow-400" /> Top Afiliados del Mes
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Compite con otros afiliados y gana bonos exclusivos de temporada.</p>
        <div className="space-y-3">
          {[
            { pos: 1, name: "Carlos M.", city: "Bogotá", earnings: 4200000, sales: 84, badge: "🥇" },
            { pos: 2, name: "Diego R.", city: "Cali", earnings: 3800000, sales: 76, badge: "🥈" },
            { pos: 3, name: "Laura P.", city: "Medellín", earnings: 1800000, sales: 36, badge: "🥉" },
            { pos: 4, name: "Ana G.", city: "Barranquilla", earnings: 1200000, sales: 24, badge: "4°" },
            { pos: 5, name: "Tú", city: "—", earnings: affiliateEarnings, sales: affiliateTotalConversions, badge: "—", isMe: true },
          ].map(a => (
            <div key={a.pos} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${(a as {isMe?: boolean}).isMe ? "border-primary/30 bg-primary/5" : "border-border hover:bg-black/5"}`}>
              <div className="text-lg w-8 text-center shrink-0">{a.badge}</div>
              <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                {a.name.split(" ")[0][0]}{a.name.split(" ")[1]?.[0] ?? ""}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-1.5">
                  {a.name}
                  {(a as {isMe?: boolean}).isMe && <span className="text-[9px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-full">TÚ</span>}
                </div>
                <div className="text-[10px] text-muted-foreground">{a.city} · {a.sales} ventas</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-sm text-emerald-400">{fmtCOP(a.earnings)}</div>
                <div className="text-[9px] text-muted-foreground">este mes</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">El top 3 recibe un bono adicional del <strong className="text-primary">5% extra</strong> en sus comisiones del próximo ciclo.</p>
        </div>
      </div>

      {/* Income Projection */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" /> Proyección de ingresos
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Basada en tu tasa de conversión actual y tendencias del marketplace.</p>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Este mes (estimado)", value: fmtCOP(affiliateEarnings + affiliatePendingEarnings), color: "text-foreground" },
            { label: "Si duplicas tus clicks", value: fmtCOP((affiliateEarnings + affiliatePendingEarnings) * 2), color: "text-primary" },
            { label: "Potencial a 90 días", value: fmtCOP((affiliateEarnings + affiliatePendingEarnings) * 3.5), color: "text-emerald-400" },
          ].map(p => (
            <div key={p.label} className="bg-background border border-border rounded-xl p-4 text-center">
              <div className={`text-xl font-extrabold ${p.color}`}>{p.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{p.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { icon: Flame, text: "Publica 2 posts semanales con tu enlace para triplicar los clicks.", color: "text-orange-400" },
            { icon: Zap, text: "Los productos de software generan 30% más comisión. Priorízalos.", color: "text-yellow-400" },
            { icon: Share2, text: "WhatsApp tiene la tasa de conversión más alta (8.4%). Úsalo primero.", color: "text-emerald-400" },
          ].map(tip => (
            <div key={tip.text} className="flex items-start gap-3 p-3 rounded-xl bg-black/20 border border-border">
              <tip.icon className={`size-4 ${tip.color} shrink-0 mt-0.5`} />
              <p className="text-xs text-muted-foreground">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Training Center */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Lightbulb className="size-5 text-yellow-400" /> Centro de formación
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Aprende las mejores estrategias de los afiliados top de PULSE AI.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Play, title: "Cómo crear contenido viral para vender", duration: "12 min", category: "Video", new: true },
            { icon: BookOpen, title: "Guía: WhatsApp Marketing para afiliados", duration: "8 min lectura", category: "Guía" },
            { icon: BarChart3, title: "Análisis: qué productos convierten más en 2025", duration: "15 min lectura", category: "Análisis", new: true },
            { icon: Award, title: "Casos de éxito: de $0 a $4M/mes en 3 meses", duration: "20 min lectura", category: "Caso de éxito" },
          ].map(r => (
            <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-white/2 transition-all group cursor-pointer">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <r.icon className="size-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider">{r.category}</span>
                  {r.new && <span className="text-[8px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">NUEVO</span>}
                </div>
                <div className="text-sm font-semibold leading-tight mb-1">{r.title}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {r.duration}
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Registration Modal ────────────────────────────────────────────────────────

function RegisterModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Rocket className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-black mb-2">Registro de Afiliado</h2>
          <p className="text-sm text-muted-foreground">Último paso para empezar a ganar comisiones</p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            `Comisiones del 20% al 40% por venta`,
            `Pagos automáticos cada 15 días`,
            `Panel de estadísticas en tiempo real`,
            `Materiales de marketing incluidos`,
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="size-4 mt-0.5 accent-primary shrink-0" />
          <span className="text-xs text-muted-foreground">
            Acepto los <a href="/terminos" target="_blank" className="text-primary underline">Términos de Afiliados</a> y la <a href="/privacidad" target="_blank" className="text-primary underline">Política de Privacidad</a> de PULSE AI.
          </span>
        </label>

        <div className="flex gap-3">
          <Button variant="contrast" className="flex-1 gap-2 font-bold" onClick={onConfirm} disabled={!accepted}>
            <Rocket className="size-4" /> Confirmar registro
          </Button>
          <Button variant="outline" className="border-border" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function AfiliadosPage() {
  const { user } = useAuth();
  const { isAffiliate, becomeAffiliate } = useUserStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleRegisterClick = () => {
    if (!user) { setShowAuth(true); return; }
    setShowRegisterModal(true);
  };

  const handleConfirmRegister = () => {
    becomeAffiliate();
    setShowRegisterModal(false);
    toast.success("🎉 ¡Bienvenido al programa de afiliados! Ya puedes generar tus primeros enlaces.", { duration: 5000 });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <BackToMarketplace label="Marketplace" />

      {isAffiliate && user ? (
        <AffiliateDashboard />
      ) : (
        <AffiliateLanding onRegister={handleRegisterClick} />
      )}

      <SiteFooter />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} onConfirm={handleConfirmRegister} />}
    </div>
  );
}
