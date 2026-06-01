import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LaptopScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const screenGlowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Phase 1: Lid opens from ~70deg (closed tilt) to 0deg (flat open)
      tl.fromTo(
        lidRef.current,
        { rotateX: 70 },
        { rotateX: 0, duration: 0.5, ease: "power2.inOut" }
      );

      // Phase 2: Laptop scales up and lifts to fill more of the screen
      tl.to(
        laptopRef.current,
        { scale: 1.35, y: -60, duration: 0.5, ease: "power2.inOut" },
        "<0.1"
      );

      // Phase 3: Screen brightens and glow intensifies
      tl.to(
        screenGlowRef.current,
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        "<0.2"
      );

      // Label fades out as laptop fills screen
      tl.to(
        labelRef.current,
        { opacity: 0, y: -20, duration: 0.2 },
        "<"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-blue-600/15 rounded-full blur-[60px]" />
      </div>

      {/* Label above laptop */}
      <div
        ref={labelRef}
        className="relative z-20 text-center mb-8 pointer-events-none"
      >
        <p className="text-cyan-400 font-orbitron text-xs font-bold tracking-[0.3em] uppercase mb-2">
          Platform Preview
        </p>
        <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white">
          See It In <span className="text-cyan-400">Action</span>
        </h2>
      </div>

      {/* Laptop wrapper */}
      <div
        ref={laptopRef}
        className="relative z-10 w-[min(820px,90vw)]"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(6deg)",
        }}
      >
        {/* Screen / Lid */}
        <div
          ref={lidRef}
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "bottom center",
            transform: "rotateX(70deg)",
          }}
        >
          {/* Lid outer frame */}
          <div
            className="relative w-full rounded-t-2xl overflow-hidden border-[3px] border-b-0"
            style={{
              borderColor: "#2a2a2a",
              background: "linear-gradient(145deg, #1a1a1a 0%, #111111 100%)",
              boxShadow: "0 -4px 30px rgba(0,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
              aspectRatio: "16/10",
            }}
          >
            {/* Screen bezel */}
            <div className="absolute inset-[8px] rounded-xl overflow-hidden bg-black">
              {/* Camera dot */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-700 z-10" />

              {/* Screen image */}
              <img
                src="/nirpesh-screen.jpg"
                alt="Nirpesh Platform"
                className="w-full h-full"
                style={{ objectFit: "fill" }}
              />

              {/* Screen glow overlay */}
              <div
                ref={screenGlowRef}
                className="absolute inset-0 pointer-events-none opacity-0"
                style={{
                  background: "radial-gradient(ellipse at 50% 30%, rgba(0,255,255,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Reflection sheen */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Apple-style logo on lid back */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border border-cyan-500/20 flex items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="font-orbitron font-black text-cyan-500/40 text-xs">N</span>
            </div>
          </div>
        </div>

        {/* Base / Keyboard */}
        <div
          className="relative w-full"
          style={{
            background: "linear-gradient(180deg, #202020 0%, #161616 100%)",
            borderRadius: "0 0 12px 12px",
            border: "3px solid #2a2a2a",
            borderTop: "none",
            height: "26px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.03) inset",
          }}
        >
          {/* Trackpad */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded"
            style={{
              width: "28%",
              height: "10px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* Base bottom shadow / desk edge */}
        <div
          className="w-[94%] mx-auto rounded-b-full"
          style={{
            height: "8px",
            background: "linear-gradient(180deg, #0d0d0d 0%, transparent 100%)",
            filter: "blur(4px)",
            opacity: 0.9,
          }}
        />

        {/* Cyan neon glow under laptop */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-4 rounded-full"
          style={{
            background: "rgba(0,255,255,0.12)",
            filter: "blur(12px)",
          }}
        />
      </div>
    </section>
  );
}
