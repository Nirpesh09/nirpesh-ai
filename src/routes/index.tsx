import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const REPLIT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";
// Persistent flag — set on the very first visit so subsequent visits
// (including new tabs) go straight to the dashboard.
const VISITED_KEY = "nirpesh.visited.v1";

function readVisited(): boolean {
  try {
    return localStorage.getItem(VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

function markVisited() {
  try {
    localStorage.setItem(VISITED_KEY, "1");
  } catch {
    /* ignore */
  }
}

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
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const visited = readVisited();

    if (!visited) {
      // First-ever visit: mark, then send the current tab to the Replit
      // landing. Popups are blocked outside a user gesture, so we navigate
      // the active tab directly — the most reliable path.
      markVisited();
      window.location.replace(REPLIT_URL);
      return;
    }

    // Returning visitor — go straight to the dashboard.
    if (window.location.pathname !== "/dashboard") {
      window.location.replace(`/dashboard${window.location.search || ""}`);
    }
  }, []);

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
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.15)",
            borderTopColor: "#22d3ee",
            margin: "0 auto 18px",
            animation: "nirpesh-spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: 13,
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
          style={{ color: "#22d3ee", fontSize: 16, textDecoration: "underline" }}
        >
          Continue to dashboard →
        </a>
        <style>{`@keyframes nirpesh-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
