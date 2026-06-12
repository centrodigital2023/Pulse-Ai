import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { MarketplaceListing } from "@/lib/mock-data";

const STORE_KEY = "pulse_user_v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  tagline?: string;
  vendor: string;
  vendorAvatar: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  totalReviews?: number;
  totalSales?: number;
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

// ─── Referral & Affiliate ─────────────────────────────────────────────────────

export interface ReferredUser {
  id: string;
  joinedAt: string;
  hasConverted: boolean;
  earned: number;
}

export interface AffiliateLink {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  category: string;
  commissionRate: number;
  url: string;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
}

export interface AffiliatePayment {
  id: string;
  amount: number;
  status: "pending" | "paid";
  date: string;
}

// ─── Store data shape ─────────────────────────────────────────────────────────

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
  // Referral
  referralCode: string;
  referredUsers: ReferredUser[];
  referralEarnings: number;
  // Affiliate
  isAffiliate: boolean;
  affiliateCode: string;
  affiliateCommissionRate: number;
  affiliateLinks: AffiliateLink[];
  affiliateEarnings: number;
  affiliatePendingEarnings: number;
  affiliateTotalClicks: number;
  affiliateTotalConversions: number;
  affiliatePayments: AffiliatePayment[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

function makeCode(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len).toUpperCase();
}

const DEMO_ORDER: PurchasedOrder = {
  id: "ord-demo-001",
  items: [{
    id: "3",
    name: "Pack de Templates para Email Marketing",
    tagline: "100+ plantillas premium listas para convertir",
    vendor: "DataVault Pro",
    vendorAvatar: "DV",
    price: 149000,
    originalPrice: 350000,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80",
    category: "resources",
    rating: 4.8,
    totalReviews: 2341,
    totalSales: 17430,
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  }],
  subtotal: 149000, discount: 0, creditUsed: 0, total: 149000,
  status: "completed", paymentMethod: "Tarjeta de crédito",
  paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
};

const DEFAULT_STORE: UserStoreData = {
  cart: [],
  orders: [DEMO_ORDER],
  reviews: [],
  coupons: [
    { code: "PULSE10", description: "10% de descuento en cualquier compra", discount: 10, type: "percent", minOrder: 50000, status: "available", expiresAt: "2026-12-31" },
    { code: "BIENVENIDO", description: "$20.000 en tu primera compra", discount: 20000, type: "fixed", minOrder: 80000, status: "available", expiresAt: "2026-12-31" },
  ],
  creditBalance: 50000,
  creditHistory: [
    { id: "ct-001", amount: 50000, reason: "Crédito de bienvenida", date: new Date().toISOString() },
  ],
  followedStores: [],
  browseHistory: [],
  addresses: [],
  pendingCheckoutItems: [],
  referralCode: makeCode(7),
  referredUsers: [],
  referralEarnings: 0,
  isAffiliate: false,
  affiliateCode: makeCode(8),
  affiliateCommissionRate: 30,
  affiliateLinks: [],
  affiliateEarnings: 0,
  affiliatePendingEarnings: 0,
  affiliateTotalClicks: 0,
  affiliateTotalConversions: 0,
  affiliatePayments: [],
};

// Commission rates by category
export const CATEGORY_COMMISSIONS: Record<string, number> = {
  software: 30, education: 35, books: 40, resources: 25, services: 20,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserStoreContextValue {
  // Cart
  cart: CartItem[];
  cartCount: number;
  addToCart: (listing: MarketplaceListing) => boolean;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Orders
  orders: PurchasedOrder[];
  addOrder: (o: Omit<PurchasedOrder, "id" | "paidAt">) => void;

  // Reviews
  reviews: UserReview[];
  addReview: (r: Omit<UserReview, "id" | "createdAt">) => void;
  hasReviewed: (productId: string) => boolean;

  // Coupons
  coupons: UserCoupon[];
  addCoupon: (code: string) => { success: boolean; message: string };
  validateCoupon: (code: string, total: number) => { valid: boolean; discount: number; message: string };
  markCouponUsed: (code: string) => void;

  // Credit
  creditBalance: number;
  creditHistory: CreditTransaction[];
  useCredit: (amount: number, reason: string) => void;

  // Followed stores
  followedStores: FollowedStore[];
  followStore: (s: Omit<FollowedStore, "followedAt">) => void;
  unfollowStore: (vendorId: string) => void;
  isFollowing: (vendorId: string) => boolean;

  // Browse history
  browseHistory: BrowseItem[];
  addToBrowseHistory: (item: Omit<BrowseItem, "viewedAt">) => void;
  clearBrowseHistory: () => void;

  // Addresses
  addresses: UserAddress[];
  addAddress: (addr: Omit<UserAddress, "id">) => void;
  updateAddress: (id: string, u: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Pending checkout
  pendingCheckoutItems: CartItem[];
  setPendingCheckoutItems: (items: CartItem[]) => void;

  // Referral
  referralCode: string;
  referredUsers: ReferredUser[];
  referralEarnings: number;
  addReferral: (hasConverted?: boolean) => void;

  // Affiliate
  isAffiliate: boolean;
  affiliateCode: string;
  affiliateCommissionRate: number;
  affiliateLinks: AffiliateLink[];
  affiliateEarnings: number;
  affiliatePendingEarnings: number;
  affiliateTotalClicks: number;
  affiliateTotalConversions: number;
  affiliatePayments: AffiliatePayment[];
  becomeAffiliate: () => void;
  generateAffiliateLink: (listing: { id: string; name: string; image: string; price: number; category: string }) => AffiliateLink;
  trackAffiliateClick: (linkId: string) => void;
}

const UserStoreContext = createContext<UserStoreContextValue | null>(null);

export function UserStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<UserStoreData>(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return DEFAULT_STORE;
      const saved = JSON.parse(raw);
      return { ...DEFAULT_STORE, ...saved };
    } catch { return DEFAULT_STORE; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* full */ }
  }, [data]);

  const patch = (u: Partial<UserStoreData>) => setData(d => ({ ...d, ...u }));

  // Cart
  const addToCart = (listing: MarketplaceListing): boolean => {
    if (data.cart.some(i => i.id === listing.id)) return false;
    const item: CartItem = {
      id: listing.id, name: listing.name, tagline: listing.tagline,
      vendor: listing.vendor, vendorAvatar: listing.vendorAvatar,
      price: listing.price, originalPrice: listing.originalPrice,
      image: listing.image, category: listing.category,
      rating: listing.rating, totalReviews: listing.reviews,
      totalSales: listing.sales,
      addedAt: new Date().toISOString(),
    };
    patch({ cart: [item, ...data.cart] });
    return true;
  };
  const removeFromCart = (id: string) => patch({ cart: data.cart.filter(i => i.id !== id) });
  const clearCart = () => patch({ cart: [] });

  // Orders
  const addOrder = (o: Omit<PurchasedOrder, "id" | "paidAt">) =>
    patch({ orders: [{ ...o, id: `ord-${Date.now()}`, paidAt: new Date().toISOString() }, ...data.orders] });

  // Reviews
  const addReview = (r: Omit<UserReview, "id" | "createdAt">) =>
    patch({ reviews: [{ ...r, id: `rev-${Date.now()}`, createdAt: new Date().toISOString() }, ...data.reviews] });
  const hasReviewed = (pid: string) => data.reviews.some(r => r.productId === pid);

  // Coupons
  const KNOWN_COUPONS: Record<string, UserCoupon> = {
    PULSE10: { code: "PULSE10", description: "10% de descuento", discount: 10, type: "percent", minOrder: 50000, status: "available", expiresAt: "2026-12-31" },
    BIENVENIDO: { code: "BIENVENIDO", description: "$20.000 de descuento", discount: 20000, type: "fixed", minOrder: 80000, status: "available", expiresAt: "2026-12-31" },
    COLOMBIA: { code: "COLOMBIA", description: "15% Colombia especial", discount: 15, type: "percent", minOrder: 60000, status: "available", expiresAt: "2026-12-31" },
    PULSENEW: { code: "PULSENEW", description: "$30.000 primer compra", discount: 30000, type: "fixed", minOrder: 100000, status: "available", expiresAt: "2026-12-31" },
    AFILIADO20: { code: "AFILIADO20", description: "20% para afiliados", discount: 20, type: "percent", minOrder: 50000, status: "available", expiresAt: "2026-12-31" },
  };
  const addCoupon = (code: string): { success: boolean; message: string } => {
    const upper = code.toUpperCase().trim();
    if (data.coupons.some(c => c.code === upper)) return { success: false, message: "Cupón ya agregado" };
    if (KNOWN_COUPONS[upper]) { patch({ coupons: [...data.coupons, KNOWN_COUPONS[upper]] }); return { success: true, message: `Cupón "${upper}" agregado ✓` }; }
    return { success: false, message: "Código de cupón no válido" };
  };
  const validateCoupon = (code: string, total: number) => {
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
    patch({ creditBalance: data.creditBalance - actual, creditHistory: [{ id: `ct-${Date.now()}`, amount: -actual, reason, date: new Date().toISOString() }, ...data.creditHistory] });
  };

  // Followed stores
  const followStore = (s: Omit<FollowedStore, "followedAt">) => patch({ followedStores: [{ ...s, followedAt: new Date().toISOString() }, ...data.followedStores] });
  const unfollowStore = (vid: string) => patch({ followedStores: data.followedStores.filter(s => s.vendorId !== vid) });
  const isFollowing = (vid: string) => data.followedStores.some(s => s.vendorId === vid);

  // Browse history
  const addToBrowseHistory = (item: Omit<BrowseItem, "viewedAt">) => {
    const next = [{ ...item, viewedAt: new Date().toISOString() }, ...data.browseHistory.filter(b => b.id !== item.id)].slice(0, 20);
    patch({ browseHistory: next });
  };
  const clearBrowseHistory = () => patch({ browseHistory: [] });

  // Addresses
  const addAddress = (addr: Omit<UserAddress, "id">) => {
    const a = { ...addr, id: `addr-${Date.now()}` };
    patch({ addresses: addr.isDefault ? [a, ...data.addresses.map(x => ({ ...x, isDefault: false }))] : [...data.addresses, a] });
  };
  const updateAddress = (id: string, u: Partial<UserAddress>) => patch({ addresses: data.addresses.map(a => a.id === id ? { ...a, ...u } : a) });
  const deleteAddress = (id: string) => patch({ addresses: data.addresses.filter(a => a.id !== id) });
  const setDefaultAddress = (id: string) => patch({ addresses: data.addresses.map(a => ({ ...a, isDefault: a.id === id })) });

  // Pending checkout
  const setPendingCheckoutItems = (items: CartItem[]) => patch({ pendingCheckoutItems: items });

  // Referral
  const addReferral = (hasConverted = false) => {
    const r: ReferredUser = { id: `ref-${Date.now()}`, joinedAt: new Date().toISOString(), hasConverted, earned: hasConverted ? 25000 : 0 };
    patch({ referredUsers: [r, ...data.referredUsers], referralEarnings: data.referralEarnings + (hasConverted ? 25000 : 0) });
    if (hasConverted) patch({ creditBalance: data.creditBalance + 25000, creditHistory: [{ id: `ct-${Date.now()}`, amount: 25000, reason: "Comisión de referido", date: new Date().toISOString() }, ...data.creditHistory] });
  };

  // Affiliate
  const becomeAffiliate = () => {
    const demoLinks: AffiliateLink[] = [
      { id: "al-1", productId: "1", productName: "PULSE PRO Suite", productImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=60", productPrice: 297000, category: "software", commissionRate: 30, url: `https://pulseai.io/marketplace?ref=${data.affiliateCode}&p=1`, clicks: 145, conversions: 12, earnings: 1069200, createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
      { id: "al-2", productId: "7", productName: "Curso Marketing Digital Colombia", productImage: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=200&q=60", productPrice: 189000, category: "education", commissionRate: 35, url: `https://pulseai.io/marketplace?ref=${data.affiliateCode}&p=7`, clicks: 89, conversions: 7, earnings: 463050, createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    ];
    patch({
      isAffiliate: true,
      affiliateLinks: demoLinks,
      affiliateEarnings: 1532250,
      affiliatePendingEarnings: 356700,
      affiliateTotalClicks: 234,
      affiliateTotalConversions: 19,
      affiliatePayments: [
        { id: "ap-1", amount: 1175550, status: "paid", date: new Date(Date.now() - 30 * 86400000).toISOString() },
      ],
    });
  };

  const generateAffiliateLink = (listing: { id: string; name: string; image: string; price: number; category: string }): AffiliateLink => {
    const existing = data.affiliateLinks.find(l => l.productId === listing.id);
    if (existing) return existing;
    const rate = CATEGORY_COMMISSIONS[listing.category] ?? 25;
    const link: AffiliateLink = {
      id: `al-${Date.now()}`,
      productId: listing.id,
      productName: listing.name,
      productImage: listing.image,
      productPrice: listing.price,
      category: listing.category,
      commissionRate: rate,
      url: `https://pulseai.io/marketplace?ref=${data.affiliateCode}&p=${listing.id}`,
      clicks: 0, conversions: 0, earnings: 0,
      createdAt: new Date().toISOString(),
    };
    patch({ affiliateLinks: [link, ...data.affiliateLinks] });
    return link;
  };

  const trackAffiliateClick = (linkId: string) =>
    patch({ affiliateLinks: data.affiliateLinks.map(l => l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l), affiliateTotalClicks: data.affiliateTotalClicks + 1 });

  const value: UserStoreContextValue = {
    cart: data.cart, cartCount: data.cart.length, addToCart, removeFromCart, clearCart,
    orders: data.orders, addOrder,
    reviews: data.reviews, addReview, hasReviewed,
    coupons: data.coupons, addCoupon, validateCoupon, markCouponUsed,
    creditBalance: data.creditBalance, creditHistory: data.creditHistory, useCredit,
    followedStores: data.followedStores, followStore, unfollowStore, isFollowing,
    browseHistory: data.browseHistory, addToBrowseHistory, clearBrowseHistory,
    addresses: data.addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
    pendingCheckoutItems: data.pendingCheckoutItems, setPendingCheckoutItems,
    referralCode: data.referralCode, referredUsers: data.referredUsers, referralEarnings: data.referralEarnings, addReferral,
    isAffiliate: data.isAffiliate, affiliateCode: data.affiliateCode,
    affiliateCommissionRate: data.affiliateCommissionRate,
    affiliateLinks: data.affiliateLinks, affiliateEarnings: data.affiliateEarnings,
    affiliatePendingEarnings: data.affiliatePendingEarnings,
    affiliateTotalClicks: data.affiliateTotalClicks, affiliateTotalConversions: data.affiliateTotalConversions,
    affiliatePayments: data.affiliatePayments,
    becomeAffiliate, generateAffiliateLink, trackAffiliateClick,
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
