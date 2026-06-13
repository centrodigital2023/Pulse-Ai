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

export const products: Product[] = [
  {
    id: "neural-kit",
    name: "Neural-Kit SDK",
    tagline: "Production-grade ML toolkit with full source and a 6-hour course.",
    category: "Software",
    status: "live",
    price: 149,
    recurring: false,
    revenue: 84230,
    sales: 565,
    version: "v2.1",
    rating: 4.9,
    reviews: 142,
    files: [
      { id: "f1", name: "neural-kit-main-latest.zip", kind: "code", size: "2.4 GB", meta: "Source code · updated 2h ago", downloads: 540 },
      { id: "f2", name: "integration-guide.pdf", kind: "doc", size: "8.2 MB", meta: "Technical documentation", downloads: 489 },
      { id: "f3", name: "01-architecture-overview.mp4", kind: "video", size: "1.1 GB", meta: "4K adaptive HLS · 42:15", downloads: 412 },
    ],
  },
  {
    id: "shader-pack",
    name: "Advanced Shader Pack Pro",
    tagline: "120+ GLSL shaders with a deep-dive video series.",
    category: "Resources",
    status: "live",
    price: 79,
    recurring: false,
    revenue: 41200,
    sales: 521,
    version: "v3.0",
    rating: 4.8,
    reviews: 98,
    files: [
      { id: "f4", name: "shader-pack-pro.zip", kind: "code", size: "640 MB", meta: "Source code · updated 1d ago", downloads: 498 },
      { id: "f5", name: "shader-cookbook.pdf", kind: "doc", size: "12 MB", meta: "Technical documentation", downloads: 377 },
    ],
  },
  {
    id: "saas-starter",
    name: "SaaS Starter Stack",
    tagline: "Full-stack boilerplate sold as a monthly subscription.",
    category: "Software",
    status: "draft",
    price: 29,
    recurring: true,
    revenue: 17400,
    sales: 318,
    version: "v1.4",
    rating: 4.7,
    reviews: 64,
    files: [
      { id: "f6", name: "saas-starter.zip", kind: "code", size: "180 MB", meta: "Source code · draft", downloads: 0 },
    ],
  },
  {
    id: "ai-course",
    name: "Complete AI Engineering Masterclass",
    tagline: "40 HD videos, source code, PDF guide, and a professional license.",
    category: "Education",
    status: "live",
    price: 299,
    recurring: false,
    revenue: 128400,
    sales: 429,
    version: "v1.0",
    rating: 5.0,
    reviews: 211,
    files: [
      { id: "f7", name: "ai-engineering-course.zip", kind: "code", size: "380 MB", meta: "40 modules source code", downloads: 401 },
      { id: "f8", name: "ai-handbook.pdf", kind: "doc", size: "24 MB", meta: "480-page comprehensive guide", downloads: 398 },
      { id: "f9", name: "module-01-intro.mp4", kind: "video", size: "2.1 GB", meta: "4K adaptive HLS · 6h 42m total", downloads: 387 },
    ],
  },
  {
    id: "design-system",
    name: "Enterprise Design System",
    tagline: "500+ components, Figma + React, with update membership.",
    category: "Resources",
    status: "live",
    price: 199,
    recurring: true,
    revenue: 63800,
    sales: 320,
    version: "v4.2",
    rating: 4.9,
    reviews: 87,
    files: [
      { id: "f10", name: "design-system-react.zip", kind: "code", size: "95 MB", meta: "React + Storybook", downloads: 311 },
      { id: "f11", name: "design-system-figma.zip", kind: "image", size: "48 MB", meta: "Figma source files", downloads: 298 },
      { id: "f12", name: "design-system-docs.pdf", kind: "doc", size: "18 MB", meta: "Component documentation", downloads: 285 },
    ],
  },
];

// ─── Metrics ────────────────────────────────────────────────────────────────

export interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export const metrics: Metric[] = [
  { label: "INGRESOS NETOS", value: "$412,840.50", delta: "+18.4% vs mes anterior", positive: true },
  { label: "MRR ACTUAL", value: "$38,400.00", delta: "24 nuevos suscriptores hoy", positive: true },
  { label: "CONVERSIÓN", value: "5.62%", delta: "+0.8% vs mes anterior", positive: true },
  { label: "CHURN", value: "1.4%", delta: "-0.5% vs mes anterior", positive: true },
];

export const revenueSeries = [
  { month: "Jan", revenue: 48400, mrr: 18200 },
  { month: "Feb", revenue: 62100, mrr: 22100 },
  { month: "Mar", revenue: 57800, mrr: 25800 },
  { month: "Apr", revenue: 78600, mrr: 29900 },
  { month: "May", revenue: 91200, mrr: 34200 },
  { month: "Jun", revenue: 118900, mrr: 38400 },
];

export const funnel = [
  { stage: "Vio el producto", count: 142100, pct: 100 },
  { stage: "Inició el checkout", count: 18420, pct: 13.0 },
  { stage: "Completó el pago", count: 7988, pct: 5.6 },
  { stage: "Descargó archivos", count: 7640, pct: 5.4 },
];

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

export const customers: Customer[] = [
  { id: "c1", name: "Alex Rivera", email: "alex@rivera.dev", initials: "AR", spent: 927, products: 5, activations: 4, lastIp: "84.12.55.10", location: "San Francisco, US", joined: "May 12, 2024", segment: "vip", ltv: 1840 },
  { id: "c2", name: "Sarah Chen", email: "sarah.chen@gmail.com", initials: "SC", spent: 378, products: 3, activations: 2, lastIp: "51.20.18.4", location: "London, UK", joined: "Apr 28, 2024", segment: "regular", ltv: 720 },
  { id: "c3", name: "Marcus Jensen", email: "marcus@buildlab.io", initials: "MJ", spent: 1296, products: 7, activations: 6, lastIp: "91.66.2.120", location: "Berlin, DE", joined: "Mar 19, 2024", segment: "vip", ltv: 3200 },
  { id: "c4", name: "Priya Nair", email: "priya@nair.codes", initials: "PN", spent: 299, products: 1, activations: 1, lastIp: "103.22.9.77", location: "Bengaluru, IN", joined: "Jun 02, 2024", segment: "regular", ltv: 299 },
  { id: "c5", name: "Carlos Mendez", email: "carlos@mendez.dev", initials: "CM", spent: 149, products: 1, activations: 0, lastIp: "186.40.12.8", location: "Bogotá, CO", joined: "Jun 10, 2024", segment: "at_risk", ltv: 149 },
  { id: "c6", name: "Yuki Tanaka", email: "yuki@tanaka.jp", initials: "YT", spent: 747, products: 4, activations: 3, lastIp: "202.12.88.44", location: "Tokyo, JP", joined: "Feb 14, 2024", segment: "vip", ltv: 2100 },
  { id: "c7", name: "Nina Petrova", email: "nina@petrova.dev", initials: "NP", spent: 228, products: 2, activations: 1, lastIp: "88.201.44.12", location: "Moscow, RU", joined: "May 28, 2024", segment: "regular", ltv: 456 },
  { id: "c8", name: "Omar Hassan", email: "omar@hassan.io", initials: "OH", spent: 598, products: 3, activations: 3, lastIp: "41.88.200.12", location: "Cairo, EG", joined: "Jan 09, 2024", segment: "vip", ltv: 1800 },
];

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

export const licenseKeys: LicenseKey[] = [
  { id: "l1", key: "PSE-7392-LMN-9201-SDK", product: "Neural-Kit SDK", customer: "Alex Rivera", activations: 2, limit: 3, status: "active", type: "professional", expiresAt: "Dec 31, 2025" },
  { id: "l2", key: "PSE-A92B-44XK-0291-V8XX", product: "Advanced Shader Pack Pro", customer: "Sarah Chen", activations: 1, limit: 3, status: "active", type: "personal", expiresAt: "Dec 31, 2025" },
  { id: "l3", key: "PSE-5521-QWE-7781-PRO", product: "Neural-Kit SDK", customer: "Marcus Jensen", activations: 3, limit: 3, status: "active", type: "professional", expiresAt: "Dec 31, 2025" },
  { id: "l4", key: "PSE-0090-ZXC-1120-OLD", product: "SaaS Starter Stack", customer: "Priya Nair", activations: 0, limit: 1, status: "expired", type: "personal", expiresAt: "Jan 01, 2025" },
  { id: "l5", key: "PSE-9912-ENT-4401-BIZ", product: "AI Engineering Masterclass", customer: "Marcus Jensen", activations: 12, limit: 25, status: "active", type: "enterprise", expiresAt: "Dec 31, 2026" },
  { id: "l6", key: "PSE-3312-WHL-8812-LAB", product: "Enterprise Design System", customer: "Yuki Tanaka", activations: 0, limit: 999, status: "active", type: "white_label", expiresAt: "Dec 31, 2027" },
];

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

export const webhookLog: WebhookEntry[] = [
  { id: "w1", event: "order.created", url: "https://api.acme.dev/pulse", status: "delivered", time: "2 min ago" },
  { id: "w2", event: "license.activated", url: "https://api.acme.dev/pulse", status: "delivered", time: "14 min ago" },
  { id: "w3", event: "subscription.cancelled", url: "https://hooks.zapier.com/x", status: "failed", time: "1 hour ago" },
  { id: "w4", event: "download.completed", url: "https://api.acme.dev/pulse", status: "delivered", time: "3 hours ago" },
  { id: "w5", event: "affiliate.conversion", url: "https://api.acme.dev/pulse", status: "delivered", time: "5 hours ago" },
];

// ─── Activity ────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  who: string;
  action: string;
  target: string;
  meta: string;
}

export const activity: Activity[] = [
  { id: "a1", who: "Alex Rivera", action: "compró", target: "AI Engineering Masterclass", meta: "hace 2 min · San Francisco, US · $299" },
  { id: "a2", who: "Sarah Chen", action: "descargó", target: "Shader Pack .zip", meta: "hace 14 min · Londres, UK" },
  { id: "a3", who: "Marcus Jensen", action: "activó", target: "Licencia Enterprise ×12", meta: "hace 1 hora · Berlín, DE" },
  { id: "a4", who: "Priya Nair", action: "se suscribió a", target: "SaaS Starter Stack", meta: "hace 3 horas · Bengaluru, IN · $29/mes" },
  { id: "a5", who: "Yuki Tanaka", action: "renovó", target: "Enterprise Design System", meta: "hace 5 horas · Tokio, JP · $199/mes" },
  { id: "a6", who: "Omar Hassan", action: "compró", target: "Neural-Kit SDK", meta: "hace 6 horas · El Cairo, EG · $149" },
];

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

export const libraryItems: LibraryItem[] = [
  {
    id: "lib1",
    product: "Advanced Shader Pack Pro",
    order: "#49201",
    date: "May 12, 2024",
    licenseKey: "PSE-7392-LMN-9201-SDK",
    hasVideo: true,
    files: products[1].files,
    progress: 65,
  },
  {
    id: "lib2",
    product: "Neural-Kit SDK",
    order: "#50117",
    date: "Jun 01, 2024",
    licenseKey: "PSE-5521-QWE-7781-PRO",
    hasVideo: true,
    files: products[0].files,
    progress: 33,
  },
  {
    id: "lib3",
    product: "Complete AI Engineering Masterclass",
    order: "#51440",
    date: "Jun 09, 2024",
    licenseKey: "PSE-9912-ENT-4401-BIZ",
    hasVideo: true,
    files: products[3].files,
    progress: 12,
    certificate: true,
  },
];

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

export const courses: Course[] = [
  {
    id: "crs1",
    title: "Complete AI Engineering Masterclass",
    subtitle: "From fundamentals to production-ready ML systems",
    status: "live",
    students: 429,
    completionRate: 42,
    rating: 5.0,
    modules: [
      {
        id: "m1", title: "Foundations of AI & ML",
        lessons: [
          { id: "l1", title: "What is Machine Learning?", duration: "18:42", kind: "video", published: true },
          { id: "l2", title: "The AI Landscape in 2024", duration: "24:10", kind: "video", published: true },
          { id: "l3", title: "Setting up your environment", duration: "31:05", kind: "video", published: true },
          { id: "l4", title: "Module 1 Quiz", duration: "10 questions", kind: "quiz", published: true },
        ],
      },
      {
        id: "m2", title: "Neural Networks Deep Dive",
        lessons: [
          { id: "l5", title: "Perceptrons and activation functions", duration: "42:15", kind: "video", published: true },
          { id: "l6", title: "Backpropagation explained", duration: "38:50", kind: "video", published: true },
          { id: "l7", title: "Build your first neural net", duration: "55:30", kind: "video", published: true },
          { id: "l8", title: "Hands-on assignment", duration: "~2 hours", kind: "assignment", published: true },
        ],
      },
      {
        id: "m3", title: "Production Deployment",
        lessons: [
          { id: "l9", title: "Model serving with FastAPI", duration: "44:20", kind: "video", published: false },
          { id: "l10", title: "Containerizing with Docker", duration: "36:15", kind: "video", published: false },
          { id: "l11", title: "Final project", duration: "~4 hours", kind: "assignment", published: false },
        ],
      },
    ],
  },
  {
    id: "crs2",
    title: "Neural-Kit SDK Masterclass",
    subtitle: "Build production ML applications with Neural-Kit",
    status: "live",
    students: 565,
    completionRate: 61,
    rating: 4.9,
    modules: [
      {
        id: "m4", title: "Getting Started",
        lessons: [
          { id: "l12", title: "Architecture overview", duration: "42:15", kind: "video", published: true },
          { id: "l13", title: "Installation & configuration", duration: "22:40", kind: "video", published: true },
        ],
      },
      {
        id: "m5", title: "Advanced Patterns",
        lessons: [
          { id: "l14", title: "Custom pipeline builders", duration: "51:30", kind: "video", published: true },
          { id: "l15", title: "Performance optimization", duration: "47:10", kind: "video", published: true },
        ],
      },
    ],
  },
];

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

export const automationFlows: AutomationFlow[] = [
  {
    id: "fl1",
    name: "Post-Purchase Onboarding",
    trigger: "order.created",
    status: "active",
    enrolled: 1404,
    completed: 892,
    revenue: 0,
    steps: [
      { id: "s1", kind: "email", label: "Welcome & Receipt", meta: "Sent instantly · Open rate 74%" },
      { id: "s2", kind: "wait", label: "Wait 24 hours", meta: "Delay node" },
      { id: "s3", kind: "email", label: "Installation Guide", meta: "Sent Day 1 · Open rate 61%" },
      { id: "s4", kind: "wait", label: "Wait 2 days", meta: "Delay node" },
      { id: "s5", kind: "email", label: "First Milestones Check-in", meta: "Sent Day 3 · Open rate 52%" },
      { id: "s6", kind: "wait", label: "Wait 4 days", meta: "Delay node" },
      { id: "s7", kind: "email", label: "Support & Community Invite", meta: "Sent Day 7 · Open rate 48%" },
    ],
  },
  {
    id: "fl2",
    name: "Upsell to Premium",
    trigger: "course.completed",
    status: "active",
    enrolled: 376,
    completed: 188,
    revenue: 18800,
    steps: [
      { id: "s8", kind: "email", label: "Congratulations + Certificate", meta: "Sent instantly · Open rate 88%" },
      { id: "s9", kind: "wait", label: "Wait 3 days", meta: "Delay node" },
      { id: "s10", kind: "condition", label: "Has purchased Enterprise?", meta: "Branch: yes / no" },
      { id: "s11", kind: "email", label: "Enterprise Upgrade Offer", meta: "30% discount · Sent to 'no' branch" },
      { id: "s12", kind: "wait", label: "Wait 5 days", meta: "Delay node" },
      { id: "s13", kind: "email", label: "Last chance offer", meta: "Discount expires soon" },
    ],
  },
  {
    id: "fl3",
    name: "Churn Recovery",
    trigger: "subscription.at_risk",
    status: "paused",
    enrolled: 89,
    completed: 34,
    revenue: 4250,
    steps: [
      { id: "s14", kind: "email", label: "We noticed you haven't logged in", meta: "Sent Day 0" },
      { id: "s15", kind: "wait", label: "Wait 3 days", meta: "Delay node" },
      { id: "s16", kind: "email", label: "What can we improve?", meta: "Survey email" },
      { id: "s17", kind: "wait", label: "Wait 5 days", meta: "Delay node" },
      { id: "s18", kind: "email", label: "Special renewal offer", meta: "20% off next 3 months" },
    ],
  },
  {
    id: "fl4",
    name: "Affiliate Welcome",
    trigger: "affiliate.approved",
    status: "draft",
    enrolled: 0,
    completed: 0,
    revenue: 0,
    steps: [
      { id: "s19", kind: "email", label: "Welcome to the partner program", meta: "Draft" },
      { id: "s20", kind: "email", label: "Promo kit & resources", meta: "Draft" },
    ],
  },
];

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

export const marketplaceVendors: MarketplaceVendor[] = [
  { id: "v1", name: "DevCraft Studio", handle: "devcraft", initials: "DC", email: "hola@devcraft.io", phone: "+57 310 222 3344", country: "Colombia", products: 12, revenue: 128400, commission: 12840, rating: 4.9, status: "active", joined: "Ene 2024", verified: true, description: "Herramientas de desarrollo y SDKs de alta calidad para ingenieros de software." },
  { id: "v2", name: "Neural Works", handle: "neuralworks", initials: "NW", email: "info@neuralworks.ai", phone: "+1 415 900 1200", country: "Estados Unidos", products: 8, revenue: 94200, commission: 9420, rating: 4.8, status: "active", joined: "Feb 2024", verified: true, description: "Cursos y recursos de IA para profesionales y empresas." },
  { id: "v3", name: "Pixel Factory", handle: "pixelfactory", initials: "PF", email: "studio@pixelfactory.co", phone: "+34 612 800 900", country: "España", products: 24, revenue: 71600, commission: 7160, rating: 4.7, status: "active", joined: "Ene 2024", verified: true, description: "Recursos de diseño gráfico, shaders y assets visuales premium." },
  { id: "v4", name: "Code Atelier", handle: "codeatelier", initials: "CA", email: "hello@codeatelier.fr", phone: "+33 6 80 12 34 56", country: "Francia", products: 5, revenue: 42800, commission: 4280, rating: 4.9, status: "active", joined: "Mar 2024", verified: true, description: "Masterclasses de arquitectura y DevOps para equipos técnicos." },
  { id: "v5", name: "Design Foundry", handle: "designfoundry", initials: "DF", email: "team@designfoundry.io", phone: "+44 20 7946 0958", country: "Reino Unido", products: 3, revenue: 18900, commission: 1890, rating: 4.6, status: "active", joined: "Mar 2024", verified: true, description: "Sistemas de diseño y componentes UI para equipos empresariales." },
  { id: "v6", name: "TechForge Labs", handle: "techforge", initials: "TF", email: "carlos@techforge.co", phone: "+57 320 444 5566", country: "Colombia", products: 0, revenue: 0, commission: 0, rating: 0, status: "pending", joined: "Jun 2024", verified: false, description: "Plantillas y boilerplates para startups tecnológicas latinoamericanas." },
  { id: "v7", name: "DataViz Pro", handle: "datavizpro", initials: "DV", email: "ana@datavizpro.mx", phone: "+52 55 1234 5678", country: "México", products: 0, revenue: 0, commission: 0, rating: 0, status: "pending", joined: "Jun 2024", verified: false, description: "Dashboards y visualizaciones de datos interactivos para negocios." },
  { id: "v8", name: "EduTech Latam", handle: "edutechlatam", initials: "EL", email: "info@edutechlatam.com", phone: "+54 11 4444 5555", country: "Argentina", products: 0, revenue: 0, commission: 0, rating: 0, status: "pending", joined: "Jun 2024", verified: false, description: "Cursos en español de programación, diseño y negocios digitales." },
  { id: "v9", name: "ShadowCode", handle: "shadowcode", initials: "SC", email: "admin@shadowcode.dev", phone: "+1 202 555 0000", country: "Estados Unidos", products: 2, revenue: 8400, commission: 840, rating: 2.1, status: "blocked", joined: "May 2024", verified: false, description: "Herramientas de automatización." },
];

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

export const aiInsights: AiInsight[] = [
  { id: "i1", kind: "opportunity", title: "Cross-sell opportunity detected", body: "142 customers who purchased Neural-Kit SDK have not yet enrolled in the AI Masterclass. These buyers share a 78% behavioral similarity with masterclass converters.", action: "Launch targeted campaign", impact: "high" },
  { id: "i2", kind: "risk", title: "Churn risk: 23 subscribers", body: "23 monthly subscribers show login inactivity over 21 days and declining download frequency — matching your historical churn profile with 84% accuracy.", action: "Activate churn recovery flow", impact: "high" },
  { id: "i3", kind: "trend", title: "Enterprise license demand rising", body: "Enterprise tier inquiries increased 340% this month. Top 3 inbound companies: fintech (41%), health-tech (28%), edtech (18%).", action: "Review enterprise pricing", impact: "medium" },
  { id: "i4", kind: "opportunity", title: "Affiliate program under-utilized", body: "Your current affiliate network generates 18% of new MRR. Industry benchmark for similar products is 35%. Increasing commissions from 15% → 20% could unlock $12k/mo additional revenue.", action: "Update affiliate rates", impact: "medium" },
];

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
