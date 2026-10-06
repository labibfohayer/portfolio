import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

const blogContent = {
  "automated-client-support-ai": {
    title: "How I Automated 80% of Client Support with Python & AI",
    date: "Oct 15, 2026",
    category: "AI Automation",
    readTime: "5 min read",
    images: ["/blog/blog-1.jpg"],
    content: `
Customer support is the backbone of any business, but handling repetitive queries can drain a team's energy. At Webpulse Automation, I noticed many of our clients were struggling to keep up with 24/7 customer inquiries. That's when I built "Webpulse Bots."

Using Python and advanced AI models, I engineered a smart chatbot capable of understanding natural language and context. It wasn't just about keyword matching; the AI was trained on specific business data to provide accurate, human-like responses.

The result? The bot successfully resolved 80% of routine client queries automatically. Human agents were freed up to focus on complex issues, drastically reducing response times from hours to seconds. This is the power of AI automation—it doesn't replace humans; it empowers them.
    `
  },
  "delivery-rider-to-tech-founder": {
    title: "From Delivery Rider to Tech Founder: My Journey",
    date: "Sep 28, 2026",
    category: "Entrepreneurship",
    readTime: "8 min read",
    images: ["/blog/blog-2-inner-1.jpg", "/blog/blog-2-inner-2.jpg"],
    content: `
A few years ago, my daily routine consisted of navigating city traffic as a delivery rider and working as a salesman. Life was a constant grind, but I had a burning passion for technology. Between deliveries and late-night shifts, I started learning how to code.

There were countless nights of frustration, staring at bugs I couldn't fix, but the dream of building something of my own kept me going. I mastered React, Python, and full-stack development step by step.

Today, I am proud to be the Founder and CEO of Webpulse Automation. We build scalable software and AI solutions for businesses. Looking back, the discipline I learned on the streets as a rider gave me the resilience needed to survive in the tech industry. Never let your current situation dictate your future.
    `
  },
  "scaling-nextjs-supabase": {
    title: "Scaling Full-Stack Apps with Next.js & Supabase",
    date: "Aug 10, 2026",
    category: "Web Development",
    readTime: "6 min read",
    images: ["/blog/blog-3-new.jpg"],
    content: `
When building "Hisab App" (a financial tracker) and "Ponyopuri" (an e-commerce storefront), speed and scalability were my top priorities. That's why I chose Next.js and Supabase as my core stack.

Next.js provides excellent Server-Side Rendering (SSR), ensuring that the applications load instantly and rank highly on search engines. Supabase, as an open-source Firebase alternative, gave me the power of a robust PostgreSQL database with real-time capabilities.

One of the biggest challenges was handling complex relational data for accounting without slowing down the UI. By leveraging Next.js API routes and Supabase's powerful querying, I managed to create a seamless, high-speed experience. Choosing the right architecture from day one is the secret to building apps that scale effortlessly.
    `
  },
  "ai-powered-customer-support": {
    title: "The Future of Business: AI-Powered Customer Support",
    date: "Jul 22, 2026",
    category: "Technology",
    readTime: "4 min read",
    images: ["/blog/blog-4-inner.jpg"],
    content: `
Imagine this: It's 3:00 AM, and a potential customer visits your website with a question. By the time your team wakes up to reply at 9:00 AM, the customer has already bought from a competitor. This is the reality for businesses without AI support.

AI-powered customer support is no longer a luxury; it's a necessity. Modern AI bots do more than just say "Hello." They can analyze inventory, process orders, and provide personalized recommendations in real time.

At Webpulse Automation, we integrate these smart agents directly into your workflow. Investing in an AI chatbot means your business is open 24/7, catching leads while you sleep. The future of business belongs to those who adapt to automation today.
    `
  }
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogContent[resolvedParams.slug as keyof typeof blogContent];

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split('\n\n').map(p => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-[black] text-white selection:bg-cyan-500/30">
      
      {/* 1. Full-Width Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[400px] overflow-hidden flex items-end">
        {/* Hero Background Images */}
        <div className="absolute inset-0">
          {post.images.length > 1 ? (
            <div className="flex h-full w-full">
              {post.images.map((img, i) => (
                <img key={i} src={img} className="w-1/2 h-full object-cover object-top" alt="Cover" />
              ))}
            </div>
          ) : (
            <img src={post.images[0]} className="w-full h-full object-cover object-top" alt="Cover" />
          )}
        </div>
        
        {/* Dark Gradients for Readability and Fade-Out */}
        <div className="absolute inset-0 bg-gradient-to-t from-[black] via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-0 left-0 w-full p-6 md:p-12 z-30">
          <Link href="/#blog" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all group bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/40">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm font-bold tracking-widest uppercase">Back to Home</span>
          </Link>
        </div>

        {/* Title & Meta over Hero */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 pb-16 md:pb-24 w-full">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
            <span className="px-4 py-1.5 bg-cyan-500/20 text-cyan-400 text-[10px] md:text-xs font-bold rounded-full border border-cyan-500/30 uppercase tracking-widest backdrop-blur-md">
              {post.category}
            </span>
            <span className="text-neutral-300 text-xs md:text-sm font-medium drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">{post.date}</span>
            <span className="text-cyan-400 text-xs md:text-sm font-medium drop-shadow-md bg-cyan-950/40 px-3 py-1 rounded-full backdrop-blur-md border border-cyan-500/20">• {post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white drop-shadow-2xl">
            {post.title}
          </h1>
        </div>
      </div>

      {/* 4. Glassmorphism Article Card (Overlapping) */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-30 -mt-12 md:-mt-20 pb-32">
        <div className="glass-card p-6 md:p-14 lg:p-16 rounded-[2rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          {/* 3. Typography & Drop Cap */}
          <div className="prose prose-invert prose-cyan max-w-none prose-lg md:prose-xl relative z-10 text-neutral-300">
            {paragraphs.map((p, idx) => {
              // First Paragraph: Drop Cap
              if (idx === 0) {
                return (
                  <p key={idx} className="leading-relaxed mb-10 first-letter:text-7xl first-letter:font-display first-letter:font-bold first-letter:text-cyan-400 first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] first-line:tracking-widest first-line:uppercase first-line:text-neutral-400">
                    {p}
                  </p>
                );
              }
              
              // Second Paragraph: Neon Blockquote Style (if there are enough paragraphs)
              if (idx === 1 && paragraphs.length > 2) {
                return (
                  <p key={idx} className="leading-relaxed mb-10 pl-6 border-l-2 border-transparent relative bg-gradient-to-r from-cyan-950/30 to-transparent py-4 pr-4 rounded-r-2xl text-white font-medium">
                    <span className="absolute left-[-2px] top-0 w-[2px] h-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]" />
                    {p}
                  </p>
                );
              }

              // Standard Paragraph
              return (
                <p key={idx} className="leading-relaxed mb-10 text-neutral-400">
                  {p}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
