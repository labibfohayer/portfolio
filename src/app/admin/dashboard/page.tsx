"use client";

import { Activity, FolderKanban, Mail, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardOverview() {
  const stats = [
    { label: "Total Projects", value: "12", icon: FolderKanban, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    { label: "Unread Messages", value: "3", icon: Mail, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { label: "Profile Views", value: "1.2k", icon: Eye, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
    { label: "System Status", value: "ONLINE", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase mb-2">System Overview</h1>
        <p className="text-neutral-400 text-sm font-mono">Welcome back, Admin. Here is your current system status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-6 rounded-2xl border ${stat.border} flex flex-col gap-4 relative overflow-hidden group`}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-xl group-hover:scale-150 transition-transform duration-700`} />
            
            <div className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center relative z-10`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold font-display text-white mb-1">{stat.value}</h3>
              <p className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity (Mock) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col gap-6"
      >
        <h2 className="text-sm font-bold tracking-widest text-white uppercase border-b border-white/10 pb-4">Recent Activity</h2>
        
        <div className="flex flex-col gap-4">
          {[
            { msg: "New message received from 'John Doe'", time: "2 hours ago", type: "msg" },
            { msg: "Project 'BD Mess' was updated", time: "1 day ago", type: "sys" },
            { msg: "System successfully backed up", time: "2 days ago", type: "sys" },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activity.type === 'msg' ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'}`} />
              <div>
                <p className="text-sm text-neutral-200">{activity.msg}</p>
                <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
