/**
 * Command Palette — ⌘K / Ctrl+K
 * Inspired by Linear, Vercel, Raycast, Figma.
 * Built with the `cmdk` library (already installed).
 */
import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import {
  Search, ShoppingBag, LayoutDashboard, Users, TrendingUp,
  Package, BookOpen, Star, Settings, Shield, CreditCard,
  Zap, ArrowRight, Globe, Home, BarChart3, Link2,
  Gift, Bell, User, LogOut, Flame,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAllListings } from "@/lib/products-store";
import { useUserStore } from "@/lib/user-store";
import { toast } from "sonner";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  group: string;
  keywords?: string;
  action: () => void;
  badge?: string;
  badgeColor?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const allListings = useAllListings();
  const { cartCount } = useUserStore();

  const go = useCallback((to: string) => { setOpen(false); navigate({ to: to as "/" }); }, [navigate, setOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navItems: CommandItem[] = [
    { id: "marketplace", label: "Ir al Marketplace", description: "Explora +148 productos digitales", icon: ShoppingBag, group: "Navegar", action: () => go("/marketplace"), badge: "Popular", badgeColor: "bg-primary/20 text-primary" },
    { id: "vender", label: "Publicar un producto", description: "Empieza a vender hoy", icon: Package, group: "Navegar", action: () => go("/vender"), badge: "Gratis", badgeColor: "bg-emerald-500/20 text-emerald-400" },
    { id: "afiliados", label: "Programa de Afiliados", description: "Gana hasta 40% de comisión", icon: TrendingUp, group: "Navegar", action: () => go("/afiliados") },
    ...(user ? [
      { id: "dashboard", label: "Mi Dashboard", description: "Panel de vendedor", icon: LayoutDashboard, group: "Navegar", action: () => go("/dashboard") },
      { id: "library", label: "Mi Biblioteca", description: "Tus productos comprados", icon: BookOpen, group: "Navegar", action: () => go("/library") },
      { id: "orders", label: "Mis Compras", description: `${cartCount} productos en carrito`, icon: ShoppingBag, group: "Navegar", action: () => go("/mis-compras") },
    ] : []),
  ];

  const quickActions: CommandItem[] = [
    { id: "checkout", label: "Ir al carrito", description: "Finalizar tu compra", icon: CreditCard, group: "Acciones rápidas", action: () => go("/checkout") },
    { id: "referidos", label: "Invitar amigos", description: "Gana $25.000 por cada referido", icon: Gift, group: "Acciones rápidas", action: () => { setOpen(false); window.location.href = "/perfil?s=referidos"; } },
    { id: "notifications", label: "Notificaciones", icon: Bell, group: "Acciones rápidas", action: () => { setOpen(false); window.location.href = "/perfil?s=notificaciones"; } },
    { id: "profile", label: "Mi Perfil", icon: User, group: "Acciones rápidas", action: () => { setOpen(false); window.location.href = "/perfil"; } },
    { id: "logros", label: "Mis Logros y Puntos", icon: Star, group: "Acciones rápidas", action: () => { setOpen(false); window.location.href = "/perfil?s=logros"; } },
    { id: "whatsapp", label: "Contactar soporte (WhatsApp)", icon: Globe, group: "Acciones rápidas", action: () => { setOpen(false); window.open("https://wa.me/573147444715", "_blank"); } },
  ];

  const productItems: CommandItem[] = allListings.slice(0, 8).map(l => ({
    id: `product-${l.id}`,
    label: l.name,
    description: `${l.vendor} · $${l.price}`,
    icon: Flame,
    group: "Productos",
    keywords: l.tags.join(" "),
    action: () => { setOpen(false); navigate({ to: "/marketplace" }); toast.success(`Buscando: ${l.name}`); },
    badge: l.badge === "bestseller" ? "🔥 Top" : l.badge === "new" ? "Nuevo" : undefined,
    badgeColor: "bg-yellow-500/20 text-yellow-400",
  }));

  const allItems = [...navItems, ...quickActions, ...productItems];

  const matchesSearch = (item: CommandItem) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return item.label.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false) ||
      (item.keywords?.toLowerCase().includes(q) ?? false);
  };

  const grouped = Array.from(new Set(allItems.map(i => i.group))).map(group => ({
    group,
    items: allItems.filter(i => i.group === group && matchesSearch(i)),
  })).filter(g => g.items.length > 0);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all group"
        aria-label="Abrir búsqueda (⌘K)"
      >
        <Search className="size-3.5" />
        <span>Buscar...</span>
        <kbd className="ml-4 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/30 text-[9px] font-mono text-muted-foreground border border-border group-hover:border-primary/20">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
        style={{ animationDuration: "150ms" }}
        onClick={e => e.stopPropagation()}
      >
        <Command shouldFilter={false}>
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <Command.Input
              autoFocus
              value={search}
              onValueChange={setSearch}
              placeholder="Busca páginas, productos o acciones..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded border border-border transition-colors">
                Esc
              </button>
            )}
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="text-center py-8 text-sm text-muted-foreground">
              No hay resultados para "<span className="text-foreground font-medium">{search}</span>"
            </Command.Empty>

            {grouped.map(({ group, items }) => (
              <Command.Group key={group} heading={group} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  {group}
                </div>
                {items.map(item => (
                  <Command.Item
                    key={item.id}
                    value={item.id}
                    onSelect={item.action}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors group/item"
                  >
                    <div className="size-7 rounded-lg bg-black/20 border border-border flex items-center justify-center shrink-0 group-data-[selected=true]/item:bg-primary/10 group-data-[selected=true]/item:border-primary/20 transition-colors">
                      <item.icon className="size-3.5 text-muted-foreground group-data-[selected=true]/item:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.label}</div>
                      {item.description && (
                        <div className="text-[11px] text-muted-foreground truncate">{item.description}</div>
                      )}
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity" />
                  </Command.Item>
                ))}
              </Command.Group>
            ))}

            {/* Auth action at bottom */}
            {user && (
              <Command.Group>
                <Command.Item
                  value="logout"
                  onSelect={() => { logout(); setOpen(false); navigate({ to: "/marketplace" }); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-destructive/5 text-red-400 transition-colors mt-1 border-t border-border"
                >
                  <LogOut className="size-3.5" />
                  <span className="text-sm">Cerrar sesión</span>
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>

          {/* Footer hint */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60">
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 bg-black/20">↑↓</kbd> Navegar</span>
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 bg-black/20">↵</kbd> Abrir</span>
            <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 bg-black/20">Esc</kbd> Cerrar</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
