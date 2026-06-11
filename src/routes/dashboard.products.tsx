import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, FileCode, FileText, Video, Music, Image } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { products, type FileKind } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/products")({
  head: () => ({ meta: [{ title: "Products — PULSE AI Dashboard" }] }),
  component: Products,
});

const kindIcon: Record<FileKind, typeof FileCode> = {
  code: FileCode,
  doc: FileText,
  video: Video,
  audio: Music,
  image: Image,
};

function Products() {
  return (
    <DashboardLayout
      title="Products"
      breadcrumb={["Dashboard", "Products"]}
      actions={
        <Button asChild size="sm" variant="contrast">
          <Link to="/dashboard/products/new">
            <Plus className="size-4" /> New product
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl bg-surface border border-border p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">{p.version}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      p.status === "live" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold tracking-tight">
                  ${p.price}
                  {p.recurring && <span className="text-xs text-muted-foreground font-normal">/mo</span>}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">{p.sales} sales</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {p.files.map((f) => {
                const Icon = kindIcon[f.kind];
                return (
                  <span key={f.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/20 border border-border text-xs text-muted-foreground">
                    <Icon className="size-3.5 text-primary" />
                    {f.name}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-xs font-mono text-muted-foreground">
                Net revenue: <span className="text-foreground">${p.revenue.toLocaleString()}</span>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
