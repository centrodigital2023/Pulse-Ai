import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingBag, Star, User, Tag, Wallet, Store, Clock, MapPin,
  LogOut, ChevronRight, Trash2, Plus, Check, Copy, CreditCard,
  Package, AlertTriangle, Shield, RotateCcw,
  ShoppingCart, Heart, Eye, Edit2, CheckCircle2,
  Lock, Zap, Users, Share2, Link2, Download, Gift,
  Minus,
} from "lucide-react";
import { SiteNav, BackToMarketplace } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth-context";
import {
  useUserStore, fmtCOP,
  type CartItem,
} from "@/lib/user-store";
import { toast } from "sonner";

export const Route = createFileRoute("/perfil")({
  validateSearch: (search: Record<string, unknown>) => ({
    s: typeof search.s === "string" ? search.s : undefined,
  }),
  head: () => ({ meta: [{ title: "Mi Cuenta — PULSE AI" }] }),
  component: PerfilPage,
});

type Section = "pedidos" | "resenas" | "perfil" | "cupones" | "credito" | "tiendas" | "historial" | "direcciones" | "referidos";

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "pedidos", label: "Tus pedidos", icon: ShoppingBag },
  { id: "resenas", label: "Tus reseñas", icon: Star },
  { id: "perfil", label: "Tu perfil", icon: User },
  { id: "cupones", label: "Cupones y ofertas", icon: Tag },
  { id: "credito", label: "Saldo de crédito", icon: Wallet },
  { id: "tiendas", label: "Tiendas que sigues", icon: Store },
  { id: "historial", label: "Historial", icon: Clock },
  { id: "direcciones", label: "Direcciones", icon: MapPin },
  { id: "referidos", label: "Referidos", icon: Gift },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ value, onChange, size = 6 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "transition-transform hover:scale-110" : "cursor-default"}
          disabled={!onChange}
        >
          <Star className={`size-${size} ${(hover || value) >= i ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
        </button>
      ))}
    </div>
  );
}

// ─── Section: Pedidos ─────────────────────────────────────────────────────────

function CartProductCard({
  item, selected, onToggle, onRemove, qty, onQty,
}: {
  item: CartItem; selected: boolean; onToggle: () => void;
  onRemove: () => void; qty: number; onQty: (d: number) => void;
}) {
  const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
  const ivaAmount = Math.round(item.price * 19 / 119);
  const basePrice = item.price - ivaAmount;
  const total = item.price * qty;
  // Deterministic "stock left" from product id hash (50–149)
  const stockLeft = 149 - (parseInt(item.id.replace(/\D/g, "").slice(-2) || "0") % 50);
  const rating = item.rating ?? 4.8;
  const reviews = item.totalReviews ?? 2341;
  const sales = item.totalSales ?? 17430;

  const PERSUASIVE: Record<string, string> = {
    software: "La herramienta que los profesionales top usan para triplicar su productividad. Actualización de por vida incluida.",
    education: "El conocimiento que nadie te enseñó en la universidad. Más de 17K estudiantes ya transformaron su carrera.",
    resources: "100+ activos digitales premium listos para usar. Ahorra cientos de horas de diseño desde el primer día.",
    books: "La guía definitiva que condensó 10 años de experiencia en un solo recurso accionable. Descárgala en segundos.",
    services: "Servicio digital premium con resultados garantizados. Implementación inmediata, soporte incluido.",
  };
  const tagline = item.tagline || PERSUASIVE[item.category] || PERSUASIVE.resources;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${selected ? "border-primary/50 shadow-lg shadow-primary/5" : "border-border"} bg-surface`}>
      {/* Trust + urgency bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
          <Zap className="size-3.5" /> DESCARGA INMEDIATA
        </div>
        {discount >= 20 && (
          <div className="ml-auto flex items-center gap-1.5 text-[11px] font-black text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
            {discount}% DE DESCUENTO
          </div>
        )}
        <div className="text-[10px] text-orange-400 font-bold flex items-center gap-1">
          ⚠️ SOLO QUEDAN {stockLeft}
        </div>
      </div>

      <div className="p-5">
        <div className="flex gap-4">
          {/* Checkbox */}
          <input type="checkbox" checked={selected} onChange={onToggle} className="size-4 mt-1 rounded accent-primary shrink-0" />

          {/* Image */}
          <img
            src={item.image}
            alt={item.name}
            className="size-24 rounded-xl object-cover border border-border shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] text-primary font-bold">Vendido por {item.vendor}</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5"><CheckCircle2 className="size-3" /> Verificado</span>
            </div>
            <h3 className="font-bold text-base leading-tight mb-1">{item.name}</h3>
            <p className="text-xs text-muted-foreground italic mb-2 line-clamp-2">"{tagline}"</p>

            {/* Rating + sales */}
            <div className="flex items-center gap-2 flex-wrap">
              <StarRating value={rating} size={3} />
              <span className="text-xs font-bold">{rating}</span>
              <span className="text-[10px] text-muted-foreground">({reviews.toLocaleString("es-CO")} reseñas)</span>
              <span className="text-[10px] font-bold text-primary">{sales >= 1000 ? `${(sales / 1000).toFixed(0)}K+` : sales} ventas</span>
            </div>
          </div>

          {/* Delete */}
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 self-start">
            <Trash2 className="size-4" />
          </button>
        </div>

        {/* Pricing block */}
        <div className="mt-5 pt-4 border-t border-border grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              {item.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{fmtCOP(item.originalPrice * qty)}</span>
              )}
              <span className="text-2xl font-extrabold text-primary">{fmtCOP(total)}</span>
            </div>
            <div className="text-[10px] text-muted-foreground">IVA incluido: {fmtCOP(ivaAmount * qty)}</div>
            <div className="text-[10px] text-muted-foreground">Precio base: {fmtCOP(basePrice * qty)}</div>

            {/* Quantity */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-medium text-muted-foreground">Cant.</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => onQty(-1)} disabled={qty <= 1} className="px-2.5 py-1 hover:bg-white/5 disabled:opacity-40 transition-colors text-sm">
                  <Minus className="size-3.5" />
                </button>
                <span className="px-3 py-1 text-sm font-bold border-x border-border min-w-[2.5rem] text-center">{qty}</span>
                <button onClick={() => onQty(1)} className="px-2.5 py-1 hover:bg-white/5 transition-colors text-sm">
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-1.5">
            {[
              { icon: Lock, label: "Pagos seguros" },
              { icon: Shield, label: "Privacidad segura" },
              { icon: Package, label: "Garantía de pedidos" },
              { icon: Download, label: "Descarga instantánea" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <b.icon className="size-3 text-primary/60 shrink-0" /> {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PedidosSection() {
  const { cart, removeFromCart, orders, setPendingCheckoutItems } = useUserStore(); // eslint-disable-line
  const [tab, setTab] = useState<"carrito" | "historial">("carrito");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, delta: number) =>
    setQuantities(q => ({ ...q, [id]: Math.max(1, (q[id] ?? 1) + delta) }));

  const allSelected = selected.size === cart.length && cart.length > 0;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(cart.map(i => i.id)));
  const toggleItem = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectedItems = cart.filter(i => selected.has(i.id));
  const subtotal = selectedItems.reduce((a, i) => a + i.price * getQty(i.id), 0);

  const handlePagar = () => {
    if (selectedItems.length === 0) { toast.error("Selecciona al menos un producto"); return; }
    setPendingCheckoutItems(selectedItems);
    navigate({ to: "/checkout" });
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast.success("Producto eliminado del carrito");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Tus Pedidos</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-6 w-fit">
        {[["carrito", "Carrito", cart.length], ["historial", "Historial", orders.length]].map(([id, label, count]) => (
          <button
            key={id as string}
            onClick={() => setTab(id as "carrito" | "historial")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {label}
            {Number(count) > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === id ? "bg-white/20 text-white" : "bg-border text-muted-foreground"}`}>{count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "carrito" ? (
        cart.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <ShoppingCart className="size-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="font-semibold mb-2">Tu carrito está vacío</p>
            <p className="text-sm text-muted-foreground mb-6">Explora el marketplace y agrega productos</p>
            <Button asChild variant="contrast" size="sm"><a href="/marketplace">Ver marketplace</a></Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select all */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="size-4 rounded accent-primary" />
                <span className="text-sm font-medium">Seleccionar todo ({cart.length})</span>
              </label>
              {selected.size > 0 && <span className="text-xs text-muted-foreground">{selected.size} seleccionado{selected.size !== 1 ? "s" : ""}</span>}
            </div>

            {/* Rich product cards */}
            <div className="space-y-4">
              {cart.map(item => (
                <CartProductCard
                  key={item.id}
                  item={item}
                  selected={selected.has(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  onRemove={() => handleRemove(item.id)}
                  qty={getQty(item.id)}
                  onQty={d => setQty(item.id, d)}
                />
              ))}
            </div>

            {/* Sticky checkout bar */}
            {selected.size > 0 && (
              <div className="sticky bottom-4 bg-surface/95 backdrop-blur border border-border rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Total ({selected.size} producto{selected.size !== 1 ? "s" : ""})</div>
                    <div className="text-2xl font-extrabold text-primary">{fmtCOP(subtotal)}</div>
                    <div className="text-[10px] text-muted-foreground">IVA incluido · Descarga instantánea</div>
                  </div>
                  <Button variant="contrast" className="gap-2 font-bold" onClick={handlePagar}>
                    <CreditCard className="size-4" /> Pagar seleccionados
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl">
              <Package className="size-12 mx-auto mb-4 text-muted-foreground/40" />
              <p className="font-semibold mb-2">Aún no tienes pedidos</p>
              <p className="text-sm text-muted-foreground">Tus compras completadas aparecerán aquí</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">Pedido #{order.id.slice(-8).toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{new Date(order.paidAt).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${order.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : order.status === "pending" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                    {order.status === "completed" ? "✓ Completado" : order.status === "pending" ? "⏳ Pendiente" : "Reembolsado"}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="size-10 rounded-lg object-cover border border-border" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                        <div className="text-[10px] text-muted-foreground">{item.vendor}</div>
                      </div>
                      <div className="text-sm font-bold text-primary">{fmtCOP(item.price)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                  <span className="font-extrabold text-primary">{fmtCOP(order.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section: Reseñas ─────────────────────────────────────────────────────────

function ResenasSection() {
  const { orders, reviews, addReview, hasReviewed } = useUserStore();
  const [drafts, setDrafts] = useState<Record<string, { rating: number; comment: string }>>({});

  // Collect all purchased products from completed orders
  const purchasedProducts = orders
    .filter(o => o.status === "completed")
    .flatMap(o => o.items.map(item => ({ ...item, orderId: o.id })));

  const pendingReview = purchasedProducts.filter(p => !hasReviewed(p.id));
  const writtenReviews = reviews;

  const submitReview = (product: CartItem & { orderId: string }) => {
    const draft = drafts[product.id];
    if (!draft || draft.rating === 0) { toast.error("Selecciona una calificación"); return; }
    if (!draft.comment.trim()) { toast.error("Escribe un comentario"); return; }
    addReview({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      orderId: product.orderId,
      rating: draft.rating,
      comment: draft.comment.trim(),
    });
    setDrafts(d => { const n = { ...d }; delete n[product.id]; return n; });
    toast.success("¡Reseña publicada! Gracias por compartir tu experiencia ⭐");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Tus Reseñas</h2>
      <p className="text-sm text-muted-foreground mb-6">Solo puedes reseñar productos que hayas comprado.</p>

      {/* Pending reviews */}
      {pendingReview.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Pendientes de reseña</h3>
          <div className="space-y-4">
            {pendingReview.map(product => {
              const draft = drafts[product.id] || { rating: 0, comment: "" };
              return (
                <div key={product.id} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={product.image} alt={product.name} className="size-14 rounded-xl object-cover border border-border shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div>
                      <div className="text-[10px] text-primary font-bold mb-1">✓ Compra verificada</div>
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <div className="text-[10px] text-muted-foreground">{product.vendor}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs font-medium mb-2">Tu calificación</div>
                    <StarRating
                      value={draft.rating}
                      onChange={v => setDrafts(d => ({ ...d, [product.id]: { ...draft, rating: v } }))}
                      size={7}
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={draft.comment}
                    onChange={e => setDrafts(d => ({ ...d, [product.id]: { ...draft, comment: e.target.value } }))}
                    placeholder="Cuéntanos tu experiencia con este producto..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-muted-foreground">{draft.comment.length}/500 caracteres</span>
                    <Button size="sm" variant="contrast" className="gap-1.5" onClick={() => submitReview(product)}>
                      <Star className="size-3.5" /> Publicar reseña
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Published reviews */}
      {writtenReviews.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Mis reseñas</h3>
          <div className="space-y-4">
            {writtenReviews.map(review => (
              <div key={review.id} className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-start gap-4 mb-3">
                  <img src={review.productImage} alt={review.productName} className="size-12 rounded-xl object-cover border border-border shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{review.productName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={review.rating} size={4} />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-primary font-bold bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full">✓ Verificada</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingReview.length === 0 && writtenReviews.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Star className="size-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="font-semibold mb-2">Aún no tienes reseñas</p>
          <p className="text-sm text-muted-foreground">Compra productos para poder dejar tus reseñas</p>
        </div>
      )}
    </div>
  );
}

// ─── Section: Perfil ──────────────────────────────────────────────────────────

function PerfilSection({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState("+57 ");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSaveProfile = () => {
    toast.success("Perfil actualizado correctamente");
  };

  const handleChangePass = () => {
    if (!currentPass) { toast.error("Ingresa tu contraseña actual"); return; }
    if (newPass.length < 8) { toast.error("La nueva contraseña debe tener mínimo 8 caracteres"); return; }
    if (newPass !== confirmPass) { toast.error("Las contraseñas no coinciden"); return; }
    toast.success("Contraseña actualizada correctamente");
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
  };

  const handleRecovery = () => {
    toast.success(`📧 Enviamos un enlace de recuperación a ${user.email}`);
  };

  const handleDelete = () => {
    if (deleteConfirm !== "ELIMINAR") { toast.error("Escribe ELIMINAR para confirmar"); return; }
    logout();
    navigate({ to: "/marketplace" });
    toast.success("Cuenta eliminada. ¡Hasta pronto!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Tu Perfil</h2>

      {/* Avatar */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="size-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
            {user.initials}
          </div>
          <div>
            <div className="font-bold text-lg">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="text-xs text-muted-foreground mt-1">Miembro PULSE AI</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre completo</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Correo electrónico</label>
            <input
              value={user.email}
              disabled
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Teléfono</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <Button variant="contrast" size="sm" className="gap-1.5" onClick={handleSaveProfile}>
            <Check className="size-3.5" /> Guardar cambios
          </Button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Shield className="size-4 text-primary" /> Cambiar contraseña
        </h3>
        <div className="space-y-4">
          {[
            ["Contraseña actual", currentPass, setCurrentPass],
            ["Nueva contraseña", newPass, setNewPass],
            ["Confirmar nueva contraseña", confirmPass, setConfirmPass],
          ].map(([label, val, setter]) => (
            <div key={label as string}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label as string}</label>
              <input
                type="password"
                value={val as string}
                onChange={e => (setter as (v: string) => void)(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          ))}
          <div className="flex gap-3 flex-wrap">
            <Button size="sm" variant="contrast" className="gap-1.5" onClick={handleChangePass}>
              <Shield className="size-3.5" /> Actualizar contraseña
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 border-border" onClick={handleRecovery}>
              <RotateCcw className="size-3.5" /> Recuperar cuenta
            </Button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
        <h3 className="font-bold mb-2 flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-4" /> Zona de peligro
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Eliminar tu cuenta es permanente. Perderás todos tus productos, compras y datos.
        </p>
        {!showDelete ? (
          <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setShowDelete(true)}>
            <Trash2 className="size-3.5 mr-1.5" /> Eliminar mi cuenta
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">Escribe <span className="font-mono font-bold text-destructive">ELIMINAR</span> para confirmar:</p>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              className="w-full bg-background border border-destructive/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-destructive transition-colors font-mono"
              placeholder="ELIMINAR"
            />
            <div className="flex gap-2">
              <Button size="sm" className="bg-destructive text-white hover:bg-destructive/80 gap-1.5" onClick={handleDelete}>
                <Trash2 className="size-3.5" /> Confirmar eliminación
              </Button>
              <Button size="sm" variant="outline" className="border-border" onClick={() => { setShowDelete(false); setDeleteConfirm(""); }}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section: Cupones ─────────────────────────────────────────────────────────

function CuponesSection() {
  const { coupons, addCoupon } = useUserStore();
  const [code, setCode] = useState("");

  const handleAdd = () => {
    if (!code.trim()) return;
    const result = addCoupon(code);
    result.success ? toast.success(result.message) : toast.error(result.message);
    if (result.success) setCode("");
  };

  const available = coupons.filter(c => c.status === "available");
  const used = coupons.filter(c => c.status !== "available");

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Cupones y Ofertas</h2>
      <p className="text-sm text-muted-foreground mb-6">Ingresa un código de cupón o aplica tus descuentos disponibles al pagar.</p>

      {/* Input */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold mb-3">Agregar cupón</h3>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Ej: PULSE10"
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors uppercase"
          />
          <Button variant="contrast" className="gap-1.5 shrink-0" onClick={handleAdd}>
            <Plus className="size-4" /> Agregar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Prueba con: PULSE10, BIENVENIDO, COLOMBIA, PULSENEW</p>
      </div>

      {/* Available */}
      {available.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Disponibles</h3>
          <div className="space-y-3">
            {available.map(coupon => (
              <div key={coupon.code} className="bg-surface border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Tag className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold font-mono text-sm">{coupon.code}</div>
                  <div className="text-xs text-muted-foreground">{coupon.description}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Mínimo {fmtCOP(coupon.minOrder)} · Vence {coupon.expiresAt}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-primary text-lg">
                    {coupon.type === "percent" ? `${coupon.discount}%` : fmtCOP(coupon.discount)}
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(coupon.code); toast.success("Código copiado"); }}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 ml-auto"
                  >
                    <Copy className="size-3" /> Copiar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Used */}
      {used.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Utilizados / Expirados</h3>
          <div className="space-y-2">
            {used.map(coupon => (
              <div key={coupon.code} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3 opacity-50">
                <Tag className="size-4 text-muted-foreground" />
                <div className="flex-1">
                  <span className="font-mono text-sm line-through">{coupon.code}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground">{coupon.description}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{coupon.status === "used" ? "Utilizado" : "Expirado"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Crédito ─────────────────────────────────────────────────────────

function CreditoSection() {
  const { creditBalance, creditHistory } = useUserStore();

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Saldo de Crédito</h2>

      {/* Balance card */}
      <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-8 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative">
          <div className="text-sm text-muted-foreground mb-1">Tu saldo disponible</div>
          <div className="text-4xl font-extrabold text-primary mb-2">{fmtCOP(creditBalance)}</div>
          <div className="text-xs text-muted-foreground">Se aplica automáticamente al pagar</div>
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Wallet className="size-4 text-primary" /> Cómo ganar créditos
        </h3>
        <div className="space-y-2">
          {[
            ["Crédito de bienvenida", "$50.000", "Al registrarte"],
            ["Invitar amigos", "$20.000 c/u", "Por cada amigo que compre"],
            ["Reseñas verificadas", "$5.000 c/u", "Al dejar una reseña"],
            ["Compras frecuentes", "Hasta 5%", "En tu próxima compra"],
          ].map(([action, amount, desc]) => (
            <div key={action} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium">{action}</div>
                <div className="text-[11px] text-muted-foreground">{desc}</div>
              </div>
              <div className="text-sm font-bold text-primary">{amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      {creditHistory.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Historial de transacciones</h3>
          <div className="space-y-2">
            {creditHistory.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl">
                <div>
                  <div className="text-sm font-medium">{tx.reason}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className={`font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-destructive"}`}>
                  {tx.amount > 0 ? "+" : ""}{fmtCOP(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Tiendas ─────────────────────────────────────────────────────────

function TiendasSection() {
  const { followedStores, unfollowStore } = useUserStore();

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Tiendas que Sigues</h2>
      <p className="text-sm text-muted-foreground mb-6">Sigue a vendedores para ver sus nuevos productos primero.</p>

      {followedStores.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Heart className="size-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="font-semibold mb-2">Aún no sigues ninguna tienda</p>
          <p className="text-sm text-muted-foreground mb-6">Visita el marketplace y sigue tus vendedores favoritos</p>
          <Button asChild variant="contrast" size="sm">
            <a href="/marketplace">Descubrir tiendas</a>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {followedStores.map(store => (
            <div key={store.vendorId} className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                {store.vendorAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{store.vendorName}</div>
                <div className="text-[10px] text-muted-foreground">
                  Siguiendo desde {new Date(store.followedAt).toLocaleDateString("es-CO", { month: "short", year: "numeric" })}
                </div>
              </div>
              <button
                onClick={() => { unfollowStore(store.vendorId); toast.success("Dejaste de seguir la tienda"); }}
                className="text-xs text-destructive hover:text-red-400 border border-destructive/20 rounded-lg px-2 py-1 hover:bg-destructive/5 transition-colors"
              >
                Dejar de seguir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Historial ───────────────────────────────────────────────────────

function HistorialSection() {
  const { browseHistory, clearBrowseHistory } = useUserStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Historial de Navegación</h2>
          <p className="text-sm text-muted-foreground mt-1">Productos que visitaste recientemente</p>
        </div>
        {browseHistory.length > 0 && (
          <button
            onClick={() => { clearBrowseHistory(); toast.success("Historial eliminado"); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" /> Limpiar
          </button>
        )}
      </div>

      {browseHistory.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Eye className="size-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="font-semibold mb-2">Sin historial todavía</p>
          <p className="text-sm text-muted-foreground">Explora el marketplace para ver tu historial aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {browseHistory.map(item => (
            <a key={item.id} href="/marketplace" className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-black/40">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <div className="p-3">
                <div className="text-[10px] text-muted-foreground mb-0.5">{item.vendor}</div>
                <div className="text-xs font-semibold line-clamp-2">{item.name}</div>
                <div className="text-sm font-bold text-primary mt-1">{fmtCOP(item.price)}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Direcciones ─────────────────────────────────────────────────────

function DireccionesSection() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Casa", fullName: "", line1: "", line2: "", city: "", department: "", phone: "+57 ", isDefault: false });

  const handleSave = () => {
    if (!form.fullName || !form.line1 || !form.city || !form.department) { toast.error("Completa todos los campos requeridos"); return; }
    addAddress(form);
    setForm({ label: "Casa", fullName: "", line1: "", line2: "", city: "", department: "", phone: "+57 ", isDefault: false });
    setShowForm(false);
    toast.success("Dirección guardada");
  };

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Mis Direcciones</h2>
          <p className="text-sm text-muted-foreground mt-1">Para envíos de productos físicos</p>
        </div>
        <Button size="sm" variant="contrast" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4" /> {showForm ? "Cancelar" : "Agregar"}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-surface border border-primary/20 rounded-2xl p-5 mb-6">
          <h3 className="font-bold mb-4">Nueva dirección</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Etiqueta</label>
              <select value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputClass}>
                {["Casa", "Trabajo", "Otro"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre completo *</label>
              <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Juan Pérez" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dirección línea 1 *</label>
              <input value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} placeholder="Calle 123 # 45-67" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Línea 2 (opcional)</label>
              <input value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} placeholder="Apto 101, Torre B" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ciudad *</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Bogotá" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Departamento *</label>
              <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="Cundinamarca" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Teléfono</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+57 300 123 4567" className={inputClass} />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="size-4 rounded accent-primary" />
              <label htmlFor="isDefault" className="text-sm cursor-pointer">Establecer como predeterminada</label>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <Button variant="contrast" className="gap-1.5" onClick={handleSave}>
              <Check className="size-4" /> Guardar dirección
            </Button>
            <Button variant="outline" className="border-border" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <MapPin className="size-12 mx-auto mb-4 text-muted-foreground/40" />
          <p className="font-semibold mb-2">Sin direcciones guardadas</p>
          <p className="text-sm text-muted-foreground">Agrega una dirección para agilizar tus pedidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-surface border rounded-2xl p-5 ${addr.isDefault ? "border-primary/30" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-surface border border-border px-2.5 py-1 rounded-lg">{addr.label}</span>
                  {addr.isDefault && <span className="text-[10px] text-primary font-bold">● Predeterminada</span>}
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => { setDefaultAddress(addr.id); toast.success("Dirección predeterminada actualizada"); }} className="text-[11px] text-primary hover:underline">
                      Predeterminar
                    </button>
                  )}
                  <button onClick={() => { deleteAddress(addr.id); toast.success("Dirección eliminada"); }} className="text-destructive hover:text-red-400 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold">{addr.fullName}</div>
              <div className="text-sm text-muted-foreground">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</div>
              <div className="text-sm text-muted-foreground">{addr.city}, {addr.department}</div>
              {addr.phone && <div className="text-sm text-muted-foreground mt-1">{addr.phone}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Referidos ───────────────────────────────────────────────────────

function ReferidosSection() {
  const { referralCode, referredUsers, referralEarnings } = useUserStore();
  const referralLink = `https://pulseai.io/marketplace?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);
  const conversions = referredUsers.filter(r => r.hasConverted).length;

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("¡Enlace copiado!");
  };

  const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(`🚀 Descubre los mejores productos digitales en PULSE AI. Usa mi enlace y obtén $20.000 de descuento en tu primera compra: ${referralLink}`)}`, "_blank");
  const shareFB = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, "_blank", "width=600,height=400");

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Programa de Referidos</h2>
      <p className="text-sm text-muted-foreground mb-6">Invita amigos y gana <strong className="text-foreground">$25.000 COP</strong> por cada uno que compre. Ellos reciben $20.000 de descuento.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Referidos", value: referredUsers.length, icon: Users, color: "text-blue-400" },
          { label: "Conversiones", value: conversions, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Ganancias", value: fmtCOP(referralEarnings), icon: Wallet, color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-4 text-center">
            <s.icon className={`size-5 mx-auto mb-2 ${s.color}`} />
            <div className="text-xl font-extrabold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="text-sm font-bold mb-3 flex items-center gap-2">
          <Link2 className="size-4 text-primary" /> Tu enlace de referido
        </div>
        <div className="flex gap-2">
          <input
            value={referralLink}
            readOnly
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-mono text-muted-foreground focus:outline-none min-w-0"
          />
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${copied ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex gap-3 mt-4">
          <button onClick={shareWA} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#25D366]/20 bg-[#25D366]/5 text-[#25D366] text-sm font-bold hover:bg-[#25D366]/10 transition-colors">
            <Share2 className="size-4" /> WhatsApp
          </button>
          <button onClick={shareFB} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 text-[#1877F2] text-sm font-bold hover:bg-[#1877F2]/10 transition-colors">
            <Share2 className="size-4" /> Facebook
          </button>
          <button
            onClick={() => {
              const text = `Descubre miles de productos digitales premium en PULSE AI. 🚀 Usa mi código de referido ${referralCode} y obtén $20.000 de descuento. ${referralLink}`;
              window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-bold hover:border-primary/20 hover:text-foreground transition-colors"
          >
            <Share2 className="size-4" /> X / Twitter
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <h3 className="font-bold mb-4">¿Cómo funciona?</h3>
        <div className="space-y-3">
          {[
            { step: "1", title: "Comparte tu enlace", desc: "Envíalo por WhatsApp, Instagram, email o donde prefieras." },
            { step: "2", title: "Tu amigo se registra", desc: "Usando tu enlace, tu amigo obtiene $20.000 de descuento automáticamente." },
            { step: "3", title: "Ganas $25.000 COP", desc: "Cuando tu amigo realice su primera compra, recibes $25.000 en créditos." },
          ].map(s => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-extrabold text-primary shrink-0">{s.step}</div>
              <div>
                <div className="font-semibold text-sm">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Referred users list */}
      {referredUsers.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Tus referidos</h3>
          <div className="space-y-2">
            {referredUsers.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {r.id.slice(-2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">Usuario referido</div>
                    <div className="text-[10px] text-muted-foreground">{new Date(r.joinedAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <div className="text-right">
                  {r.hasConverted ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="size-3" /> +{fmtCOP(r.earned)}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin compra aún</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA to affiliate program */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <div className="font-bold mb-1">¿Quieres ganar comisiones más altas?</div>
          <div className="text-sm text-muted-foreground">Únete al Programa de Afiliados y gana hasta 40% por cada venta.</div>
        </div>
        <a href="/afiliados" className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
          Ver afiliados <ChevronRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function PerfilPage() {
  const { user, logout } = useAuth();
  const { cartCount, orders, creditBalance } = useUserStore();
  const { s: initialSection } = Route.useSearch();
  const [section, setSection] = useState<Section>(
    initialSection && NAV_ITEMS.some(i => i.id === initialSection)
      ? (initialSection as Section)
      : "pedidos"
  );
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="text-center max-w-sm">
            <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <User className="size-9 text-primary/60" />
            </div>
            <h2 className="text-xl font-bold mb-2">Inicia sesión para ver tu cuenta</h2>
            <p className="text-sm text-muted-foreground mb-6">Accede a tus pedidos, reseñas, créditos y más.</p>
            <Button variant="contrast" className="gap-2 w-full" onClick={() => setShowAuth(true)}>
              <User className="size-4" /> Iniciar sesión
            </Button>
          </div>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <BackToMarketplace label="Marketplace" />

      {/* Mobile tabs */}
      <div className="md:hidden border-b border-border bg-background/95 backdrop-blur sticky top-16 z-40 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                section === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <item.icon className="size-3.5" />
              {item.label}
              {item.id === "pedidos" && cartCount > 0 && (
                <span className={`text-[9px] px-1 py-0.5 rounded-full font-bold ${section === item.id ? "bg-white/20" : "bg-primary/20 text-primary"}`}>{cartCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col gap-4 w-72 shrink-0">
            {/* User card */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg shrink-0">
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Pedidos", value: activeOrders.length },
                  { label: "Créditos", value: fmtCOP(creditBalance) },
                  { label: "Carrito", value: cartCount },
                ].map(s => (
                  <div key={s.label} className="bg-background rounded-xl p-2 border border-border">
                    <div className="text-sm font-bold">{s.value}</div>
                    <div className="text-[9px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="p-2 space-y-0.5">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                      section === item.id
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.id === "pedidos" && cartCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${section === "pedidos" ? "bg-white/20 text-white" : "bg-primary/20 text-primary"}`}>
                          {cartCount}
                        </span>
                      )}
                      {section !== item.id && <ChevronRight className="size-3.5 opacity-40" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-border p-2 space-y-0.5">
                <button
                  onClick={() => { navigator.clipboard.writeText(user.email); toast.success("Email copiado — puedes usarlo para iniciar con otra cuenta"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                >
                  <Edit2 className="size-4" />
                  Cambiar cuenta
                </button>
                <button
                  onClick={() => { logout(); navigate({ to: "/marketplace" }); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {section === "pedidos" && <PedidosSection />}
            {section === "resenas" && <ResenasSection />}
            {section === "perfil" && <PerfilSection user={user} />}
            {section === "cupones" && <CuponesSection />}
            {section === "credito" && <CreditoSection />}
            {section === "tiendas" && <TiendasSection />}
            {section === "historial" && <HistorialSection />}
            {section === "direcciones" && <DireccionesSection />}
            {section === "referidos" && <ReferidosSection />}

            {/* Mobile logout */}
            <div className="md:hidden mt-10 pt-6 border-t border-border flex gap-3">
              <button
                onClick={() => { navigator.clipboard.writeText(user.email); toast.success("Puedes iniciar con otra cuenta"); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              >
                <Edit2 className="size-4" /> Cambiar cuenta
              </button>
              <button
                onClick={() => { logout(); navigate({ to: "/marketplace" }); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/20 text-sm text-destructive hover:bg-destructive/5 transition-all"
              >
                <LogOut className="size-4" /> Cerrar sesión
              </button>
            </div>
          </main>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
