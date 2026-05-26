import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowUp, Trash2, Plus, Terminal, Menu, Settings,
  LogOut, Sparkles, ChevronRight, X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { ModelPicker } from "@/components/ModelPicker";
import { MatrixRain } from "@/components/MatrixRain";
import { loadApps, deleteApp, newId, type SavedApp } from "@/lib/apps";
import { loadModel, saveModel, type ModelId } from "@/lib/models";
import { onAuthChange, signOut, type AuthUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh AI — The Intelligence Behind Tomorrow" },
      { name: "description", content: "Nirpesh AI — where ideas become reality." },
    ],
  }),
  component: Home,
});

const EXAMPLES = [
  "A pomodoro timer with ambient forest sounds and a calm dark theme",
  "A neon arcade snake game with glowing trails and high-score board",
  "A personal finance dashboard with animated charts and budget rings",
  "A glassmorphism weather widget with real-time animated sky backgrounds",
  "A Kanban board with drag-and-drop cards, labels and due dates",
  "A typing speed test with live WPM counter and per-key accuracy heatmap",
  "A movie watchlist tracker with star ratings, genres and a search filter",
  "A minimalist markdown notes app with autosave and export to PDF",
  "A landing page for a premium coffee subscription with cinematic parallax",
  "A retro terminal portfolio page with animated typewriter and command input",
];

function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [apps, setApps] = useState<SavedApp[]>([]);
  const [model, setModel] = useState<ModelId>("nirpesh");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [exampleFading, setExampleFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApps(loadApps());
    setModel(loadModel());
    const { data: { subscription } } = onAuthChange((user) => {
      setAuthUser(user);
      setAuthChecked(true);
    });
    const t = setTimeout(() => setAuthChecked(true), 800);
    return () => { subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  // Close hamburger on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const start = useCallback((seed?: string) => {
    const text = (seed ?? prompt).trim();
    if (!text) return;
    if (!authUser) {
      navigate({ to: "/login", search: { next: "/" } as never });
      return;
    }
    const id = newId();
    navigate({ to: "/app/$id", params: { id }, search: { prompt: text, model } as never });
  }, [prompt, authUser, model, navigate]);

  const cycleExample = () => {
    setExampleFading(true);
    setTimeout(() => {
      const next = (exampleIdx + 1) % EXAMPLES.length;
      setExampleIdx(next);
      setPrompt(EXAMPLES[next]);
      setExampleFading(false);
    }, 150);
  };

  const useExample = (idx: number) => {
    setExampleIdx(idx);
    setPrompt(EXAMPLES[idx]);
  };

  const pickModel = (m: ModelId) => { setModel(m); saveModel(m); };

  const remove = (id: string) => {
    deleteApp(id);
    setApps(loadApps());
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthUser(null);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#000" }}>
      <div className="absolute inset-0 z-0"><MatrixRain /></div>
      <div className="absolute inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.52)" }} />
      <div
        className="absolute inset-x-0 top-0 h-[500px] z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,200,80,0.10) 0%, transparent 70%)" }}
      />

      {/* ── NAV ── */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-6 text-sm" style={{ color: "#4ade80" }}>
            <a href="#apps" className="hover:text-white transition-colors">Your apps</a>
            <a href="#examples" className="hover:text-white transition-colors">Examples</a>
          </nav>
          <UserMenu />

          {/* Hamburger menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`grid place-items-center h-9 w-9 rounded-xl border transition-all ${
                menuOpen
                  ? "bg-[#1a2a1a] border-[#4ade80]/50 text-[#4ade80]"
                  : "border-[#4ade80]/20 text-[#4ade80]/60 hover:border-[#4ade80]/50 hover:text-[#4ade80]"
              }`}
              title="Menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border overflow-hidden shadow-2xl z-50 py-1.5"
                style={{ background: "#0a0f0a", borderColor: "rgba(74,222,128,0.2)", boxShadow: "0 0 40px rgba(0,0,0,0.7), 0 0 20px rgba(0,255,80,0.05)" }}
              >
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#86efac] hover:bg-[#4ade80]/10 hover:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                {authUser ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#86efac] hover:bg-[#4ade80]/10 hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" /> Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-14 pb-24 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs border"
          style={{ background: "rgba(0,255,80,0.07)", borderColor: "rgba(0,255,80,0.25)", color: "#4ade80" }}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span className="font-mono">Nirpesh_AI :: most powerful app builder ♾️</span>
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02] text-white">
          Build any app <br />
          <span style={{ background: "linear-gradient(135deg, #22c55e, #4ade80, #86efac)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            from one prompt.
          </span>
        </h1>
        <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "rgba(134,239,172,0.75)" }}>
          Describe what you want. Nirpesh plans it, writes it, and saves it — forever.
        </p>

        {/* Auth banner */}
        {authChecked && !authUser && (
          <div
            className="mt-6 inline-flex items-center gap-3 rounded-2xl px-4 py-3 border text-sm"
            style={{ background: "rgba(124,58,237,0.12)", borderColor: "rgba(124,58,237,0.35)", color: "rgba(196,181,253,0.9)" }}
          >
            <span>Sign in to start building — it's free</span>
            <Link to="/login" search={{ next: "/" } as never}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              Sign In
            </Link>
          </div>
        )}

        {/* ── PROMPT BOX (enhanced) ── */}
        <div
          className="mt-8 rounded-2xl text-left border transition-all"
          style={{
            background: "rgba(8,18,8,0.82)",
            borderColor: "rgba(74,222,128,0.30)",
            boxShadow: "0 0 0 1px rgba(74,222,128,0.06), 0 8px 32px rgba(0,0,0,0.6), 0 0 60px rgba(0,255,80,0.06)",
            backdropFilter: "blur(16px)",
          }}
          onFocus={() => {}}
        >
          {/* Terminal title bar */}
          <div
            className="flex items-center gap-2 px-4 pt-3 pb-2 border-b"
            style={{ borderColor: "rgba(74,222,128,0.15)" }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs font-mono" style={{ color: "rgba(74,222,128,0.5)" }}>nirpesh ~ prompt</span>
            <div className="ml-auto flex items-center gap-1">
              {/* Examples cycle button */}
              <button
                onClick={cycleExample}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all hover:scale-105"
                style={{
                  background: "rgba(74,222,128,0.08)",
                  borderColor: "rgba(74,222,128,0.25)",
                  color: "#4ade80",
                }}
                title="Cycle through example prompts"
              >
                <Sparkles className="h-3 w-3" />
                <span className="hidden sm:inline">Try example</span>
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); start(); } }}
            rows={3}
            placeholder={authUser
              ? "Describe your app… e.g. A Kanban board with drag-and-drop and neon dark theme"
              : "Sign in to start building — describe your app here…"}
            className="w-full resize-none bg-transparent px-5 pt-4 pb-2 outline-none text-base"
            style={{
              color: "#e2e8f0",
              caretColor: "#4ade80",
              fontFamily: "inherit",
              opacity: exampleFading ? 0 : 1,
              transition: "opacity 0.15s ease",
            }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1 gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ModelPicker value={model} onChange={pickModel} />
              {/* Example count indicator */}
              <span className="text-[10px] font-mono hidden sm:block shrink-0" style={{ color: "rgba(74,222,128,0.45)" }}>
                {exampleIdx + 1}/{EXAMPLES.length}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs hidden sm:block font-mono" style={{ color: "#4ade80", opacity: 0.5 }}>⏎ send</span>
              <button
                onClick={() => start()}
                disabled={!prompt.trim()}
                className="grid place-items-center h-9 w-9 rounded-xl text-black disabled:opacity-30 hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, #22c55e, #4ade80)" }}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* ── EXAMPLE PROMPTS GRID ── */}
        <div id="examples" className="mt-5">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <span className="text-xs font-mono" style={{ color: "rgba(74,222,128,0.5)" }}>10 example prompts — click to use</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLES.map((q, i) => (
              <button
                key={q}
                onClick={() => useExample(i)}
                className="px-3 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105"
                style={{
                  background: exampleIdx === i ? "rgba(74,222,128,0.15)" : "rgba(0,255,80,0.04)",
                  borderColor: exampleIdx === i ? "rgba(74,222,128,0.5)" : "rgba(0,255,80,0.18)",
                  color: exampleIdx === i ? "#4ade80" : "rgba(134,239,172,0.7)",
                  maxWidth: "260px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={q}
              >
                {i + 1}. {q.length > 40 ? q.slice(0, 40) + "…" : q}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── SAVED APPS ── */}
      <section id="apps" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div
          className="rounded-3xl border p-8"
          style={{ background: "rgba(0,5,0,0.82)", borderColor: "rgba(0,255,80,0.15)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Your apps</h2>
              <p className="text-sm mt-1 font-mono" style={{ color: "#4ade80", opacity: 0.7 }}>
                {apps.length === 0 ? "Apps you build show up here." : `${apps.length} saved`}
              </p>
            </div>
            {apps.length > 0 && (
              <button
                onClick={() => { if (!authUser) { navigate({ to: "/login", search: { next: "/" } as never }); return; } document.querySelector("textarea")?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:scale-105"
                style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)", color: "#4ade80" }}
              >
                <Plus className="h-4 w-4" /> New app
              </button>
            )}
          </div>

          {apps.length === 0 ? (
            <button
              onClick={() => { if (!authUser) { navigate({ to: "/login", search: { next: "/" } as never }); return; } document.querySelector("textarea")?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="w-full grid place-items-center aspect-[5/2] rounded-2xl border-2 border-dashed transition-colors"
              style={{ borderColor: "rgba(0,255,80,0.20)", color: "rgba(74,222,128,0.6)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,80,0.50)"; (e.currentTarget as HTMLButtonElement).style.color = "#4ade80"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,80,0.20)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(74,222,128,0.6)"; }}
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-mono">{authUser ? "Start your first app" : "Sign in to build your first app"}</span>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((a) => (
                <div
                  key={a.id}
                  className="group relative rounded-2xl border overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(0,15,0,0.8)", borderColor: "rgba(0,255,80,0.15)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,80,0.40)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px rgba(0,255,80,0.10)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,80,0.15)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <Link to="/app/$id" params={{ id: a.id }} className="block">
                    <div className="aspect-[4/3] bg-white overflow-hidden">
                      <iframe
                        title={a.title}
                        srcDoc={a.html}
                        sandbox=""
                        className="w-full h-full pointer-events-none"
                        style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium truncate text-white">{a.title}</div>
                      <div className="text-xs mt-0.5 font-mono" style={{ color: "#4ade80", opacity: 0.6 }}>
                        {new Date(a.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => remove(a.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.7)", color: "#f87171" }}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
