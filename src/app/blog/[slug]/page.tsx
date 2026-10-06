import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

const blogContent = {
  "automated-client-support-ai": {
    title: "How I Automated 80% of Client Support with Python & AI",
    date: "Oct 15, 2026",
    category: "AI Automation",
    readTime: "5 min read",
    image: "/blog/blog-1.jpg",
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
    image: "/blog/blog-2.jpg",
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
    image: "/blog/blog-3.jpg",
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
    image: "/blog/blog-4.jpg",
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

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/#blog" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="glass-card p-6 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden bg-black/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Blog Cover Image */}
            <div className="w-full h-64 md:h-96 rounded-2xl mb-10 overflow-hidden relative border border-white/5 shadow-2xl">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/20 uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-neutral-400 text-sm font-medium">{post.date}</span>
              <span className="text-neutral-500 text-sm font-medium">• {post.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-10 leading-tight">
              {post.title}
            </h1>
            
            <div className="prose prose-invert prose-cyan max-w-none prose-lg">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (!paragraph.trim()) return null;
                return (
                  <p key={idx} className="text-neutral-300 leading-relaxed mb-6">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
