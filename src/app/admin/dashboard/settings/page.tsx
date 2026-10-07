"use client";

import { useState, useEffect } from "react";
import { Settings2, Save, Loader2, Link as LinkIcon, FileText } from "lucide-react";

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    resumeLink: "",
    githubUrl: "",
    linkedinUrl: "",
    facebookUrl: "",
    behanceUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("Settings updated successfully!");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus(`Error: ${data.message}`);
      }
    } catch (err: any) {
      setSaveStatus(`Error: ${err.message}`);
    }
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return <div className="text-cyan-400 font-mono animate-pulse max-w-5xl mx-auto">Loading settings...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-2">
            <Settings2 size={18} className="text-cyan-400" /> System Settings
          </h1>
          <p className="text-neutral-400 text-xs font-mono mt-1">Configure global portfolio preferences and links.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)] disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          SAVE SETTINGS
        </button>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl text-sm font-mono border ${saveStatus.includes('Error') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
          {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Resume Settings */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-2">
            <FileText size={16} className="text-cyan-500" />
            <h2 className="font-bold tracking-widest text-white uppercase text-sm">Resume / CV</h2>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Resume Link (Google Drive / PDF URL)</label>
            <input 
              type="text" 
              name="resumeLink"
              value={settings.resumeLink} 
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Social Settings */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-2">
            <LinkIcon size={16} className="text-cyan-500" />
            <h2 className="font-bold tracking-widest text-white uppercase text-sm">Social Profiles</h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">GitHub URL</label>
            <input type="text" name="githubUrl" value={settings.githubUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">LinkedIn URL</label>
            <input type="text" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Facebook URL</label>
            <input type="text" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Behance URL</label>
            <input type="text" name="behanceUrl" value={settings.behanceUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Instagram URL</label>
            <input type="text" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">X (Twitter) URL</label>
            <input type="text" name="twitterUrl" value={settings.twitterUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">YouTube URL</label>
            <input type="text" name="youtubeUrl" value={settings.youtubeUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">TikTok URL</label>
            <input type="text" name="tiktokUrl" value={settings.tiktokUrl} onChange={handleChange} className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
        </div>

      </div>
    </div>
  );
}
