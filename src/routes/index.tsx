import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const REPLIT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh AI — The Intelligence Behind Tomorrow" },
      { name: "description", content: "Nirpesh AI — where ideas become reality." },
    ],
  }),
  component: RedirectHome,
});

function RedirectHome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Open the Replit landing in a new tab, then send the user straight to the prompt page.
    try {
      window.open(REPLIT_URL, "_blank", "noopener,noreferrer");
    } catch {
      // ignore popup blockers — user can click the manual link below
    }
    navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#06070b",
        color: "white",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            marginBottom: 12,
          }}
        >
          Loading Nirpesh AI…
        </div>
        <a
          href={REPLIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#22d3ee", fontSize: 18, textDecoration: "underline" }}
        >
          Open landing page →
        </a>
      </div>
    </div>
  );
}
