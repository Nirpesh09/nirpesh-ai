import { useEffect, useRef, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { AVATAR_COLORS, AVATAR_EMOJIS, loadProfile, saveProfile, type Profile } from "@/lib/profile";

export function UserMenu() {
  const [profile, setProfile] = useState<Profile>({ name: "You", emoji: "🦊", color: "#a855f7" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setDraft(p);
  }, []);

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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid place-items-center h-9 w-9 rounded-full text-lg shadow-soft border-2 border-white hover:scale-105 transition-transform"
        style={{ backgroundColor: profile.color }}
        aria-label="Your profile"
      >
        <span>{profile.emoji}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-card shadow-soft p-4 z-50">
          {!editing ? (
            <>
              <div className="flex items-center gap-3">
                <div
                  className="grid place-items-center h-12 w-12 rounded-full text-2xl shadow-soft"
                  style={{ backgroundColor: profile.color }}
                >
                  {profile.emoji}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{profile.name}</div>
                  <div className="text-xs text-muted-foreground">Local profile</div>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border py-2 text-sm hover:bg-accent transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit profile
              </button>
            </>
          ) : (
            <>
              <div className="text-sm font-medium mb-2">Your name</div>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-brand/50"
                placeholder="Your name"
                maxLength={32}
              />
              <div className="text-sm font-medium mt-4 mb-2">Avatar</div>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setDraft({ ...draft, emoji: e })}
                    className={`grid place-items-center h-9 rounded-lg text-lg border-2 transition-colors ${
                      draft.emoji === e ? "border-brand bg-accent" : "border-transparent hover:bg-accent"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="text-sm font-medium mt-4 mb-2">Color</div>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setDraft({ ...draft, color: c })}
                    className="h-7 w-7 rounded-full grid place-items-center text-white"
                    style={{ backgroundColor: c }}
                  >
                    {draft.color === c && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </button>
                ))}
              </div>
              <button
                onClick={save}
                className="mt-4 w-full rounded-xl py-2 text-sm font-medium bg-gradient-brand text-white shadow-glow"
              >
                Save
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
