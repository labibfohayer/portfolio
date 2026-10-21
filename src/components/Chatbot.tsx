"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { playClickSound } from "@/lib/sounds";

interface Message {
  role: "bot" | "user";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm Labib's AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const toggleChat = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const botReply = data?.reply || "হ্যালো! আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
        setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "দুঃখিত, সংযোগে সাময়িক সমস্যা হয়েছে। আপনি সরাসরি লাবিব স্যারের সাথে WhatsApp (+8801580506445)-এ যোগাযোগ করতে পারেন!"
          }
        ]);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isTimeout = error?.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: isTimeout
            ? "রেসপন্স আসতে কিছুটা বিলম্ব হচ্ছে। দয়া করে সরাসরি লাবিব স্যারের সাথে WhatsApp (+8801580506445)-এ নক করুন!"
            : "সংযোগ ত্রুটি ঘটেছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।"
        }
      ]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-18 sm:bottom-24 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm glass-card rounded-2xl border border-cyan-500/30 overflow-hidden z-[100] shadow-[0_0_30px_rgba(var(--theme-rgb),0.15)] flex flex-col max-h-[75vh]"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 relative">
                  <Bot size={18} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-none">Labib's AI</h3>
                  <p className="text-[11px] text-green-400 mt-1 font-medium">Online • Instant Reply</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-neutral-400 hover:text-white transition-colors p-1"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-slate-950/60">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                      msg.role === "bot"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {msg.role === "bot" ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md"
                        : "bg-slate-900/90 text-neutral-200 rounded-tl-sm border border-white/5 shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 text-neutral-400 rounded-tl-sm border border-white/5 flex items-center gap-2 text-xs sm:text-sm">
                    <Loader2 size={14} className="animate-spin text-cyan-400" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-slate-900 border-t border-white/10 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                placeholder={isLoading ? "Thinking..." : "Ask me anything about Labib..."}
                className="flex-1 bg-slate-950 border border-white/10 rounded-full px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[95] w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-cyan-600 flex items-center justify-center text-white hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle AI Chat"
      >
        <MessageSquare size={18} className="sm:w-6 sm:h-6" />
      </motion.button>
    </>
  );
}
