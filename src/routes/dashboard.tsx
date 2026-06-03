import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { ArrowUp, Trash2, Layers, Smartphone, LayoutTemplate, MoreHorizontal, RefreshCw, Globe, ClipboardList, Rocket, ExternalLink, Menu, Bot, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { ModelPicker } from "@/components/ModelPicker";
import { MatrixRain } from "@/components/MatrixRain";
import { AuthModal } from "@/components/AuthModal";
import { SideMenu } from "@/components/SideMenu";
import { DeployConfirmModal } from "@/components/DeployConfirmModal";
import { loadApps, deleteApp, newId, deployApp, openLive, type SavedApp } from "@/lib/apps";
import { loadModel, saveModel, type ModelId } from "@/lib/models";
import { onAuthChange, type AuthUser } from "@/lib/auth";
import { ensurePremiumForEmail } from "@/lib/premium";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Nirpesh — Where ideas become reality" },
      { name: "description", content: "Build fully functional apps and websites through simple conversations." },
    ],
  }),
  component: Home,
});

type AppKind = "fullstack" | "mobile" | "landing";

const TABS: { id: AppKind; label: string; icon: typeof Layers; placeholder: string }[] = [
  { id: "fullstack", label: "Full Stack App", icon: Layers, placeholder: "Build me a CRM system with…" },
  { id: "mobile", label: "Mobile App", icon: Smartphone, placeholder: "Build me a fitness tracker app with…" },
  { id: "landing", label: "Landing Page", icon: LayoutTemplate, placeholder: "Design a launch page for…" },
];

const QUICK = ["Wingman", "My Counter Part", "Bill Generator", "Word of the Day"];

function Home() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [tab, setTab] = useState<AppKind>("fullstack");
  const [apps, setApps] = useState<SavedApp[]>([]);
  const [model, setModel] = useState<ModelId>("nirpesh");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [view, setView] = useState<"recent" | "deployed">("recent");
  const [menuOpen, setMenuOpen] = useState(false);
  const [deployConfirm, setDeployConfirm] = useState<SavedApp | null>(null);

  useEffect(() => {
    setApps(loadApps());
    setModel(loadModel());
    const { data: { subscription } } = onAuthChange((u) => {
      setAuthUser(u);
      ensurePremiumForEmail(u?.email);
    });
    return () => subscription.unsubscribe();
  }, []);

  const doNavigate = useCallback((text: string, forceModel?: ModelId) => {
    const m = forceModel ?? model;
    if (forceModel) { setModel(forceModel); saveModel(forceModel); } else { saveModel(model); }
    const id = newId();
    navigate({ to: "/app/$id", params: { id }, search: { prompt: text, model: m } as never });
  }, [model, navigate]);

  const start = (seed?: string) => {
    const text = (seed ?? prompt).trim();
    if (!text) return;
    if (!authUser) { setPendingPrompt(text); setShowAuth(true); return; }
    doNavigate(text);
  };

  const launchSuperagent = () => {
    const seed = prompt.trim() || "Plan and build a complete app end-to-end. Ask clarifying questions, then deliver.";
    if (!authUser) { setPendingPrompt(seed); setShowAuth(true); return; }
    doNavigate(`[Superagent] ${seed}`, "nirpesh-d");
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (pendingPrompt) { doNavigate(pendingPrompt); setPendingPrompt(null); }
  };

  const remove = (id: string) => { deleteApp(id); setApps(loadApps()); };
  const confirmDeploy = () => {
    if (!deployConfirm) return;
    deployApp(deployConfirm.id);
    setApps(loadApps());
    setDeployConfirm(null);
  };
  const visibleApps = view === "deployed" ? apps.filter((a) => a.deployed) : apps;

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen relative overflow-hidden text-white" style={{ background: "#06070b" }}>
      <div className="absolute inset-0 z-0 opacity-30"><MatrixRain /></div>
      <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.10), transparent 60%), #06070b" }} />

      {/* Top nav */}
      <header className="relative z-10 mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-white/80"
            aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, #fde68a, #fbbf24)", color: "#1f1300" }}>
            Buy Credits
          </button>
          <UserMenu />
        </div>
      </header>

      {/* Big wordmark */}
      <div className="relative z-10 text-center pt-6 px-5">
        <h1 className="font-extrabold tracking-tight leading-none select-none"
          style={{
            fontSize: "clamp(56px, 14vw, 140px)",
            background: "linear-gradient(135deg, #fb923c 0%, #f97316 35%, #ef4444 70%, #dc2626 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 8px 30px rgba(239,68,68,0.25))",
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            letterSpacing: "-0.04em",
          }}>
          Nirpesh
        </h1>
      </div>


      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-3xl px-5 pt-10 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border"
          style={{ background: "rgba(20,25,35,0.7)", borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="h-2 w-2 rounded-full" style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }} />
          <span style={{ color: "rgba(255,255,255,0.85)" }}>
            {authUser?.email ? `${authUser.email.split("@")[0]}'s Project` : "Nirpesh's Project"}
          </span>
        </div>

        <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight" style={{
          background: "linear-gradient(135deg, #67e8f9, #22d3ee, #5eead4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Where ideas become reality
        </h1>
        <p className="mt-3 text-sm md:text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
          Build fully functional apps and websites through simple conversations
        </p>

        {/* Superagent CTA */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={launchSuperagent}
            className="superagent-btn group relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl font-medium text-base transition-transform hover:scale-[1.02] active:scale-100"
            style={{
              background: "rgba(15,20,28,0.9)",
              border: "1.5px solid transparent",
              color: "white",
              backgroundClip: "padding-box",
              boxShadow: "0 8px 30px -10px rgba(34,211,238,0.4)",
            }}
          >
            <span className="superagent-border" />
            <span className="grid place-items-center h-8 w-8 rounded-xl shrink-0"
              style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", color: "#0b0f1a" }}>
              <Bot className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="flex items-center gap-2">
              Go to your Superagent
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
            </span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-7 flex items-center gap-1 justify-start overflow-x-auto no-scrollbar">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  background: active ? "rgba(20,25,35,0.85)" : "transparent",
                  color: active ? "#22d3ee" : "rgba(255,255,255,0.55)",
                  borderBottom: active ? "2px solid #22d3ee" : "2px solid transparent",
                }}>
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Prompt box */}
        <div className="rounded-2xl border text-left p-3"
          style={{
            background: "rgba(15,20,28,0.85)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
          }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); start(); } }}
            rows={2}
            placeholder={current.placeholder}
            className="w-full resize-none bg-transparent px-2 pt-2 pb-3 outline-none text-base"
            style={{ color: "white" }}
          />
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              <ModelPicker value={model} onChange={(m) => { setModel(m); saveModel(m); }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)" }}>
                <Globe className="h-3 w-3" /> Public
              </span>
              <button onClick={() => start()} disabled={!prompt.trim()}
                className="grid place-items-center h-8 w-8 rounded-lg text-black disabled:opacity-30 hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, #67e8f9, #22d3ee)" }}>
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {QUICK.map((q) => (
            <button key={q} onClick={() => start(`Build me ${q}`)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{ background: "rgba(20,25,35,0.7)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)" }}>
              {q}
            </button>
          ))}
        </div>
      </main>

      {/* Recent / Deployed */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm">
            <button onClick={() => setView("recent")}
              className="flex items-center gap-2 font-medium"
              style={{ color: view === "recent" ? "white" : "rgba(255,255,255,0.4)" }}>
              <ClipboardList className="h-4 w-4" /> Recent Tasks
            </button>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <button onClick={() => setView("deployed")}
              className="flex items-center gap-2 font-medium"
              style={{ color: view === "deployed" ? "white" : "rgba(255,255,255,0.4)" }}>
              <Globe className="h-4 w-4" /> Deployed Apps
            </button>
          </div>
          <button onClick={() => setApps(loadApps())} className="p-1.5 rounded-md hover:bg-white/5" style={{ color: "rgba(255,255,255,0.5)" }}>
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ background: "rgba(15,20,28,0.6)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="grid grid-cols-12 px-4 py-2.5 text-[11px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="col-span-2">ID</div>
            <div className="col-span-7">Task</div>
            <div className="col-span-3 text-right">Last Modified</div>
          </div>

          {visibleApps.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {view === "deployed" ? "No deployed apps yet. Click Deploy on any task to publish it." : "No tasks yet. Describe an app above to get started."}
            </div>
          ) : (
            visibleApps.map((a) => (
              <div key={a.id} className="grid grid-cols-12 px-4 py-3 items-center text-sm group hover:bg-white/[0.02]"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="col-span-2 font-mono text-xs flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  NRP — {a.id.slice(0, 5)}
                  {a.deployed && (
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }} title="Deployed" />
                  )}
                </div>
                <Link to="/app/$id" params={{ id: a.id }} className="col-span-7 min-w-0">
                  <div className="font-medium truncate text-white">{a.title}</div>
                  <div className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{a.prompt}</div>
                </Link>
                <div className="col-span-3 flex items-center justify-end gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span className="mr-1 hidden sm:inline">{timeAgo(a.updatedAt)}</span>
                  {a.deployed ? (
                    <button onClick={() => openLive(a)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors"
                      style={{ borderColor: "rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.1)", color: "#67e8f9" }}
                      title="Open live app">
                      <ExternalLink className="h-3 w-3" /> View live
                    </button>
                  ) : (
                    <button onClick={() => setDeployConfirm(a)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-colors hover:bg-white/5"
                      style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                      title="Deploy this app">
                      <Rocket className="h-3 w-3" /> Deploy
                    </button>
                  )}
                  <button onClick={() => remove(a.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/5" style={{ color: "#f87171" }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-white/5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          <div className="flex items-center justify-between px-4 py-2.5 text-xs" style={{ color: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div>Showing {visibleApps.length === 0 ? 0 : 1}-{visibleApps.length} out of {visibleApps.length}</div>
            <div>Tasks per page: 50</div>
          </div>

        </div>
      </section>

      {showAuth && (
        <AuthModal onClose={() => { setShowAuth(false); setPendingPrompt(null); }} onSuccess={handleAuthSuccess} />
      )}

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {deployConfirm && (
        <DeployConfirmModal
          appTitle={deployConfirm.title}
          onCancel={() => setDeployConfirm(null)}
          onConfirm={confirmDeploy}
        />
      )}
    </div>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return `${d} day${d > 1 ? "s" : ""} ago`;
}
