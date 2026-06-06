import { createServerFn } from "@tanstack/react-start";

export type Attachment = { name: string; mime: string; dataUrl: string };
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type ModelChoice = "nirpesh" | "nirpesh-g" | "nirpesh-d";
export type ChatMode = "build" | "chat";

const BUILD_PROMPT = `You are Nirpesh, an expert AI web developer. The user is building a single-page web app inside a sandboxed iframe.

RULES:
1. Always respond with a SINGLE complete, self-contained HTML document (including <!DOCTYPE html>, <html>, <head>, <body>, inline <style>, and inline <script>).
2. Use modern CSS, beautiful typography, gradients, subtle animations. Mobile-friendly.
3. You may use the CDN Tailwind script (<script src="https://cdn.tailwindcss.com"></script>) and Google Fonts.
4. When the user asks for changes, return the FULL updated HTML document, not a diff.
5. Wrap the full HTML in a fenced code block: \`\`\`html ... \`\`\`
6. IMPORTANT: Before the code block, describe what you did in a clear, human-friendly way. Use a short intro sentence, then 2-5 bullet points (using • character) explaining the specific changes you made. After the code block add nothing.
7. If the user attaches images, analyze them carefully and use them as visual references (logos, mockups, photos to include).
8. Think carefully and produce production-quality work.`;

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
      temperature: 0.7,
      max_tokens: 4096,
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
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
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


