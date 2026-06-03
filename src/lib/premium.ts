const KEY = "nirpesh.premium.v1";

export const PREMIUM_EMAILS = ["parulnirpesh@gmail.com"];

export function isPremiumEmail(email?: string | null): boolean {
  if (!email) return false;
  return PREMIUM_EMAILS.includes(email.trim().toLowerCase());
}

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
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
