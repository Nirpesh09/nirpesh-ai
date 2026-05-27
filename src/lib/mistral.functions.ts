import { createServerFn } from "@tanstack/react-start";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type ModelChoice = "nirpesh" | "nirpesh-g";
export type ChatMode = "build" | "chat";

const BUILD_PROMPT = `You are Nirpesh, an expert AI web developer. The user is building a single-page web app inside a sandboxed iframe.

RULES:
1. Always respond with a SINGLE complete, self-contained HTML document (including <!DOCTYPE html>, <html>, <head>, <body>, inline <style>, and inline <script>).
2. Use modern CSS, beautiful typography, gradients, subtle animations. Mobile-friendly.
3. You may use the CDN Tailwind script (<script src="https://cdn.tailwindcss.com"></script>) and Google Fonts.
4. When the user asks for changes, return the FULL updated HTML document, not a diff.
5. Wrap the full HTML in a fenced code block: \`\`\`html ... \`\`\`
6. IMPORTANT: Before the code block, describe what you did in a clear, human-friendly way. Use a short intro sentence, then 2-5 bullet points (using • character) explaining the specific changes you made. After the code block add nothing.
8. Think carefully and produce production-quality work.`;

const CHAT_PROMPT = `You are Nirpesh, a friendly AI web-app collaborator. The user wants to DISCUSS their app — do NOT write code in this turn.

RULES:
1. Reply conversationally, like a thoughtful designer/developer talking with the user.
2. Ask clarifying questions when the request is ambiguous (color, layout, features, audience, tone).
3. Suggest 2-4 concrete options or improvements using • bullets where helpful.
4. Be concise (under ~150 words). End with a question or a "Want me to build this?" prompt.
5. NEVER include <html>, code blocks, or HTML tags. Pure conversation only.`;


async function callMistral(messages: ChatMessage[]) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not configured");
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) throw new Error(`Mistral ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return (json.choices?.[0]?.message?.content as string) ?? "";
}

async function callGemini(messages: ChatMessage[]) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY is not configured");
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: { text?: string }) => p.text ?? "").join("");
}

export const chatWithNirpesh = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatMessage[]; model?: ModelChoice }) => {
    if (!input || !Array.isArray(input.messages)) throw new Error("messages required");
    return { messages: input.messages, model: input.model ?? "nirpesh" };
  })
  .handler(async ({ data }) => {
    const content = data.model === "nirpesh-g"
      ? await callGemini(data.messages)
      : await callMistral(data.messages);
    return { content };
  });
