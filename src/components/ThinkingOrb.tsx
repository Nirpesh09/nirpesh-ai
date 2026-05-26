export function ThinkingOrb() {
  return (
    <div
      className="relative grid place-items-center h-32 w-32 mx-auto"
      style={{ perspective: "800px" }}
    >
      {/* soft halo */}
      <span className="absolute inset-0 rounded-full bg-gradient-brand opacity-10 blur-2xl" />

      {/* 3D rotating coin with N */}
      <div
        className="relative h-20 w-20"
        style={{
          transformStyle: "preserve-3d",
          animation: "spin3d 2.8s linear infinite",
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-full grid place-items-center shadow-glow"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--brand, 190 90% 50%)), hsl(var(--brand-2, 260 90% 60%)))",
            backfaceVisibility: "hidden",
          }}
        >
          <span
            className="text-4xl font-extrabold text-white"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 2px 16px rgba(255,255,255,0.5)",
            }}
          >
            N
          </span>
        </div>
        {/* Back face */}
        <div
          className="absolute inset-0 rounded-full grid place-items-center shadow-glow"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--brand-2, 260 90% 60%)), hsl(var(--brand, 190 90% 50%)))",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <span
            className="text-4xl font-extrabold text-white"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 2px 16px rgba(255,255,255,0.5)",
            }}
          >
            N
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin3d {
          0%   { transform: rotateY(0deg)   rotateX(8deg); }
          100% { transform: rotateY(360deg) rotateX(8deg); }
        }
      `}</style>
    </div>
  );
}
