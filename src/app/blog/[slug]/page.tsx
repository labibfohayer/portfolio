import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import ReactMarkdown from 'react-markdown';

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  await connectToDatabase();
  const post = await Blog.findOne({ slug: resolvedParams.slug, published: true }).lean();

  if (!post) {
    notFound();
  }

  // A default cover image if none is provided
  const coverImage = post.coverImage || "/blog/blog-1.jpg";

  return (
    <div className="min-h-screen bg-[black] text-white selection:bg-cyan-500/30">
      
      {/* 1. Full-Width Hero Section */}
      <div className="relative w-full h-[70vh] md:h-[85vh] min-h-[500px] overflow-hidden flex items-end">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img src={coverImage} className="w-full h-full object-cover object-center" alt={post.title} />
        </div>
        
        {/* Dark Gradients for Readability and Fade-Out */}
        <div className="absolute inset-0 bg-gradient-to-t from-[black] via-black/80 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-0 left-0 w-full p-6 md:p-12 z-30">
          <Link href="/#blog" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all group bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/40">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm font-bold tracking-widest uppercase">Back to Home</span>
          </Link>
        </div>

        {/* Title & Meta over Hero */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 pb-20 md:pb-32 w-full">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6">
            <span className="px-4 py-1.5 bg-cyan-500/20 text-cyan-400 text-[10px] md:text-xs font-bold rounded-full border border-cyan-500/30 uppercase tracking-widest backdrop-blur-md">
              Article
            </span>
            <span className="text-neutral-300 text-xs md:text-sm font-medium drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="text-cyan-400 text-xs md:text-sm font-medium drop-shadow-md bg-cyan-950/40 px-3 py-1 rounded-full backdrop-blur-md border border-cyan-500/20">• 5 min read</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white drop-shadow-2xl">
            {post.title}
          </h1>
        </div>
      </div>

      {/* 4. Glassmorphism Article Card (Overlapping) */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-30 -mt-16 md:-mt-24 pb-32">
        <div className="glass-card p-6 md:p-14 lg:p-16 rounded-[2rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          {/* 3. Typography */}
          <div className="prose prose-invert prose-cyan max-w-none prose-lg md:prose-xl relative z-10 text-neutral-300">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
