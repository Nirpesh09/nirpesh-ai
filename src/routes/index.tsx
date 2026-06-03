import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const REDIRECT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";

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
  useEffect(() => {
    window.location.replace(REDIRECT_URL);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#06070b",
      color: "white",
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 14,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
          marginBottom: 12,
        }}>
          Redirecting
        </div>
        <a href={REDIRECT_URL} style={{
          color: "#22d3ee",
          fontSize: 18,
          textDecoration: "underline",
        }}>
          Continue to Nirpesh →
        </a>
      </div>
    </div>
  );
}
