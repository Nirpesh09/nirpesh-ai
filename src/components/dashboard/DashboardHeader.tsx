import { getCredits, isPremium } from "@/lib/credits";
import { loadModel, MODELS } from "@/lib/models";
import { Zap, Crown, Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardHeader() {
  const credits = getCredits();
  const isPremiumUser = isPremium();
  const model = loadModel();
  const currentModel = MODELS.find(m => m.id === model);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Nirpesh AI</h1>
            <p className="text-xs text-slate-400">
              {isPremiumUser ? "Premium" : "Free"} • {currentModel?.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">{credits} credits</span>
          </div>

          {isPremiumUser && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-200">Premium</span>
            </div>
          )}

          <button className="p-2 rounded-lg hover:bg-slate-900 transition-colors text-slate-400 hover:text-slate-200">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-900 transition-colors text-slate-400 hover:text-slate-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}