import { createFileRoute } from "@tanstack/react-router";
import Pricing from "@/pages/Pricing";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Nirpesh AI" }] }),
  component: Pricing,
});
