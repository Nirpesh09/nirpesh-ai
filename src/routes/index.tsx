import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sparkles, Paperclip, Lock, ArrowUp, Figma } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh — AI that builds full apps" },
      { name: "description", content: "Prompt, run, edit, and deploy full-stack web apps with Nirpesh AI." },
      { property: "og:title", content: "Nirpesh — AI that builds full apps" },
      { property: "og:description", content: "Prompt, run, edit, and deploy full-stack web apps with Nirpesh AI." },
    ],
  }),
  component: Index,
});

const QUICK = [
  "Build a mobile app with Expo",
  "Start a blog with Astro",
  "Create a docs site with Vitepress",
  "Scaffold UI with shadcn",
  "Draft a presentation with Slidev",
  "Code a video with Remotion",
];

const STACKS = [
  { name: "Astro", color: "oklch(0.7 0.18 35)" },
  { name: "Next.js", color: "oklch(0.95 0 0)" },
  { name: "Vite", color: "oklch(0.65 0.2 290)" },
  { name: "React", color: "oklch(0.7 0.15 220)" },
  { name: "Svelte", color: "oklch(0.65 0.22 25)" },
  { name: "Vue", color: "oklch(0.7 0.15 160)" },
  { name: "Remix", color: "oklch(0.85 0 0)" },
  { name: "Qwik", color: "oklch(0.7 0.18 240)" },
  { name: "Nuxt", color: "oklch(0.7 0.18 160)" },
];

function Index() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const startBuild = (seed?: string) => {
    const text = (seed ?? prompt).trim();
    if (!text) return;
    navigate({ to: "/build", search: { prompt: text } as never });
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Hero glow */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-hero-glow pointer-events-none" />
      <div className="absolute inset-x-0 top-14 h-[500px] grid-bg pointer-events-none" />

      <main className="relative mx-auto max-w-5xl px-6 pt-20 pb-24">
        {/* Pill */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            Introducing Nirpesh — AI that builds full apps
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-8 text-center text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          What do you want to build?
        </h1>
        <p className="mt-6 text-center text-lg text-muted-foreground">
          Prompt, run, edit, and deploy full-stack web and mobile apps.
        </p>

        {/* Prompt box */}
        <div className="mt-10 rounded-2xl border border-border bg-card shadow-glow">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) startBuild();
            }}
            placeholder="How can Nirpesh help you today?"
            rows={3}
            className="w-full resize-none bg-transparent px-5 py-4 outline-none text-base placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <button className="p-2 rounded-md hover:bg-accent transition-colors">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="px-2 py-1 rounded-md hover:bg-accent transition-colors flex items-center gap-1.5">
                <Figma className="h-3.5 w-3.5" /> Figma
              </button>
              <button className="px-2 py-1 rounded-md hover:bg-accent transition-colors flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Public
              </button>
            </div>
            <button
              onClick={() => startBuild()}
              disabled={!prompt.trim()}
              className="grid place-items-center h-9 w-9 rounded-md bg-gradient-brand text-background disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => startBuild(q)}
              className="px-3.5 py-1.5 rounded-full border border-border bg-card/50 text-sm text-muted-foreground hover:text-foreground hover:border-brand/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Stacks */}
        <p className="mt-12 text-center text-xs text-muted-foreground">
          or start a blank app with your favorite stack
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {STACKS.map((s) => (
            <button
              key={s.name}
              onClick={() => startBuild(`Start a blank app with ${s.name}`)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card/50 text-sm hover:border-brand/40 transition-colors"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.name}
            </button>
          ))}
        </div>
      </main>

      {/* From the community */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">From the community</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explore what others are building with Nirpesh
            </p>
          </div>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl border border-border bg-card/50 hover:border-brand/40 transition-colors cursor-pointer"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
