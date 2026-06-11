import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Globe, Bell, CreditCard, Key, Palette, Building } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Ajustes — PULSE AI Dashboard" }] }),
  component: Settings,
});

function Settings() {
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
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Métodos de Pago</h3>
            {[
              { name: "Stripe", desc: "Tarjetas internacionales, Apple Pay, Google Pay", connected: true },
              { name: "PayPal", desc: "PayPal, transferencias", connected: true },
              { name: "Mercado Pago", desc: "América Latina — PSE, Nequi, Wompi", connected: false },
              { name: "PayU", desc: "Colombia, México, Perú, Brasil", connected: false },
            ].map((pm) => (
              <div key={pm.name} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-border">
                <div>
                  <div className="text-sm font-medium">{pm.name}</div>
                  <div className="text-[10px] text-muted-foreground">{pm.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono ${pm.connected ? "text-primary" : "text-muted-foreground"}`}>
                    {pm.connected ? "CONECTADO" : "DESCONECTADO"}
                  </span>
                  <Button variant={pm.connected ? "outline" : "contrast"} size="sm" className="h-7 text-[10px]"
                    onClick={() => toast.success(pm.connected ? `${pm.name} desconectado` : `${pm.name} conectado`)}>
                    {pm.connected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Configuración de Pagos</h3>
            {[
              { label: "Facturación automática de suscripciones", desc: "Cobrar automáticamente al vencimiento", checked: true },
              { label: "Reintentar pagos fallidos", desc: "3 intentos con 24h de diferencia", checked: true },
              { label: "Reembolsos automáticos (14 días)", desc: "Política de garantía de devolución", checked: false },
              { label: "Facturas PDF automáticas", desc: "Enviar factura al correo del comprador", checked: true },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                </div>
                <Switch defaultChecked={s.checked} onCheckedChange={(v) => toast.success(v ? `${s.label} activado` : `${s.label} desactivado`)} />
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
