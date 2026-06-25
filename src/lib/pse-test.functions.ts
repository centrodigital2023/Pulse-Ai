import { createServerFn } from "@tanstack/react-start";

export interface PSEBankStatus {
  /** Financial institution id as reported by Mercado Pago */
  id: string;
  /** Display name */
  name: string;
  /** Whether this bank is currently available/enabled for PSE in MP */
  available: boolean;
}

export interface PSEVerificationResult {
  /** Whether PSE itself is enabled as a payment method on the account */
  pseEnabled: boolean;
  /** Whether the MP access token was configured and the call succeeded */
  connected: boolean;
  /** Total banks reported as available by Mercado Pago */
  total: number;
  /** Per-bank availability status, sorted by name */
  banks: PSEBankStatus[];
  /** Optional human readable error/diagnostic message */
  message?: string;
}

/**
 * Verifies the PSE payment method against the live Mercado Pago account.
 *
 * It queries MP's `/v1/payment_methods` endpoint server-side (the access token
 * stays secret), finds the `pse` method and lists every financial institution
 * (bank) MP currently reports as available. This is the authoritative source
 * for which banks a buyer can actually pay with, per bank.
 */
export const verifyPSEBanks = createServerFn({ method: "GET" }).handler(
  async (): Promise<PSEVerificationResult> => {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return {
        pseEnabled: false,
        connected: false,
        total: 0,
        banks: [],
        message:
          "No hay token de acceso de Mercado Pago configurado. Configura MERCADOPAGO_ACCESS_TOKEN.",
      };
    }

    try {
      const res = await fetch("https://api.mercadopago.com/v1/payment_methods", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
          pseEnabled: false,
          connected: false,
          total: 0,
          banks: [],
          message: `Mercado Pago respondió ${res.status}. ${text.slice(0, 200)}`,
        };
      }

      const methods = (await res.json()) as Array<{
        id?: string;
        name?: string;
        status?: string;
        payment_type_id?: string;
        financial_institutions?: Array<{ id?: string | number; description?: string }>;
      }>;

      const pse = methods.find(
        (m) => m.id === "pse" || m.payment_type_id === "bank_transfer",
      );

      if (!pse) {
        return {
          pseEnabled: false,
          connected: true,
          total: 0,
          banks: [],
          message:
            "PSE no aparece habilitado para esta cuenta de Mercado Pago. Verifica que tu cuenta sea de Colombia y tenga PSE activo.",
        };
      }

      const banks: PSEBankStatus[] = (pse.financial_institutions ?? [])
        .map((fi) => ({
          id: String(fi.id ?? ""),
          name: fi.description ?? String(fi.id ?? ""),
          available: true,
        }))
        .filter((b) => b.id && b.name)
        .sort((a, b) => a.name.localeCompare(b.name, "es"));

      return {
        pseEnabled: pse.status ? pse.status === "active" : banks.length > 0,
        connected: true,
        total: banks.length,
        banks,
        message:
          banks.length === 0
            ? "PSE está habilitado pero Mercado Pago no devolvió bancos. Inténtalo de nuevo más tarde."
            : undefined,
      };
    } catch (error) {
      return {
        pseEnabled: false,
        connected: false,
        total: 0,
        banks: [],
        message: `Error al conectar con Mercado Pago: ${
          error instanceof Error ? error.message : "desconocido"
        }`,
      };
    }
  },
);
