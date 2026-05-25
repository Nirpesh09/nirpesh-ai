import { createServerFn } from "@tanstack/react-start";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "nirpesh-app";
}

export const pushToGithub = createServerFn({ method: "POST" })
  .inputValidator((input: { title: string; html: string; prompt?: string }) => {
    if (!input?.html) throw new Error("html required");
    return input;
  })
  .handler(async ({ data }) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not configured");

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };

    // get user
    const u = await fetch("https://api.github.com/user", { headers });
    if (!u.ok) throw new Error(`GitHub auth failed: ${u.status} ${(await u.text()).slice(0, 200)}`);
    const user = (await u.json()) as { login: string };

    const repoName = `${slugify(data.title)}-${Math.random().toString(36).slice(2, 6)}`;

    // create repo
    const c = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: repoName,
        description: data.prompt?.slice(0, 200) || "Built with Nirpesh",
        private: false,
        auto_init: true,
      }),
    });
    if (!c.ok) throw new Error(`Create repo failed: ${c.status} ${(await c.text()).slice(0, 200)}`);
    const repo = (await c.json()) as { html_url: string; default_branch: string };

    // get existing README sha (auto_init makes one)
    const writeFile = async (path: string, content: string, message: string) => {
      const getRes = await fetch(`https://api.github.com/repos/${user.login}/${repoName}/contents/${path}`, { headers });
      const sha = getRes.ok ? ((await getRes.json()) as { sha: string }).sha : undefined;
      const put = await fetch(`https://api.github.com/repos/${user.login}/${repoName}/contents/${path}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message,
          content: Buffer.from(content, "utf-8").toString("base64"),
          ...(sha ? { sha } : {}),
        }),
      });
      if (!put.ok) throw new Error(`Write ${path} failed: ${put.status} ${(await put.text()).slice(0, 200)}`);
    };

    await writeFile("index.html", data.html, "Initial commit from Nirpesh");
    await writeFile(
      "README.md",
      `# ${data.title}\n\nBuilt with [Nirpesh](https://nirpesh-ai.lovable.app).\n\n> ${data.prompt ?? ""}\n\nOpen \`index.html\` in a browser.\n`,
      "Add README",
    );

    return { url: repo.html_url, repo: `${user.login}/${repoName}` };
  });
