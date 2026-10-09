"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Mail, Settings, LogOut, Menu, X, ExternalLink, ShieldCheck, PenTool, Paintbrush } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Visual Editor", href: "/admin/dashboard/editor", icon: Paintbrush },
    { name: "Projects", href: "/admin/dashboard/projects", icon: FolderKanban },
    { name: "Messages", href: "/admin/dashboard/messages", icon: Mail },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
    { name: "Blogs", href: "/admin/dashboard/blogs", icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 md:hidden backdrop-blur-md transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-2xl border-r border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col`}>
        <div className="h-24 flex items-center px-8 border-b border-white/5 justify-between md:justify-center bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)]">
              <ShieldCheck size={20} className="text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-display font-bold tracking-widest text-lg leading-tight">ADMIN_SYS</h2>
              <span className="text-[9px] text-cyan-500 font-mono tracking-[0.2em] uppercase">Control Panel v2.0</span>
            </div>
          </div>
          <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-extrabold tracking-widest text-[10px] uppercase rounded-xl shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)] transition-all hover:scale-[1.02]"
          >
            <ExternalLink size={14} strokeWidth={2.5} />
            VIEW LIVE WEBSITE
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-neutral-600 tracking-widest uppercase mb-2">Modules</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-bold tracking-wider text-xs uppercase relative group overflow-hidden ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(var(--theme-rgb),0.15)]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200 border border-transparent'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />}
                <item.icon size={18} className={`${isActive ? "text-cyan-400" : "group-hover:text-cyan-500 transition-colors"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-gradient-to-t from-white/5 to-transparent">
          <button 
            onClick={() => router.push("/admin")}
            className="flex items-center justify-center gap-3 px-4 py-3.5 w-full rounded-xl text-neutral-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent transition-all font-bold tracking-wider text-xs uppercase"
          >
            <LogOut size={16} />
            SECURE LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="h-20 bg-black/50 backdrop-blur-xl border-b border-white/10 flex items-center px-6 md:hidden relative z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-400 hover:text-white p-2 -ml-2 rounded-lg hover:bg-white/5">
            <Menu size={24} />
          </button>
          <span className="ml-4 text-white font-display font-bold tracking-widest text-base">ADMIN_SYS</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 custom-scrollbar">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
          {children}
        </div>
      </main>
    </div>
  );
}
