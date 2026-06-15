/**
 * Analytics & Tracking Hub — PULSE AI
 *
 * Cómo conectar cada plataforma:
 *
 * 1. GOOGLE TAG MANAGER (hub principal — recomendado)
 *    → tagmanager.google.com → Crear cuenta → copiar tu ID (GTM-XXXXXXX)
 *    → Reemplaza GTM_ID abajo
 *    → Desde GTM puedes gestionar GA4, Meta Pixel, TikTok, etc. sin tocar código
 *
 * 2. GOOGLE ANALYTICS 4
 *    → analytics.google.com → Crear propiedad → copiar Measurement ID (G-XXXXXXXXXX)
 *    → Reemplaza GA4_ID abajo (o configúralo desde GTM)
 *
 * 3. META PIXEL (Facebook / Instagram)
 *    → business.facebook.com/events-manager → Crear pixel → copiar ID numérico
 *    → Reemplaza META_PIXEL_ID abajo
 *
 * 4. TIKTOK PIXEL
 *    → ads.tiktok.com → Assets → Events → Web events → copiar Pixel ID
 *    → Reemplaza TIKTOK_PIXEL_ID abajo
 *
 * 5. MICROSOFT CLARITY (heatmaps gratis)
 *    → clarity.microsoft.com → Crear proyecto → copiar Project ID
 *    → Reemplaza CLARITY_ID abajo
 *
 * 6. GOOGLE SEARCH CONSOLE
 *    → search.google.com/search-console → Agregar propiedad → método HTML tag
 *    → Copia solo el valor del atributo content= y reemplaza GSC_VERIFICATION abajo
 */

// ────────────────────────────────────────────────────────────
//  ⚠️  REEMPLAZA ESTOS IDs CON LOS TUYOS
// ────────────────────────────────────────────────────────────
const GTM_ID = "GTM-XXXXXXX";           // Google Tag Manager
const GA4_ID = "G-XXXXXXXXXX";          // Google Analytics 4
const META_PIXEL_ID = "";               // Meta/Facebook Pixel (dejar vacío para desactivar)
const TIKTOK_PIXEL_ID = "";             // TikTok Pixel (dejar vacío para desactivar)
const CLARITY_ID = "";                  // Microsoft Clarity (dejar vacío para desactivar)
// ────────────────────────────────────────────────────────────

export function AnalyticsScripts() {
  return (
    <>
      {/* Google Tag Manager */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />

      {/* Google Analytics 4 (standalone — también se puede manejar desde GTM) */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4_ID}',{send_page_view:true,cookie_flags:'SameSite=None;Secure'});`,
        }}
      />

      {/* Microsoft Clarity */}
      {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}

      {/* Meta / Facebook Pixel */}
      {META_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
          }}
        />
      )}

      {/* TikTok Pixel */}
      {TIKTOK_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${TIKTOK_PIXEL_ID}');ttq.page();}(window,document,'ttq');`,
          }}
        />
      )}
    </>
  );
}

export function AnalyticsNoScript() {
  return (
    <>
      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="GTM"
        />
      </noscript>

      {/* Meta Pixel noscript fallback */}
      {META_PIXEL_ID && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}
    </>
  );
}

/** Función helper para disparar eventos de conversión en cualquier componente */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // GA4
  if ("gtag" in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", eventName, params);
  }
  // Meta Pixel
  if ("fbq" in window) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq("track", eventName, params);
  }
  // GTM dataLayer
  if ("dataLayer" in window) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({ event: eventName, ...params });
  }
}
