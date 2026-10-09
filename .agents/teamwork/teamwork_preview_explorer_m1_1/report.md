# Explorer 1 Report: Mongoose Schema Design & TypeScript Persistence Contract

**Milestone**: Milestone 1 (Backend & Schema Persistence)  
**Author**: Explorer 1 (`teamwork_preview_explorer_m1_1`)  
**Target File**: `src/models/PageContent.ts`  
**Dependencies**: `src/lib/mongodb.ts`, `mongoose` (^9.11.0)

---

## 1. Executive Summary

Milestone 1 establishes the persistence foundation for the Visual Builder. The goal is to provide a robust Mongoose model (`src/models/PageContent.ts`) and corresponding TypeScript contracts that allow inline edits (text content, font family, color, image source) across 7 canonical sections of the portfolio to be saved to MongoDB and queried efficiently.

This investigation analyzes existing codebase patterns in `src/models/Settings.ts`, `src/models/Project.ts`, `src/models/Blog.ts`, and `src/models/Message.ts`, and defines the exact Mongoose schema, TypeScript types, validation rules, and bulk persistence patterns required for the Worker to implement.

---

## 2. Codebase Pattern Analysis

Inspection of existing models revealed consistent architectural patterns across the portfolio:

| Model | Schema Pattern | Timestamps | Export / Caching Pattern |
|---|---|---|---|
| `Settings.ts` | `new mongoose.Schema({ type: { type: String, default: "global", unique: true }, ... }, { timestamps: true })` | Yes | `mongoose.models.Settings \|\| mongoose.model("Settings", SettingsSchema)` |
| `Project.ts` | `new mongoose.Schema({ id: { type: String, required: true }, title: ..., ... }, { timestamps: true })` | Yes | `mongoose.models.Project \|\| mongoose.model("Project", ProjectSchema)` |
| `Blog.ts` | `new mongoose.Schema({ title: ..., slug: { type: String, required: true, unique: true }, ... }, { timestamps: true })` | Yes | `mongoose.models.Blog \|\| mongoose.model("Blog", BlogSchema)` |
| `Message.ts` | `new mongoose.Schema({ name: ..., email: ..., ... }, { timestamps: true })` | Yes | `mongoose.models.Message \|\| mongoose.model("Message", MessageSchema)` |

### Key Codebase Conventions:
1. **Model Cache Re-use**: In Next.js (especially App Router with Fast Refresh / HMR), models must check `mongoose.models[ModelName]` prior to `mongoose.model(ModelName, schema)` to prevent `OverwriteModelError`.
2. **Timestamps**: All models enable `{ timestamps: true }`, which automatically manages `createdAt` and `updatedAt` as `Date` types.
3. **Trim & Defaults**: String identifiers use trim and defaults to prevent whitespace issues in database queries.
4. **TypeScript Safety**: Models should export both the default Mongoose Model and clean TypeScript interfaces (`IPageContent`, `ElementOverride`) so API routes and frontend context can import them without circular dependencies.

---

## 3. Schema Design Specification for `PageContent.ts`

### 3.1 Field Specifications

| Field Name | Mongoose Type | Required | Unique / Index | Default | Description |
|---|---|---|---|---|---|
| `key` | `String` | **Yes** | `unique: true`, `index: true` | None | Canonical dot-notation element key (e.g., `'home.hero.greeting'`, `'home.hero.avatar'`). |
| `page` | `String` | **Yes** | `index: true` | None | Page identifier corresponding to the 7 sections (`'home'`, `'about'`, `'projects'`, `'skills'`, `'experience'`, `'blog'`, `'contact'`). |
| `section` | `String` | **Yes** | None | None | Logical section within the page (e.g., `'hero'`, `'bio'`, `'stats'`, `'cta'`). |
| `type` | `String` | **Yes** | None | `'text'` | Enum: strictly `'text'` or `'image'`. |
| `content` | `String` | **Yes** | None | None | The edited text string (for text) or image URL / base64 data string (for image). |
| `fontFamily` | `String` | No | None | `undefined` | Optional font family name (e.g., `'Outfit'`, `'Space Grotesk'`, `'Inter'`, `'Montserrat'`, `'Playfair'`, `'Great Vibes'`). |
| `color` | `String` | No | None | `undefined` | Optional CSS color string (e.g., `'#00f0ff'`, `'#ffffff'`). |
| `createdAt` | `Date` | Auto | None | Auto | Managed by `{ timestamps: true }`. |
| `updatedAt` | `Date` | Auto | None | Auto | Managed by `{ timestamps: true }`. Reflects the last save timestamp. |

### 3.2 Indexing Rationale
- **`key: 1` (Unique Index)**: Crucial for $O(1)$ point-lookups and fast upsert operations during batch saves (`bulkWrite` with `updateOne({ filter: { key }, ... })`).
- **`page: 1` (Secondary Index)**: Enables targeted queries if the visual editor or public page requests overrides filtered by a specific page (e.g., `PageContent.find({ page: "home" })`).

---

## 4. TypeScript Interface Definitions

To satisfy the contract in `PROJECT.md` (§ Interface Contracts) and support frontend and backend development:

```typescript
import mongoose, { Document, Model, Schema } from "mongoose";

/** Supported content types for editable visual elements */
export type PageContentType = "text" | "image";

/** Core data payload for a page content override */
export interface IPageContent {
  key: string;
  page: string;
  section: string;
  type: PageContentType;
  content: string;
  fontFamily?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Mongoose Document type extending IPageContent */
export interface IPageContentDocument extends IPageContent, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/** Client/API Data Transfer Object (DTO) matching PROJECT.md contract */
export interface ElementOverride {
  key: string;
  page: string;
  section: string;
  type: PageContentType;
  content: string;
  fontFamily?: string;
  color?: string;
  updatedAt?: Date | string;
}

/** Dictionary map for fast client lookup */
export type PageContentMap = Record<string, ElementOverride>;

/** API Response Contracts */
export interface ContentGetResponse {
  success: boolean;
  data: PageContentMap;
  message?: string;
}

export interface ContentBatchPostRequest {
  items: ElementOverride[];
}

export interface ContentPostResponse {
  success: boolean;
  count: number;
  message?: string;
}
```

---

## 5. Recommended Production Code for `src/models/PageContent.ts`

Here is the exact code recommended for the Worker:

```typescript
import mongoose, { Document, Model, Schema } from "mongoose";

export type PageContentType = "text" | "image";

export interface IPageContent {
  key: string;
  page: string;
  section: string;
  type: PageContentType;
  content: string;
  fontFamily?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPageContentDocument extends IPageContent, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ElementOverride {
  key: string;
  page: string;
  section: string;
  type: PageContentType;
  content: string;
  fontFamily?: string;
  color?: string;
  updatedAt?: Date | string;
}

const PageContentSchema = new Schema<IPageContentDocument>(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      index: true,
      trim: true,
    },
    page: {
      type: String,
      required: [true, "Page identifier is required"],
      index: true,
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section identifier is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: {
        values: ["text", "image"],
        message: "{VALUE} is not a valid content type",
      },
      default: "text",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    fontFamily: {
      type: String,
      default: undefined,
      trim: true,
    },
    color: {
      type: String,
      default: undefined,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Fallback pattern conforming to existing codebase models in Next.js HMR environment
const PageContent: Model<IPageContentDocument> =
  (mongoose.models.PageContent as Model<IPageContentDocument>) ||
  mongoose.model<IPageContentDocument>("PageContent", PageContentSchema);

export default PageContent;
```

---

## 6. Integration Guidance for `/api/content/route.ts`

### 6.1 GET Handler Pattern
The GET handler must return a key-value dictionary `Record<string, ElementOverride>`:
```typescript
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export async function GET() {
  try {
    await connectToDatabase();
    const records = await PageContent.find({}).lean();

    const data: Record<string, any> = {};
    for (const item of records) {
      data[item.key] = {
        key: item.key,
        page: item.page,
        section: item.section,
        type: item.type,
        content: item.content,
        fontFamily: item.fontFamily,
        color: item.color,
        updatedAt: item.updatedAt,
      };
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch content" },
      { status: 500 }
    );
  }
}
```

### 6.2 POST Handler Pattern (`bulkWrite` Upsert)
The Visual Editor sends batch updates when the user clicks "Save Changes":
```typescript
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication Check via admin_auth cookie
    const authCookie = req.cookies.get("admin_auth");
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    // 2. Validate Payload
    const body = await req.json();
    const items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid payload: 'items' array required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Batch Upsert via bulkWrite for atomic and high-performance persistence
    const bulkOps = items.map((item: any) => ({
      updateOne: {
        filter: { key: item.key },
        update: {
          $set: {
            key: item.key,
            page: item.page,
            section: item.section,
            type: item.type,
            content: item.content,
            fontFamily: item.fontFamily || undefined,
            color: item.color || undefined,
          },
        },
        upsert: true,
      },
    }));

    const result = await PageContent.bulkWrite(bulkOps);
    const count = (result.upsertedCount || 0) + (result.modifiedCount || 0);

    return NextResponse.json({ success: true, count, message: "Content overrides updated successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update content" },
      { status: 500 }
    );
  }
}
```

---

## 7. Edge Cases & Guardrails

1. **Next.js HMR Model Cache**: Always verify `mongoose.models.PageContent` before calling `mongoose.model()`. If omitted, Next.js hot reload causes runtime crashes.
2. **Missing Optional Fields**: In MongoDB, if `fontFamily` or `color` is not specified, storing `undefined` or omitting the field prevents cluttering the document with empty strings.
3. **Unique Key Index Collisions**: Since `key` is unique, upserting by `key` (`updateOne({ filter: { key }, ... }, { upsert: true })`) guarantees no duplicate entries.
4. **Enum Validation**: The `type` field must only be `'text'` or `'image'`. In case an invalid string is provided, Mongoose validator throws a validation error with HTTP 400 response.
5. **Cookie Parsing in Next.js 16**: Using `req.cookies.get("admin_auth")` directly from `NextRequest` avoids async cookie issues in App Router Route Handlers.

---

## 8. Worker Implementation Checklist

- [ ] Create `src/models/PageContent.ts` with the provided code.
- [ ] Export `PageContent`, `IPageContent`, `IPageContentDocument`, `ElementOverride`, `PageContentType`.
- [ ] Verify TypeScript compiles with no errors (`npx tsc --noEmit`).
- [ ] Ensure integration with `src/app/api/content/route.ts` imports types cleanly.
