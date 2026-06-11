import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Users,
  KeyRound,
  Webhook,
  Mail,
  Library,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const nav = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "License Keys", url: "/dashboard/licenses", icon: KeyRound },
  { title: "Webhooks", url: "/dashboard/webhooks", icon: Webhook },
  { title: "Email Flows", url: "/dashboard/email", icon: Mail },
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
    url === "/dashboard" ? pathname === url : pathname.startsWith(url);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 h-9 px-3 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            to="/library"
            className="flex items-center gap-3 h-9 px-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <Library className="size-4" />
            Buyer view
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-border flex items-center justify-between px-6 gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <div className="min-w-0">
            {breadcrumb && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                {breadcrumb.map((b, i) => (
                  <span key={b} className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>
                    {b}
                    {i < breadcrumb.length - 1 && <span className="mx-1.5">/</span>}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-lg font-bold tracking-tight truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-3">{actions}</div>
        </header>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
