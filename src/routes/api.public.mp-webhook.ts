import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Mercado Pago IPN / Webhook receiver.
 * Lives under /api/public/* so Mercado Pago can reach it without auth on the
 * published site. We verify the payment server-side using the access token
 * before trusting any status, then mark the matching order(s) as paid.
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

          const groupRef = payment.external_reference;
          if (!groupRef) return new Response("OK", { status: 200 });

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Map MP status -> our order status
          const newStatus =
            payment.status === "approved"
              ? "paid"
              : payment.status === "rejected" || payment.status === "cancelled"
                ? "failed"
                : "pending";

          const { error } = await supabaseAdmin
            .from("orders")
            .update({
              status: newStatus,
              mp_payment_id: String(paymentId),
            })
            .eq("group_ref", groupRef);

          if (error) {
            console.error("[MP Webhook] order update failed", error);
            return new Response("Webhook Error", { status: 500 });
          }

          console.log(
            "[MP Webhook]",
            payment.status,
            "payment",
            paymentId,
            "group:",
            groupRef,
            "->",
            newStatus,
          );

          return new Response("OK", { status: 200 });
        } catch (error) {
          console.error("[MP Webhook]", error);
          return new Response("Webhook Error", { status: 500 });
        }
      },
    },
  },
});
