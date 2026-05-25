import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Sparkles, Crown } from "lucide-react";
import { MODELS, type ModelId } from "@/lib/models";
import { isPremium } from "@/lib/premium";
import { PremiumModal } from "@/components/PremiumModal";

export function ModelPicker({ value, onChange, align = "left" }: {
  value: ModelId;
  onChange: (m: ModelId) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [premium, setPremium] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPremium(isPremium());
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const current = MODELS.find((m) => m.id === value) ?? MODELS[0];

  const handleSelect = (id: ModelId) => {
    if (id === "nirpesh-g" && !premium) {
      setOpen(false);
      setShowPremium(true);
      return;
    }
    onChange(id);
    setOpen(false);
  };

  const handleUnlocked = () => {
    setPremium(true);
    onChange("nirpesh-g");
  };

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card hover:bg-accent text-xs font-medium transition-colors"
        >
          <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${current.gradient}`} />
          {current.label}
          {current.id === "nirpesh-g" && !premium && (
            <Crown className="h-3 w-3 text-yellow-500 ml-0.5" />
          )}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>

        {open && (
          <div className={`absolute z-50 mt-1.5 w-68 rounded-xl border bg-card shadow-soft p-1 ${align === "right" ? "right-0" : "left-0"}`}
            style={{ minWidth: "260px" }}>
            {MODELS.map((m) => {
              const locked = m.id === "nirpesh-g" && !premium;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelect(m.id)}
                  className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-accent text-left relative"
                >
                  <span className={`mt-0.5 grid place-items-center h-7 w-7 rounded-lg bg-gradient-to-br ${m.gradient} text-white shrink-0`}>
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      {m.label}
                      {value === m.id && !locked && <Check className="h-3.5 w-3.5 text-brand" />}
                      {locked && (
                        <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: "linear-gradient(135deg, #7c3aed22, #06b6d422)", color: "#a78bfa" }}>
                          <Crown className="h-2.5 w-2.5" /> Premium
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate">{m.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onUnlocked={handleUnlocked}
        />
      )}
    </>
  );
}
