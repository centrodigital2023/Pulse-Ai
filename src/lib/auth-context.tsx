import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar?: string;
  provider: string;
}

interface AuthCtx {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

function getInitials(name: string) {
  return name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "US";
}

function mapUser(session: Session | null): AuthUser | null {
  const u = session?.user;
  if (!u) return null;
  const meta = u.user_metadata ?? {};
  const name = meta.name || meta.full_name || (u.email ? u.email.split("@")[0] : "Usuario");
  return {
    id: u.id,
    name,
    email: u.email ?? "",
    initials: getInitials(name),
    avatar: meta.avatar_url,
    provider: u.app_metadata?.provider ?? "email",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { name } },
    });
    return { error: error?.message };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) return { error: result.error.message };
    return {};
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <Ctx.Provider value={{ user: mapUser(session), session, isLoading, signUp, signIn, signInWithGoogle, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
