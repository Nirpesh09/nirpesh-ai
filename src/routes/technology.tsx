import { createFileRoute } from "@tanstack/react-router";
import Technology from "@/pages/Technology";

export const Route = createFileRoute("/technology")({
  head: () => ({ meta: [{ title: "Technology — Nirpesh AI" }] }),
  component: Technology,
});
