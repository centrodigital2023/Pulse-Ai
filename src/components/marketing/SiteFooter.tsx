import { Logo } from "@/components/Logo";

const columns = [
  { title: "Product", links: ["Licensing", "Checkout", "Webhooks"] },
  { title: "Support", links: ["Docs", "API Reference", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-sm">
          <Logo className="mb-6 block" />
          <p className="text-sm text-muted-foreground">
            Built for the next generation of software entrepreneurs and technical educators.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-widest">{col.title}</div>
              {col.links.map((link) => (
                <div key={link} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
