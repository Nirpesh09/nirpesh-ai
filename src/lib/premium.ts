const KEY = "nirpesh.premium.v1";

const FOREVER_FREE_EMAILS = ["parul@gmail.com", "parulnirpesh@gmail.com"];

export function isPremiumEmail(email?: string | null): boolean {
  if (!email) return false;
  return FOREVER_FREE_EMAILS.includes(email.trim().toLowerCase());
}

export function isPremium(email?: string): boolean {
  if (typeof window === "undefined") return false;
  if (email && FOREVER_FREE_EMAILS.includes(email.toLowerCase().trim())) return true;
  return localStorage.getItem(KEY) === "1";
}

export function setPremium(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, value ? "1" : "0");
}

export function activatePremium() {
  setPremium(true);
}

/** Auto-grant premium for whitelisted emails. */
export function ensurePremiumForEmail(email?: string | null) {
  if (isPremiumEmail(email)) setPremium(true);
}
