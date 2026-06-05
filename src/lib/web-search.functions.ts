import { createServerFn } from "@tanstack/react-start";

export type WebSearchResult = {
  title: string;
  url: string;
  description: string;
  markdown?: string;
};

export type WebSearchResponse = {
  query: string;
  results: WebSearchResult[];
  error?: string;
};

// Server function: Google-style web search via Firecrawl.
export const webSearch = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string; limit?: number; withContent?: boolean }) => {
    if (!input || typeof input.query !== "string" || !input.query.trim()) {
      throw new Error("query required");
    }
    const limit = Math.max(1, Math.min(input.limit ?? 5, 10));
    return { query: input.query.trim(), limit, withContent: !!input.withContent };
  })
  .handler(async ({ data }): Promise<WebSearchResponse> => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return { query: data.query, results: [], error: "Web search is not configured." };
    }

    try {
      const body: Record<string, unknown> = {
        query: data.query,
        limit: data.limit,
      };
      if (data.withContent) {
        body.scrapeOptions = { formats: ["markdown"] };
      }

      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return {
          query: data.query,
          results: [],
          error: `Search failed (${res.status}): ${text.slice(0, 160)}`,
        };
      }

      const json: unknown = await res.json();
      // v2 returns either { data: { web: [...] } } or { data: [...] }; normalize.
      const root = (json as { data?: unknown }).data ?? json;
      const list: unknown[] = Array.isArray(root)
        ? (root as unknown[])
        : Array.isArray((root as { web?: unknown[] }).web)
          ? ((root as { web: unknown[] }).web)
          : [];

      const results: WebSearchResult[] = list.slice(0, data.limit).map((r) => {
        const item = r as {
          title?: string;
          url?: string;
          description?: string;
          snippet?: string;
          markdown?: string;
        };
        return {
          title: item.title ?? item.url ?? "Untitled",
          url: item.url ?? "",
          description: item.description ?? item.snippet ?? "",
          markdown: data.withContent ? item.markdown : undefined,
        };
      });

      return { query: data.query, results };
    } catch (err) {
      return {
        query: data.query,
        results: [],
        error: err instanceof Error ? err.message : "Web search failed",
      };
    }
  });
