export type SavedApp = {
  id: string;
  title: string;
  prompt: string;
  html: string;
  messages: { role: "user" | "assistant"; content: string }[];
  createdAt: number;
  updatedAt: number;
};

const KEY = "nirpesh.apps.v1";

export function loadApps(): SavedApp[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedApp[];
  } catch {
    return [];
  }
}

export function saveApp(app: SavedApp) {
  const apps = loadApps().filter((a) => a.id !== app.id);
  apps.unshift(app);
  localStorage.setItem(KEY, JSON.stringify(apps.slice(0, 60)));
}

export function getApp(id: string): SavedApp | null {
  return loadApps().find((a) => a.id === id) ?? null;
}

export function deleteApp(id: string) {
  localStorage.setItem(KEY, JSON.stringify(loadApps().filter((a) => a.id !== id)));
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function titleFromPrompt(p: string) {
  return p.replace(/\s+/g, " ").trim().slice(0, 60) || "Untitled app";
}
