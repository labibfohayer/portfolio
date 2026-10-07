"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, CheckCircle2 } from "lucide-react";

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Mail size={18} className="text-cyan-400" /> System Inbox
        </h1>
        <p className="text-neutral-400 text-xs font-mono mt-1">Messages from your public portfolio contact form.</p>
      </div>

      {loading ? (
        <div className="text-cyan-400 font-mono animate-pulse">Loading secure messages...</div>
      ) : messages.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl border border-white/10 text-center text-neutral-500 font-mono">
          Inbox is empty.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg._id} className={`glass-card p-6 rounded-2xl border transition-colors ${msg.read ? 'border-white/5 bg-black/40' : 'border-cyan-500/30 bg-cyan-950/10'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.read ? 'bg-white/5 text-neutral-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {msg.read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </div>
                  <div>
                    <h3 className={`font-bold tracking-wider ${msg.read ? 'text-neutral-300' : 'text-white'}`}>{msg.name}</h3>
                    <p className="text-xs font-mono text-cyan-500">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  {!msg.read && (
                    <button 
                      onClick={() => markAsRead(msg._id)}
                      className="px-3 py-1 rounded-full border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 size={12} /> MARK READ
                    </button>
                  )}
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${msg.read ? 'bg-white/5 border-white/5 text-neutral-400' : 'bg-black/50 border-white/10 text-neutral-200'} text-sm leading-relaxed whitespace-pre-wrap`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
