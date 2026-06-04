import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X, Home, Search, Compass, Plug, LayoutGrid, Star, User, Users,
  Clock, Settings, HelpCircle, BookOpen, MessageSquare, LogOut, LogIn,
} from "lucide-react";
import { loadApps, type SavedApp } from "@/lib/apps";
import { onAuthChange, signOut, type AuthUser } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";

type Section = { title?: string; items: { label: string; icon: typeof Home; to?: string; shortcut?: string; onClick?: () => void }[] };

export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [apps, setApps] = useState<SavedApp[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (open) setApps(loadApps().slice(0, 6));
  }, [open]);

  useEffect(() => {
    const { data: { subscription } } = onAuthChange(setUser);
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const sections: Section[] = [
    { items: [
      { label: "Home", icon: Home, to: "/dashboard" },
      { label: "Search", icon: Search, shortcut: "Ctrl K" },
      { label: "Resources", icon: BookOpen },
      { label: "Connectors", icon: Plug },
    ]},
    { title: "Projects", items: [
      { label: "All projects", icon: LayoutGrid, to: "/dashboard" },
      { label: "Starred", icon: Star },
      { label: "Created by me", icon: User, to: "/dashboard" },
      { label: "Shared with me", icon: Users },
    ]},
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="fixed left-0 top-0 bottom-0 z-[61] w-72 flex flex-col"
        style={{ background: "#0a0c12", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg grid place-items-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>N</div>
            <span className="text-sm font-medium text-white">Nirpesh's Lovable</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 text-white/60">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {sections.map((sec, i) => (
            <div key={i} className="mb-4">
              {sec.title && (
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {sec.title}
                </div>
              )}
              {sec.items.map((it) => {
                const Icon = it.icon;
                const inner = (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 cursor-pointer">
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{it.label}</span>
                    {it.shortcut && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                        {it.shortcut}
                      </span>
                    )}
                  </div>
                );
                return it.to ? (
                  <Link key={it.label} to={it.to} onClick={onClose}>{inner}</Link>
                ) : (
                  <div key={it.label} onClick={it.onClick}>{inner}</div>
                );
              })}
            </div>
          ))}

          {apps.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                <Clock className="h-3 w-3" /> Recents
              </div>
              {apps.map((a) => (
                <Link key={a.id} to="/app/$id" params={{ id: a.id }} onClick={onClose}>
                  <div className="px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 truncate">
                    {a.title}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer — user */}
        <div className="border-t px-2 py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {user ? (
            <>
              <div className="flex items-center gap-2.5 px-3 py-2">
                <div className="h-8 w-8 rounded-full grid place-items-center text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)" }}>
                  {(user.displayName || user.email)[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{user.displayName || user.email.split("@")[0]}</div>
                  <div className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{user.email}</div>
                </div>
              </div>
              <Link to="/settings" onClick={onClose}>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5">
                  <User className="h-4 w-4" /><span>Profile</span>
                </div>
              </Link>
              <Link to="/settings" onClick={onClose}>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5">
                  <Settings className="h-4 w-4" /><span className="flex-1">Settings</span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Ctrl .</span>
                </div>
              </Link>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 cursor-pointer">
                <HelpCircle className="h-4 w-4" /><span>Support</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 cursor-pointer">
                <BookOpen className="h-4 w-4" /><span>Documentation</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 cursor-pointer">
                <MessageSquare className="h-4 w-4" /><span>Community</span>
              </div>
              <button onClick={async () => { await signOut(); onClose(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                <LogOut className="h-4 w-4" /><span>Sign out</span>
              </button>
            </>
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>
              <LogIn className="h-4 w-4" /> Sign in
            </button>
          )}
        </div>
      </aside>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
    </>
  );
}
