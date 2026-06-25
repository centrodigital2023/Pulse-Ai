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
  UploadCloud, Link2, Image, Package, KeyRound,
  Tag, Check, Copy, ExternalLink,
  MessageCircle, Star, Eye, ShoppingCart,
  X, Globe, Music, BarChart3, Rocket, Plus, Download,
  BookOpen, Headphones, Video, Smartphone, Archive,
  GraduationCap, Calendar, Repeat, ChevronLeft, ChevronRight,
  Clock, Mic, Code, Zap, MapPin,
} from "lucide-react";

// Facebook/Instagram from lucide-react are deprecated — inline SVGs instead
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const Route = createFileRoute("/dashboard/products/new")({
  head: () => ({ meta: [{ title: "Nuevo Producto — PULSE AI" }] }),
  component: NewProduct,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductFormat =
  | "course" | "ebook" | "subscription" | "event"
  | "source-code" | "audio" | "mobile-app" | "files"
  | "video" | "podcast" | "software";

// ─── Constants ────────────────────────────────────────────────────────────────

const FORMAT_CONFIG: Record<ProductFormat, {
  label: string; desc: string; icon: React.ElementType;
  color: string; exts?: string; primary?: boolean;
}> = {
  course:        { label: "Curso Online",      desc: "Videos HD, clases en vivo, materiales descargables", icon: GraduationCap, color: "text-purple-400", primary: true },
  ebook:         { label: "eBook",             desc: "PDF, EPUB, guías y documentos digitales",            icon: BookOpen,      color: "text-blue-400",   primary: true },
  subscription:  { label: "Suscripción",       desc: "Membresía mensual, acceso recurrente, MRR",          icon: Repeat,        color: "text-emerald-400",primary: true },
  event:         { label: "Evento Online",     desc: "Webinar, taller en vivo, masterclass",               icon: Calendar,      color: "text-orange-400", primary: true },
  "source-code": { label: "Código Fuente",     desc: "ZIP, RAR, EXE, PDF instrucciones",                   icon: Code,          color: "text-cyan-400",   exts: "ZIP · RAR · EXE · PDF" },
  audio:         { label: "Audio / Música",    desc: "Cualquier archivo de audio",                         icon: Headphones,    color: "text-pink-400",   exts: "MP3 · MP4 · WMA · M4A" },
  "mobile-app":  { label: "App Móvil",         desc: "Aplicación para teléfono celular",                   icon: Smartphone,    color: "text-yellow-400", exts: "APK · PDF instrucciones" },
  files:         { label: "Archivos",          desc: "Planillas, fotos, videos, audios y más",             icon: Archive,       color: "text-rose-400" },
  video:         { label: "Película / Video",  desc: "Cualquier tipo de video descargable",                icon: Video,         color: "text-violet-400", exts: "WMV · MP4 · AVI · MOV" },
  podcast:       { label: "Podcast / Audiolibro", desc: "Serie de audio episódica",                        icon: Mic,           color: "text-teal-400",   exts: "MP3 · MP4 · WMA · M4A" },
  software:      { label: "Software / Programa", desc: "Programas y aplicaciones descargables",            icon: Package,       color: "text-indigo-400", exts: "ZIP · RAR · EXE · PDF" },
};

const PRIMARY_FORMATS: ProductFormat[] = ["course", "ebook", "subscription", "event"];
const OTHER_FORMATS: ProductFormat[] = ["source-code", "audio", "mobile-app", "files", "video", "podcast", "software"];

const CATEGORIES = [
  { id: "software",  label: "Software & SaaS",       emoji: "💻" },
  { id: "education", label: "Cursos & Educación",     emoji: "🎓" },
  { id: "resources", label: "Plantillas & Recursos",  emoji: "🎨" },
  { id: "books",     label: "eBooks & Guías",         emoji: "📚" },
  { id: "services",  label: "Servicios",              emoji: "⚡" },
];

const LICENSE_TYPES = [
  { id: "personal",    label: "Personal (1 dispositivo)" },
  { id: "pro",         label: "Profesional (hasta 5)" },
  { id: "business",    label: "Empresarial (equipo)" },
  { id: "whitelabel",  label: "White Label (ilimitado)" },
];

const BADGE_OPTIONS = [
  { id: "new",        label: "✨ Nuevo",       cls: "bg-blue-500 text-white" },
  { id: "oferta",     label: "🏷️ Oferta",     cls: "bg-red-500 text-white" },
  { id: "featured",   label: "⭐ Destacado",   cls: "bg-yellow-500 text-black" },
  { id: "bestseller", label: "🔥 Más Vendido", cls: "bg-orange-500 text-white" },
] as const;

const LANGUAGES = ["Español", "English", "Português", "Français", "Deutsch"];
const COUNTRIES  = ["Colombia", "México", "Argentina", "Chile", "Perú", "Ecuador", "Venezuela", "España", "Estados Unidos", "Otro"];

const SOCIAL_PLATFORMS = [
  {
    id: "facebook", label: "Facebook Ads", icon: FacebookIcon, color: "#1877F2", utm: "facebook_ads",
    textTemplate: (name: string, price: number, url: string) =>
      `🚀 ¡Nuevo en PULSE AI!\n\n✅ ${name}\n💰 Solo ${fmtCOPStore(price)} COP — descarga instantánea\n🔒 Garantía 30 días sin preguntas\n📦 Acceso de por vida\n\n👇 Consíguelo ahora:\n${url}\n\n#ProductosDigitales #Colombia #DescargaInstantanea #PULSEAI`,
  },
  {
    id: "instagram", label: "Instagram", icon: InstagramIcon, color: "#E1306C", utm: "instagram",
    textTemplate: (name: string, price: number, _url: string) =>
      `✨ ${name} ya disponible en PULSE AI 🔥\n\n💰 ${fmtCOPStore(price)} COP · descarga al instante\n✅ Garantía 30 días total\n\n🔗 Link en bio → pulseai.co\n\n#DesarrolloDigital #Emprendimiento #Colombia #TechLatam`,
  },
  {
    id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366", utm: "whatsapp",
    textTemplate: (name: string, price: number, url: string) =>
      `Hola 👋 Mira este producto que acabo de publicar:\n\n🔥 *${name}*\n\nPrecio: *${fmtCOPStore(price)} COP*\n✅ Descarga instantánea\n✅ Garantía 30 días\n\n👉 ${url}`,
  },
  {
    id: "tiktok", label: "TikTok", icon: Music, color: "#ffffff", utm: "tiktok",
    textTemplate: (name: string, price: number, url: string) =>
      `¿Sabías que puedes comprar ${name} por solo ${fmtCOPStore(price)} COP? 🤯 Descarga instantánea en PULSE AI 🚀 ${url} #DigitalProducts #PULSEAI #Tech`,
  },
];

// ─── Step logic ───────────────────────────────────────────────────────────────

function getSteps(format: ProductFormat | null): string[] {
  if (!format) return ["Formato", "Información", "Contenido", "Precios"];
  if (format === "subscription") return ["Formato", "Información", "Precios"];
  if (format === "event") return ["Formato", "Información", "Fechas", "Precios"];
  return ["Formato", "Información", "Contenido", "Precios"];
}

// ─── Helper components ────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 text-[11px] text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded border border-primary/20 hover:border-primary/40">
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "¡Copiado!" : label}
    </button>
  );
}

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t) && tags.length < 8) { onChange([...tags, t]); setInput(""); }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
            {t}
            <button onClick={() => onChange(tags.filter(x => x !== t))} className="hover:text-destructive transition-colors"><X className="size-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="IA, Python, PDF... (Enter para agregar)" className="bg-black/20 h-9 text-sm flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={add} className="h-9"><Tag className="size-3.5" /></Button>
      </div>
    </div>
  );
}

// ─── Cover Image Zone (single, square) ───────────────────────────────────────

function CoverImageZone({ image, onImage, onRemove }: {
  image: string;
  onImage: (b64: string, file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Solo imágenes JPG o PNG"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Máximo 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = e => onImage(e.target?.result as string, file);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0]; if (file) handleFile(file);
  }, []);

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all bg-black/20
        ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : image ? "border-primary/30" : "border-border hover:border-primary/40"}`}
      style={{ aspectRatio: "1/1", maxWidth: 280 }}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {image ? (
        <>
          <img src={image} alt="Portada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <Image className="size-6 text-white" />
            <span className="text-white text-xs font-medium">Cambiar imagen</span>
          </div>
          <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/70 flex items-center justify-center hover:bg-destructive transition-colors z-10">
            <X className="size-3.5 text-white" />
          </button>
          <span className="absolute top-2 left-2 text-[9px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wide">
            Portada
          </span>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-4">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Image className="size-7 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold">Arrastra el archivo aquí</div>
            <div className="text-xs text-muted-foreground mt-1">o <span className="text-primary underline">haz clic para buscar</span></div>
            <div className="text-[10px] text-muted-foreground/60 mt-2">JPG · PNG · WEBP · máx 5 MB</div>
            <div className="text-[10px] text-muted-foreground/60">600×600 px recomendado</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Gallery Zone (additional images) ────────────────────────────────────────

const MAX_GALLERY = 4;

function GalleryZone({ images, onImages }: { images: string[]; onImages: (imgs: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const toAdd = Math.min(files.length, MAX_GALLERY - images.length);
    const results: string[] = [];
    for (let i = 0; i < toAdd; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) { toast.error(`"${file.name}" excede 5 MB`); continue; }
      await new Promise<void>(res => {
        const r = new FileReader();
        r.onload = e => { results.push(e.target?.result as string); res(); };
        r.readAsDataURL(file);
      });
    }
    onImages([...images, ...results]);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <div key={i} className="relative size-20 rounded-xl overflow-hidden border border-border flex-shrink-0">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onImages(images.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 size-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-destructive transition-colors">
              <X className="size-2.5 text-white" />
            </button>
          </div>
        ))}
        {images.length < MAX_GALLERY && (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="size-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
            <Plus className="size-5" />
            <span className="text-[9px]">Agregar</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => { if (e.target.files) handleFiles(e.target.files); }} />
      <p className="text-[10px] text-muted-foreground">Hasta {MAX_GALLERY} imágenes adicionales · La portada de arriba es la principal</p>
    </div>
  );
}

// ─── File Drop Zone ───────────────────────────────────────────────────────────

function FileDropZone({ fileName, fileSize, fileExt, onFile, acceptHint }: {
  fileName: string; fileSize: string; fileExt: string;
  onFile: (name: string, size: string, ext: string, file: File | null) => void;
  acceptHint?: string;
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
    const file = e.dataTransfer.files[0]; if (file) read(file);
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
        <button onClick={() => onFile("", "", "", null)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center gap-3
        ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/40"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) read(f); }} />
      <UploadCloud className={`size-8 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`} />
      <div>
        <div className="text-sm font-medium">Arrastra tu archivo aquí</div>
        <div className="text-xs text-muted-foreground mt-0.5">o <span className="text-primary underline">haz clic para seleccionar</span></div>
        {acceptHint && <div className="text-[10px] text-muted-foreground/60 mt-1">{acceptHint}</div>}
        <div className="text-[10px] text-muted-foreground/60 mt-0.5">Hasta 10 GB</div>
      </div>
    </div>
  );
}

// ─── Marketplace Preview Card ─────────────────────────────────────────────────

function PreviewCard({ name, tagline, price, originalPrice, badge, image, tags, vendor }: {
  name: string; tagline: string; price: number; originalPrice: number;
  badge: string; image: string; tags: string[]; vendor: string;
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
          <div className="w-full h-full bg-primary/5 flex flex-col items-center justify-center gap-2">
            <Image className="size-8 text-primary/30" />
            <span className="text-[10px] text-muted-foreground/60">Vista previa del marketplace</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {bc && <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold ${bc.cls}`}>{bc.label}</span>}
        {discount >= 10 && <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold bg-destructive text-white">-{discount}% OFF</span>}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
          <Eye className="size-2.5 text-primary" />
          <span className="text-[9px] text-white font-mono">12 viendo</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-[9px] text-muted-foreground mb-1">{vendor || "Tu tienda"}</div>
        <div className="font-bold text-[11px] mb-1 line-clamp-1">{name || "Nombre del producto"}</div>
        <div className="text-muted-foreground text-[10px] mb-2 line-clamp-2">{tagline || "Descripción breve..."}</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {(tags.length > 0 ? tags : ["Tag"]).slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-black/20 border border-border text-[9px] text-muted-foreground">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-2.5 fill-yellow-400 text-yellow-400" />)}
          <span className="text-[9px] font-bold ml-0.5">5.0</span>
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

// ─── Success Panel ────────────────────────────────────────────────────────────

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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-primary/5 to-emerald-500/5 border border-emerald-500/20 p-6 text-center">
        <div className="relative mx-auto size-20 mb-4">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center"><Rocket className="size-9 text-emerald-400" /></div>
        </div>
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">¡Publicado exitosamente!</div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Tu producto está en el Marketplace</h2>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">"{product.name}"</span> ya está visible para compradores. Ahora promociónalo en tus redes.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Link to="/marketplace" className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
            <ExternalLink className="size-3.5" /> Ver en el Marketplace
          </Link>
          <Link to="/dashboard/products" className="flex items-center gap-1.5 text-xs border border-border px-4 py-2.5 rounded-xl hover:border-primary/20 text-muted-foreground transition-colors">
            <BarChart3 className="size-3.5" /> Mis productos
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {SOCIAL_PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setActivePlatform(p.id)}
              style={{ borderBottomColor: activePlatform === p.id ? p.color : "transparent" }}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${activePlatform === p.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <p.icon className="size-3.5" style={{ color: p.color }} /> {p.label}
            </button>
          ))}
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Campaña UTM</Label>
            <Input value={utmCampaign} onChange={e => setUtmCampaign(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              className="bg-black/20 h-9 text-sm font-mono" placeholder="launch_junio" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Texto para publicar</Label>
              <CopyButton text={postText} label="Copiar texto" />
            </div>
            <div className="rounded-xl bg-black/20 border border-border p-3 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono max-h-40 overflow-y-auto">
              {postText}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePlatform === "facebook" && (
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=500")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: "#1877F2" }}>
                <FacebookIcon /> Compartir en Facebook
              </button>
            )}
            {activePlatform === "whatsapp" && (
              <a href={`https://wa.me/?text=${encodeURIComponent(postText)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}>
                <MessageCircle className="size-3.5" /> Enviar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => navigate({ to: "/dashboard/products/new" })}
        className="w-full flex items-center justify-center gap-2 border border-border text-sm text-muted-foreground rounded-xl px-5 py-3 hover:text-foreground hover:border-primary/20 transition-colors">
        <Package className="size-4" /> Publicar otro producto
      </button>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = current > n;
        const active = current === n;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-xs font-medium transition-colors
              ${done ? "text-primary" : active ? "text-foreground" : "text-muted-foreground"}`}>
              <div className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all
                ${done ? "bg-primary border-primary text-primary-foreground" :
                  active ? "bg-primary/10 border-primary text-primary" :
                  "bg-background border-border text-muted-foreground"}`}>
                {done ? <Check className="size-3.5" /> : n}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-6 sm:w-12 transition-colors ${current > n ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── STEP 1: Format Selection ─────────────────────────────────────────────────

function FormatStep({ onSelect }: { onSelect: (f: ProductFormat) => void }) {
  const [hovered, setHovered] = useState<ProductFormat | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">¿Qué tipo de producto vas a vender?</h2>
        <p className="text-muted-foreground">Selecciona el formato que mejor describe tu producto digital.</p>
      </div>

      {/* Primary formats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {PRIMARY_FORMATS.map(f => {
          const cfg = FORMAT_CONFIG[f];
          const Icon = cfg.icon;
          return (
            <button key={f} type="button" onClick={() => onSelect(f)}
              onMouseEnter={() => setHovered(f)} onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5
                ${hovered === f ? "border-primary/30 bg-primary/3" : "border-border bg-surface"}`}>
              <div className={`size-14 rounded-2xl bg-black/20 border border-border flex items-center justify-center mb-4 group-hover:border-primary/20 transition-colors`}>
                <Icon className={`size-7 ${cfg.color}`} />
              </div>
              <div className="font-bold text-base mb-1">{cfg.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{cfg.desc}</div>
              <div className="absolute top-4 right-4 size-6 rounded-full border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center">
                <div className={`size-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary formats */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground font-medium">¿Otro formato?</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {OTHER_FORMATS.map(f => {
            const cfg = FORMAT_CONFIG[f];
            const Icon = cfg.icon;
            return (
              <button key={f} type="button" onClick={() => onSelect(f)}
                className="group rounded-xl border border-border bg-surface p-4 text-left hover:border-primary/30 hover:bg-primary/5 transition-all">
                <Icon className={`size-5 mb-2 ${cfg.color}`} />
                <div className="text-xs font-semibold mb-0.5">{cfg.label}</div>
                {cfg.exts && <div className="text-[9px] text-muted-foreground font-mono">{cfg.exts}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: Basic Info ───────────────────────────────────────────────────────

function InfoStep({ format, name, setName, tagline, setTagline, description, setDescription,
  language, setLanguage, country, setCountry, coverImage, setCoverImage, setCoverFile,
  category, setCategory, tags, setTags }: {
  format: ProductFormat;
  name: string; setName: (v: string) => void;
  tagline: string; setTagline: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  language: string; setLanguage: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  setCoverFile: (f: File | null) => void;
  category: string; setCategory: (v: string) => void;
  tags: string[]; setTags: (t: string[]) => void;
}) {
  const cfg = FORMAT_CONFIG[format];
  const productLabel = format === "event" ? "evento online" : "producto";
  const nameLabel = format === "event" ? "Nombre del evento online" : "Nombre del producto";
  const imgLabel = format === "event" ? "Imagen de tu evento online" : "Imagen de tu producto";
  const catLabel = format === "event" ? "Categoría del evento online" : "Categoría del producto";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <cfg.icon className={`size-5 ${cfg.color}`} />
        </div>
        <div>
          <div className="font-bold">{cfg.label}</div>
          <div className="text-xs text-muted-foreground">Información básica</div>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">{nameLabel} <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground">Elige un nombre que llame la atención de tus compradores</p>
        <Input value={name} onChange={e => setName(e.target.value)}
          placeholder={`Ej: Masterclass Completa de ${cfg.label}`}
          className="bg-black/20 h-12 text-base" maxLength={80} />
        <p className="text-[10px] text-muted-foreground">Este es el nombre que aparecerá en toda la plataforma · {name.length}/80</p>
      </div>

      {/* Description short */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Descripción corta (tarjeta del marketplace) <span className="text-destructive">*</span></Label>
        <p className="text-xs text-muted-foreground">Explica brevemente en qué consiste tu {productLabel} y qué ofrece</p>
        <Input value={tagline} onChange={e => setTagline(e.target.value)}
          placeholder="Ej: 40 videos HD · de cero a experto · con certificado"
          className="bg-black/20 h-11" maxLength={120} />
        <p className="text-[10px] text-muted-foreground">Esta descripción corta se muestra en el momento de la compra · {tagline.length}/120</p>
      </div>

      {/* Description full */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Descripción completa</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder={`Describe qué incluye tu ${productLabel}, a quién va dirigido, qué aprenderá o recibirá el comprador...`}
          rows={5} className="bg-black/20 resize-none" />
      </div>

      {/* Language + Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Globe className="size-3.5 text-muted-foreground" /> Idioma del producto
          </Label>
          <p className="text-xs text-muted-foreground">¿En qué idioma está tu producto?</p>
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="w-full h-11 px-3 bg-black/20 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/40">
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <p className="text-[10px] text-muted-foreground">Exhibido en el momento de la compra</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="size-3.5 text-muted-foreground" /> Principal país de ventas
          </Label>
          <p className="text-xs text-muted-foreground">¿En qué país quieres vender?</p>
          <select value={country} onChange={e => setCountry(e.target.value)}
            className="w-full h-11 px-3 bg-black/20 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/40">
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="text-[10px] text-muted-foreground">También podrás vender en otros países</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">{imgLabel}</Label>
        <p className="text-xs text-muted-foreground">La imagen debe estar en formato JPG o PNG y tener máximo 5 MB. Dimensiones recomendadas: 600×600 px.</p>
        <CoverImageZone
          image={coverImage}
          onImage={(b64, file) => { setCoverImage(b64); setCoverFile(file); }}
          onRemove={() => { setCoverImage(""); setCoverFile(null); }}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">{catLabel}</Label>
        <p className="text-xs text-muted-foreground">Ayuda a los compradores a encontrar tu producto más fácilmente</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(c => (
            <button key={c.id} type="button" onClick={() => setCategory(c.id)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-xs font-medium transition-all
                ${category === c.id ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground bg-black/10"}`}>
              <span className="text-base">{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Etiquetas de búsqueda</Label>
        <p className="text-xs text-muted-foreground">Palabras clave que ayudan a encontrar tu producto (máx. 8)</p>
        <TagsInput tags={tags} onChange={setTags} />
      </div>
    </div>
  );
}

// ─── STEP 3a: Content Delivery ────────────────────────────────────────────────

function ContentStep({ format, galleryImages, setGalleryImages, deliveryType, setDeliveryType,
  fileName, fileSize, fileExt, productFile, setFileName, setFileSize, setFileExt, setProductFile,
  downloadUrl, setDownloadUrl, licenseType, setLicenseType, activations, setActivations,
  generateKey, setGenerateKey }: {
  format: ProductFormat;
  galleryImages: string[]; setGalleryImages: (imgs: string[]) => void;
  deliveryType: "file" | "link"; setDeliveryType: (t: "file" | "link") => void;
  fileName: string; fileSize: string; fileExt: string; productFile: File | null;
  setFileName: (v: string) => void; setFileSize: (v: string) => void;
  setFileExt: (v: string) => void; setProductFile: (f: File | null) => void;
  downloadUrl: string; setDownloadUrl: (v: string) => void;
  licenseType: string; setLicenseType: (v: string) => void;
  activations: number; setActivations: (n: number) => void;
  generateKey: boolean; setGenerateKey: (v: boolean) => void;
}) {
  const cfg = FORMAT_CONFIG[format];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <UploadCloud className="size-5 text-primary" />
        </div>
        <div>
          <div className="font-bold">Contenido a entregar</div>
          <div className="text-xs text-muted-foreground">El archivo o acceso que recibirá el comprador</div>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Imágenes adicionales del producto</Label>
        <p className="text-xs text-muted-foreground">Opcional: agrega fotos de vista previa, screenshots o material de apoyo</p>
        <GalleryZone images={galleryImages} onImages={setGalleryImages} />
      </div>

      {/* Delivery type toggle */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">¿Cómo entregas el producto? <span className="text-destructive">*</span></Label>
        <div className="flex items-center gap-2 p-1 bg-black/20 rounded-xl border border-border w-fit">
          {(["file", "link"] as const).map(t => (
            <button key={t} type="button" onClick={() => setDeliveryType(t)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all
                ${deliveryType === t ? "bg-primary/10 border border-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "file" ? <UploadCloud className="size-3.5" /> : <Link2 className="size-3.5" />}
              {t === "file" ? "Subir archivo" : "Link externo"}
            </button>
          ))}
        </div>

        {deliveryType === "file" ? (
          <FileDropZone
            fileName={fileName} fileSize={fileSize} fileExt={fileExt}
            acceptHint={cfg.exts || "ZIP · PDF · MP4 · EXE · APK · EPUB..."}
            onFile={(n, s, e, f) => { setFileName(n); setFileSize(s); setFileExt(e); setProductFile(f); }}
          />
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-primary/80 flex items-start gap-2">
              <Globe className="size-3.5 shrink-0 mt-0.5 text-primary" />
              El comprador recibirá este link por email y en su panel de Mis Compras después del pago.
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">URL de descarga o acceso <span className="text-destructive">*</span></Label>
              <Input value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)}
                placeholder="https://drive.google.com/... o https://dropbox.com/..."
                className="bg-black/20 h-11" type="url" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nombre que verá el comprador</Label>
              <Input value={fileName} onChange={e => setFileName(e.target.value)}
                placeholder="mi-producto-v1.0.pdf" className="bg-black/20 h-11" />
            </div>
          </div>
        )}
      </div>

      {/* License */}
      <div className="rounded-2xl bg-surface border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <div>
              <div className="text-sm font-bold">Motor de licencias</div>
              <div className="text-[11px] text-muted-foreground">Genera claves únicas para cada compra</div>
            </div>
          </div>
          <Switch checked={generateKey} onCheckedChange={setGenerateKey} />
        </div>
        {generateKey && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tipo de licencia</Label>
                <select value={licenseType} onChange={e => setLicenseType(e.target.value)}
                  className="w-full h-11 px-3 bg-black/20 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/40">
                  {LICENSE_TYPES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Activaciones permitidas</Label>
                <Input type="number" value={activations} onChange={e => setActivations(Number(e.target.value))}
                  min={1} max={999} className="bg-black/20 h-11" />
              </div>
            </div>
            <div className="rounded-xl bg-black/20 border border-border p-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Formato de clave</div>
              <div className="font-mono text-sm text-primary tracking-wider">PLS-XXXX-XXXX-XXXX-XXXX</div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-1">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Clave entregada al instante tras el pago
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 3b: Event Dates ─────────────────────────────────────────────────────

function DatesStep({ eventDate, setEventDate, eventTime, setEventTime,
  eventDuration, setEventDuration, eventTimezone, setEventTimezone }: {
  eventDate: string; setEventDate: (v: string) => void;
  eventTime: string; setEventTime: (v: string) => void;
  eventDuration: string; setEventDuration: (v: string) => void;
  eventTimezone: string; setEventTimezone: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Calendar className="size-5 text-primary" />
        </div>
        <div>
          <div className="font-bold">Fechas y Horarios</div>
          <div className="text-xs text-muted-foreground">¿Cuándo ocurrirá tu evento online?</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold flex items-center gap-2"><Calendar className="size-3.5" /> Fecha del evento <span className="text-destructive">*</span></Label>
          <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="bg-black/20 h-11" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold flex items-center gap-2"><Clock className="size-3.5" /> Hora de inicio <span className="text-destructive">*</span></Label>
          <Input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="bg-black/20 h-11" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">Duración estimada</Label>
          <select value={eventDuration} onChange={e => setEventDuration(e.target.value)}
            className="w-full h-11 px-3 bg-black/20 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/40">
            {["30 minutos", "1 hora", "1.5 horas", "2 horas", "3 horas", "4 horas", "Medio día", "Día completo"].map(d =>
              <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">Zona horaria</Label>
          <select value={eventTimezone} onChange={e => setEventTimezone(e.target.value)}
            className="w-full h-11 px-3 bg-black/20 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/40">
            {["UTC-5 (Colombia)", "UTC-6 (México)", "UTC-3 (Argentina)", "UTC-5 (Perú)", "UTC+1 (España)"].map(tz =>
              <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-5 space-y-2">
        <div className="text-sm font-bold flex items-center gap-2"><Calendar className="size-4 text-primary" /> Resumen del evento</div>
        {eventDate && eventTime ? (
          <div className="text-sm text-foreground font-medium">
            {new Date(`${eventDate}T${eventTime}`).toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}{" "}
            a las {eventTime} · {eventDuration || "1 hora"} · {eventTimezone}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Completa fecha y hora para ver el resumen</div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 4: Pricing ──────────────────────────────────────────────────────────

function PricingStep({ format, recurring, setRecurring, price, setPrice, originalPrice, setOriginalPrice,
  badge, setBadge, saving, onDraft, onPublish }: {
  format: ProductFormat;
  recurring: boolean; setRecurring: (v: boolean) => void;
  price: number; setPrice: (n: number) => void;
  originalPrice: number; setOriginalPrice: (n: number) => void;
  badge: "new" | "featured" | "bestseller" | "oferta"; setBadge: (b: "new" | "featured" | "bestseller" | "oferta") => void;
  saving: boolean; onDraft: () => void; onPublish: () => void;
}) {
  const discount = originalPrice > price && originalPrice > 0 ? Math.round((1 - price / originalPrice) * 100) : 0;
  const isSubscription = format === "subscription";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap className="size-5 text-primary" />
        </div>
        <div>
          <div className="font-bold">Fijación de precios</div>
          <div className="text-xs text-muted-foreground">Define el precio y la estrategia de venta</div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">{isSubscription ? "Precio mensual" : "Precio de venta"} (COP) <span className="text-destructive">*</span></Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
          <Input type="number" value={price || ""} onChange={e => setPrice(Number(e.target.value))}
            placeholder="299000" className="bg-black/20 h-14 pl-8 text-lg font-bold" />
        </div>
        {price > 0 && (
          <div className="text-sm text-primary font-mono font-bold">{fmtCOPStore(price)} COP</div>
        )}
      </div>

      {/* Original price */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Precio original (para mostrar descuento)</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
          <Input type="number" value={originalPrice || ""} onChange={e => setOriginalPrice(Number(e.target.value))}
            placeholder="499000" className="bg-black/20 h-11 pl-8" />
        </div>
        {discount > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">-{discount}% OFF</span>
            <span className="text-muted-foreground">El comprador verá este descuento en el marketplace</span>
          </div>
        )}
      </div>

      {/* Recurring */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2">
            <Repeat className="size-4 text-muted-foreground" /> Cobro recurrente
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isSubscription ? "Suscripción activa — cobro mensual automático" : "Activa para convertirlo en suscripción mensual (MRR)"}
          </div>
        </div>
        <Switch checked={recurring || isSubscription} onCheckedChange={setRecurring} disabled={isSubscription} />
      </div>

      {/* Badge */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Badge del marketplace</Label>
        <div className="grid grid-cols-2 gap-2">
          {BADGE_OPTIONS.map(b => (
            <button key={b.id} type="button" onClick={() => setBadge(b.id)}
              className={`flex items-center justify-center py-2.5 rounded-xl text-[11px] font-bold border transition-all ${b.cls}
                ${badge === b.id ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105" : "opacity-60 hover:opacity-80"}`}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Publish actions */}
      <div className="pt-4 border-t border-border space-y-3">
        <Button variant="contrast" className="w-full gap-2 font-bold h-14 text-base shadow-lg shadow-primary/30" onClick={onPublish} disabled={saving}>
          {saving ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Rocket className="size-5" />}
          {saving ? "Publicando..." : "Publicar en Marketplace"}
        </Button>
        <Button variant="outline" className="w-full gap-2 h-11" onClick={onDraft} disabled={saving}>
          <Download className="size-4" /> Guardar como borrador
        </Button>
        <p className="text-[10px] text-muted-foreground text-center">Aparecerá en el marketplace de inmediato al publicar</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function NewProduct() {
  const { user } = useAuth();
  const createProduct = useCreateProduct();

  const [publishedProduct, setPublishedProduct] = useState<VendorProduct | null>(null);
  const [saving, setSaving] = useState(false);

  // Wizard state
  const [format, setFormat] = useState<ProductFormat | null>(null);
  const [step, setStep] = useState(1);

  // Step 2: Basic info
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("Español");
  const [country, setCountry] = useState("Colombia");
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [category, setCategory] = useState("education");
  const [tags, setTags] = useState<string[]>([]);

  // Step 3a: Content
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [deliveryType, setDeliveryType] = useState<"file" | "link">("file");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [licenseType, setLicenseType] = useState("personal");
  const [activations, setActivations] = useState(3);
  const [generateKey, setGenerateKey] = useState(true);

  // Step 3b: Event dates
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDuration, setEventDuration] = useState("1 hora");
  const [eventTimezone, setEventTimezone] = useState("UTC-5 (Colombia)");

  // Step 4: Pricing
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [recurring, setRecurring] = useState(false);
  const [badge, setBadge] = useState<"new" | "featured" | "bestseller" | "oferta">("new");

  const steps = getSteps(format);
  const totalSteps = steps.length;

  const handleSelectFormat = (f: ProductFormat) => {
    setFormat(f);
    if (f === "subscription") setRecurring(true);
    setStep(2);
  };

  const validateStep = (s: number): boolean => {
    if (s === 2) {
      if (!name.trim()) { toast.error("El nombre del producto es obligatorio"); return false; }
      if (!tagline.trim()) { toast.error("La descripción corta es obligatoria"); return false; }
    }
    if (s === 3 && format !== "event" && format !== "subscription") {
      if (deliveryType === "file" && !fileName) { toast.error("Sube el archivo del producto o elige un link externo"); return false; }
      if (deliveryType === "link" && !downloadUrl) { toast.error("Ingresa la URL de descarga"); return false; }
    }
    if (s === 3 && format === "event") {
      if (!eventDate) { toast.error("La fecha del evento es obligatoria"); return false; }
      if (!eventTime) { toast.error("La hora del evento es obligatoria"); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handlePublish = async () => {
    if (!validateStep(step)) return;
    if (price <= 0) { toast.error("Define un precio mayor a $0"); return; }

    setSaving(true);
    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        price,
        recurring: recurring || format === "subscription",
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
      images: [coverImage, ...galleryImages].filter(Boolean),
      deliveryType,
      fileName, fileSize, fileExt,
      downloadUrl,
      licenseType,
      activations,
      generateKey,
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      currency: "COP",
      recurring: recurring || format === "subscription",
      badge,
      status: "live",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sales: 0, reviews: 0, rating: 5.0, soldToday: 0, viewers: 0,
    };

    setSaving(false);
    setPublishedProduct(product);
    toast.success(`🚀 "${product.name}" publicado en el Marketplace`);
  };

  const handleDraft = async () => {
    if (!name.trim()) { toast.error("Agrega un nombre primero"); return; }
    try {
      await createProduct.mutateAsync({
        name: name.trim(), tagline: tagline.trim(), category, price,
        recurring: recurring || format === "subscription",
        status: "draft", licensing_enabled: generateKey,
        imageFile: coverFile,
        productFile: deliveryType === "file" ? productFile : null,
        downloadUrl: deliveryType === "link" ? downloadUrl.trim() : undefined,
        fileName: fileName.trim(),
      });
      toast("Borrador guardado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar el borrador");
    }
  };

  if (publishedProduct) {
    return (
      <DashboardLayout title="Producto Publicado" breadcrumb={["Dashboard", "Productos", "Publicado"]}
        actions={<Link to="/marketplace"><Button size="sm" variant="contrast" className="gap-1.5"><ExternalLink className="size-3.5" /> Ver en Marketplace</Button></Link>}>
        <div className="max-w-2xl mx-auto"><PublishSuccessPanel product={publishedProduct} /></div>
      </DashboardLayout>
    );
  }

  // Determine step index label for the content step
  const isSubscription = format === "subscription";
  const isEvent = format === "event";
  // step 3 is: content (non-event, non-subscription) | dates (event) | pricing (subscription)
  const step3IsContent = !isEvent && !isSubscription;
  const step3IsDates = isEvent;
  const isPricingStep = (isSubscription && step === 3) || (step === 4);
  const isContentStep = step3IsContent && step === 3;
  const isDatesStep = step3IsDates && step === 3;
  const isLastStep = step === totalSteps;

  return (
    <DashboardLayout
      title="Nuevo Producto"
      breadcrumb={["Dashboard", "Productos", "Nuevo"]}
      actions={
        <div className="flex gap-2">
          {step > 1 && step < totalSteps && (
            <Button variant="outline" size="sm" onClick={handleDraft}>Guardar borrador</Button>
          )}
        </div>
      }
    >
      {/* Step 1: full width format selection */}
      {step === 1 && (
        <div>
          <div className="mb-8 flex items-center gap-4">
            <StepIndicator steps={steps} current={step} />
          </div>
          <FormatStep onSelect={handleSelectFormat} />
        </div>
      )}

      {/* Steps 2-4: two column layout */}
      {step > 1 && format && (
        <div>
          {/* Progress */}
          <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
            <StepIndicator steps={steps} current={step} />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{FORMAT_CONFIG[format].label}</span>
              <span>·</span>
              <button onClick={() => { setFormat(null); setStep(1); }} className="text-primary hover:underline">
                Cambiar formato
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-surface border border-border p-6 md:p-8">
                {step === 2 && (
                  <InfoStep
                    format={format}
                    name={name} setName={setName}
                    tagline={tagline} setTagline={setTagline}
                    description={description} setDescription={setDescription}
                    language={language} setLanguage={setLanguage}
                    country={country} setCountry={setCountry}
                    coverImage={coverImage} setCoverImage={setCoverImage} setCoverFile={setCoverFile}
                    category={category} setCategory={setCategory}
                    tags={tags} setTags={setTags}
                  />
                )}
                {isContentStep && (
                  <ContentStep
                    format={format}
                    galleryImages={galleryImages} setGalleryImages={setGalleryImages}
                    deliveryType={deliveryType} setDeliveryType={setDeliveryType}
                    fileName={fileName} fileSize={fileSize} fileExt={fileExt} productFile={productFile}
                    setFileName={setFileName} setFileSize={setFileSize} setFileExt={setFileExt} setProductFile={setProductFile}
                    downloadUrl={downloadUrl} setDownloadUrl={setDownloadUrl}
                    licenseType={licenseType} setLicenseType={setLicenseType}
                    activations={activations} setActivations={setActivations}
                    generateKey={generateKey} setGenerateKey={setGenerateKey}
                  />
                )}
                {isDatesStep && (
                  <DatesStep
                    eventDate={eventDate} setEventDate={setEventDate}
                    eventTime={eventTime} setEventTime={setEventTime}
                    eventDuration={eventDuration} setEventDuration={setEventDuration}
                    eventTimezone={eventTimezone} setEventTimezone={setEventTimezone}
                  />
                )}
                {isPricingStep && (
                  <PricingStep
                    format={format}
                    recurring={recurring} setRecurring={setRecurring}
                    price={price} setPrice={setPrice}
                    originalPrice={originalPrice} setOriginalPrice={setOriginalPrice}
                    badge={badge} setBadge={setBadge}
                    saving={saving} onDraft={handleDraft} onPublish={handlePublish}
                  />
                )}

                {/* Navigation (not shown on pricing step — it has its own buttons) */}
                {!isPricingStep && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                    <Button variant="outline" onClick={handleBack} className="gap-2">
                      <ChevronLeft className="size-4" /> Anterior
                    </Button>
                    <Button variant="contrast" onClick={handleNext} className="gap-2 font-bold">
                      Siguiente <ChevronRight className="size-4" />
                    </Button>
                  </div>
                )}
                {isPricingStep && (
                  <div className="flex items-center mt-4">
                    <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 text-muted-foreground">
                      <ChevronLeft className="size-4" /> Volver al paso anterior
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5 lg:sticky lg:top-20 self-start">
              {/* Format chip */}
              <div className="rounded-2xl bg-surface border border-border p-4 flex items-center gap-3">
                {(() => { const cfg = FORMAT_CONFIG[format]; const Icon = cfg.icon; return (
                  <>
                    <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className={`size-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{cfg.label}</div>
                      <div className="text-[10px] text-muted-foreground">{cfg.desc}</div>
                    </div>
                  </>
                ); })()}
              </div>

              {/* Marketplace preview */}
              <div className="rounded-2xl bg-surface border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="size-3.5 text-primary" />
                  <span className="text-xs font-bold">Vista previa en marketplace</span>
                </div>
                <PreviewCard
                  name={name} tagline={tagline} price={price} originalPrice={originalPrice}
                  badge={badge} image={coverImage} tags={tags} vendor={user?.name || "Tu tienda"}
                />
              </div>

              {/* Step hints */}
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
                <div className="text-xs font-bold text-primary mb-2">
                  {step === 2 && "💡 Información básica"}
                  {step === 3 && !isDatesStep && "💡 Contenido del producto"}
                  {isDatesStep && "💡 Evento online"}
                  {isPricingStep && "💡 Estrategia de precios"}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {step === 2 && "Un buen nombre y descripción aumentan la tasa de conversión hasta 3×. Usa palabras clave relevantes."}
                  {step === 3 && !isDatesStep && "El archivo que subas será protegido y entregado de forma automática al comprador tras el pago."}
                  {isDatesStep && "Publica el evento con anticipación para generar expectativa. La fecha exacta aparece en la página del producto."}
                  {isPricingStep && "Los productos con precio original (descuento visible) se venden hasta 2.4× más rápido. Define una oferta de lanzamiento."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step > 1 && (
        <div className="mt-6 text-center">
          <Link to="/dashboard/products" className="text-xs text-muted-foreground hover:text-foreground">← Volver a mis productos</Link>
        </div>
      )}
    </DashboardLayout>
  );
}
