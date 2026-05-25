import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Moon, Sun, Palette, Bell, Shield, Database, Trash2, User, Key } from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { loadProfile, saveProfile } from "@/lib/profile";
import { loadModel, saveModel, type ModelId } from "@/lib/models";
import { onAuthChange, type AuthUser } from "@/lib/auth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Nirpesh" }] }),
  component: SettingsPage,
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-gradient-brand" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card shadow-soft overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b bg-muted/40">
        <Icon className="h-4 w-4 text-brand" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function SettingsPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [model, setModel] = useState<ModelId>("nirpesh");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    setModel(loadModel());
    const stored = localStorage.getItem("nirpesh:theme") as "light" | "dark" | null;
    if (stored) setTheme(stored);
    const notif = localStorage.getItem("nirpesh:notifications");
    if (notif !== null) setNotifications(notif === "true");
    const as = localStorage.getItem("nirpesh:autoSave");
    if (as !== null) setAutoSave(as === "true");
    const cm = localStorage.getItem("nirpesh:compactMode");
    if (cm !== null) setCompactMode(cm === "true");
    const sc = localStorage.getItem("nirpesh:showCode");
    if (sc !== null) setShowCode(sc === "true");

    const { data: { subscription } } = onAuthChange(setAuthUser);
    return () => subscription.unsubscribe();
  }, []);

  const setModelAndSave = (m: ModelId) => { setModel(m); saveModel(m); };

  const setThemeAndSave = (t: "light" | "dark") => {
    setTheme(t);
    localStorage.setItem("nirpesh:theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  const setBool = (key: string, setter: (v: boolean) => void) => (v: boolean) => {
    setter(v);
    localStorage.setItem(`nirpesh:${key}`, String(v));
  };

  const clearAllApps = () => {
    if (!window.confirm("Delete all saved apps? This cannot be undone.")) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith("nirpesh:app:"))
      .forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem("nirpesh:apps");
    alert("All apps deleted.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Customize your Nirpesh experience</p>
          </div>
        </div>

        {/* Account */}
        <Section title="Account" icon={User}>
          {authUser ? (
            <>
              <Row label="Email" description={authUser.email} />
              <Row label="Display name" description={authUser.displayName || "Not set"} />
              <Row label="Account ID" description={authUser.id.slice(0, 16) + "…"} />
            </>
          ) : (
            <Row label="Not signed in" description="Sign in to sync your apps and settings across devices">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-lg bg-gradient-brand text-white text-xs font-medium"
              >
                Sign In
              </Link>
            </Row>
          )}
        </Section>

        {/* AI Model */}
        <Section title="AI Model" icon={Key}>
          <Row label="Default model" description="Which AI powers your app builds">
            <div className="flex gap-2">
              {(["nirpesh", "nirpesh-g"] as ModelId[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setModelAndSave(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    model === m
                      ? "bg-gradient-brand text-white border-transparent"
                      : "bg-card hover:bg-accent text-muted-foreground"
                  }`}
                >
                  {m === "nirpesh" ? "Nirpesh (Mistral)" : "Nirpesh-G (Gemini)"}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Appearance */}
        <Section title="Appearance" icon={Palette}>
          <Row label="Theme" description="Light or dark mode">
            <div className="flex gap-1 p-1 rounded-xl bg-muted">
              <button
                onClick={() => setThemeAndSave("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  theme === "light" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
                }`}
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
              <button
                onClick={() => setThemeAndSave("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  theme === "dark" ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
                }`}
              >
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>
            </div>
          </Row>
          <Row label="Compact mode" description="Reduce spacing for more content on screen">
            <Toggle checked={compactMode} onChange={setBool("compactMode", setCompactMode)} />
          </Row>
          <Row label="Always show code" description="Open the code tab by default in the editor">
            <Toggle checked={showCode} onChange={setBool("showCode", setShowCode)} />
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
          <Row label="Build notifications" description="Get notified when your app is done building">
            <Toggle checked={notifications} onChange={setBool("notifications", setNotifications)} />
          </Row>
        </Section>

        {/* Auto-save */}
        <Section title="Editor" icon={Database}>
          <Row label="Auto-save changes" description="Automatically save visual edits to local storage">
            <Toggle checked={autoSave} onChange={setBool("autoSave", setAutoSave)} />
          </Row>
        </Section>

        {/* Privacy & Data */}
        <Section title="Privacy & Data" icon={Shield}>
          <Row label="Local storage only" description="Your apps are stored privately in your browser" />
          <Row label="Clear all apps" description="Permanently delete all saved apps from this device">
            <button
              onClick={clearAllApps}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete all
            </button>
          </Row>
        </Section>

        <p className="text-center text-xs text-muted-foreground pb-6">
          Nirpesh v1.0 · Built with ♥ using AI
        </p>
      </main>
    </div>
  );
}
