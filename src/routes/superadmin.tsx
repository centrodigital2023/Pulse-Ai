import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, Eye, EyeOff, Lock, Users, DollarSign, Package,
  TrendingUp, AlertTriangle, CheckCircle, Activity, BarChart3,
  Settings, Globe, Database, Cpu, Search, Filter,
  CheckCheck, Ban, Trash2, ChevronDown, X,
  Mail, Phone, MapPin, Calendar, Star, ExternalLink,
  RefreshCw, User, Wallet, CreditCard, Percent, Bell,
  ToggleLeft, ToggleRight, ArrowUpRight, ArrowDownRight, Zap,
  FileText, Building2,
} from "lucide-react";
import { marketplaceVendors, type MarketplaceVendor } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { useIsAdmin, useAdminUsers, useAdminOrders } from "@/lib/db";
import { useProducts } from "@/lib/products-store";
import { fmtCOP } from "@/lib/user-store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administración — PULSE AI" }] }),
  component: AdminPage,
});

type VendorStatus = "active" | "pending" | "suspended" | "blocked";
type AdminTab = "dashboard" | "vendors" | "products" | "users" | "security" | "finanzas" | "configuracion";

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, onConfirm, onCancel, danger = false }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button
            onClick={onConfirm}
            className={danger ? "bg-destructive hover:bg-destructive/90 text-white" : ""}
            variant={danger ? "destructive" : "contrast"}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Vendor Detail Panel ──────────────────────────────────────────────────────

function VendorPanel({ vendor, onClose, onAction }: {
  vendor: MarketplaceVendor;
  onClose: () => void;
  onAction: (id: string, action: "admit" | "block" | "delete" | "suspend") => void;
}) {
  const statusColor = {
    active: "text-primary bg-primary/10 border-primary/20",
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    suspended: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    blocked: "text-destructive bg-destructive/10 border-destructive/20",
  };

  const statusLabel = {
    active: "Activo", pending: "Pendiente", suspended: "Suspendido", blocked: "Bloqueado",
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg bg-background border-l border-border h-full overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Detalle del Vendedor</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
            {vendor.initials}
          </div>
          <div>
            <div className="font-bold text-lg">{vendor.name}</div>
            <div className="text-sm text-muted-foreground">@{vendor.handle}</div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${statusColor[vendor.status]}`}>
              {statusLabel[vendor.status]}
              {vendor.verified && vendor.status === "active" && <CheckCheck className="size-3" />}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">INGRESOS TOTALES</div>
            <div className="text-xl font-bold">${vendor.revenue.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">COMISIONES</div>
            <div className="text-xl font-bold">${vendor.commission.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">PRODUCTOS</div>
            <div className="text-xl font-bold">{vendor.products}</div>
          </div>
          <div className="p-3 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">VALORACIÓN</div>
            <div className="text-xl font-bold flex items-center gap-1">
              {vendor.rating > 0 ? <><Star className="size-4 fill-yellow-400 text-yellow-400" />{vendor.rating}</> : "—"}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Información de contacto</h3>
          {[
            { icon: Mail, label: vendor.email },
            { icon: Phone, label: vendor.phone },
            { icon: MapPin, label: vendor.country },
            { icon: Calendar, label: `Registrado: ${vendor.joined}` },
          ].map(i => (
            <div key={i.label} className="flex items-center gap-3 text-sm">
              <i.icon className="size-4 text-muted-foreground shrink-0" />
              <span>{i.label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Descripción</h3>
          <p className="text-sm text-muted-foreground">{vendor.description}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold">Acciones administrativas</h3>

          {vendor.status === "pending" && (
            <Button variant="contrast" className="w-full gap-2" onClick={() => { onAction(vendor.id, "admit"); onClose(); }}>
              <CheckCheck className="size-4" /> Aprobar vendedor
            </Button>
          )}

          {vendor.status === "active" && (
            <>
              <Button variant="outline" className="w-full gap-2 text-orange-400 border-orange-400/30 hover:bg-orange-400/10" onClick={() => { onAction(vendor.id, "suspend"); onClose(); }}>
                <RefreshCw className="size-4" /> Suspender temporalmente
              </Button>
              <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { onAction(vendor.id, "block"); onClose(); }}>
                <Ban className="size-4" /> Bloquear cuenta
              </Button>
            </>
          )}

          {(vendor.status === "suspended" || vendor.status === "blocked") && (
            <Button variant="contrast" className="w-full gap-2" onClick={() => { onAction(vendor.id, "admit"); onClose(); }}>
              <CheckCheck className="size-4" /> Reactivar cuenta
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => { onAction(vendor.id, "delete"); onClose(); }}
          >
            <Trash2 className="size-4" /> Eliminar vendedor permanentemente
          </Button>
        </div>

        <div className="text-[10px] text-muted-foreground text-center">
          Todas las acciones quedan registradas en el log de auditoría.
        </div>
      </div>
    </div>
  );
}

// ─── Vendor Row ───────────────────────────────────────────────────────────────

function VendorRow({ vendor, onAction, onSelect }: {
  vendor: MarketplaceVendor;
  onAction: (id: string, action: "admit" | "block" | "delete" | "suspend") => void;
  onSelect: () => void;
}) {
  const statusConfig: Record<VendorStatus, { cls: string; label: string }> = {
    active: { cls: "bg-primary/10 text-primary border-primary/20", label: "Activo" },
    pending: { cls: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20", label: "Pendiente" },
    suspended: { cls: "bg-orange-400/10 text-orange-400 border-orange-400/20", label: "Suspendido" },
    blocked: { cls: "bg-destructive/10 text-destructive border-destructive/20", label: "Bloqueado" },
  };

  const sc = statusConfig[vendor.status];

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 border-b border-border last:border-0 hover:bg-black/5 transition-colors">
      {/* Avatar + name */}
      <button onClick={onSelect} className="flex items-center gap-3 flex-1 min-w-[180px] text-left">
        <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {vendor.initials}
        </div>
        <div>
          <div className="font-medium text-sm flex items-center gap-1.5">
            {vendor.name}
            {vendor.verified && <CheckCheck className="size-3.5 text-primary" />}
            <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
          </div>
          <div className="text-[11px] text-muted-foreground">{vendor.email}</div>
        </div>
      </button>

      {/* Country */}
      <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1 min-w-[100px]">
        <MapPin className="size-3" /> {vendor.country}
      </div>

      {/* Products */}
      <div className="text-xs font-mono min-w-[60px] text-center hidden sm:block">
        <div className="text-foreground font-bold">{vendor.products}</div>
        <div className="text-muted-foreground">productos</div>
      </div>

      {/* Revenue */}
      <div className="text-xs font-mono min-w-[80px] text-center hidden md:block">
        <div className="text-primary font-bold">${vendor.revenue > 0 ? (vendor.revenue / 1000).toFixed(0) + "k" : "—"}</div>
        <div className="text-muted-foreground">ingresos</div>
      </div>

      {/* Rating */}
      <div className="text-xs min-w-[60px] text-center hidden lg:flex items-center gap-1">
        {vendor.rating > 0 ? <><Star className="size-3 fill-yellow-400 text-yellow-400" /><span>{vendor.rating}</span></> : <span className="text-muted-foreground">—</span>}
      </div>

      {/* Status */}
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${sc.cls}`}>{sc.label}</span>

      {/* Joined */}
      <div className="text-[10px] text-muted-foreground hidden xl:block min-w-[70px]">{vendor.joined}</div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto">
        {vendor.status === "pending" && (
          <button
            onClick={() => onAction(vendor.id, "admit")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <CheckCheck className="size-3.5" /> Admitir
          </button>
        )}

        {vendor.status === "active" && (
          <button
            onClick={() => onAction(vendor.id, "block")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-medium hover:bg-orange-400/20 transition-colors"
          >
            <Ban className="size-3.5" /> Bloquear
          </button>
        )}

        {(vendor.status === "suspended" || vendor.status === "blocked") && (
          <button
            onClick={() => onAction(vendor.id, "admit")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <CheckCheck className="size-3.5" /> Reactivar
          </button>
        )}

        <button
          onClick={() => onAction(vendor.id, "delete")}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="size-3.5" />
        </button>

        <button onClick={onSelect} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-surface border border-border text-muted-foreground text-xs hover:text-foreground transition-colors">
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Vendors Tab ──────────────────────────────────────────────────────────────

function VendorsTab() {
  const [vendors, setVendors] = useState(marketplaceVendors);
  const [filterStatus, setFilterStatus] = useState<VendorStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<MarketplaceVendor | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ id: string; action: "admit" | "block" | "delete" | "suspend" } | null>(null);

  const handleAction = (id: string, action: "admit" | "block" | "delete" | "suspend") => {
    if (action === "delete") {
      setConfirmDialog({ id, action });
      return;
    }
    applyAction(id, action);
  };

  const applyAction = (id: string, action: "admit" | "block" | "delete" | "suspend") => {
    if (action === "delete") {
      setVendors(v => v.filter(x => x.id !== id));
      toast.success("Vendedor eliminado permanentemente");
      return;
    }
    const statusMap = { admit: "active" as const, block: "blocked" as const, suspend: "suspended" as const };
    setVendors(v => v.map(x => x.id === id ? { ...x, status: statusMap[action], verified: action === "admit" ? true : x.verified } : x));
    const msgs = { admit: "Vendedor aprobado ✓", block: "Vendedor bloqueado", suspend: "Vendedor suspendido" };
    toast.success(msgs[action]);
  };

  const filtered = vendors.filter(v => {
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !search || v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.country.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: vendors.length,
    active: vendors.filter(v => v.status === "active").length,
    pending: vendors.filter(v => v.status === "pending").length,
    suspended: vendors.filter(v => v.status === "suspended").length,
    blocked: vendors.filter(v => v.status === "blocked").length,
  };

  const filters: { id: VendorStatus | "all"; label: string; color: string }[] = [
    { id: "all", label: "Todos", color: "" },
    { id: "active", label: "Activos", color: "text-primary" },
    { id: "pending", label: "Pendientes", color: "text-yellow-400" },
    { id: "suspended", label: "Suspendidos", color: "text-orange-400" },
    { id: "blocked", label: "Bloqueados", color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      {confirmDialog && (
        <ConfirmDialog
          title="¿Eliminar vendedor?"
          message={`Esta acción no se puede deshacer. El vendedor y todos sus datos serán eliminados permanentemente del sistema.`}
          onConfirm={() => { applyAction(confirmDialog.id, "delete"); setConfirmDialog(null); }}
          onCancel={() => setConfirmDialog(null)}
          danger
        />
      )}

      {selectedVendor && (
        <VendorPanel
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onAction={(id, action) => { handleAction(id, action); setSelectedVendor(null); }}
        />
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: counts.all, cls: "" },
          { label: "Activos", value: counts.active, cls: "text-primary" },
          { label: "Pendientes", value: counts.pending, cls: "text-yellow-400" },
          { label: "Bloqueados", value: counts.blocked + counts.suspended, cls: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label.toUpperCase()}</div>
            <div className={`text-3xl font-extrabold ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {counts.pending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20">
          <AlertTriangle className="size-5 text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium"><strong>{counts.pending}</strong> vendedor{counts.pending > 1 ? "es" : ""} esperando aprobación</p>
            <p className="text-xs text-muted-foreground">Revisa los documentos y aprueba o rechaza su solicitud.</p>
          </div>
          <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10" onClick={() => setFilterStatus("pending")}>
            Ver pendientes
          </Button>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="size-4 text-muted-foreground" />
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterStatus === f.id
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-surface border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="font-mono opacity-60">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendedor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-surface pl-9 w-60"
          />
        </div>
      </div>

      {/* Vendor list */}
      <div className="rounded-xl bg-surface border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-black/10 flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          <span className="flex-1 min-w-[180px]">Vendedor</span>
          <span className="hidden md:block min-w-[100px]">País</span>
          <span className="hidden sm:block min-w-[60px] text-center">Prods.</span>
          <span className="hidden md:block min-w-[80px] text-center">Ingresos</span>
          <span className="hidden lg:block min-w-[60px] text-center">Rating</span>
          <span>Estado</span>
          <span className="hidden xl:block min-w-[70px]">Registro</span>
          <span className="ml-auto">Acciones</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="size-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No se encontraron vendedores</p>
          </div>
        ) : (
          filtered.map(v => (
            <VendorRow
              key={v.id}
              vendor={v}
              onAction={handleAction}
              onSelect={() => setSelectedVendor(v)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab() {
  const { data: users = [] } = useAdminUsers();
  const { data: orders = [] } = useAdminOrders();

  const sellers = users.filter(u => u.isSeller).length;
  const paidOrders = orders.filter(o => o.status === "paid");
  const gmv = paidOrders.reduce((s, o) => s + Number(o.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* System health */}
      <div>
        <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest font-mono">Estado del sistema</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: "UPTIME", value: "99.99%", note: "30 días", ok: true },
            { icon: Cpu, label: "CPU USO", value: "24%", note: "4 núcleos", ok: true },
            { icon: Database, label: "ALMACENAMIENTO", value: "2.4 TB", note: "38% usado", ok: true },
            { icon: Globe, label: "NODOS CDN", value: "14 activos", note: "Cloudflare", ok: true },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl bg-surface border border-border">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="size-4 text-muted-foreground" />
                <CheckCircle className="size-4 text-primary" />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label}</div>
              <div className="font-extrabold text-lg">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform metrics — real data */}
      <div>
        <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest font-mono">Métricas globales</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "USUARIOS REGISTRADOS", value: users.length.toString(), delta: "Cuentas en la plataforma" },
            { icon: DollarSign, label: "GMV (PAGADO)", value: fmtCOP(gmv), delta: `${paidOrders.length} compras pagadas` },
            { icon: Package, label: "ÓRDENES TOTALES", value: orders.length.toString(), delta: `${orders.length - paidOrders.length} pendientes/fallidas` },
            { icon: TrendingUp, label: "VENDEDORES", value: sellers.toString(), delta: "Con rol de creador" },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-xl bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="size-3.5 text-muted-foreground" />
                <div className="text-[10px] font-mono text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-extrabold tracking-tight">{m.value}</div>
              <div className="text-[10px] mt-1 text-primary">{m.delta}</div>
            </div>
          ))}
        </div>
      </div>


      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="size-4 text-yellow-400" />
            Alertas del Sistema
          </h2>
          <div className="space-y-3">
            {[
              { type: "warning", msg: "Webhook a hooks.zapier.com/x falló 3 veces en la última hora", time: "1h" },
              { type: "info", msg: "Certificado SSL renovado automáticamente para cdn.pulseai.io", time: "4h" },
              { type: "ok", msg: "Pago batch procesado: $38,400 en MRR distribuidos a 52 vendors", time: "6h" },
              { type: "warning", msg: "3 solicitudes de vendedores llevan más de 48h sin revisión", time: "12h" },
              { type: "info", msg: "Nuevo vendor registrado: EduTech Latam (Argentina)", time: "14h" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-border">
                <div className={`size-2 rounded-full mt-1.5 shrink-0 ${a.type === "warning" ? "bg-yellow-400" : a.type === "ok" ? "bg-primary" : "bg-blue-400"}`} />
                <div className="flex-1">
                  <p className="text-xs">{a.msg}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">hace {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top vendors */}
        <div className="rounded-xl bg-surface border border-border p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            Top Vendors por Ingresos
          </h2>
          <div className="space-y-3">
            {marketplaceVendors.filter(v => v.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((v, i) => (
              <div key={v.id} className="flex items-center gap-4">
                <div className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</div>
                <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-mono text-primary">
                  {v.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{v.name}</div>
                  <div className="h-1.5 rounded-full bg-secondary mt-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(v.revenue / 130000) * 100}%` }} />
                  </div>
                </div>
                <div className="text-xs font-mono shrink-0">${(v.revenue / 1000).toFixed(0)}k</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin actions */}
      <div className="rounded-xl bg-surface border border-destructive/20 p-6">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-destructive">
          <Settings className="size-4" /> Acciones Administrativas
        </h2>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: "Gestionar Usuarios", desc: "Ver, suspender, modificar cuentas", danger: false },
            { label: "Gestionar Pagos", desc: "Reembolsos, disputas, transferencias", danger: false },
            { label: "Configurar Plataforma", desc: "Parámetros globales del sistema", danger: false },
            { label: "Auditoría de Seguridad", desc: "Logs de acceso, intentos fallidos", danger: false },
            { label: "Modo Mantenimiento", desc: "Desconectar plataforma globalmente", danger: true },
            { label: "Exportar Todos los Datos", desc: "Backup completo de la plataforma", danger: false },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => toast(action.danger ? "⚠️ Acción de alto riesgo — requiere confirmación adicional" : `Abriendo: ${action.label}`)}
              className={`p-4 rounded-xl border text-left transition-colors hover:bg-black/10 ${action.danger ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10" : "border-border bg-black/10"}`}
            >
              <div className={`text-sm font-medium ${action.danger ? "text-destructive" : ""}`}>{action.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab (real platform users) ──────────────────────────────────────────

function UsersTab() {
  const { data: users = [], isLoading } = useAdminUsers();
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();
  const filtered = users.filter(u =>
    !q || (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q)
  );

  const sellerCount = users.filter(u => u.isSeller).length;
  const adminCount = users.filter(u => u.isAdmin).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Usuarios totales", value: users.length, cls: "" },
          { label: "Vendedores", value: sellerCount, cls: "text-primary" },
          { label: "Administradores", value: adminCount, cls: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label.toUpperCase()}</div>
            <div className={`text-3xl font-extrabold ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Buscar usuario por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} className="bg-surface pl-9" />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-muted-foreground animate-pulse">Cargando usuarios…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Users className="size-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{users.length === 0 ? "Aún no hay usuarios registrados" : `Sin resultados para "${search}"`}</p>
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border divide-y divide-border overflow-hidden">
          {filtered.map(u => {
            const initials = (u.name ?? u.email ?? "US").trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-black/5 transition-colors">
                <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 overflow-hidden">
                  {u.avatar_url ? <img src={u.avatar_url} alt="" className="size-full object-cover" /> : initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.name ?? "Sin nombre"}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                </div>
                <div className="hidden md:block text-[10px] text-muted-foreground font-mono">
                  {new Date(u.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                <div className="flex items-center gap-1.5">
                  {u.isAdmin && <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-destructive/10 text-destructive border-destructive/20">ADMIN</span>}
                  {u.isSeller && <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-primary/10 text-primary border-primary/20">VENDEDOR</span>}
                  {!u.isAdmin && !u.isSeller && <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-secondary text-muted-foreground border-border">COMPRADOR</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const logs = [
    { user: "admin@pulseai.io", action: "Aprobó vendedor DevCraft Studio", ip: "192.168.1.1", time: "hace 2h", level: "info" },
    { user: "admin@pulseai.io", action: "Bloqueó vendedor ShadowCode por actividad sospechosa", ip: "192.168.1.1", time: "hace 1 día", level: "warning" },
    { user: "sistema", action: "Intento de login fallido ×5 para admin@pulseai.io", ip: "45.62.88.12", time: "hace 2 días", level: "danger" },
    { user: "admin@pulseai.io", action: "Exportó backup completo de la plataforma", ip: "192.168.1.1", time: "hace 3 días", level: "info" },
    { user: "sistema", action: "Renovación SSL automática cdn.pulseai.io", ip: "—", time: "hace 4 días", level: "ok" },
    { user: "admin@pulseai.io", action: "Eliminó 2 productos de ShadowCode", ip: "192.168.1.1", time: "hace 5 días", level: "warning" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Logins exitosos (7d)", value: "142", ok: true },
          { label: "Intentos fallidos (7d)", value: "23", ok: false },
          { label: "IPs bloqueadas", value: "7", ok: false },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label.toUpperCase()}</div>
            <div className={`text-2xl font-bold ${s.ok ? "text-primary" : "text-destructive"}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-surface border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-black/10 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Log de auditoría
        </div>
        {logs.map((l, i) => (
          <div key={i} className="flex items-start gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-black/5">
            <div className={`size-2 rounded-full mt-2 shrink-0 ${
              l.level === "ok" ? "bg-primary" :
              l.level === "warning" ? "bg-yellow-400" :
              l.level === "danger" ? "bg-destructive animate-pulse" :
              "bg-blue-400"
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs">{l.action}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{l.user} · IP {l.ip}</p>
            </div>
            <div className="text-[10px] text-muted-foreground shrink-0">{l.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Products Tab (real vendor products) ──────────────────────────────────────

function ProductsTab() {
  const { products: vendorProducts, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "live" | "draft">("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = vendorProducts.filter(p => {
    const matchFilter = filter === "all" || p.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const liveCount = vendorProducts.filter(p => p.status === "live").length;
  const draftCount = vendorProducts.filter(p => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {confirmDelete && (
        <ConfirmDialog
          title="¿Eliminar producto?"
          message="Esta acción no se puede deshacer. El producto será eliminado permanentemente del marketplace."
          onConfirm={() => { deleteProduct(confirmDelete); setConfirmDelete(null); toast.success("Producto eliminado permanentemente"); }}
          onCancel={() => setConfirmDelete(null)}
          danger
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: vendorProducts.length, cls: "" },
          { label: "Publicados", value: liveCount, cls: "text-primary" },
          { label: "Borradores", value: draftCount, cls: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-surface border border-border">
            <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label.toUpperCase()}</div>
            <div className={`text-3xl font-extrabold ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {(["all", "live", "draft"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === f ? "bg-primary/10 border-primary/20 text-primary" : "bg-surface border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? `Todos (${vendorProducts.length})` : f === "live" ? `Publicados (${liveCount})` : `Borradores (${draftCount})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto o vendedor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-surface pl-9 w-64"
          />
        </div>
      </div>

      {/* List */}
      {vendorProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <Package className="size-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-semibold mb-2">No hay productos en el marketplace</p>
          <p className="text-sm text-muted-foreground">Los vendedores aún no han subido productos.</p>
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-black/10 flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <span className="flex-1">Producto</span>
            <span className="hidden sm:block min-w-[90px] text-center">Precio</span>
            <span className="hidden md:block min-w-[100px]">Vendedor</span>
            <span className="min-w-[80px] text-center">Estado</span>
            <span className="ml-auto">Acciones</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-black/5 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={p.name} className="size-10 rounded-xl object-cover border border-border shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Package className="size-4 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.category} · {new Date(p.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</div>
                  </div>
                </div>
                <div className="hidden sm:block text-sm font-bold text-primary min-w-[90px] text-center">{fmtCOP(p.price)}</div>
                <div className="hidden md:flex items-center gap-2 min-w-[100px]">
                  <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">{p.vendorInitials}</div>
                  <span className="text-xs text-muted-foreground truncate">{p.vendorName}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border min-w-[80px] text-center ${p.status === "live" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border"}`}>
                  {p.status === "live" ? "✓ Publicado" : "Borrador"}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {p.status === "live" ? (
                    <button
                      onClick={() => { updateProduct(p.id, { status: "draft" }); toast.success("Producto ocultado del marketplace"); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-medium hover:bg-orange-400/20 transition-colors"
                    >
                      <Ban className="size-3.5" /> Bloquear
                    </button>
                  ) : (
                    <button
                      onClick={() => { updateProduct(p.id, { status: "live" }); toast.success("Producto publicado en el marketplace"); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      <CheckCheck className="size-3.5" /> Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmDelete(p.id)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && vendorProducts.length > 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground">Sin resultados para "{search}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Finanzas Tab ─────────────────────────────────────────────────────────────

function FinanzasTab() {
  const totalRevenue = 2400000;
  const mrr = 38400;
  const pendingPayouts = marketplaceVendors.filter(v => v.status === "active" && v.revenue > 0).reduce((s, v) => s + Math.round(v.revenue * 0.85), 0);

  const recentTransactions = [
    { id: "tx001", vendor: "DevCraft Studio", amount: 84230, commission: 8423, status: "paid", date: "2025-06-14", method: "Bancolombia" },
    { id: "tx002", vendor: "NeuralForge", amount: 63800, commission: 6380, status: "paid", date: "2025-06-14", method: "Nequi" },
    { id: "tx003", vendor: "PixelLab Pro", amount: 41200, commission: 4120, status: "pending", date: "2025-06-15", method: "PSE" },
    { id: "tx004", vendor: "SaaS Masters", amount: 17400, commission: 1740, status: "pending", date: "2025-06-15", method: "Daviplata" },
    { id: "tx005", vendor: "EduTech Latam", amount: 128400, commission: 12840, status: "processing", date: "2025-06-13", method: "Bancolombia" },
  ];

  const paymentMethods = [
    { name: "Tarjeta de crédito", pct: 48, color: "bg-primary" },
    { name: "PSE", pct: 22, color: "bg-blue-400" },
    { name: "Nequi", pct: 15, color: "bg-purple-400" },
    { name: "Daviplata", pct: 9, color: "bg-red-400" },
    { name: "Efecty", pct: 6, color: "bg-yellow-400" },
  ];

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "GMV TOTAL", value: `$${(totalRevenue / 1000).toFixed(0)}k`, delta: "+18.2%", up: true, color: "text-primary" },
          { icon: TrendingUp, label: "MRR", value: `$${mrr.toLocaleString()}`, delta: "+12.4%", up: true, color: "text-emerald-400" },
          { icon: Wallet, label: "PAGOS PENDIENTES", value: fmtCOP(pendingPayouts), delta: `${marketplaceVendors.filter(v => v.status === "active").length} vendedores`, up: null, color: "text-yellow-400" },
          { icon: CreditCard, label: "COMISIONES (MES)", value: fmtCOP(mrr * 0.1), delta: "10% promedio", up: null, color: "text-blue-400" },
        ].map(k => (
          <div key={k.label} className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-3">
              <k.icon className={`size-4 ${k.color}`} />
              <div className="text-[10px] font-mono text-muted-foreground">{k.label}</div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight">{k.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {k.up !== null && (k.up
                ? <ArrowUpRight className="size-3 text-emerald-400" />
                : <ArrowDownRight className="size-3 text-destructive" />)}
              <span className={`text-[10px] ${k.up === true ? "text-emerald-400" : k.up === false ? "text-destructive" : "text-muted-foreground"}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment methods breakdown */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="size-4 text-primary" /> Métodos de pago
          </h3>
          <div className="space-y-3">
            {paymentMethods.map(m => (
              <div key={m.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{m.name}</span>
                  <span className="font-bold">{m.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending payouts */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Wallet className="size-4 text-yellow-400" /> Pagos pendientes a vendedores
          </h3>
          <div className="space-y-2">
            {marketplaceVendors.filter(v => v.status === "active" && v.revenue > 0).slice(0, 5).map(v => (
              <div key={v.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">{v.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{v.name}</div>
                  <div className="text-[10px] text-muted-foreground">{v.country}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">{fmtCOP(Math.round(v.revenue * 0.85))}</div>
                  <span className="text-[9px] text-yellow-400 font-bold">⏳ Pendiente</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => toast.success("Iniciando pago masivo a todos los vendedores activos...")}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20 transition-colors"
          >
            <Zap className="size-4" /> Procesar pagos masivos
          </button>
        </div>
      </div>

      {/* Transaction log */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Transacciones recientes
          </h3>
          <button onClick={() => toast("Exportando transacciones a CSV...")} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
            <ArrowUpRight className="size-3" /> Exportar
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentTransactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 transition-colors">
              <div className="text-[10px] font-mono text-muted-foreground w-20 shrink-0">#{tx.id}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tx.vendor}</div>
                <div className="text-[10px] text-muted-foreground">{tx.date} · {tx.method}</div>
              </div>
              <div className="hidden sm:block text-right min-w-[90px]">
                <div className="text-xs font-bold">{fmtCOP(tx.amount)}</div>
                <div className="text-[10px] text-muted-foreground">Comisión: {fmtCOP(tx.commission)}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                tx.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                tx.status === "pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {tx.status === "paid" ? "Pagado" : tx.status === "pending" ? "Pendiente" : "Procesando"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Configuracion Tab ────────────────────────────────────────────────────────

function ConfiguracionTab() {
  const [commissions, setCommissions] = useState({ software: 30, education: 35, books: 40, resources: 25, services: 20 });
  const [features, setFeatures] = useState({
    affiliateProgram: true,
    referralProgram: true,
    flashSales: true,
    aiAssistant: true,
    coursesModule: true,
    multiVendor: true,
    webhooks: false,
    apiAccess: false,
  });
  const [platform, setPlatform] = useState({ siteName: "PULSE AI", supportEmail: "centrodigital2023@gmail.com", minPayout: "50000", withdrawalCycle: "15" });

  const toggleFeature = (key: keyof typeof features) => setFeatures(f => ({ ...f, [key]: !f[key] }));

  return (
    <div className="space-y-8">
      {/* Commission rates */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
          <Percent className="size-4 text-primary" /> Tasas de comisión por categoría
        </h3>
        <p className="text-xs text-muted-foreground mb-5">Estas tasas se aplican al programa de afiliados de la plataforma.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(commissions) as [keyof typeof commissions, number][]).map(([key, val]) => (
            <div key={key} className="bg-background border border-border rounded-xl p-4">
              <div className="text-xs font-bold capitalize mb-3">{key === "books" ? "E-books" : key === "education" ? "Cursos" : key === "software" ? "Software" : key === "resources" ? "Templates" : "Servicios"}</div>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={5} max={50} step={5} value={val}
                  onChange={e => setCommissions(c => ({ ...c, [key]: Number(e.target.value) }))}
                  className="flex-1 accent-primary h-1.5"
                />
                <span className="text-lg font-extrabold text-primary w-12 text-right">{val}%</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => toast.success("Comisiones actualizadas y aplicadas globalmente")} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
          <CheckCircle className="size-4" /> Guardar comisiones
        </button>
      </div>

      {/* Feature flags */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
          <Zap className="size-4 text-primary" /> Funcionalidades del sistema
        </h3>
        <p className="text-xs text-muted-foreground mb-5">Activa o desactiva módulos para todos los usuarios de la plataforma.</p>
        <div className="divide-y divide-border">
          {([
            ["affiliateProgram", "Programa de Afiliados", "Los usuarios pueden unirse y ganar comisiones por ventas referidas"],
            ["referralProgram", "Programa de Referidos", "Usuarios ganan $25.000 COP por cada amigo que realice su primera compra"],
            ["flashSales", "Ventas Flash", "Banner de cuenta regresiva y descuentos urgentes en el marketplace"],
            ["aiAssistant", "Asistente IA", "Chatbot de recomendaciones en el marketplace para compradores"],
            ["coursesModule", "Módulo de Cursos", "Los vendedores pueden crear y vender cursos con progreso y certificados"],
            ["multiVendor", "Multi-Vendor Marketplace", "Múltiples vendedores pueden publicar productos en la plataforma"],
            ["webhooks", "Webhooks externos", "Vendedores pueden configurar webhooks para eventos de ventas y pagos"],
            ["apiAccess", "Acceso API (Beta)", "API REST pública para integraciones de terceros con autenticación JWT"],
          ] as [keyof typeof features, string, string][]).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-[11px] text-muted-foreground">{desc}</div>
              </div>
              <button onClick={() => toggleFeature(key)} className="shrink-0 ml-4">
                {features[key]
                  ? <ToggleRight className="size-8 text-primary" />
                  : <ToggleLeft className="size-8 text-muted-foreground" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Platform settings */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
          <Building2 className="size-4 text-primary" /> Configuración general
        </h3>
        <p className="text-xs text-muted-foreground mb-5">Parámetros operativos de la plataforma.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            ["siteName", "Nombre de la plataforma", "text"],
            ["supportEmail", "Email de soporte", "email"],
            ["minPayout", "Pago mínimo (COP)", "number"],
            ["withdrawalCycle", "Ciclo de pagos (días)", "number"],
          ] as [keyof typeof platform, string, string][]).map(([key, label, type]) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
              <input
                type={type} value={platform[key]}
                onChange={e => setPlatform(p => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button onClick={() => toast.success("Configuración guardada exitosamente")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
            <CheckCircle className="size-4" /> Guardar configuración
          </button>
          <button onClick={() => toast("Enviando email de prueba a " + platform.supportEmail)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">
            <Bell className="size-4" /> Enviar email de prueba
          </button>
        </div>
      </div>

      {/* Notifications config */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-1 flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-4" /> Zona de mantenimiento
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Estas acciones afectan a todos los usuarios de la plataforma en tiempo real.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Modo mantenimiento", desc: "Desconecta el sitio para todos", danger: true },
            { label: "Limpiar caché CDN", desc: "Cloudflare cache purge global", danger: false },
            { label: "Backup completo", desc: "Exportar todos los datos", danger: false },
          ].map(a => (
            <button key={a.label} onClick={() => toast(a.danger ? "⚠️ Requiere confirmación adicional de dos factores" : a.label + " iniciado...")} className={`p-3 rounded-xl border text-left hover:bg-black/10 transition-colors ${a.danger ? "border-destructive/30 bg-destructive/5" : "border-border"}`}>
              <div className={`text-sm font-medium ${a.danger ? "text-destructive" : ""}`}>{a.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

function AdminPage() {
  const { user, signIn, logout } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const pendingCount = marketplaceVendors.filter(v => v.status === "pending").length;

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Completa todos los campos"); return; }
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      toast.error("Credenciales incorrectas o sin permisos de administración");
    }
  };

  // Checking role after login
  if (user && roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">Verificando permisos administrativos...</div>
      </div>
    );
  }

  // Logged in but NOT admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="size-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="size-8 text-destructive" />
          </div>
          <h1 className="text-lg font-bold mb-2">Acceso denegado</h1>
          <p className="text-sm text-muted-foreground mb-6">Tu cuenta <strong>{user.email}</strong> no tiene permisos de superadministrador.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { logout(); }}>Cerrar sesión</Button>
            <Button variant="outline" asChild><Link to="/marketplace">Ir al marketplace</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  // NOT logged in → show login form
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <Logo className="mx-auto mb-6 block" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono mb-4">
              <Shield className="size-3.5" /> Acceso Administrativo Restringido
            </div>
            <h1 className="text-xl font-bold">Panel SuperAdmin</h1>
            <p className="text-xs text-muted-foreground mt-1">Solo personal autorizado · PULSE AI</p>
          </div>

          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
            <div className="space-y-2">
              <Label>Email de administrador</Label>
              <Input type="email" placeholder="admin@pulseai.io" value={email} onChange={e => setEmail(e.target.value)} className="bg-black/20" onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-black/20 pr-10" onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button variant="contrast" className="w-full gap-2" onClick={handleLogin} disabled={loading}>
              <Lock className="size-4" /> {loading ? "Verificando..." : "Ingresar al Panel"}
            </Button>
          </div>

          <div className="text-center">
            <Link to="/marketplace" className="text-xs text-muted-foreground/40 hover:text-muted-foreground">Volver al sitio público</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin Panel (user is logged in and is admin) ──────────────────────────
  const tabs: { id: AdminTab; label: string; icon: typeof Shield; badge?: number }[] = [
    { id: "dashboard", label: "Resumen", icon: BarChart3 },
    { id: "vendors", label: "Vendedores", icon: Users, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: "products", label: "Productos", icon: Package },
    { id: "users", label: "Usuarios", icon: User as unknown as typeof Shield },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "finanzas", label: "Finanzas", icon: Wallet },
    { id: "configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-14 border-b border-destructive/20 bg-destructive/5 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
            <Shield className="size-3" /> MODO ADMINISTRADOR
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono hidden sm:block">{user.email}</span>
          <Button variant="outline" size="sm" onClick={() => { logout(); }}>Cerrar sesión</Button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-border px-6 bg-surface/50">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap relative ${
                activeTab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
              {t.badge && (
                <span className="absolute top-2 right-2 size-4 rounded-full bg-yellow-400 text-black text-[9px] font-bold flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "vendors" && <VendorsTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "finanzas" && <FinanzasTab />}
        {activeTab === "configuracion" && <ConfiguracionTab />}
      </div>
    </div>
  );
}

