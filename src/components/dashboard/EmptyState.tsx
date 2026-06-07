import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="text-center max-w-md">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </motion.div>

        <h3 className="text-lg font-semibold text-white mb-2">No apps yet</h3>
        <p className="text-sm text-slate-400 mb-6">
          Create your first AI app and watch the magic happen. Start building something amazing!
        </p>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          Create App
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}