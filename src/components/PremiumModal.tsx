import { useState } from "react";
import { X, Zap, Check, Crown, Sparkles, Loader2 } from "lucide-react";
import { activatePremium } from "@/lib/premium";

type Props = {
  onClose: () => void;
  onUnlocked: () => void;
};

const PERKS = [
  "Access to Nirpesh-G (Gemini) — faster & sharper",
  "Unlimited app generations",
  "Priority queue — no waiting",
  "Early access to new features",
];

export function PremiumModal({ onClose, onUnlocked }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    activatePremium();
    setDone(true);
    setLoading(false);
    setTimeout(() => {
      onUnlocked();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0d14] shadow-2xl overflow-hidden z-10">
        {/* Gradient header */}
        <div className="relative px-6 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #7c3aed22 0%, #06b6d422 100%)" }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4 mx-auto"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
            <Crown className="h-8 w-8 text-white" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 grid place-items-center">
              <Sparkles className="h-3 w-3 text-yellow-900" />
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">Nirpesh Premium</h2>
          <p className="text-sm text-white/50 mt-1">Unlock Nirpesh-G and unlimited builds</p>

          <div className="mt-4 inline-flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">$1</span>
            <span className="text-white/50 text-sm">/ month</span>
          </div>
        </div>

        {/* Perks */}
        <div className="px-6 py-5 space-y-3">
          {PERKS.map((p) => (
            <div key={p} className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 rounded-full grid place-items-center shrink-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
                <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-sm text-white/80">{p}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={loading || done}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
            style={{ background: done ? "#10b981" : "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            {done ? (
              <><Check className="h-4 w-4" /> Premium Unlocked!</>
            ) : loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
            ) : (
              <><Zap className="h-4 w-4" /> Subscribe for $1/month</>
            )}
          </button>
          <p className="text-center text-xs text-white/30">Cancel anytime · No hidden fees</p>
        </div>
      </div>
    </div>
  );
}
