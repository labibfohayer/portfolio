"use client";
import { motion } from "framer-motion";

const techStack = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Next.js", slug: "nextdotjs", color: "ffffff" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "Node.js", slug: "nodedotjs", color: "339939" },
  { name: "MongoDB", slug: "mongodb", color: "47A248" },
  { name: "Firebase", slug: "firebase", color: "FFCA28" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Vercel", slug: "vercel", color: "ffffff" },
  { name: "Git", slug: "git", color: "F05032" },
];

export default function TechMarquee() {
  return (
    <section className="w-full max-w-full bg-[black] my-8 py-6 border-y border-white/5 overflow-hidden flex relative z-10 pointer-events-none select-none">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[black] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[black] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap gap-10 sm:gap-16 items-center"
        animate={{ x: [0, -1400] }}
        transition={{ ease: "linear", duration: 25, repeat: Infinity }}
      >
        {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, idx) => (
          <div key={idx} className="flex items-center gap-3 sm:gap-4 shrink-0">
            <img 
              src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`} 
              alt={tech.name}
              className="w-7 h-7 sm:w-10 sm:h-10 grayscale opacity-40 transition-all duration-300"
              loading="lazy"
            />
            <span className="text-base sm:text-xl md:text-2xl font-bold text-slate-700 uppercase tracking-widest">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
