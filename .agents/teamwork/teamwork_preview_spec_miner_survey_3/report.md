# Comprehensive Technical Specification: Portfolio Visual Builder

## Executive Summary
This document specifies the architecture, data schemas, API contracts, interaction flows, and edge cases for transforming the Next.js portfolio website into an interactive inline Visual Builder (inspired by Canva and Wix). The visual builder empowers administrators to click on text or image elements on the live portfolio site to edit content, typography, colors, and image assets with zero code deployment or separate dashboard navigation.

---

## 1. Existing Codebase Analysis & Current State

### 1.1 Next.js App Router Architecture
- **Framework**: Next.js 16.3.8 (App Router), React 19.2.8, Tailwind CSS v4, Framer Motion 14.0.0, Lucide React 1.52.0.
- **Root Page Structure (`src/app/page.tsx`)**:
  - The main portfolio is a single-page reactive application partitioned into 7 primary sections accessed via sticky navigation anchors:
    1. **Home (`#home`)**: Hero component with interactive 3D tilt card, bio, typewriter, and stats counter.
    2. **About (`#about`)**: Biography, vision, founder story, and animated targets.
    3. **Projects (`#projects`)**: Dynamic project grid fetched from `/api/projects`.
    4. **Skills (`#skills`)**: Radial capability radar console and marquee.
    5. **Experience (`#experience`)**: Career timeline with spotlight cards.
    6. **Blog (`#blog`)**: Knowledge base grid fetching from `/api/blogs` with fallback static posts.
    7. **Contact (`#contact`)**: Interactive contact form with live WhatsApp link and holographic profile card.
  - Ancillary components: `Navbar`, `TechMarquee`, `Services`, `Footer`, `FloatingMusic`, `Chatbot`, `CommandPalette`, `SocialSidebar`, `PageTracker`.
  - Secondary dynamic route: `src/app/blog/[slug]` for reading individual markdown articles.

### 1.2 Existing Admin Panel Structure
- **Authentication**: Cookie-based (`admin_auth=true`) verified via `/api/auth` comparing against `process.env.ADMIN_USERNAME` and `process.env.ADMIN_PASSWORD`.
- **Layout (`src/app/admin/dashboard/layout.tsx`)**:
  - Fixed dark sidebar with links: `Overview`, `Projects`, `Messages`, `Settings`, `Blogs`.
  - Top action button: "VIEW LIVE WEBSITE" (`/`).
- **Existing Asset Upload & Compression Pattern**:
  - Discovered in `src/app/admin/dashboard/settings/page.tsx` (lines 114–142) and `src/app/admin/dashboard/blogs/page.tsx` (lines 121–147):
  - The project already implements client-side HTML5 Canvas compression (`FileReader` -> `Image` -> `<canvas>` resize to `maxDim: 800` or `1200` -> `canvas.toDataURL("image/jpeg", 0.7)`).
  - This avoids bulky server dependencies (like Sharp or cloud bucket SDKs) and persists compressed Base64 data URLs directly into MongoDB.

---

## 2. Specification Requirements Breakdown

### R1. Admin Visual Editor Interface & Navigation

#### R1.1 Placement & Routing
- Route: `/admin/dashboard/editor` (integrated into Admin Panel sidebar) or `/admin/editor` (full-screen Studio Mode with navigation back to Admin Dashboard).
- The Visual Editor renders the exact public portfolio website with interactive editing capabilities enabled.

#### R1.2 Rendering Architecture Options
1. **Option A: Live Site Iframe with PostMessage / DOM Handshake (Recommended)**
   - The editor renders an iframe: `<iframe src="/?visual_builder=true" id="builder-frame" />`.
   - **Advantages**:
     - 100% style isolation: Admin Panel styles (sidebar, Tailwind v4 variables) do not collide with public site styles.
     - Identical execution environment: Animations (Framer Motion), tilt effects, and CSS variables execute identically to visitors' browsers.
     - Viewport emulation: Easy switching between **Desktop (100% / 1440px)**, **Tablet (768px)**, and **Mobile (390px)** without messing with admin container widths.
   - **Communication Protocol**:
     - Parent window (`/admin/dashboard/editor`) and child iframe (`/?visual_builder=true`) share the same origin (`window.location.origin`).
     - Parent and child communicate via `window.postMessage` or direct DOM access (`iframe.contentWindow.document`).
     - Message types:
       - `BUILDER_READY`: Child notifies parent that page is mounted and editable nodes are indexed.
       - `ELEMENT_SELECTED`: Child notifies parent when an editable element is clicked, transmitting element ID, bounding rect, type, current text, font, color, or image src.
       - `ELEMENT_MUTATED`: Parent instructs child to update an element in real-time (instant preview).
       - `NAVIGATE_SECTION`: Parent requests child to scroll or jump to one of the 7 sections.

2. **Option B: Direct Inline Component Embedding**
   - The editor directly imports `<Hero />`, `<About />`, `<Projects />`, `<Skills />`, `<Experience />`, `<Blog />`, `<Contact />` wrapped inside an `<EditorContext.Provider>`.
   - **Advantages**: Single React state tree; zero serialization overhead.
   - **Disadvantages**:
     - Heavy bundle size in admin route.
     - Potential CSS leaking unless isolated with shadow DOM or strict scoped classes.
     - Global effects (`Preloader`, `GlobalEffects`, `EasterEgg`) run in the admin dashboard unless manually guarded.

#### R1.3 Multi-Page / Section Navigation
- The Visual Editor toolbar provides a sticky navigation bar with 7 page tabs:
  1. `HOME` (`#home`)
  2. `ABOUT` (`#about`)
  3. `PROJECTS` (`#projects`)
  4. `SKILLS` (`#skills`)
  5. `EXPERIENCE` (`#experience`)
  6. `BLOG` (`#blog`)
  7. `CONTACT` (`#contact`)
- When a page tab is clicked:
  - If using Iframe: Sends `{ type: 'NAVIGATE_SECTION', target: '#about' }` to iframe, invoking `document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })`.
  - Also sets active indicator on the tab.
  - If the user scrolls manually in the preview, IntersectionObserver updates the active tab in the editor header.

---

### R2. Inline Text & Style Editing

#### R2.1 Click-to-Edit Interaction Flow
1. **Hover State**:
   - When editor is in "Edit Mode", hovering over any editable text element renders a subtle glowing dashed border (`outline: 1.5px dashed #06b6d4`) with a floating chip indicator displaying the element name (e.g., `Hero Tagline`).
2. **Selection State**:
   - Clicking an editable text element selects it:
     - Outlines the element with a solid bright cyan border (`outline: 2px solid #06b6d4`, `box-shadow: 0 0 12px rgba(6, 182, 212, 0.4)`).
     - Calculates element position via `getBoundingClientRect()`.
     - Spawns the **Canva-like Contextual Toolbar** positioned directly above the element (auto-flipping below if close to viewport top).
3. **Contextual Toolbar Controls (Canva Pattern)**:
   - **Element Breadcrumb**: E.g. `Home > Hero > Headline`.
   - **Inline Text Input / Editor**:
     - Fast content editing textarea/input, OR live `contentEditable="true"` directly on the selected element.
     - Synchronizes keystrokes into live DOM with 0ms latency.
   - **Font Family Selector**:
     - Dropdown menu of styled fonts:
       - `Outfit` (Modern Sans - current default)
       - `Space Grotesk` (Tech Display - current display)
       - `Inter` (Clean Sans)
       - `Montserrat` (Geometric Display)
       - `Playfair Display` (Elegant Serif)
       - `JetBrains Mono` / `Fira Code` (Monospace / Cyberpunk)
       - `Great Vibes` (Script / Signature)
       - `Poppins` (Bold Rounded)
     - Selecting a font immediately updates `style.fontFamily` on the preview element.
   - **Text Color Picker**:
     - Quick Preset Swatches:
       - Cyan Neon (`#06b6d4`)
       - Neon Cyan Light (`#22d3ee`)
       - Vibrant Pink (`#ec4899`)
       - Emerald Green (`#10b981`)
       - Electric Purple (`#a855f7`)
       - Pure White (`#ffffff`)
       - Muted Silver (`#a3a3a3`)
       - Sunset Amber (`#f59e0b`)
     - Custom Hex / Color Picker input (`<input type="color" />`).
     - Selecting a color immediately updates `style.color` on the preview element.
   - **Extended Styling (Optional / Canva Tools)**:
     - Font size adjustment (`+` / `-` / slider).
     - Font weight toggle (`Normal (400)` / `Bold (700)` / `Extra Bold (900)`).
     - Text alignment (`Left`, `Center`, `Right`).
     - Reset button (restores element to factory default).
     - Close / Deselect button (`Esc` or click outside).

---

### R3. Inline Image Replacement & Automatic Compression

#### R3.1 Click-to-Replace Interaction Flow
1. **Hover State**:
   - Hovering over an editable image reveals an overlay badge: `📷 Click to Replace Image`.
2. **Selection State**:
   - Clicking an image opens the **Image Contextual Toolbar**:
     - Thumbnail preview of current image.
     - Image dimensions / file type metadata.
     - "Upload New Image" button (triggers hidden `<input type="file" accept="image/*" />`).
     - "Reset to Default" button.
3. **Upload & Automatic Compression Pipeline**:
   - Once a file is selected from the admin's device:
     1. Validate MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`).
     2. Pass to Client-side Compression Engine:
        - If raster image (JPEG/PNG/WebP):
          - Read as DataURL via `FileReader`.
          - Load into offscreen `HTMLImageElement`.
          - Downscale to max dimensions (e.g. `maxDim = 1200` for hero/blog, `maxDim = 800` for avatars/thumbnails) while preserving aspect ratio.
          - Draw onto offscreen `<canvas>`.
          - Export to high-efficiency JPEG or WebP data URL (`canvas.toDataURL("image/jpeg", 0.75)`).
          - Typical size reduction: 5MB–10MB RAW photo compressed down to ~120KB–250KB Base64 payload.
        - If SVG: Preserve vector data without lossy compression.
     3. Immediate Live Replacement:
        - Updates the image element's `src` in the preview frame instantly.
        - Marks document state as "Dirty / Unsaved Changes".
        - Displays compression metrics (e.g., `Compressed from 4.2 MB to 184 KB (-95%)`).

#### R3.2 Image Compression Comparison Matrix
| Option | Mechanism | Dependencies | Bundle Size Impact | Pros | Cons | Recommendation |
|---|---|---|---|---|---|---|
| **1. HTML5 Canvas Compression** | Client-side Canvas 2D (`toDataURL`/`toBlob`) | None (Standard Web API) | 0 KB | Already proven in `settings` & `blogs`; fast; zero server load; zero network round-trip | Does not read EXIF rotation on very old browsers; lossy JPEG/WebP only | **Primary / Default** |
| **2. browser-image-compression** | Client-side Web Worker library | `browser-image-compression` | ~30 KB | Automatically fixes EXIF rotation; precise target size control | Requires new npm package dependency | **Optional Upgrade** |
| **3. Server-side Sharp** | Next.js API route (`/api/upload`) using `sharp` | `sharp` + filesystem / S3 | > 15 MB (native binary) | Highest fidelity; converts to AVIF/WebP | Requires native binaries on Vercel/Node; disk storage required | **Avoid for now** (Vercel serverless constraints) |

---

### R4. Database Persistence & Dynamic Rendering

#### R4.1 MongoDB Schema Architecture
We evaluate two schemas:

##### Option 1: Dedicated `PageContent` Schema (Recommended)
Creating a dedicated `PageContent` model provides clean separation of concerns from global social media links (`Settings`), prevents document bloat, and supports scalable per-page or global queries.

```typescript
// src/models/PageContent.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IElementOverride {
  text?: string;
  fontFamily?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  imageSrc?: string;
  styles?: Record<string, string>;
  updatedAt?: Date;
}

export interface IPageContent extends Document {
  scope: string; // "global" or specific page name like "home", "about", etc.
  elements: Map<string, IElementOverride>; // Keyed by semantic elementId (e.g. "home.hero.title")
  updatedAt: Date;
}

const ElementOverrideSchema = new Schema(
  {
    text: { type: String },
    fontFamily: { type: String },
    color: { type: String },
    fontSize: { type: String },
    fontWeight: { type: String },
    imageSrc: { type: String },
    styles: { type: Map, of: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PageContentSchema = new Schema(
  {
    scope: { type: String, default: "global", unique: true, index: true },
    elements: {
      type: Map,
      of: ElementOverrideSchema,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.PageContent || mongoose.model<IPageContent>("PageContent", PageContentSchema);
```

##### Option 2: Expanded `Settings` Schema
Alternatively, expanding `src/models/Settings.ts`:
```typescript
// Inside SettingsSchema
visualOverrides: {
  type: Map,
  of: {
    text: String,
    fontFamily: String,
    color: String,
    imageSrc: String,
    styles: Object,
  },
  default: {}
}
```
**Evaluation**: Option 1 (`PageContent`) is vastly superior because:
1. `Settings` is currently fetched on almost every page for simple metadata (`whatsappNumber`, `profilePicture`). Keeping heavy visual overrides separate prevents dragging MBs of image base64s on every layout load.
2. Allows atomic updates without mutating general profile contact settings.

#### R4.2 API Route Specifications

##### 1. `GET /api/content`
- **Purpose**: Fetches dynamic visual overrides for public site and visual editor.
- **Access**: Public.
- **Query Params**:
  - `?scope=global` (default)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "elements": {
      "home.hero.headline": {
        "text": "MD LABIB",
        "fontFamily": "Space Grotesk",
        "color": "#ffffff"
      },
      "home.hero.image": {
        "imageSrc": "data:image/jpeg;base64,...",
        "updatedAt": "2026-10-09T13:30:00Z"
      }
    }
  }
  ```
- **Response `500 Internal Error`**:
  ```json
  {
    "success": false,
    "message": "Failed to retrieve page content overrides"
  }
  ```

##### 2. `POST /api/content`
- **Purpose**: Persist modified element overrides to MongoDB.
- **Access**: Restricted to authenticated admin (`admin_auth` cookie check).
- **Request Body**:
  ```json
  {
    "elements": {
      "home.hero.headline": {
        "text": "MD LABIB",
        "fontFamily": "Outfit",
        "color": "#22d3ee"
      },
      "about.header.title": {
        "text": "ABOUT MD. LABIB FOHAYER",
        "color": "#06b6d4"
      }
    }
  }
  ```
- **Upsert Logic**:
  - Merges into existing `elements` map in MongoDB using `$set: { "elements.<key>": <value> }` or bulk dictionary update.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Visual overrides saved successfully!",
    "updatedCount": 2
  }
  ```
- **Response `401 Unauthorized`**:
  ```json
  {
    "success": false,
    "message": "Admin authentication required"
  }
  ```

##### 3. `POST /api/content/reset`
- **Purpose**: Reset specific element or all elements back to default.
- **Access**: Authenticated admin.
- **Request Body**:
  ```json
  {
    "elementId": "home.hero.headline" // or "all"
  }
  ```

---

## 3. Element Addressing & Semantic Selector Strategy

To make visual overrides 100% resilient across React re-renders, layout modifications, and DOM diffing, elements MUST NOT use unstable CSS selector paths (e.g. `div:nth-child(3) > p`). Instead, we specify a **Hierarchical Semantic Key Scheme**:

Format: `<Page>.<Section>.<Component>.<Field>`

### Inventory of 7 Pages / Section Elements

| Element Key | Section / Page | Default Value / Asset | Type | Description |
|---|---|---|---|---|
| `home.hero.badge` | Home | `BUILDING AUTONOMOUS AI & MODERN SYSTEMS` | Text | Top glowing pill badge |
| `home.hero.greeting` | Home | `HELLO, I AM` | Text | Greeting tag |
| `home.hero.name_first` | Home | `MD LABIB` | Text | First line of main hero headline |
| `home.hero.name_last_1` | Home | `FOHAY` | Text | Second line prefix |
| `home.hero.name_last_2` | Home | `ER` | Text | Second line gradient suffix |
| `home.hero.tagline` | Home | `Built for Scale & Precision.` | Text | Serif italic subtitle |
| `home.hero.bio` | Home | `I architect autonomous AI agents and enterprise systems...` | Text | Main intro description |
| `home.hero.btn_primary` | Home | `VIEW MY WORK` | Text | Primary CTA button text |
| `home.hero.btn_secondary` | Home | `DOWNLOAD RESUME` | Text | Secondary CTA button text |
| `home.hero.image` | Home | `/profile-transparent.png` | Image | Hero 3D tilt portrait |
| `home.hero.signature` | Home | `Labib Fohayer` | Text | Floating signature script |
| `home.stats.velocity_val` | Home | `10X+` | Text | Metric 1 number |
| `home.stats.velocity_lbl` | Home | `EXECUTION VELOCITY` | Text | Metric 1 label |
| `home.stats.cost_val` | Home | `70%+` | Text | Metric 2 number |
| `home.stats.cost_lbl` | Home | `COST COMPRESSION` | Text | Metric 2 label |
| `home.stats.workflows_val` | Home | `24/7` | Text | Metric 3 number |
| `home.stats.workflows_lbl` | Home | `AUTONOMOUS WORKFLOWS` | Text | Metric 3 label |
| `home.stats.resilience_val` | Home | `100%` | Text | Metric 4 number |
| `home.stats.resilience_lbl` | Home | `PRODUCTION RESILIENCE` | Text | Metric 4 label |
| `about.header.badge` | About | `BIOGRAPHY & TARGET ARCHITECTURE` | Text | Section badge |
| `about.header.title_1` | About | `ABOUT MD. LABIB` | Text | Main section heading line 1 |
| `about.header.title_2` | About | `FOHAYER.` | Text | Main section heading line 2 |
| `about.header.subtitle` | About | `Driven by Passion & Resilience.` | Text | Serif italic tagline |
| `about.header.subdesc` | About | `Specialized in engineering robust automation pipelines...` | Text | Header description |
| `about.story.title` | About | `THE FOUNDER'S STORY` | Text | Bento main card title |
| `about.story.para_1` | About | `My journey into tech wasn't conventional...` | Text | Story paragraph 1 |
| `about.story.para_2` | About | `I didn't take the traditional route...` | Text | Story paragraph 2 |
| `about.story.para_3` | About | `I have engineered and deployed a wide range...` | Text | Story paragraph 3 |
| `about.story.role_title` | About | `FOUNDER & CEO @ WEBPULSE` | Text | Founder subcard title |
| `about.quote.title` | About | `"Turning ideas and resilience into high-impact digital solutions..."` | Text | Running border quote banner |
| `projects.header.badge` | Projects | `SELECTED WORK` | Text | Projects section badge |
| `projects.header.title` | Projects | `ARCHITECTING DIGITAL ECOSYSTEMS` | Text | Projects section heading |
| `projects.header.desc` | Projects | `A selection of modern web applications, management platforms...` | Text | Projects description |
| `skills.header.badge` | Skills | `RADIAL CAPABILITY CONSOLE` | Text | Skills section badge |
| `skills.header.title` | Skills | `TECHNOLOGIES I BUILD WITH` | Text | Skills main heading |
| `skills.header.subtitle` | Skills | `SCROLL CONSOLE // HOVER TO INTERACT` | Text | Skills subtitle |
| `experience.header.title` | Experience | `ARCHITECTED PROPRIETARY MULTI-AGENT SYNTHESIS ENGINE` | Text | Experience heading |
| `blog.header.badge` | Blog | `KNOWLEDGE BASE` | Text | Blog section badge |
| `blog.header.title` | Blog | `LATEST THOUGHTS.` | Text | Blog main heading |
| `blog.header.desc` | Blog | `Articles on tech, automation, and the journey of building startups.` | Text | Blog subtitle |
| `contact.header.title_1` | Contact | `LET'S WORK` | Text | Contact heading line 1 |
| `contact.header.title_2` | Contact | `TOGETHER.` | Text | Contact heading line 2 |
| `contact.header.desc` | Contact | `HAVE A PROJECT IN MIND OR WANT TO AUTOMATE YOUR BUSINESS?...` | Text | Contact subtext |
| `contact.badge.image` | Contact | `/blog/blog-2-inner-2.jpg` | Image | Contact holographic badge image |
| `contact.badge.name` | Contact | `LABIB FOHAYER` | Text | Contact holographic badge name |
| `contact.badge.status` | Contact | `Status: Available for Work` | Text | Contact availability indicator |

---

## 4. Public Site Dynamic Rendering Integration

### 4.1 Client-Side Content Provider (`PageContentContext`)
To render database overrides on the live public website with zero layout shift and graceful fallbacks:
```typescript
// src/context/PageContentContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ElementData {
  text?: string;
  fontFamily?: string;
  color?: string;
  imageSrc?: string;
  styles?: Record<string, string>;
}

interface PageContentContextType {
  elements: Record<string, ElementData>;
  isEditMode: boolean;
  selectedId: string | null;
  selectElement: (id: string, el: HTMLElement, type: "text" | "image") => void;
  updateElement: (id: string, data: Partial<ElementData>) => void;
}

export const PageContentContext = createContext<PageContentContextType>({
  elements: {},
  isEditMode: false,
  selectedId: null,
  selectElement: () => {},
  updateElement: () => {},
});
```

### 4.2 Reusable `<Editable>` Component
Components simply replace hardcoded strings/images with `<Editable>`:
```tsx
// Usage in Hero.tsx:
<Editable 
  id="home.hero.name_first" 
  defaultText="MD LABIB" 
  as="h1" 
  className="text-[12vw] xl:text-[6.5rem] text-white glitch-hover" 
/>

// Usage for Images:
<EditableImage 
  id="home.hero.image" 
  defaultSrc="/profile-transparent.png" 
  alt="Md. Labib Fohayer" 
  className="relative z-10 w-auto h-[90%] md:h-[95%] object-contain" 
/>
```

When `isEditMode === false` (Public visitor):
- Renders standard HTML tag with text/image from database overrides or fallback default.
- Applies overridden font family and color inline if present.
- 0ms interaction overhead; exactly standard DOM.

When `isEditMode === true` (Visual Editor active):
- Injects `data-editable-id`, hover dashed border, and click handler.
- On click, broadcasts selection to the Contextual Toolbar.

---

## 5. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|---|---|---|---|---|---|---|
| 1 | R1: Visual Editor | Multi-Page Section Switcher | Top navigation toolbar allowing admin to navigate between all 7 sections (Home, About, Projects, Skills, Experience, Blog, Contact) inside the visual builder. | Tab click or section anchor | Smooth scroll/jump in preview; active tab indicator | Fallback to top of page if target anchor missing | ORIGINAL_REQUEST.md & Navbar.tsx |
| 2 | R1: Visual Editor | Responsive Viewport Emulation | Toolbar toggle to preview and edit site in Desktop (1440px), Tablet (768px), or Mobile (390px) viewports. | Viewport toggle button | Resizes editor preview canvas with centered framing | Falls back to 100% fluid if invalid width | Wix/Canva UX best practices |
| 3 | R1: Visual Editor | Edit Mode Handshake | Query parameter or postMessage protocol (`?visual_builder=true`) activating editable outlines and click listeners on live site. | URL query param or iframe handshake | Editable overlays activated; interaction clicks intercepted | Remains in standard visitor view if unauthorized | Codebase inspection & Next.js App Router |
| 4 | R2: Inline Text | Contextual Canva Toolbar | Floating toolbar positioned above active text element providing real-time typography and color controls. | Element click event | Floating UI with text, font, color, and size pickers | Auto-flips below element if near top edge | ORIGINAL_REQUEST.md R2 |
| 5 | R2: Inline Text | Live Content Editing | Real-time text editing with instant DOM reflection as user types in toolbar or contentEditable node. | String keystrokes | Live updated text on preview canvas | Reverts on cancel / escape | ORIGINAL_REQUEST.md R2 |
| 6 | R2: Inline Style | Font Family Switcher | Dropdown selector allowing selection among loaded Google / custom fonts (Outfit, Space Grotesk, Inter, Montserrat, Playfair, etc.). | Font family selection | Applies inline `fontFamily` style to target element | Falls back to system sans-serif if font fails to load | globals.css & layout.tsx inspection |
| 7 | R2: Inline Style | Color Palette & Hex Picker | Color selector featuring curated neon portfolio swatches (Cyan, Pink, Green, Purple, White) plus native color picker. | Hex string or palette swatch | Applies inline `color` style to target element | Rejects invalid hex strings; reverts to previous color | globals.css theme variables |
| 8 | R3: Image Replace | Contextual Image Toolbar | Floating toolbar appearing on image click with image preview, dimensions, and upload button. | Image element click | Modal/floating toolbar with file picker trigger | Closes on backdrop click | ORIGINAL_REQUEST.md R3 |
| 9 | R3: Image Replace | Client-side Canvas Compression | Automatic downscaling (max dimension 800px–1200px) and JPEG conversion (0.75 quality) before saving. | File object from device | Compressed Base64 data URL string (< 250KB) | Rejects non-image MIME types; alerts user | settings/page.tsx & blogs/page.tsx pattern |
| 10 | R3: Image Replace | Instant Image Preview | Compressed image data URL immediately replaces image `src` in visual builder preview. | Compressed Base64 data URL | Immediate image swap on canvas | Reverts to original image if upload canceled | Acceptance Criteria |
| 11 | R4: Persistence | `PageContent` MongoDB Model | Dedicated Mongoose schema storing element overrides keyed by hierarchical semantic IDs. | Element override dictionary | MongoDB document persistence | Mongoose validation error on malformed keys | MongoDB & Settings.ts inspection |
| 12 | R4: Persistence | `/api/content` REST API | Secure Next.js API route handling `GET` (public fetch) and `POST` (admin save) for visual overrides. | JSON payload of modified elements | JSON `{ success: true, updatedCount }` | `401 Unauthorized` for non-admin; `500` on DB failure | API routes convention in src/app/api |
| 13 | R4: Persistence | Optimistic UI & Dirty Tracking | Editor tracks unsaved changes badge with "Save Changes" and "Discard" actions. | User modifications | Enables Save button; displays unsaved indicator | Warning prompt if admin attempts to navigate away with dirty state | Modern CMS UX standards |
| 14 | R4: Public Site | Dynamic Override Hydration | Public website fetches overrides on mount and dynamically applies text, font, color, and image overrides. | MongoDB overrides dictionary | Hydrated live DOM matching admin visual edits | Fallback to original hardcoded values if DB empty | ORIGINAL_REQUEST.md Acceptance Criteria |
| 15 | R4: Persistence | Revert to Factory Defaults | Admin ability to reset an individual element or entire section back to original design code defaults. | Reset button click | Removes key from MongoDB overrides; restores hardcoded JSX default | Confirms via prompt before executing | System resilience requirement |

---

## 6. Edge Cases & Handling Strategies

| # | Feature | Input / Scenario | Observed / Expected Behavior & Mitigation |
|---|---|---|---|
| 1 | Text Editing | Extremely long text inputted by admin (e.g. 500 characters in a 1-line badge). | May cause flex containers or grid cards to overflow or break styling. **Mitigation**: Add character length soft-warning in toolbar, apply `overflow-wrap: break-word` and `line-clamp` checks where appropriate. |
| 2 | Text Editing | HTML tags or special characters (`<script>`, `&nbsp;`, `""`, emoji). | Potential XSS injection if unescaped or broken JSX rendering. **Mitigation**: Treat text as plain text strings (`textContent` / React children string), never `dangerouslySetInnerHTML`. React handles sanitization automatically. |
| 3 | Style Editing | Contrast failure (e.g. black text on black background `#000000`). | Text becomes unreadable to visitors. **Mitigation**: Provide curated accessible palette presets with high contrast against the dark portfolio background; include instant "Reset Color" button. |
| 4 | Font Selection | Custom font chosen that isn't preloaded in `layout.tsx`. | Browser flashes fallback font or invisible text (FOIT). **Mitigation**: Restrict font dropdown to curated preloaded fonts (`Outfit`, `Space Grotesk`, `Great Vibes`, `Inter`, `Montserrat`) or dynamically append Google Font `<link>` when a new font family is selected. |
| 5 | Image Replacement | Uploading massive RAW camera photo (> 25 MB). | May freeze the browser main thread during Canvas read/draw. **Mitigation**: Check `file.size`; if > 15MB, show loading spinner while processing or refuse file with friendly error message ("Please upload images under 15MB"). |
| 6 | Image Replacement | Uploading non-standard formats (HEIC, TIFF, animated GIF, SVG). | Canvas `drawImage` may fail on iOS HEIC or flatten animated GIFs to static frame. **Mitigation**: Accept `image/jpeg,image/png,image/webp,image/svg+xml`. If SVG, bypass canvas compression and read as raw data URL/text to preserve vector fidelity. |
| 7 | Image Replacement | Replacing a transparent PNG portrait with an opaque JPEG with white background. | Hero image glow and dark background aesthetics look broken. **Mitigation**: For transparent images (like `/profile-transparent.png`), compress as PNG (`canvas.toDataURL("image/png")`) or WebP (`canvas.toDataURL("image/webp", 0.8)`) to preserve alpha transparency channel. |
| 8 | Multi-Page Navigation | Admin clicks a link inside preview that navigates away to external site (e.g. WhatsApp, GitHub, LinkedIn). | Visual editor frame navigates away from portfolio to external domain, breaking editor context. **Mitigation**: Intercept click events on `<a>` tags inside edit mode: if link is external, prevent default navigation and show toast notification ("External link navigation disabled in Edit Mode"). |
| 9 | Multi-Page Navigation | Anchor links within preview (`#about`, `#skills`). | Browser address bar might update to `#about`, causing iframe URL sync issues. **Mitigation**: Intercept `#hash` clicks to trigger smooth scrolling inside the preview canvas rather than full page reload. |
| 10 | Dynamic / Animated Elements | Editing elements inside Framer Motion animated components or Typewriter (`Hero.tsx`). | Typewriter continuously wipes and rewrites text, making direct text editing difficult. **Mitigation**: In edit mode, pause the Typewriter animation loop and render static editable role string, or expose typewriter roles array in toolbar. |
| 11 | Dynamic Projects & Blogs | Projects & Blogs are fetched dynamically from MongoDB `/api/projects` and `/api/blogs`. | Admin edits a project title in Visual Editor; if saved to `PageContent`, it could conflict with `Project` collection data. **Mitigation**: Clearly partition section header copy (`projects.header.title`) vs item entities (`Project` items). Section headers are visual builder editable; item entities link to their dedicated admin manager or support deep entity override. |
| 12 | State & Network | Admin makes multiple edits and closes tab before clicking "Save Changes". | Unsaved changes lost. **Mitigation**: Implement `window.onbeforeunload` confirmation prompt when `dirty === true`. Display persistent unsaved changes count in top bar. |
| 13 | Network Failure | Network disconnects or MongoDB times out while saving. | Save request fails; admin might assume changes are live. **Mitigation**: Catch error, display persistent error alert with "Retry Save" button, and keep unsaved changes in local state/`localStorage` draft so nothing is lost. |
| 14 | Security & Permissions | Unauthenticated user makes `POST /api/content` call. | Malicious modification of public portfolio site content. **Mitigation**: Verify `admin_auth` cookie on `POST /api/content` and return `401 Unauthorized` immediately if absent or invalid. |
| 15 | Hydration Mismatch | SSR HTML renders hardcoded default text, then client hydrates with MongoDB override. | React hydration error ("Text content did not match"). **Mitigation**: Use `useEffect` or `suppressHydrationWarning` on dynamic editable wrappers, or fetch initial overrides in server component `page.tsx` and pass as initial props to client provider. |

---

## 7. Recommended Implementation Blueprint

### Phase 1: Data Model & Backend API
1. Create `src/models/PageContent.ts` Mongoose schema with `scope: "global"` and `elements: Map<String, ElementOverride>`.
2. Create `src/app/api/content/route.ts`:
   - `GET`: Returns stored overrides map.
   - `POST`: Validates `admin_auth` cookie and upserts changes into MongoDB.
3. Test with seed data to ensure sub-millisecond query performance.

### Phase 2: Editable Component & State Context
1. Create `src/context/PageContentContext.tsx` providing `elements`, `isEditMode`, `selectedElement`, and mutation helpers.
2. Create `src/components/ui/Editable.tsx` and `src/components/ui/EditableImage.tsx`:
   - Wraps target elements.
   - Applies styles (`color`, `fontFamily`) and overrides.
   - Adds edit mode hover/click interactions.
3. Replace key strings and images across the 7 sections (`Hero`, `About`, `Projects`, `Skills`, `Experience`, `Blog`, `Contact`) with `<Editable>`.

### Phase 3: Visual Editor Workspace & Canva Toolbar
1. Create `src/app/admin/dashboard/editor/page.tsx`:
   - Top Bar: Page selector (`Home`, `About`, `Projects`, `Skills`, `Experience`, `Blog`, `Contact`), Viewport toggle (Desktop/Tablet/Mobile), Discard, Save Changes button with spinner/status badge.
   - Main Canvas: Embeds preview iframe or isolated viewport frame.
2. Create Contextual Toolbar (`src/components/editor/ContextualToolbar.tsx`):
   - Text editing mode: Text input, Font family selector, Color picker with swatches.
   - Image replacement mode: Thumbnail, Upload button, Automatic Canvas Compression routine with aspect ratio and transparency preservation.
3. Connect state synchronization between toolbar and preview canvas.

### Phase 4: Public Site Hydration & Verification
1. Verify public site fetches and renders all overrides without admin login.
2. Verify Admin Panel sidebar links to Visual Editor.
3. Validate all 15 edge cases (special characters, long text, large uploads, transparent images, external link handling).
