"use client";

import { Settings2, AlertCircle } from "lucide-react";

export default function SettingsManager() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Settings2 size={18} className="text-cyan-400" /> System Settings
        </h1>
        <p className="text-neutral-400 text-xs font-mono mt-1">Configure global portfolio preferences.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 text-center flex flex-col items-center justify-center gap-4">
        <AlertCircle size={32} className="text-cyan-500" />
        <h2 className="text-white font-bold tracking-widest uppercase">Under Construction</h2>
        <p className="text-neutral-400 text-sm font-mono max-w-md">
          Global settings (like updating resume links, social profiles, and system themes) will be available in the next system update.
        </p>
      </div>
    </div>
  );
}
