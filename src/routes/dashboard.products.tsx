import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, Rocket, FileText, UploadCloud, Link2, Globe, ExternalLink, BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { fmtCOPStore } from "@/lib/products-store";
import {
  useMyProducts,
  useUpdateProductStatus,
  useDeleteProduct,
  type DBProduct,
} from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({ meta: [{ title: "Mis Productos — PULSE AI Dashboard" }] }),
  component: Products,
});

const categoryEmoji: Record<string, string> = {
  software: "💻", education: "🎓", resources: "🎨", books: "📚", services: "⚡",
  "Software & SaaS": "💻", "Cursos & Educación": "🎓", "Plantillas & Recursos": "🎨",
  "eBooks & Guías": "📚", "Servicios": "⚡",
};

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

          {/* Delivery info */}
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

        {/* Stats */}
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
            <a
              href="/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
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

function EmptyState() {
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
        <Button asChild variant="contrast" className="gap-2">
          <Link to="/dashboard/products/new">
            <Rocket className="size-4" /> Publicar mi primer producto
          </Link>
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

function Products() {
  const { data: products = [], isLoading } = useMyProducts();
  const updateStatus = useUpdateProductStatus();
  const deleteProduct = useDeleteProduct();

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
        <Button asChild size="sm" variant="contrast" className="gap-1.5">
          <Link to="/dashboard/products/new">
            <Plus className="size-4" /> Nuevo producto
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState />
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

          {/* Live products */}
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

          {/* Draft products */}
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
