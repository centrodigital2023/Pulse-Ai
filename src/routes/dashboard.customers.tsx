import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { useMyCustomers } from "@/lib/db";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/customers")({
  head: () => ({ meta: [{ title: "Clientes — PULSE AI Dashboard" }] }),
  component: Customers,
});

function initialsOf(name: string) {
  return name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "US";
}

function Customers() {
  const { user } = useAuth();
  const { data: customers, isLoading } = useMyCustomers();

  return (
    <DashboardLayout title="Clientes" breadcrumb={["Dashboard", "Clientes"]}>
      {!user ? (
        <div className="rounded-xl bg-surface border border-border p-12 text-center text-sm text-muted-foreground">
          Inicia sesión para ver tus clientes.
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>
      ) : !customers || customers.length === 0 ? (
        <div className="rounded-xl bg-surface border border-border p-12 text-center text-sm text-muted-foreground">
          Aún no tienes clientes registrados. Aparecerán aquí cuando realices ventas.
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Total gastado</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Activaciones</TableHead>
                <TableHead>Última IP</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono">
                        {initialsOf(c.name)}
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
                    {c.last_ip}
                    <div className="text-[10px]">{c.location}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`Reembolso procesado para ${c.name}`)}
                    >
                      Reembolsar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardLayout>
  );
}
