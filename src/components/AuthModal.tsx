import { useState } from "react";
import { X, Loader2, Mail, Lock, User, Zap } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export function AuthModal({ onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (tab === "signup") {
        await signUp(email, password, name);
        setSuccess("Account created! Check your email to confirm, then sign in.");
      } else {
        await signIn(email, password);
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border bg-card shadow-soft p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-brand text-white">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-semibold">Sign in to Nirpesh</span>
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-muted mb-6">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand/50 transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand/50 transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-xs px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-green-500/10 text-green-600 text-xs px-3 py-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 bg-gradient-brand text-white text-sm font-medium shadow-glow disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
            className="text-brand hover:underline"
          >
            {tab === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
