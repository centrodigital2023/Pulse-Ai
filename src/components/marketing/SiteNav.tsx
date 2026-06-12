import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Plataforma", href: "#platform" },
  { label: "Productos", href: "#products" },
  { label: "IA", href: "#ai" },
  { label: "Precios", href: "#pricing" },
  { label: "Marketplace", href: "/marketplace" },
];

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            {navLinks.map((l) =>
              l.href.startsWith("/") ? (
                <Link key={l.label} to={l.href as any} className="hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} className="hover:text-foreground transition-colors">
                  {l.label}
                </a>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/library">Mi Biblioteca</Link>
          </Button>
          <Link
            to="/vender"
            className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:border-primary/30 transition-colors hidden sm:inline-flex items-center gap-1"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Vender
          </Link>
          <Button asChild size="sm" variant="contrast">
            <Link to="/dashboard">Empezar Gratis</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
