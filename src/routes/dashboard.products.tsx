import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, Rocket, FileText, UploadCloud, Link2, Globe, ExternalLink, BarChart3, Image, X, Share2, Copy, Check, ChevronLeft, ChevronRight, Play, Music, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fmtCOPStore } from "@/lib/products-store";
import {
  useMyProducts,
  useUpdateProductStatus,
  useDeleteProduct,
  useCreateProduct,
  type DBProduct,
} from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({ meta: [{ title: "Mis Productos — PULSE AI Dashboard" }] }),
  component: Products,
});

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "software",  label: "Software & SaaS",       emoji: "💻" },
  { id: "education", label: "Cursos & Educación",     emoji: "🎓" },
  { id: "resources", label: "Plantillas & Recursos",  emoji: "🎨" },
  { id: "books",     label: "eBooks & Guías",          emoji: "📚" },
  { id: "services",  label: "Servicios",              emoji: "⚡" },
];

const categoryEmoji: Record<string, string> = {
  software: "💻", education: "🎓", resources: "🎨", books: "📚", services: "⚡",
  "Software & SaaS": "💻", "Cursos & Educación": "🎓", "Plantillas & Recursos": "🎨",
  "eBooks & Guías": "📚", "Servicios": "⚡",
};

// ─── Quick Publish Sheet ──────────────────────────────────────────────────────

function QuickPublishSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createProduct = useCreateProduct();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("education");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<"file" | "link">("file");
  const [downloadUrl, setDownloadUrl] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setName(""); setTagline(""); setPrice(""); setCategory("education");
      setImageFile(null); setImagePreview(""); setProductFile(null);
      setDownloadUrl(""); setSaving(false);
    }
  }, [open]);

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Solo imágenes"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Máximo 5 MB"); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!name.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (!tagline.trim()) { toast.error("La descripción corta es obligatoria"); return; }
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (!priceNum || priceNum <= 0) { toast.error("Define un precio mayor a $0"); return; }
    if (deliveryMode === "file" && !productFile) { toast.error("Sube el archivo del producto"); return; }
    if (deliveryMode === "link" && !downloadUrl.trim()) { toast.error("Ingresa la URL de descarga"); return; }

    setSaving(true);
    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        tagline: tagline.trim(),
        category,
        price: priceNum,
        recurring: false,
        status: "live",
        licensing_enabled: false,
        imageFile,
        productFile: deliveryMode === "file" ? productFile : null,
        downloadUrl: deliveryMode === "link" ? downloadUrl.trim() : undefined,
        fileName: productFile?.name,
      });
      toast.success(`🚀 "${name.trim()}" publicado en el Marketplace`);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo publicar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Rocket className="size-5 text-primary" /> Publicar producto digital
          </SheetTitle>
          <SheetDescription>
            Completa los datos y sube tu archivo para empezar a vender al instante.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Cover image */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Imagen de portada</Label>
            <div
              className="relative rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-all cursor-pointer overflow-hidden bg-black/20"
              style={{ aspectRatio: "16/9" }}
              onClick={() => imageRef.current?.click()}
            >
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageChange(f); }}
              />
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium flex items-center gap-1.5">
                      <Image className="size-3.5" /> Cambiar imagen
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(""); }}
                    className="absolute top-2 right-2 size-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-destructive transition-colors"
                  >
                    <X className="size-3 text-white" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Image className="size-8 opacity-40" />
                  <span className="text-xs">Haz clic para agregar portada</span>
                  <span className="text-[10px] opacity-60">PNG, JPG, WEBP · máx 5 MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Nombre del producto *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Guía completa de Python con IA"
              className="bg-black/20 h-10"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Descripción corta *</Label>
            <Input
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Ej: 200 páginas · PDF · De cero a experto"
              className="bg-black/20 h-10"
              maxLength={120}
            />
            <div className="text-[10px] text-muted-foreground text-right">{tagline.length}/120</div>
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Categoría</Label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-black/20 px-3 text-sm text-foreground"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Precio COP *</Label>
              <Input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="29000"
                min={0}
                className="bg-black/20 h-10"
              />
            </div>
          </div>

          {/* Delivery mode */}
          <div className="space-y-3">
            <Label className="text-xs font-medium">Entrega del producto *</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMode("file")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${deliveryMode === "file" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                <UploadCloud className="size-4" /> Archivo digital
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode("link")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${deliveryMode === "link" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
              >
                <Link2 className="size-4" /> Link externo
              </button>
            </div>

            {deliveryMode === "file" ? (
              <div
                className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${productFile ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/40 bg-black/20"}`}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) setProductFile(f); }}
                />
                {productFile ? (
                  <div className="flex items-center gap-3 text-left">
                    <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono font-bold text-primary">
                        {productFile.name.split(".").pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{productFile.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {(productFile.size / 1024 / 1024).toFixed(1)} MB · Listo para distribuir
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setProductFile(null); }}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="size-8 text-muted-foreground mx-auto mb-2 opacity-60" />
                    <div className="text-sm font-medium">Arrastra o haz clic para subir</div>
                    <div className="text-xs text-muted-foreground mt-0.5">PDF, ZIP, MP4, EPUB, EXE, APK... · hasta 10 GB</div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Input
                  value={downloadUrl}
                  onChange={e => setDownloadUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="bg-black/20 h-10"
                />
                <p className="text-[10px] text-muted-foreground">
                  Google Drive, Dropbox, Notion, Gumroad — cualquier link de acceso funciona.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contrast" className="flex-1 gap-2" onClick={handlePublish} disabled={saving}>
            {saving ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Rocket className="size-4" />
            )}
            {saving ? "Publicando..." : "Publicar ahora"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

// ─── Social Share Sheet ───────────────────────────────────────────────────────

const PEXELS_BG = [
  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/1714202/pexels-photo-1714202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5905716/pexels-photo-5905716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/8546475/pexels-photo-8546475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

function productImage(product: DBProduct): string {
  if (product.cover_url) return product.cover_url;
  let h = 0;
  for (let i = 0; i < product.id.length; i++) h = (h * 31 + product.id.charCodeAt(i)) >>> 0;
  return PEXELS_BG[h % PEXELS_BG.length];
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors shrink-0">
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

// ── Facebook/Instagram Carousel Preview ───────────────────────────────────────

function CarouselPreview({ product, imgUrl }: { product: DBProduct; imgUrl: string }) {
  const [idx, setIdx] = useState(0);
  const price = fmtCOPStore(product.price);

  const cards = [
    { type: "hero",     label: "Portada",    bg: imgUrl },
    { type: "feature",  label: "Características", bg: imgUrl },
    { type: "price",    label: "Precio",     bg: imgUrl },
  ];

  return (
    <div className="relative">
      {/* Carousel frame — Facebook-inspired */}
      <div className="rounded-2xl overflow-hidden border border-[#3a3b3c] bg-[#18191a] shadow-2xl">
        {/* FB post header */}
        <div className="flex items-center gap-2.5 p-3 border-b border-[#3a3b3c]">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">P</div>
          <div>
            <div className="text-[11px] font-bold text-white">PULSE AI Store</div>
            <div className="text-[9px] text-[#b0b3b8]">Publicidad · 🌐</div>
          </div>
          <div className="ml-auto text-[10px] text-[#b0b3b8]">···</div>
        </div>

        {/* Caption */}
        <div className="px-3 pb-2 pt-1">
          <p className="text-[10px] text-[#e4e6ea] leading-relaxed line-clamp-2">
            🔥 <span className="font-bold">{product.name}</span> — {product.tagline || "Producto digital premium"} · {price} COP ✅ Descarga instantánea
          </p>
        </div>

        {/* Carousel cards */}
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {cards.map((card, i) => (
              <div key={i} className="relative shrink-0 w-full" style={{ aspectRatio: "1/1" }}>
                <img src={card.bg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {card.type === "hero" && (
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <span className="text-[9px] text-white/60 uppercase tracking-widest mb-1">Producto digital</span>
                    <div className="text-base font-extrabold text-white leading-tight mb-1">{product.name}</div>
                    <div className="text-[11px] text-white/80 line-clamp-2">{product.tagline || "Descarga instantánea"}</div>
                  </div>
                )}
                {card.type === "feature" && (
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="space-y-1 mb-2">
                      {["✅ Acceso de por vida", "✅ Garantía 30 días", "✅ Soporte incluido", "✅ Descarga instantánea"].map(f => (
                        <div key={f} className="text-[10px] text-white font-medium">{f}</div>
                      ))}
                    </div>
                    <div className="text-[9px] text-white/60">{product.category || "Producto digital"}</div>
                  </div>
                )}
                {card.type === "price" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="text-[11px] text-white/60 uppercase tracking-widest mb-2">Precio especial</div>
                    <div className="text-3xl font-extrabold text-primary mb-1">{price}</div>
                    <div className="text-[10px] text-white/60 mb-3">COP · Pago seguro</div>
                    <div className="px-5 py-2 bg-primary rounded-xl text-[11px] font-bold text-primary-foreground">
                      Comprar ahora →
                    </div>
                  </div>
                )}

                {/* Card counter */}
                <div className="absolute top-2 right-2 bg-black/60 rounded-full px-2 py-0.5 text-[9px] text-white font-mono">
                  {i + 1}/{cards.length}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-black/70 flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/90 transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => setIdx(i => Math.min(cards.length - 1, i + 1))} disabled={idx === cards.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-black/70 flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/90 transition-colors">
            <ChevronRight className="size-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {cards.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${idx === i ? "w-4 h-1.5 bg-primary" : "size-1.5 bg-white/40"}`} />
            ))}
          </div>
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#3a3b3c]">
          <div className="text-[10px] text-[#b0b3b8]">pulseai.co · Compra ya</div>
          <div className="px-3 py-1.5 bg-[#2d88ff] rounded-lg text-[10px] font-bold text-white">Comprar ahora</div>
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-4 px-3 py-2 border-t border-[#3a3b3c]">
          {["👍 Me gusta", "💬 Comentar", "↗️ Compartir"].map(a => (
            <span key={a} className="text-[10px] text-[#b0b3b8] font-medium">{a}</span>
          ))}
        </div>
      </div>

      {/* Slide indicator */}
      <p className="text-center text-[10px] text-muted-foreground mt-2">
        Tarjeta {idx + 1} de {cards.length} · desliza las flechas para navegar
      </p>
    </div>
  );
}

// ── Instagram Preview ─────────────────────────────────────────────────────────

function InstagramPreview({ product, imgUrl, variant }: { product: DBProduct; imgUrl: string; variant: "feed" | "story" | "reel" }) {
  const isVertical = variant === "story" || variant === "reel";
  return (
    <div className="flex justify-center">
      <div style={{ width: isVertical ? 180 : 260 }} className="rounded-2xl overflow-hidden border border-border bg-black shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 p-2 bg-black border-b border-white/10">
          <div className="size-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">P</div>
          <div className="text-[9px] text-white font-bold flex-1">pulse_ai_store</div>
          <div className="text-[9px] text-white/40">···</div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden bg-black" style={{ aspectRatio: isVertical ? "9/16" : "1/1" }}>
          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
          {isVertical && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          )}

          {variant === "story" && (
            <>
              {/* Story progress bars */}
              <div className="absolute top-2 left-2 right-2 flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex-1 h-0.5 rounded-full ${i === 1 ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
              <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                <div className="text-sm font-extrabold text-white drop-shadow-lg mb-1">{product.name}</div>
                <div className="text-[10px] text-white/80 mb-3">{fmtCOPStore(product.price)} COP</div>
                <div className="inline-block bg-white text-black text-[10px] font-bold px-4 py-2 rounded-full">
                  Desliza hacia arriba ↑
                </div>
              </div>
            </>
          )}

          {variant === "reel" && (
            <>
              <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3">
                {["❤️\n2.4K", "💬\n341", "↗️\n892"].map(a => (
                  <div key={a} className="text-center text-[8px] text-white font-bold whitespace-pre-line">{a}</div>
                ))}
              </div>
              <div className="absolute bottom-4 left-2 right-10">
                <div className="text-[9px] font-bold text-white mb-0.5">@pulse_ai_store</div>
                <div className="text-[8px] text-white/80 line-clamp-2">{product.tagline || product.name} 🔥</div>
                <div className="text-[8px] text-primary mt-1">#ProductosDigitales #Colombia #PulseAI</div>
              </div>
            </>
          )}

          {variant === "feed" && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div className="text-[10px] font-bold text-white">{product.name}</div>
              <div className="text-[9px] text-white/70">{fmtCOPStore(product.price)} COP</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isVertical && (
          <div className="px-2 py-1.5 bg-black">
            <div className="flex items-center justify-between mb-1">
              <div className="flex gap-2">
                {["♥", "💬", "↗"].map(i => <span key={i} className="text-white text-xs">{i}</span>)}
              </div>
              <span className="text-white/40 text-xs">🔖</span>
            </div>
            <div className="text-[9px] text-white/60 truncate">
              <span className="text-white font-bold">pulse_ai_store </span>
              {product.tagline || product.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TikTok Preview ────────────────────────────────────────────────────────────

function TikTokPreview({ product, imgUrl }: { product: DBProduct; imgUrl: string }) {
  return (
    <div className="flex justify-center">
      <div style={{ width: 180 }} className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
        <div className="relative" style={{ aspectRatio: "9/16" }}>
          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

          {/* Username + description */}
          <div className="absolute bottom-10 left-2 right-10">
            <div className="text-[9px] font-bold text-white mb-1">@pulse_ai_store</div>
            <div className="text-[8px] text-white/80 leading-tight mb-1 line-clamp-3">
              {product.name} 🚀 Solo {fmtCOPStore(product.price)} COP · Descarga instantánea ✅
            </div>
            <div className="text-[8px] text-primary">#ProductoDigital #Colombia #TechTips #PulseAI #Emprendimiento</div>
          </div>

          {/* Music bar */}
          <div className="absolute bottom-3 left-2 right-2 flex items-center gap-1.5">
            <Music className="size-2.5 text-white/60 shrink-0" />
            <div className="flex-1 overflow-hidden">
              <div className="text-[7px] text-white/50 whitespace-nowrap animate-[marquee_6s_linear_infinite]">
                PULSE AI — Tu marketplace digital favorito ♪
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="absolute right-2 bottom-10 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className="size-7 rounded-full bg-gradient-to-br from-[#69C9D0] to-[#EE1D52] border-2 border-white flex items-center justify-center">
                <span className="text-[7px] font-bold text-white">P</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center -mt-1.5 shadow">
                <span className="text-[8px]">+</span>
              </div>
            </div>
            {[["❤️", "14.2K"], ["💬", "893"], ["🔖", "3.1K"], ["↗️", "7.5K"]].map(([icon, count]) => (
              <div key={icon} className="flex flex-col items-center">
                <span className="text-base leading-none">{icon}</span>
                <span className="text-[6px] text-white/70 font-bold">{count}</span>
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-2 left-0 right-0 flex items-center justify-center gap-8">
            <span className="text-[9px] text-white/50 font-medium">Siguiendo</span>
            <span className="text-[9px] text-white font-bold border-b border-white pb-0.5">Para Ti</span>
            <span className="text-[9px] text-white/50 font-medium">Explorar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Twitter/X Preview ─────────────────────────────────────────────────────────

function XPreview({ product, imgUrl }: { product: DBProduct; imgUrl: string }) {
  const url = "pulseai.co/marketplace";
  return (
    <div className="rounded-2xl overflow-hidden border border-[#2f3336] bg-black shadow-2xl">
      {/* Tweet header */}
      <div className="flex items-start gap-3 p-4">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground shrink-0">P</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-sm font-bold text-white">PULSE AI</span>
            <span className="text-[10px] text-[#536471]">@pulseai_co · ahora</span>
          </div>
          <p className="text-[12px] text-[#e7e9ea] mt-1 leading-relaxed">
            🚀 Nuevo producto disponible en nuestro marketplace<br />
            <span className="font-bold">→ {product.name}</span><br />
            💰 {fmtCOPStore(product.price)} COP · Descarga instantánea<br />
            ✅ Garantía 30 días · Pago seguro<br />
            <span className="text-[#1d9bf0]">#ProductosDigitales #Colombia #PulseAI</span>
          </p>

          {/* Link card */}
          <div className="mt-2 rounded-xl overflow-hidden border border-[#2f3336]">
            <div className="relative" style={{ aspectRatio: "16/9" }}>
              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 bg-[#16181c]">
              <div className="text-[9px] text-[#536471] mb-0.5">{url}</div>
              <div className="text-[11px] font-bold text-[#e7e9ea] line-clamp-1">{product.name}</div>
              <div className="text-[10px] text-[#536471] line-clamp-1">{product.tagline || "Descarga instantánea en PULSE AI"}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 text-[#536471] text-[11px]">
            {["💬 234", "🔁 1.2K", "❤️ 8.4K", "📊", "↗"].map(a => (
              <span key={a} className="hover:text-primary transition-colors cursor-pointer">{a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── YouTube Preview ───────────────────────────────────────────────────────────

function YouTubePreview({ product, imgUrl }: { product: DBProduct; imgUrl: string }) {
  return (
    <div className="space-y-3">
      {/* Thumbnail */}
      <div>
        <div className="text-[10px] text-muted-foreground mb-2 font-medium">Miniatura del video (16:9)</div>
        <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="text-xs font-extrabold text-white drop-shadow-lg leading-tight">
              {product.name} — Solo {fmtCOPStore(product.price)} COP 🔥
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/90 rounded text-[9px] text-white px-1.5 py-0.5 font-mono">
            12:47
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
            <div className="size-12 rounded-full bg-red-600 flex items-center justify-center">
              <Play className="size-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Video info */}
      <div className="flex gap-3">
        <div className="size-9 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm shrink-0">P</div>
        <div>
          <div className="text-xs font-bold leading-tight line-clamp-2">
            🚀 {product.name} | SOLO {fmtCOPStore(product.price)} COP | Descarga INSTANTÁNEA | PULSE AI
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">PULSE AI Store · 12K vistas · hace 2 horas</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Social Share Sheet ───────────────────────────────────────────────────

type SocialPlatform = "facebook" | "instagram" | "tiktok" | "twitter" | "youtube" | "whatsapp";

const PLATFORMS: { id: SocialPlatform; label: string; color: string }[] = [
  { id: "facebook",  label: "Facebook",  color: "#1877F2" },
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "tiktok",    label: "TikTok",    color: "#ff0050" },
  { id: "twitter",   label: "X",         color: "#ffffff" },
  { id: "youtube",   label: "YouTube",   color: "#FF0000" },
  { id: "whatsapp",  label: "WhatsApp",  color: "#25D366" },
];

function SocialShareSheet({ open, onClose, product }: {
  open: boolean; onClose: () => void; product: DBProduct | null;
}) {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook");
  const [igVariant, setIgVariant] = useState<"feed" | "story" | "reel">("feed");

  if (!product) return null;

  const img = productImage(product);
  const price = fmtCOPStore(product.price);
  const url = `https://pulseai.co/marketplace?product=${product.id}`;
  const utm = (p: string) => `${url}&utm_source=${p}&utm_medium=social&utm_campaign=share`;

  const captions: Record<SocialPlatform, string> = {
    facebook: `🚀 ¡Nuevo producto disponible en PULSE AI!\n\n✅ ${product.name}\n\n${product.tagline || "Producto digital de alta calidad"}\n\n💰 Solo ${price} COP\n📦 Descarga instantánea\n✅ Garantía 30 días sin preguntas\n🔒 Pago 100% seguro con Mercado Pago\n\n👇 Cómpralo ahora:\n${utm("facebook")}\n\n#ProductosDigitales #Colombia #DescargaInstantanea #PulseAI #Emprendimiento`,
    instagram: `✨ ${product.name} ya disponible en @pulseai_co 🔥\n\n${product.tagline || "El producto digital que estabas esperando"}\n\n💰 ${price} COP · Descarga al instante\n✅ Garantía 30 días total\n📲 Pago con Nequi, PSE o Mercado Pago\n\n🔗 Link en bio → pulseai.co\n.\n.\n.\n#ProductosDigitales #DesarrolloDigital #Emprendimiento #Colombia #TechLatam #PulseAI #NegocioDigital #EmprendedorLatino`,
    tiktok:    `${product.name} por solo ${price} COP 🤯\n\nDescarga al INSTANTE en PULSE AI 🚀\n✅ Garantía 30 días\n💳 Paga con Nequi\n\n${utm("tiktok")}\n\n#ProductoDigital #Colombia #PulseAI #Emprendimiento #Tech #NegocioOnline #GanarDineroOnline #EmprendedorLatino`,
    twitter:   `🚀 Nuevo en @pulseai_co:\n\n"${product.name}"\n\n💰 ${price} COP · Descarga instantánea\n✅ Garantía 30 días\n🔒 Pago seguro\n\n${utm("twitter")}\n\n#ProductosDigitales #Colombia #PulseAI`,
    youtube:   `🚀 ${product.name.toUpperCase()} | SOLO ${price} COP | Descarga INSTANTÁNEA | PULSE AI\n\n📋 DESCRIPCIÓN:\n${product.tagline || "Producto digital premium con descarga instantánea"}\n\n✅ Lo que incluye:\n• Acceso de por vida\n• Soporte incluido\n• Garantía 30 días\n• Descarga al instante\n\n🛒 Comprar ahora: ${utm("youtube")}\n\n⏱️ TIMESTAMPS:\n0:00 - Intro\n1:30 - ¿Qué incluye?\n4:00 - Demo\n8:00 - Precio y dónde comprarlo\n\n#ProductosDigitales #Colombia #PulseAI`,
    whatsapp:  `Hola 👋\n\nMira este producto que acabo de encontrar en PULSE AI:\n\n🔥 *${product.name}*\n\n${product.tagline || "Producto digital de alta calidad"}\n\nPrecio: *${price} COP*\n✅ Descarga instantánea\n✅ Garantía 30 días\n🔒 Pago seguro\n\n👉 ${utm("whatsapp")}`,
  };

  const shareLinks: Partial<Record<SocialPlatform, string>> = {
    twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(captions.twitter)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(captions.whatsapp)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(utm("facebook"))}`,
  };

  const current = PLATFORMS.find(p => p.id === platform)!;

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col gap-0 p-0 overflow-hidden">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Share2 className="size-4 text-primary" /> Kit de redes sociales
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            {product.name} · {fmtCOPStore(product.price)} COP
          </SheetDescription>
        </SheetHeader>

        {/* Platform tabs */}
        <div className="flex border-b border-border overflow-x-auto shrink-0">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all
                ${platform === p.id ? "text-foreground border-current" : "text-muted-foreground border-transparent hover:text-foreground"}`}
              style={{ borderBottomColor: platform === p.id ? p.color : "transparent" }}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Platform variant toggles */}
          {platform === "instagram" && (
            <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl border border-border w-fit">
              {(["feed", "story", "reel"] as const).map(v => (
                <button key={v} onClick={() => setIgVariant(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                    ${igVariant === v ? "bg-[#E1306C] text-white" : "text-muted-foreground hover:text-foreground"}`}>
                  {v === "feed" ? "Feed" : v === "story" ? "Story" : "Reel"}
                </button>
              ))}
            </div>
          )}

          {/* Visual preview */}
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className="size-1.5 rounded-full" style={{ backgroundColor: current.color }} />
              Vista previa — {current.label}
            </div>

            {platform === "facebook"  && <CarouselPreview product={product} imgUrl={img} />}
            {platform === "instagram" && <InstagramPreview product={product} imgUrl={img} variant={igVariant} />}
            {platform === "tiktok"    && <TikTokPreview product={product} imgUrl={img} />}
            {platform === "twitter"   && <XPreview product={product} imgUrl={img} />}
            {platform === "youtube"   && <YouTubePreview product={product} imgUrl={img} />}
            {platform === "whatsapp"  && (
              <div className="rounded-2xl overflow-hidden border border-border bg-[#111b21] shadow-2xl p-4">
                <div className="bg-[#005c4b] rounded-2xl rounded-tl-none p-3 max-w-[90%]">
                  <p className="text-[11px] text-[#d1f4cc] whitespace-pre-wrap leading-relaxed">{captions.whatsapp}</p>
                  <div className="text-[9px] text-[#8696a0] text-right mt-1">ahora ✓✓</div>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Texto optimizado para {current.label}</span>
              <CopyBtn text={captions[platform]} />
            </div>
            <div className="rounded-xl bg-black/20 border border-border p-3 text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono max-h-36 overflow-y-auto">
              {captions[platform]}
            </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Link con tracking UTM</span>
              <CopyBtn text={utm(platform)} />
            </div>
            <div className="rounded-xl bg-black/20 border border-border px-3 py-2 text-[10px] font-mono text-muted-foreground break-all">
              {utm(platform)}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pb-2">
            <span className="text-xs font-semibold">Acciones</span>
            <div className="flex flex-wrap gap-2">
              {shareLinks[platform] && (
                <a href={shareLinks[platform]} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: current.color }}>
                  <Zap className="size-3.5" /> Publicar en {current.label}
                </a>
              )}
              {platform === "facebook" && (
                <a href="https://www.facebook.com/adsmanager/creation" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/5 transition-colors">
                  <BarChart3 className="size-3.5" /> Crear anuncio carousel (Meta Ads)
                </a>
              )}
              {platform === "youtube" && (
                <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000]/5 transition-colors">
                  <Play className="size-3.5" /> Abrir YouTube Studio
                </a>
              )}
              {platform === "tiktok" && (
                <a href="https://www.tiktok.com/upload" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #69C9D0, #EE1D52)" }}>
                  <Music className="size-3.5" /> Subir a TikTok
                </a>
              )}
              {platform === "instagram" && (
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(45deg, #F09433, #E6683C, #DC2743, #CC2366, #BC1888)" }}>
                  <Share2 className="size-3.5" /> Abrir Instagram
                </a>
              )}
              <button onClick={() => { navigator.clipboard.writeText(captions[platform]); toast.success("Contenido copiado al portapapeles"); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/20 transition-colors">
                <Copy className="size-3.5" /> Copiar todo el contenido
              </button>
            </div>
          </div>

          {/* Tip */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {platform === "facebook" && "💡 El carrusel de Facebook genera hasta 3× más clics que una imagen estática. Úsalo para mostrar características del producto en cada tarjeta."}
              {platform === "instagram" && igVariant === "story" && "💡 Los Stories con un CTA de 'Desliza hacia arriba' tienen 33% más conversión que los posts normales."}
              {platform === "instagram" && igVariant === "reel" && "💡 Los Reels de 7-15 segundos muestran el producto en acción. Graba la pantalla usando el producto para máximo impacto."}
              {platform === "instagram" && igVariant === "feed" && "💡 Publica en horario de mayor actividad: 11am-1pm o 7pm-9pm en tu zona horaria."}
              {platform === "tiktok" && "💡 Los videos de TikTok de 15-30s con música de tendencia alcanzan el 5× más alcance orgánico. Usa el texto generado como descripción."}
              {platform === "twitter" && "💡 Los tweets con imagen tienen 3× más engagement. Sube la portada del producto como imagen adjunta al tweet."}
              {platform === "youtube" && "💡 Una thumbnail con texto grande y cara expresiva aumenta el CTR hasta 40%. Usa el título sugerido para el video de demostración."}
              {platform === "whatsapp" && "💡 Envía el mensaje a tus grupos y listas de difusión. Los mensajes con precio claro y CTA directo convierten 2× mejor."}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

function ProductRow({ product, onDelete, onToggle, onShare }: {
  product: DBProduct;
  onDelete: (id: string) => void;
  onToggle: (product: DBProduct) => void;
  onShare: (product: DBProduct) => void;
}) {
  const mainFile = product.product_files?.find(f => f.kind !== "image") ?? product.product_files?.[0];
  const img = productImage(product);

  return (
    <div className="rounded-2xl bg-surface border border-border p-5 hover:border-primary/20 transition-colors">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="size-16 rounded-xl border border-border overflow-hidden shrink-0 bg-primary/5">
          {img ? (
            <img src={img} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">
              {categoryEmoji[product.category ?? ""] || "📦"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-sm truncate">{product.name}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              product.status === "live" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-secondary text-muted-foreground"
            }`}>
              {product.status === "live" ? "● EN VIVO" : "○ BORRADOR"}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-2 line-clamp-1">{product.tagline}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {mainFile ? (
                <><UploadCloud className="size-3 text-primary" /> {mainFile.name} · {mainFile.size}</>
              ) : (
                <><Link2 className="size-3 text-primary" /> Sin archivo</>
              )}
            </div>
            {product.licensing_enabled && (
              <div className="text-[10px] text-primary font-mono flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                Licencias activas
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0 hidden sm:block">
          <div className="text-xl font-extrabold text-primary">{fmtCOPStore(product.price)}</div>
          {product.recurring && <div className="text-[10px] text-muted-foreground">/mes</div>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border flex-wrap gap-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            {categoryEmoji[product.category ?? ""]} {product.category}
          </span>
          <span>Creado {new Date(product.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {product.status === "live" && (
            <a href="/marketplace" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline">
              <ExternalLink className="size-3" /> Ver en marketplace
            </a>
          )}
          {/* Share button */}
          <button
            onClick={() => onShare(product)}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
          >
            <Share2 className="size-3" /> Compartir
          </button>
          <button
            onClick={() => onToggle(product)}
            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
              product.status === "live"
                ? "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/5"
                : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5"
            }`}
          >
            {product.status === "live" ? "Despublicar" : "Publicar"}
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="size-7 flex items-center justify-center rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onPublish }: { onPublish: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="size-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-6">
        <UploadCloud className="size-9 text-primary/60" />
      </div>
      <h3 className="text-lg font-bold mb-2">Aún no tienes productos</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        Publica tu primer producto y empieza a vender a miles de compradores en PULSE AI.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="contrast" className="gap-2" onClick={onPublish}>
          <Rocket className="size-4" /> Publicar mi primer producto
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/dashboard/settings">
            <Globe className="size-4" /> Habilitar para publicar
          </Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Products Page ────────────────────────────────────────────────────────────

function Products() {
  const { data: products = [], isLoading } = useMyProducts();
  const updateStatus = useUpdateProductStatus();
  const deleteProduct = useDeleteProduct();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareProduct, setShareProduct] = useState<DBProduct | null>(null);

  const liveProducts = products.filter(p => p.status === "live");
  const draftProducts = products.filter(p => p.status === "draft");

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Producto eliminado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
    }
  };

  const handleToggle = async (p: DBProduct) => {
    const newStatus = p.status === "live" ? "draft" : "live";
    try {
      await updateStatus.mutateAsync({ id: p.id, status: newStatus });
      toast(newStatus === "live" ? `"${p.name}" publicado ✅` : `"${p.name}" despublicado`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar");
    }
  };

  return (
    <DashboardLayout
      title="Mis Productos"
      breadcrumb={["Dashboard", "Productos"]}
      actions={
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link to="/dashboard/settings">
              <Globe className="size-4" /> Habilitar para publicar
            </Link>
          </Button>
          <Button size="sm" variant="contrast" className="gap-1.5" onClick={() => setSheetOpen(true)}>
            <Plus className="size-4" /> Nuevo producto
          </Button>
        </div>
      }
    >
      <QuickPublishSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <SocialShareSheet
        open={shareProduct !== null}
        onClose={() => setShareProduct(null)}
        product={shareProduct}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState onPublish={() => setSheetOpen(true)} />
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Publicados", value: liveProducts.length, icon: Rocket, color: "text-emerald-400" },
              { label: "Borradores", value: draftProducts.length, icon: FileText, color: "text-yellow-400" },
              { label: "Total", value: products.length, icon: BarChart3, color: "text-primary" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-surface border border-border p-4 text-center">
                <s.icon className={`size-5 mx-auto mb-1.5 ${s.color}`} />
                <div className="text-xl font-extrabold">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live */}
          {liveProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500" />
                <h2 className="text-sm font-bold">En Marketplace ({liveProducts.length})</h2>
              </div>
              {liveProducts.map(p => (
                <ProductRow key={p.id} product={p} onDelete={handleDelete} onToggle={handleToggle} onShare={setShareProduct} />
              ))}
            </div>
          )}

          {/* Drafts */}
          {draftProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-yellow-500" />
                <h2 className="text-sm font-bold">Borradores ({draftProducts.length})</h2>
              </div>
              {draftProducts.map(p => (
                <ProductRow key={p.id} product={p} onDelete={handleDelete} onToggle={handleToggle} onShare={setShareProduct} />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
