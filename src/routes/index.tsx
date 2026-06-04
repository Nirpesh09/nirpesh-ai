import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const REPLIT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";
const SESSION_KEY = "nirpesh.landing.shown.v1";

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
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* sessionStorage unavailable — treat as first visit */
    }

    const goDashboard = () => {
      navigate({ to: "/dashboard", replace: true }).catch(() => {
        window.location.replace("/dashboard");
      });
    };

    if (!alreadyShown) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      try {
        window.open(REPLIT_URL, "_blank", "noopener,noreferrer");
      } catch {
        /* popup blocked — ignore */
      }
    }

    // Always end up on the dashboard.
    const t = setTimeout(goDashboard, 0);
    return () => clearTimeout(t);
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
          href="/dashboard"
          style={{ color: "#22d3ee", fontSize: 18, textDecoration: "underline" }}
        >
          Continue to dashboard →
        </a>
      </div>
    </div>
  );
}
