import { SavedApp } from "@/lib/apps";
import { motion } from "framer-motion";
import { Trash2, Eye, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AppCardProps {
  app: SavedApp;
  onDelete: (id: string) => void;
  onOpen: (app: SavedApp) => void;
  onDeploy: (id: string) => void;
}

export function AppCard({ app, onDelete, onOpen, onDeploy }: AppCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:border-slate-600 hover:bg-slate-900/80 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
              {app.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {formatDistanceToNow(app.updatedAt, { addSuffix: true })}
            </p>
          </div>
          {app.deployed && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 mb-4 bg-slate-800/50 p-3 rounded-lg">
          {app.prompt}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpen(app)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm font-medium border border-cyan-500/30"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onDeploy(app.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors text-sm font-medium border border-violet-500/30"
          >
            <Download className="w-4 h-4" />
            Deploy
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}