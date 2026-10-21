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
          const dbBlogs = data.blogs.filter((b: any) => b.published !== false);
          const allSlugs = new Set(dbBlogs.map((b: any) => b.slug));
          const uniqueDefaults = defaultPosts.filter((b) => !allSlugs.has(b.slug));
          
          setPosts([...dbBlogs, ...uniqueDefaults]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="blog" className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 relative z-10 bg-[black] overflow-hidden w-full max-w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 bg-cyan-950/20 backdrop-blur-md">
            <BookOpen size={12} className="text-cyan-400 animate-pulse" /> KNOWLEDGE BASE
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
            LATEST <br />
            <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(var(--theme-rgb),0.4)]">THOUGHTS.</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto mt-4 sm:mt-6 leading-relaxed">
            Articles on tech, architecture, automation workflows, and the founder journey of building production platforms.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-cyan-400 animate-pulse font-mono py-12 text-sm">
            [SYS_LOG] Loading engineering articles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full items-stretch">
            {posts.map((post, idx) => {
              const isWide = idx === 0 || idx === 3;
              const postDate = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'RECENT');
              const postReadTime = post.readTime || '5 min read';
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`${isWide ? "lg:col-span-2" : "lg:col-span-1"} w-full flex flex-col`}
                >
                  <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1} transitionSpeed={2000} className="h-full w-full flex flex-col">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="p-6 sm:p-8 rounded-2xl relative h-full flex flex-col justify-between group bg-black/40 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
                    >
                      {/* Ambient Cover Overlay on Hover */}
                      {post.coverImage && (
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover opacity-0 group-hover:opacity-10 scale-105 group-hover:scale-100 transition-all duration-700 ease-out mix-blend-luminosity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                      )}

                      {/* Card Content Stack: Title -> Excerpt */}
                      <div className="relative z-10 flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className={`font-display font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug ${isWide ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                            {post.title}
                          </h3>
                          <ArrowUpRight className="text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 mt-1" size={18} />
                        </div>
                        
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Minimal Metadata Footer */}
                      <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-neutral-400 font-mono tracking-wider uppercase relative z-10">
                        <div className="flex items-center gap-2">
                          <span>{postDate}</span>
                          <span className="text-neutral-600">•</span>
                          <span>{postReadTime}</span>
                        </div>
                        {post.category && (
                          <span className="text-cyan-400/80 group-hover:text-cyan-300 transition-colors font-medium">
                            {post.category}
                          </span>
                        )}
                      </div>

                      {/* Subtle hover radial glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--theme-rgb),0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
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
