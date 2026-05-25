import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithNirpesh, type ChatMessage } from "@/lib/mistral.functions";
import { pushToGithub } from "@/lib/github.functions";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { ModelPicker } from "@/components/ModelPicker";
import {
  ArrowUp, Eye, Code2, RefreshCw, ExternalLink, Check, Loader2,
  MousePointerClick, Github, X, Wand2,
} from "lucide-react";
import { getApp, saveApp, titleFromPrompt, type SavedApp } from "@/lib/apps";
import { loadProfile, type Profile } from "@/lib/profile";
import { loadModel, saveModel, type ModelId } from "@/lib/models";

type SearchParams = { prompt?: string };

export const Route = createFileRoute("/app/$id")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
  }),
  head: () => ({ meta: [{ title: "Building with Nirpesh" }] }),
  component: AppPage,
});

const THINK_STEPS = [
  "Reading your prompt…",
  "Sketching the layout…",
  "Picking colors & typography…",
  "Writing the HTML & CSS…",
  "Wiring up interactions…",
  "Polishing the details…",
];

const BLANK_HTML = `<!doctype html><html><body style="margin:0;display:grid;place-items:center;height:100vh;font-family:system-ui;color:#888;background:#fafafa">Nothing built yet</body></html>`;

const EDIT_SCRIPT = `<script>(function(){
  if (window.__nirpeshInit) return; window.__nirpeshInit = true;
  let edit = false;
  const css = document.createElement('style');
  css.textContent = '[data-nirpesh-hover]{outline:2px dashed #a855f7 !important;outline-offset:2px;cursor:pointer !important}[data-nirpesh-pick]{outline:3px solid #a855f7 !important;outline-offset:2px}';
  document.head.appendChild(css);
  let hovered = null, picked = null;
  document.addEventListener('mouseover', e=>{ if(!edit) return; if(hovered)hovered.removeAttribute('data-nirpesh-hover'); hovered=e.target; hovered.setAttribute('data-nirpesh-hover',''); }, true);
  document.addEventListener('mouseout', e=>{ if(!edit) return; if(hovered)hovered.removeAttribute('data-nirpesh-hover'); hovered=null; }, true);
  document.addEventListener('click', e=>{
    if (!edit) return;
    e.preventDefault(); e.stopPropagation();
    const el = e.target;
    if (picked) picked.removeAttribute('data-nirpesh-pick');
    picked = el; picked.setAttribute('data-nirpesh-pick','');
    if (!el.dataset.nirpeshId) el.dataset.nirpeshId = 'n'+Math.random().toString(36).slice(2,9);
    parent.postMessage({type:'nirpesh:select', id:el.dataset.nirpeshId, tag:el.tagName, text:(el.innerText||'').slice(0,500), outer:(el.outerHTML||'').slice(0,1500)}, '*');
  }, true);
  window.addEventListener('message', e=>{
    const d = e.data||{};
    if (d.type==='nirpesh:setEdit'){ edit = !!d.on; if(!edit){ if(hovered)hovered.removeAttribute('data-nirpesh-hover'); if(picked)picked.removeAttribute('data-nirpesh-pick'); hovered=picked=null; } }
    if (d.type==='nirpesh:setText'){
      const el = document.querySelector('[data-nirpesh-id="'+d.id+'"]');
      if (el){ el.innerText = d.text; }
      parent.postMessage({type:'nirpesh:html', html:'<!doctype html>'+document.documentElement.outerHTML}, '*');
    }
  });
})();</script>`;

function injectEditScript(html: string): string {
  if (html.includes("__nirpeshInit")) return html;
  if (html.includes("</body>")) return html.replace("</body>", EDIT_SCRIPT + "</body>");
  return html + EDIT_SCRIPT;
}

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

function AiMessage({ content }: { content: string }) {
  const clean = stripCode(content);
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
  const intro = lines.find((l) => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("*"));

  if (bullets.length === 0) {
    return <p className="text-sm leading-relaxed">{clean}</p>;
  }

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {intro && <p className="text-muted-foreground text-xs">{intro}</p>}
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 rounded-full bg-gradient-brand shrink-0 grid place-items-center">
              <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{b.replace(/^[•\-*]\s*/, "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThinkingBubble({ stepIdx }: { stepIdx: number }) {
  return (
    <div className="mr-6 rounded-2xl rounded-tl-sm border bg-card shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b bg-muted/30">
        <div className="relative grid place-items-center h-7 w-7 rounded-lg bg-gradient-brand shadow-glow shrink-0">
          <span className="absolute inset-0 rounded-lg bg-gradient-brand opacity-60 animate-ping" />
          <span className="relative text-sm font-bold text-white z-10">N</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">Nirpesh is building your app…</span>
        <Loader2 className="h-3 w-3 animate-spin text-brand ml-auto" />
      </div>

      {/* Steps */}
      <ul className="px-4 py-3 space-y-2.5">
        {THINK_STEPS.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          const pending = i > stepIdx;
          return (
            <li key={s} className="flex items-center gap-2.5">
              <span className={`grid place-items-center h-4 w-4 rounded-full shrink-0 transition-all duration-500 ${
                done ? "bg-gradient-brand" : active ? "border-2 border-brand bg-brand/10" : "border border-muted-foreground/30 bg-muted"
              }`}>
                {done && (
                  <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {active && <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />}
              </span>
              <span className={`text-xs transition-colors duration-300 ${
                done ? "text-foreground line-through opacity-50" : active ? "text-foreground font-medium" : pending ? "text-muted-foreground/40" : "text-muted-foreground"
              }`}>
                {s}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Animated dots */}
      <div className="flex items-center gap-1 px-4 pb-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-brand"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

type Picked = { id: string; tag: string; text: string; outer: string };

function AppPage() {
  const { id } = Route.useParams();
  const { prompt: initial } = Route.useSearch();
  const navigate = useNavigate();
  const chat = useServerFn(chatWithNirpesh);
  const ghPush = useServerFn(pushToGithub);

  const existing = useRef<SavedApp | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [html, setHtml] = useState<string>(BLANK_HTML);
  const [title, setTitle] = useState<string>("New app");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const sentInitial = useRef(false);
  const [profile, setProfile] = useState<Profile>({ name: "You", emoji: "🦊", color: "#a855f7" });
  const [model, setModel] = useState<ModelId>("nirpesh");
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setProfile(loadProfile()); setModel(loadModel()); }, []);

  const [editMode, setEditMode] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [draftText, setDraftText] = useState("");
  const [aiInstr, setAiInstr] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [gh, setGh] = useState<{ status: "idle" | "pushing" | "done" | "error"; url?: string; error?: string }>({ status: "idle" });

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Hydrate from storage
  useEffect(() => {
    const a = getApp(id);
    if (a) {
      existing.current = a;
      setMessages(a.messages);
      setHtml(a.html);
      setTitle(a.title);
    } else if (initial) {
      setTitle(titleFromPrompt(initial));
    }
  }, [id, initial]);

  // Step ticker while loading
  useEffect(() => {
    if (!loading) return;
    setStepIdx(0);
    const t = setInterval(() => setStepIdx((i) => Math.min(i + 1, THINK_STEPS.length - 1)), 1800);
    return () => clearInterval(t);
  }, [loading]);

  // Listen to iframe postMessages
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "nirpesh:select") {
        setPicked({ id: d.id, tag: d.tag, text: d.text, outer: d.outer });
        setDraftText(d.text);
        setAiInstr("");
      }
      if (d.type === "nirpesh:html" && typeof d.html === "string") {
        const clean = d.html
          .replace(/<script>\(function\(\)\{[\s\S]*?__nirpeshInit[\s\S]*?<\/script>/g, "")
          .replace(/<style>\[data-nirpesh[\s\S]*?<\/style>/g, "")
          .replace(/\sdata-nirpesh-(id|hover|pick)(="[^"]*")?/g, "");
        setHtml(clean);
        const now = Date.now();
        const saved: SavedApp = {
          id, title: existing.current?.title ?? title,
          prompt: existing.current?.prompt ?? initial ?? "",
          html: clean, messages,
          createdAt: existing.current?.createdAt ?? now, updatedAt: now,
        };
        existing.current = saved;
        saveApp(saved);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [id, initial, messages, title]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: "nirpesh:setEdit", on: editMode }, "*");
  }, [editMode, tab, html]);

  const previewHtml = useMemo(() => injectEditScript(html), [html]);

  const run = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next, model } });
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
    } catch (e) {
      setMessages([...next, { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Something went wrong"}` }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sentInitial.current) return;
    if (!initial || existing.current) return;
    sentInitial.current = true;
    run(initial);
    navigate({ to: "/app/$id", params: { id }, search: {}, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    run(text);
  };

  const saveTextEdit = () => {
    if (!picked) return;
    iframeRef.current?.contentWindow?.postMessage({ type: "nirpesh:setText", id: picked.id, text: draftText }, "*");
    setPicked(null);
  };

  const askAiOnElement = () => {
    if (!picked || !aiInstr.trim()) return;
    const msg = `Update only the <${picked.tag}> element currently showing "${picked.text.slice(0, 120)}". Apply this change: ${aiInstr.trim()}. Keep the rest of the page identical. Return the FULL updated HTML document.`;
    setPicked(null);
    setEditMode(false);
    run(msg);
  };

  const onGithub = async () => {
    setGh({ status: "pushing" });
    try {
      const res = await ghPush({ data: { title, html, prompt: existing.current?.prompt } });
      setGh({ status: "done", url: res.url });
    } catch (e) {
      setGh({ status: "error", error: e instanceof Error ? e.message : "Push failed" });
    }
  };

  const pickModel = (m: ModelId) => { setModel(m); saveModel(m); };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <Logo loading={loading} />
          <span className="text-muted-foreground">/</span>
          <span className="text-sm truncate max-w-[180px]">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onGithub}
            disabled={gh.status === "pushing"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card hover:bg-accent text-xs font-medium disabled:opacity-50"
            title={gh.status === "done" ? gh.url : "Push to GitHub"}
          >
            {gh.status === "pushing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
            {gh.status === "done" ? "Pushed" : gh.status === "pushing" ? "Pushing…" : "GitHub"}
          </button>
          {gh.status === "done" && gh.url && (
            <a href={gh.url} target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline">Open</a>
          )}
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground ml-1">← All apps</Link>
          <UserMenu />
        </div>
      </header>

      {gh.status === "error" && (
        <div className="bg-destructive/10 text-destructive text-xs px-4 py-2 border-b">{gh.error}</div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] min-h-0">
        {/* ── CHAT PANEL ── */}
        <aside className="border-r flex flex-col min-h-0 bg-card/20">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Welcome message if empty */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <div className="relative grid place-items-center h-16 w-16 rounded-2xl bg-gradient-brand shadow-glow">
                  <span className="text-2xl font-bold text-white">N</span>
                </div>
                <div>
                  <p className="font-semibold">Nirpesh is ready</p>
                  <p className="text-sm text-muted-foreground mt-1">Type a message to start building</p>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                {/* Sender label */}
                <div className={`flex items-center gap-1.5 px-1 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" ? (
                    <span className="grid place-items-center h-5 w-5 rounded-md bg-gradient-brand shrink-0">
                      <span className="text-[10px] font-bold text-white">N</span>
                    </span>
                  ) : (
                    <span
                      className="grid place-items-center h-5 w-5 rounded-md text-sm shrink-0"
                      style={{ backgroundColor: profile.color }}
                    >
                      <span className="text-[10px]">{profile.emoji}</span>
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    {m.role === "assistant" ? "Nirpesh" : profile.name}
                  </span>
                </div>

                {/* Bubble */}
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-brand text-white rounded-tr-sm shadow-glow"
                    : "bg-card border rounded-tl-sm shadow-soft"
                }`}>
                  {m.role === "assistant"
                    ? <AiMessage content={m.content} />
                    : <p>{m.content}</p>}
                </div>
              </div>
            ))}

            {/* Thinking bubble — shows INSIDE the chat while AI works */}
            {loading && (
              <div className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="relative grid place-items-center h-5 w-5 rounded-md bg-gradient-brand shrink-0">
                    <span className="absolute inset-0 rounded-md bg-gradient-brand opacity-70 animate-ping" />
                    <span className="relative text-[10px] font-bold text-white z-10">N</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-brand font-medium animate-pulse">
                    Nirpesh · Building…
                  </span>
                </div>
                <div className="max-w-[88%]">
                  <ThinkingBubble stepIdx={stepIdx} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="p-3 border-t bg-card/60 backdrop-blur">
            <div className="rounded-xl border bg-background focus-within:border-brand/50 transition-colors shadow-soft">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(e); }
                }}
                rows={2}
                placeholder={loading ? "Nirpesh is working…" : "Ask Nirpesh to change something…"}
                className="w-full bg-transparent resize-none px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                disabled={loading}
              />
              <div className="flex items-center justify-between p-1.5 gap-2">
                <ModelPicker value={model} onChange={pickModel} />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-brand text-white disabled:opacity-30 hover:scale-105 transition-transform shadow-glow"
                >
                  {loading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </form>
        </aside>

        {/* ── PREVIEW PANEL ── */}
        <section className="flex flex-col min-h-0 relative">
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
              <button
                onClick={() => { setEditMode((v) => !v); setPicked(null); setTab("preview"); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${editMode ? "bg-gradient-brand text-white" : "hover:bg-accent text-muted-foreground"}`}
              >
                <MousePointerClick className="h-3.5 w-3.5" />
                {editMode ? "Editing" : "Visual Edit"}
              </button>
              <button onClick={() => setHtml((h) => h + " ")} title="Reload" className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => { const blob = new Blob([html], { type: "text/html" }); window.open(URL.createObjectURL(blob), "_blank"); }}
                title="Open in new tab"
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 bg-white relative">
            {tab === "preview" ? (
              <iframe
                ref={iframeRef}
                title="preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
              />
            ) : (
              <pre className="w-full h-full overflow-auto bg-[#0d0d0f] text-xs p-4 text-white/90 font-mono whitespace-pre-wrap">{html}</pre>
            )}

            {editMode && !picked && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground text-background text-xs px-3 py-1.5 shadow-soft flex items-center gap-2">
                <MousePointerClick className="h-3.5 w-3.5" /> Click any element to edit
              </div>
            )}

            {picked && (
              <div className="absolute right-4 top-4 w-80 rounded-2xl border bg-card shadow-soft p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-mono px-1.5 py-0.5 rounded bg-accent">{picked.tag.toLowerCase()}</div>
                  <button onClick={() => setPicked(null)} className="p-1 rounded hover:bg-accent text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                </div>
                <label className="text-xs text-muted-foreground">Text</label>
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border bg-background px-2.5 py-2 text-sm outline-none focus:border-brand/50"
                />
                <button onClick={saveTextEdit} className="mt-2 w-full py-2 rounded-lg bg-gradient-brand text-white text-sm font-medium hover:opacity-90">
                  Save text
                </button>
                <div className="my-3 h-px bg-border" />
                <label className="text-xs text-muted-foreground flex items-center gap-1"><Wand2 className="h-3 w-3" /> Or ask Nirpesh</label>
                <textarea
                  value={aiInstr}
                  onChange={(e) => setAiInstr(e.target.value)}
                  rows={2}
                  placeholder="make this bigger and purple"
                  className="mt-1 w-full rounded-lg border bg-background px-2.5 py-2 text-sm outline-none focus:border-brand/50"
                />
                <button onClick={askAiOnElement} disabled={!aiInstr.trim()}
                  className="mt-2 w-full py-2 rounded-lg border bg-card hover:bg-accent text-sm font-medium disabled:opacity-50">
                  Ask Nirpesh
                </button>
              </div>
            )}

            {/* Loading overlay on preview — subtle pulse */}
            {loading && (
              <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative grid place-items-center h-12 w-12 rounded-xl bg-gradient-brand shadow-glow">
                    <span className="absolute inset-0 rounded-xl bg-gradient-brand opacity-50 animate-ping" />
                    <span className="relative text-xl font-bold text-white z-10">N</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Building preview…</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* bounce keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
