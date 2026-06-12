import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";

const BodySchema = z.object({
  userId: z.string().optional(),
  planId: z.string().optional(),
  price: z.number().positive().max(100_000_000),
  planName: z.string().min(1).max(200),
  userEmail: z.string().email().optional(),
  paymentMethod: z.string().optional(),
  installments: z.number().int().min(1).max(36).optional(),
  bumps: z.array(z.string()).optional(),
});

export const Route = createFileRoute("/api/mp-checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

          const raw = await request.json().catch(() => ({}));
          const parsed = BodySchema.safeParse(raw);
          if (!parsed.success) {
            return Response.json({ error: "Datos de orden inválidos" }, { status: 400 });
          }
          const order = parsed.data;

          if (!accessToken) {
            // Demo mode — no real token configured yet
            return Response.json({ demo: true, initPoint: null });
          }

          // Build a stable site URL from the incoming request origin
          const origin =
            request.headers.get("origin") ||
            new URL(request.url).origin ||
            process.env.MERCADOPAGO_SITE_URL ||
            "https://package-pal-55.lovable.app";

          // Dynamic import so the module is only loaded server-side
          const { MercadoPagoConfig, Preference } = await import("mercadopago");
          const client = new MercadoPagoConfig({ accessToken });
          const preferenceClient = new Preference(client);

          const response = await preferenceClient.create({
            body: {
              items: [
                {
                  id: order.planId ?? "punse-ai-product",
                  title: order.planName,
                  quantity: 1,
                  unit_price: Math.round(order.price),
                  currency_id: "COP",
                },
              ],
              payer: order.userEmail ? { email: order.userEmail } : undefined,
              external_reference: order.userId ?? undefined,
              back_urls: {
                success: `${origin}/pago-exitoso`,
                failure: `${origin}/pago-fallido`,
                pending: `${origin}/pago-exitoso?status=pending`,
              },
              auto_return: "approved",
              payment_methods: {
                installments: order.installments ?? 12,
              },
              notification_url: `${origin}/api/mp-webhook`,
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
