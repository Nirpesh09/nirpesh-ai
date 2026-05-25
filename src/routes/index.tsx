import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowUp, Trash2, Plus, Terminal } from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { ModelPicker } from "@/components/ModelPicker";
import { MatrixRain } from "@/components/MatrixRain";
import { loadApps, deleteApp, newId, type SavedApp } from "@/lib/apps";
import { loadModel, saveModel, type ModelId } from "@/lib/models";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh — AI that builds apps from a prompt" },
      { name: "description", content: "Describe an app. Nirpesh thinks, builds, and saves it for you." },
    ],
  }),
  component: Home,
});

const IDEAS = [
  "A pomodoro timer with ambient sounds",
  "A landing page for a coffee subscription",
  "A neon arcade snake game",
  "A personal finance dashboard",
  "A glassmorphism weather widget",
  "A recipe card generator",
];

function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [apps, setApps] = useState<SavedApp[]>([]);
  const [model, setModel] = useState<ModelId>("nirpesh");

  useEffect(() => { setApps(loadApps()); setModel(loadModel()); }, []);

  const start = (seed?: string) => {
    const text = (seed ?? prompt).trim();
    if (!text) return;
    saveModel(model);
    const id = newId();
    navigate({ to: "/app/$id", params: { id }, search: { prompt: text } as never });
  };

  const pickModel = (m: ModelId) => { setModel(m); saveModel(m); };

  const remove = (id: string) => {
    deleteApp(id);
    setApps(loadApps());
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#000" }}>
      {/* Matrix rain full background */}
      <div className="absolute inset-0 z-0">
        <MatrixRain />
      </div>

      {/* Dark overlay so content is readable */}
      <div className="absolute inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.55)" }} />

      {/* Subtle green gradient glow at top */}
      <div
        className="absolute inset-x-0 top-0 h-[500px] z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,200,80,0.10) 0%, transparent 70%)",
        }}
      />

      {/* nav */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6 text-sm" style={{ color: "#4ade80" }}>
            <a href="#apps" className="hover:text-white transition-colors">Your apps</a>
            <a href="#ideas" className="hover:text-white transition-colors">Ideas</a>
          </nav>
          <UserMenu />
        </div>
      </header>

      {/* hero */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 text-center">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs border"
          style={{
            background: "rgba(0,255,80,0.07)",
            borderColor: "rgba(0,255,80,0.25)",
            color: "#4ade80",
          }}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span className="font-mono">Nirpesh_AI :: thinking like a developer</span>
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02] text-white">
          Build any app <br />
          <span
            style={{
              background: "linear-gradient(135deg, #22c55e, #4ade80, #86efac)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            from one prompt.
          </span>
        </h1>
        <p className="mt-5 text-lg max-w-xl mx-auto" style={{ color: "rgba(134,239,172,0.75)" }}>
          Describe what you want. Nirpesh plans it, writes it, and saves it here forever.
        </p>

        {/* prompt box */}
        <div
          className="mt-10 rounded-2xl text-left border"
          style={{
            background: "rgba(0,10,0,0.75)",
            borderColor: "rgba(0,255,80,0.25)",
            boxShadow: "0 0 40px rgba(0,255,80,0.08), 0 0 80px rgba(0,255,80,0.04)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 pt-3 pb-1 border-b text-xs font-mono"
            style={{ borderColor: "rgba(0,255,80,0.15)", color: "#4ade80" }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 opacity-70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 opacity-70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 opacity-70" />
            <span className="ml-2 opacity-50">nirpesh@ai ~ prompt</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); start(); }
            }}
            rows={3}
            placeholder="A cozy todo app with a forest theme…"
            className="w-full resize-none bg-transparent px-5 pt-4 pb-2 outline-none text-base font-mono"
            style={{ color: "#86efac", caretColor: "#4ade80" }}
          />
          <div className="flex items-center justify-between px-3 pb-3 gap-2">
            <ModelPicker value={model} onChange={pickModel} />
            <div className="flex items-center gap-2">
              <span className="text-xs hidden sm:block font-mono" style={{ color: "#4ade80", opacity: 0.6 }}>
                ⏎ to send
              </span>
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

        {/* ideas */}
        <div id="ideas" className="mt-6 flex flex-wrap gap-2 justify-center">
          {IDEAS.map((q) => (
            <button
              key={q}
              onClick={() => start(q)}
              className="px-3.5 py-1.5 rounded-full border text-sm font-mono transition-all hover:scale-105"
              style={{
                background: "rgba(0,255,80,0.05)",
                borderColor: "rgba(0,255,80,0.20)",
                color: "rgba(134,239,172,0.85)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,80,0.12)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,80,0.5)";
                (e.currentTarget as HTMLButtonElement).style.color = "#86efac";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,80,0.05)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,80,0.20)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(134,239,172,0.85)";
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </main>

      {/* saved apps */}
      <section
        id="apps"
        className="relative z-10 mx-auto max-w-6xl px-6 pb-24"
      >
        <div
          className="rounded-3xl border p-8"
          style={{
            background: "rgba(0,5,0,0.80)",
            borderColor: "rgba(0,255,80,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Your apps</h2>
              <p className="text-sm mt-1 font-mono" style={{ color: "#4ade80", opacity: 0.7 }}>
                {apps.length === 0 ? "Apps you build show up here." : `${apps.length} saved`}
              </p>
            </div>
          </div>

          {apps.length === 0 ? (
            <button
              onClick={() => document.querySelector("textarea")?.focus()}
              className="w-full grid place-items-center aspect-[5/2] rounded-2xl border-2 border-dashed transition-colors"
              style={{ borderColor: "rgba(0,255,80,0.20)", color: "rgba(74,222,128,0.6)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,80,0.50)";
                (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,255,80,0.20)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(74,222,128,0.6)";
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-6 w-6" />
                <span className="text-sm font-mono">Start your first app</span>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((a) => (
                <div
                  key={a.id}
                  className="group relative rounded-2xl border overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(0,15,0,0.8)", borderColor: "rgba(0,255,80,0.15)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,80,0.40)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px rgba(0,255,80,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,255,80,0.15)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
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
