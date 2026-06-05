// Lightweight client-side error reporter.
// Captures runtime exceptions with stack traces and stores them in
// localStorage so they can be inspected later (and shown in the error UI).

export type ReportedError = {
  id: string;
  message: string;
  stack?: string;
  source?: string;
  url: string;
  userAgent: string;
  at: number;
};

const STORAGE_KEY = "nirpesh.errors.v1";
const MAX_ENTRIES = 25;

function safeRead(): ReportedError[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(items: ReportedError[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ENTRIES)));
  } catch {
    /* quota / unavailable */
  }
}

export function getReportedErrors(): ReportedError[] {
  if (typeof window === "undefined") return [];
  return safeRead();
}

export function clearReportedErrors() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function reportError(error: unknown, source?: string) {
  if (typeof window === "undefined") return;
  const err =
    error instanceof Error
      ? error
      : new Error(typeof error === "string" ? error : "Unknown error");

  const entry: ReportedError = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    message: err.message,
    stack: err.stack,
    source,
    url: window.location.href,
    userAgent: window.navigator.userAgent,
    at: Date.now(),
  };

  // Always log to console for live debugging.
  // eslint-disable-next-line no-console
  console.error("[nirpesh:error]", entry);

  const items = safeRead();
  items.unshift(entry);
  safeWrite(items);
}

let installed = false;
export function installGlobalErrorReporter() {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  window.addEventListener("error", (e) => {
    reportError(e.error ?? e.message, "window.onerror");
  });
  window.addEventListener("unhandledrejection", (e) => {
    reportError(e.reason, "unhandledrejection");
  });
}
