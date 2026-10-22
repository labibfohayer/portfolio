"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  title: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
  featured?: boolean;
  coverImage?: string;
  excerpt: string;
  createdAt?: string;
  published?: boolean;
}

const defaultPosts: BlogPost[] = [
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

// =============================================================================
// 120 FPS HARDWARE-ACCELERATED 3D PARALLAX TILT CARD WITH Z-DEPTH STACKING
// =============================================================================
function BlogCard3D({ post, isWide }: { post: BlogPost; isWide: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  // Spring interpolation targets
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isHovered = useRef(false);
  const animFrameId = useRef<number>(0);

  const postDate = post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'RECENT');
  const postReadTime = post.readTime || '5 min read';

  // 120 FPS Animation Loop using requestAnimationFrame
  const updatePhysics = () => {
    if (!isHovered.current && Math.abs(currentX.current) < 0.05 && Math.abs(currentY.current) < 0.05) {
      if (cardRef.current) {
        cardRef.current.style.transform = "perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }
      return;
    }

    // Smooth spring physics (0.12 lerp factor)
    currentX.current += (targetX.current - currentX.current) * 0.12;
    currentY.current += (targetY.current - currentY.current) * 0.12;

    if (cardRef.current) {
      const scale = isHovered.current ? "1.02, 1.02, 1.02" : "1, 1, 1";
      cardRef.current.style.transform = `perspective(1500px) rotateX(${currentX.current.toFixed(2)}deg) rotateY(${currentY.current.toFixed(2)}deg) scale3d(${scale})`;
    }

    animFrameId.current = requestAnimationFrame(updatePhysics);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-0.5 to 0.5)
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // Tilt limits: rotateX up to ±7deg, rotateY up to ±8deg
    targetX.current = -normY * 7;
    targetY.current = normX * 8;

    // Update cursor spotlight position
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(450px circle at ${x}px ${y}px, rgba(var(--theme-rgb), 0.16), transparent 75%)`;
      glowRef.current.style.opacity = "1";
    }
  };

  const handleMouseEnter = () => {
    if (window.innerWidth < 1024) return;
    isHovered.current = true;
    cancelAnimationFrame(animFrameId.current);
    animFrameId.current = requestAnimationFrame(updatePhysics);
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    targetX.current = 0;
    targetY.current = 0;
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameId.current);
  }, []);

  return (
    <div 
      className="h-full w-full flex flex-col"
      style={{ perspective: "1500px" }}
    >
      <Link 
        href={`/blog/${post.slug}`} 
        className="h-full w-full block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded-[1.75rem]"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ 
            transformStyle: "preserve-3d",
            willChange: "transform",
            transition: "box-shadow 0.4s ease, border-color 0.4s ease, background-color 0.4s ease"
          }}
          className="p-6 sm:p-8 rounded-[1.75rem] relative h-full flex flex-col justify-between group bg-[#070b0e]/95 hover:bg-[#080f14] backdrop-blur-2xl border border-white/10 hover:border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)] cursor-pointer overflow-hidden w-full transform-gpu"
        >
          {/* Base Layer: Ambient Background Image Overlay (Z: 0px) */}
          {post.coverImage && (
            <div 
              className="absolute inset-0 z-0 overflow-hidden rounded-[1.75rem] pointer-events-none"
              style={{ transform: "translateZ(0px)" }}
            >
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover opacity-0 group-hover:opacity-15 scale-105 group-hover:scale-100 transition-all duration-700 ease-out mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          )}

          {/* Layer 1: Real-time Cursor Radial Glow (Z: 10px) */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 transition-opacity duration-500 z-10"
            style={{ transform: "translateZ(10px)" }}
          />

          {/* ----------------------------------------------------------------- */}
          {/* MULTI-PLANE Z-DEPTH FLOATING LAYERS (preserve-3d)                 */}
          {/* ----------------------------------------------------------------- */}
          <div 
            className="relative z-20 flex flex-col flex-grow"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Layer 2: Category & Meta Pill Bar (Z: 20px) */}
            <div 
              className="flex items-center justify-between gap-3 mb-5"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="flex items-center gap-2">
                {post.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-colors">
                    <Sparkles size={10} className="text-cyan-400" />
                    {post.category}
                  </span>
                )}
                {post.featured && (
                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 hidden sm:inline-block">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-cyan-400" />
                  {postDate}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-neutral-400" />
                  {postReadTime}
                </span>
              </div>
            </div>

            {/* Layer 3: Main Title with Dramatic 3D Elevation (Z: 40px) */}
            <div 
              className="mb-3.5 flex items-start justify-between gap-4"
              style={{ transform: "translateZ(40px)" }}
            >
              <h3 className={`font-display font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 leading-snug tracking-tight drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)] ${isWide ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                {post.title}
              </h3>
              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-cyan-500/20 border border-white/10 group-hover:border-cyan-400/40 flex items-center justify-center shrink-0 transition-all duration-300 mt-1">
                <ArrowUpRight className="text-neutral-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" size={17} />
              </div>
            </div>

            {/* Layer 4: Snippet Description (Z: 25px) */}
            <div 
              className="mb-6 flex-grow"
              style={{ transform: "translateZ(25px)" }}
            >
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                {post.excerpt}
              </p>
            </div>
          </div>

          {/* Layer 5: Card Footer Action Bar (Z: 30px) */}
          <div 
            className="border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono tracking-wider uppercase relative z-20"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="text-[10px] text-neutral-400 group-hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-bold">
              READ FULL ARTICLE <ArrowUpRight size={13} className="text-cyan-400" />
            </span>

            <span className="text-[10px] text-neutral-500 font-mono">
              ENGINEERING LOG
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// =============================================================================
// MAIN BLOG SECTION COMPONENT
// =============================================================================
export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.blogs && data.blogs.length > 0) {
          const dbBlogs: BlogPost[] = data.blogs.filter((b: BlogPost) => b.published !== false);
          const allSlugs = new Set(dbBlogs.map((b) => b.slug));
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
    <section 
      id="blog" 
      className="scroll-mt-28 md:scroll-mt-32 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 md:pb-32 relative z-10 bg-black overflow-hidden w-full max-w-full"
    >
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[350px] bg-cyan-500/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-blue-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase mb-4 sm:mb-6 bg-cyan-950/20 backdrop-blur-md">
            <BookOpen size={12} className="text-cyan-400 animate-pulse" /> 3D KNOWLEDGE BASE & THOUGHTS
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.95] text-white break-words">
            LATEST <br />
            <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(var(--theme-rgb),0.4)]">THOUGHTS.</span>
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
              
              return (
                <motion.div
                  key={post.slug || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`${isWide ? "lg:col-span-2" : "lg:col-span-1"} w-full flex flex-col`}
                >
                  <BlogCard3D post={post} isWide={isWide} />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
