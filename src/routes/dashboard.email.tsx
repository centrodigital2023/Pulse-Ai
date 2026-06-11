import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/email")({
  head: () => ({ meta: [{ title: "Email Flows — Punse AI Dashboard" }] }),
  component: EmailFlows,
});

const flow = [
  { day: "Day 0", title: "Purchase receipt", desc: "Sent instantly with download links and license key." },
  { day: "Day 1", title: "How to read the PDF guide", desc: "Walkthrough of the bundled documentation." },
  { day: "Day 3", title: "Watch the video modules", desc: "Reminder to start the course." },
  { day: "Day 7", title: "Need a hand?", desc: "Offer support + invite to the Discord channel." },
];

function EmailFlows() {
  return (
    <DashboardLayout
      title="Email Flows"
      breadcrumb={["Dashboard", "Email Flows"]}
      actions={<Button variant="contrast" size="sm" onClick={() => toast.success("Flow activated")}>Activate flow</Button>}
    >
      <div className="rounded-xl bg-surface border border-border p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Post-purchase automation</h3>
        </div>
        <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {flow.map((f) => (
            <div key={f.day} className="relative">
              <span className="absolute -left-6 top-1 size-3.5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                <span className="size-1.5 rounded-full bg-primary" />
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase mb-1">
                <Clock className="size-3" /> {f.day}
              </div>
              <div className="text-sm font-medium">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
