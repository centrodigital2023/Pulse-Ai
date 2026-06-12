import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Mercado Pago IPN / Webhook receiver.
 * Lives under /api/public/* so Mercado Pago can reach it without auth on the
 * published site. We verify the payment server-side using the access token
 * before trusting any status.
 */
export const Route = createFileRoute("/api/public/mp-webhook")({
  server: {
    handlers: {
      GET: async () => new Response("MP Webhook endpoint OK", { status: 200 }),
      POST: async ({ request }) => {
        try {
          const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
          const body = await request.json().catch(() => ({} as Record<string, unknown>));

          // Mercado Pago sends { type, action, data: { id } }
          const type = (body as any)?.type ?? (body as any)?.topic;
          const paymentId = (body as any)?.data?.id ?? (body as any)?.["data.id"];

          if (!accessToken || type !== "payment" || !paymentId) {
            // Always 200 so MP does not retry indefinitely on irrelevant events
            return new Response("OK", { status: 200 });
          }

          // Verify the payment with Mercado Pago before acting on it
          const { MercadoPagoConfig, Payment } = await import("mercadopago");
          const client = new MercadoPagoConfig({ accessToken });
          const paymentClient = new Payment(client);
          const payment = await paymentClient.get({ id: String(paymentId) });

          if (payment.status === "approved") {
            // Payment verified as approved. Fulfillment (granting library
            // access, issuing licenses) can be wired here using supabaseAdmin
            // once the purchases schema is defined.
            console.log(
              "[MP Webhook] Approved payment",
              paymentId,
              "ref:",
              payment.external_reference,
            );
          }

          return new Response("OK", { status: 200 });
        } catch (error) {
          console.error("[MP Webhook]", error);
          return new Response("Webhook Error", { status: 500 });
        }
      },
    },
  },
});
