# Project: Next.js Portfolio Visual Builder

## Architecture
- **Framework**: Next.js 16.3.8 (App Router), React 19.2.8, Tailwind CSS v4, Mongoose 9.11.0.
- **Public Site**: Single-page layout at `src/app/page.tsx` with 7 canonical sections (`#home`, `#about`, `#projects`, `#skills`, `#experience`, `#blog`, `#contact`), wrapped in `PageContentContext` to dynamically apply database overrides with fallback to hardcoded content.
- **Admin Visual Builder**: Accessible via `/admin/dashboard/builder` inside the Admin Panel. Features a top control bar (7-page navigation jump links, viewport switcher, Save Changes button), live preview canvas, and floating Canva-like contextual toolbars for inline text editing (content, font family, color) and inline image replacement (file upload with client-side canvas compression).
- **Backend & Storage**: MongoDB Atlas connection cached in `src/lib/mongodb.ts`. Dedicated `PageContent` Mongoose schema in `src/models/PageContent.ts` storing element overrides `{ key, page, section, type, content, fontFamily, color }`. Secure `/api/content` route supporting GET (fetch all overrides) and POST (upsert batch overrides, protected by `admin_auth` cookie).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | PageContent MongoDB Schema | Mongoose schema storing dynamic page content, text, fonts, colors, and image overrides | M1 | ORIGINAL_REQUEST §R4 |
| 2 | Content Overrides API Routes | `/api/content` GET (fetch overrides) and POST (upsert overrides guarded by admin_auth) | M1 | ORIGINAL_REQUEST §R4 |
| 3 | Dynamic PageContent Context & State | React context/provider delivering database overrides to frontend components | M2 | ORIGINAL_REQUEST §R4 |
| 4 | Public 7-Section Dynamic Rendering | Integrate `<EditableText>` and `<EditableImage>` across Home, About, Projects, Skills, Experience, Blog, Contact | M2 | ORIGINAL_REQUEST §R4 |
| 5 | Admin Visual Editor Page Route | `/admin/dashboard/builder` page inside Admin Panel rendering the live website | M3 | ORIGINAL_REQUEST §R1 |
| 6 | Admin Sidebar Navigation Link | Link to Visual Editor in `src/app/admin/dashboard/layout.tsx` | M3 | ORIGINAL_REQUEST §R1 |
| 7 | 7-Page Editor Navigation | Navigation header inside Visual Editor allowing navigation through the 7 sections | M3 | ORIGINAL_REQUEST §R1 |
| 8 | Responsive Viewport Toggle | Viewport width toggling (Desktop 1440px, Tablet 768px, Mobile 390px) in editor | M3 | survey |
| 9 | Inline Text Contextual Toolbar | Floating Canva-like toolbar appearing on click of editable text element | M4 | ORIGINAL_REQUEST §R2 |
| 10 | Inline Text Content Editing | Live input/contentEditable to change text content | M4 | ORIGINAL_REQUEST §R2 |
| 11 | Font Family Selector | Dropdown to switch font family (Outfit, Space Grotesk, Inter, Montserrat, Playfair, Great Vibes) | M4 | ORIGINAL_REQUEST §R2 |
| 12 | Text Color Picker | Color picker with palette swatches and hex input for text color | M4 | ORIGINAL_REQUEST §R2 |
| 13 | Inline Image Contextual Toolbar | Floating toolbar appearing on click of editable image | M4 | ORIGINAL_REQUEST §R3 |
| 14 | Automatic Image Compression | HTML5 Canvas compression routine (max dimension 1200px, 0.7 quality, <200KB base64) | M4 | ORIGINAL_REQUEST §R3 |
| 15 | Live Preview Instant Reflection | Instant state reflection of text, style, and image edits in the editor preview | M4 | ORIGINAL_REQUEST §AC |
| 16 | Save & Persistence Flow | "Save Changes" button persisting draft overrides to `/api/content` MongoDB backend | M4 | ORIGINAL_REQUEST §AC |
| 17 | Full E2E Test Suite Pass | 100% pass on all E2E tests (Tiers 1-4) produced by E2E Testing Track | M5 | ORIGINAL_REQUEST & Dual Track |
| 18 | Adversarial Coverage Hardening | White-box stress testing and adversarial edge-case hardening (Tier 5) | M5 | Dual Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend & Schema Persistence | PageContent Mongoose schema, `/api/content` GET and POST routes with auth checks and validation | none | PLANNED |
| M2 | Dynamic Content Provider & Public Site | PageContentContext, `<EditableText>` / `<EditableImage>` wrappers, refactor 7 sections on public site | M1 | PLANNED |
| M3 | Admin Visual Editor Interface & Nav | `/admin/dashboard/builder` route, admin sidebar link, topbar with 7-section navigation & viewport toggle | M2 | PLANNED |
| M4 | Inline Toolbars & Image Compression | Canva-style text toolbar (text, font, color), image replacement with canvas compression, preview & save flow | M3 | PLANNED |
| M5 | Final Milestone: E2E Verification & Hardening | Phase 1: 100% pass on E2E test suite (Tiers 1-4); Phase 2: Adversarial coverage hardening (Tier 5) | M4, TEST_READY.md | PLANNED |

## Interface Contracts
### Public Site / Components ↔ PageContentContext
- `usePageContent()` provides:
  - `content: Record<string, ElementOverride>`
  - `isEditorMode: boolean`
  - `updateDraft: (key: string, updates: Partial<ElementOverride>) => void`
  - `saveAllDrafts: () => Promise<boolean>`
- `ElementOverride`:
  - `{ key: string, page: string, section: string, type: 'text' | 'image', content: string, fontFamily?: string, color?: string }`
- Helper `<EditableText id="home.hero.greeting" defaultText="Hi, I'm Labib" defaultTag="span" />`
- Helper `<EditableImage id="home.hero.avatar" defaultSrc="/profile-transparent.png" alt="Profile" />`

### Visual Editor ↔ Backend API (`/api/content`)
- `GET /api/content`:
  - Response: `{ success: true, data: Record<string, ElementOverride> }`
- `POST /api/content`:
  - Headers: `Cookie: admin_auth=true`, `Content-Type: application/json`
  - Body: `{ items: ElementOverride[] }`
  - Response: `{ success: true, count: number }`

## Code Layout
- `src/models/PageContent.ts`: Mongoose schema for page content overrides
- `src/app/api/content/route.ts`: API endpoints for content overrides
- `src/context/PageContentContext.tsx`: React Context and hooks for content overrides
- `src/components/visual-builder/`: Reusable builder components:
  - `EditableText.tsx`: Inline editable text wrapper
  - `EditableImage.tsx`: Inline editable image wrapper
  - `TextToolbar.tsx`: Canva-style floating text toolbar (content, font, color)
  - `ImageToolbar.tsx`: Floating image toolbar with file picker & compression
  - `CanvasCompressor.ts`: Client-side image compression utility
- `src/app/admin/dashboard/builder/page.tsx`: Admin Visual Editor page
- `tests/e2e/`: Opaque-box E2E test suite created by E2E Testing Track
