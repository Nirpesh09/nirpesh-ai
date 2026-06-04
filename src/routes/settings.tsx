import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Moon, Sun, Palette, Bell, Shield, Database, Trash2,
  User, Key, Zap, Crown, Check, LogIn, Mail, Lock, Globe,
  ChevronRight, Smartphone, Download,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { loadProfile, saveProfile, AVATAR_EMOJIS, AVATAR_COLORS } from "@/lib/profile";
import { loadModel, saveModel, type ModelId } from "@/lib/models";
import { onAuthChange, type AuthUser } from "@/lib/auth";
import { getCredits, addCredits } from "@/lib/credits";
import { isPremium, activatePremium } from "@/lib/premium";
import { PremiumModal } from "@/components/PremiumModal";

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
        checked ? "bg-gradient-brand" : "bg-[#1e293b]"
      }`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function Section({ title, icon: Icon, badge, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0f1117] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e293b] bg-[#0a0d14]">
        <Icon className="h-4 w-4 text-brand" />
        <h2 className="text-sm font-semibold text-white flex-1">{title}</h2>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: "linear-gradient(135deg, #7c3aed22, #06b6d422)", color: "#a78bfa", border: "1px solid #7c3aed30" }}>
            {badge}
          </span>
        )}
      </div>
      <div className="divide-y divide-[#1e293b]">{children}</div>
    </div>
  );
}

function Row({ label, description, children, danger }: {
  label: string; description?: string; children?: React.ReactNode; danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="min-w-0">
        <div className={`text-sm font-medium ${danger ? "text-red-400" : "text-[#e2e8f0]"}`}>{label}</div>
        {description && <div className="text-xs text-[#475569] mt-0.5">{description}</div>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function SettingsPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [model, setModel] = useState<ModelId>("nirpesh");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [credits, setCredits] = useState(10);
  const [premium, setPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [profile, setProfile] = useState({ name: "You", emoji: "🦊", color: "#a855f7" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setModel(loadModel());
    setCredits(getCredits());
    setPremium(isPremium());
    const p = loadProfile();
    setProfile(p);
    setDraft(p);

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

  const saveProfile_ = () => {
    const next = { ...draft, name: draft.name.trim() || "You" };
    saveProfile(next);
    setProfile(next);
    setEditingProfile(false);
  };

  const creditColor = credits === 0 ? "#ef4444" : credits <= 3 ? "#f97316" : "#4ade80";

  return (
    <div className="min-h-screen bg-[#080b10]">
      <header className="border-b border-[#1e293b] bg-[#0a0d14]/90 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-5">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-[#1e293b] transition-colors text-[#475569]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
            <p className="text-sm text-[#475569]">Customize your Nirpesh experience</p>
          </div>
        </div>

        {/* ── CREDITS & PLAN ── */}
        <Section title="Credits & Plan" icon={Zap} badge={premium ? "PRO" : "Free"}>
          {/* Credits bar */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#e2e8f0]">Remaining credits</span>
              <span className="text-sm font-bold" style={{ color: creditColor }}>{credits}</span>
            </div>
            <div className="h-2 rounded-full bg-[#1e293b] overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (credits / 10) * 100)}%`,
                  background: credits === 0 ? "#ef4444" : credits <= 3 ? "linear-gradient(90deg, #f97316, #ef4444)" : "linear-gradient(90deg, #22c55e, #4ade80)",
                }} />
            </div>
            <p className="text-xs text-[#475569] mt-1.5">Each app generation costs 1 credit</p>
          </div>

          {!premium ? (
            <Row label="Upgrade to Nirpesh Pro" description="Unlock Nirpesh-G, unlimited builds, and more">
              <button
                onClick={() => setShowPremiumModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              >
                <Crown className="h-3.5 w-3.5" /> Upgrade — $1/mo
              </button>
            </Row>
          ) : (
            <Row label="Nirpesh Pro — Active" description="You have unlimited builds and access to Nirpesh-G">
              <span className="flex items-center gap-1 text-xs font-medium text-[#4ade80]">
                <Check className="h-3.5 w-3.5" /> Active
              </span>
            </Row>
          )}
        </Section>

        {/* ── ACCOUNT ── */}
        <Section title="Account" icon={User}>
          {authUser ? (
            <>
              <Row label="Email address" description={authUser.email}>
                <span className="flex items-center gap-1 text-[10px] text-[#4ade80] bg-[#4ade8020] px-2 py-0.5 rounded-full">
                  <Check className="h-3 w-3" /> Verified
                </span>
              </Row>
              <Row label="Display name" description={authUser.displayName || "Not set"} />
              <Row label="Account ID" description={authUser.id.slice(0, 20) + "…"} />
              <Row label="Signed in with" description="Email / Password or Google">
                <Globe className="h-4 w-4 text-[#475569]" />
              </Row>
            </>
          ) : (
            <Row label="Not signed in" description="Sign in to sync your apps and settings across devices">
              <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-brand text-white text-xs font-medium">
                <LogIn className="h-3.5 w-3.5" /> Sign In
              </Link>
            </Row>
          )}
        </Section>

        {/* ── PROFILE / AVATAR ── */}
        <Section title="Profile & Avatar" icon={User}>
          <div className="px-5 py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="grid place-items-center h-14 w-14 rounded-2xl text-2xl border-2 border-[#1e293b]"
                style={{ backgroundColor: profile.color }}>
                {profile.emoji}
              </div>
              <div>
                <div className="font-semibold text-white">{profile.name}</div>
                <button onClick={() => setEditingProfile((v) => !v)}
                  className="text-xs text-brand hover:underline mt-0.5">
                  {editingProfile ? "Cancel" : "Edit avatar"}
                </button>
              </div>
            </div>

            {editingProfile && (
              <div className="space-y-4 pt-3 border-t border-[#1e293b]">
                <div>
                  <label className="text-xs text-[#475569]">Display name</label>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#1e293b] bg-[#080b10] px-3 py-2 text-sm outline-none focus:border-brand/50 text-white"
                    maxLength={32}
                  />
                </div>
                <div>
                  <label className="text-xs text-[#475569] mb-2 block">Emoji</label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {AVATAR_EMOJIS.map((e) => (
                      <button key={e} onClick={() => setDraft({ ...draft, emoji: e })}
                        className={`grid place-items-center h-9 rounded-xl text-lg border-2 transition-colors ${draft.emoji === e ? "border-brand bg-[#1e293b]" : "border-transparent hover:bg-[#1e293b]"}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#475569] mb-2 block">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_COLORS.map((c) => (
                      <button key={c} onClick={() => setDraft({ ...draft, color: c })}
                        className="h-7 w-7 rounded-full grid place-items-center border-2 text-white"
                        style={{ backgroundColor: c, borderColor: draft.color === c ? "white" : "transparent" }}>
                        {draft.color === c && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={saveProfile_}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                  Save changes
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* ── AI MODEL ── */}
        <Section title="AI Model" icon={Key}>
          <Row label="Default model" description="Which AI powers your app builds">
            <div className="flex gap-2">
              {(["nirpesh", "nirpesh-g"] as ModelId[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setModelAndSave(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    model === m ? "bg-gradient-brand text-white border-transparent" : "border-[#1e293b] bg-[#0f1117] hover:bg-[#1e293b] text-[#94a3b8]"
                  }`}
                >
                  {m === "nirpesh" ? "Nirpesh" : "Nirpesh-G ⭐"}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* ── APPEARANCE ── */}
        <Section title="Appearance" icon={Palette}>
          <Row label="Theme" description="Light or dark mode">
            <div className="flex gap-1 p-1 rounded-xl bg-[#1e293b]">
              <button
                onClick={() => setThemeAndSave("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${theme === "light" ? "bg-[#0f1117] text-white shadow" : "text-[#475569]"}`}
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
              <button
                onClick={() => setThemeAndSave("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${theme === "dark" ? "bg-[#0f1117] text-white shadow" : "text-[#475569]"}`}
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

        {/* ── NOTIFICATIONS ── */}
        <Section title="Notifications" icon={Bell}>
          <Row label="Build complete" description="Get notified when your app finishes building">
            <Toggle checked={notifications} onChange={setBool("notifications", setNotifications)} />
          </Row>
          <Row label="Credit warnings" description="Alert when you're running low on credits">
            <Toggle checked={true} onChange={() => {}} />
          </Row>
        </Section>

        {/* ── EDITOR ── */}
        <Section title="Editor" icon={Database}>
          <Row label="Auto-save changes" description="Automatically save visual edits to local storage">
            <Toggle checked={autoSave} onChange={setBool("autoSave", setAutoSave)} />
          </Row>
          <Row label="Export apps" description="Download your built apps as HTML files">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:bg-[#1e293b] transition-colors">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </Row>
        </Section>

        {/* ── SECURITY ── */}
        <Section title="Security" icon={Lock}>
          <Row label="Two-factor authentication" description="Add an extra layer of security to your account">
            <button className="flex items-center gap-1 text-xs text-[#475569] hover:text-[#94a3b8]">
              Set up <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </Row>
          <Row label="Connected apps" description="Manage third-party apps that can access your account">
            <button className="flex items-center gap-1 text-xs text-[#475569] hover:text-[#94a3b8]">
              Manage <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </Row>
        </Section>

        {/* ── PRIVACY & DATA ── */}
        <Section title="Privacy & Data" icon={Shield}>
          <Row label="Storage" description="Your apps are stored privately in your browser" />
          <Row label="Usage data" description="Help improve Nirpesh by sharing anonymous usage data">
            <Toggle checked={true} onChange={() => {}} />
          </Row>
          <Row label="Clear all apps" description="Permanently delete all saved apps from this device" danger>
            <button
              onClick={clearAllApps}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete all
            </button>
          </Row>
        </Section>

        <p className="text-center text-xs text-[#334155] pb-6">
          Nirpesh v1.0 · Built with ♥ using AI
        </p>
      </main>

      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onUnlocked={() => {
            setPremium(true);
            setShowPremiumModal(false);
          }}
        />
      )}
    </div>
  );
}
