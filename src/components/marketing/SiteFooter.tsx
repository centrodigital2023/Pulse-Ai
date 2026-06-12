import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

const links = {
  Marketplace: [
    { label: "Explorar productos", href: "/marketplace" },
    { label: "Cursos", href: "/marketplace" },
    { label: "Software & SDKs", href: "/marketplace" },
    { label: "Templates & UI", href: "/marketplace" },
    { label: "eBooks", href: "/marketplace" },
  ],
  Vendedores: [
    { label: "Registrarme como vendedor", href: "/vender" },
    { label: "Cómo funciona", href: "/vender" },
    { label: "Comisiones y pagos", href: "#" },
    { label: "Verificación de cuenta", href: "/vender" },
  ],
  Legal: [
    { label: "Términos de servicio", href: "#" },
    { label: "Política de privacidad", href: "#" },
    { label: "Política de cookies", href: "#" },
    { label: "Garantía y devoluciones", href: "#" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border pt-12 pb-6 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="flex flex-col lg:flex-row gap-10 mb-10">
          {/* Brand */}
          <div className="max-w-xs shrink-0">
            <Link to="/marketplace">
              <Logo className="mb-4 block" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              El marketplace de productos digitales premium de Latinoamérica. Compra con Mercado Pago y descarga al instante.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Mercado Pago", "PSE", "Nequi", "SSL 256-bit"].map(b => (
                <span key={b} className="px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary text-[10px] font-mono">{b}</span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest">{title}</div>
                {items.map(link => (
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.label}
                      to={link.href as any}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 PULSE AI. Todos los derechos reservados. Hecho con ❤️ para la economía digital latinoamericana.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-muted-foreground/40">v2.0</span>
            {/* SuperAdmin — small, unobtrusive, only for admin access */}
            <Link
              to="/admin"
              className="text-[9px] font-mono text-muted-foreground/25 hover:text-muted-foreground/60 transition-colors"
            >
              superadmin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
