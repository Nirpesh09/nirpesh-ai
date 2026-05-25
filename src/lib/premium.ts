const KEY = "nirpesh.premium.v1";

export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function setPremium(value: boolean) {
  localStorage.setItem(KEY, value ? "1" : "0");
}

export function activatePremium() {
  setPremium(true);
  // In production this would verify a real payment
}
