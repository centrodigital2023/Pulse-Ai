import { createFileRoute, redirect } from "@tanstack/react-router";

// The home page is always the high-conversion marketplace for buyers.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/marketplace" });
  },
  component: () => null,
});
