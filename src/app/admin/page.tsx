"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication for now
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials. Try admin / admin123");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Matrix/Grid (Subtle) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 border border-cyan-500/30 shadow-[0_0_50px_rgba(var(--theme-rgb),0.1)]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)]">
            <ShieldCheck size={32} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">SYSTEM ADMIN</h1>
          <p className="text-xs text-cyan-500/70 font-mono tracking-widest mt-2">RESTRICTED ACCESS ONLY</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={16} className="text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/20 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <KeyRound size={16} className="text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/20 transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono text-center">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-cyan-500 text-black font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--theme-rgb),0.6)] disabled:opacity-70"
          >
            {isLoading ? "VERIFYING..." : "AUTHENTICATE"}
            {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
          <button onClick={() => router.push("/")} className="text-[10px] text-neutral-500 hover:text-cyan-400 font-mono tracking-widest transition-colors flex items-center gap-2">
            <Lock size={10} /> RETURN TO PUBLIC FACING SITE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
