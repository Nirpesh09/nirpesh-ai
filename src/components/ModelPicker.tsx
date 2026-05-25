import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { MODELS, type ModelId } from "@/lib/models";

export function ModelPicker({ value, onChange, align = "left" }: {
  value: ModelId;
  onChange: (m: ModelId) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const current = MODELS.find((m) => m.id === value) ?? MODELS[0];
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-card hover:bg-accent text-xs font-medium transition-colors"
      >
        <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${current.gradient}`} />
        {current.label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className={`absolute z-50 mt-1.5 w-64 rounded-xl border bg-card shadow-soft p-1 ${align === "right" ? "right-0" : "left-0"}`}>
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { onChange(m.id); setOpen(false); }}
              className="w-full flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-accent text-left"
            >
              <span className={`mt-0.5 grid place-items-center h-7 w-7 rounded-lg bg-gradient-to-br ${m.gradient} text-white shrink-0`}>
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {m.label}
                  {value === m.id && <Check className="h-3.5 w-3.5 text-brand" />}
                </span>
                <span className="block text-xs text-muted-foreground truncate">{m.sub}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
