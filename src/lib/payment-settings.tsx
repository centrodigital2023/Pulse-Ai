import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORE_KEY = "pulse_payment_settings_v1";

export type PayMethod = "card" | "pse" | "nequi" | "daviplata" | "efecty";
export type DefaultInstallments = 1 | 3 | 6 | 12;

export interface PaymentSettings {
  enabledMethods: Record<PayMethod, boolean>;
  defaultInstallments: DefaultInstallments;
  showUsdEquivalent: boolean;
  usdRate: number; // COP por 1 USD (TRM referencial)
}

const DEFAULT: PaymentSettings = {
  enabledMethods: { card: true, pse: true, nequi: true, daviplata: true, efecty: true },
  defaultInstallments: 3,
  showUsdEquivalent: false,
  usdRate: 4150,
};

interface Ctx {
  settings: PaymentSettings;
  updateSettings: (patch: Partial<PaymentSettings>) => void;
  toggleMethod: (method: PayMethod) => void;
  setDefaultInstallments: (n: DefaultInstallments) => void;
}

const PaymentCtx = createContext<Ctx | null>(null);

export function PaymentSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PaymentSettings>(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT;
  });

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  const updateSettings = (patch: Partial<PaymentSettings>) =>
    setSettings(prev => ({ ...prev, ...patch }));

  const toggleMethod = (method: PayMethod) =>
    setSettings(prev => ({
      ...prev,
      enabledMethods: { ...prev.enabledMethods, [method]: !prev.enabledMethods[method] },
    }));

  const setDefaultInstallments = (n: DefaultInstallments) =>
    setSettings(prev => ({ ...prev, defaultInstallments: n }));

  return (
    <PaymentCtx.Provider value={{ settings, updateSettings, toggleMethod, setDefaultInstallments }}>
      {children}
    </PaymentCtx.Provider>
  );
}

export function usePaymentSettings() {
  const ctx = useContext(PaymentCtx);
  if (!ctx) throw new Error("usePaymentSettings must be inside PaymentSettingsProvider");
  return ctx;
}
