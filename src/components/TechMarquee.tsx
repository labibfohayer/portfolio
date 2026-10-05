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
    <section className="w-full bg-slate-950 py-10 border-y border-white/5 overflow-hidden flex relative z-10">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap gap-16 items-center"
        animate={{ x: [0, -1800] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {/* Repeat the array multiple times for seamless infinite loop */}
        {[...techStack, ...techStack, ...techStack, ...techStack, ...techStack].map((tech, idx) => (
          <div key={idx} className="flex items-center gap-4 group cursor-default">
            <img 
              src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`} 
              alt={tech.name}
              className="w-10 h-10 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-none"
            />
            <span className="text-xl md:text-2xl font-bold text-slate-700 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
