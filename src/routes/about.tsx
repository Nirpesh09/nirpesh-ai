import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Nirpesh AI" }] }),
  component: About,
});
