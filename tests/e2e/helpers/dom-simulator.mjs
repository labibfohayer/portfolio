/**
 * Opaque DOM Simulator for Admin Visual Builder & Public Site
 * Simulates user interactions (clicks, keyboard input, file picker, viewport changes, saves)
 */

import { CANONICAL_SECTIONS, SUPPORTED_FONTS, STANDARD_VIEWPORTS, COLOR_PALETTE_PRESETS } from "./contracts.mjs";
import { simulateCanvasCompression, TINY_VALID_PNG } from "./image-fixture.mjs";

export class VisualBuilderSimulator {
  constructor(apiHandler) {
    this.apiHandler = apiHandler;
    this.isAuthenticated = true;
    this.currentViewport = "desktop";
    this.activeSection = "home";
    this.selectedElementId = null;
    this.toolbarVisible = false;
    this.toolbarType = null; // 'text' | 'image'
    
    // Default element definitions across 7 canonical sections
    this.defaultElements = {
      "home.hero.greeting": { type: "text", page: "home", section: "home", content: "Hi, I'm Labib", fontFamily: "Outfit", color: "#ffffff" },
      "home.hero.title": { type: "text", page: "home", section: "home", content: "FULL-STACK AI DEVELOPER", fontFamily: "Space Grotesk", color: "#06b6d4" },
      "home.hero.avatar": { type: "image", page: "home", section: "home", content: "/profile-transparent.png" },
      "about.story.title": { type: "text", page: "about", section: "about", content: "Engineering Scalable AI Systems", fontFamily: "Outfit", color: "#ffffff" },
      "skills.heading.title": { type: "text", page: "skills", section: "skills", content: "Core Capabilities & Radar", fontFamily: "Space Grotesk", color: "#22d3ee" },
      "experience.current.role": { type: "text", page: "experience", section: "experience", content: "Senior AI Systems Architect", fontFamily: "Outfit", color: "#ec4899" },
      "projects.featured.title": { type: "text", page: "projects", section: "projects", content: "Autonomous Workflow Engine", fontFamily: "Space Grotesk", color: "#10b981" },
      "blog.featured.title": { type: "text", page: "blog", section: "blog", content: "Building Production Multi-Agent Systems", fontFamily: "Outfit", color: "#ffffff" },
      "contact.cta.heading": { type: "text", page: "contact", section: "contact", content: "Let's Build Something Exceptional", fontFamily: "Space Grotesk", color: "#f59e0b" },
    };

    // Stored database overrides (loaded from GET /api/content)
    this.persistedOverrides = {};
    // Unsaved local drafts in editor
    this.draftOverrides = {};
    this.isDirty = false;
  }

  async loadInitialData() {
    const res = await this.apiHandler.handleGet();
    const data = await res.json();
    if (data.success && data.data) {
      this.persistedOverrides = { ...data.data };
    }
  }

  // Viewport switching
  setViewport(viewportKey) {
    if (!STANDARD_VIEWPORTS[viewportKey]) {
      throw new Error(`Unsupported viewport: ${viewportKey}. Supported: ${Object.keys(STANDARD_VIEWPORTS).join(", ")}`);
    }
    this.currentViewport = viewportKey;
    return STANDARD_VIEWPORTS[viewportKey];
  }

  getViewportWidth() {
    return STANDARD_VIEWPORTS[this.currentViewport];
  }

  // Section navigation jump
  navigateToSection(section) {
    const norm = section.replace(/^#/, "");
    if (!CANONICAL_SECTIONS.includes(norm)) {
      throw new Error(`Unknown section: ${section}`);
    }
    this.activeSection = norm;
    return this.activeSection;
  }

  // Click element to select
  clickElement(elementId) {
    const el = this.defaultElements[elementId];
    if (!el) {
      throw new Error(`Element ${elementId} not found in DOM`);
    }
    this.selectedElementId = elementId;
    this.toolbarVisible = true;
    this.toolbarType = el.type;
    return {
      selectedElementId: elementId,
      toolbarType: el.type,
      currentValue: this.getCurrentValue(elementId),
    };
  }

  deselect() {
    this.selectedElementId = null;
    this.toolbarVisible = false;
    this.toolbarType = null;
  }

  // Current active value for element (draft > persisted > default)
  getCurrentValue(elementId) {
    const base = this.defaultElements[elementId] || {};
    const persisted = this.persistedOverrides[elementId] || {};
    const draft = this.draftOverrides[elementId] || {};
    return {
      key: elementId,
      page: draft.page || persisted.page || base.page,
      section: draft.section || persisted.section || base.section,
      type: draft.type || persisted.type || base.type,
      content: draft.content !== undefined ? draft.content : (persisted.content !== undefined ? persisted.content : base.content),
      fontFamily: draft.fontFamily !== undefined ? draft.fontFamily : (persisted.fontFamily !== undefined ? persisted.fontFamily : base.fontFamily),
      color: draft.color !== undefined ? draft.color : (persisted.color !== undefined ? persisted.color : base.color),
    };
  }

  // Inline Text Editing
  updateTextContent(newContent) {
    if (!this.selectedElementId || this.toolbarType !== "text") {
      throw new Error("No text element currently selected");
    }
    const current = this.getCurrentValue(this.selectedElementId);
    this.draftOverrides[this.selectedElementId] = {
      ...current,
      content: newContent,
    };
    this.isDirty = true;
    return this.getCurrentValue(this.selectedElementId);
  }

  // Font Family selection
  updateFontFamily(fontName) {
    if (!this.selectedElementId || this.toolbarType !== "text") {
      throw new Error("No text element currently selected");
    }
    if (!SUPPORTED_FONTS.includes(fontName)) {
      throw new Error(`Unsupported font family: ${fontName}`);
    }
    const current = this.getCurrentValue(this.selectedElementId);
    this.draftOverrides[this.selectedElementId] = {
      ...current,
      fontFamily: fontName,
    };
    this.isDirty = true;
    return this.getCurrentValue(this.selectedElementId);
  }

  // Text Color selection
  updateTextColor(hexColor) {
    if (!this.selectedElementId || this.toolbarType !== "text") {
      throw new Error("No text element currently selected");
    }
    // Simple hex regex check
    const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hexColor);
    if (!isHex) {
      throw new Error(`Invalid color code: ${hexColor}`);
    }
    const current = this.getCurrentValue(this.selectedElementId);
    this.draftOverrides[this.selectedElementId] = {
      ...current,
      color: hexColor,
    };
    this.isDirty = true;
    return this.getCurrentValue(this.selectedElementId);
  }

  // Inline Image Replacement with automatic canvas compression
  async uploadImage(fileData) {
    if (!this.selectedElementId || this.toolbarType !== "image") {
      throw new Error("No image element currently selected");
    }
    // Run canvas compression pipeline
    const compressionResult = simulateCanvasCompression(fileData);
    const current = this.getCurrentValue(this.selectedElementId);
    this.draftOverrides[this.selectedElementId] = {
      ...current,
      content: compressionResult.dataUrl,
    };
    this.isDirty = true;
    return {
      element: this.getCurrentValue(this.selectedElementId),
      compression: compressionResult,
    };
  }

  // Discard draft overrides
  discardDrafts() {
    this.draftOverrides = {};
    this.isDirty = false;
    this.deselect();
  }

  // Click "Save Changes" button
  async saveChanges() {
    const items = Object.values(this.draftOverrides);
    if (items.length === 0) {
      return { success: true, count: 0, message: "No changes to save" };
    }

    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (this.isAuthenticated) {
      headers.set("cookie", "admin_auth=true");
    }

    const req = new Request("http://localhost/api/content", {
      method: "POST",
      headers,
      body: JSON.stringify({ items }),
    });

    const res = await this.apiHandler.handlePost(req);
    const result = await res.json();

    if (res.status === 200 && result.success) {
      // Overrides persisted
      for (const item of items) {
        this.persistedOverrides[item.key] = { ...item };
      }
      this.draftOverrides = {};
      this.isDirty = false;
    }

    return {
      status: res.status,
      ...result,
    };
  }

  // Render public visitor site simulation
  renderPublicSite() {
    const renderedElements = {};
    for (const [key, base] of Object.entries(this.defaultElements)) {
      const persisted = this.persistedOverrides[key];
      if (persisted) {
        renderedElements[key] = {
          content: persisted.content,
          fontFamily: persisted.fontFamily || base.fontFamily,
          color: persisted.color || base.color,
          isOverridden: true,
        };
      } else {
        renderedElements[key] = {
          content: base.content,
          fontFamily: base.fontFamily,
          color: base.color,
          isOverridden: false,
        };
      }
    }
    return renderedElements;
  }
}
