import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Mail, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { renderGoogleButton, type GoogleUser } from "@/lib/google-auth";
import { notifyAuthChange, onAuthChange } from "@/lib/auth";

type SearchParams = { next?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — Nirpesh" }] }),
  component: LoginPage,
});

type Step = "email" | "code" | "done";

function LoginPage() {
  const navigate = useNavigate();
  const { next } = useSearch({ from: "/login" });
  const googleRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const redirect = next || "/";

  // Redirect if already logged in
  useEffect(() => {
    const { data: { subscription } } = onAuthChange((user) => {
      if (user) navigate({ to: redirect as "/" });
    });
    return () => subscription.unsubscribe();
  }, [navigate, redirect]);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Render Google button
  useEffect(() => {
    if (!googleRef.current) return;
    renderGoogleButton(
      googleRef.current,
      (_user: GoogleUser) => {
        notifyAuthChange();
        navigate({ to: redirect as "/" });
      },
      (_err) => setError("Google Sign-In unavailable. Please add the app domain to Google Cloud Console."),
    );
  }, [navigate, redirect]);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setStep("code");
      setTimeout(() => codeRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    const token = code.join("");
    if (token.length < 6) return;
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: "email",
      });
      if (error) throw error;
      setStep("done");
      setTimeout(() => navigate({ to: redirect as "/" }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code — try again");
      setCode(["", "", "", "", "", ""]);
      codeRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
  };

  const handleCodeChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
    if (next.every((d) => d)) {
      setTimeout(() => verifyCode(), 100);
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      setTimeout(() => verifyCode(), 100);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#050709" }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: "600px", height: "600px",
            top: "-200px", left: "-200px",
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            animation: "blobMove 8s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "500px", height: "500px",
            bottom: "-150px", right: "-150px",
            background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
            animation: "blobMove 10s ease-in-out infinite alternate-reverse",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm mx-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div
            className="inline-grid place-items-center h-20 w-20 rounded-3xl mb-5 mx-auto"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #4ade80)",
              boxShadow: "0 0 60px rgba(168,85,247,0.4), 0 0 30px rgba(34,197,94,0.2)",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            <span
              className="text-4xl font-black text-white"
              style={{ textShadow: "0 2px 20px rgba(255,255,255,0.4)" }}
            >
              N
            </span>
          </div>

          <h1
            className="text-5xl font-black tracking-tight leading-none"
            style={{
              background: "linear-gradient(135deg, #fff 30%, #a855f7 60%, #4ade80 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Nirpesh
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(148,163,184,0.7)" }}>
            {step === "email" && "Build any app from one prompt"}
            {step === "code" && `Enter the 6-digit code sent to ${email}`}
            {step === "done" && "You're in! Redirecting…"}
          </p>
        </div>

        {/* Main card */}
        <div
          className="rounded-3xl p-7 border"
          style={{
            background: "rgba(10,13,20,0.90)",
            borderColor: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* ── STEP: EMAIL ── */}
          {step === "email" && (
            <>
              {/* Google Button */}
              <div
                ref={googleRef}
                className="w-full flex items-center justify-center overflow-hidden rounded-2xl"
                style={{ minHeight: "48px" }}
              />

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                <span className="text-xs" style={{ color: "rgba(100,116,139,0.8)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>

              <form onSubmit={sendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "#64748b" }}>
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#475569" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl outline-none text-sm text-white placeholder:text-[#334155] transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(168,85,247,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
                >
                  {loading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <><span>Send verification code</span><ArrowRight className="h-4 w-4" /></>
                  }
                </button>
              </form>

              <p className="text-center text-xs mt-5" style={{ color: "rgba(71,85,105,0.8)" }}>
                We'll email you a 6-digit code — no password needed
              </p>
            </>
          )}

          {/* ── STEP: CODE ── */}
          {step === "code" && (
            <div
              style={{
                opacity: step === "code" ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl grid place-items-center" style={{ background: "rgba(168,85,247,0.15)" }}>
                    <Mail className="h-4 w-4" style={{ color: "#a855f7" }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Code sent!</div>
                    <div className="text-[10px]" style={{ color: "#475569" }}>{email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setStep("email"); setCode(["","","","","",""]); setError(null); }}
                  className="text-xs flex items-center gap-1 hover:text-white transition-colors"
                  style={{ color: "#475569" }}
                >
                  <RotateCcw className="h-3 w-3" /> Change
                </button>
              </div>

              {/* 6-digit code input */}
              <div className="flex gap-2 justify-center mb-6" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { codeRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKey(i, e)}
                    className="h-14 w-11 text-center text-xl font-bold text-white rounded-2xl outline-none transition-all"
                    style={{
                      background: digit ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)",
                      border: digit ? "2px solid rgba(168,85,247,0.6)" : "1px solid rgba(255,255,255,0.08)",
                      caretColor: "#a855f7",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)"; e.currentTarget.style.borderWidth = "2px"; }}
                    onBlur={(e) => { if (!digit) { e.currentTarget.style.borderWidth = "1px"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; } }}
                  />
                ))}
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3 text-xs mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                  {error}
                </div>
              )}

              <button
                onClick={verifyCode}
                disabled={loading || code.join("").length < 6}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><span>Verify code</span><ArrowRight className="h-4 w-4" /></>
                }
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={sendCode}
                  disabled={loading}
                  className="text-xs hover:text-white transition-colors"
                  style={{ color: "#475569" }}
                >
                  Didn't get it? Resend code
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: DONE ── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="h-16 w-16 rounded-2xl grid place-items-center"
                style={{ background: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.3)" }}
              >
                <CheckCircle2 className="h-8 w-8" style={{ color: "#4ade80" }} />
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-lg">Signed in!</div>
                <div className="text-xs mt-1" style={{ color: "#475569" }}>Taking you to Nirpesh…</div>
              </div>
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#4ade80" }} />
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(51,65,85,0.8)" }}>
          By signing in you agree to Nirpesh's terms of service
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes blobMove {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
