import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, Rocket, FileText, UploadCloud, Link2, Globe, ExternalLink, BarChart3, Image, X } from "lucide-react";
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

function ProductRow({ product, onDelete, onToggle }: {
  product: DBProduct;
  onDelete: (id: string) => void;
  onToggle: (product: DBProduct) => void;
}) {
  const mainFile = product.product_files?.find(f => f.kind !== "image") ?? product.product_files?.[0];
  return (
    <div className="rounded-2xl bg-surface border border-border p-5 hover:border-primary/20 transition-colors">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="size-16 rounded-xl border border-border overflow-hidden shrink-0 bg-primary/5">
          <div className="w-full h-full flex items-center justify-center text-xl">
            {categoryEmoji[product.category ?? ""] || "📦"}
          </div>
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
        <div className="flex items-center gap-2">
          {product.status === "live" && (
            <a href="/marketplace" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline">
              <ExternalLink className="size-3" /> Ver en marketplace
            </a>
          )}
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
                <ProductRow key={p.id} product={p} onDelete={handleDelete} onToggle={handleToggle} />
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
                <ProductRow key={p.id} product={p} onDelete={handleDelete} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
