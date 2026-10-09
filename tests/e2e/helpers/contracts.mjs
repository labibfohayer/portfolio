/**
 * Authoritative Interface Contracts and Reference Oracle
 * Derived directly from PROJECT.md and ORIGINAL_REQUEST.md
 */

import fs from "node:fs";
import path from "node:path";

export const CANONICAL_SECTIONS = [
  "home",
  "about",
  "projects",
  "skills",
  "experience",
  "blog",
  "contact",
];

export const SUPPORTED_FONTS = [
  "Outfit",
  "Space Grotesk",
  "Inter",
  "Montserrat",
  "Playfair",
  "Great Vibes",
];

export const STANDARD_VIEWPORTS = {
  desktop: 1440,
  tablet: 768,
  mobile: 390,
};

export const COLOR_PALETTE_PRESETS = [
  "#06b6d4", // Neon Cyan
  "#22d3ee", // Cyan Light
  "#ec4899", // Vibrant Pink
  "#10b981", // Emerald Green
  "#a855f7", // Electric Purple
  "#ffffff", // Pure White
  "#a3a3a3", // Muted Silver
  "#f59e0b", // Sunset Amber
];

/**
 * Validates an ElementOverride object against PROJECT.md § Interface Contracts
 */
export function validateElementOverride(item) {
  if (!item || typeof item !== "object") {
    return { valid: false, error: "Override item must be a non-null object" };
  }
  if (!item.key || typeof item.key !== "string" || item.key.trim().length === 0) {
    return { valid: false, error: "Override key is required and must be a non-empty string" };
  }
  if (!item.page || typeof item.page !== "string") {
    return { valid: false, error: "Override page is required" };
  }
  if (!item.section || typeof item.section !== "string") {
    return { valid: false, error: "Override section is required" };
  }
  if (item.type !== "text" && item.type !== "image") {
    return { valid: false, error: `Invalid override type "${item.type}". Must be "text" or "image"` };
  }
  if (typeof item.content !== "string") {
    return { valid: false, error: "Override content must be a string" };
  }
  if (item.fontFamily !== undefined && typeof item.fontFamily !== "string") {
    return { valid: false, error: "Override fontFamily must be a string if provided" };
  }
  if (item.color !== undefined && typeof item.color !== "string") {
    return { valid: false, error: "Override color must be a string if provided" };
  }
  return { valid: true };
}

/**
 * In-Memory Content Repository for isolated E2E persistence testing
 */
export class ContentRepository {
  constructor() {
    this.storage = new Map();
  }

  clear() {
    this.storage.clear();
  }

  get(key) {
    return this.storage.get(key) || null;
  }

  getAll() {
    const obj = {};
    for (const [k, v] of this.storage.entries()) {
      obj[k] = { ...v };
    }
    return obj;
  }

  upsert(item) {
    const validation = validateElementOverride(item);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    const record = {
      ...item,
      updatedAt: new Date().toISOString(),
    };
    this.storage.set(item.key, record);
    return record;
  }

  upsertBatch(items) {
    if (!Array.isArray(items)) {
      throw new Error("Items must be an array");
    }
    let count = 0;
    for (const item of items) {
      this.upsert(item);
      count++;
    }
    return count;
  }
}

/**
 * Standard HTTP API Request/Response Oracle for /api/content
 * Follows PROJECT.md § Interface Contracts:
 * GET: returns { success: true, data: Record<string, ElementOverride> }
 * POST: requires admin_auth=true cookie, body: { items: ElementOverride[] }, returns { success: true, count }
 */
export class ContentApiHandler {
  constructor(repository = new ContentRepository()) {
    this.repository = repository;
  }

  async handleGet(req) {
    try {
      const data = this.repository.getAll();
      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, message: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  async handlePost(req) {
    try {
      // Check admin_auth cookie
      const cookieHeader = req.headers ? (req.headers.get("cookie") || "") : "";
      const hasAuth = cookieHeader.split(";").some((c) => c.trim() === "admin_auth=true");

      if (!hasAuth) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized. Admin authentication required." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      let body;
      try {
        body = await req.json();
      } catch (e) {
        return new Response(JSON.stringify({ success: false, message: "Invalid JSON body" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!body || !Array.isArray(body.items)) {
        return new Response(JSON.stringify({ success: false, message: "Missing or invalid 'items' array" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      for (const item of body.items) {
        const validation = validateElementOverride(item);
        if (!validation.valid) {
          return new Response(JSON.stringify({ success: false, message: validation.error }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      const count = this.repository.upsertBatch(body.items);
      return new Response(JSON.stringify({ success: true, count }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, message: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
