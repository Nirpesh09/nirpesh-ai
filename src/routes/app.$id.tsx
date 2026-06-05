import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithNirpesh, type ChatMessage } from "@/lib/mistral.functions";
import { pushToGithub } from "@/lib/github.functions";
import { webSearch, type WebSearchResult } from "@/lib/web-search.functions";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { ModelPicker } from "@/components/ModelPicker";
import {
  ArrowUp, Eye, Code2, RefreshCw, ExternalLink, Check, Loader2,
  MousePointerClick, Github, X, Wand2, ListChecks, Zap, AlertTriangle, MessageSquare, Globe,
} from "lucide-react";
import { getApp, saveApp, titleFromPrompt, type SavedApp } from "@/lib/apps";
import { loadProfile, type Profile } from "@/lib/profile";
import { loadModel, saveModel, type ModelId } from "@/lib/models";
import { getCredits, deductCredit, hasCredits, initCredits } from "@/lib/credits";

type SearchParams = { prompt?: string; model?: ModelId };

export const Route = createFileRoute("/app/$id")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
    model: (s.model === "nirpesh" || s.model === "nirpesh-g" || s.model === "nirpesh-d") ? s.model : undefined,
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

const BLANK_HTML = `<!doctype html><html><body style="margin:0;display:grid;place-items:center;height:100vh;font-family:system-ui;color:#555;background:#111">Nothing built yet</body></html>`;

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

function AiMessage({ content, isPlan }: { content: string; isPlan?: boolean }) {
  const clean = stripCode(content);
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const bullets = lines.filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*") || /^\d+\./.test(l));
  const intro = lines.find((l) => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("*") && !/^\d+\./.test(l));

  if (bullets.length === 0) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{clean}</p>;
  }

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {intro && <p className="text-[#94a3b8] text-xs">{intro}</p>}
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-0.5 h-4 w-4 rounded-full shrink-0 grid place-items-center ${isPlan ? "bg-[#1e40af]" : "bg-gradient-brand"}`}>
              {isPlan
                ? <span className="text-[9px] font-bold text-white">{i + 1}</span>
                : <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
              }
            </span>
            <span className="text-[#cbd5e1]">{b.replace(/^[•\-*]\s*/, "").replace(/^\d+\.\s*/, "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThinkingBubble({ stepIdx }: { stepIdx: number }) {
  return (
    <div
      className="rounded-2xl rounded-tl-sm border border-[#1e293b] bg-[#0f1117] overflow-hidden animate-fade-in"
      style={{ animation: "nirpesh-fade-up 320ms ease-out both" }}
    >
      <div className="relative flex items-center gap-2.5 px-4 py-3 border-b border-[#1e293b] bg-[#0a0d14] overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(56,189,248,0.10), transparent)",
            animation: "nirpesh-shimmer 2.2s linear infinite",
          }}
        />
        <div className="relative grid place-items-center h-6 w-6 rounded-lg bg-gradient-brand shrink-0">
          <span className="absolute inset-0 rounded-lg bg-gradient-brand opacity-60 animate-ping" />
          <span className="relative text-[11px] font-bold text-white z-10">N</span>
        </div>
        <span className="relative text-xs font-medium text-[#94a3b8]">
          Nirpesh is thinking…
        </span>
        <Loader2 className="relative h-3 w-3 animate-spin text-brand ml-auto" />
      </div>
      <ul className="px-4 py-3 space-y-2">
        {THINK_STEPS.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <li
              key={s}
              className="flex items-center gap-2.5 transition-all duration-300"
              style={{
                opacity: done || active ? 1 : 0.45,
                transform: active ? "translateX(2px)" : "translateX(0)",
              }}
            >
              <span className={`grid place-items-center h-4 w-4 rounded-full shrink-0 transition-all duration-300 ${
                done ? "bg-gradient-brand" : active ? "border-2 border-brand bg-brand/10" : "border border-[#334155]"
              }`}>
                {done && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                {active && <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />}
              </span>
              <span className={`text-xs transition-colors ${done ? "text-[#475569] line-through" : active ? "text-[#e2e8f0] font-medium" : "text-[#475569]"}`}>{s}</span>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-1 px-4 pb-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-brand"
            style={{ animation: `nirpesh-bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
      <style>{`
        @keyframes nirpesh-fade-up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nirpesh-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes nirpesh-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-4px); opacity: 1; } }
      `}</style>
    </div>
  );
}

function CreditsBadge({ credits }: { credits: number }) {
  const low = credits <= 3;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
      low ? "border-orange-500/40 bg-orange-500/10 text-orange-400" : "border-[#1e293b] bg-[#0f1117] text-[#64748b]"
    }`}>
      <Zap className="h-3 w-3" />
      {credits} credit{credits !== 1 ? "s" : ""}
    </div>
  );
}

type Picked = { id: string; tag: string; text: string; outer: string };

function AppPage() {
  const { id } = Route.useParams();
  const { prompt: initial, model: initialModel } = Route.useSearch();
  const navigate = useNavigate();
  const chat = useServerFn(chatWithNirpesh);
  const search = useServerFn(webSearch);
  const ghPush = useServerFn(pushToGithub);

  const existing = useRef<SavedApp | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [html, setHtml] = useState<string>(BLANK_HTML);
  const [title, setTitle] = useState<string>("New app");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [planMode, setPlanMode] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [credits, setCredits] = useState(10);
  const [outOfCredits, setOutOfCredits] = useState(false);

  const sentInitial = useRef(false);
  const [profile, setProfile] = useState<Profile>({ name: "You", emoji: "🦊", color: "#a855f7" });
  const [model, setModel] = useState<ModelId>("nirpesh");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [draftText, setDraftText] = useState("");
  const [aiInstr, setAiInstr] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [gh, setGh] = useState<{ status: "idle" | "pushing" | "done" | "error"; url?: string; error?: string }>({ status: "idle" });

  // Track which messages are "plan" type
  const [planMsgIndices, setPlanMsgIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    setProfile(loadProfile());
    if (initialModel) { setModel(initialModel); saveModel(initialModel); }
    else setModel(loadModel());
    initCredits();
    setCredits(getCredits());
  }, [initialModel]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

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

  useEffect(() => {
    if (!loading) return;
    setStepIdx(0);
    const t = setInterval(() => setStepIdx((i) => Math.min(i + 1, THINK_STEPS.length - 1)), 1800);
    return () => clearInterval(t);
  }, [loading]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "nirpesh:select") { setPicked({ id: d.id, tag: d.tag, text: d.text, outer: d.outer }); setDraftText(d.text); setAiInstr(""); }
      if (d.type === "nirpesh:html" && typeof d.html === "string") {
        const clean = d.html.replace(/<script>\(function\(\)\{[\s\S]*?__nirpeshInit[\s\S]*?<\/script>/g, "").replace(/<style>\[data-nirpesh[\s\S]*?<\/style>/g, "").replace(/\sdata-nirpesh-(id|hover|pick)(="[^"]*")?/g, "");
        setHtml(clean);
        const now = Date.now();
        const saved: SavedApp = { id, title: existing.current?.title ?? title, prompt: existing.current?.prompt ?? initial ?? "", html: clean, messages, createdAt: existing.current?.createdAt ?? now, updatedAt: now };
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

  const run = async (text: string, opts: { isPlan?: boolean; isChat?: boolean; useSearch?: boolean } = {}) => {
    const { isPlan = false, isChat = false, useSearch = false } = opts;
    if (!hasCredits()) { setOutOfCredits(true); return; }

    // /search <query> command always triggers web search regardless of toggle.
    const slashMatch = text.match(/^\/search\s+(.+)$/i);
    const shouldSearch = useSearch || !!slashMatch;
    const visibleText = slashMatch ? slashMatch[1] : text;

    const userMsg: ChatMessage = { role: "user", content: visibleText };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    deductCredit();
    setCredits(getCredits());

    let actualText = visibleText;
    if (isPlan) {
      actualText = `Before building the app, create a detailed plan for: "${visibleText}". List the components, features, layout, color scheme, and interactions you will include. Number each item. Do NOT write any code yet — just the plan. End with "Ready to build when you confirm."`;
    }

    // Optional web search step — prepend results as a system-style assistant context.
    let searchContext: ChatMessage | null = null;
    let searchSources: WebSearchResult[] = [];
    if (shouldSearch) {
      try {
        const r = await search({ data: { query: visibleText, limit: 5 } });
        searchSources = r.results;
        if (r.error) {
          searchContext = { role: "system", content: `Web search note: ${r.error}` };
        } else if (r.results.length) {
          const formatted = r.results
            .map((res, i) => `[${i + 1}] ${res.title}\n${res.url}\n${res.description}`)
            .join("\n\n");
          searchContext = {
            role: "system",
            content: `Live web search results for "${r.query}":\n\n${formatted}\n\nUse these as up-to-date references. Cite them inline like [1], [2] when relevant.`,
          };
        }
      } catch (err) {
        searchContext = {
          role: "system",
          content: `Web search failed: ${err instanceof Error ? err.message : "unknown"}`,
        };
      }
    }

    const baseMsgs: ChatMessage[] = isPlan
      ? [...messages, { role: "user", content: actualText }]
      : [...messages, { role: "user", content: actualText }];
    const queryMsgs: ChatMessage[] = searchContext ? [searchContext, ...baseMsgs] : baseMsgs;

    try {
      const res = await chat({ data: { messages: queryMsgs, model, mode: isChat ? "chat" : "build" } });
      let content = res.content;
      if (searchSources.length && isChat) {
        const srcList = searchSources
          .map((s, i) => `[${i + 1}] [${s.title}](${s.url})`)
          .join("\n");
        content = `${content}\n\n**Sources:**\n${srcList}`;
      }
      const assistantMsg: ChatMessage = { role: "assistant", content };
      const finalMsgs = [...next, assistantMsg];
      setMessages(finalMsgs);

      if (isPlan) {
        setPlanMsgIndices((prev) => new Set([...prev, finalMsgs.length - 1]));
      } else if (!isChat) {
        const code = extractHtml(res.content) ?? html;
        setHtml(code);
        const now = Date.now();
        const saved: SavedApp = {
          id,
          title: existing.current?.title ?? titleFromPrompt(visibleText),
          prompt: existing.current?.prompt ?? visibleText,
          html: code,
          messages: finalMsgs,
          createdAt: existing.current?.createdAt ?? now,
          updatedAt: now,
        };
        existing.current = saved;
        saveApp(saved);
        setTitle(saved.title);
      }
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
    run(text, { isPlan: planMode, isChat: chatMode, useSearch: searchMode });
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
    <div className="h-screen flex flex-col bg-[#080b10]">
      {/* Header */}
      <header className="h-13 border-b border-[#1e293b] flex items-center justify-between px-4 shrink-0 bg-[#0a0d14]/90 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <Logo loading={loading} />
          <span className="text-[#334155]">/</span>
          <span className="text-sm text-[#94a3b8] truncate max-w-[160px]">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditsBadge credits={credits} />
          <button
            onClick={onGithub}
            disabled={gh.status === "pushing"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#1e293b] bg-[#0f1117] hover:bg-[#1e293b] text-[#94a3b8] text-xs font-medium disabled:opacity-50 transition-colors"
          >
            {gh.status === "pushing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
            {gh.status === "done" ? "Pushed ✓" : gh.status === "pushing" ? "Pushing…" : "GitHub"}
          </button>
          {gh.status === "done" && gh.url && (
            <a href={gh.url} target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline">Open</a>
          )}
          <Link to="/dashboard" className="text-sm text-[#64748b] hover:text-[#94a3b8] ml-1 transition-colors">← Back</Link>
          <UserMenu />
        </div>
      </header>

      {gh.status === "error" && (
        <div className="bg-destructive/10 text-destructive text-xs px-4 py-2 border-b border-[#1e293b]">{gh.error}</div>
      )}

      <div className="flex-1 grid grid-cols-[minmax(180px,40%)_1fr] lg:grid-cols-[400px_1fr] min-h-0">
        {/* ── CHAT PANEL (dark) ── */}
        <aside className="border-r border-[#1e293b] flex flex-col min-h-0 bg-[#080b10]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <div className="relative grid place-items-center h-16 w-16 rounded-2xl bg-gradient-brand shadow-glow">
                  <span className="text-2xl font-bold text-white">N</span>
                </div>
                <div>
                  <p className="font-semibold text-[#e2e8f0]">Nirpesh is ready</p>
                  <p className="text-sm text-[#475569] mt-1">Type below to start building</p>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#475569]">
                  <Zap className="h-3.5 w-3.5 text-brand" />
                  <span>You have <span className="text-brand font-semibold">{credits} free credits</span> to use</span>
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                {/* Label */}
                <div className={`flex items-center gap-1.5 px-1 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" ? (
                    <span className="grid place-items-center h-5 w-5 rounded-md bg-gradient-brand shrink-0">
                      <span className="text-[10px] font-bold text-white">N</span>
                    </span>
                  ) : (
                    <span className="grid place-items-center h-5 w-5 rounded-md text-sm shrink-0" style={{ backgroundColor: profile.color }}>
                      <span className="text-[10px]">{profile.emoji}</span>
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider text-[#475569] font-medium">
                    {m.role === "assistant" ? "Nirpesh" : profile.name}
                  </span>
                  {planMsgIndices.has(i) && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">Plan</span>
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-brand text-white rounded-tr-sm shadow-glow"
                    : "bg-[#0f1117] border border-[#1e293b] rounded-tl-sm text-[#cbd5e1]"
                }`}>
                  {m.role === "assistant"
                    ? <AiMessage content={m.content} isPlan={planMsgIndices.has(i)} />
                    : <p>{m.content}</p>}
                </div>

                {/* If this was a plan, show "Build it now" button */}
                {planMsgIndices.has(i) && m.role === "assistant" && (
                  <button
                    onClick={() => {
                      const userPrompt = messages[i - 1]?.content ?? "";
                      run(`Now build the app as planned: ${userPrompt}`);
                    }}
                    disabled={loading}
                    className="ml-7 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-brand text-white hover:opacity-90 transition-opacity disabled:opacity-50 shadow-glow"
                  >
                    <Zap className="h-3 w-3" /> Build it now
                  </button>
                )}
              </div>
            ))}

            {/* In-chat thinking bubble */}
            {loading && (
              <div className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-1.5 px-1">
                  <span className="relative grid place-items-center h-5 w-5 rounded-md bg-gradient-brand shrink-0">
                    <span className="absolute inset-0 rounded-md bg-gradient-brand opacity-70 animate-ping" />
                    <span className="relative text-[10px] font-bold text-white z-10">N</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-brand font-medium animate-pulse">
                    {planMode ? "Planning…" : "Building…"}
                  </span>
                </div>
                <div className="max-w-[90%]"><ThinkingBubble stepIdx={stepIdx} /></div>
              </div>
            )}

            {/* Out of credits warning */}
            {outOfCredits && (
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-300">Out of credits</p>
                  <p className="text-xs text-orange-400/70 mt-0.5">Sign up or upgrade to continue building apps.</p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="p-3 border-t border-[#1e293b] bg-[#0a0d14]">
            {/* Mode toggles */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <button
                type="button"
                onClick={() => { setChatMode((v) => !v); if (!chatMode) setPlanMode(false); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  chatMode
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "border-[#1e293b] bg-[#0f1117] text-[#475569] hover:text-[#64748b]"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {chatMode ? "Discuss mode ON" : "Discuss"}
              </button>
              <button
                type="button"
                onClick={() => { setPlanMode((v) => !v); if (!planMode) setChatMode(false); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  planMode
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                    : "border-[#1e293b] bg-[#0f1117] text-[#475569] hover:text-[#64748b]"
                }`}
              >
                <ListChecks className="h-3.5 w-3.5" />
                {planMode ? "Plan mode ON" : "Plan first"}
              </button>
              {chatMode && <span className="text-[10px] text-[#475569]">Nirpesh will chat — no code yet</span>}
              {planMode && <span className="text-[10px] text-[#475569]">AI will plan before building</span>}
            </div>

            <div className="rounded-xl border border-[#1e293b] bg-[#0f1117] focus-within:border-brand/40 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(e); } }}
                rows={2}
                placeholder={loading ? "Nirpesh is working…" : chatMode ? "Chat with Nirpesh about your app…" : planMode ? "Describe your app — Nirpesh will plan it first…" : "Ask Nirpesh to build or change something…"}
                className="w-full bg-transparent resize-none px-3 py-2.5 text-sm outline-none placeholder:text-[#334155] text-[#e2e8f0]"
                disabled={loading}
              />
              <div className="flex items-center justify-between p-1.5 gap-2">
                <ModelPicker value={model} onChange={pickModel} />
                <button
                  type="submit"
                  disabled={!input.trim() || loading || outOfCredits}
                  className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-brand text-white disabled:opacity-30 hover:scale-105 transition-transform shadow-glow"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </form>
        </aside>

        {/* ── PREVIEW PANEL ── */}
        <section className="flex flex-col min-h-0 relative bg-[#080b10]">
          <div className="h-11 border-b border-[#1e293b] flex items-center justify-between px-3 shrink-0 bg-[#0a0d14]">
            <div className="flex gap-1">
              <button onClick={() => setTab("preview")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${tab === "preview" ? "bg-[#1e293b] text-[#e2e8f0]" : "text-[#475569] hover:text-[#64748b]"}`}>
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button onClick={() => setTab("code")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${tab === "code" ? "bg-[#1e293b] text-[#e2e8f0]" : "text-[#475569] hover:text-[#64748b]"}`}>
                <Code2 className="h-3.5 w-3.5" /> Code
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setEditMode((v) => !v); setPicked(null); setTab("preview"); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${editMode ? "bg-gradient-brand text-white" : "hover:bg-[#1e293b] text-[#475569]"}`}
              >
                <MousePointerClick className="h-3.5 w-3.5" />
                {editMode ? "Editing" : "Visual Edit"}
              </button>
              <button onClick={() => setHtml((h) => h + " ")} title="Reload" className="p-1.5 rounded-lg hover:bg-[#1e293b] text-[#475569]"><RefreshCw className="h-3.5 w-3.5" /></button>
              <button onClick={() => { const blob = new Blob([html], { type: "text/html" }); window.open(URL.createObjectURL(blob), "_blank"); }} title="Open in new tab" className="p-1.5 rounded-lg hover:bg-[#1e293b] text-[#475569]"><ExternalLink className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">
            {tab === "preview" ? (
              <iframe ref={iframeRef} title="preview" srcDoc={previewHtml} className="w-full h-full border-0 bg-white" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin" />
            ) : (
              <pre className="w-full h-full overflow-auto bg-[#060911] text-xs p-4 text-[#7dd3fc] font-mono whitespace-pre-wrap">{html}</pre>
            )}

            {editMode && !picked && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0f1117] border border-[#1e293b] text-[#94a3b8] text-xs px-3 py-1.5 shadow-soft flex items-center gap-2">
                <MousePointerClick className="h-3.5 w-3.5" /> Click any element to edit
              </div>
            )}

            {picked && (
              <div className="absolute right-4 top-4 w-80 rounded-2xl border border-[#1e293b] bg-[#0f1117] shadow-soft p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">{picked.tag.toLowerCase()}</div>
                  <button onClick={() => setPicked(null)} className="p-1 rounded hover:bg-[#1e293b] text-[#475569]"><X className="h-3.5 w-3.5" /></button>
                </div>
                <label className="text-xs text-[#475569]">Text</label>
                <textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} rows={3}
                  className="mt-1 w-full rounded-lg border border-[#1e293b] bg-[#080b10] px-2.5 py-2 text-sm outline-none focus:border-brand/50 text-[#e2e8f0]" />
                <button onClick={saveTextEdit} className="mt-2 w-full py-2 rounded-lg bg-gradient-brand text-white text-sm font-medium hover:opacity-90">Save text</button>
                <div className="my-3 h-px bg-[#1e293b]" />
                <label className="text-xs text-[#475569] flex items-center gap-1"><Wand2 className="h-3 w-3" /> Or ask Nirpesh</label>
                <textarea value={aiInstr} onChange={(e) => setAiInstr(e.target.value)} rows={2} placeholder="make this bigger and purple"
                  className="mt-1 w-full rounded-lg border border-[#1e293b] bg-[#080b10] px-2.5 py-2 text-sm outline-none focus:border-brand/50 text-[#e2e8f0]" />
                <button onClick={askAiOnElement} disabled={!aiInstr.trim()} className="mt-2 w-full py-2 rounded-lg border border-[#1e293b] bg-[#0f1117] hover:bg-[#1e293b] text-sm font-medium disabled:opacity-50 text-[#94a3b8]">Ask Nirpesh</button>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-[#080b10]/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative grid place-items-center h-12 w-12 rounded-xl bg-gradient-brand shadow-glow">
                    <span className="absolute inset-0 rounded-xl bg-gradient-brand opacity-50 animate-ping" />
                    <span className="relative text-xl font-bold text-white z-10">N</span>
                  </div>
                  <p className="text-xs text-[#64748b] font-medium">{planMode ? "Planning…" : "Building preview…"}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }
      `}</style>
    </div>
  );
}
