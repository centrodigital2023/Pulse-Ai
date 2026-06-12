import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Camera, Globe, AtSign, Music, Play, Share2, MessageCircle } from "lucide-react";

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/573147444715", icon: MessageCircle, color: "#25D366" },
  { label: "Instagram", href: "https://www.instagram.com/profeia_oficial/", icon: Camera, color: "#E1306C" },
  { label: "Facebook", href: "https://www.facebook.com/feskawsay", icon: Share2, color: "#1877F2" },
  { label: "Twitter / X", href: "https://x.com/profeia2050", icon: AtSign, color: "#1DA1F2" },
  { label: "TikTok", href: "https://www.tiktok.com/@feskawsay", icon: Music, color: "#ffffff" },
  { label: "YouTube", href: "https://www.youtube.com/@CentroinformacionDigital", icon: Play, color: "#FF0000" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jos%C3%A9-fabian-carrera-su%C3%A1rez-508948406", icon: Globe, color: "#0A66C2" },
];

const paymentBadges = ["Mercado Pago", "PSE", "Nequi", "SSL 256-bit", "PCI DSS"];

export function SiteFooter() {
  return (
    <footer className="border-t border-border pt-12 pb-6 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="flex flex-col lg:flex-row gap-10 mb-10">

          {/* Brand column */}
          <div className="max-w-xs shrink-0">
            <Link to="/marketplace">
              <Logo className="mb-4 block" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              El marketplace de productos digitales premium de Latinoamérica. Compra con Mercado Pago y descarga al instante.
            </p>

            {/* Payment badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {paymentBadges.map(b => (
                <span
                  key={b}
                  className="px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-primary text-[10px] font-mono"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Social media */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:border-primary/30 transition-all hover:scale-110"
                  style={{ "--icon-color": color } as React.CSSProperties}
                  onMouseEnter={e => (e.currentTarget.style.color = color)}
                  onMouseLeave={e => (e.currentTarget.style.color = "")}
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">

            {/* Marketplace */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Marketplace</div>
              <Link to="/marketplace" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Explorar productos
              </Link>
              <Link to="/vender" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Vender en PULSE AI
              </Link>
              <Link to="/mis-compras" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Mis Compras
              </Link>
            </div>

            {/* Soporte */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Soporte</div>
              <a href="#ayuda" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Centro de Ayuda
              </a>
              <a href="#estado" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Estado del sistema
              </a>
              <a
                href="mailto:centrodigital2023@gmail.com"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contacto
              </a>
              <a
                href="https://wa.me/573147444715"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                WhatsApp
              </a>
              <a href="#comunidad" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Comunidad
              </a>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Legal</div>
              <a href="/terminos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Términos y Condiciones
              </a>
              <a href="/privacidad" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidad
              </a>
              <a href="/habeas-data" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Habeas Data
              </a>
              <a href="/cumplimiento" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Cumplimiento Legal
              </a>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-muted-foreground">
            © 2025 PULSE AI. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Empresa registrada en Colombia · NIT 901.234.567-8 · Regulada por la SIC
          </p>
          <div className="flex items-center gap-4">
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
