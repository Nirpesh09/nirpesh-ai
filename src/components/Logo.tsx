import { Link } from "@tanstack/react-router";

export function Logo({ className = "", loading = false }: { className?: string; loading?: boolean }) {
  return (
    <Link to="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <span className="relative grid place-items-center h-8 w-8 rounded-xl bg-gradient-brand shadow-glow overflow-visible">
        {loading && (
          <>
            <span className="absolute inset-0 rounded-xl bg-gradient-brand opacity-60 animate-ping" />
            <span
              className="absolute inset-0 rounded-xl bg-gradient-brand opacity-40 animate-ping"
              style={{ animationDelay: "0.3s" }}
            />
          </>
        )}
        <span
          className={`relative text-base font-bold text-white select-none z-10 ${loading ? "animate-pulse" : ""}`}
          style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 8px rgba(255,255,255,0.5)" }}
        >
          N
        </span>
      </span>
      <span className="text-lg font-semibold tracking-tight">Nirpesh</span>
    </Link>
  );
}
