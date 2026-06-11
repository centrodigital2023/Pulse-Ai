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
  Settings, Globe, Database, Cpu,
} from "lucide-react";
import { metrics, customers, products, marketplaceVendors, automationFlows } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administración — PULSE AI" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfa, setMfa] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState<"login" | "mfa">("login");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { toast.error("Completa todos los campos"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("mfa");
    }, 1000);
  };

  const handleMfa = () => {
    if (!mfa) { toast.error("Ingresa el código MFA"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthed(true);
      toast.success("Acceso administrativo concedido");
    }, 800);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <Logo className="mx-auto mb-6 block" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono mb-4">
              <Shield className="size-3.5" />
              Acceso Administrativo Restringido
            </div>
            <h1 className="text-xl font-bold">Panel de Administración</h1>
            <p className="text-xs text-muted-foreground mt-1">Acceso protegido — Solo personal autorizado</p>
          </div>

          {step === "login" ? (
            <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
              <div className="space-y-2">
                <Label>Email administrativo</Label>
                <Input
                  type="email"
                  placeholder="admin@pulseai.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/20 pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button variant="contrast" className="w-full" onClick={handleLogin} disabled={loading}>
                <Lock className="size-4" />
                {loading ? "Verificando..." : "Continuar"}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
              <div className="text-center py-2">
                <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Cpu className="size-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Verificación de Dos Factores</p>
                <p className="text-xs text-muted-foreground mt-1">Ingresa el código de tu app autenticadora</p>
              </div>
              <div className="space-y-2">
                <Label>Código MFA (6 dígitos)</Label>
                <Input
                  placeholder="000000"
                  value={mfa}
                  onChange={(e) => setMfa(e.target.value.slice(0, 6))}
                  className="bg-black/20 font-mono text-center text-xl tracking-widest"
                  onKeyDown={(e) => e.key === "Enter" && handleMfa()}
                />
              </div>
              <Button variant="contrast" className="w-full" onClick={handleMfa} disabled={loading}>
                {loading ? "Verificando..." : "Verificar y Acceder"}
              </Button>
              <button onClick={() => setStep("login")} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
                ← Volver
              </button>
            </div>
          )}

          <div className="text-center">
            <Link to="/" className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              Volver al sitio público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin header */}
      <header className="h-14 border-b border-destructive/20 bg-destructive/5 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono">
            <Shield className="size-3" />
            MODO ADMINISTRADOR
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">admin@pulseai.io</span>
          <Button variant="outline" size="sm" onClick={() => setAuthed(false)}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Panel de Administración Global</h1>
          <p className="text-sm text-muted-foreground mt-1">Vista completa de la infraestructura PULSE AI</p>
        </div>

        {/* System health */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: "UPTIME", value: "99.99%", status: "ok" },
            { icon: Cpu, label: "CPU USAGE", value: "24%", status: "ok" },
            { icon: Database, label: "STORAGE", value: "2.4 TB", status: "ok" },
            { icon: Globe, label: "CDN NODES", value: "14 activos", status: "ok" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="size-4 text-muted-foreground" />
                <CheckCircle className="size-4 text-primary" />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mb-1">{s.label}</div>
              <div className="font-bold text-lg">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Platform metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "USUARIOS TOTALES", value: customers.length.toString() + "k+", delta: "+12.4% this month" },
            { icon: DollarSign, label: "GMV TOTAL", value: "$2.4M", delta: "+18.2% this month" },
            { icon: Package, label: "PRODUCTOS", value: products.length.toString(), delta: "En todas las tiendas" },
            { icon: TrendingUp, label: "VENDORS", value: marketplaceVendors.length.toString(), delta: "+2 este mes" },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="size-3.5 text-muted-foreground" />
                <div className="text-[10px] font-mono text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="text-[10px] mt-1 text-primary">{m.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent alerts */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="size-4 text-yellow-400" />
              Alertas del Sistema
            </h2>
            <div className="space-y-3">
              {[
                { type: "warning", msg: "Webhook a hooks.zapier.com/x falló 3 veces en la última hora", time: "1h ago" },
                { type: "info", msg: "Certificado SSL de cdn.pulseai.io renovado automáticamente", time: "4h ago" },
                { type: "ok", msg: "Pago por batch procesado: $38,400 en MRR", time: "6h ago" },
                { type: "info", msg: "Nueva integración: Zapier webhook registrado por DevCraft Studio", time: "8h ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-border">
                  <div className={`size-2 rounded-full mt-1.5 shrink-0 ${a.type === "warning" ? "bg-yellow-400" : a.type === "ok" ? "bg-primary" : "bg-blue-400"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">{a.msg}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
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
              {marketplaceVendors.slice(0, 5).map((v, i) => (
                <div key={v.id} className="flex items-center gap-4">
                  <div className="text-[10px] font-mono text-muted-foreground w-4">{i + 1}</div>
                  <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-mono text-primary">
                    {v.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{v.name}</div>
                    <div className="h-1 rounded-full bg-secondary mt-1 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(v.revenue / 130000) * 100}%` }} />
                    </div>
                  </div>
                  <div className="text-xs font-mono text-right shrink-0">${(v.revenue / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin actions */}
        <div className="rounded-xl bg-surface border border-destructive/20 p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2 text-destructive">
            <Settings className="size-4" />
            Acciones Administrativas
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { label: "Gestionar Usuarios", desc: "Ver, suspender, modificar cuentas", danger: false },
              { label: "Gestionar Pagos", desc: "Rembolsos, disputas, transferencias", danger: false },
              { label: "Configurar Plataforma", desc: "Parámetros globales del sistema", danger: false },
              { label: "Auditoría de Seguridad", desc: "Logs de acceso, intentos fallidos", danger: false },
              { label: "Mantenimiento", desc: "Modo mantenimiento global", danger: true },
              { label: "Exportar Todos los Datos", desc: "Backup completo de la plataforma", danger: false },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => toast(action.danger ? "⚠️ Acción de alto riesgo — requiere confirmación adicional" : `Abriendo: ${action.label}`)}
                className={`p-4 rounded-lg border text-left transition-colors hover:bg-black/10 ${
                  action.danger ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10" : "border-border bg-black/10"
                }`}
              >
                <div className={`text-sm font-medium ${action.danger ? "text-destructive" : ""}`}>{action.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{action.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
