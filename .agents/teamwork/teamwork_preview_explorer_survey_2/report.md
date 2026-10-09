# Comprehensive Architectural Survey: Backend, Database, APIs & Data Flow

**Project:** Portfolio Visual Builder  
**Author:** Explorer 2 (Backend & Data Architecture)  
**Date:** 2026-10-09  
**Status:** Completed  
**Working Directory:** `C:\Users\assdi\.gemini\antigravity\scratch\portfolio\.agents\teamwork\teamwork_preview_explorer_survey_2`  

---

## 1. Executive Summary & Architecture Overview

The target application is a high-craft personal portfolio and agency website for **Md. Labib Fohayer** (Founder & CEO of Webpulse Automation), built on **Next.js 16.3.8 (App Router)**, **React 19.2.8**, **Tailwind CSS v4**, **Framer Motion 14**, and **Mongoose 9.11.0**.

The portfolio is primarily organized as an interactive single-page application with 7 core navigational sections (`#home`, `#about`, `#projects`, `#skills`, `#experience`, `#blog`, `#contact`), plus dynamic standalone blog post pages (`/blog/[slug]`) and a full admin suite (`/admin` and `/admin/dashboard/*`).

The system currently stores part of its content in MongoDB (projects, blogs, contact messages, and global settings such as social links, profile picture, and view counts), while substantial amounts of page copy, headings, and section copy remain hardcoded within client components. The objective of the Visual Builder is to enable the admin to edit text, fonts, colors, and images inline across these 7 pages/sections with instantaneous live preview and persistent storage in MongoDB.

---

## 2. Database Architecture & Connection Management

### 2.1 Configuration & Environment
- **Environment File:** `.env.local`
- **Variables Present:**
  - `MONGODB_URI`: Points to a hosted MongoDB Atlas cluster (`cluster0.rsujika.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0`).
  - `GEMINI_API_KEY`: Used for the AI assistant chatbot route (`/api/chat`).
- **Missing Auth Variables:** `ADMIN_USERNAME` and `ADMIN_PASSWORD` are not present in `.env.local`; the code falls back to hardcoded defaults in `src/app/api/auth/route.ts`.

### 2.2 Connection Lifecycle & Singleton Caching (`src/lib/mongodb.ts`)
The connection logic is centralized in `src/lib/mongodb.ts` (lines 1–34):
```typescript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
```

### 2.3 Evaluation of Connection Logic
1. **Pros:**
   - Follows Next.js recommended singleton caching via `(global as any).mongoose`.
   - Prevents connection exhaustion during Next.js Hot Module Replacement (HMR) in development and across serverless function warm starts.
   - Sets `bufferCommands: false` to fail fast if connection fails instead of hanging indefinitely.
2. **Considerations for Visual Builder:**
   - High reliability: The connection logic is sound and already utilized consistently across all Route Handlers (`/api/settings`, `/api/projects`, `/api/blogs`, etc.) and the Server Component (`/blog/[slug]/page.tsx`).
   - The new Visual Builder API routes can safely import and `await connectToDatabase()`.

---

## 3. Existing Models & Schemas Analysis

All schemas reside under `src/models/` and utilize the standard Next.js Mongoose model instantiation pattern: `mongoose.models.<ModelName> || mongoose.model("<ModelName>", <ModelSchema>)`.

### 3.1 `Settings` (`src/models/Settings.ts`)
```typescript
const SettingsSchema = new mongoose.Schema(
  {
    type: { type: String, default: "global", unique: true },
    resumeLink: { type: String, default: "#" },
    githubUrl: { type: String, default: "https://github.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
    facebookUrl: { type: String, default: "https://facebook.com" },
    behanceUrl: { type: String, default: "https://behance.net" },
    instagramUrl: { type: String, default: "https://instagram.com" },
    twitterUrl: { type: String, default: "https://x.com" },
    youtubeUrl: { type: String, default: "https://youtube.com" },
    tiktokUrl: { type: String, default: "https://tiktok.com" },
    profilePicture: { type: String, default: "/profile-ceo.jpg" },
    whatsappNumber: { type: String, default: "8801580506445" },
    emailAddress: { type: String, default: "hello@labib.com" },
    theme: { type: String, default: "cyan" },
    profileViews: { type: Number, default: 0 },
  },
  { timestamps: true }
);
```
- **Usage:** Stores global singleton configuration. `profilePicture` stores either a relative URL (`/profile-ceo.jpg`) or a base64 data URL string (`data:image/jpeg;base64,...`).

### 3.2 `Project` (`src/models/Project.ts`)
```typescript
const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    desc: { type: String, required: true },
    tech: [{ type: String }],
    image: { type: String },
    contributions: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
  },
  { timestamps: true }
);
```

### 3.3 `Blog` (`src/models/Blog.ts`)
```typescript
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    innerImages: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
```

### 3.4 `Message` (`src/models/Message.ts`)
```typescript
const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
```

### 3.5 Proposed Schema for Visual Builder (`PageContent` Model)
To fulfill Requirement **R4** ("All text, style, and image overrides made in the Visual Editor must be saved to the MongoDB backend"), we need a flexible, resilient model.

**Recommended Design:** `src/models/PageContent.ts`
```typescript
import mongoose from "mongoose";

export interface IElementOverride {
  content?: string;       // Text string or image source (base64 or URL)
  fontFamily?: string;    // e.g. "Space Grotesk", "Outfit", "Inter", "Great Vibes", "monospace"
  color?: string;         // e.g. "#06b6d4", "rgb(var(--theme-rgb))", "cyan", "#ffffff"
  type: "text" | "image"; // Discriminator
  updatedAt?: Date;
}

const PageContentSchema = new mongoose.Schema(
  {
    // Key uniquely identifies the editable element across the site
    // Examples: 'home.hero.title', 'home.hero.badge', 'home.about.founder_story', 'home.hero.avatar'
    key: { type: String, required: true, unique: true, index: true },
    
    // Page/section identifier: 'home', 'about', 'projects', 'skills', 'experience', 'blog', 'contact'
    page: { type: String, required: true, index: true, default: 'home' },
    
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    content: { type: String, default: '' },
    fontFamily: { type: String, default: '' },
    color: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.PageContent || mongoose.model("PageContent", PageContentSchema);
```

**Alternative Map-based Singleton Model (`PageContent` or inside `Settings`):**
If storing as a key-value document:
```typescript
const VisualOverrideDocSchema = new mongoose.Schema({
  scope: { type: String, default: "global", unique: true },
  elements: {
    type: Map,
    of: new mongoose.Schema({
      type: { type: String, enum: ['text', 'image'], default: 'text' },
      content: String,
      fontFamily: String,
      color: String,
    }, { _id: false })
  }
}, { timestamps: true });
```
*Recommendation:* A single document with an `elements` Map or an array/collection with `key` indexing allows fetching all overrides in a single lightweight GET request (`GET /api/content`), caching on the client, and updating via atomic `$set` operations (`POST /api/content`).

---

## 4. API Routes Inventory & Authentication Analysis

### 4.1 Route Handlers Inventory
| Endpoint | Method | File Path | Auth Protected? | Purpose |
|---|---|---|---|---|
| `/api/auth` | `POST` | `src/app/api/auth/route.ts` | Public | Validates admin credentials; sets `admin_auth` cookie |
| `/api/settings` | `GET` | `src/app/api/settings/route.ts` | Public | Fetches global settings (or creates default) |
| `/api/settings` | `POST` | `src/app/api/settings/route.ts` | **None** | Upserts global settings with `$set: req.body` |
| `/api/projects` | `GET` | `src/app/api/projects/route.ts` | Public | Returns all projects sorted by id |
| `/api/projects` | `POST` | `src/app/api/projects/route.ts` | **None** | Replaces all projects in DB |
| `/api/blogs` | `GET` | `src/app/api/blogs/route.ts` | Public | Fetches published blogs |
| `/api/blogs` | `POST` | `src/app/api/blogs/route.ts` | **None** | Creates a new blog post |
| `/api/blogs/[id]` | `PUT` | `src/app/api/blogs/[id]/route.ts` | **None** | Updates existing blog |
| `/api/blogs/[id]` | `DELETE` | `src/app/api/blogs/[id]/route.ts` | **None** | Deletes blog |
| `/api/messages` | `GET` | `src/app/api/messages/route.ts` | **None** | Fetches contact messages for admin inbox |
| `/api/messages` | `POST` | `src/app/api/messages/route.ts` | Public | Saves message & sends Web3Forms email notification |
| `/api/messages` | `PATCH`| `src/app/api/messages/route.ts` | **None** | Marks message as read |
| `/api/dashboard`| `GET` | `src/app/api/dashboard/route.ts`| **None** | Returns counts, metrics, and activity logs |
| `/api/track` | `POST` | `src/app/api/track/route.ts` | Public | Increments `profileViews` counter |
| `/api/chat` | `POST` | `src/app/api/chat/route.ts` | Public | Google Gemini AI assistant response |
| `/api/seed` | `GET` | `src/app/api/seed/route.ts` | **None** | Resets and seeds projects and blogs |

### 4.2 Authentication & Session Mechanism
In `src/app/api/auth/route.ts`:
- Checks username and password against:
  - `process.env.ADMIN_USERNAME || "Labib"`
  - `process.env.ADMIN_PASSWORD || "LabibSadiya"`
- On successful match, sets a cookie:
  ```typescript
  response.cookies.set({
    name: 'admin_auth',
    value: 'true',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  ```

### 4.3 Security Findings & Gaps
1. **Cookie Security:** The cookie `admin_auth` is set without `httpOnly: true` and without `secure: true`. It is readable by client JavaScript.
2. **Missing Route Protection:**
   - There is **no Next.js middleware** (`middleware.ts`) in the project.
   - The admin pages (`/admin/dashboard`, `/admin/dashboard/projects`, `/admin/dashboard/settings`, etc.) do **not** check the cookie and can be accessed directly.
   - The backend mutation API routes (`POST /api/settings`, `POST /api/projects`, `POST /api/blogs`, etc.) do not verify any token or cookie header.
3. **Recommendation for Visual Builder:**
   - Check `admin_auth === 'true'` (either from `cookies()` in server route handlers or headers) to guard editing privileges.
   - When in the Visual Editor, the client can check the `admin_auth` cookie or session state to enable editing mode.
   - On the API side (`POST /api/content` or `/api/page-content`), check the `admin_auth` cookie to reject unauthorized modification requests.

---

## 5. Media & Image Upload Handling Analysis

### 5.1 Current Media Handling Strategy
The project currently has **no third-party cloud storage integration** (no Cloudinary, no AWS S3, no Uploadthing, no GridFS).

Instead, media is handled in two ways:
1. **Static Local Assets:** Pre-placed in `public/` (`/profile-ceo.jpg`, `/profile-transparent.png`, `/projects/*.png`, `/blog/*.jpg`) and referenced by static path.
2. **Client-side Compressed Base64 in MongoDB:**
   In both `src/app/admin/dashboard/settings/page.tsx` (lines 110–144) and `src/app/admin/dashboard/blogs/page.tsx` (lines 117–152), image uploads follow this exact pipeline:
   - User selects file via `<input type="file" accept="image/*" />`.
   - `FileReader.readAsDataURL(file)` loads image as data URL into an offscreen HTML `Image` object.
   - Once loaded, it calculates aspect-ratio dimensions capped to `maxDim` (800px in Settings, 1200px in Blogs).
   - An offscreen `<canvas>` is sized to the scaled dimensions, and `ctx.drawImage(img, 0, 0, width, height)` renders the image.
   - The canvas produces a compressed JPEG: `canvas.toDataURL("image/jpeg", 0.7)`.
   - The resulting base64 string (`data:image/jpeg;base64,/9j/4AAQSkZJRg...`) is saved directly into MongoDB via JSON POST (`/api/settings` or `/api/blogs`).

### 5.2 Strengths & Suitability for Visual Builder (R3)
- **Zero External Dependencies:** Eliminates requirement for AWS S3 buckets, Cloudinary API secrets, or local disk write permissions (which fail in serverless environments like Vercel).
- **Automatic Compression Built-in:** Fulfills Requirement **R3** ("Images should be compressed automatically before saving"). A 1200px JPEG compressed at 70% quality typically weighs between 40 KB and 150 KB.
- **Instant Preview:** The base64 data URL is immediately available synchronously on the client, enabling instantaneous visual feedback in the builder before or while saving.
- **Zero Config for Next.js:** HTML `<img>` tags render base64 data URLs without needing `remotePatterns` in `next.config.ts`.
- **Recommendation:** Adopt this exact canvas compression workflow for the Visual Builder's inline image replacement toolbar.

---

## 6. Page Content Fetching & Component Data Flow

### 6.1 Component Architecture Overview
`src/app/page.tsx` is the root page component:
```typescript
export default function Home() {
  return (
    <main className="min-h-screen bg-[black] ...">
      <PageTracker />
      <CommandPalette />
      <FloatingMusic />
      <Chatbot />
      <SocialSidebar />
      <Navbar />
      <Hero />
      <TechMarquee />
      <About />
      <Projects />
      <Skills />
      <Services />
      <Experience />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}
```

### 6.2 Data Fetching per Section / Page
| Section / Component | Rendering Type | Current Data Fetching Pattern | Editable Content Status |
|---|---|---|---|
| **Navbar** | Client (`"use client"`) | `fetch('/api/settings')` in `useEffect` for `profilePicture` & `whatsappNumber` | Profile pic dynamic; brand name & links hardcoded |
| **Hero** (`#home`) | Client (`"use client"`) | `fetch('/api/settings')` in `useEffect` for `resumeLink` | All copy, headlines, counters, and `/profile-transparent.png` hardcoded |
| **About** (`#about`) | Client (`"use client"`) | None (100% static in JSX) | Biography, vision, targets, metrics, quote hardcoded |
| **Projects** (`#projects`) | Client (`"use client"`) | `fetch('/api/projects')` in `useEffect` | Projects fetched from DB; titles, descriptions, roles, images dynamic |
| **Skills** (`#skills`) | Client (`"use client"`) | None (100% static in JSX) | Skill pills, radar node categories hardcoded |
| **Services** (`#services`) | Client (`"use client"`) | None (100% static in JSX) | Service cards, titles, features, stats hardcoded |
| **Experience** (`#experience`)| Client (`"use client"`) | None (100% static in JSX) | Roles, timelines, bullet points hardcoded |
| **Blog** (`#blog`) | Client (`"use client"`) | `fetch('/api/blogs')` in `useEffect` (fallback to `defaultPosts`) | Fetched from DB if present; otherwise default hardcoded posts |
| **Blog Post** (`/blog/[slug]`)| Server Component | `await connectToDatabase()` & `Blog.findOne({ slug })` | Dynamic from DB (fallback to `blogContent` map) |
| **Contact** (`#contact`) | Client (`"use client"`) | `fetch('/api/settings')` in `useEffect` for WhatsApp & Email | Copy & labels hardcoded; contact info dynamic |
| **Footer** | Client (`"use client"`) | None (100% static in JSX) | Title, subtitle, barcode hardcoded |
| **SocialSidebar** | Client (`"use client"`) | `fetch('/api/settings')` in `useEffect` | Social links dynamic from DB |

### 6.3 Implications for Visual Builder (R4)
Because the site is assembled from React client components that mount on the single-page route, we can introduce a unified **Visual Builder Content Provider / Hook**:
1. **Unified Overrides Store:** A React Context or lightweight hook (`useContentOverrides` or `VisualContentContext`) that fetches all content overrides from `/api/content` on page load.
2. **Editable Wrappers / Direct Binding:**
   - A reusable component or helper (e.g. `<EditableText id="..." defaultContent="..." />` or `content("home.hero.title", "MD LABIB")` and `<EditableImage id="..." defaultSrc="..." />`).
   - If not in Editor mode (public visitor), it simply renders the override content (with override font family and text color if set), falling back to the default content.
   - If in Editor mode (Admin Visual Builder), clicking on the element intercepts the event and pops up the Canva-like contextual toolbar.

---

## 7. Concrete Visual Builder Architecture Design

### 7.1 Visual Editor Admin Page (R1)
- Create `src/app/admin/dashboard/builder/page.tsx` (and link it in the admin sidebar `navItems` in `src/app/admin/dashboard/layout.tsx` with a Pen/Palette icon).
- The Visual Editor renders the website either:
  - **Embedded Mode (iframe or direct render):** Direct render with an `isEditor={true}` context or in an iframe with postMessage communication.
  - Direct render within the editor page allows seamless toolbar layering, zero cross-origin/iframe quirks, and instant state synchronization.
- Navigation through the 7 pages/sections:
  - Provide a top navigation bar inside the editor allowing one-click jumping to:
    1. Home (`#home`)
    2. About (`#about`)
    3. Projects (`#projects`)
    4. Skills (`#skills`)
    5. Experience (`#experience`)
    6. Blog (`#blog`)
    7. Contact (`#contact`)

### 7.2 Inline Text & Style Editing Toolbar (R2)
- When any registered editable text element is clicked in builder mode:
  - Displays a floating/docked toolbar (Canva style).
  - Controls:
    1. **Text Content:** Inline contentEditable or toolbar input / textarea.
    2. **Font Family:** Dropdown supporting the site's fonts (`Space Grotesk`, `Outfit`, `Great Vibes`, `Inter`, `Cinzel`, `Courier New / Monospace`, `Sans-Serif`, `Serif`).
    3. **Text Color:** Color picker / preset swatches (`#06b6d4` cyan, `#34d399` green, `#f472b6` pink, `#ef4444` red, `#ffffff` white, `#a3a3a3` neutral, custom hex).
  - Changes update local state immediately so admin sees real-time updates.

### 7.3 Inline Image Replacement Toolbar (R3)
- When any registered editable image is clicked in builder mode:
  - Contextual toolbar provides an "Upload New Image" button.
  - Clicking opens native `<input type="file" accept="image/*" />`.
  - On file selection:
    1. Offscreen HTML canvas compresses the image to max 1200px width/height at 0.7 JPEG quality.
    2. Generates compressed base64 data URL.
    3. Instantly updates the preview image `src`.
    4. Sets dirty state for database persistence.

### 7.4 Persistence & API Layer (R4)
- **Model:** `src/models/PageContent.ts`
  - Stores `{ key: string, page: string, type: string, content: string, fontFamily?: string, color?: string }`.
- **API Endpoints:**
  - `GET /api/content`: Returns all overrides mapped by key `{ "home.hero.title": { content: "...", fontFamily: "...", color: "..." }, ... }`.
  - `POST /api/content`: Accepts array or map of overrides and upserts them into MongoDB using `bulkWrite` or `findOneAndUpdate`.
  - Checks `admin_auth` cookie for write permission.
- **Top Save / Publish Button in Visual Editor:**
  - Floating bar in the Visual Editor displays "Unsaved Changes" indicator and "SAVE CHANGES" button.
  - Clicking sends payload to `POST /api/content`, displaying a success toast.
  - Public site dynamically fetches `/api/content` on initial load and renders the overrides.

---

## 8. Summary of Findings & Next Steps

| Aspect | Current Status | Required Action for Visual Builder |
|---|---|---|
| **Database Connection** | Robust singleton caching in `src/lib/mongodb.ts` | Fully ready; reuse directly |
| **MongoDB Atlas** | Functional via `MONGODB_URI` in `.env.local` | Ready for new collection |
| **Schemas** | `Settings`, `Project`, `Blog`, `Message` exist | Create `PageContent.ts` model |
| **Auth** | Basic `admin_auth` cookie from `/api/auth` | Protect `POST /api/content` with cookie verification |
| **Media Handling** | Canvas compression to base64 data URLs in DB | Replicate canvas compression in Visual Builder toolbar |
| **Page Data Flow** | Mixed: some API fetches, mostly hardcoded in JSX | Introduce ContentProvider/hook with fallback to defaults |
| **Visual Editor Mode** | Does not exist | Create `/admin/dashboard/builder` with top navigation & toolbar |

All technical components and code patterns required to implement the visual builder are verified and present in the repository.
