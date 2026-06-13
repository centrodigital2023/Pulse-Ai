import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Package, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { useMyOrders, type DBOrder } from "@/lib/db";
import { fmtCOP } from "@/lib/user-store";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Mi Biblioteca — PULSE AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useMyOrders();
  const [active, setActive] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(!user);

  const item: DBOrder | undefined = orders.find((o) => o.id === active) ?? orders[0];

  const handleDownload = (o: DBOrder) => {
    if (o.download_url) {
      window.open(o.download_url, "_blank", "noopener");
    } else {
      toast.success(`Preparando la descarga de "${o.product_name}"`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="h-16 border-b border-border flex items-center px-6">
          <Link to="/marketplace"><Logo /></Link>
        </header>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Package className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Inicia sesión para ver tu biblioteca</h1>
            <p className="text-muted-foreground text-sm">Accede a todos los productos que has comprado.</p>
          </div>
          <Button variant="contrast" onClick={() => setShowAuth(true)}>Iniciar sesión</Button>
          {showAuth && <AuthModal onClose={() => { setShowAuth(false); if (!user) navigate({ to: "/marketplace" }); }} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <Link to="/marketplace"><Logo /></Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/marketplace">Marketplace</Link></Button>
          <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono">
            {user.initials}
          </div>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <Package className="size-12 opacity-30" />
          <div>
            <p className="font-semibold mb-1">{isLoading ? "Cargando tu biblioteca..." : "Tu biblioteca está vacía"}</p>
            {!isLoading && <p className="text-sm text-muted-foreground mb-4">Compra un producto y aparecerá aquí al instante.</p>}
          </div>
          {!isLoading && (
            <Link to="/marketplace" className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
              <ShoppingBag className="size-4" /> Ir al Marketplace
            </Link>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Library list */}
          <aside className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Mi biblioteca ({orders.length})</div>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActive(o.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                  o.id === item?.id ? "bg-primary/10 border-primary/30" : "bg-surface border-border hover:border-primary/20"
                }`}
              >
                <img
                  src={o.product_image || `https://picsum.photos/seed/${o.id}/48/48`}
                  alt=""
                  loading="lazy"
                  width={48}
                  height={48}
                  className="size-12 rounded object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{o.product_name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    PLS-{o.id.slice(-8).toUpperCase()} • {new Date(o.created_at).toLocaleDateString("es-CO")}
                  </div>
                </div>
              </button>
            ))}
          </aside>

          {/* Detail */}
          {item && (
            <main className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{item.product_name}</h1>
                <p className="text-sm text-muted-foreground">
                  Orden PLS-{item.id.slice(-8).toUpperCase()} • {new Date(item.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <img
                    src={item.product_image || `https://picsum.photos/seed/${item.id}/120/120`}
                    alt=""
                    className="size-16 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{item.product_name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Pagado · {fmtCOP(item.amount)} {item.currency}
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-1 shrink-0">
                    Acceso activo
                  </span>
                </div>
                <div className="border-t border-border p-5">
                  <Button variant="contrast" onClick={() => handleDownload(item)} className="gap-2">
                    <Download className="size-4" />
                    Descargar producto
                  </Button>
                  <p className="text-[11px] text-muted-foreground mt-3">
                    Acceso de por vida. Verificado mediante PULSE API. Si tienes problemas con la descarga, contáctanos.
                  </p>
                </div>
              </div>
            </main>
          )}
        </div>
      )}
    </div>
  );
}
