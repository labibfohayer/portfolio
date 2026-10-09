"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Save, X, Type, Image as ImageIcon, Palette, Loader2, Eye, Pencil, Undo2 } from "lucide-react";

interface ContentOverride {
  key: string;
  page: string;
  section: string;
  type: "text" | "image";
  content: string;
  fontFamily?: string;
  color?: string;
}

const FONT_OPTIONS = [
  "inherit",
  "Inter, sans-serif",
  "Georgia, serif",
  "Courier New, monospace",
  "Poppins, sans-serif",
  "Playfair Display, serif",
  "Roboto Mono, monospace",
  "Space Grotesk, sans-serif",
];

export default function VisualEditorPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [selectedElement, setSelectedElement] = useState<{
    key: string;
    type: "text" | "image";
    content: string;
    fontFamily?: string;
    color?: string;
    rect?: DOMRect;
  } | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, ContentOverride>>(new Map());
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");

  const sections = [
    { id: "home", label: "Home", hash: "#home" },
    { id: "about", label: "About", hash: "#about" },
    { id: "projects", label: "Projects", hash: "#projects" },
    { id: "skills", label: "Skills", hash: "#skills" },
    { id: "experience", label: "Experience", hash: "#experience" },
    { id: "blog", label: "Blog", hash: "#blog" },
    { id: "contact", label: "Contact", hash: "#contact" },
  ];

  // Inject edit mode into iframe
  const injectEditMode = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    const body = doc.body;
    if (!body) return;

    // Add visual indicator for edit mode
    const existingStyle = doc.getElementById("visual-editor-styles");
    if (existingStyle) existingStyle.remove();

    const style = doc.createElement("style");
    style.id = "visual-editor-styles";
    style.textContent = `
      [data-editable]:hover {
        outline: 2px dashed #06b6d4 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
      }
      [data-editable].ve-selected {
        outline: 2px solid #06b6d4 !important;
        outline-offset: 2px !important;
        background: rgba(6, 182, 212, 0.05) !important;
      }
      .ve-edit-badge {
        position: fixed;
        top: 12px;
        right: 12px;
        background: linear-gradient(135deg, #06b6d4, #0284c7);
        color: white;
        padding: 8px 16px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        z-index: 99999;
        pointer-events: none;
        box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
      }
    `;
    doc.head.appendChild(style);

    // Add edit mode badge
    let badge = doc.querySelector(".ve-edit-badge");
    if (!badge) {
      badge = doc.createElement("div");
      badge.className = "ve-edit-badge";
      badge.textContent = "✏️ EDIT MODE";
      body.appendChild(badge);
    }

    // Mark editable elements
    const editableSelectors = "h1, h2, h3, h4, h5, h6, p, span, a, button, label, img";
    const elements = body.querySelectorAll(editableSelectors);
    let editableIndex = 0;

    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // Skip nav, scripts, and tiny/invisible elements
      if (
        htmlEl.closest("nav") ||
        htmlEl.closest("script") ||
        htmlEl.closest(".ve-edit-badge") ||
        htmlEl.offsetHeight < 5
      ) return;

      // Only mark elements that have direct text or are images
      const isImage = htmlEl.tagName === "IMG";
      const hasDirectText = !isImage && htmlEl.childNodes.length > 0 &&
        Array.from(htmlEl.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent && n.textContent.trim().length > 0
        );

      if (!isImage && !hasDirectText) return;

      // Determine section
      const section = htmlEl.closest("section");
      const sectionId = section?.id || "home";

      const key = `ve-${sectionId}-${htmlEl.tagName.toLowerCase()}-${editableIndex}`;
      htmlEl.setAttribute("data-editable", key);
      htmlEl.setAttribute("data-ve-section", sectionId);
      htmlEl.setAttribute("data-ve-type", isImage ? "image" : "text");
      editableIndex++;
    });

    // Add click listener
    const clickHandler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = (e.target as HTMLElement).closest("[data-editable]") as HTMLElement;
      if (!target) {
        setSelectedElement(null);
        doc.querySelectorAll(".ve-selected").forEach((el) => el.classList.remove("ve-selected"));
        return;
      }

      doc.querySelectorAll(".ve-selected").forEach((el) => el.classList.remove("ve-selected"));
      target.classList.add("ve-selected");

      const key = target.getAttribute("data-editable")!;
      const type = target.getAttribute("data-ve-type") as "text" | "image";
      const rect = target.getBoundingClientRect();

      setSelectedElement({
        key,
        type,
        content: type === "image" ? (target as HTMLImageElement).src : target.textContent || "",
        fontFamily: window.getComputedStyle(target).fontFamily,
        color: window.getComputedStyle(target).color,
        rect,
      });
    };

    body.removeEventListener("click", clickHandler, true);
    body.addEventListener("click", clickHandler, true);

    // Prevent navigation inside iframe
    const links = body.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, true);
    });
  }, []);

  useEffect(() => {
    if (iframeLoaded && isEditMode) {
      // Small delay to let iframe fully render
      setTimeout(() => injectEditMode(), 500);
    }
  }, [iframeLoaded, isEditMode, injectEditMode]);

  // Apply a change to the iframe element
  const applyChange = (override: Partial<ContentOverride>) => {
    if (!selectedElement || !iframeRef.current?.contentDocument) return;

    const doc = iframeRef.current.contentDocument;
    const el = doc.querySelector(`[data-editable="${selectedElement.key}"]`) as HTMLElement;
    if (!el) return;

    const fullOverride: ContentOverride = {
      key: selectedElement.key,
      page: "home",
      section: el.getAttribute("data-ve-section") || "home",
      type: selectedElement.type,
      content: override.content ?? selectedElement.content,
      fontFamily: override.fontFamily ?? selectedElement.fontFamily,
      color: override.color ?? selectedElement.color,
    };

    // Apply visually in iframe
    if (override.content !== undefined) {
      if (selectedElement.type === "image") {
        (el as HTMLImageElement).src = override.content;
      } else {
        el.textContent = override.content;
      }
    }
    if (override.fontFamily) {
      el.style.fontFamily = override.fontFamily;
    }
    if (override.color) {
      el.style.color = override.color;
    }

    // Update state
    setSelectedElement((prev) => prev ? { ...prev, ...override } : prev);
    setPendingChanges((prev) => {
      const next = new Map(prev);
      next.set(selectedElement.key, fullOverride);
      return next;
    });
  };

  // Save all pending changes
  const handleSave = async () => {
    if (pendingChanges.size === 0) return;

    setIsSaving(true);
    setSaveStatus("");

    try {
      const items = Array.from(pendingChanges.values());
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus(`✅ ${data.count} change(s) saved!`);
        setPendingChanges(new Map());
      } else {
        setSaveStatus(`❌ ${data.message}`);
      }
    } catch {
      setSaveStatus("❌ Failed to save. Try again.");
    }

    setIsSaving(false);
    setTimeout(() => setSaveStatus(""), 4000);
  };

  // Navigate iframe to section
  const scrollToSection = (hash: string, id: string) => {
    setCurrentSection(id);
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;
    const el = iframe.contentDocument.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        let w = img.width, h = img.height;
        const maxDim = 800;
        if (w > h && w > maxDim) { h *= maxDim / w; w = maxDim; }
        else if (h > maxDim) { w *= maxDim / h; h = maxDim; }
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        applyChange({ content: compressed });
      };
    };
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
      {/* Top Toolbar */}
      <div className="glass-card rounded-2xl border border-white/10 p-4 flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <Pencil size={16} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-sm font-display font-bold text-white tracking-widest uppercase">Visual Editor</h1>
              <p className="text-[10px] text-neutral-500 font-mono">Click any element to edit • Canva-style editing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingChanges.size > 0 && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                {pendingChanges.size} unsaved
              </span>
            )}
            {saveStatus && (
              <span className="text-[10px] font-bold text-green-400">{saveStatus}</span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || pendingChanges.size === 0}
              className="px-4 py-2 bg-cyan-500 text-black rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(var(--theme-rgb),0.3)]"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              SAVE ALL
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.hash, s.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                currentSection === s.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Live Preview (iframe) */}
        <div className="flex-1 glass-card rounded-2xl border border-white/10 overflow-hidden relative">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-cyan-400 animate-spin" />
                <p className="text-neutral-400 text-xs font-mono tracking-wider">Loading website preview...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="/"
            className="w-full h-full border-0 bg-black"
            onLoad={() => {
              setIframeLoaded(true);
              if (isEditMode) setTimeout(() => injectEditMode(), 300);
            }}
          />
        </div>

        {/* Right Panel: Contextual Toolbar */}
        <div className="w-72 glass-card rounded-2xl border border-white/10 p-5 flex flex-col gap-4 overflow-y-auto">
          {selectedElement ? (
            <>
              {/* Element Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  {selectedElement.type === "image" ? (
                    <ImageIcon size={16} className="text-cyan-400" />
                  ) : (
                    <Type size={16} className="text-cyan-400" />
                  )}
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                    {selectedElement.type === "image" ? "Image" : "Text"} Element
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedElement(null);
                    if (iframeRef.current?.contentDocument) {
                      iframeRef.current.contentDocument
                        .querySelectorAll(".ve-selected")
                        .forEach((el) => el.classList.remove("ve-selected"));
                    }
                  }}
                  className="text-neutral-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {selectedElement.type === "text" ? (
                <>
                  {/* Text Content */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Content</label>
                    <textarea
                      value={selectedElement.content}
                      onChange={(e) => applyChange({ content: e.target.value })}
                      rows={4}
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                    />
                  </div>

                  {/* Font Family */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase flex items-center gap-1">
                      <Type size={12} /> Font Family
                    </label>
                    <select
                      value={selectedElement.fontFamily || "inherit"}
                      onChange={(e) => applyChange({ fontFamily: e.target.value })}
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font === "inherit" ? "Default" : font.split(",")[0]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Text Color */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase flex items-center gap-1">
                      <Palette size={12} /> Text Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={selectedElement.color || "#ffffff"}
                        onChange={(e) => applyChange({ color: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={selectedElement.color || "#ffffff"}
                        onChange={(e) => applyChange({ color: e.target.value })}
                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 font-mono"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Image Preview */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">Preview</label>
                    <div className="w-full h-32 rounded-lg border border-white/10 overflow-hidden bg-black/50">
                      <img
                        src={selectedElement.content}
                        alt="Selected"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase flex items-center gap-1">
                      <ImageIcon size={12} /> Replace Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-400 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30"
                    />
                  </div>
                </>
              )}

              {/* Key Reference */}
              <div className="mt-auto pt-3 border-t border-white/10">
                <p className="text-[9px] text-neutral-600 font-mono break-all">
                  Key: {selectedElement.key}
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Eye size={28} className="text-cyan-500/50" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wider mb-2">SELECT AN ELEMENT</h3>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Click on any text or image in the preview to edit it. A toolbar will appear here with editing options.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-4">
                <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                  <Type size={12} className="text-cyan-500/50" /> Click text → Edit content, font, color
                </div>
                <div className="flex items-center gap-2 text-[10px] text-neutral-600">
                  <ImageIcon size={12} className="text-cyan-500/50" /> Click image → Upload replacement
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
