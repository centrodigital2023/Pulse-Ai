import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { MarketplaceListing } from "@/lib/mock-data";

const STORE_KEY = "pulse_products_v1";

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
    image: p.coverImage || `https://picsum.photos/seed/${p.id}/600/400`,
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
