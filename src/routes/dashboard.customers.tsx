import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customers } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/customers")({
  head: () => ({ meta: [{ title: "Customers — PULSE AI Dashboard" }] }),
  component: Customers,
});

function Customers() {
  return (
    <DashboardLayout title="Customers" breadcrumb={["Dashboard", "Customers"]}>
      <div className="rounded-xl bg-surface border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Activations</TableHead>
              <TableHead>Last IP</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono">
                      {c.initials}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">${c.spent}</TableCell>
                <TableCell className="text-sm">{c.products}</TableCell>
                <TableCell className="font-mono text-sm">{c.activations}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {c.lastIp}
                  <div className="text-[10px]">{c.location}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success(`Refund processed for ${c.name}`)}
                  >
                    Refund
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
