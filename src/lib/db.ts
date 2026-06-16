import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
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

// ─── Roles ───────────────────────────────────────────────────────────────────

export type AppRole = "admin" | "creator" | "user";

export function useMyRoles() {
  const { user, isLoading: authLoading } = useAuth();
  const uid = user?.id ?? null;
  const query = useQuery({
    queryKey: ["my-roles", uid],
    enabled: !authLoading,
    queryFn: async (): Promise<AppRole[]> => {
      if (!uid) return [];
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
  // Stay in "loading" state until auth resolves so role checks don't run prematurely.
  return { ...query, isLoading: authLoading || query.isLoading };
}

/** True only for sellers/creators — the vendor dashboard is exclusive to sellers. */
export function useCanAccessDashboard() {
  const { data: roles = [], isLoading } = useMyRoles();
  const canAccess = roles.includes("creator");
  return { canAccess, isLoading };
}

/** True for superadmin (admin role) — gives access to /superadmin panel. */
export function useIsAdmin() {
  const { data: roles = [], isLoading } = useMyRoles();
  return { isAdmin: roles.includes("admin"), isLoading };
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

/** Public live products for the marketplace. Anon-readable via RLS. */
export function usePublicProducts() {
  return useQuery({
    queryKey: ["public-products"],
    queryFn: async (): Promise<DBProduct[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_files(*)")
        .eq("status", "live")
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

export function useUpdateProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; status: "live" | "draft" }) => {
      const { error } = await supabase
        .from("products")
        .update({ status: input.status })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
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

// ─── Orders / Purchases ───────────────────────────────────────────────────────

export interface DBOrder {
  id: string;
  group_ref: string;
  buyer_id: string | null;
  buyer_email: string | null;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  download_url: string | null;
  amount: number;
  currency: string;
  installments: number;
  payment_method: string | null;
  status: "pending" | "paid" | "failed";
  mp_payment_id: string | null;
  created_at: string;
}

// ─── Public platform stats (landing page counters) ───────────────────────────

export interface PublicStats {
  totalProducts: number;
  totalOrders: number;
  totalCreators: number;
}

/** Unauthenticated aggregate counts for landing page animated counters. */
export function usePublicStats() {
  return useQuery({
    queryKey: ["public-stats"],
    staleTime: 1000 * 60 * 5, // refresh every 5 minutes
    queryFn: async (): Promise<PublicStats> => {
      const [{ count: products }, { count: orders }, { count: creators }] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "live"),
        supabase.from("orders" as never).select("id", { count: "exact", head: true }).eq("status", "paid"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "creator"),
      ]);
      return {
        totalProducts: products ?? 0,
        totalOrders: orders ?? 0,
        totalCreators: creators ?? 0,
      };
    },
  });
}

/** Paid purchases for the signed-in buyer. RLS scopes rows to auth.uid(). */
export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async (): Promise<DBOrder[]> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];
      const { data, error } = await supabase
        .from("orders" as never)
        .select("*")
        .eq("status", "paid")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as DBOrder[];
    },
  });
}

// ─── Admin (superadmin panel) ──────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: AppRole[];
  isSeller: boolean;
  isAdmin: boolean;
}

/** All platform users with their roles. Readable only by admins (RLS). */
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<AdminUser[]> => {
      const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("id, name, email, avatar_url, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;
      const roleMap = new Map<string, AppRole[]>();
      (roles ?? []).forEach((r: { user_id: string; role: string }) => {
        const list = roleMap.get(r.user_id) ?? [];
        list.push(r.role as AppRole);
        roleMap.set(r.user_id, list);
      });
      return (profiles ?? []).map((p) => {
        const userRoles = roleMap.get(p.id) ?? [];
        return {
          id: p.id,
          name: (p as { name: string | null }).name,
          email: (p as { email: string | null }).email,
          avatar_url: (p as { avatar_url: string | null }).avatar_url,
          created_at: (p as { created_at: string }).created_at,
          roles: userRoles,
          isSeller: userRoles.includes("creator"),
          isAdmin: userRoles.includes("admin"),
        };
      });
    },
  });
}

/** All orders across the platform. Readable only by admins (RLS). */
export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async (): Promise<DBOrder[]> => {
      const { data, error } = await supabase
        .from("orders" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as DBOrder[];
    },
  });
}

/** All products across the platform. Readable by admins via owner override + live. */
export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async (): Promise<DBProduct[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_files(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DBProduct[];
    },
  });
}

// ─── Seller dashboard stats (real data) ────────────────────────────────────────

export interface SellerActivity {
  id: string;
  who: string;
  action: string;
  target: string;
  meta: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  pct: number;
}

export interface SellerStats {
  revenueToday: number;
  salesToday: number;
  newCustomersToday: number;
  revenueTotal: number;
  salesTotal: number;
  customersTotal: number;
  productsLive: number;
  productsTotal: number;
  revenueSeries: RevenuePoint[];
  activity: SellerActivity[];
  funnel: FunnelStage[];
}

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "hace instantes";
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const days = Math.floor(hr / 24);
  return `hace ${days} d`;
}

/** Real-time seller dashboard metrics derived from products + paid orders. */
export function useSellerStats() {
  return useQuery({
    queryKey: ["seller-stats"],
    queryFn: async (): Promise<SellerStats> => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      const empty: SellerStats = {
        revenueToday: 0, salesToday: 0, newCustomersToday: 0,
        revenueTotal: 0, salesTotal: 0, customersTotal: 0,
        productsLive: 0, productsTotal: 0,
        revenueSeries: [], activity: [], funnel: [],
      };
      if (!uid) return empty;

      const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("id, status").eq("owner_id", uid),
        supabase.from("orders" as never).select("*").eq("status", "paid").order("created_at", { ascending: false }),
      ]);

      const productIds = new Set((products ?? []).map((p) => p.id));
      // Keep only paid orders that belong to this seller's products.
      const sellerOrders = ((orders ?? []) as unknown as DBOrder[]).filter(
        (o) => o.product_id && productIds.has(o.product_id),
      );

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayMs = startOfToday.getTime();

      const todayOrders = sellerOrders.filter((o) => new Date(o.created_at).getTime() >= todayMs);
      const revenueTotal = sellerOrders.reduce((s, o) => s + Number(o.amount || 0), 0);
      const revenueToday = todayOrders.reduce((s, o) => s + Number(o.amount || 0), 0);

      const buyers = new Set(sellerOrders.map((o) => o.buyer_id || o.buyer_email).filter(Boolean));
      const buyersToday = new Set(todayOrders.map((o) => o.buyer_id || o.buyer_email).filter(Boolean));

      // Last 6 months revenue series.
      const now = new Date();
      const series: RevenuePoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const revenue = sellerOrders
          .filter((o) => {
            const t = new Date(o.created_at).getTime();
            return t >= d.getTime() && t < next.getTime();
          })
          .reduce((s, o) => s + Number(o.amount || 0), 0);
        series.push({ month: MONTH_LABELS[d.getMonth()], revenue });
      }

      const activity: SellerActivity[] = sellerOrders.slice(0, 6).map((o) => ({
        id: o.id,
        who: o.buyer_email?.split("@")[0] ?? "Cliente",
        action: "compró",
        target: o.product_name,
        meta: `${timeAgo(o.created_at)} · $${Number(o.amount || 0).toLocaleString()}`,
      }));

      const paid = sellerOrders.length;
      const funnel: FunnelStage[] = [
        { stage: "Completó el pago", count: paid, pct: 100 },
      ];

      return {
        revenueToday,
        salesToday: todayOrders.length,
        newCustomersToday: buyersToday.size,
        revenueTotal,
        salesTotal: sellerOrders.length,
        customersTotal: buyers.size,
        productsLive: (products ?? []).filter((p) => p.status === "live").length,
        productsTotal: (products ?? []).length,
        revenueSeries: series,
        activity,
        funnel,
      };
    },
  });
}
