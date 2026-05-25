const KEY = "nirpesh.credits.v1";
const INIT_KEY = "nirpesh.credits.initialized.v1";
const FREE_CREDITS = 10;
const CREDIT_COST = 1;

export function initCredits() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(INIT_KEY)) {
    localStorage.setItem(KEY, String(FREE_CREDITS));
    localStorage.setItem(INIT_KEY, "1");
  }
}

export function getCredits(): number {
  if (typeof window === "undefined") return FREE_CREDITS;
  initCredits();
  return parseInt(localStorage.getItem(KEY) ?? String(FREE_CREDITS), 10);
}

export function deductCredit(): boolean {
  const current = getCredits();
  if (current <= 0) return false;
  localStorage.setItem(KEY, String(current - CREDIT_COST));
  return true;
}

export function addCredits(n: number) {
  const current = getCredits();
  localStorage.setItem(KEY, String(current + n));
}

export function hasCredits(): boolean {
  return getCredits() > 0;
}

export const COST_PER_GEN = CREDIT_COST;
