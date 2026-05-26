import { useState, useEffect, useRef } from "react";
import { X, Loader2, Mail, Lock, User, Zap, KeyRound, ArrowLeft } from "lucide-react";
import { signIn, signUp, notifyAuthChange } from "@/lib/auth";
import { renderGoogleButton, type GoogleUser } from "@/lib/google-auth";
import { supabase } from "@/integrations/supabase/client";

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
  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
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
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
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
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;
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
