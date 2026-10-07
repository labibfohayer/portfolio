"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Edit2, CheckCircle2, Loader2 } from "lucide-react";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.projects);
        }
      });
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("Success! Database updated instantly.");
      } else {
        setSaveStatus(`Error: ${data.message}`);
      }
    } catch (err: any) {
      setSaveStatus(`Error: ${err.message}`);
    }
    setIsSaving(false);
  };

  const updateProjectField = (index: number, field: string, value: string) => {
    const newProjects = [...projects];
    // @ts-ignore
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const addProject = () => {
    const newProject = {
      id: `0${projects.length + 1}`,
      title: "NEW PROJECT",
      role: "ROLE",
      desc: "Description here.",
      tech: ["REACT", "NEXT.JS"],
      image: "",
      contributions: ["Contribution 1", "Contribution 2"],
      liveUrl: "#",
      githubUrl: "#"
    };
    setProjects([newProject, ...projects]);
  };

  const removeProject = (index: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const newProjects = [...projects];
      newProjects.splice(index, 1);
      setProjects(newProjects);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">Projects Manager</h1>
          <p className="text-neutral-400 text-xs font-mono mt-1">Add, edit, or delete portfolio projects here.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={addProject}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-neutral-700 transition-colors flex items-center gap-2 border border-white/10"
          >
            <Plus size={14} /> ADD NEW
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-cyan-500 text-black rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)] disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            SAVE CHANGES
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl text-sm font-mono border flex items-center gap-3 ${saveStatus.includes('Error') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
          <CheckCircle2 size={16} /> {saveStatus}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {projects.map((project, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-4 relative group">
            <button 
              onClick={() => removeProject(idx)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
            >
              <Trash2 size={14} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Title</label>
                <input 
                  type="text" 
                  value={project.title} 
                  onChange={(e) => updateProjectField(idx, 'title', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Role / Category</label>
                <input 
                  type="text" 
                  value={project.role} 
                  onChange={(e) => updateProjectField(idx, 'role', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Description</label>
                <textarea 
                  value={project.desc} 
                  onChange={(e) => updateProjectField(idx, 'desc', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 min-h-[80px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Live URL</label>
                <input 
                  type="text" 
                  value={project.liveUrl} 
                  onChange={(e) => updateProjectField(idx, 'liveUrl', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">GitHub URL</label>
                <input 
                  type="text" 
                  value={project.githubUrl} 
                  onChange={(e) => updateProjectField(idx, 'githubUrl', e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
            <div className="text-xs text-neutral-500 mt-2 flex items-center gap-2">
              <Edit2 size={12} /> Tech stack, images, and bullet points can be edited directly in the code for now. Full JSON support coming soon.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
