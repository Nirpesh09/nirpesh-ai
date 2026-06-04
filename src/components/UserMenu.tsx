import { useEffect, useRef, useState } from "react";
import {
  Check, Pencil, LogOut, LogIn, Settings, Zap, Clock,
  Crown, ChevronRight, X, User, Bell, Palette, Shield,
} from "lucide-react";
import { AVATAR_COLORS, AVATAR_EMOJIS, loadProfile, saveProfile, type Profile } from "@/lib/profile";
import { onAuthChange, signOut, type AuthUser } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";
import { getCredits } from "@/lib/credits";
import { isPremium } from "@/lib/premium";
import { loadApps, type SavedApp } from "@/lib/apps";
import { Link } from "@tanstack/react-router";

export function UserMenu() {
  const [profile, setProfile] = useState<Profile>({ name: "You", emoji: "🦊", color: "#a855f7" });
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [showAuth, setShowAuth] = useState(false);
  const [credits, setCredits] = useState(10);
  const [premium, setPremium] = useState(false);
  const [recentApps, setRecentApps] = useState<SavedApp[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setDraft(p);
    setCredits(getCredits());
    setPremium(isPremium());
    setRecentApps(loadApps().slice(0, 3));

    const { data: { subscription } } = onAuthChange((user) => {
      setAuthUser(user);
      if (user) {
        const currentProfile = loadProfile();
        if (!currentProfile.name || currentProfile.name === "You") {
          const updated = { ...currentProfile, name: user.displayName || user.email.split("@")[0] };
          saveProfile(updated);
          setProfile(updated);
          setDraft(updated);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (open) {
      setCredits(getCredits());
      setPremium(isPremium());
      setRecentApps(loadApps().slice(0, 3));
    }
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const save = () => {
    const next = { ...draft, name: draft.name.trim() || "You" };
    saveProfile(next);
    setProfile(next);
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthUser(null);
    setOpen(false);
  };

  const displayName = authUser?.displayName || authUser?.email?.split("@")[0] || profile.name;
  const displayEmail = authUser?.email;

  const creditColor = credits === 0 ? "#ef4444" : credits <= 3 ? "#f97316" : "#4ade80";

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid place-items-center h-9 w-9 rounded-full text-lg shadow-soft border-2 border-white/20 hover:scale-105 transition-transform relative"
          style={{ backgroundColor: profile.color }}
          aria-label="Your profile"
        >
          <span>{profile.emoji}</span>
          {/* Credit dot indicator */}
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
            style={{ backgroundColor: creditColor }}
          />
        </button>

        {open && !editing && (
          <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#1e293b] bg-[#0a0d14] shadow-2xl z-50 overflow-hidden">
            {/* Header — user info */}
            <div className="px-4 pt-4 pb-3 border-b border-[#1e293b]"
              style={{ background: "linear-gradient(135deg, #0f1117 0%, #0a0d14 100%)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="grid place-items-center h-11 w-11 rounded-full text-xl shrink-0 border-2 border-white/10"
                  style={{ backgroundColor: profile.color }}
                >
                  {profile.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white truncate flex items-center gap-1.5">
                    {displayName}
                    {premium && (
                      <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white" }}>
                        <Crown className="h-2.5 w-2.5" /> PRO
                      </span>
                    )}
                  </div>
                  {displayEmail ? (
                    <div className="text-xs text-[#475569] truncate">{displayEmail}</div>
                  ) : (
                    <div className="text-xs text-[#475569]">Not signed in</div>
                  )}
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[#1e293b] text-[#475569]">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ── CREDITS BANNER ── */}
            <div className="mx-3 mt-3 rounded-xl border border-[#1e293b] bg-[#0f1117] p-3 flex items-center gap-3">
              <div className="grid place-items-center h-9 w-9 rounded-xl shrink-0"
                style={{ background: credits === 0 ? "#ef444420" : credits <= 3 ? "#f9731620" : "#4ade8020" }}>
                <Zap className="h-4 w-4" style={{ color: creditColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{credits} credit{credits !== 1 ? "s" : ""} remaining</div>
                <div className="text-xs text-[#475569]">
                  {credits === 0 ? "Out of credits — upgrade to continue" : credits <= 3 ? "Running low — upgrade soon" : "Each build costs 1 credit"}
                </div>
              </div>
              {!premium && (
                <span className="text-[10px] px-2 py-1 rounded-lg text-[#a78bfa] font-medium shrink-0"
                  style={{ background: "#7c3aed20", border: "1px solid #7c3aed30" }}>
                  $1/mo
                </span>
              )}
            </div>

            {/* ── RECENT PROJECTS ── */}
            {recentApps.length > 0 && (
              <div className="mx-3 mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#334155] font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Recent projects
                  </span>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="text-[10px] text-[#475569] hover:text-[#94a3b8]">
                    View all
                  </Link>
                </div>
                <div className="space-y-1">
                  {recentApps.map((app) => (
                    <Link
                      key={app.id}
                      to="/app/$id"
                      params={{ id: app.id }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#1e293b] transition-colors group"
                    >
                      <div className="h-8 w-10 rounded-lg overflow-hidden bg-white shrink-0 border border-[#1e293b]">
                        <iframe
                          title={app.title}
                          srcDoc={app.html}
                          sandbox=""
                          className="w-full h-full pointer-events-none"
                          style={{ transform: "scale(0.25)", transformOrigin: "top left", width: "400%", height: "400%" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-[#e2e8f0] truncate">{app.title}</div>
                        <div className="text-[10px] text-[#475569]">
                          {new Date(app.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-[#334155] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS LINKS ── */}
            <div className="mx-3 mt-3 space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-[#334155] font-semibold px-1 mb-1.5">Settings</div>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span className="text-xs font-medium flex-1">Account & Profile</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#334155]" />
              </Link>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              >
                <Palette className="h-3.5 w-3.5" />
                <span className="text-xs font-medium flex-1">Appearance & Theme</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#334155]" />
              </Link>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="text-xs font-medium flex-1">Notifications</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#334155]" />
              </Link>

              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="text-xs font-medium flex-1">Privacy & Data</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#334155]" />
              </Link>

              <button
                onClick={() => { setEditing(true); }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="text-xs font-medium flex-1">Edit avatar</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#334155]" />
              </button>
            </div>

            {/* ── SIGN IN / OUT ── */}
            <div className="p-3 mt-2 border-t border-[#1e293b]">
              {authUser ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 py-2 px-3 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { setOpen(false); setShowAuth(true); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                >
                  <LogIn className="h-3.5 w-3.5" /> Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}

        {/* Avatar editor panel */}
        {open && editing && (
          <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#1e293b] bg-[#0a0d14] shadow-2xl z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">Edit Avatar</span>
              <button onClick={() => setEditing(false)} className="p-1 rounded-lg hover:bg-[#1e293b] text-[#475569]">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <label className="text-xs text-[#475569]">Display name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-[#1e293b] bg-[#080b10] px-3 py-2 text-sm outline-none focus:border-brand/50 text-white"
              placeholder="Your name"
              maxLength={32}
            />

            <div className="text-xs text-[#475569] mt-4 mb-2">Choose emoji</div>
            <div className="grid grid-cols-6 gap-1.5">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setDraft({ ...draft, emoji: e })}
                  className={`grid place-items-center h-9 rounded-xl text-lg border-2 transition-colors ${
                    draft.emoji === e ? "border-brand bg-[#1e293b]" : "border-transparent hover:bg-[#1e293b]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#475569] mt-4 mb-2">Avatar color</div>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setDraft({ ...draft, color: c })}
                  className="h-7 w-7 rounded-full grid place-items-center border-2 text-white"
                  style={{ backgroundColor: c, borderColor: draft.color === c ? "white" : "transparent" }}
                >
                  {draft.color === c && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </button>
              ))}
            </div>

            <button
              onClick={save}
              className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Save changes
            </button>
          </div>
        )}
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </>
  );
}
