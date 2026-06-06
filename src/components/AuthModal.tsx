import { useState, useEffect } from "react";
import { X, Loader2, Mail, Lock, User, Zap, KeyRound, ArrowLeft } from "lucide-react";
import { signIn, signUp, sendEmailOtp, verifyEmailOtp } from "@/lib/auth";
import { lovable } from "@/integrations/lovable";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type Tab = "signin" | "signup" | "otp";

export function AuthModal({ onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/dashboard",
      });
      if (result.error) {
        setError(result.error instanceof Error ? result.error.message : "Google sign-in failed");
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return; // browser navigating away
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  // Countdown for OTP resend
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const sendOtp = async () => {
    setError(null); setSuccess(null);
    if (!email) { setError("Enter your email first"); return; }
    setLoading(true);
    try {
      await sendEmailOtp(email);
      setOtpSent(true);
      setTab("otp");
      setResendIn(45);
      setSuccess(`We sent a 6-digit code to ${email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setError(null);
    if (otp.length < 6) { setError("Enter the 6-digit code"); return; }
    setLoading(true);
    try {
      await verifyEmailOtp(email, otp);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally { setLoading(false); }
  };

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
          <span className="font-semibold text-white">
            {tab === "otp" ? "Verify your email" : "Sign in to Nirpesh"}
          </span>
        </div>

        {tab === "otp" ? (
          <div className="space-y-4">
            <button
              onClick={() => { setTab("signin"); setOtp(""); setError(null); setSuccess(null); }}
              className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#94a3b8]"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>

            <div className="rounded-xl bg-brand/10 border border-brand/20 text-[#cbd5e1] text-xs px-3 py-2.5">
              We sent a 6-digit code to <span className="text-white font-medium">{email}</span>. Enter it below.
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                placeholder="123456"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full rounded-xl border border-[#1e293b] bg-[#080b10] pl-9 pr-3 py-3 text-center text-lg tracking-[0.5em] font-mono outline-none focus:border-brand/50 text-white placeholder:text-[#334155]"
              />
            </div>

            {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2">{error}</div>}
            {success && <div className="rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-2">{success}</div>}

            <button
              onClick={verifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full rounded-xl py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify & Sign In
            </button>

            <button
              onClick={sendOtp}
              disabled={loading || resendIn > 0}
              className="w-full text-xs text-[#64748b] hover:text-brand disabled:opacity-50"
            >
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </div>
        ) : (
          <>
            {/* Google Sign-In via Lovable managed OAuth */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full mb-4 h-11 rounded-xl border border-[#1e293b] bg-white text-[#0a0d14] text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.22-4.74 3.22-8.3z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.85 14.12A6.96 6.96 0 015.5 12c0-.74.13-1.45.35-2.12V7.04H2.18A11 11 0 001 12c0 1.78.43 3.46 1.18 4.96l3.67-2.84z"/>
                  <path fill="#EA4335" d="M12 5.4c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.1 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.67 2.84C6.71 7.33 9.14 5.4 12 5.4z"/>
                </svg>
              )}
              Continue with Google
            </button>

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

            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1e293b]" />
              <span className="text-[10px] uppercase tracking-wider text-[#475569]">or</span>
              <div className="flex-1 h-px bg-[#1e293b]" />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || !email}
              className="mt-3 w-full rounded-xl py-2.5 border border-[#1e293b] bg-[#0f1117] hover:bg-[#1e293b] text-[#cbd5e1] text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Email me a 6-digit code
            </button>

            <p className="text-center text-xs text-[#475569] mt-4">
              {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(null); setSuccess(null); }}
                className="text-brand hover:underline">
                {tab === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
