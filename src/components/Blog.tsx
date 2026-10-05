"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Tilt from "react-parallax-tilt";

import Link from "next/link";

const posts = [
  {
    title: "How I Automated 80% of Client Support with Python & AI",
    date: "Oct 15, 2026",
    category: "AI Automation",
    readTime: "5 min read",
    slug: "automated-client-support-ai"
  },
  {
    title: "From Delivery Rider to Tech Founder: My Journey",
    date: "Sep 28, 2026",
    category: "Entrepreneurship",
    readTime: "8 min read",
    slug: "delivery-rider-to-tech-founder"
  },
  {
    title: "Scaling Full-Stack Apps with Next.js & Supabase",
    date: "Aug 10, 2026",
    category: "Web Development",
    readTime: "6 min read",
    slug: "scaling-nextjs-supabase"
  },
  {
    title: "The Future of Business: AI-Powered Customer Support",
    date: "Jul 22, 2026",
    category: "Technology",
    readTime: "4 min read",
    slug: "ai-powered-customer-support"
  }
];

export default function Blog() {
  return (
    <section id="blog" className="py-24 relative z-10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Latest <span className="text-cyan-500">Thoughts.</span></h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">Articles on tech, automation, and the journey of building startups.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                <Link href={`/blog/${post.slug}`} className="glass-card p-8 rounded-3xl relative h-full flex flex-col group border border-white/5 hover:border-cyan-500/30 transition-colors cursor-pointer block">
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full">
                      {post.category}
                    </span>
                    <ArrowUpRight className="text-neutral-500 group-hover:text-cyan-400 transition-colors" size={20} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between text-xs font-medium text-neutral-500 pt-6 border-t border-white/10">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </Link>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
