import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Zap, Check, Eye, EyeOff } from "lucide-react";

interface Props {
  onClose: () => void;
  defaultTab?: "login" | "register";
  onSuccess?: () => void;
}

function GoogleIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function AuthModal({ onClose, defaultTab = "register", onSuccess }: Props) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();

  const getInitials = (name: string) =>
    name.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "US";

  const finishLogin = (name: string, email: string, provider: "email" | "google" | "facebook") => {
    login({ name, email, initials: getInitials(name), provider });
    setDone(true);
    toast.success(tab === "register" ? "¡Cuenta creada! Bienvenido a PULSE AI" : "¡Bienvenido de nuevo!");
    setTimeout(() => { onSuccess?.(); onClose(); }, 1400);
  };

  const handleGoogle = () => {
    setLoading(true);
    // Simulates Google OAuth popup → callback
    setTimeout(() => {
      setLoading(false);
      finishLogin("Usuario Google", "usuario@gmail.com", "google");
    }, 1300);
  };

  const handleSubmit = () => {
    if (tab === "register" && !form.name.trim()) { toast.error("Ingresa tu nombre completo"); return; }
    if (!form.email.trim()) { toast.error("Ingresa tu email"); return; }
    if (form.password.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return; }
    const name = tab === "register" ? form.name : (form.email.split("@")[0] || "Usuario");
    finishLogin(name, form.email, "email");
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-10 shadow-2xl text-center">
          <div className="size-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Check className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">¡Listo!</h2>
          <p className="text-sm text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-primary/20" />

        <div className="p-8">
          <button onClick={onClose} className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-5" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {tab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta gratis"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "login" ? "Ingresa para ver tus compras y descargas." : "Compra y descarga en menos de 2 minutos."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-6 p-1 bg-black/20 rounded-xl border border-border">
            {(["register", "login"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === t ? "bg-surface text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "register" ? "Registrarse" : "Iniciar sesión"}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm mb-4"
          >
            {loading ? (
              <div className="size-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {loading ? "Conectando con Google..." : "Continuar con Google"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative text-center">
              <span className="bg-surface px-3 text-xs text-muted-foreground">o con email</span>
            </div>
          </div>

          <div className="space-y-3">
            {tab === "register" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Nombre completo</Label>
                <Input
                  placeholder="Carlos Rivera"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="bg-black/20 h-11"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="bg-black/20 h-11"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Contraseña</Label>
                {tab === "login" && (
                  <button className="text-[10px] text-primary hover:underline">¿Olvidaste tu contraseña?</button>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder={tab === "register" ? "Mínimo 6 caracteres" : "••••••••"}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="bg-black/20 h-11 pr-10"
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button variant="contrast" className="w-full h-11 font-bold text-base mt-2" onClick={handleSubmit}>
              <Zap className="size-4" />
              {tab === "register" ? "Crear cuenta gratis" : "Iniciar sesión"}
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
            Al continuar aceptas los{" "}
            <a href="#" className="text-primary hover:underline">Términos de servicio</a>
            {" "}y la{" "}
            <a href="#" className="text-primary hover:underline">Política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
