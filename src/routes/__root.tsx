import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { ProductsProvider } from "@/lib/products-store";
import { UserStoreProvider } from "@/lib/user-store";
import { AnalyticsScripts, AnalyticsNoScript } from "@/components/Analytics";
import { CommandPalette } from "@/components/CommandPalette";

const SITE_URL = "https://pulseai.co"; // ← cambia a tu dominio de producción

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página no pudo cargarse
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo salió mal. Puedes intentar recargar la página o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Intentar de nuevo
          </button>
          <a
            href="/marketplace"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

const OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/914f6db4-a3eb-4328-b141-b4c0f1521b42/id-preview-c7d9f255--2fd073aa-4c0d-439f-b73c-752a236a6b6f.lovable.app-1781216789119.png";

const jsonLdOrganization = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PULSE AI",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "description": "El marketplace de productos digitales premium de Latinoamérica. Software, cursos, templates y eBooks con Mercado Pago.",
  "foundingDate": "2025",
  "areaServed": ["CO", "MX", "AR", "PE", "CL", "EC", "VE", "BO", "PY", "UY"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "availableLanguage": "Spanish",
    "email": "centrodigital2023@gmail.com",
  },
  "sameAs": [
    "https://www.instagram.com/profeia_oficial/",
    "https://www.facebook.com/feskawsay",
    "https://x.com/profeia2050",
    "https://www.tiktok.com/@feskawsay",
    "https://www.youtube.com/@CentroinformacionDigital",
    "https://www.linkedin.com/in/jos%C3%A9-fabian-carrera-su%C3%A1rez-508948406",
  ],
});

const jsonLdWebSite = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PULSE AI",
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/marketplace?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PULSE AI — Marketplace de Productos Digitales Premium | Colombia" },
      {
        name: "description",
        content: "PULSE AI — El marketplace de productos digitales premium de Latinoamérica. Compra software, cursos, templates y eBooks con Mercado Pago. Descarga instantánea. ✓ Garantía 30 días ✓ SSL seguro ✓ Soporte en español.",
      },
      { name: "keywords", content: "marketplace digital colombia, productos digitales, software latam, cursos online colombia, templates digitales, ebooks colombia, mercado pago digital, afiliados digitales" },
      { name: "author", content: "PULSE AI" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "theme-color", content: "#000000" },
      { name: "google-site-verification", content: "REEMPLAZA_CON_TU_CODIGO_DE_GOOGLE_SEARCH_CONSOLE" },
      // Open Graph
      { property: "og:site_name", content: "PULSE AI" },
      { property: "og:title", content: "PULSE AI — El Marketplace de Productos Digitales Premium de Latinoamérica" },
      { property: "og:description", content: "Software, cursos, templates y eBooks con descarga instantánea. Paga con Mercado Pago, PSE o Nequi. Únete a miles de creadores y compradores de toda Latinoamérica." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PULSE AI — Marketplace de Productos Digitales" },
      { property: "og:locale", content: "es_CO" },
      { property: "og:locale:alternate", content: "es_419" },
      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@profeia2050" },
      { name: "twitter:creator", content: "@profeia2050" },
      { name: "twitter:title", content: "PULSE AI — Marketplace de Productos Digitales Premium" },
      { name: "twitter:description", content: "Software, cursos, templates y eBooks con descarga instantánea. Paga con Mercado Pago." },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "PULSE AI Marketplace" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "dns-prefetch", href: "https://connect.facebook.net" },
      { rel: "dns-prefetch", href: "https://analytics.tiktok.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <HeadContent />
        {/* JSON-LD Structured Data — SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdOrganization }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdWebSite }}
        />
        {/* Analytics & Tracking */}
        <AnalyticsScripts />
      </head>
      <body className="font-sans">
        <AnalyticsNoScript />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductsProvider>
          <UserStoreProvider>
            <CommandPalette />
            <Outlet />
            <WhatsAppFloat />
            <Toaster />
          </UserStoreProvider>
        </ProductsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
