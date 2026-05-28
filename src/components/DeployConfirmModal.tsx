import { AlertTriangle, ExternalLink, Rocket, X } from "lucide-react";

export function DeployConfirmModal({
  appTitle,
  onCancel,
  onConfirm,
}: {
  appTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-2xl border p-6 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#0a0c12", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
      >
        <button onClick={onCancel} className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/5 text-white/50">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
            style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Deploy this app?</h3>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span className="text-white font-medium">{appTitle}</span> will be marked as deployed and opened in a new tab as a live preview.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl p-3 border"
          style={{ background: "rgba(251,146,60,0.08)", borderColor: "rgba(251,146,60,0.25)" }}>
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#fb923c" }} />
          <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            Heads up — your browser will <span className="font-semibold">open the live version in a new tab</span> right after you confirm. Make sure pop-ups are allowed for this site.
          </div>
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>
            <ExternalLink className="h-3.5 w-3.5" /> Deploy & open live
          </button>
        </div>
      </div>
    </div>
  );
}
