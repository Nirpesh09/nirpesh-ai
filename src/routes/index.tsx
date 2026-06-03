import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

const REPLIT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh AI — The Intelligence Behind Tomorrow" },
      { name: "description", content: "Nirpesh AI — where ideas become reality." },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
  component: RedirectHome,
});

function RedirectHome() {
  useEffect(() => {
    try {
      window.open(REPLIT_URL, "_blank", "noopener,noreferrer");
    } catch {
      /* popup blocked — ignore */
    }
  }, []);
  return null;
}
