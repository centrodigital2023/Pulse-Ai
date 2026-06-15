import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Camera, Globe, AtSign, Music, Play, Share2, MessageCircle, Shield, Lock, CreditCard, Zap, Send } from "lucide-react";
import { toast } from "sonner";

const socialLinks = [
  { label: "WhatsApp", href: "https://wa.me/573147444715", icon: MessageCircle, color: "#25D366" },
  { label: "Instagram", href: "https://www.instagram.com/profeia_oficial/", icon: Camera, color: "#E1306C" },
  { label: "Facebook", href: "https://www.facebook.com/feskawsay", icon: Share2, color: "#1877F2" },
  { label: "Twitter / X", href: "https://x.com/profeia2050", icon: AtSign, color: "#1DA1F2" },
  { label: "TikTok", href: "https://www.tiktok.com/@feskawsay", icon: Music, color: "#ffffff" },
  { label: "YouTube", href: "https://www.youtube.com/@CentroinformacionDigital", icon: Play, color: "#FF0000" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jos%C3%A9-fabian-carrera-su%C3%A1rez-508948406", icon: Globe, color: "#0A66C2" },
];

const trustBadges = [
  { icon: Shield, label: "SSL 256-bit" },
  { icon: Lock, label: "PCI DSS" },
  { icon: CreditCard, label: "Mercado Pago" },
  { icon: CreditCard, label: "PSE · Nequi" },
  { icon: Zap, label: "Descarga instantánea" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Ingresa un email válido"); return; }
    setSubscribed(true);
    toast.success("¡Suscrito! Recibirás ofertas exclusivas y nuevos productos.");
    setEmail("");
  };

  return (
    <footer className="border-t border-border pt-16 pb-6 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Newsletter CTA */}
        <div className="mb-14 relative overflow-hidden rounded-2xl bg-surface border border-border px-8 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_100%,oklch(0.7_0.146_162.5/0.07),transparent)] pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:max-w-md">
              <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Newsletter exclusivo</div>
              <h3 className="text-2xl font-extrabold tracking-tight mb-2">Ofertas flash antes que nadie</h3>
              <p className="text-sm text-muted-foreground">
                Recibe alertas de descuentos hasta 70%, lanzamientos de nuevos creadores y estrategias para generar ingresos digitales. Sin spam.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold">
                <Zap className="size-5" /> ¡Bienvenido al círculo VIP!
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2 w-full lg:w-auto lg:min-w-[360px]">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shrink-0"
                >
                  <Send className="size-4" /> Suscribirme
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Top grid */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">

          {/* Brand column */}
          <div className="max-w-xs shrink-0">
            <Link to="/marketplace">
              <Logo className="mb-4 block" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              El marketplace de productos digitales premium de Latinoamérica. Compra con Mercado Pago y descarga al instante.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {trustBadges.map(b => (
                <span
                  key={b.label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-mono"
                >
                  <b.icon className="size-3" />
                  {b.label}
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
                  onMouseEnter={e => (e.currentTarget.style.color = color)}
                  onMouseLeave={e => (e.currentTarget.style.color = "")}
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Marketplace</div>
              <Link to="/marketplace" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Explorar productos
              </Link>
              <Link to="/vender" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Vender en PULSE AI
              </Link>
              <Link to="/afiliados" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Programa de Afiliados
              </Link>
              <Link to="/mis-compras" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Mis Compras
              </Link>
              <a href="/perfil?s=referidos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Referidos
              </a>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Creadores</div>
              <Link to="/vender" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Publicar producto
              </Link>
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard vendedor
              </Link>
              <Link to="/afiliados" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Ganar como afiliado
              </Link>
              <a href="/perfil?s=referidos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Invitar amigos
              </a>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Soporte</div>
              <a href="mailto:centrodigital2023@gmail.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contacto por email
              </a>
              <a href="https://wa.me/573147444715" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                WhatsApp directo
              </a>
              <a href="https://www.instagram.com/profeia_oficial/" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="https://www.youtube.com/@CentroinformacionDigital" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                YouTube
              </a>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest">Legal</div>
              <Link to="/terminos" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/privacidad" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/habeas-data" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Habeas Data
              </Link>
              <Link to="/cumplimiento" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Cumplimiento Legal
              </Link>
            </div>

          </div>
        </div>

        {/* Google / SEO links — machine readable, visible for trust */}
        <div className="mb-6 p-4 rounded-xl bg-surface/50 border border-border">
          <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-3">Mapa del sitio</div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {[
              { href: "/marketplace", label: "Marketplace de productos digitales" },
              { href: "/vender", label: "Vender productos digitales" },
              { href: "/afiliados", label: "Programa de afiliados" },
              { href: "/marketplace?cat=software", label: "Software y SaaS" },
              { href: "/marketplace?cat=cursos", label: "Cursos online" },
              { href: "/marketplace?cat=templates", label: "Templates y recursos" },
              { href: "/marketplace?cat=ebooks", label: "eBooks y guías" },
              { href: "/terminos", label: "Términos y condiciones" },
              { href: "/privacidad", label: "Privacidad" },
            ].map(l => (
              <a key={l.href} href={l.href} className="text-[11px] text-muted-foreground/60 hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PULSE AI. Todos los derechos reservados.
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
