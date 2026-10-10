"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";

const defaultPosts = [
  {
    title: "How I Automated 80% of Client Support with Python & AI",
    date: "Oct 15, 2026",
    category: "AI Automation",
    readTime: "5 min read",
    slug: "automated-client-support-ai",
    featured: true,
    coverImage: "/blog/blog-1.jpg",
    excerpt: "Customer support is the backbone of any business, but handling repetitive queries can drain a team's energy. At Webpulse Automation, I noticed many of our clients were struggling...",
    createdAt: "2026-10-15T00:00:00Z"
  },
  {
    title: "From Delivery Rider to Tech Founder: My Journey",
    date: "Sep 28, 2026",
    category: "Entrepreneurship",
    readTime: "8 min read",
    slug: "delivery-rider-to-tech-founder",
    featured: false,
    coverImage: "/blog/blog-2.jpg",
    excerpt: "A few years ago, my daily routine consisted of navigating city traffic as a delivery rider and working as a salesman. Life was a constant grind, but I had a burning passion for technology...",
    createdAt: "2026-09-28T00:00:00Z"
  },
  {
    title: "Scaling Full-Stack Apps with Next.js & Supabase",
    date: "Aug 10, 2026",
    category: "Web Development",
    readTime: "6 min read",
    slug: "scaling-nextjs-supabase",
    featured: false,
    coverImage: "/blog/blog-3-new.jpg",
    excerpt: "When building 'Hisab App' (a financial tracker) and 'Ponyopuri' (an e-commerce storefront), speed and scalability were my top priorities. That's why I chose Next.js and Supabase...",
    createdAt: "2026-08-10T00:00:00Z"
  },
  {
    title: "The Future of Business: AI-Powered Customer Support",
    date: "Jul 22, 2026",
    category: "Technology",
    readTime: "4 min read",
    slug: "ai-powered-customer-support",
    featured: true,
    coverImage: "/blog/blog-4.jpg",
    excerpt: "Imagine this: It's 3:00 AM, and a potential customer visits your website with a question. By the time your team wakes up to reply at 9:00 AM, the customer has already bought from a competitor...",
    createdAt: "2026-07-22T00:00:00Z"
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<any[]>(defaultPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.blogs.length > 0) {
          // Combine DB blogs with default blogs, avoiding duplicates by slug
          const dbBlogs = data.blogs.filter((b: any) => b.published !== false);
          const allSlugs = new Set(dbBlogs.map((b: any) => b.slug));
          const uniqueDefaults = defaultPosts.filter((b) => !allSlugs.has(b.slug));
          
          setPosts([...dbBlogs, ...uniqueDefaults]);
        }
        setLoading(false);
      });
  }, []);

  // Removed the early return so the section header always shows
  // if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 md:py-32 relative z-10 bg-[black]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6 bg-cyan-950/20">
            <BookOpen size={12} className="text-cyan-500 animate-pulse" /> KNOWLEDGE BASE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
            LATEST <br />
            <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)]">THOUGHTS.</span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-6 leading-relaxed">
            Articles on tech, automation, and the journey of building startups.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-cyan-500 animate-pulse font-mono">Loading articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const isWide = idx === 0 || idx === 3;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={isWide ? "lg:col-span-2" : "lg:col-span-1"}
                >
                  <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={2000} className="h-full">
                    <Link href={`/blog/${post.slug}`} className="glass-card p-8 md:p-10 rounded-[2rem] relative h-full flex flex-col group border border-white/5 hover:border-cyan-500/30 transition-all duration-500 cursor-pointer block bg-black/40 hover:bg-black/60 overflow-hidden">
                      
                      {post.coverImage && (
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem]">
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover opacity-0 group-hover:opacity-30 scale-110 group-hover:scale-100 transition-all duration-700 ease-out mix-blend-luminosity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left shadow-[0_0_10px_rgba(var(--theme-rgb),0.8)] z-20" />

                      <div className="flex justify-between items-start mb-10 relative z-10">
                        <span className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] tracking-widest uppercase font-bold rounded-full group-hover:bg-cyan-500/20 transition-colors backdrop-blur-md">
                          Article
                        </span>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-950/50 transition-all duration-300 backdrop-blur-md">
                          <ArrowUpRight className="text-neutral-500 group-hover:text-cyan-400 group-hover:scale-125 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" size={18} />
                        </div>
                      </div>
                      
                      <h3 className={`font-display font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors relative z-10 leading-tight ${isWide ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-neutral-400 mb-6 relative z-10 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between text-[10px] tracking-widest font-bold uppercase text-neutral-500 pt-6 border-t border-white/5 group-hover:border-cyan-500/20 transition-colors relative z-10">
                        <span className="group-hover:text-cyan-500/70 transition-colors">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="group-hover:text-cyan-500/70 transition-colors">5 min read</span>
                      </div>

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--theme-rgb),0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
                    </Link>
                  </Tilt>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
