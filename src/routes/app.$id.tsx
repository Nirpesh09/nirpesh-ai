import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { chatWithNirpesh, type ChatMessage } from "@/lib/mistral.functions";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { ThinkingOrb } from "@/components/ThinkingOrb";
import { ArrowUp, Eye, Code2, RefreshCw, ExternalLink, Check, Loader2, Sparkles } from "lucide-react";
import { getApp, saveApp, titleFromPrompt, type SavedApp } from "@/lib/apps";
import { loadProfile, type Profile } from "@/lib/profile";

type SearchParams = { prompt?: string };

export const Route = createFileRoute("/app/$id")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
  }),
  head: () => ({ meta: [{ title: "Building with Nirpesh" }] }),
  component: AppPage,
});

const THINK_STEPS = [
  "Reading your prompt",
  "Sketching the layout",
  "Picking colors & typography",
  "Writing the HTML & CSS",
  "Wiring up interactions",
  "Polishing the details",
];

const BLANK_HTML = `<!doctype html><html><body style="margin:0;display:grid;place-items:center;height:100vh;font-family:system-ui;color:#888;background:#fafafa">Nothing built yet</body></html>`;

function extractHtml(text: string): string | null {
  const m = text.match(/```html\s*([\s\S]*?)```/i) ?? text.match(/```\s*(<!DOCTYPE[\s\S]*?)```/i);
  if (m) return m[1].trim();
  if (text.includes("<!DOCTYPE") || text.includes("<html")) {
    const start = text.indexOf("<");
    const end = text.lastIndexOf(">");
    if (start >= 0 && end > start) return text.slice(start, end + 1);
  }
  return null;
}

function stripCode(text: string): string {
  return text.replace(/```[\s\S]*?```/g, "").trim() || "Done — preview is ready.";
}

function AppPage() {
  const { id } = Route.useParams();
  const { prompt: initial } = Route.useSearch();
  const navigate = useNavigate();
  const chat = useServerFn(chatWithNirpesh);

  const existing = useRef<SavedApp | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [html, setHtml] = useState<string>(BLANK_HTML);
  const [title, setTitle] = useState<string>("New app");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [view, setView] = useState<"thinking" | "ready">("ready");
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const sentInitial = useRef(false);
  const [profile, setProfile] = useState<Profile>({ name: "You", emoji: "🦊", color: "#a855f7" });
  useEffect(() => { setProfile(loadProfile()); }, []);

  // hydrate from storage
  useEffect(() => {
    const a = getApp(id);
    if (a) {
      existing.current = a;
      setMessages(a.messages);
      setHtml(a.html);
      setTitle(a.title);
      setView("ready");
    } else if (initial) {
      setTitle(titleFromPrompt(initial));
    }
  }, [id, initial]);

  // step cycler while loading
  useEffect(() => {
    if (!loading) return;
    setStepIdx(0);
    const t = setInterval(() => setStepIdx((i) => Math.min(i + 1, THINK_STEPS.length - 1)), 1500);
    return () => clearInterval(t);
  }, [loading]);

  const run = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setView("thinking");
    try {
      const res = await chat({ data: { messages: next } });
      const assistantMsg: ChatMessage = { role: "assistant", content: res.content };
      const finalMsgs = [...next, assistantMsg];
      setMessages(finalMsgs);
      const code = extractHtml(res.content) ?? html;
      setHtml(code);
      const now = Date.now();
      const saved: SavedApp = {
        id,
        title: existing.current?.title ?? titleFromPrompt(text),
        prompt: existing.current?.prompt ?? text,
        html: code,
        messages: finalMsgs,
        createdAt: existing.current?.createdAt ?? now,
        updatedAt: now,
      };
      existing.current = saved;
      saveApp(saved);
      setTitle(saved.title);
      // tiny pause so the final step feels satisfying
      await new Promise((r) => setTimeout(r, 400));
      setView("ready");
    } catch (e) {
      setMessages([...next, { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Something went wrong"}` }]);
      setView("ready");
    } finally {
      setLoading(false);
    }
  };

  // kick off initial prompt
  useEffect(() => {
    if (sentInitial.current) return;
    if (!initial || existing.current) return;
    sentInitial.current = true;
    run(initial);
    // strip prompt from url
    navigate({ to: "/app/$id", params: { id }, search: {}, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    run(text);
  };

  // THINKING SCREEN
  if (view === "thinking") {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? initial ?? "";
    return (
      <div className="min-h-screen relative overflow-hidden grid place-items-center px-6">
        <div className="absolute inset-x-0 top-0 h-[700px] bg-hero-glow pointer-events-none" />
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative z-10 w-full max-w-xl">
          <div className="flex justify-center mb-8">
            <ThinkingOrb />
          </div>
          <div className="rounded-2xl border bg-card shadow-soft p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-brand animate-pulse" />
              Nirpesh is building
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              <span className="shimmer">{THINK_STEPS[stepIdx]}…</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground italic line-clamp-2">"{lastUser}"</p>

            <ul className="mt-8 space-y-3">
              {THINK_STEPS.map((s, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span className={`grid place-items-center h-5 w-5 rounded-full ${
                      done ? "bg-gradient-brand text-white" :
                      active ? "border-2 border-brand" : "border bg-muted"
                    }`}>
                      {done && <Check className="h-3 w-3" strokeWidth={3} />}
                      {active && <Loader2 className="h-3 w-3 animate-spin text-brand" />}
                    </span>
                    <span className={done ? "text-foreground" : active ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {s}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            This usually takes 10–30 seconds.
          </p>
        </div>
      </div>
    );
  }

  // READY (preview + chat)
  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
          <span className="text-muted-foreground">/</span>
          <span className="text-sm truncate">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← All apps</Link>
          <UserMenu />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] min-h-0">
        {/* Chat */}
        <aside className="border-r flex flex-col min-h-0 bg-card/30">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 text-sm ${
                  m.role === "user"
                    ? "bg-gradient-brand text-white ml-6 shadow-soft"
                    : "bg-card border mr-6"
                }`}
              >
                <div className={`text-[10px] uppercase tracking-wider mb-1 ${m.role === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                  {m.role === "user" ? "You" : "Nirpesh"}
                </div>
                <div className="text-sm leading-relaxed [&_p]:my-1">
                  <ReactMarkdown>{m.role === "assistant" ? stripCode(m.content) : m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} className="p-3 border-t bg-card">
            <div className="rounded-xl border bg-background focus-within:border-brand/50 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(e); }
                }}
                rows={2}
                placeholder="Ask Nirpesh to change something…"
                className="w-full bg-transparent resize-none px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                disabled={loading}
              />
              <div className="flex justify-end p-1.5">
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-brand text-white disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </aside>

        {/* Preview */}
        <section className="flex flex-col min-h-0">
          <div className="h-11 border-b flex items-center justify-between px-3 shrink-0 bg-card/30">
            <div className="flex gap-1">
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${tab === "preview" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${tab === "code" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Code2 className="h-3.5 w-3.5" /> Code
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setHtml((h) => h + " ")} title="Reload" className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([html], { type: "text/html" });
                  window.open(URL.createObjectURL(blob), "_blank");
                }}
                title="Open in new tab"
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-white">
            {tab === "preview" ? (
              <iframe
                title="preview"
                srcDoc={html}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-forms allow-modals allow-popups"
              />
            ) : (
              <pre className="w-full h-full overflow-auto bg-[#0d0d0f] text-xs p-4 text-white/90 font-mono whitespace-pre-wrap">
                {html}
              </pre>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
