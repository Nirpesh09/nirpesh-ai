import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const REDIRECT_URL = "https://nirdesh-max-motion--nirpesh09.replit.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh AI" },
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#06070b",
        color: "white",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.12)",
          borderTopColor: "#a855f7",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
        Redirecting…
      </p>
      <a
        href={REDIRECT_URL}
        style={{ color: "#a855f7", fontSize: 14, textDecoration: "underline", marginTop: 4 }}
      >
        Click here if not redirected
      </a>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
