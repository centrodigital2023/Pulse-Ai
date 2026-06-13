import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";

const ItemSchema = z.object({
  id: z.string().max(200).optional(),
  name: z.string().min(1).max(200),
  price: z.number().min(0).max(100_000_000),
  image: z.string().max(1000).optional(),
  vendor: z.string().max(200).optional(),
  downloadUrl: z.string().max(2000).optional(),
});

const BodySchema = z.object({
  userId: z.string().uuid().optional(),
  planId: z.string().optional(),
  price: z.number().positive().max(100_000_000),
  planName: z.string().min(1).max(200),
  userEmail: z.string().email().optional(),
  paymentMethod: z.string().max(40).optional(),
  installments: z.number().int().min(1).max(36).optional(),
  bumps: z.array(z.string()).optional(),
  items: z.array(ItemSchema).max(20).optional(),
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

          // Normalize to a list of line items the buyer is paying for.
          const lineItems =
            order.items && order.items.length > 0
              ? order.items
              : [{ id: order.planId, name: order.planName, price: order.price }];

          // Create a pending order in the database BEFORE redirecting to
          // Mercado Pago. The shared group reference travels with the payment
          // and is what the webhook uses to confirm and grant access.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const groupRef = crypto.randomUUID();

          const rows = lineItems.map((it) => ({
            group_ref: groupRef,
            buyer_id: order.userId ?? null,
            buyer_email: order.userEmail ?? null,
            product_id: it.id ?? null,
            product_name: it.name,
            product_image: (it as { image?: string }).image ?? null,
            download_url: (it as { downloadUrl?: string }).downloadUrl ?? null,
            amount: Math.round(it.price),
            currency: "COP",
            installments: order.installments ?? 1,
            payment_method: order.paymentMethod ?? null,
            status: "pending",
          }));

          const { error: insertError } = await supabaseAdmin.from("orders").insert(rows);
          if (insertError) {
            console.error("[MP Checkout] order insert failed", insertError);
            return Response.json({ error: "No se pudo registrar la orden" }, { status: 500 });
          }

          if (!accessToken) {
            // Demo mode — no real token configured yet
            return Response.json({ demo: true, initPoint: null, groupRef });
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
              items: lineItems.map((it, i) => ({
                id: it.id ?? `item-${i}`,
                title: it.name,
                quantity: 1,
                unit_price: Math.round(it.price),
                currency_id: "COP",
              })),
              payer: order.userEmail ? { email: order.userEmail } : undefined,
              external_reference: groupRef,
              back_urls: {
                success: `${origin}/pago-exitoso`,
                failure: `${origin}/pago-fallido`,
                pending: `${origin}/pago-exitoso?status=pending`,
              },
              auto_return: "approved",
              payment_methods: {
                installments: order.installments ?? 12,
              },
              notification_url: `${origin}/api/public/mp-webhook`,
            },
          });

          // Persist the preference id against this checkout group.
          await supabaseAdmin
            .from("orders")
            .update({ mp_preference_id: response.id ?? null })
            .eq("group_ref", groupRef);

          return Response.json({ initPoint: response.init_point, demo: false, groupRef });
        } catch (error) {
          console.error("[MP Checkout]", error);
          return Response.json({ error: "Error al crear preferencia" }, { status: 500 });
        }
      },
    },
  },
});
