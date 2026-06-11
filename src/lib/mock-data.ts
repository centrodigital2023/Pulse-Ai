// Mock data for the Punse AI demo experience.
// Replace with Lovable Cloud queries when the backend is wired up.

export type ProductStatus = "live" | "draft";
export type FileKind = "code" | "doc" | "video";

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
  status: ProductStatus;
  price: number;
  recurring: boolean;
  revenue: number;
  sales: number;
  version: string;
  files: ProductFile[];
}

export const products: Product[] = [
  {
    id: "neural-kit",
    name: "Neural-Kit SDK",
    tagline: "Production-grade ML toolkit with full source and a 6-hour course.",
    status: "live",
    price: 149,
    recurring: false,
    revenue: 84230,
    sales: 565,
    version: "v2.1",
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
    status: "live",
    price: 79,
    recurring: false,
    revenue: 41200,
    sales: 521,
    version: "v3.0",
    files: [
      { id: "f4", name: "shader-pack-pro.zip", kind: "code", size: "640 MB", meta: "Source code · updated 1d ago", downloads: 498 },
      { id: "f5", name: "shader-cookbook.pdf", kind: "doc", size: "12 MB", meta: "Technical documentation", downloads: 377 },
    ],
  },
  {
    id: "saas-starter",
    name: "SaaS Starter Stack",
    tagline: "Full-stack boilerplate sold as a monthly subscription.",
    status: "draft",
    price: 29,
    recurring: true,
    revenue: 17400,
    sales: 318,
    version: "v1.4",
    files: [
      { id: "f6", name: "saas-starter.zip", kind: "code", size: "180 MB", meta: "Source code · draft", downloads: 0 },
    ],
  },
];

export interface Metric {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export const metrics: Metric[] = [
  { label: "NET REVENUE", value: "$142,840.50", delta: "+12.4% from last month", positive: true },
  { label: "CURRENT MRR", value: "$12,400.00", delta: "8 new subscribers today", positive: true },
  { label: "CONVERSION", value: "4.82%", delta: "42.1k page views", positive: true },
  { label: "CHURN", value: "1.9%", delta: "-0.4% from last month", positive: true },
];

export const revenueSeries = [
  { month: "Jan", revenue: 18400, mrr: 7200 },
  { month: "Feb", revenue: 22100, mrr: 8100 },
  { month: "Mar", revenue: 19800, mrr: 8800 },
  { month: "Apr", revenue: 27600, mrr: 9900 },
  { month: "May", revenue: 31200, mrr: 11200 },
  { month: "Jun", revenue: 38900, mrr: 12400 },
];

export const funnel = [
  { stage: "Viewed product", count: 42100, pct: 100 },
  { stage: "Started checkout", count: 4820, pct: 11.4 },
  { stage: "Completed payment", count: 2030, pct: 4.8 },
  { stage: "Downloaded files", count: 1894, pct: 4.5 },
];

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
}

export const customers: Customer[] = [
  { id: "c1", name: "Alex Rivera", email: "alex@rivera.dev", initials: "AR", spent: 377, products: 3, activations: 2, lastIp: "84.12.55.10", location: "San Francisco, US", joined: "May 12, 2024" },
  { id: "c2", name: "Sarah Chen", email: "sarah.chen@gmail.com", initials: "SC", spent: 228, products: 2, activations: 1, lastIp: "51.20.18.4", location: "London, UK", joined: "Apr 28, 2024" },
  { id: "c3", name: "Marcus Jensen", email: "marcus@buildlab.io", initials: "MJ", spent: 596, products: 4, activations: 3, lastIp: "91.66.2.120", location: "Berlin, DE", joined: "Mar 19, 2024" },
  { id: "c4", name: "Priya Nair", email: "priya@nair.codes", initials: "PN", spent: 149, products: 1, activations: 1, lastIp: "103.22.9.77", location: "Bengaluru, IN", joined: "Jun 02, 2024" },
];

export interface LicenseKey {
  id: string;
  key: string;
  product: string;
  customer: string;
  activations: number;
  limit: number;
  status: "active" | "expired" | "revoked";
}

export const licenseKeys: LicenseKey[] = [
  { id: "l1", key: "PNS-7392-LMN-9201-SDK", product: "Neural-Kit SDK", customer: "Alex Rivera", activations: 2, limit: 3, status: "active" },
  { id: "l2", key: "PNS-A92B-44XK-0291-V8XX", product: "Advanced Shader Pack Pro", customer: "Sarah Chen", activations: 1, limit: 3, status: "active" },
  { id: "l3", key: "PNS-5521-QWE-7781-PRO", product: "Neural-Kit SDK", customer: "Marcus Jensen", activations: 3, limit: 3, status: "active" },
  { id: "l4", key: "PNS-0090-ZXC-1120-OLD", product: "SaaS Starter Stack", customer: "Priya Nair", activations: 0, limit: 1, status: "expired" },
];

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
  "download.completed",
];

export const webhookLog: WebhookEntry[] = [
  { id: "w1", event: "order.created", url: "https://api.acme.dev/punse", status: "delivered", time: "2 min ago" },
  { id: "w2", event: "license.activated", url: "https://api.acme.dev/punse", status: "delivered", time: "14 min ago" },
  { id: "w3", event: "subscription.cancelled", url: "https://hooks.zapier.com/x", status: "failed", time: "1 hour ago" },
  { id: "w4", event: "download.completed", url: "https://api.acme.dev/punse", status: "delivered", time: "3 hours ago" },
];

export interface Activity {
  id: string;
  who: string;
  action: string;
  target: string;
  meta: string;
}

export const activity: Activity[] = [
  { id: "a1", who: "Alex Rivera", action: "purchased", target: "Neural-Kit SDK", meta: "2 mins ago · San Francisco, US" },
  { id: "a2", who: "Sarah Chen", action: "downloaded", target: "Shader Pack .zip", meta: "14 mins ago · London, UK" },
  { id: "a3", who: "Marcus Jensen", action: "activated", target: "License Key", meta: "1 hour ago · Berlin, DE" },
  { id: "a4", who: "Priya Nair", action: "subscribed to", target: "SaaS Starter Stack", meta: "3 hours ago · Bengaluru, IN" },
];

// Buyer library mock
export interface LibraryItem {
  id: string;
  product: string;
  order: string;
  date: string;
  files: ProductFile[];
  licenseKey?: string;
  hasVideo: boolean;
}

export const libraryItems: LibraryItem[] = [
  {
    id: "lib1",
    product: "Advanced Shader Pack Pro",
    order: "#49201",
    date: "May 12, 2024",
    licenseKey: "PNS-7392-LMN-9201-SDK",
    hasVideo: true,
    files: products[1].files,
  },
  {
    id: "lib2",
    product: "Neural-Kit SDK",
    order: "#50117",
    date: "Jun 01, 2024",
    licenseKey: "PNS-5521-QWE-7781-PRO",
    hasVideo: true,
    files: products[0].files,
  },
];

export function fileKindLabel(kind: FileKind): string {
  if (kind === "code") return "ZIP";
  if (kind === "doc") return "PDF";
  return "MP4";
}
