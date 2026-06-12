import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/api/mp-checkout")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

          if (!accessToken) {
            // Demo mode — no real token configured
            return Response.json({ demo: true, initPoint: null });
          }

          // Dynamic import so the module is only loaded server-side
          const { MercadoPagoConfig, Preference } = await import("mercadopago");
          const client = new MercadoPagoConfig({ accessToken });
          const preferenceClient = new Preference(client);

          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pulseai.co";

          const response = await preferenceClient.create({
            body: {
              items: [
                {
                  id: "pulse-ai-product",
                  title: "PULSE AI — Producto Digital",
                  quantity: 1,
                  unit_price: 299000,
                  currency_id: "COP",
                },
              ],
              back_urls: {
                success: `${siteUrl}/pago-exitoso`,
                failure: `${siteUrl}/pago-fallido`,
                pending: `${siteUrl}/pago-exitoso?status=pending`,
              },
              auto_return: "approved",
              payment_methods: {
                installments: 12,
              },
              notification_url: `${siteUrl}/api/mp-webhook`,
            },
          });

          return Response.json({ initPoint: response.init_point, demo: false });
        } catch (error) {
          console.error("[MP Checkout]", error);
          return Response.json({ error: "Error al crear preferencia" }, { status: 500 });
        }
      },
    },
  },
});
