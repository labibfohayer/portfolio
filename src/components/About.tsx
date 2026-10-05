"use client";

import { motion } from "framer-motion";
import { GraduationCap, Target, Zap, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
              <ShieldCheck size={12} className="text-cyan-500" /> BIOGRAPHY & TARGET ARCHITECTURE
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9]">
              ABOUT MD. LABIB <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500">FOHAYER.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-[400px]"
          >
            <h3 className="text-3xl text-cyan-500 font-serif italic mb-2">Driven by Passion & Resilience.</h3>
            <p className="text-sm text-neutral-400">
              Specialized in engineering robust automation pipelines and high-performance web platforms that replace manual friction with resilient, self-operating intelligence.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 glass-card rounded-[2rem] p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold tracking-widest uppercase mb-6 text-white">
                THE FOUNDER'S STORY
              </h3>
              <div className="space-y-4 text-neutral-400 text-sm md:text-base leading-relaxed">
                <p>
                  My journey into tech wasn't conventional. It was driven by pure passion and resilience—transitioning from working as a delivery rider and salesman to establishing my own tech agency, <strong className="text-cyan-400">Webpulse Automation</strong>.
                </p>
                <p>
                  I architect intelligent automation systems designed to eliminate complexity, compress execution timelines, and multiply business potential. Instead of relying on slow, manual cycles, I build digital ecosystems that operate autonomously to deliver results in days.
                </p>
                <p>
                  By leveraging technologies like React, Python, and specialized AI frameworks, my architectures automate the entire lifecycle—from e-commerce solutions (Ponyopuri) to custom management platforms (BD Mess).
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <GraduationCap className="text-cyan-500" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm tracking-widest uppercase mb-1">FOUNDER & CEO @ WEBPULSE</h4>
                <p className="text-xs text-neutral-500">
                  Strong foundational expertise in full-stack architecture, automation algorithms, and building digital solutions that scale.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Cards Stack */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[2rem] p-8 flex-1"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase">TARGET 01</span>
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full">10X FASTER</span>
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">10X EXECUTION VELOCITY</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Compressing conventional manual business processes into minutes using custom automation bots and intelligent scripts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[2rem] p-8 flex-1"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase">TARGET 02</span>
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full">70% SAVINGS</span>
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">70% COST COMPRESSION</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Eliminating recurring manual overhead and inefficient retainers through deterministic, automated web pipelines.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[2rem] p-8 flex-1 border-t-2 border-t-cyan-500/50"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase">TARGET 03</span>
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 text-[10px] font-bold rounded-full">99.9% RELIABLE</span>
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-2">PRODUCTION RESILIENCE</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Engineering strict architectures, clean React UI, and automated backends to ensure zero friction in production.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Wide Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 glass-card rounded-[2rem] p-8 md:p-12 border-l-4 border-l-cyan-500 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex-1">
            <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-4 block">
              <Zap size={12} className="inline mr-2" /> CORE ENGINEERING PHILOSOPHY
            </span>
            <h4 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-wider text-white">
              "Turning ideas and resilience into high-impact digital solutions that eliminate operational friction and scale effortlessly."
            </h4>
          </div>
          <div className="shrink-0">
            <a href="https://wa.me/8801580506445" className="px-6 py-3 bg-cyan-900/40 border border-cyan-500 text-cyan-400 text-sm font-bold tracking-widest uppercase rounded-full hover:bg-cyan-500 hover:text-black transition-colors block text-center">
              WHATSAPP
            </a>
            <span className="text-[10px] text-neutral-500 tracking-widest uppercase mt-2 block text-center">
              Direct consultation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
