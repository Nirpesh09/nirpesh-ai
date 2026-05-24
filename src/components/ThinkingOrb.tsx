export function ThinkingOrb() {
  return (
    <div className="relative grid place-items-center h-32 w-32 mx-auto">
      {/* pulsing rings */}
      <span className="absolute inset-0 rounded-full bg-gradient-brand opacity-20 animate-ping" />
      <span
        className="absolute inset-2 rounded-full bg-gradient-brand opacity-30 animate-ping"
        style={{ animationDelay: "0.4s" }}
      />
      <span
        className="absolute inset-4 rounded-full bg-gradient-brand opacity-40 animate-ping"
        style={{ animationDelay: "0.8s" }}
      />
      {/* core */}
      <span className="relative grid place-items-center h-20 w-20 rounded-full bg-gradient-brand shadow-glow animate-orb-float">
        <span
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 12px rgba(255,255,255,0.4)" }}
        >
          N
        </span>
      </span>
    </div>
  );
}
