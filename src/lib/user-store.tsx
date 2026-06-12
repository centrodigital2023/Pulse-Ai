import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { MarketplaceListing } from "@/lib/mock-data";

const STORE_KEY = "pulse_user_v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  vendor: string;
  vendorAvatar: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  addedAt: string;
}

export interface PurchasedOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  creditUsed: number;
  total: number;
  couponCode?: string;
  status: "pending" | "completed" | "refunded";
  paymentMethod: string;
  paidAt: string;
}

export interface UserReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserCoupon {
  code: string;
  description: string;
  discount: number;
  type: "percent" | "fixed";
  minOrder: number;
  expiresAt?: string;
  usedAt?: string;
  status: "available" | "used" | "expired";
}

export interface UserAddress {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  department: string;
  phone: string;
  isDefault: boolean;
}

export interface BrowseItem {
  id: string;
  name: string;
  vendor: string;
  price: number;
  image: string;
  viewedAt: string;
}

export interface FollowedStore {
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  followedAt: string;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  reason: string;
  date: string;
}

interface UserStoreData {
  cart: CartItem[];
  orders: PurchasedOrder[];
  reviews: UserReview[];
  coupons: UserCoupon[];
  creditBalance: number;
  creditHistory: CreditTransaction[];
  followedStores: FollowedStore[];
  browseHistory: BrowseItem[];
  addresses: UserAddress[];
  pendingCheckoutItems: CartItem[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEMO_ORDER: PurchasedOrder = {
  id: "ord-demo-001",
  items: [{
    id: "3",
    name: "Pack de Templates para Email Marketing",
    vendor: "DataVault Pro",
    vendorAvatar: "DV",
    price: 149000,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80",
    category: "resources",
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  }],
  subtotal: 149000,
  discount: 0,
  creditUsed: 0,
  total: 149000,
  status: "completed",
  paymentMethod: "Tarjeta de crédito",
  paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
};

const DEFAULT_STORE: UserStoreData = {
  cart: [],
  orders: [DEMO_ORDER],
  reviews: [],
  coupons: [
    { code: "PULSE10", description: "10% de descuento en cualquier compra", discount: 10, type: "percent", minOrder: 50000, status: "available", expiresAt: "2026-12-31" },
    { code: "BIENVENIDO", description: "$20.000 de descuento en tu primera compra", discount: 20000, type: "fixed", minOrder: 80000, status: "available", expiresAt: "2026-12-31" },
  ],
  creditBalance: 50000,
  creditHistory: [
    { id: "ct-001", amount: 50000, reason: "Crédito de bienvenida", date: new Date().toISOString() },
  ],
  followedStores: [],
  browseHistory: [],
  addresses: [],
  pendingCheckoutItems: [],
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserStoreContextValue {
  cart: CartItem[];
  cartCount: number;
  addToCart: (listing: MarketplaceListing) => boolean;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  orders: PurchasedOrder[];
  addOrder: (order: Omit<PurchasedOrder, "id" | "paidAt">) => void;

  reviews: UserReview[];
  addReview: (r: Omit<UserReview, "id" | "createdAt">) => void;
  hasReviewed: (productId: string) => boolean;

  coupons: UserCoupon[];
  addCoupon: (code: string) => { success: boolean; message: string };
  validateCoupon: (code: string, total: number) => { valid: boolean; discount: number; message: string };
  markCouponUsed: (code: string) => void;

  creditBalance: number;
  creditHistory: CreditTransaction[];
  useCredit: (amount: number, reason: string) => void;

  followedStores: FollowedStore[];
  followStore: (s: Omit<FollowedStore, "followedAt">) => void;
  unfollowStore: (vendorId: string) => void;
  isFollowing: (vendorId: string) => boolean;

  browseHistory: BrowseItem[];
  addToBrowseHistory: (item: Omit<BrowseItem, "viewedAt">) => void;
  clearBrowseHistory: () => void;

  addresses: UserAddress[];
  addAddress: (addr: Omit<UserAddress, "id">) => void;
  updateAddress: (id: string, updates: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  pendingCheckoutItems: CartItem[];
  setPendingCheckoutItems: (items: CartItem[]) => void;
}

const UserStoreContext = createContext<UserStoreContextValue | null>(null);

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<UserStoreData>(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return DEFAULT_STORE;
      const saved = JSON.parse(raw);
      return { ...DEFAULT_STORE, ...saved };
    } catch {
      return DEFAULT_STORE;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* storage full */ }
  }, [data]);

  const patch = (updates: Partial<UserStoreData>) => setData(d => ({ ...d, ...updates }));

  // Cart
  const addToCart = (listing: MarketplaceListing): boolean => {
    if (data.cart.some(i => i.id === listing.id)) return false;
    const item: CartItem = {
      id: listing.id, name: listing.name, vendor: listing.vendor,
      vendorAvatar: listing.vendorAvatar, price: listing.price,
      originalPrice: listing.originalPrice, image: listing.image,
      category: listing.category, addedAt: new Date().toISOString(),
    };
    patch({ cart: [item, ...data.cart] });
    return true;
  };
  const removeFromCart = (id: string) => patch({ cart: data.cart.filter(i => i.id !== id) });
  const clearCart = () => patch({ cart: [] });

  // Orders
  const addOrder = (order: Omit<PurchasedOrder, "id" | "paidAt">) =>
    patch({ orders: [{ ...order, id: `ord-${Date.now()}`, paidAt: new Date().toISOString() }, ...data.orders] });

  // Reviews
  const addReview = (r: Omit<UserReview, "id" | "createdAt">) =>
    patch({ reviews: [{ ...r, id: `rev-${Date.now()}`, createdAt: new Date().toISOString() }, ...data.reviews] });
  const hasReviewed = (productId: string) => data.reviews.some(r => r.productId === productId);

  // Coupons
  const addCoupon = (code: string): { success: boolean; message: string } => {
    const upper = code.toUpperCase().trim();
    if (data.coupons.some(c => c.code === upper)) return { success: false, message: "Cupón ya agregado" };
    const known: Record<string, UserCoupon> = {
      PULSE10: { code: "PULSE10", description: "10% de descuento", discount: 10, type: "percent", minOrder: 50000, status: "available", expiresAt: "2026-12-31" },
      BIENVENIDO: { code: "BIENVENIDO", description: "$20.000 de descuento", discount: 20000, type: "fixed", minOrder: 80000, status: "available", expiresAt: "2026-12-31" },
      COLOMBIA: { code: "COLOMBIA", description: "15% — especial Colombia", discount: 15, type: "percent", minOrder: 60000, status: "available", expiresAt: "2026-12-31" },
      PULSENEW: { code: "PULSENEW", description: "$30.000 primer compra", discount: 30000, type: "fixed", minOrder: 100000, status: "available", expiresAt: "2026-12-31" },
    };
    if (known[upper]) {
      patch({ coupons: [...data.coupons, known[upper]] });
      return { success: true, message: `Cupón "${upper}" agregado ✓` };
    }
    return { success: false, message: "Código de cupón no válido" };
  };

  const validateCoupon = (code: string, total: number): { valid: boolean; discount: number; message: string } => {
    const c = data.coupons.find(x => x.code === code.toUpperCase());
    if (!c) return { valid: false, discount: 0, message: "Cupón no encontrado" };
    if (c.status !== "available") return { valid: false, discount: 0, message: "Cupón ya utilizado" };
    if (c.expiresAt && new Date(c.expiresAt) < new Date()) return { valid: false, discount: 0, message: "Cupón expirado" };
    if (total < c.minOrder) return { valid: false, discount: 0, message: `Mínimo ${fmtCOP(c.minOrder)} para este cupón` };
    const disc = c.type === "percent" ? Math.round(total * c.discount / 100) : c.discount;
    return { valid: true, discount: disc, message: `${c.type === "percent" ? `${c.discount}%` : fmtCOP(c.discount)} de descuento aplicado` };
  };

  const markCouponUsed = (code: string) =>
    patch({ coupons: data.coupons.map(c => c.code === code.toUpperCase() ? { ...c, status: "used" as const, usedAt: new Date().toISOString() } : c) });

  // Credit
  const useCredit = (amount: number, reason: string) => {
    const actual = Math.min(amount, data.creditBalance);
    patch({
      creditBalance: data.creditBalance - actual,
      creditHistory: [{ id: `ct-${Date.now()}`, amount: -actual, reason, date: new Date().toISOString() }, ...data.creditHistory],
    });
  };

  // Followed stores
  const followStore = (s: Omit<FollowedStore, "followedAt">) =>
    patch({ followedStores: [{ ...s, followedAt: new Date().toISOString() }, ...data.followedStores] });
  const unfollowStore = (vendorId: string) =>
    patch({ followedStores: data.followedStores.filter(s => s.vendorId !== vendorId) });
  const isFollowing = (vendorId: string) => data.followedStores.some(s => s.vendorId === vendorId);

  // Browse history
  const addToBrowseHistory = (item: Omit<BrowseItem, "viewedAt">) => {
    const filtered = data.browseHistory.filter(b => b.id !== item.id);
    const next = [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
    patch({ browseHistory: next });
  };
  const clearBrowseHistory = () => patch({ browseHistory: [] });

  // Addresses
  const addAddress = (addr: Omit<UserAddress, "id">) => {
    const newAddr = { ...addr, id: `addr-${Date.now()}` };
    const addresses = addr.isDefault
      ? [newAddr, ...data.addresses.map(a => ({ ...a, isDefault: false }))]
      : [...data.addresses, newAddr];
    patch({ addresses });
  };
  const updateAddress = (id: string, updates: Partial<UserAddress>) =>
    patch({ addresses: data.addresses.map(a => a.id === id ? { ...a, ...updates } : a) });
  const deleteAddress = (id: string) =>
    patch({ addresses: data.addresses.filter(a => a.id !== id) });
  const setDefaultAddress = (id: string) =>
    patch({ addresses: data.addresses.map(a => ({ ...a, isDefault: a.id === id })) });

  // Pending checkout
  const setPendingCheckoutItems = (items: CartItem[]) => patch({ pendingCheckoutItems: items });

  const value: UserStoreContextValue = {
    cart: data.cart,
    cartCount: data.cart.length,
    addToCart, removeFromCart, clearCart,
    orders: data.orders, addOrder,
    reviews: data.reviews, addReview, hasReviewed,
    coupons: data.coupons, addCoupon, validateCoupon, markCouponUsed,
    creditBalance: data.creditBalance, creditHistory: data.creditHistory, useCredit,
    followedStores: data.followedStores, followStore, unfollowStore, isFollowing,
    browseHistory: data.browseHistory, addToBrowseHistory, clearBrowseHistory,
    addresses: data.addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
    pendingCheckoutItems: data.pendingCheckoutItems, setPendingCheckoutItems,
  };

  return <UserStoreContext.Provider value={value}>{children}</UserStoreContext.Provider>;
}

export function useUserStore() {
  const ctx = useContext(UserStoreContext);
  if (!ctx) throw new Error("useUserStore requires UserStoreProvider");
  return ctx;
}

export function fmtCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}
