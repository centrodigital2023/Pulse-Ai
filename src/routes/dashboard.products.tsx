import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, FileCode, FileText, Video, Music, Image, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { type FileKind } from "@/lib/mock-data";
import { useMyProducts } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({ meta: [{ title: "Productos — PULSE AI Dashboard" }] }),
  component: Products,
});

const kindIcon: Record<FileKind, typeof FileCode> = {
  code: FileCode,
  doc: FileText,
  video: Video,
  audio: Music,
  image: Image,
};

function Products() {
  const { user } = useAuth();
  const { data: products, isLoading } = useMyProducts();

  return (
    <DashboardLayout
      title="Productos"
      breadcrumb={["Dashboard", "Productos"]}
      actions={
        <Button asChild size="sm" variant="contrast">
          <Link to="/dashboard/products/new">
            <Plus className="size-4" /> Nuevo producto
          </Link>
        </Button>
      }
    >
      {!user ? (
        <div className="rounded-xl bg-surface border border-border p-12 text-center text-sm text-muted-foreground">
          Inicia sesión para gestionar tus productos.
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : !products || products.length === 0 ? (
        <div className="rounded-xl bg-surface border border-border p-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Aún no tienes productos. Crea el primero.</p>
          <Button asChild size="sm" variant="contrast">
            <Link to="/dashboard/products/new"><Plus className="size-4" /> Nuevo producto</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl bg-surface border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">{p.version}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        p.status === "live" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold tracking-tight">
                    ${p.price}
                    {p.recurring && <span className="text-xs text-muted-foreground font-normal">/mo</span>}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">{p.category}</div>
                </div>
              </div>

              {p.product_files.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {p.product_files.map((f) => {
                    const Icon = kindIcon[f.kind];
                    return (
                      <span key={f.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/20 border border-border text-xs text-muted-foreground">
                        <Icon className="size-3.5 text-primary" />
                        {f.name}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="text-xs font-mono text-muted-foreground">
                  Licencias: <span className="text-foreground">{p.licensing_enabled ? "Activadas" : "Desactivadas"}</span>
                </div>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
