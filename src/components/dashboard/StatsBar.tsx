import { motion } from "framer-motion";
import { FileCode, TrendingUp, Clock } from "lucide-react";
import { loadApps } from "@/lib/apps";

export function StatsBar() {
  const apps = loadApps();
  const deployedCount = apps.filter(a => a.deployed).length;
  const totalCreated = apps.length;

  const stats = [
    {
      label: "Total Apps",
      value: totalCreated,
      icon: FileCode,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Deployed",
      value: deployedCount,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "This Month",
      value: apps.filter(a => new Date(a.createdAt).getMonth() === new Date().getMonth()).length,
      icon: Clock,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}