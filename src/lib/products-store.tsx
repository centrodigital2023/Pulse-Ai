import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { MarketplaceListing } from "@/lib/mock-data";

const STORE_KEY = "pulse_products_v1";

const PEXELS_FALLBACKS = [
  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/1714202/pexels-photo-1714202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5905716/pexels-photo-5905716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/8546475/pexels-photo-8546475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/15977087/pexels-photo-15977087.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5717755/pexels-photo-5717755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/10352379/pexels-photo-10352379.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/19059657/pexels-photo-19059657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5899215/pexels-photo-5899215.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

function pexelsFallback(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PEXELS_FALLBACKS[hash % PEXELS_FALLBACKS.length];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VendorProduct {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorInitials: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  images?: string[];
  deliveryType: "file" | "link";
  fileName?: string;
  fileSize?: string;
  fileExt?: string;
  downloadUrl?: string;
  licenseType: string;
  activations: number;
  generateKey: boolean;
  price: number;
  originalPrice?: number;
  currency: "COP";
  recurring: boolean;
  badge?: "new" | "featured" | "bestseller" | "oferta";
  status: "live" | "draft";
  publishedAt?: string;
  createdAt: string;
  sales: number;
  reviews: number;
  rating: number;
  soldToday: number;
  viewers: number;
}

type NewProductData = Omit<VendorProduct, "id" | "createdAt" | "sales" | "reviews" | "rating" | "soldToday" | "viewers">;

interface ProductsContextValue {
  products: VendorProduct[];
  addProduct: (data: NewProductData) => VendorProduct;
  updateProduct: (id: string, updates: Partial<VendorProduct>) => void;
  deleteProduct: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<VendorProduct[]>(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(products));
    } catch {
      // Storage full (large base64 images) — fail silently
    }
  }, [products]);

  const addProduct = (data: NewProductData): VendorProduct => {
    const product: VendorProduct = {
      ...data,
      id: `vp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      sales: 0,
      reviews: 0,
      rating: 5.0,
      soldToday: 0,
      viewers: Math.floor(Math.random() * 20 + 8),
    };
    setProducts(prev => [product, ...prev]);
    return product;
  };

  const updateProduct = (id: string, updates: Partial<VendorProduct>) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const deleteProduct = (id: string) =>
    setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts requires ProductsProvider");
  return ctx;
}

function toMarketplaceListing(p: VendorProduct): MarketplaceListing {
  return {
    id: p.id,
    name: p.name,
    vendor: p.vendorName,
    vendorAvatar: p.vendorInitials,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    recurring: p.recurring,
    rating: p.rating,
    reviews: p.reviews,
    sales: p.sales,
    soldToday: p.soldToday,
    viewers: p.viewers,
    badge: p.badge ?? "new",
    tagline: p.tagline,
    image: (p.images?.[0]) || p.coverImage || pexelsFallback(p.id),
    images: p.images && p.images.length > 0 ? p.images : undefined,
    tags: p.tags.length > 0 ? p.tags : ["Digital", "Descarga"],
  };
}

export function useAllListings(): MarketplaceListing[] {
  const { products } = useProducts();
  return products.filter(p => p.status === "live").map(toMarketplaceListing);
}

export function fmtCOPStore(n: number) {
  return "$" + n.toLocaleString("es-CO");
}
