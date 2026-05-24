export type Profile = { name: string; emoji: string; color: string };

const KEY = "nirpesh.profile.v1";
const DEFAULTS: Profile = { name: "You", emoji: "🦊", color: "#a855f7" };

export function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export const AVATAR_EMOJIS = ["🦊", "🐼", "🐯", "🦄", "🐙", "🦉", "🐳", "🐲", "👾", "🤖", "🧙", "🚀"];
export const AVATAR_COLORS = ["#a855f7", "#ec4899", "#f97316", "#eab308", "#10b981", "#06b6d4", "#3b82f6", "#6366f1"];
