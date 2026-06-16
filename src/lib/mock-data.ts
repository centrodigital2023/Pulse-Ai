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

export const affiliates: Affiliate[] = [
  { id: "af1", name: "Daniel Kim", email: "daniel@devblog.io", initials: "DK", referrals: 4820, conversions: 312, revenue: 46488, commission: 9297, pending: 1240, paid: 8057, rate: 20, status: "active", joined: "Jan 15, 2024" },
  { id: "af2", name: "Lucia Torres", email: "lucia@techcast.fm", initials: "LT", referrals: 3100, conversions: 198, revenue: 29502, commission: 4425, pending: 890, paid: 3535, rate: 15, status: "active", joined: "Feb 08, 2024" },
  { id: "af3", name: "James O'Brien", email: "james@codeflow.dev", initials: "JO", referrals: 2240, conversions: 141, revenue: 21009, commission: 4201, pending: 720, paid: 3481, rate: 20, status: "active", joined: "Mar 20, 2024" },
  { id: "af4", name: "Amara Diallo", email: "amara@techinfluence.co", initials: "AD", referrals: 1580, conversions: 88, revenue: 13112, commission: 2622, pending: 0, paid: 2622, rate: 20, status: "active", joined: "Apr 11, 2024" },
  { id: "af5", name: "Robert Nguyen", email: "robert@devtools.io", initials: "RN", referrals: 920, conversions: 41, revenue: 6109, commission: 916, pending: 916, paid: 0, rate: 15, status: "pending", joined: "Jun 01, 2024" },
];

export const affiliateCommissionSeries = [
  { month: "Jan", paid: 2100, pending: 400 },
  { month: "Feb", paid: 3800, pending: 900 },
  { month: "Mar", paid: 5200, pending: 1100 },
  { month: "Apr", paid: 6900, pending: 1400 },
  { month: "May", paid: 8800, pending: 2100 },
  { month: "Jun", paid: 10900, pending: 2770 },
];

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

export const geographicData = [
  { country: "United States", code: "US", revenue: 148200, customers: 412, pct: 36 },
  { country: "United Kingdom", code: "GB", revenue: 62400, customers: 178, pct: 15 },
  { country: "Germany", code: "DE", revenue: 48100, customers: 142, pct: 12 },
  { country: "Japan", code: "JP", revenue: 34800, customers: 98, pct: 8 },
  { country: "Canada", code: "CA", revenue: 29200, customers: 84, pct: 7 },
  { country: "India", code: "IN", revenue: 24100, customers: 76, pct: 6 },
  { country: "Colombia", code: "CO", revenue: 18900, customers: 54, pct: 5 },
  { country: "Other", code: "XX", revenue: 47140, customers: 138, pct: 11 },
];

export const cohortData = [
  { cohort: "Jan 2024", month0: 100, month1: 78, month2: 62, month3: 55, month4: 49, month5: 44 },
  { cohort: "Feb 2024", month0: 100, month1: 82, month2: 68, month3: 61, month4: 55, month5: 50 },
  { cohort: "Mar 2024", month0: 100, month1: 79, month2: 65, month3: 58, month4: 53, month5: 0 },
  { cohort: "Apr 2024", month0: 100, month1: 84, month2: 70, month3: 64, month4: 0, month5: 0 },
  { cohort: "May 2024", month0: 100, month1: 81, month2: 67, month3: 0, month4: 0, month5: 0 },
  { cohort: "Jun 2024", month0: 100, month1: 85, month2: 0, month3: 0, month4: 0, month5: 0 },
];

export const revenueByProduct = [
  { name: "AI Masterclass", revenue: 128400 },
  { name: "Neural-Kit SDK", revenue: 84230 },
  { name: "Design System", revenue: 63800 },
  { name: "Shader Pack", revenue: 41200 },
  { name: "SaaS Starter", revenue: 17400 },
];

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
