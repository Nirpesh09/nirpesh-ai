import { createFileRoute } from "@tanstack/react-router";
import Features from "@/pages/Features";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — Nirpesh AI" }] }),
  component: Features,
});
