"use client";

import { useState, useEffect } from "react";
import { PenTool, Plus, Trash2, Edit3, X, Save, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<any>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.blogs);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentBlog._id ? `/api/blogs/${currentBlog._id}` : "/api/blogs";
    const method = currentBlog._id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentBlog),
    });

    const data = await res.json();
    if (data.success) {
      setIsEditing(false);
      setCurrentBlog(null);
      fetchBlogs();
    } else {
      alert(data.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchBlogs();
  };

  if (loading && !isEditing) {
    return <div className="text-cyan-400 font-mono animate-pulse max-w-5xl mx-auto">Loading blogs...</div>;
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <PenTool size={18} className="text-cyan-400" />
            {currentBlog._id ? "Edit Blog Post" : "Create New Blog"}
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="p-2 text-neutral-400 hover:text-white bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6 glass-card p-6 md:p-8 rounded-2xl border border-white/10">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Title</label>
            <input 
              required type="text" 
              value={currentBlog.title || ""} 
              onChange={e => setCurrentBlog({...currentBlog, title: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              placeholder="E.g., How I built a custom OS..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Short Excerpt</label>
            <textarea 
              required rows={2}
              value={currentBlog.excerpt || ""} 
              onChange={e => setCurrentBlog({...currentBlog, excerpt: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none"
              placeholder="A brief summary of this blog post..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Full Content (Markdown Supported)</label>
            <textarea 
              required rows={12}
              value={currentBlog.content || ""} 
              onChange={e => setCurrentBlog({...currentBlog, content: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 font-mono"
              placeholder="# Heading 1&#10;Write your awesome content here..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Cover Image URL (Optional)</label>
            <input 
              type="text" 
              value={currentBlog.coverImage || ""} 
              onChange={e => setCurrentBlog({...currentBlog, coverImage: e.target.value})}
              className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input 
              type="checkbox" 
              id="published"
              checked={currentBlog.published !== false}
              onChange={e => setCurrentBlog({...currentBlog, published: e.target.checked})}
              className="w-4 h-4 accent-cyan-500"
            />
            <label htmlFor="published" className="text-sm text-neutral-300 cursor-pointer">Publish instantly</label>
          </div>

          <button 
            type="submit"
            className="w-full py-4 mt-4 bg-cyan-500 text-black rounded-xl font-bold tracking-widest text-xs uppercase hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--theme-rgb),0.3)]"
          >
            <Save size={16} /> Save Blog Post
          </button>

        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <PenTool size={18} className="text-cyan-400" /> Blog Content Manager
          </h1>
          <p className="text-neutral-400 text-xs font-mono mt-1">Write, edit, and publish articles.</p>
        </div>
        <button 
          onClick={() => { setCurrentBlog({ published: true }); setIsEditing(true); }}
          className="px-4 py-2 bg-white text-black rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> WRITE NEW POST
        </button>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 gap-4">
        {blogs.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-white/10">
            <p className="text-neutral-500 font-mono text-sm">No blog posts found. Start writing!</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <motion.div 
              key={blog._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 justify-between md:items-center group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{blog.title}</h3>
                  {blog.published ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
                      <Eye size={10}/> Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 uppercase tracking-widest flex items-center gap-1">
                      <EyeOff size={10}/> Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 mb-2 line-clamp-1">{blog.excerpt}</p>
                <p className="text-xs text-neutral-600 font-mono">Date: {new Date(blog.createdAt).toLocaleDateString()} | /blog/{blog.slug}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setCurrentBlog(blog); setIsEditing(true); }}
                  className="p-3 bg-white/5 hover:bg-cyan-500/20 text-neutral-400 hover:text-cyan-400 rounded-xl transition-all border border-transparent hover:border-cyan-500/30"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(blog._id)}
                  className="p-3 bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
