import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileCode, FileText, Video, UploadCloud, KeyRound, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateProduct } from "@/lib/db";
import type { FileKind } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/products/new")({
  head: () => ({ meta: [{ title: "Nuevo Producto — PULSE AI" }] }),
  component: NewProduct,
});

interface Asset {
  id: string;
  name: string;
  size: string;
}

const tabs = [
  { key: "code", label: "Código Fuente", icon: FileCode, hint: "ZIP, binarios, plugins — hasta 10 GB" },
  { key: "docs", label: "Documentación", icon: FileText, hint: "Guías PDF, se abren en el navegador del comprador" },
  { key: "video", label: "Módulos de Video", icon: Video, hint: ".mp4 / .mkv — streaming adaptativo HLS" },
] as const;

function DropZone({
  hint,
  assets,
  onAdd,
  onRemove,
}: {
  hint: string;
  assets: Asset[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {assets.map((a) => (
        <div key={a.id} className="flex items-center justify-between p-3 bg-black/20 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-secondary rounded flex items-center justify-center font-mono text-xs">
              {a.name.split(".").pop()?.toUpperCase().slice(0, 3)}
            </div>
            <div>
              <div className="text-xs font-medium">{a.name}</div>
              <div className="text-[10px] text-muted-foreground">{a.size} · Listo para CDN (Cloudflare/Fastly)</div>
            </div>
          </div>
          <button onClick={() => onRemove(a.id)} className="text-muted-foreground hover:text-destructive transition-colors">
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="w-full p-8 border border-dashed border-border rounded-lg text-center hover:border-primary/50 transition-colors flex flex-col items-center gap-2"
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Arrastra archivos o <span className="text-primary">selecciona</span>
        </p>
        <p className="text-[10px] text-muted-foreground/60">{hint}</p>
      </button>
    </div>
  );
}

function NewProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const [streaming, setStreaming] = useState(true);
  const [licensing, setLicensing] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [form, setForm] = useState({ name: "", tagline: "", category: "Software & SaaS", price: 149 });
  const [assets, setAssets] = useState<Record<string, Asset[]>>({
    code: [],
    docs: [],
    video: [],
  });

  const addAsset = (tab: string) => {
    const sample: Record<string, Asset> = {
      code: { id: crypto.randomUUID(), name: "modulo-fuente.zip", size: "640 MB" },
      docs: { id: crypto.randomUUID(), name: "guia-integracion.pdf", size: "8.2 MB" },
      video: { id: crypto.randomUUID(), name: "01-introduccion.mp4", size: "1.1 GB" },
    };
    setAssets((s) => ({ ...s, [tab]: [...s[tab], sample[tab]] }));
    toast.success("Archivo en cola para subir al CDN");
  };

  const removeAsset = (tab: string, id: string) =>
    setAssets((s) => ({ ...s, [tab]: s[tab].filter((a) => a.id !== id) }));

  const save = async (status: "live" | "draft") => {
    if (!form.name.trim()) { toast.error("Ingresa el nombre del producto"); return; }
    const kindMap: Record<string, FileKind> = { code: "code", docs: "doc", video: "video" };
    const files = Object.entries(assets).flatMap(([tab, list]) =>
      list.map((a) => ({ name: a.name, kind: kindMap[tab], size: a.size })),
    );
    try {
      await createProduct.mutateAsync({
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        category: form.category,
        price: Number(form.price) || 0,
        recurring,
        status,
        licensing_enabled: licensing,
        files,
      });
      toast.success(status === "live" ? "Producto publicado 🚀" : "Borrador guardado");
      navigate({ to: "/dashboard/products" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar el producto");
    }
  };

  return (
    <DashboardLayout
      title="Nuevo Producto"
      breadcrumb={["Dashboard", "Productos", "Nuevo"]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast("Borrador guardado")}>Guardar borrador</Button>
          <Button variant="contrast" size="sm" onClick={() => toast.success("Producto publicado 🚀")}>Publicar</Button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Detalles del Producto</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Neural-Kit SDK" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Descripción corta</Label>
              <Textarea id="tagline" rows={2} placeholder="Toolkit de ML de nivel producción con código fuente completo y curso de 6 horas." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <select id="category" className="w-full bg-black/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
                <option>Software & SaaS</option>
                <option>Cursos & Educación</option>
                <option>Plantillas & Recursos</option>
                <option>eBooks & Guías</option>
                <option>Servicios</option>
              </select>
            </div>
          </div>

          {/* Compositor de contenido */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Contenido del Producto</h3>
            <Tabs defaultValue="code">
              <TabsList className="bg-black/20">
                {tabs.map((t) => (
                  <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5">
                    <t.icon className="size-3.5" />
                    {t.label}
                    {assets[t.key === "docs" ? "docs" : t.key].length > 0 && (
                      <span className="ml-1 text-[10px] font-mono text-primary">
                        {assets[t.key === "docs" ? "docs" : t.key].length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((t) => (
                <TabsContent key={t.key} value={t.key} className="mt-6">
                  <DropZone
                    hint={t.hint}
                    assets={assets[t.key === "docs" ? "docs" : t.key]}
                    onAdd={() => addAsset(t.key === "docs" ? "docs" : t.key)}
                    onRemove={(id) => removeAsset(t.key === "docs" ? "docs" : t.key, id)}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Configuración lateral */}
        <div className="space-y-6">
          {/* Precios */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Precio</h3>
            <div className="space-y-2">
              <Label htmlFor="price">Precio (USD)</Label>
              <Input id="price" type="number" defaultValue={149} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Suscripción mensual</div>
                <div className="text-[10px] text-muted-foreground">Cobro recurrente (MRR)</div>
              </div>
              <Switch checked={recurring} onCheckedChange={setRecurring} />
            </div>
          </div>

          {/* Entrega de video */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Entrega de Video</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Streaming adaptativo</div>
                <div className="text-[10px] text-muted-foreground">Reproductor HLS, calidad automática</div>
              </div>
              <Switch checked={streaming} onCheckedChange={setStreaming} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Permitir descarga</div>
                <div className="text-[10px] text-muted-foreground">El comprador puede guardar el archivo</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Marca de agua dinámica</div>
                <div className="text-[10px] text-muted-foreground">Protección DRM con email del comprador</div>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>

          {/* Licenciamiento */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Motor de Licencias</h3>
              </div>
              <Switch checked={licensing} onCheckedChange={setLicensing} />
            </div>
            {licensing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="limit">Límite de activaciones</Label>
                  <Input id="limit" type="number" defaultValue={3} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de licencia</Label>
                  <select className="w-full bg-black/20 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50">
                    <option>Personal (1 dispositivo)</option>
                    <option>Profesional (hasta 5)</option>
                    <option>Empresarial (equipo)</option>
                    <option>White Label (ilimitado)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Formato de clave</Label>
                  <div className="w-full bg-black/30 border border-border rounded-md px-3 py-2 text-sm font-mono text-muted-foreground">
                    PSE-XXXX-XXXX-XXXX
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-primary font-mono">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" /> API de verificación activa
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/dashboard/products" className="text-xs text-muted-foreground hover:text-foreground">
          ← Volver a productos
        </Link>
      </div>
    </DashboardLayout>
  );
}
