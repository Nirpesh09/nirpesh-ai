import { createServerFn } from "@tanstack/react-start";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Nirpesh, an expert AI web developer. The user is building a single-page web app inside a sandboxed iframe.

RULES:
1. Always respond with a SINGLE complete, self-contained HTML document (including <!DOCTYPE html>, <html>, <head>, <body>, inline <style>, and inline <script>).
2. Use modern CSS, beautiful typography, gradients, subtle animations. Mobile-friendly.
3. NO external scripts except CDN Tailwind via <script src="https://cdn.tailwindcss.com"></script> when useful, and Google Fonts.
4. When the user asks for changes, return the FULL updated HTML document, not a diff.
5. Wrap the full HTML in a fenced code block: \`\`\`html ... \`\`\`
6. Before the code block, briefly (1-3 sentences) describe what you built or changed. After the code block add nothing.
7. Think carefully and produce production-quality work.`;

export const chatWithNirpesh = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatMessage[] }) => {
    if (!input || !Array.isArray(input.messages)) throw new Error("messages required");
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) throw new Error("MISTRAL_API_KEY is not configured");

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Mistral error", res.status, text);
      throw new Error(`Mistral API ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
