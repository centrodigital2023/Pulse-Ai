import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  provider: "email" | "google" | "facebook";
  joinedAt: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (u: Omit<AuthUser, "id" | "joinedAt">) => void;
  logout: () => void;
  isLoading: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pulse_auth_v1");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = (data: Omit<AuthUser, "id" | "joinedAt">) => {
    const u: AuthUser = { ...data, id: crypto.randomUUID(), joinedAt: new Date().toISOString() };
    setUser(u);
    localStorage.setItem("pulse_auth_v1", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pulse_auth_v1");
  };

  return <Ctx.Provider value={{ user, login, logout, isLoading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
