import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

const REPLIT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";
const SESSION_KEY = "nirpesh.landing.shown.v1";
const REDIRECTING_KEY = "nirpesh.root.redirecting.v1";

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignore unavailable sessionStorage; navigation must still continue.
  }
}

function clearSession(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore unavailable sessionStorage.
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

    const alreadyShown = readSession(SESSION_KEY) === "1";
    const redirecting = readSession(REDIRECTING_KEY) === "1";

    const goDashboard = () => {
      if (window.location.pathname === "/dashboard") return;
      window.location.replace(`/dashboard${window.location.search || ""}`);
    };

    if (!alreadyShown && !redirecting) {
      writeSession(SESSION_KEY, "1");
      writeSession(REDIRECTING_KEY, "1");
      try {
        window.open(REPLIT_URL, "_blank", "noopener");
      } catch {
        /* popup blocked — ignore */
      }
    }

    const t = window.setTimeout(() => {
      clearSession(REDIRECTING_KEY);
      goDashboard();
    }, 0);
    return () => window.clearTimeout(t);
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
