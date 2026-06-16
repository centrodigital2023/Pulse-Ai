import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Users, KeyRound, Webhook, Mail,
  Library, BarChart3, TrendingUp, Zap, BookOpen, Store, Bot,
  Settings, ChevronRight, Bell, Search, Lock, Menu, LogOut, User as UserIcon, Shield,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useCanAccessDashboard } from "@/lib/db";

const navGroups = [
  {
    label: "Principal",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Comercio",
    items: [
      { title: "Productos", url: "/dashboard/products", icon: Package },
      { title: "Cursos", url: "/dashboard/courses", icon: BookOpen },
      { title: "Marketplace", url: "/dashboard/marketplace", icon: Store },
      { title: "Checkout", url: "/dashboard/checkout", icon: KeyRound },
    ],
  },
  {
    label: "Clientes",
    items: [
      { title: "CRM", url: "/dashboard/customers", icon: Users },
      { title: "Licencias", url: "/dashboard/licenses", icon: KeyRound },
      { title: "Afiliados", url: "/dashboard/affiliates", icon: TrendingUp },
    ],
  },
  {
    label: "Automatización",
    items: [
      { title: "Flujos Email", url: "/dashboard/email", icon: Mail },
      { title: "Automatización", url: "/dashboard/automation", icon: Zap },
      { title: "Webhooks", url: "/dashboard/webhooks", icon: Webhook },
    ],
  },
  {
    label: "IA & Config",
    items: [
      { title: "AI Assistant", url: "/dashboard/ai", icon: Bot },
      { title: "Ajustes", url: "/dashboard/settings", icon: Settings },
    ],
  },
] as const;

function NavContent({
  isActive,
  onNavigate,
}: {
  isActive: (url: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="flex-1 p-2 space-y-4 py-3 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.url);
                return (
                  <Link
                    key={item.url}
                    to={item.url as any}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 h-9 px-3 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 border border-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-2 border-t border-border space-y-0.5 shrink-0">
        <Link
          to="/library"
          onClick={onNavigate}
          className="flex items-center gap-2.5 h-9 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Library className="size-4" />
          Biblioteca Buyer
        </Link>
        <Link
          to="/marketplace"
          onClick={onNavigate}
          className="flex items-center gap-2.5 h-9 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Store className="size-4" />
          Ver Marketplace
        </Link>
      </div>
    </>
  );
}

export function DashboardLayout({
  title,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  breadcrumb?: string[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout } = useAuth();
  const { canAccess, isLoading: roleLoading } = useCanAccessDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  const checking = authLoading || roleLoading;

  useEffect(() => {
    if (!checking && !canAccess) {
      navigate({ to: "/marketplace" });
    }
  }, [checking, canAccess, navigate]);

  if (checking || !canAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
        <Lock className="size-8 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          {checking
            ? "Verificando acceso…"
            : !user
              ? "Necesitas iniciar sesión como vendedor para acceder al panel."
              : "Esta sección es solo para vendedores y administradores."}
        </div>
        <Button variant="contrast" size="sm" onClick={() => navigate({ to: "/marketplace" })}>
          Volver al Marketplace
        </Button>
      </div>
    );
  }

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === url || pathname === "/dashboard/" : pathname.startsWith(url);

  const initials = (user?.name || user?.email || "JD")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/marketplace" });
  };

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-sidebar sticky top-0 h-screen overflow-y-auto">
        <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
          <Logo />
        </div>
        <NavContent isActive={isActive} />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4 md:px-6 gap-3 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2 min-w-0">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="size-9 p-0 md:hidden shrink-0">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col bg-sidebar">
                <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
                  <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                  <Logo />
                </div>
                <NavContent isActive={isActive} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              {breadcrumb && (
                <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                  {breadcrumb.map((b, i) => (
                    <span key={b} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="size-3" />}
                      <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>{b}</span>
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-base font-bold tracking-tight truncate">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="size-8 p-0 hidden md:flex">
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <Bell className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono select-none cursor-pointer shrink-0">
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">
                  {user?.name || user?.email || "Mi cuenta"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/perfil" })}>
                  <UserIcon className="size-4 mr-2" /> Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/marketplace" })}>
                  <Store className="size-4 mr-2" /> Ir al Marketplace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/library" })}>
                  <Library className="size-4 mr-2" /> Mi biblioteca
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="size-4 mr-2" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {actions && <div className="flex items-center gap-2 pl-2 border-l border-border">{actions}</div>}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
