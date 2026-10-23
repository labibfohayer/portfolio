"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Bike, HeartHandshake, Compass } from "lucide-react";
import Image from "next/image";
import { playClickSound } from "@/lib/sounds";

interface OriginStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OriginStoryModal({ isOpen, onClose }: OriginStoryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d0f16] border border-white/15 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-neutral-200"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bike size={20} />
              </div>
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">
                  THE ORIGIN STORY // AUTHENTIC ROOTS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  From Delivery Rider to Tech Founder
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              title="Close Story"
            >
              <X size={16} />
            </button>
          </div>

          {/* Story Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-sm sm:text-base leading-relaxed text-neutral-300">
            {/* Quote Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 italic text-amber-200 text-sm">
              &ldquo;My journey into tech wasn&apos;t started inside an air-conditioned Silicon Valley office. It was forged under the scorching sun and monsoon rains of Dhaka, with a delivery backpack on my shoulders and a relentless fire in my heart.&rdquo;
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="text-cyan-400" size={18} />
                The Road Less Traveled
              </h3>
              <p>
                In my early days, I worked tirelessly as a delivery rider and frontline salesman across the streets of Dhaka. Delivering food and packages taught me the most invaluable lesson no university syllabus can teach: <strong className="text-white">discipline, extreme customer empathy, and the true value of every single minute.</strong>
              </p>
              <p>
                Between late-night shifts and exhausted hours, I taught myself how to code. While others rested, I stayed glued to my screen until dawn, mastering JavaScript, Python, full-stack architecture, and autonomous AI agents.
              </p>
            </div>

            {/* Middle Profile & Milestone Highlight */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/40 shrink-0">
                <Image
                  src="/profile-ceo.jpg"
                  alt="Md. Labib Fohayer"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-white text-base">Md. Labib Fohayer</h4>
                <p className="text-xs font-mono text-cyan-400">Founder & Chairman, Webpulse Automation</p>
                <p className="text-xs text-neutral-400">
                  Transformed from a self-taught dreamer into the creator of platforms serving thousands of students and automated enterprise pipelines.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="text-emerald-400" size={18} />
                Founding Webpulse Automation
              </h3>
              <p>
                Today, I lead <strong className="text-white">Webpulse Automation</strong>, where my team and I build scalable digital infrastructure. From modernizing entire madrasas (<em className="text-cyan-300">Al Madina Model Madrasa</em>) to building SaaS operating systems (<em className="text-cyan-300">Madrasa OS</em>) and solving real daily friction (<em className="text-cyan-300">BD Mess</em>).
              </p>
              <p>
                I don&apos;t build software just to add code to the internet. I build software to solve real problems for real people, save hours of manual labor, and help businesses scale with precision.
              </p>
            </div>

            {/* Bottom Seal */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <HeartHandshake size={15} className="text-amber-400" />
                <span>Resilience • Humility • Engineering Excellence</span>
              </div>
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
