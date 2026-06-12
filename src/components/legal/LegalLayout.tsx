import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { FileText, Download, ChevronRight, ArrowLeft } from "lucide-react";

interface Section {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  sections: Section[];
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, sections, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNav />

      {/* Hero header */}
      <div className="border-b border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Link to="/marketplace" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="size-3" />
            <span>Legal</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{title}</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                Última actualización: 12 de junio de 2025
              </span>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Download className="size-3.5" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex gap-10 items-start">

          {/* Sidebar TOC — sticky on desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <Link
                to="/marketplace"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-5"
              >
                <ArrowLeft className="size-3.5" />
                Volver al inicio
              </Link>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                Contenido
              </div>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all py-1 border-l-2 border-transparent hover:border-primary pl-3"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="flex-1 min-w-0 prose-legal">
            {children}
          </article>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
