import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Users, KeyRound, Webhook, Mail,
  Library, BarChart3, TrendingUp, Zap, BookOpen, Store, Bot,
  Settings, ChevronRight, Bell, Search,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

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

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === url || pathname === "/dashboard/" : pathname.startsWith(url);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-sidebar sticky top-0 h-screen overflow-y-auto">
        <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
          <Logo />
        </div>
        <nav className="flex-1 p-2 space-y-4 py-3">
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
                      className={`flex items-center gap-2.5 h-8 px-3 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary/10 border border-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <item.icon className="size-3.5 shrink-0" />
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
            className="flex items-center gap-2.5 h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <Library className="size-3.5" />
            Biblioteca Buyer
          </Link>
          <Link
            to="/marketplace"
            className="flex items-center gap-2.5 h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <Store className="size-3.5" />
            Ver Marketplace
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-border flex items-center justify-between px-6 gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <div className="min-w-0">
            {breadcrumb && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="size-8 p-0 hidden md:flex">
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <Bell className="size-4" />
            </Button>
            <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono select-none cursor-pointer">
              JD
            </div>
            {actions && <div className="flex items-center gap-2 pl-2 border-l border-border">{actions}</div>}
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
