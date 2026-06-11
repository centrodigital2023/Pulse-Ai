import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Producto",
    links: [
      { label: "Características", href: "#platform" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Licencias", href: "#platform" },
      { label: "Automatización", href: "#platform" },
      { label: "API", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Centro de Ayuda", href: "#" },
      { label: "Base de Conocimiento", href: "#" },
      { label: "Tutoriales", href: "#" },
      { label: "Estado del Sistema", href: "#" },
      { label: "Comunidad", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "#" },
      { label: "Inversionistas", href: "#" },
      { label: "Contacto", href: "#" },
      { label: "Prensa", href: "#" },
    ],
  },
  {
    title: "Desarrolladores",
    links: [
      { label: "API Docs", href: "#" },
      { label: "SDKs", href: "#" },
      { label: "Integraciones", href: "#" },
      { label: "Webhooks", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Seguridad", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <Logo className="mb-4 block" />
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              El sistema operativo de la economía digital. Vende, distribuye, protege y escala productos digitales desde una sola plataforma enterprise impulsada por IA.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono">GDPR</span>
              <span className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono">PCI DSS</span>
              <span className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono">SOC 2</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest">{col.title}</div>
                {col.links.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link key={link.label} to={link.href as any} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a key={link.label} href={link.href} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2024 PULSE AI. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Construido para la economía digital global</span>
            <Link to="/admin" className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-[10px]">
              Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
