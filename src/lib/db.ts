import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FileKind } from "@/lib/mock-data";

export interface DBProductFile {
  id: string;
  product_id: string;
  name: string;
  kind: FileKind;
  size: string | null;
  meta: string | null;
  storage_path: string | null;
  downloads: number;
}

export interface DBProduct {
  id: string;
  owner_id: string;
  name: string;
  tagline: string | null;
  category: string | null;
  status: "live" | "draft";
  price: number;
  recurring: boolean;
  version: string | null;
  licensing_enabled: boolean;
  created_at: string;
  product_files: DBProductFile[];
}

export interface DBCustomer {
  id: string;
  name: string;
  email: string;
  spent: number;
  products: number;
  activations: number;
  last_ip: string | null;
  location: string | null;
  segment: string;
  ltv: number;
}

export interface DBLicense {
  id: string;
  key: string;
  product_name: string | null;
  customer_name: string | null;
  activations: number;
  activation_limit: number;
  status: "active" | "expired" | "revoked";
  type: "personal" | "professional" | "enterprise" | "white_label";
  expires_at: string | null;
  product_id: string | null;
}

// ─── Products ────────────────────────────────────────────────────────────────

export function useMyProducts() {
  return useQuery({
    queryKey: ["my-products"],
    queryFn: async (): Promise<DBProduct[]> => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*, product_files(*)")
        .eq("owner_id", uid)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DBProduct[];
    },
  });
}

export interface NewProductInput {
  name: string;
  tagline: string;
  category: string;
  price: number;
  recurring: boolean;
  status: "live" | "draft";
  licensing_enabled: boolean;
  files: { name: string; kind: FileKind; size: string }[];
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewProductInput): Promise<string> => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Debes iniciar sesión para crear productos.");
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          owner_id: uid,
          name: input.name,
          tagline: input.tagline,
          category: input.category,
          price: input.price,
          recurring: input.recurring,
          status: input.status,
          licensing_enabled: input.licensing_enabled,
        })
        .select("id")
        .single();
      if (error) throw error;
      if (input.files.length) {
        const { error: fErr } = await supabase.from("product_files").insert(
          input.files.map((f) => ({
            product_id: product.id,
            name: f.name,
            kind: f.kind,
            size: f.size,
            meta: "Subido al CDN",
          })),
        );
        if (fErr) throw fErr;
      }
      return product.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-products"] }),
  });
}

// ─── Customers ───────────────────────────────────────────────────────────────

export function useMyCustomers() {
  return useQuery({
    queryKey: ["my-customers"],
    queryFn: async (): Promise<DBCustomer[]> => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DBCustomer[];
    },
  });
}

// ─── Licenses ────────────────────────────────────────────────────────────────

export function useMyLicenses() {
  return useQuery({
    queryKey: ["my-licenses"],
    queryFn: async (): Promise<DBLicense[]> => {
      const { data, error } = await supabase
        .from("license_keys")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DBLicense[];
    },
  });
}

function genKey() {
  const block = () => Math.random().toString(36).toUpperCase().slice(2, 6);
  return `PNS-${block()}-${block()}-${block()}`;
}

export function useCreateLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { product_name: string; customer_name?: string; activation_limit?: number }) => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Debes iniciar sesión para generar licencias.");
      const { error } = await supabase.from("license_keys").insert({
        owner_id: uid,
        key: genKey(),
        product_name: input.product_name,
        customer_name: input.customer_name ?? "Emisión manual",
        activation_limit: input.activation_limit ?? 3,
        status: "active",
        type: "professional",
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-licenses"] }),
  });
}
