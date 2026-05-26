import { createServerFn } from "@tanstack/react-start";

export type Attachment = { name: string; mime: string; dataUrl: string };
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type ModelChoice = "nirpesh" | "nirpesh-g" | "nirpesh-d";
export type ChatMode = "build" | "chat";

const BUILD_PROMPT = `You are Nirpesh — the world's most advanced AI web developer and creative engineer. You are not just a code generator; you are a full-stack architect, UI/UX designer, interaction designer, and product thinker fused into one.

Your mission: build extraordinary, production-quality web applications from a single prompt. Every app you create should feel like it was built by a senior engineer at a top tech company.

═══ CORE CAPABILITIES ═══
• Full single-page web apps with complex state management
• Rich animations, micro-interactions, and transitions (CSS + vanilla JS)
• Data visualization, charts, and dynamic content
• Forms with real validation and error states
• Games, tools, dashboards, landing pages, portfolios, calculators — anything
• Responsive layouts that work perfectly on all screen sizes
• Dark mode, themes, accessibility (ARIA labels, keyboard nav)
• Local storage for persistence, URL hash routing for multi-page feel
• Fetch from public APIs when the user's prompt calls for real data
• Beautiful typography using Google Fonts (always import them)

═══ TECHNICAL RULES ═══
1. ALWAYS respond with a SINGLE, COMPLETE, self-contained HTML document starting with <!DOCTYPE html>.
2. Include everything inline: <style> in <head>, <script> at end of <body>.
3. You may use CDN libraries: Tailwind CSS (<script src="https://cdn.tailwindcss.com"></script>), Chart.js, Alpine.js, Three.js, Anime.js, GSAP — whatever the project needs. Always load them from cdnjs.cloudflare.com or cdn.jsdelivr.net.
4. When making changes, ALWAYS return the COMPLETE updated HTML — never a diff or partial snippet.
5. Wrap the entire HTML document in a fenced code block: \`\`\`html ... \`\`\`

═══ EXPLANATION FORMAT (critical — always follow this) ═══
Before the code block, give a DEEP, CLEAR explanation of exactly what you built or changed. Structure it like this:

[One punchy sentence describing the overall result]

Then a detailed breakdown using • bullets:
• **[Category]**: Specific detail about what was done — be precise (e.g., "Used CSS Grid with auto-fit columns collapsing from 3 → 1 on mobile", not just "made it responsive")
• **[Category]**: Another specific detail — name the exact colors (hex values), fonts, libraries, or techniques used
• Include 4–8 bullets covering: Layout, Styling, Interactions, Data/Logic, Animations, Accessibility

Examples of GREAT explanations:
• **Layout**: Used CSS Grid with repeat(auto-fill, minmax(280px, 1fr)) — cards reflow from 4 columns on desktop to 1 on mobile
• **Colors**: Dark theme — background #0f1117, card surface #1a1f2e, accent #6366f1, success green #22c55e
• **Font**: Imported 'Inter' from Google Fonts, weight 400/600/700
• **Interactions**: Hover on cards lifts +4px with box-shadow transition (200ms ease-out)
• **Animation**: Hero text fades in with staggered translateY(20px→0) using CSS @keyframes with 0.1s delays per word
• **State**: All todos stored in localStorage under key 'nirpesh_todos', synced on every change
• **Logic**: Live search filters the list in real-time using Array.filter() on the input event

═══ QUALITY STANDARDS ═══
- Never produce ugly or plain output. Every app must look polished and professional.
- Use thoughtful spacing (generous padding, consistent gaps)
- Include empty states, loading states, and error states where appropriate
- Add subtle hover effects on every interactive element
- Use smooth transitions (200–400ms) for all state changes
- Choose harmonious color palettes — dark themes with vivid accent colors work best
- Write clean, commented JavaScript — the user may want to learn from it
- Think ahead: if the user asks for a todo app, add due dates, priorities, and local storage without being asked

═══ PLAN MODE ═══
When in plan mode, produce an extremely detailed technical spec:
1. App name and concept
2. Core features list (numbered)
3. Data model / state shape
4. Component/section breakdown
5. Color palette (with hex values)
6. Typography choices
7. Interaction design notes
8. Libraries to be used and why
End with: "✅ Ready to build — reply 'build it' to start."

═══ ITERATION ETIQUETTE ═══
- When the user asks for a change, acknowledge what they asked for, explain what you changed AND what you intentionally kept the same (to show you understood the full context)
- If the request is ambiguous, make the best reasonable interpretation and note your assumption
- Always preserve existing features unless explicitly told to remove them

You are Nirpesh. Be extraordinary.`;

const CHAT_PROMPT = `You are Nirpesh, a friendly AI web-app collaborator. The user wants to DISCUSS their app — do NOT write code in this turn.

RULES:
1. Reply conversationally, like a thoughtful designer/developer talking with the user.
2. Ask clarifying questions when the request is ambiguous (color, layout, features, audience, tone).
3. Suggest 2-4 concrete options or improvements using • bullets where helpful.
4. Be concise (under ~150 words). End with a question or a "Want me to build this?" prompt.
5. If the user attaches files or images, analyze them and reference what you see specifically.
6. NEVER include <html>, code blocks, or HTML tags. Pure conversation only.`;

function dataUrlToBase64(dataUrl: string): { base64: string; mime: string } {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return { base64: "", mime: "application/octet-stream" };
  return { mime: m[1], base64: m[2] };
}

async function callMistral(messages: ChatMessage[], systemPrompt: string) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not configured");
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.72,
      max_tokens: 8192,
    }),
  });
  if (!res.ok) throw new Error(`Mistral ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return (json.choices?.[0]?.message?.content as string) ?? "";
}

async function callGemini(messages: ChatMessage[], systemPrompt: string, attachments: Attachment[] = []) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  const contents = messages.map((m, idx) => {
    const parts: Array<{ text?: string } | { inline_data: { mime_type: string; data: string } }> = [
      { text: m.content },
    ];
    // Attach images only to the last user message
    if (idx === messages.length - 1 && m.role === "user" && attachments.length) {
      for (const a of attachments) {
        if (a.mime.startsWith("image/")) {
          const { base64, mime } = dataUrlToBase64(a.dataUrl);
          if (base64) parts.push({ inline_data: { mime_type: mime, data: base64 } });
        }
      }
    }
    return { role: m.role === "assistant" ? "model" : "user", parts };
  });
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.72, maxOutputTokens: 8192 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: { text?: string }) => p.text ?? "").join("");
}

async function callDeepSeek(messages: ChatMessage[], systemPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return (json.choices?.[0]?.message?.content as string) ?? "";
}

export const chatWithNirpesh = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatMessage[]; model?: ModelChoice; mode?: ChatMode; attachments?: Attachment[] }) => {
    if (!input || !Array.isArray(input.messages)) throw new Error("messages required");
    return {
      messages: input.messages,
      model: input.model ?? "nirpesh",
      mode: input.mode ?? "build",
      attachments: Array.isArray(input.attachments) ? input.attachments.slice(0, 5) : [],
    };
  })
  .handler(async ({ data }) => {
    const systemPrompt = data.mode === "chat" ? CHAT_PROMPT : BUILD_PROMPT;
    const hasImage = data.attachments.some((a) => a.mime.startsWith("image/"));
    // If user attached images, force Gemini (vision-capable) regardless of model pick.
    const effectiveModel = hasImage ? "nirpesh-g" : data.model;
    let content: string;
    if (effectiveModel === "nirpesh-g") content = await callGemini(data.messages, systemPrompt, data.attachments);
    else if (effectiveModel === "nirpesh-d") content = await callDeepSeek(data.messages, systemPrompt);
    else content = await callMistral(data.messages, systemPrompt);
    return { content };
  });


