"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send, Loader2 } from "lucide-react";

export default function Contact() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    whatsappNumber: "8801580506445",
    emailAddress: "labibfohayer@gmail.com"
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      });
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setResult("Message sent successfully!");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult(data.message || "Failed to send message.");
      }
    } catch (error) {
      setResult("Something went wrong! Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setResult(""), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 relative z-10 border-t border-white/5 bg-[black]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between"
          >
            <div>
              <h2 className="text-[12vw] lg:text-[7rem] font-display font-bold leading-[0.8] tracking-tighter uppercase mb-8">
                LET'S <br/> 
                WORK <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">TOGETHER.</span>
              </h2>
              <p className="text-neutral-400 text-sm max-w-sm uppercase tracking-widest leading-relaxed">
                HAVE A PROJECT IN MIND OR WANT TO AUTOMATE YOUR BUSINESS? LET'S TALK ABOUT YOUR IDEAS.
              </p>

              {/* Holographic ID Badge */}
              <div className="mt-10 mb-8 p-4 rounded-2xl glass-card border border-white/10 bg-black/40 flex items-center gap-5 max-w-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-500/50 relative shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)]">
                    <img src="/blog/blog-2-inner-2.jpg" alt="Labib" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-white font-bold tracking-wider text-sm">LABIB FOHAYER</h4>
                  <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Status: Available for Work</p>
                </div>
                {/* Scanner Line Effect on Hover */}
                <div className="absolute left-0 top-0 h-full w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(var(--theme-rgb),1)] transition-opacity" />
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-cyan-500 text-black font-extrabold tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(var(--theme-rgb),0.3)]"
              >
                <MessageCircle fill="currentColor" size={20} />
                WHATSAPP ME
              </a>
              <a 
                href={`mailto:${settings.emailAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-full glass-card text-white font-extrabold tracking-widest uppercase transition-colors hover:bg-white/5"
              >
                <Mail size={20} />
                EMAIL ME
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10" />
            
            <form className="space-y-6 relative z-10" onSubmit={onSubmit}>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase group-focus-within:text-cyan-400 transition-colors">YOUR NAME</label>
                <input type="text" name="name" required className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)] transition-all placeholder:text-neutral-700" placeholder="John Doe" />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase group-focus-within:text-cyan-400 transition-colors">YOUR EMAIL</label>
                <input type="email" name="email" required className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)] transition-all placeholder:text-neutral-700" placeholder="john@example.com" />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase group-focus-within:text-cyan-400 transition-colors">PROJECT DETAILS</label>
                <textarea name="message" rows={5} required className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)] transition-all resize-none placeholder:text-neutral-700" placeholder="Tell me about your vision..." />
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting} 
                className="relative w-full py-5 rounded-xl bg-cyan-500 text-black font-extrabold tracking-widest uppercase overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--theme-rgb),0.8)]"
              >
                {/* Cyberpunk Laser Scan Shine Effect */}
                <div className="absolute top-0 -left-[100%] h-full w-[30%] z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 ease-in-out" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  {isSubmitting ? (
                    <>SENDING <Loader2 size={18} className="animate-spin ml-2" /></>
                  ) : (
                    <>SEND MESSAGE <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </span>
              </button>
              
              {result && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center text-xs font-bold tracking-widest uppercase mt-4 ${result.includes("success") ? "text-cyan-400" : "text-red-400"}`}
                >
                  {result}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
