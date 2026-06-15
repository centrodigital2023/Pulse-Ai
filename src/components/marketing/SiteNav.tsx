import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCanAccessDashboard } from "@/lib/db";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/user-store";
import {
  ShoppingBag, Library, LogOut, ChevronDown, User, ShoppingCart,
  Star, Tag, Wallet, Store, Clock, Package, MapPin, Gift, TrendingUp,
  ArrowLeft, Search,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  to: string;
  section?: string;
  badge?: number;
}

export function SiteNav() {
  const { user, logout } = useAuth();
  const { canAccess: canAccessDashboard } = useCanAccessDashboard();
  const { cartCount } = useUserStore();
  const [showAuth, setShowAuth] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems: MenuItem[] = [
    { label: "Tus pedidos", icon: ShoppingBag, to: "/perfil", section: "pedidos", badge: cartCount || undefined },
    { label: "Tus reseñas", icon: Star, to: "/perfil", section: "resenas" },
    { label: "Tu perfil", icon: User, to: "/perfil", section: "perfil" },
    { label: "Cupones y ofertas", icon: Tag, to: "/perfil", section: "cupones" },
    { label: "Saldo de crédito", icon: Wallet, to: "/perfil", section: "credito" },
    { label: "Tiendas que sigues", icon: Store, to: "/perfil", section: "tiendas" },
    { label: "Historial", icon: Clock, to: "/perfil", section: "historial" },
    { label: "Direcciones", icon: MapPin, to: "/perfil", section: "direcciones" },
    { label: "Referidos", icon: Gift, to: "/perfil", section: "referidos" },
    { label: "Mis Compras", icon: Package, to: "/mis-compras" },
    { label: "Mi Biblioteca", icon: Library, to: "/library" },
    { label: "Programa de Afiliados", icon: TrendingUp, to: "/afiliados" },
  ];

  const handleNavItem = (item: MenuItem) => {
    if (item.section) {
      // Navigate to /perfil with ?s=SECTION query param
      window.location.href = `/perfil?s=${item.section}`;
    } else {
      navigate({ to: item.to as "/mis-compras" | "/library" | "/afiliados" });
    }
    setDropOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: Logo + links */}
          <div className="flex items-center gap-6">
            <Link to="/marketplace"><Logo /></Link>
            <div className="hidden md:flex gap-5 text-sm font-medium text-muted-foreground">
              <Link
                to="/marketplace"
                className="hover:text-foreground transition-colors [&.active]:text-foreground"
              >
                Marketplace
              </Link>
              <Link
                to="/afiliados"
                className="hover:text-foreground transition-colors [&.active]:text-foreground"
              >
                Afiliados
              </Link>
              {canAccessDashboard && (
                <Link
                  to="/dashboard"
                  className="hover:text-foreground transition-colors [&.active]:text-foreground"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* ⌘K trigger hint */}
            <button
              onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true, bubbles: true }); document.dispatchEvent(e); }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface/60 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
              aria-label="Buscar (⌘K)"
            >
              <Search className="size-3.5" />
              <span className="hidden lg:block">Buscar</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/30 text-[9px] font-mono border border-border">⌘K</kbd>
            </button>
            <Link
              to="/vender"
              className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:border-primary/30 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Vender
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Cart icon */}
                <button
                  onClick={() => { window.location.href = "/perfil?s=pedidos"; }}
                  className="relative size-9 rounded-xl border border-border hover:border-primary/30 bg-surface flex items-center justify-center transition-colors"
                  title={`Carrito (${cartCount})`}
                >
                  <ShoppingCart className="size-4 text-muted-foreground" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center leading-none">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(o => !o)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-border hover:border-primary/30 transition-colors bg-surface"
                  >
                    <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {user.initials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-[90px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`size-3.5 text-muted-foreground transition-transform ${dropOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {user.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{user.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5 space-y-0.5 max-h-80 overflow-y-auto">
                        {menuItems.map(item => (
                          <button
                            key={item.label}
                            onClick={() => handleNavItem(item)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl hover:bg-white/5 transition-colors w-full text-left"
                          >
                            <item.icon className="size-4 text-muted-foreground shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge != null && item.badge > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-border p-1.5">
                        <button
                          onClick={() => {
                            logout();
                            setDropOpen(false);
                            navigate({ to: "/marketplace" });
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl hover:bg-red-500/5 transition-colors w-full text-left text-red-400 hover:text-red-300"
                        >
                          <LogOut className="size-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                >
                  Iniciar sesión
                </button>
                <Button size="sm" variant="contrast" onClick={() => setShowAuth(true)}>
                  <User className="size-3.5" />
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

// Compact back-to-marketplace bar — reusable in sub-pages
export function BackToMarketplace({ label = "Volver al Marketplace" }: { label?: string }) {
  return (
    <div className="border-b border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center">
        <Link
          to="/marketplace"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {label}
        </Link>
      </div>
    </div>
  );
}
