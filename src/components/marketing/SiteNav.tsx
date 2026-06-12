import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useCanAccessDashboard } from "@/lib/db";
import { AuthModal } from "@/components/auth/AuthModal";
import { ShoppingBag, Library, LogOut, ChevronDown, User } from "lucide-react";

export function SiteNav() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/marketplace"><Logo /></Link>
            <div className="hidden md:flex gap-5 text-sm font-medium text-muted-foreground">
              <Link to="/marketplace" className="hover:text-foreground transition-colors [&.active]:text-foreground">
                Marketplace
              </Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors [&.active]:text-foreground">
                Dashboard
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/vender"
              className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:border-primary/30 transition-colors hidden sm:inline-flex items-center gap-1"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Vender
            </Link>

            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(o => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-border hover:border-primary/30 transition-colors bg-surface"
                >
                  <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {user.initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-semibold truncate">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to="/mis-compras"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors w-full"
                      >
                        <ShoppingBag className="size-4 text-muted-foreground" />
                        Mis Compras
                      </Link>
                      <Link
                        to="/library"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors w-full"
                      >
                        <Library className="size-4 text-muted-foreground" />
                        Mi Biblioteca
                      </Link>
                      <button
                        onClick={() => { logout(); setDropOpen(false); }}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors w-full text-left text-red-400 hover:text-red-300"
                      >
                        <LogOut className="size-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
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
