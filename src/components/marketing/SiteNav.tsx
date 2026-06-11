import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#buyer" className="hover:text-foreground transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/library">My library</Link>
          </Button>
          <Button asChild size="sm" variant="contrast">
            <Link to="/dashboard">Get started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
