import { useState, useRef, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fmtCOPStore, type VendorProduct } from "@/lib/products-store";
import { useAuth } from "@/lib/auth-context";
import { useCreateProduct } from "@/lib/db";
import {
  UploadCloud, Link2, Image, FileText, Package, KeyRound,
  Tag, Check, Copy, ExternalLink, Facebook, Instagram,
  MessageCircle, ArrowRight, Sparkles, Star, Eye, ShoppingCart,
  Flame, ChevronDown, X, Globe, Play, Share2, Zap, Download,
  Music, QrCode, BarChart3, Rocket,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/products/new")({
  head: () => ({ meta: [{ title: "Nuevo Producto — PULSE AI" }] }),
  component: NewProduct,
});

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "software", label: "Software & SaaS", emoji: "💻" },
  { id: "education", label: "Cursos & Educación", emoji: "🎓" },
  { id: "resources", label: "Plantillas & Recursos", emoji: "🎨" },
  { id: "books", label: "eBooks & Guías", emoji: "📚" },
  { id: "services", label: "Servicios", emoji: "⚡" },
];

const LICENSE_TYPES = [
  { id: "personal", label: "Personal (1 dispositivo)" },
  { id: "pro", label: "Profesional (hasta 5)" },
  { id: "business", label: "Empresarial (equipo)" },
  { id: "whitelabel", label: "White Label (ilimitado)" },
];

const BADGE_OPTIONS = [
  { id: "new", label: "✨ Nuevo", cls: "bg-blue-500 text-white" },
  { id: "oferta", label: "🏷️ Oferta", cls: "bg-red-500 text-white" },
  { id: "featured", label: "⭐ Destacado", cls: "bg-yellow-500 text-black" },
  { id: "bestseller", label: "🔥 Más Vendido", cls: "bg-orange-500 text-white" },
] as const;

const SOCIAL_PLATFORMS = [
  {
    id: "facebook",
    label: "Facebook Ads",
    icon: Facebook,
    color: "#1877F2",
    utm: "facebook_ads",
    textTemplate: (name: string, price: number, url: string) =>
      `🚀 ¡Nuevo en PULSE AI!\n\n✅ ${name}\n💰 Solo ${fmtCOPStore(price)} COP — descarga instantánea\n🔒 Garantía 7 días sin preguntas\n📦 Acceso de por vida\n\n👇 Consíguelo ahora:\n${url}\n\n#ProductosDigitales #Colombia #DescargaInstantanea #PULSEAI`,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    color: "#E1306C",
    utm: "instagram",
    textTemplate: (name: string, price: number, url: string) =>
      `✨ ${name} ya disponible en PULSE AI 🔥\n\n💰 ${fmtCOPStore(price)} COP · descarga al instante\n✅ Garantía 7 días total\n\n🔗 Link en bio → pulseai.co\n\n#DesarrolloDigital #Emprendimiento #Colombia #TechLatam`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    color: "#25D366",
    utm: "whatsapp",
    textTemplate: (name: string, price: number, url: string) =>
      `Hola 👋 Mira este producto que acabo de publicar:\n\n🔥 *${name}*\n\nPrecio: *${fmtCOPStore(price)} COP*\n✅ Descarga instantánea\n✅ Garantía 7 días\n\n👉 ${url}`,
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: Music,
    color: "#ffffff",
    utm: "tiktok",
    textTemplate: (name: string, price: number, url: string) =>
      `¿Sabías que puedes comprar ${name} por solo ${fmtCOPStore(price)} COP? 🤯 Descarga instantánea en PULSE AI 🚀 ${url} #DigitalProducts #PULSEAI #Tech #Emprendimiento`,
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[11px] text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded border border-primary/20 hover:border-primary/40"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "¡Copiado!" : label}
    </button>
  );
}

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t) && tags.length < 8) {
      onChange([...tags, t]);
      setInput("");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[36px]">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
            {t}
            <button onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-destructive transition-colors">
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="IA, Python, PDF... (Enter para agregar)"
          className="bg-black/20 h-9 text-sm flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={add} className="h-9">
          <Tag className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─── Image Drop Zone ──────────────────────────────────────────────────────────

function ImageDropZone({ image, onImage }: { image: string; onImage: (b64: string, file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const read = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Solo se aceptan imágenes"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Máximo 5 MB por imagen"); return; }
    const reader = new FileReader();
    reader.onload = e => onImage(e.target?.result as string, file);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) read(file);
  }, []);

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : image ? "border-transparent" : "border-border hover:border-primary/40"}`}
      style={{ aspectRatio: "16/9" }}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) read(f); }}
      />
      {image ? (
        <>
          <img src={image} alt="Portada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-white text-sm font-medium flex items-center gap-2">
              <Image className="size-4" /> Cambiar imagen
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Image className="size-6 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold mb-1">Portada del producto</div>
            <div className="text-xs text-muted-foreground">Arrastra una imagen o haz clic para seleccionar</div>
            <div className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG, WEBP · Máximo 5 MB · Recomendado 1280×720</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── File Drop Zone ───────────────────────────────────────────────────────────

function FileDropZone({
  fileName, fileSize, fileExt, onFile,
}: {
  fileName: string; fileSize: string; fileExt: string;
  onFile: (name: string, size: string, ext: string, file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const read = (file: File) => {
    const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    const size = file.size > 1024 * 1024 * 1024
      ? `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
      : `${mb} MB`;
    onFile(file.name, size, ext, file);
    toast.success(`"${file.name}" listo para subir`);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) read(file);
  }, []);

  if (fileName) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-mono font-bold text-primary">{fileExt}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{fileName}</div>
          <div className="text-[11px] text-muted-foreground">{fileSize} · Listo para distribuir vía CDN</div>
        </div>
        <button
          onClick={() => { onFile("", "", "", null); }}
          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center gap-3 ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/40"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) read(f); }} />
      <UploadCloud className={`size-8 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`} />
      <div>
        <div className="text-sm font-medium">Arrastra tu archivo aquí</div>
        <div className="text-xs text-muted-foreground mt-0.5">o haz clic para seleccionar</div>
        <div className="text-[10px] text-muted-foreground/60 mt-1">ZIP, PDF, MP4, EXE, APK, EPUB... · Hasta 10 GB</div>
      </div>
    </div>
  );
}

// ─── Marketplace Preview Card ─────────────────────────────────────────────────

function PreviewCard({ name, tagline, price, originalPrice, badge, image, rating, tags, vendor }: {
  name: string; tagline: string; price: number; originalPrice: number;
  badge: string; image: string; rating: number; tags: string[]; vendor: string;
}) {
  const discount = originalPrice > price && originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0;
  const badgeCfg: Record<string, { label: string; cls: string }> = {
    new: { label: "✨ Nuevo", cls: "bg-blue-500 text-white" },
    oferta: { label: "🏷️ Oferta", cls: "bg-red-500 text-white" },
    featured: { label: "⭐ Destacado", cls: "bg-yellow-500 text-black" },
    bestseller: { label: "🔥 Más Vendido", cls: "bg-orange-500 text-white" },
  };
  const bc = badge ? badgeCfg[badge] : null;

  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden text-xs shadow-xl">
      <div className="relative" style={{ aspectRatio: "4/3" }}>
        {image ? (
          <img src={image} className="w-full h-full object-cover" alt="" />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <Image className="size-8 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {bc && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold ${bc.cls}`}>
            {bc.label}
          </span>
        )}
        {discount >= 10 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">
            -{discount}% OFF
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
          <Eye className="size-2.5 text-primary" />
          <span className="text-[9px] text-white font-mono">12 viendo</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[9px] text-muted-foreground mb-1">{vendor || "Tu tienda"}</div>
        <div className="font-bold text-[11px] mb-1 line-clamp-1">{name || "Nombre del producto"}</div>
        <div className="text-muted-foreground text-[10px] mb-2 line-clamp-2">{tagline || "Descripción corta del producto..."}</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {(tags.length > 0 ? tags : ["Tag"]).slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-black/20 border border-border text-[9px] text-muted-foreground">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`size-2.5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
          ))}
          <span className="text-[9px] font-bold ml-0.5">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div>
            <div className="font-extrabold text-primary text-sm">{price > 0 ? fmtCOPStore(price) : "$0"}</div>
            {originalPrice > price && originalPrice > 0 && (
              <div className="text-[9px] text-muted-foreground line-through">{fmtCOPStore(originalPrice)}</div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-primary/60">
            <ShoppingCart className="size-3" /> Comprar
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Social Sharing Post-Publish Panel ───────────────────────────────────────

function PublishSuccessPanel({ product }: { product: VendorProduct }) {
  const [activePlatform, setActivePlatform] = useState("facebook");
  const [utmCampaign, setUtmCampaign] = useState("launch");
  const navigate = useNavigate();

  const baseUrl = "https://pulseai.co/marketplace";
  const utmUrl = (platform: string) =>
    `${baseUrl}?utm_source=${platform}&utm_medium=social&utm_campaign=${utmCampaign}&utm_content=${product.id}`;

  const platform = SOCIAL_PLATFORMS.find(p => p.id === activePlatform) || SOCIAL_PLATFORMS[0];
  const shareUrl = utmUrl(platform.utm);
  const postText = platform.textTemplate(product.name, product.price, shareUrl);

  const openFBShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=500");
  };

  const openFBAds = () => {
    window.open("https://www.facebook.com/adsmanager/creation", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-primary/5 to-emerald-500/5 border border-emerald-500/20 p-6 text-center">
        <div className="relative mx-auto size-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="size-9 text-emerald-400" />
          </div>
        </div>
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">¡Publicado exitosamente!</div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Tu producto está en el Marketplace</h2>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">"{product.name}"</span> ya está visible para compradores en todo el mundo.
          Ahora promociónalo en tus redes para generar ventas.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Link
            to="/marketplace"
            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="size-3.5" /> Ver en el Marketplace
          </Link>
          <Link
            to="/dashboard/products"
            className="flex items-center gap-1.5 text-xs border border-border px-4 py-2.5 rounded-xl hover:border-primary/20 hover:text-foreground text-muted-foreground transition-colors"
          >
            <BarChart3 className="size-3.5" /> Ver mis productos
          </Link>
        </div>
      </div>

      {/* Link + UTM */}
      <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <QrCode className="size-4 text-primary" />
          <div className="text-sm font-bold">Link de tu producto</div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Nombre de la campaña (UTM)</Label>
          <div className="flex gap-2">
            <Input
              value={utmCampaign}
              onChange={e => setUtmCampaign(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              className="bg-black/20 h-9 text-sm font-mono flex-1"
              placeholder="launch_junio"
            />
          </div>
        </div>

        <div className="rounded-xl bg-black/20 border border-border p-3 flex items-center gap-2">
          <div className="text-xs font-mono text-muted-foreground flex-1 truncate">
            {utmUrl("facebook")}
          </div>
          <CopyButton text={utmUrl("facebook")} label="Copiar" />
        </div>
      </div>

      {/* Platform selector */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {SOCIAL_PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id)}
              style={{ borderBottomColor: activePlatform === p.id ? p.color : "transparent" }}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${activePlatform === p.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <p.icon className="size-3.5" style={{ color: p.color }} />
              {p.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Post text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Texto para publicar</Label>
              <CopyButton text={postText} label="Copiar texto" />
            </div>
            <div className="rounded-xl bg-black/20 border border-border p-3 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">
              {postText}
            </div>
          </div>

          {/* Link con UTM para esta plataforma */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Link con seguimiento UTM</Label>
              <CopyButton text={utmUrl(platform.utm)} />
            </div>
            <div className="rounded-xl bg-black/20 border border-border px-3 py-2 text-[11px] font-mono text-muted-foreground break-all">
              {utmUrl(platform.utm)}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {activePlatform === "facebook" && (
              <>
                <button
                  onClick={openFBShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#1877F2" }}
                >
                  <Facebook className="size-3.5" /> Compartir en Facebook
                </button>
                <button
                  onClick={openFBAds}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/5 transition-colors"
                >
                  <BarChart3 className="size-3.5" /> Crear Anuncio (Meta Ads)
                </button>
              </>
            )}
            {activePlatform === "whatsapp" && (
              <a
                href={`https://wa.me/?text=${encodeURIComponent(postText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="size-3.5" /> Enviar por WhatsApp
              </a>
            )}
            {activePlatform === "instagram" && (
              <a
                href="https://www.instagram.com/profeia_oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(45deg, #F09433 0%, #E6683C 25%, #DC2743 50%, #CC2366 75%, #BC1888 100%)" }}
              >
                <Instagram className="size-3.5" /> Abrir Instagram
              </a>
            )}
            {activePlatform === "tiktok" && (
              <a
                href="https://www.tiktok.com/@feskawsay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-white hover:border-white/40 transition-colors bg-black"
              >
                <Music className="size-3.5" /> Abrir TikTok
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Facebook Pixel guide */}
      <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Facebook className="size-4 text-[#1877F2]" />
          <div className="text-sm font-bold">Instala el Pixel de Facebook</div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Recomendado</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Instala el Meta Pixel en tu sitio para rastrear conversiones, crear audiencias personalizadas y optimizar tus anuncios de Facebook e Instagram automáticamente.
        </p>
        <div className="rounded-xl bg-black/30 border border-border p-3 font-mono text-[10px] text-muted-foreground">
          <div className="text-primary/70 mb-1">{`<!-- Agrega esto en el <head> de tu sitio -->`}</div>
          <div>{`<!-- Meta Pixel Code -->`}</div>
          <div className="text-muted-foreground/60">{`<script>`}</div>
          <div className="ml-2">{`!function(f,b,e,v,n,t,s){...}`}</div>
          <div className="text-muted-foreground/60">{`</script>`}</div>
          <div>{`<!-- End Meta Pixel Code -->`}</div>
        </div>
        <a
          href="https://www.facebook.com/business/help/952192354843755"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink className="size-3" /> Ver guía completa de instalación →
        </a>
      </div>

      {/* Stats preview */}
      <div className="rounded-2xl bg-surface border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="size-4 text-primary" />
          <div className="text-sm font-bold">Estadísticas iniciales</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Vistas hoy", value: "0", icon: Eye, color: "text-primary" },
            { label: "Ventas", value: "0", icon: ShoppingCart, color: "text-emerald-400" },
            { label: "Ingresos", value: "$0", icon: Zap, color: "text-yellow-400" },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-black/20 border border-border">
              <s.icon className={`size-4 mx-auto mb-1 ${s.color}`} />
              <div className="text-lg font-extrabold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate({ to: "/dashboard/products/new" })}
        className="w-full flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors"
      >
        <Package className="size-4" /> Publicar otro producto
      </button>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function NewProduct() {
  const { user } = useAuth();
  const createProduct = useCreateProduct();

  const [publishedProduct, setPublishedProduct] = useState<VendorProduct | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("education");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [deliveryType, setDeliveryType] = useState<"file" | "link">("file");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [licenseType, setLicenseType] = useState("personal");
  const [activations, setActivations] = useState(3);
  const [generateKey, setGenerateKey] = useState(true);
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [recurring, setRecurring] = useState(false);
  const [badge, setBadge] = useState<"new" | "featured" | "bestseller" | "oferta">("new");

  const validate = () => {
    if (!name.trim()) { toast.error("El nombre del producto es obligatorio"); return false; }
    if (!tagline.trim()) { toast.error("La descripción corta es obligatoria"); return false; }
    if (price <= 0) { toast.error("Define un precio mayor a $0"); return false; }
    if (deliveryType === "file" && !fileName) { toast.error("Sube el archivo del producto o elige un link externo"); return false; }
    if (deliveryType === "link" && !downloadUrl) { toast.error("Ingresa la URL de descarga"); return false; }
    return true;
  };

  const handlePublish = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        price,
        recurring,
        status: "live",
        licensing_enabled: generateKey,
        imageFile: coverFile,
        productFile: deliveryType === "file" ? productFile : null,
        downloadUrl: deliveryType === "link" ? downloadUrl.trim() : undefined,
        fileName: fileName.trim(),
      });
    } catch (e) {
      setSaving(false);
      toast.error(e instanceof Error ? e.message : "No se pudo publicar el producto");
      return;
    }

    const product: VendorProduct = {
      id: `vp-${Date.now()}`,
      vendorId: user?.id || "demo",
      vendorName: user?.name || "Mi Tienda",
      vendorInitials: user?.initials || "MT",
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      tags,
      coverImage,
      deliveryType,
      fileName, fileSize, fileExt,
      downloadUrl,
      licenseType,
      activations,
      generateKey,
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      currency: "COP",
      recurring,
      badge,
      status: "live",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sales: 0,
      reviews: 0,
      rating: 5.0,
      soldToday: 0,
      viewers: 0,
    };

    setSaving(false);
    setPublishedProduct(product);
    toast.success(`🚀 "${product.name}" publicado en el Marketplace`);
  };

  const handleDraft = async () => {
    if (!name.trim()) { toast.error("Agrega un nombre primero"); return; }
    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        price,
        recurring,
        status: "draft",
        licensing_enabled: generateKey,
        imageFile: coverFile,
        productFile: deliveryType === "file" ? productFile : null,
        downloadUrl: deliveryType === "link" ? downloadUrl.trim() : undefined,
        fileName: fileName.trim(),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar el borrador");
      return;
    }
    toast("Borrador guardado");
  };

  if (publishedProduct) {
    return (
      <DashboardLayout
        title="Producto Publicado"
        breadcrumb={["Dashboard", "Productos", "Publicado"]}
        actions={
          <Link to="/marketplace">
            <Button size="sm" variant="contrast" className="gap-1.5">
              <ExternalLink className="size-3.5" /> Ver en Marketplace
            </Button>
          </Link>
        }
      >
        <div className="max-w-2xl mx-auto">
          <PublishSuccessPanel product={publishedProduct} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Nuevo Producto"
      breadcrumb={["Dashboard", "Productos", "Nuevo"]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDraft}>Guardar borrador</Button>
          <Button
            variant="contrast" size="sm"
            onClick={handlePublish}
            disabled={saving}
            className="gap-1.5"
          >
            {saving ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Rocket className="size-3.5" />
            )}
            {saving ? "Publicando..." : "Publicar ahora"}
          </Button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Left: Main Form ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Cover Image */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Image className="size-4 text-primary" />
              <h3 className="text-sm font-bold">Imagen de portada</h3>
              <span className="text-[10px] text-muted-foreground">· Recomendado 1280×720</span>
            </div>
            <ImageDropZone image={coverImage} onImage={(b64, file) => { setCoverImage(b64); setCoverFile(file); }} />
          </div>

          {/* Product Info */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-primary" />
              <h3 className="text-sm font-bold">Información del producto</h3>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nombre del producto *</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Masterclass IA Engineering Completa"
                className="bg-black/20 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Descripción corta (para la tarjeta del marketplace) *</Label>
              <Input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Ej: 40 videos HD · de cero a sistemas IA en producción"
                className="bg-black/20 h-11"
                maxLength={120}
              />
              <div className="text-[10px] text-muted-foreground text-right">{tagline.length}/120</div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Descripción completa</Label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe qué incluye tu producto, a quién va dirigido, qué aprenderá o recibirá el comprador..."
                rows={5}
                className="bg-black/20 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Categoría</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      category === c.id
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground bg-black/10"
                    }`}
                  >
                    <span>{c.emoji}</span> {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Etiquetas de búsqueda</Label>
              <TagsInput tags={tags} onChange={setTags} />
            </div>
          </div>

          {/* Content Delivery */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
            <div className="flex items-center gap-2">
              <UploadCloud className="size-4 text-primary" />
              <h3 className="text-sm font-bold">Contenido a entregar</h3>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl border border-border w-fit">
              {(["file", "link"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDeliveryType(t)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    deliveryType === t ? "bg-primary/10 border border-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "file" ? <UploadCloud className="size-3.5" /> : <Link2 className="size-3.5" />}
                  {t === "file" ? "Subir archivo" : "Link externo"}
                </button>
              ))}
            </div>

            {deliveryType === "file" ? (
              <FileDropZone
                fileName={fileName} fileSize={fileSize} fileExt={fileExt}
                onFile={(n, s, e) => { setFileName(n); setFileSize(s); setFileExt(e); }}
              />
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-primary/80 flex items-start gap-2">
                  <Globe className="size-3.5 shrink-0 mt-0.5 text-primary" />
                  El comprador recibirá este link por email y en su panel de Mis Compras después del pago.
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">URL de descarga o acceso *</Label>
                  <Input
                    value={downloadUrl}
                    onChange={e => setDownloadUrl(e.target.value)}
                    placeholder="https://drive.google.com/... o https://dropbox.com/..."
                    className="bg-black/20 h-11"
                    type="url"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Nombre del archivo que verá el comprador</Label>
                  <Input
                    value={fileName}
                    onChange={e => setFileName(e.target.value)}
                    placeholder="mi-producto-v1.0.pdf"
                    className="bg-black/20 h-11"
                  />
                </div>
              </div>
            )}
          </div>

          {/* License */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                <h3 className="text-sm font-bold">Motor de licencias</h3>
              </div>
              <Switch checked={generateKey} onCheckedChange={setGenerateKey} />
            </div>
            {generateKey && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tipo de licencia</Label>
                    <select
                      value={licenseType}
                      onChange={e => setLicenseType(e.target.value)}
                      className="w-full h-11 px-3 bg-black/20 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/40"
                    >
                      {LICENSE_TYPES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Activaciones permitidas</Label>
                    <Input
                      type="number"
                      value={activations}
                      onChange={e => setActivations(Number(e.target.value))}
                      min={1}
                      max={999}
                      className="bg-black/20 h-11"
                    />
                  </div>
                </div>
                <div className="rounded-xl bg-black/20 border border-border p-3 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Formato de clave generada</div>
                  <div className="font-mono text-sm text-primary tracking-wider">PLS-XXXX-XXXX-XXXX-XXXX</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    API de verificación activa — clave entregada al instante
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Sidebar ───────────────────────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-20 self-start">

          {/* Status + Publish */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <h3 className="text-sm font-bold">Estado</h3>
            <Button
              variant="contrast" className="w-full gap-2 font-bold h-12"
              onClick={handlePublish} disabled={saving}
            >
              {saving ? (
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <Rocket className="size-4" />}
              {saving ? "Publicando..." : "Publicar en Marketplace"}
            </Button>
            <Button variant="outline" className="w-full gap-2 h-10" onClick={handleDraft}>
              Guardar como borrador
            </Button>
            <div className="text-[10px] text-muted-foreground text-center">
              Aparecerá en el marketplace de inmediato al publicar
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
            <h3 className="text-sm font-bold">Precio (COP)</h3>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Precio de venta *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  value={price || ""}
                  onChange={e => setPrice(Number(e.target.value))}
                  placeholder="299000"
                  className="bg-black/20 h-11 pl-7"
                />
              </div>
              {price > 0 && <div className="text-[10px] text-primary font-mono">{fmtCOPStore(price)} COP</div>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Precio original (para mostrar descuento)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  value={originalPrice || ""}
                  onChange={e => setOriginalPrice(Number(e.target.value))}
                  placeholder="499000"
                  className="bg-black/20 h-11 pl-7"
                />
              </div>
              {originalPrice > price && originalPrice > 0 && (
                <div className="text-[10px] text-emerald-400 font-mono">
                  {Math.round((1 - price / originalPrice) * 100)}% de descuento visible
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <div className="text-sm font-medium">Cobro recurrente</div>
                <div className="text-[10px] text-muted-foreground">Suscripción mensual (MRR)</div>
              </div>
              <Switch checked={recurring} onCheckedChange={setRecurring} />
            </div>
          </div>

          {/* Badge */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <h3 className="text-sm font-bold">Badge del marketplace</h3>
            <div className="grid grid-cols-2 gap-2">
              {BADGE_OPTIONS.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBadge(b.id)}
                  className={`flex items-center justify-center py-2 rounded-xl text-[11px] font-bold border transition-all ${b.cls} ${
                    badge === b.id ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : "opacity-60 hover:opacity-80"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace Preview */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-primary" />
              <h3 className="text-sm font-bold">Vista previa en marketplace</h3>
            </div>
            <PreviewCard
              name={name}
              tagline={tagline}
              price={price}
              originalPrice={originalPrice}
              badge={badge}
              image={coverImage}
              rating={5.0}
              tags={tags}
              vendor={user?.name || "Tu tienda"}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/dashboard/products" className="text-xs text-muted-foreground hover:text-foreground">
          ← Volver a mis productos
        </Link>
      </div>
    </DashboardLayout>
  );
}
