import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Globe, Bell, CreditCard, Key, Palette, Building, DollarSign, Smartphone, Banknote } from "lucide-react";
import { usePaymentSettings, type PayMethod, type DefaultInstallments } from "@/lib/payment-settings";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Ajustes — PULSE AI Dashboard" }] }),
  component: Settings,
});

const PAY_METHODS: { id: PayMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "card", label: "Tarjeta débito / crédito", desc: "Visa, Mastercard, Amex — con soporte de cuotas", icon: <CreditCard className="size-4 text-primary" /> },
  { id: "pse", label: "PSE — Débito bancario", desc: "Todos los bancos colombianos en tiempo real", icon: <Globe className="size-4 text-blue-400" /> },
  { id: "nequi", label: "Nequi", desc: "Notificación push a la app del comprador", icon: <Smartphone className="size-4 text-purple-400" /> },
  { id: "daviplata", label: "Daviplata", desc: "Confirmación por SMS, sin necesidad de app", icon: <Smartphone className="size-4 text-red-400" /> },
  { id: "efecty", label: "Efecty / Baloto / Apostar", desc: "Pago en efectivo — acceso en máx. 2 horas", icon: <Banknote className="size-4 text-yellow-400" /> },
];

function Settings() {
  const { settings, updateSettings, toggleMethod, setDefaultInstallments } = usePaymentSettings();

  return (
    <DashboardLayout
      title="Ajustes de la Plataforma"
      breadcrumb={["Dashboard", "Ajustes"]}
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-surface border border-border">
          {[
            { value: "general", label: "General", icon: Building },
            { value: "branding", label: "Branding", icon: Palette },
            { value: "payments", label: "Pagos", icon: CreditCard },
            { value: "security", label: "Seguridad", icon: Shield },
            { value: "notifications", label: "Notificaciones", icon: Bell },
            { value: "api", label: "API & Dev", icon: Key },
          ].map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-1.5 text-xs">
              <t.icon className="size-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-6">
            <h3 className="text-sm font-semibold">Información de la Cuenta</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: "biz-name", label: "Nombre del Negocio", defaultValue: "DevCraft Studio" },
                { id: "email", label: "Email de Contacto", defaultValue: "admin@devcraft.io" },
                { id: "phone", label: "Teléfono", defaultValue: "+1 (415) 555-0192" },
                { id: "website", label: "Sitio Web", defaultValue: "https://devcraft.io" },
              ].map((f) => (
                <div key={f.id} className="space-y-2">
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input id={f.id} defaultValue={f.defaultValue} className="bg-black/20" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Descripción del Negocio</Label>
              <textarea
                id="bio"
                rows={3}
                defaultValue="Creamos herramientas y recursos para desarrolladores de software profesionales."
                className="w-full bg-black/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>
            <Button variant="contrast" size="sm" onClick={() => toast.success("Cambios guardados")}>
              Guardar cambios
            </Button>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Dominio Personalizado</h3>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="domain">Dominio</Label>
                <Input id="domain" placeholder="tienda.tudominio.com" className="bg-black/20" />
              </div>
              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={() => toast("Verificación de DNS iniciada")}>Verificar</Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Apunta un CNAME a <code className="text-primary font-mono">stores.pulseai.io</code></p>
          </div>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-6">
            <h3 className="text-sm font-semibold">Identidad Visual</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Logo del negocio</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => toast("Selector de archivo (demo)")}>
                  <div className="size-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Palette className="size-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Arrastra o haz clic para subir</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, SVG · Max 2MB</p>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Favicon</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => toast("Selector de archivo (demo)")}>
                  <div className="size-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                    <Globe className="size-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">PNG · 32×32px o 64×64px</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Color primario</Label>
                <div className="flex gap-3">
                  <div className="size-10 rounded-lg bg-primary border border-primary/20 cursor-pointer" />
                  <Input defaultValue="#00D97E" className="bg-black/20 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color de fondo</Label>
                <div className="flex gap-3">
                  <div className="size-10 rounded-lg bg-background border border-border cursor-pointer" />
                  <Input defaultValue="#141416" className="bg-black/20 font-mono" />
                </div>
              </div>
            </div>
            <Button variant="contrast" size="sm" onClick={() => toast.success("Branding actualizado")}>
              Guardar branding
            </Button>
          </div>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6">

          {/* Procesador principal */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Procesador de Pago</h3>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#009EE3] flex items-center justify-center text-white text-xs font-black shrink-0">MP</div>
                <div>
                  <div className="text-sm font-semibold">Mercado Pago</div>
                  <div className="text-[10px] text-muted-foreground">Tarjetas · PSE · Nequi · Daviplata · Efecty · Wallet · QR</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-1 rounded">ACTIVO</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Para activar pagos reales, agrega tu <code className="text-primary font-mono">MERCADOPAGO_ACCESS_TOKEN</code> en las variables de entorno del servidor.
            </p>
          </div>

          {/* Métodos visibles en checkout */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-1">
            <h3 className="text-sm font-semibold mb-1">Métodos Visibles en el Checkout</h3>
            <p className="text-xs text-muted-foreground mb-4">Controla qué métodos de pago pueden elegir tus compradores.</p>
            {PAY_METHODS.map(pm => (
              <div key={pm.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  {pm.icon}
                  <div>
                    <div className="text-sm">{pm.label}</div>
                    <div className="text-[10px] text-muted-foreground">{pm.desc}</div>
                  </div>
                </div>
                <Switch
                  checked={settings.enabledMethods[pm.id]}
                  onCheckedChange={() => {
                    toggleMethod(pm.id as PayMethod);
                    toast.success(`${pm.label} ${settings.enabledMethods[pm.id] ? "desactivado" : "activado"}`);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Cuotas por defecto */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Cuotas por Defecto (Tarjeta)</h3>
            <p className="text-xs text-muted-foreground">Número de cuotas pre-seleccionado cuando el comprador elige tarjeta crédito.</p>
            <div className="grid grid-cols-4 gap-2">
              {([1, 3, 6, 12] as DefaultInstallments[]).map(n => (
                <button
                  key={n}
                  onClick={() => { setDefaultInstallments(n); toast.success(`Cuotas por defecto: ${n === 1 ? "1 pago" : `${n}x`}`); }}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                    settings.defaultInstallments === n
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/20"
                  }`}
                >
                  {n === 1 ? "1 pago" : `${n}x`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Mercado Pago permite hasta <strong>36 cuotas</strong> según el banco y el monto. El máximo enviado a MP siempre es 12.
            </p>
          </div>

          {/* Moneda y divisas */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Moneda y Divisas</h3>
            </div>

            {/* COP principal — siempre fijo */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
              <div>
                <div className="text-sm font-medium">Peso Colombiano — COP</div>
                <div className="text-[10px] text-muted-foreground">Moneda base de todos los precios y cobros. No modificable.</div>
              </div>
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">FIJO</span>
            </div>

            {/* USD equivalente */}
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <div className="text-sm">Mostrar equivalente en USD</div>
                <div className="text-[10px] text-muted-foreground">Muestra el monto en dólares de referencia junto al precio en COP</div>
              </div>
              <Switch
                checked={settings.showUsdEquivalent}
                onCheckedChange={v => { updateSettings({ showUsdEquivalent: v }); toast.success(v ? "Equivalente USD activado" : "Equivalente USD desactivado"); }}
              />
            </div>

            {settings.showUsdEquivalent && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Tasa de cambio — COP por 1 USD (TRM referencial)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={settings.usdRate}
                    onChange={e => updateSettings({ usdRate: Number(e.target.value) })}
                    className="bg-black/20 font-mono w-36"
                    min={1000}
                    max={10000}
                  />
                  <span className="text-sm text-muted-foreground">COP = 1 USD</span>
                  <span className="text-xs text-muted-foreground">≈ ${(1 / settings.usdRate).toFixed(6)} USD por COP</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Actualiza esta tasa según la TRM del día. El cobro real siempre se hace en COP — el USD es solo referencial para el comprador.
                </p>
              </div>
            )}
          </div>

          {/* Opciones adicionales */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Opciones de Facturación</h3>
            {[
              { label: "Facturas PDF automáticas", desc: "Envía la factura al email del comprador tras cada pago", checked: true },
              { label: "Reintentar pagos fallidos", desc: "Hasta 3 intentos automáticos con 24h de diferencia", checked: true },
              { label: "Reembolsos automáticos (7 días)", desc: "Política de garantía — devolución sin intervención manual", checked: false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                </div>
                <Switch defaultChecked={s.checked} onCheckedChange={v => toast.success(v ? `${s.label} activado` : `${s.label} desactivado`)} />
              </div>
            ))}
          </div>

        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Seguridad de la Cuenta</h3>
            {[
              { label: "Autenticación de dos factores (MFA)", desc: "App autenticadora o SMS", checked: true },
              { label: "Verificación de dispositivos nuevos", desc: "Email de confirmación en login desde nuevo dispositivo", checked: true },
              { label: "Alerta de login desde nueva IP", desc: "Notificación por email", checked: true },
              { label: "Sesiones simultáneas múltiples", desc: "Permite múltiples sesiones activas", checked: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                </div>
                <Switch defaultChecked={s.checked} onCheckedChange={() => toast.success("Configuración de seguridad actualizada")} />
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Cambiar Contraseña</h3>
            <div className="space-y-3 max-w-sm">
              <div className="space-y-2">
                <Label>Contraseña actual</Label>
                <Input type="password" placeholder="••••••••" className="bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label>Nueva contraseña</Label>
                <Input type="password" placeholder="••••••••" className="bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label>Confirmar nueva contraseña</Label>
                <Input type="password" placeholder="••••••••" className="bg-black/20" />
              </div>
              <Button variant="contrast" size="sm" onClick={() => toast.success("Contraseña actualizada")}>
                Actualizar contraseña
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Notificaciones por Email</h3>
            {[
              { label: "Nueva venta", desc: "Recibir email cuando se complete un pago", checked: true },
              { label: "Nueva suscripción", desc: "Cuando alguien se suscribe a un plan recurrente", checked: true },
              { label: "Suscripción cancelada", desc: "Cuando un cliente cancela su suscripción", checked: true },
              { label: "Nuevo afiliado", desc: "Cuando alguien se registra como afiliado", checked: false },
              { label: "Churn risk detectado", desc: "Cuando la IA detecta riesgo de abandono", checked: true },
              { label: "Reporte semanal", desc: "Resumen semanal de métricas y actividad", checked: true },
            ].map((n) => (
              <div key={n.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm">{n.label}</div>
                  <div className="text-[10px] text-muted-foreground">{n.desc}</div>
                </div>
                <Switch defaultChecked={n.checked} onCheckedChange={() => toast.success("Notificación actualizada")} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">API Keys</h3>
            <div className="space-y-3">
              {[
                { label: "Production API Key", key: "pse_live_sk_1234567890abcdef", created: "Jan 15, 2024" },
                { label: "Test API Key", key: "pse_test_sk_9876543210fedcba", created: "Jan 15, 2024" },
              ].map((k) => (
                <div key={k.label} className="p-4 rounded-lg bg-black/20 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{k.label}</div>
                    <div className="text-[10px] text-muted-foreground">Creada: {k.created}</div>
                  </div>
                  <div className="flex gap-3">
                    <code className="flex-1 font-mono text-xs text-primary bg-black/40 border border-border px-3 py-2 rounded truncate">
                      {k.key.slice(0, 24)}••••••••••••••••
                    </code>
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(k.key); toast.success("API key copiada"); }}>
                      Copiar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="contrast" size="sm" onClick={() => toast.success("Nueva API key generada")}>
              Generar nueva key
            </Button>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-3">
            <h3 className="text-sm font-semibold">Endpoints de la API</h3>
            <div className="space-y-2">
              {[
                { method: "POST", path: "/v2/license/verify", desc: "Verificar validez de licencia" },
                { method: "GET", path: "/v2/products", desc: "Listar productos" },
                { method: "POST", path: "/v2/orders", desc: "Crear orden manual" },
                { method: "GET", path: "/v2/customers", desc: "Listar clientes" },
                { method: "POST", path: "/v2/webhooks", desc: "Registrar endpoint webhook" },
              ].map((ep) => (
                <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-border font-mono text-xs">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ep.method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-primary/20 text-primary"}`}>
                    {ep.method}
                  </span>
                  <span className="text-muted-foreground">api.pulseai.io</span>
                  <span className="text-foreground">{ep.path}</span>
                  <span className="text-muted-foreground/60 ml-auto text-[10px] hidden md:block">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
