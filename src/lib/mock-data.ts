// PULSE AI — platform data types and static configuration.
// All demo/mock arrays have been cleared. Connect to real Supabase queries.

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductStatus = "live" | "draft";
export type FileKind = "code" | "doc" | "video" | "audio" | "image";

// ─── Product (seller dashboard) ───────────────────────────────────────────────

export interface ProductFile {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  meta: string;
  downloads: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: string;
  status: ProductStatus;
  price: number;
  recurring: boolean;
  revenue: number;
  sales: number;
  version: string;
  rating: number;
  reviews: number;
  files: ProductFile[];
}

export const products: Product[] = [];

// ─── Dashboard metrics ────────────────────────────────────────────────────────

export interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export const metrics: Metric[] = [
  { label: "Ingresos Netos", value: "$0", delta: "Sin datos aún", positive: true },
  { label: "Clientes Totales", value: "0", delta: "Sin datos aún", positive: true },
  { label: "Conversión", value: "0%", delta: "Sin datos aún", positive: true },
  { label: "Churn", value: "0%", delta: "Sin datos aún", positive: true },
];

export const revenueSeries: { month: string; revenue: number; mrr: number }[] = [];

export const funnel: { stage: string; count: number; pct: number }[] = [
  { stage: "Visitantes únicos", count: 0, pct: 100 },
  { stage: "Vieron un producto", count: 0, pct: 0 },
  { stage: "Iniciaron checkout", count: 0, pct: 0 },
  { stage: "Compraron", count: 0, pct: 0 },
];

// ─── Customers ────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  initials?: string;
  location: string;
  segment: string;
  spent: number;
  products: number;
  activations: number;
  ltv: number;
  joinDate: string;
  lastActivity: string;
}

export const customers: Customer[] = [];

// ─── License keys ─────────────────────────────────────────────────────────────

export interface LicenseKey {
  id: string;
  key: string;
  product: string;
  customer: string;
  activations: number;
  limit: number;
  status: "active" | "expired" | "revoked";
  type: "personal" | "professional" | "enterprise" | "white_label";
  issued: string;
  expires: string | null;
}

export const licenseKeys: LicenseKey[] = [];

// ─── Webhooks ─────────────────────────────────────────────────────────────────

export interface WebhookEntry {
  id: string;
  event: string;
  endpoint: string;
  status: number;
  latency: number;
  ts: string;
}

export const webhookEvents = [
  "order.paid", "order.refunded", "license.activated", "license.revoked",
  "product.published", "affiliate.conversion", "subscription.renewed", "subscription.cancelled",
];

export const webhookLog: WebhookEntry[] = [];

// ─── Activity feed ────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  who: string;
  action: string;
  target: string;
  meta: string;
}

export const activity: Activity[] = [];

// ─── Library items ────────────────────────────────────────────────────────────

export interface LibraryItem {
  id: string;
  productId: string;
  name: string;
  vendor: string;
  category: string;
  image: string;
  progress: number;
  orderId: string;
  orderDate: string;
  files: { id: string; name: string; kind: FileKind; size: string; downloads: number }[];
}

export function fileKindLabel(kind: FileKind): string {
  const map: Record<FileKind, string> = {
    code: "Código fuente",
    doc: "Documento",
    video: "Video",
    audio: "Audio",
    image: "Imagen / Diseño",
  };
  return map[kind] ?? kind;
}

export const libraryItems: LibraryItem[] = [];

// ─── Affiliates ───────────────────────────────────────────────────────────────

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  earnings: number;
  pendingEarnings: number;
  sales: number;
  clicks: number;
  conversionRate: number;
  joinDate: string;
  lastActivity: string;
}

export const affiliates: Affiliate[] = [];

export const affiliateCommissionSeries: { month: string; earnings: number; sales: number }[] = [];

// ─── Courses ──────────────────────────────────────────────────────────────────

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  kind: "video" | "text" | "quiz";
  free: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  productId: string;
  title: string;
  description: string;
  thumbnail: string;
  totalDuration: string;
  totalLessons: number;
  students: number;
  rating: number;
  modules: CourseModule[];
}

export const courses: Course[] = [];

// ─── Automation flows ─────────────────────────────────────────────────────────

export interface AutomationStep {
  id: string;
  type: "email" | "wait" | "condition" | "tag";
  label: string;
  config: Record<string, string | number | boolean>;
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  status: "active" | "draft" | "paused";
  contacts: number;
  sent: number;
  openRate: number;
  clickRate: number;
  steps: AutomationStep[];
}

export const automationFlows: AutomationFlow[] = [];

// ─── Marketplace vendors (admin view) ─────────────────────────────────────────

export interface MarketplaceVendor {
  id: string;
  name: string;
  initials: string;
  country: string;
  category: string;
  products: number;
  revenue: number;
  rating: number;
  sales: number;
  status: "active" | "pending" | "blocked" | "suspended";
  joinDate: string;
  email: string;
  handle?: string;
  verified?: boolean;
  commission?: number;
  phone?: string;
  joined?: string;
  description?: string;
}

export const marketplaceVendors: MarketplaceVendor[] = [];

// ─── Marketplace categories (real UX config — not demo data) ─────────────────

export const marketplaceCategories = [
  { id: "all",       label: "Todos los productos",   count: 0, emoji: "🛒" },
  { id: "software",  label: "Software & SaaS",        count: 0, emoji: "💻" },
  { id: "education", label: "Cursos & Educación",     count: 0, emoji: "🎓" },
  { id: "resources", label: "Plantillas & Recursos",  count: 0, emoji: "🎨" },
  { id: "books",     label: "eBooks & Guías",          count: 0, emoji: "📚" },
  { id: "services",  label: "Servicios",              count: 0, emoji: "⚡" },
];

// ─── Marketplace listings (populated by sellers via products-store) ───────────

export interface MarketplaceListing {
  id: string;
  name: string;
  vendor: string;
  vendorAvatar: string;
  category: string;
  price: number;
  originalPrice?: number;
  recurring: boolean;
  rating: number;
  reviews: number;
  sales: number;
  soldToday: number;
  viewers: number;
  badge?: "bestseller" | "new" | "featured" | "oferta";
  tagline: string;
  image: string;
  images?: string[];
  tags: string[];
}

export const marketplaceListings: MarketplaceListing[] = [];

// ─── AI Insights (generated live by Supabase edge functions) ──────────────────

export interface AiInsight {
  id: string;
  kind: "opportunity" | "risk" | "trend";
  title: string;
  body: string;
  action: string;
  impact: "high" | "medium" | "low";
}

export const aiInsights: AiInsight[] = [];

// ─── Analytics extras (computed from real orders in db.ts) ───────────────────

export const geographicData: { country: string; code: string; revenue: number; customers: number; pct: number }[] = [];
export const cohortData: { cohort: string; month0: number; month1: number; month2: number; month3: number; month4: number; month5: number }[] = [];
export const revenueByProduct: { name: string; revenue: number }[] = [];

// ─── Pricing plans (real platform pricing — not demo data) ───────────────────

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfecto para creadores que están comenzando.",
    highlight: false,
    features: [
      "Hasta 5 productos",
      "1 GB de almacenamiento",
      "Analytics básicos",
      "Soporte por email",
      "Checkout estándar",
      "Generación de licencias",
      "Biblioteca del comprador",
    ],
    cta: "Empezar gratis",
  },
  {
    id: "professional",
    name: "Profesional",
    price: 99,
    description: "Para emprendedores digitales en crecimiento.",
    highlight: false,
    features: [
      "Hasta 25 productos",
      "50 GB de almacenamiento",
      "Analytics avanzados",
      "Soporte prioritario",
      "Order bumps y upsells",
      "Programa de afiliados",
      "Automatización de emails (5 flujos)",
      "Constructor de cursos",
      "Dominio personalizado",
    ],
    cta: "Iniciar prueba gratis",
  },
  {
    id: "business",
    name: "Business",
    price: 299,
    description: "Escala tu negocio digital sin límites.",
    highlight: true,
    features: [
      "Productos ilimitados",
      "500 GB de almacenamiento",
      "Analytics ejecutivos",
      "Soporte prioritario + chat",
      "Automatización de marketing completa",
      "Afiliados ilimitados",
      "Asistente de ventas IA",
      "Marketplace multi-vendor",
      "White-label branding",
      "Acceso API",
      "Webhooks e integraciones",
    ],
    cta: "Iniciar prueba gratis",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    description: "Infraestructura corporativa con soporte dedicado.",
    highlight: false,
    features: [
      "Todo lo de Business",
      "10 TB+ de almacenamiento",
      "Infraestructura dedicada",
      "SLA 99.99% uptime",
      "SSO & SAML",
      "RBAC y auditoría completa",
      "IA personalizada",
      "Gerente de éxito dedicado",
      "Contrato y facturación personalizada",
      "Opción on-premise",
    ],
    cta: "Contactar a ventas",
  },
];
