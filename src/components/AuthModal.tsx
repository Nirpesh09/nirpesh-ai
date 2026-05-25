import { useState, useEffect, useRef } from "react";
import { X, Loader2, Mail, Lock, User, Zap } from "lucide-react";
import { signIn, signUp, notifyAuthChange } from "@/lib/auth";
import { renderGoogleButton, type GoogleUser } from "@/lib/google-auth";

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
  const [googleReady, setGoogleReady] = useState(false);

  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!googleBtnRef.current) return;
    renderGoogleButton(
      googleBtnRef.current,
      (_user: GoogleUser) => {
        // Notify the whole app that auth changed
        notifyAuthChange();
        onSuccess();
        onClose();
      },
      (_err) => {
        setError("Google Sign-In failed. Please check the setup or use email instead.");
      },
    );
    setGoogleReady(true);
  }, [onSuccess, onClose]);

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#1e293b] bg-[#0a0d14] shadow-2xl p-6 z-10">
        <button onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1e293b] text-[#475569]">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <div className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-brand text-white">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-semibold text-white">Sign in to Nirpesh</span>
        </div>

        {/* Google Sign-In Button rendered by Google SDK */}
        <div
          ref={googleBtnRef}
          className="w-full mb-4 flex items-center justify-center overflow-hidden rounded-xl"
          style={{ minHeight: "44px" }}
        />
        {!googleReady && (
          <div className="w-full mb-4 h-11 rounded-xl bg-[#1e293b] animate-pulse" />
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#1e293b]" />
          <span className="text-xs text-[#475569]">or continue with email</span>
          <div className="flex-1 h-px bg-[#1e293b]" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[#0f1117] mb-5 border border-[#1e293b]">
          {(["signin", "signup"] as const).map((t) => (
            <button key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null); }}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-[#1e293b] text-white" : "text-[#475569] hover:text-[#94a3b8]"
              }`}>
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
              <input type="text" placeholder="Your name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#1e293b] bg-[#080b10] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand/50 text-white placeholder:text-[#334155]" />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
            <input type="email" placeholder="Email address" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#1e293b] bg-[#080b10] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand/50 text-white placeholder:text-[#334155]" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
            <input type="password" placeholder="Password" value={password} required minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#1e293b] bg-[#080b10] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand/50 text-white placeholder:text-[#334155]" />
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2">{error}</div>
          )}
          {success && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-2">{success}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full rounded-xl py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {tab === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-[#475569] mt-4">
          {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
            className="text-brand hover:underline">
            {tab === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
