"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Mail, Settings, LogOut, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/dashboard/projects", icon: FolderKanban },
    { name: "Messages", href: "/admin/dashboard/messages", icon: Mail },
    { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between md:justify-center">
            <h2 className="text-cyan-400 font-display font-bold tracking-widest text-lg drop-shadow-[0_0_10px_rgba(var(--theme-rgb),0.5)]">ADMIN_SYS</h2>
            <button className="md:hidden text-neutral-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold tracking-wider text-xs uppercase ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(var(--theme-rgb),0.1)]' 
                      : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-cyan-400" : ""} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button 
              onClick={() => router.push("/admin")}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-neutral-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-transparent transition-all font-bold tracking-wider text-xs uppercase"
            >
              <LogOut size={16} />
              LOGOUT
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="h-16 glass border-b border-white/10 flex items-center px-4 md:hidden relative z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-neutral-400 hover:text-white p-2">
            <Menu size={24} />
          </button>
          <span className="ml-4 text-cyan-400 font-display font-bold tracking-widest text-sm">ADMIN_SYS</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
