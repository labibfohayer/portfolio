"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Tilt from "react-parallax-tilt";

const reviews = [
  {
    name: "Alex Rodriguez",
    role: "CEO, TechFlow",
    text: "Webpulse Automation completely transformed our workflow. Labib's architecture saved us hundreds of hours monthly. Highly recommended!",
  },
  {
    name: "Sarah Jenkins",
    role: "Operations Manager",
    text: "The AI chatbot built by Labib is handling 80% of our customer queries automatically. Brilliant execution and flawless delivery.",
  },
  {
    name: "David Chen",
    role: "E-Commerce Director",
    text: "Ponyopuri's custom storefront setup was incredibly fast. The backend is robust, and our sales tracking is easier than ever.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Client <span className="text-cyan-500">Testimonials.</span></h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">What people are saying about Webpulse Automation.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                <div className="glass-card p-8 rounded-3xl relative h-full flex flex-col group border border-white/5 hover:border-cyan-500/30 transition-colors">
                  <Quote className="text-cyan-500/20 w-12 h-12 absolute top-6 right-6 group-hover:text-cyan-500/40 transition-colors" />
                  <p className="text-neutral-300 text-lg mb-8 leading-relaxed relative z-10 flex-1">
                    "{review.text}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{review.name}</h4>
                      <p className="text-cyan-400 text-xs">{review.role}</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
