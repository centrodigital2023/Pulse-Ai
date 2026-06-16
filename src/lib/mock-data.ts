// Mock data for PULSE AI platform demo.
// Replace with backend queries when wired up.

export type ProductStatus = "live" | "draft";
export type FileKind = "code" | "doc" | "video" | "audio" | "image";

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

// ─── Metrics ────────────────────────────────────────────────────────────────

export interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export const metrics: Metric[] = [];

export const revenueSeries: { month: string; revenue: number; mrr: number }[] = [];

export const funnel: { stage: string; count: number; pct: number }[] = [];

// ─── Customers / CRM ─────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  initials: string;
  spent: number;
  products: number;
  activations: number;
  lastIp: string;
  location: string;
  joined: string;
  segment: "vip" | "regular" | "at_risk";
  ltv: number;
}

export const customers: Customer[] = [];

// ─── License Keys ────────────────────────────────────────────────────────────

export interface LicenseKey {
  id: string;
  key: string;
  product: string;
  customer: string;
  activations: number;
  limit: number;
  status: "active" | "expired" | "revoked";
  type: "personal" | "professional" | "enterprise" | "white_label";
  expiresAt: string;
}

export const licenseKeys: LicenseKey[] = [];

// ─── Webhooks ────────────────────────────────────────────────────────────────

export interface WebhookEntry {
  id: string;
  event: string;
  url: string;
  status: "delivered" | "failed";
  time: string;
}

export const webhookEvents = [
  "order.created",
  "order.refunded",
  "subscription.created",
  "subscription.cancelled",
  "license.activated",
  "license.revoked",
  "download.completed",
  "affiliate.conversion",
];

export const webhookLog: WebhookEntry[] = [];

// ─── Activity ────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  who: string;
  action: string;
  target: string;
  meta: string;
}

export const activity: Activity[] = [];

// ─── Library ─────────────────────────────────────────────────────────────────

export interface LibraryItem {
  id: string;
  product: string;
  order: string;
  date: string;
  files: ProductFile[];
  licenseKey?: string;
  hasVideo: boolean;
  progress?: number;
  certificate?: boolean;
}

export const libraryItems: LibraryItem[] = [];

export function fileKindLabel(kind: FileKind): string {
  if (kind === "code") return "ZIP";
  if (kind === "doc") return "PDF";
  if (kind === "audio") return "MP3";
  if (kind === "image") return "IMG";
  return "MP4";
}

// ─── Affiliates ───────────────────────────────────────────────────────────────

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  initials: string;
  referrals: number;
  conversions: number;
  revenue: number;
  commission: number;
  pending: number;
  paid: number;
  rate: number;
  status: "active" | "pending" | "suspended";
  joined: string;
}

export const affiliates: Affiliate[] = [];

export const affiliateCommissionSeries: { month: string; paid: number; pending: number }[] = [];

// ─── Courses ──────────────────────────────────────────────────────────────────

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  kind: "video" | "quiz" | "assignment" | "text";
  published: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  status: "live" | "draft";
  students: number;
  completionRate: number;
  rating: number;
  modules: CourseModule[];
}

export const courses: Course[] = [];

// ─── Automation ───────────────────────────────────────────────────────────────

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  status: "active" | "paused" | "draft";
  enrolled: number;
  completed: number;
  revenue: number;
  steps: AutomationStep[];
}

export interface AutomationStep {
  id: string;
  kind: "email" | "wait" | "condition" | "tag" | "webhook";
  label: string;
  meta: string;
}

export const automationFlows: AutomationFlow[] = [];

// ─── Marketplace ──────────────────────────────────────────────────────────────

export interface MarketplaceVendor {
  id: string;
  name: string;
  handle: string;
  initials: string;
  email: string;
  phone: string;
  country: string;
  products: number;
  revenue: number;
  commission: number;
  rating: number;
  status: "active" | "pending" | "suspended" | "blocked";
  joined: string;
  verified: boolean;
  description: string;
}

export const marketplaceVendors: MarketplaceVendor[] = [];

export const marketplaceCategories = [
  { id: "all", label: "Todos los productos", count: 0, emoji: "🛒" },
  { id: "software", label: "Software & SaaS", count: 0, emoji: "💻" },
  { id: "education", label: "Cursos & Educación", count: 0, emoji: "🎓" },
  { id: "resources", label: "Plantillas & Recursos", count: 0, emoji: "🎨" },
  { id: "books", label: "eBooks & Guías", count: 0, emoji: "📚" },
  { id: "services", label: "Servicios", count: 0, emoji: "⚡" },
];

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
  tags: string[];
}

export const marketplaceListings: MarketplaceListing[] = [];

// ─── AI Insights ──────────────────────────────────────────────────────────────

export interface AiInsight {
  id: string;
  kind: "opportunity" | "risk" | "trend";
  title: string;
  body: string;
  action: string;
  impact: "high" | "medium" | "low";
}

export const aiInsights: AiInsight[] = [];

// ─── Analytics extras ─────────────────────────────────────────────────────────

export const geographicData: { country: string; code: string; revenue: number; customers: number; pct: number }[] = [];

export const cohortData: { cohort: string; month0: number; month1: number; month2: number; month3: number; month4: number; month5: number }[] = [];

export const revenueByProduct: { name: string; revenue: number }[] = [];

// ─── Pricing plans ────────────────────────────────────────────────────────────

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfect for solo creators just getting started.",
    highlight: false,
    features: [
      "Up to 5 products",
      "1 GB storage",
      "Basic analytics",
      "Email support",
      "Standard checkout",
      "License key generation",
      "Buyer library",
    ],
    cta: "Start for free",
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "For growing digital entrepreneurs.",
    highlight: false,
    features: [
      "Up to 25 products",
      "50 GB storage",
      "Advanced analytics",
      "Priority support",
      "Order bumps & upsells",
      "Affiliate program",
      "Email automation (5 flows)",
      "Course builder",
      "Custom domain",
    ],
    cta: "Start free trial",
  },
  {
    id: "business",
    name: "Business",
    price: 299,
    description: "Scale your digital business.",
    highlight: true,
    features: [
      "Unlimited products",
      "500 GB storage",
      "Executive analytics",
      "Priority + chat support",
      "Full marketing automation",
      "Unlimited affiliates",
      "AI sales assistant",
      "Multi-vendor marketplace",
      "White-label branding",
      "API access",
      "Webhooks & integrations",
    ],
    cta: "Start free trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    description: "Corporate infrastructure with dedicated support.",
    highlight: false,
    features: [
      "Everything in Business",
      "10 TB+ storage",
      "Dedicated infrastructure",
      "SLA 99.99% uptime",
      "SSO & SAML",
      "RBAC & audit log",
      "Custom AI training",
      "Dedicated success manager",
      "Custom contract & billing",
      "On-premise option",
    ],
    cta: "Contact sales",
  },
];
