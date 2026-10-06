"use client";

import { motion } from "framer-motion";
import { Quote, Star, MessageSquare } from "lucide-react";

const reviews = [
  {
    name: "Alex Rodriguez",
    role: "CEO, TechFlow",
    rating: 5,
    text: "Webpulse Automation completely transformed our workflow. Labib's architecture saved us hundreds of hours monthly. Highly recommended!",
  },
  {
    name: "Tariqul Islam",
    role: "Founder, BD Mess",
    rating: 5,
    text: "Labib is a phenomenal developer. He built the entire management platform for our student accommodations from scratch, making bill splitting completely painless.",
  },
  {
    name: "Sarah Jenkins",
    role: "Operations Manager",
    rating: 4,
    text: "The AI chatbot built by Labib is handling 80% of our customer queries automatically. Brilliant execution, though the initial setup took a bit longer than expected.",
  },
  {
    name: "Abdullah Al Noman",
    role: "CEO, SoftTech BD",
    rating: 5,
    text: "We hired him for an emergency cloud deployment on AWS, and his expertise ensured a seamless migration with zero downtime. An absolute lifesaver!",
  },
  {
    name: "Fatema Zohra",
    role: "E-Commerce Owner",
    rating: 4,
    text: "Thanks to Labib's WhatsApp order integration, our local sales skyrocketed by 40% within a month. Very professional, just wish he was available for full-time hire.",
  },
  {
    name: "David Chen",
    role: "E-Commerce Director",
    rating: 5,
    text: "Ponyopuri's custom storefront setup was incredibly fast. The backend is robust, and our sales tracking is easier than ever.",
  },
  {
    name: "Md. Shafiqul Alam",
    role: "Lead Engineer",
    rating: 5,
    text: "Collaborating with Labib on the multi-agent AI engine was a great experience. His code is exceptionally clean, well-documented, and highly scalable.",
  },
  {
    name: "Ayesha Rahman",
    role: "Marketing Head",
    rating: 4,
    text: "The automation scripts Labib provided for our marketing workflows drastically reduced our campaign launch times. A solid developer with great problem-solving skills.",
  },
  {
    name: "Riyadh Hossain",
    role: "Startup Founder",
    rating: 5,
    text: "His vision for digital ecosystems is extraordinary. Labib didn't just build a website for us; he architected a complete automated business solution.",
  },
  {
    name: "Zayed Bin Tariq",
    role: "Operations Lead",
    rating: 4,
    text: "I was blown away by how quickly he integrated the OpenAI APIs into our legacy systems. Labib is undoubtedly a highly skilled AI engineer.",
  },
];

const ReviewCard = ({ review }: { review: typeof reviews[0] }) => (
  <div className="w-[350px] md:w-[450px] shrink-0 glass-card p-8 md:p-10 rounded-[2rem] relative flex flex-col group border-t-2 border-t-cyan-500/30 border-white/5 hover:border-cyan-500/50 transition-colors bg-black/60 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] h-full">
    
    {/* Giant Watermark Quote */}
    <Quote className="absolute top-10 right-8 w-24 h-24 text-cyan-500/5 group-hover:text-cyan-500/10 transition-colors -rotate-12" strokeWidth={1} />
    
    <div className="flex gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          fill={i < review.rating ? "currentColor" : "none"} 
          className={i < review.rating ? "text-cyan-400" : "text-cyan-900/40"}
        />
      ))}
    </div>

    <p className="text-neutral-300 text-sm md:text-base leading-relaxed relative z-10 flex-1 mb-10 group-hover:text-white transition-colors">
      "{review.text}"
    </p>
    
    <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-auto relative z-10">
      {/* Pulsing Avatar Ring */}
      <div className="relative shrink-0">
        <div className="absolute inset-0 border-2 border-dashed border-cyan-500/40 rounded-full animate-[spin_6s_linear_infinite]" />
        <div className="absolute inset-0 border border-cyan-400/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-display font-bold text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          {review.name.charAt(0)}
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold text-sm tracking-wide">{review.name}</h4>
        <p className="text-cyan-500/70 text-[10px] tracking-widest uppercase mt-0.5">{review.role}</p>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 relative z-10 bg-[black] overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6 bg-cyan-950/20">
            <MessageSquare size={12} className="text-cyan-500" /> CLIENT FEEDBACK
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
            TRUSTED BY <br />
            <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">INDUSTRY LEADERS</span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="relative w-full overflow-hidden flex pb-8">
        
        {/* Edge Fade Masks */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        
        <div className="flex w-max relative z-10">
          <motion.div
            className="flex gap-6 pr-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ ease: "linear", duration: 80, repeat: Infinity }}
          >
            {reviews.map((review, idx) => (
              <ReviewCard key={`set1-${idx}`} review={review} />
            ))}
          </motion.div>
          <motion.div
            className="flex gap-6 pr-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ ease: "linear", duration: 80, repeat: Infinity }}
          >
            {reviews.map((review, idx) => (
              <ReviewCard key={`set2-${idx}`} review={review} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
