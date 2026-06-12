import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/api/mp-webhook")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
          if (!accessToken) {
            return new Response("OK", { status: 200 });
          }

          // In production: verify signature, fetch payment, update DB
          // const { type, data } = await request.json()
          // if (type === "payment" && data?.id) {
          //   const { Payment } = await import("mercadopago")
          //   const paymentClient = new Payment(new MercadoPagoConfig({ accessToken }))
          //   const payment = await paymentClient.get({ id: data.id })
          //   if (payment.status === "approved") {
          //     // activate subscription in DB (Supabase)
          //   }
          // }

          return new Response("OK", { status: 200 });
        } catch (error) {
          console.error("[MP Webhook]", error);
          return new Response("Webhook Error", { status: 500 });
        }
      },
      GET: async () => new Response("MP Webhook endpoint", { status: 200 }),
    },
  },
});
