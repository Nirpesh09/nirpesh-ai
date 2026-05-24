import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { chatWithNirpesh, type ChatMessage } from "@/lib/mistral.functions";
import { Logo } from "@/components/Logo";
import { ArrowUp, FileCode, Eye, Code2, Loader2, RefreshCw, ExternalLink } from "lucide-react";

type SearchParams = { prompt?: string };

export const Route = createFileRoute("/build")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Build with Nirpesh" },
      { name: "description", content: "Chat with Nirpesh AI to build your app live." },
    ],
  }),
  component: Build,
});

const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Your app</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    background:radial-gradient(ellipse at top,#1a1410,#0a0807);color:#fff}
  .card{text-align:center;padding:3rem}
  h1{font-size:2.5rem;margin:0 0 .5rem;background:linear-gradient(135deg,#f59e0b,#fbbf24);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  p{color:#94918d}
</style></head>
<body><div class="card"><h1>Ready when you are</h1>
<p>Describe what you want to build in the chat →</p></div></body></html>`;

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

function Build() {
  const { prompt: initial } = Route.useSearch();
  const chat = useServerFn(chatWithNirpesh);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string>(STARTER_HTML);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const sentInitial = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next } });
      const assistantMsg: ChatMessage = { role: "assistant", content: res.content };
      setMessages([...next, assistantMsg]);
      const code = extractHtml(res.content);
      if (code) setHtml(code);
    } catch (e) {
      setMessages([
        ...next,
        { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Something went wrong"}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sentInitial.current || !initial) return;
    sentInitial.current = true;
    send(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    send(text);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">untitled project</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            Exit
          </Link>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_220px_1fr] min-h-0">
        {/* Chat */}
        <aside className="border-r border-border flex flex-col min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-sm text-muted-foreground text-center mt-12">
                Tell Nirpesh what to build.
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 text-sm ${
                  m.role === "user"
                    ? "bg-accent ml-6"
                    : "bg-card border border-border mr-6"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  {m.role === "user" ? "You" : "Nirpesh"}
                </div>
                <div className="prose prose-invert prose-sm max-w-none prose-pre:hidden prose-code:text-brand">
                  <ReactMarkdown>{m.role === "assistant" ? stripCode(m.content) : m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="bg-card border border-border rounded-lg p-3 mr-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-brand" /> Nirpesh is thinking…
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="p-3 border-t border-border">
            <div className="rounded-lg border border-border bg-card focus-within:border-brand/50 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                  }
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
                  className="grid place-items-center h-7 w-7 rounded bg-gradient-brand text-background disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </aside>

        {/* File tree */}
        <aside className="border-r border-border p-3 hidden lg:block">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-2">
            Files
          </div>
          <button
            onClick={() => setTab("code")}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent text-left"
          >
            <FileCode className="h-3.5 w-3.5 text-brand" />
            index.html
          </button>
        </aside>

        {/* Preview / Code */}
        <section className="flex flex-col min-h-0">
          <div className="h-10 border-b border-border flex items-center justify-between px-3 shrink-0">
            <div className="flex gap-1">
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                  tab === "preview" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                onClick={() => setTab("code")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs ${
                  tab === "code" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" /> Code
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setHtml((h) => h + " ")}
                title="Reload preview"
                className="p-1.5 rounded hover:bg-accent text-muted-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([html], { type: "text/html" });
                  window.open(URL.createObjectURL(blob), "_blank");
                }}
                title="Open in new tab"
                className="p-1.5 rounded hover:bg-accent text-muted-foreground"
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
              <pre className="w-full h-full overflow-auto bg-card text-xs p-4 text-foreground/90 font-mono whitespace-pre-wrap">
                {html}
              </pre>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function stripCode(text: string): string {
  return text.replace(/```html[\s\S]*?```/gi, "").replace(/```[\s\S]*?```/g, "").trim() || "Updated.";
}
