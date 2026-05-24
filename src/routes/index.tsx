import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ArrowUp, Trash2, Plus } from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { loadApps, deleteApp, newId, type SavedApp } from "@/lib/apps";


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

  useEffect(() => { setApps(loadApps()); }, []);

  const start = (seed?: string) => {
    const text = (seed ?? prompt).trim();
    if (!text) return;
    const id = newId();
    navigate({ to: "/app/$id", params: { id }, search: { prompt: text } as never });
  };

  const remove = (id: string) => {
    deleteApp(id);
    setApps(loadApps());
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* background ornaments */}
      <div className="absolute inset-x-0 top-0 h-[720px] bg-hero-glow pointer-events-none" />
      <div className="absolute inset-x-0 top-16 h-[600px] grid-bg pointer-events-none" />

      {/* nav */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#apps" className="hover:text-foreground transition-colors">Your apps</a>
            <a href="#ideas" className="hover:text-foreground transition-colors">Ideas</a>
          </nav>
          <UserMenu />
        </div>
      </header>

      {/* hero */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card/70 backdrop-blur px-3.5 py-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="text-muted-foreground">Nirpesh thinks like a developer</span>
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
          Build any app <br />
          <span className="text-gradient-brand">from one prompt.</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          Describe what you want. Nirpesh plans it, writes it, and saves it here forever.
        </p>

        {/* prompt box */}
        <div className="mt-10 rounded-2xl bg-card shadow-soft border text-left">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); start(); }
            }}
            rows={3}
            placeholder="A cozy todo app with a forest theme…"
            className="w-full resize-none bg-transparent px-5 pt-5 pb-2 outline-none text-base placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <span className="text-xs text-muted-foreground px-2">⏎ to send</span>
            <button
              onClick={() => start()}
              disabled={!prompt.trim()}
              className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-brand text-white disabled:opacity-30 hover:scale-105 transition-transform shadow-glow"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ideas */}
        <div id="ideas" className="mt-6 flex flex-wrap gap-2 justify-center">
          {IDEAS.map((q) => (
            <button
              key={q}
              onClick={() => start(q)}
              className="px-3.5 py-1.5 rounded-full border bg-card/60 backdrop-blur text-sm text-muted-foreground hover:text-foreground hover:border-brand/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </main>

      {/* saved apps */}
      <section id="apps" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your apps</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {apps.length === 0 ? "Apps you build show up here." : `${apps.length} saved`}
            </p>
          </div>
        </div>

        {apps.length === 0 ? (
          <button
            onClick={() => document.querySelector("textarea")?.focus()}
            className="w-full grid place-items-center aspect-[5/2] rounded-2xl border-2 border-dashed text-muted-foreground hover:text-foreground hover:border-brand/40 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Start your first app</span>
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((a) => (
              <div key={a.id} className="group relative rounded-2xl border bg-card shadow-soft overflow-hidden">
                <Link
                  to="/app/$id"
                  params={{ id: a.id }}
                  className="block"
                >
                  <div className="aspect-[4/3] bg-white overflow-hidden">
                    <iframe
                      title={a.title}
                      srcDoc={a.html}
                      sandbox=""
                      className="w-full h-full pointer-events-none origin-top-left scale-[0.5] w-[200%] h-[200%]"
                      style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => remove(a.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
