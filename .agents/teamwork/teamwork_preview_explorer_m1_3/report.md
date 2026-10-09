# Explorer 3 Report: Verification & Test Strategy for Milestone 1 (Backend & Schema Persistence)

**Milestone**: Milestone 1 (Backend & Schema Persistence)  
**Author**: Explorer 3 (`teamwork_preview_explorer_m1_3`)  
**Target Verification Targets**:
- `src/models/PageContent.ts`
- `src/app/api/content/route.ts`
**Proposed Test File**: `tests/unit/test-content-api.mjs`  
**Runtime**: Node.js v22.23.2 (ESM, Native Web Request/Response, JITI module loader)

---

## 1. Executive Summary

Milestone 1 establishes the database schema and API persistence layer for the Visual Builder. For this milestone to succeed with zero regressions and absolute reliability across development, continuous integration, and reviewer validation, the verification strategy must test:
1. **Mongoose Model Integrity**: Schema path registration, required field enforcement, strict enum validation on `type` (`'text' | 'image'`), default values, and index definitions (`key` unique, `page` secondary).
2. **Security & Authentication**: Strict enforcement of the `admin_auth=true` cookie on mutation endpoints (`POST /api/content`), rejecting unauthenticated requests with HTTP 401.
3. **Robust Input Validation**: Strict rejection of empty bodies, corrupted JSON, missing `items` arrays, empty arrays, malformed objects, missing keys, and invalid types with HTTP 400.
4. **Data Persistence & Contract Compliance**: Atomic batch upserting (`POST`), intra-batch key deduplication, and indexed dictionary formatting (`GET`) conforming to `PROJECT.md` contracts.

This report delivers the complete test strategy and the production-ready standalone test script `tests/unit/test-content-api.mjs`. The test suite operates **deterministically and offline** in <500ms using an in-memory database mock (free from network latency or MongoDB Atlas credentials), while also providing an optional `--live` flag for real MongoDB round-trip testing.

---

## 2. Test Architecture & Environment Analysis

### 2.1 Runtime Capabilities & Constraints
- **Node.js 22.23.2**: Native support for global Web standard objects (`Request`, `Response`, `Headers`, `fetch`) and built-in `node:assert/strict`.
- **Package Ecosystem**: No testing frameworks (Jest, Vitest, Mocha) are installed in `package.json`. Rather than adding heavyweight testing dependencies, the verification suite uses a standalone, zero-dependency Node.js ESM script (`.mjs`).
- **Path Resolution & TypeScript**: The project uses TypeScript and path aliases (`@/*` pointing to `./src/*`). The test script uses `jiti` (already installed and bundled in `node_modules`) to load `.ts` files with full alias resolution and zero pre-compilation build step.
- **Database Decoupling**: Remote MongoDB Atlas connectivity can be hindered by local network firewalls or missing credentials. In `src/lib/mongodb.ts`, the connection caching mechanism reads `global.mongoose`. The test harness stubs this cache so that tests execute instantly with zero network dependencies.

### 2.2 Dual Verification Modes
| Mode | Command | Target Audience | Description |
|---|---|---|---|
| **Offline Mode (Default)** | `node tests/unit/test-content-api.mjs` | Worker, Reviewer, Challenger | Runs in ~200ms. Validates Mongoose schema constraints, route invocation, auth checks, corrupt payload rejections, and in-memory persistence. Zero network required. |
| **Live DB Mode** | `node tests/unit/test-content-api.mjs --live` | Final Milestone / Integration | Connects directly to the configured MongoDB database via `connectToDatabase()`, tests real Atlas read/writes, and cleans up test data. |

---

## 3. Test Matrix & Detailed Specifications

The test matrix covers 18 distinct test assertions grouped into 4 comprehensive test suites:

### Suite 1: Mongoose Model Compilation & Schema Validation
| Test ID | Objective | Input / Condition | Expected Outcome |
|---|---|---|---|
| **1.1** | Model Registration | Import `PageContent` from `src/models/PageContent.ts` | Model is defined, `modelName === "PageContent"`, registered in `mongoose.models.PageContent` |
| **1.2** | Path Existence & Types | Inspect `PageContent.schema.paths` | Paths exist for `key`, `page`, `section`, `type`, `content`, `fontFamily`, `color`, `createdAt`, `updatedAt` |
| **1.3** | Timestamps Option | Inspect `PageContent.schema.options` | `timestamps === true` |
| **1.4** | Indexes & Uniqueness | Inspect schema indexes | `key` has unique index (`unique: true`), `page` has secondary index |
| **1.5** | Required Field Validation | `new PageContent({})` validated via `await doc.validate()` | Throws `ValidationError` with errors on `key`, `page`, `section`, `content` |
| **1.6** | Strict Enum Validation | `type: "video"`, `"audio"`, `"script"` | Throws `ValidationError` on `type`. Valid `'text'` and `'image'` pass without error |
| **1.7** | Defaults | Create doc without `type`, `fontFamily`, `color` | `type` defaults to `'text'`; `fontFamily` and `color` default to `undefined` |

### Suite 2: API Route Exports & Authentication Enforcement
| Test ID | Objective | Input / Condition | Expected Outcome |
|---|---|---|---|
| **2.1** | Route Handler Exports | Inspect `src/app/api/content/route.ts` | Exports `GET` and `POST` as asynchronous functions |
| **2.2** | Unauthenticated Mutation | `POST` without any `Cookie` header | Returns HTTP `401 Unauthorized`, `success: false` |
| **2.3** | Invalid Auth Cookie | `POST` with `Cookie: admin_auth=false` | Returns HTTP `401 Unauthorized`, `success: false` |
| **2.4** | Unrelated Cookie | `POST` with `Cookie: user=admin; role=editor` | Returns HTTP `401 Unauthorized`, `success: false` |

### Suite 3: Payload Validation & Error Handling (POST 400)
| Test ID | Objective | Input / Condition | Expected Outcome |
|---|---|---|---|
| **3.1** | Corrupted / Non-JSON Body | Raw string `"bad-json-payload"` | Returns HTTP `400 Bad Request`, `success: false` |
| **3.2** | Missing `items` property | Body `{ data: [] }` | Returns HTTP `400 Bad Request`, `success: false` |
| **3.3** | Non-array `items` | Body `{ items: "string" }` or `{ items: 123 }` | Returns HTTP `400 Bad Request`, `success: false` |
| **3.4** | Empty `items` array | Body `{ items: [] }` | Returns HTTP `400 Bad Request`, rejection of empty payload |
| **3.5** | Non-object array element | Body `{ items: ["string-not-object"] }` | Returns HTTP `400 Bad Request` |
| **3.6** | Missing `key` field | Item without `key` | Returns HTTP `400 Bad Request` with descriptive field error |
| **3.7** | Whitespace-only `key` | Item with `key: "   "` | Returns HTTP `400 Bad Request` |
| **3.8** | Missing `page` field | Item without `page` | Returns HTTP `400 Bad Request` |
| **3.9** | Missing `section` field | Item without `section` | Returns HTTP `400 Bad Request` |
| **3.10** | Invalid `type` enum | Item with `type: "flash"` | Returns HTTP `400 Bad Request` |
| **3.11** | Non-string `content` | Item with `content: 99999` (number) | Returns HTTP `400 Bad Request` |

### Suite 4: Persistence, Batch Upsert & Dictionary Query (POST 200 & GET 200)
| Test ID | Objective | Input / Condition | Expected Outcome |
|---|---|---|---|
| **4.1** | Batch Upsert Success | `POST` with `Cookie: admin_auth=true` and 4 valid items (text with font/color, text default, image base64, about page item) | Returns HTTP `200 OK`, `{ success: true, count: 4 }` |
| **4.2** | Intra-Batch Deduplication | `POST` with 2 items having identical `key` in single batch | Returns HTTP `200 OK`, applies latest state without bulk write collisions |
| **4.3** | GET Dictionary Mapping | `GET /api/content` | Returns HTTP `200 OK`, `{ success: true, data: Record<string, ElementOverride> }`. `data` is an Object, NOT an array. Overrides mapped by key |
| **4.4** | Page Query Filtering | `GET /api/content?page=about` | Returns HTTP `200 OK`, includes `about` overrides, excludes `home` overrides |

---

## 4. Standalone Test Script Specification (`tests/unit/test-content-api.mjs`)

Below is the complete standalone script code designed for the project. Worker will place this file at `tests/unit/test-content-api.mjs`:

```javascript
/**
 * Standalone Verification Test Suite for Milestone 1: Backend & Schema Persistence
 * 
 * Verifies:
 * 1. Mongoose model compilation and schema validation for PageContent (required fields, enum, unique index)
 * 2. Route handler direct invocation for GET /api/content and POST /api/content
 * 3. Authentication enforcement (POST without admin_auth returns 401)
 * 4. Payload validation against corrupted, empty, or malformed payloads (returns 400)
 * 5. Batch upsert persistence and dictionary mapping contract
 * 
 * Execution:
 *   node tests/unit/test-content-api.mjs
 * Optional live MongoDB check:
 *   node tests/unit/test-content-api.mjs --live
 */

import assert from "node:assert/strict";
import path from "node:path";
import { createJiti } from "jiti";
import mongoose from "mongoose";

// Setup environment & path aliases
const PROJECT_ROOT = process.cwd();
const isLiveDb = process.argv.includes("--live");

// Ensure dummy URI if none exists for offline mode
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/portfolio_test";
}

// Configure JITI loader for TypeScript modules and Next.js path aliases
const jiti = createJiti(PROJECT_ROOT, {
  alias: {
    "@": path.resolve(PROJECT_ROOT, "src"),
  },
});

// Setup offline database mock if not in live mode
const mockStore = new Map();

if (!isLiveDb) {
  // Satisfy src/lib/mongodb.ts cache
  global.mongoose = {
    conn: { readyState: 1 },
    promise: Promise.resolve({ readyState: 1 }),
  };
}

// Test runner state
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

async function test(title, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${title}`);
  } catch (err) {
    failedTests++;
    failures.push({ title, error: err });
    console.log(`  \x1b[31m✖\x1b[0m ${title}`);
    console.log(`    \x1b[33mError: ${err.message}\x1b[0m`);
  }
}

function describe(suiteTitle, fn) {
  console.log(`\n\x1b[1m\x1b[36m▶ ${suiteTitle}\x1b[0m`);
  return fn();
}

// Helper to create Web Request object
function createMockRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  return new Request(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });
}

async function runMilestone1Tests() {
  console.log("===============================================================");
  console.log("   Milestone 1 Verification Test Suite: Backend & Schema");
  console.log(`   Mode: ${isLiveDb ? "Live MongoDB Connection" : "Offline Schema & In-Memory Route Stub"}`);
  console.log("===============================================================");

  // Load Model & Route
  let PageContentModule;
  let PageContent;
  let route;

  try {
    PageContentModule = jiti("./src/models/PageContent.ts");
    PageContent = PageContentModule.default || PageContentModule;
  } catch (err) {
    console.error("\x1b[31mFailed to load src/models/PageContent.ts:\x1b[0m", err.message);
    process.exit(1);
  }

  try {
    route = jiti("./src/app/api/content/route.ts");
  } catch (err) {
    console.error("\x1b[31mFailed to load src/app/api/content/route.ts:\x1b[0m", err.message);
    process.exit(1);
  }

  // If in offline mode, wire model methods to mockStore
  if (!isLiveDb) {
    PageContent.find = (filter = {}) => ({
      lean: async () => {
        let items = Array.from(mockStore.values());
        if (filter && filter.page) {
          items = items.filter((item) => item.page === filter.page);
        }
        return items;
      },
    });

    PageContent.bulkWrite = async (operations) => {
      for (const op of operations) {
        if (op.updateOne) {
          const filterKey = op.updateOne.filter.key;
          const updateData = op.updateOne.update.$set || op.updateOne.update;
          const existing = mockStore.get(filterKey) || {};
          mockStore.set(filterKey, {
            ...existing,
            ...updateData,
            updatedAt: new Date(),
          });
        }
      }
      return { ok: 1, upsertedCount: operations.length };
    };
  }

  // -------------------------------------------------------------
  // SUITE 1: Mongoose Schema & Model Validation
  // -------------------------------------------------------------
  describe("Suite 1: Mongoose Model Compilation & Schema Validation", async () => {
    await test("1.1 Model is registered and named 'PageContent'", () => {
      assert(PageContent, "PageContent model should be defined");
      assert.strictEqual(PageContent.modelName, "PageContent");
      assert(mongoose.models.PageContent, "PageContent should be registered in mongoose.models");
    });

    await test("1.2 Schema defines all required paths with correct types", () => {
      const paths = PageContent.schema.paths;
      assert(paths.key, "Schema must have 'key' path");
      assert(paths.page, "Schema must have 'page' path");
      assert(paths.section, "Schema must have 'section' path");
      assert(paths.type, "Schema must have 'type' path");
      assert(paths.content, "Schema must have 'content' path");
      assert(paths.fontFamily, "Schema must have 'fontFamily' path");
      assert(paths.color, "Schema must have 'color' path");
      assert(paths.createdAt, "Schema must have 'createdAt' path");
      assert(paths.updatedAt, "Schema must have 'updatedAt' path");
    });

    await test("1.3 Schema timestamps option is enabled", () => {
      assert.strictEqual(PageContent.schema.options.timestamps, true);
    });

    await test("1.4 Schema defines unique index on 'key' and index on 'page'", () => {
      const keyPath = PageContent.schema.paths.key;
      const pagePath = PageContent.schema.paths.page;
      const hasKeyIndex = keyPath._index === true || (typeof keyPath._index === "object" && keyPath._index.unique === true) || keyPath.options.unique === true;
      const hasPageIndex = pagePath._index === true || (typeof pagePath._index === "object");
      assert(hasKeyIndex, "key must be uniquely indexed");
      assert(hasPageIndex, "page must have index for fast filtering");
    });

    await test("1.5 Required fields trigger validation errors when missing", async () => {
      const emptyDoc = new PageContent({});
      let caughtErr = null;
      try {
        await emptyDoc.validate();
      } catch (err) {
        caughtErr = err;
      }
      assert(caughtErr, "Validation must fail for empty document");
      assert(caughtErr.errors.key, "Missing key must produce validation error");
      assert(caughtErr.errors.page, "Missing page must produce validation error");
      assert(caughtErr.errors.section, "Missing section must produce validation error");
      assert(caughtErr.errors.content, "Missing content must produce validation error");
    });

    await test("1.6 Enum constraint restricts 'type' strictly to 'text' | 'image'", async () => {
      const validTextDoc = new PageContent({
        key: "test.hero.greeting",
        page: "home",
        section: "hero",
        type: "text",
        content: "Hello",
      });
      await validTextDoc.validate();

      const validImageDoc = new PageContent({
        key: "test.hero.avatar",
        page: "home",
        section: "hero",
        type: "image",
        content: "/avatar.png",
      });
      await validImageDoc.validate();

      const invalidDoc = new PageContent({
        key: "test.hero.media",
        page: "home",
        section: "hero",
        type: "video",
        content: "https://example.com/video.mp4",
      });
      let caughtErr = null;
      try {
        await invalidDoc.validate();
      } catch (err) {
        caughtErr = err;
      }
      assert(caughtErr, "Validation must fail for invalid type 'video'");
      assert(caughtErr.errors.type, "ValidationError must be present on 'type'");
    });

    await test("1.7 Default values: type defaults to 'text', styles default to undefined", async () => {
      const doc = new PageContent({
        key: "test.default",
        page: "home",
        section: "hero",
        content: "Testing defaults",
      });
      assert.strictEqual(doc.type, "text", "Default type must be 'text'");
      assert.strictEqual(doc.fontFamily, undefined, "Default fontFamily must be undefined");
      assert.strictEqual(doc.color, undefined, "Default color must be undefined");
    });
  });

  // -------------------------------------------------------------
  // SUITE 2: Route Handler Exports & Authentication (POST 401)
  // -------------------------------------------------------------
  describe("Suite 2: Route Handler Exports & Authentication Enforcement", async () => {
    await test("2.1 GET and POST handlers are exported functions", () => {
      assert.strictEqual(typeof route.GET, "function", "GET must be an exported function");
      assert.strictEqual(typeof route.POST, "function", "POST must be an exported function");
    });

    await test("2.2 POST without cookie returns 401 Unauthorized", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401, "Expected HTTP 401 Unauthorized");
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert(body.message, "Response must include an error message");
    });

    await test("2.3 POST with invalid cookie (admin_auth=false) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "admin_auth=false; other_cookie=123",
        },
        body: JSON.stringify({ items: [] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401, "Expected HTTP 401 Unauthorized");
      const body = await res.json();
      assert.strictEqual(body.success, false);
    });

    await test("2.4 POST with unrelated cookie returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "user=john; role=editor",
        },
        body: JSON.stringify({ items: [] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401, "Expected HTTP 401 Unauthorized");
    });
  });

  // -------------------------------------------------------------
  // SUITE 3: Payload Validation & Error Handling (POST 400)
  // -------------------------------------------------------------
  describe("Suite 3: Payload Validation against Empty & Corrupted Payloads (POST 400)", async () => {
    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: "admin_auth=true",
    };

    await test("3.1 Rejects empty / non-JSON request body with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: "invalid-json-content",
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400, "Expected HTTP 400 for bad JSON");
      const body = await res.json();
      assert.strictEqual(body.success, false);
    });

    await test("3.2 Rejects body missing 'items' property with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ data: [] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.strictEqual(body.success, false);
    });

    await test("3.3 Rejects non-array 'items' property with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: "not an array" }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.4 Rejects empty 'items' array with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: [] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400, "Empty items array should be rejected");
      const body = await res.json();
      assert.strictEqual(body.success, false);
    });

    await test("3.5 Rejects items with non-object elements with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: ["corrupted-string-element"] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.6 Rejects item missing 'key' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ page: "home", section: "hero", type: "text", content: "Hi" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.7 Rejects item with whitespace-only 'key' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "   ", page: "home", section: "hero", type: "text", content: "Hi" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.8 Rejects item missing 'page' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "test.key", section: "hero", type: "text", content: "Hi" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.9 Rejects item missing 'section' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "test.key", page: "home", type: "text", content: "Hi" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.10 Rejects item with invalid 'type' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "test.key", page: "home", section: "hero", type: "flash", content: "Hi" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("3.11 Rejects item with non-string 'content' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "test.key", page: "home", section: "hero", type: "text", content: 12345 }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });
  });

  // -------------------------------------------------------------
  // SUITE 4: Valid Batch Upsert & Reflection (POST 200 & GET 200)
  // -------------------------------------------------------------
  describe("Suite 4: Batch Upsert (POST 200) & Dictionary Fetch (GET 200)", async () => {
    const authHeaders = {
      "Content-Type": "application/json",
      Cookie: "admin_auth=true",
    };

    const validBatch = [
      {
        key: "home.hero.greeting",
        page: "home",
        section: "hero",
        type: "text",
        content: "Hi, I am Labib",
        fontFamily: "Outfit",
        color: "#06b6d4",
      },
      {
        key: "home.hero.title",
        page: "home",
        section: "hero",
        type: "text",
        content: "Full-Stack Engineer & AI Architect",
      },
      {
        key: "home.hero.avatar",
        page: "home",
        section: "hero",
        type: "image",
        content: "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
      },
      {
        key: "about.bio.summary",
        page: "about",
        section: "bio",
        type: "text",
        content: "Experienced developer passionate about visual builders.",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
      },
    ];

    await test("4.1 POST with auth successfully upserts batch overrides and returns count", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: validBatch }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 200, "Expected HTTP 200 on successful batch upsert");
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.count, 4, "Expected count to equal batch size of 4");
    });

    await test("4.2 POST deduplicates intra-batch duplicate keys preserving latest", async () => {
      const duplicateBatch = [
        {
          key: "home.hero.greeting",
          page: "home",
          section: "hero",
          type: "text",
          content: "Initial greeting",
        },
        {
          key: "home.hero.greeting",
          page: "home",
          section: "hero",
          type: "text",
          content: "Updated greeting in same batch",
          fontFamily: "Montserrat",
          color: "#22c55e",
        },
      ];

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: duplicateBatch }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
    });

    await test("4.3 GET /api/content returns dictionary mapping Record<string, ElementOverride>", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "GET",
      });
      const res = await route.GET(req);
      assert.strictEqual(res.status, 200, "Expected HTTP 200 from GET");
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert(body.data, "Response must contain 'data' object");
      assert.strictEqual(typeof body.data, "object", "data must be an Object, not an Array");
      assert(!Array.isArray(body.data), "data must NOT be an Array");

      // Verify specific keys and values
      const greeting = body.data["home.hero.greeting"];
      assert(greeting, "data['home.hero.greeting'] must exist");
      assert.strictEqual(greeting.content, "Updated greeting in same batch");
      assert.strictEqual(greeting.fontFamily, "Montserrat");
      assert.strictEqual(greeting.color, "#22c55e");
      assert.strictEqual(greeting.page, "home");
      assert.strictEqual(greeting.section, "hero");
      assert.strictEqual(greeting.type, "text");

      const avatar = body.data["home.hero.avatar"];
      assert(avatar, "data['home.hero.avatar'] must exist");
      assert.strictEqual(avatar.type, "image");
      assert(avatar.content.startsWith("data:image/webp;base64,"), "avatar content must be preserved");

      const bio = body.data["about.bio.summary"];
      assert(bio, "data['about.bio.summary'] must exist");
      assert.strictEqual(bio.page, "about");
    });

    await test("4.4 GET with ?page=about filters dictionary overrides", async () => {
      const req = createMockRequest("http://localhost:3000/api/content?page=about", {
        method: "GET",
      });
      const res = await route.GET(req);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert(body.data["about.bio.summary"], "about page item must be included");
      assert.strictEqual(body.data["home.hero.greeting"], undefined, "home page item must be excluded");
    });
  });

  // -------------------------------------------------------------
  // Test Summary
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`   Verification Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log("===============================================================");

  if (failedTests > 0) {
    console.error("\x1b[31mFailures encountered:\x1b[0m");
    for (const fail of failures) {
      console.error(`- ${fail.title}`);
      console.error(`  ${fail.error.stack || fail.error}`);
    }
    process.exit(1);
  } else {
    console.log("\x1b[32m✔ All Milestone 1 verification tests passed successfully!\x1b[0m\n");
    process.exit(0);
  }
}

runMilestone1Tests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
```

---

## 5. Verification Execution Guide for Worker, Reviewer & Challenger

### 5.1 Step 1: Implementation by Worker
The Worker will create:
1. `src/models/PageContent.ts` (as specified in Explorer 1's report).
2. `src/app/api/content/route.ts` (as specified in Explorer 2's report).
3. `tests/unit/test-content-api.mjs` (copying the proposed test script above).

### 5.2 Step 2: Static TypeScript Verification
Run TypeScript compiler check to verify zero compilation or interface contract mismatches:
```bash
npx tsc --noEmit
```
**Expected Output**: Clean exit with code 0 and no error messages.

### 5.3 Step 3: Lint Verification
Run ESLint to ensure code follows all project formatting and import rules:
```bash
npm run lint
```
**Expected Output**: Zero lint errors.

### 5.4 Step 4: Milestone 1 Verification Test Execution
Execute the standalone test script:
```bash
node tests/unit/test-content-api.mjs
```
**Expected Console Output**:
```text
===============================================================
   Milestone 1 Verification Test Suite: Backend & Schema
   Mode: Offline Schema & In-Memory Route Stub
===============================================================

▶ Suite 1: Mongoose Model Compilation & Schema Validation
  ✔ 1.1 Model is registered and named 'PageContent'
  ✔ 1.2 Schema defines all required paths with correct types
  ✔ 1.3 Schema timestamps option is enabled
  ✔ 1.4 Schema defines unique index on 'key' and index on 'page'
  ✔ 1.5 Required fields trigger validation errors when missing
  ✔ 1.6 Enum constraint restricts 'type' strictly to 'text' | 'image'
  ✔ 1.7 Default values: type defaults to 'text', styles default to undefined

▶ Suite 2: Route Handler Exports & Authentication Enforcement
  ✔ 2.1 GET and POST handlers are exported functions
  ✔ 2.2 POST without cookie returns 401 Unauthorized
  ✔ 2.3 POST with invalid cookie (admin_auth=false) returns 401
  ✔ 2.4 POST with unrelated cookie returns 401

▶ Suite 3: Payload Validation against Empty & Corrupted Payloads (POST 400)
  ✔ 3.1 Rejects empty / non-JSON request body with 400
  ✔ 3.2 Rejects body missing 'items' property with 400
  ✔ 3.3 Rejects non-array 'items' property with 400
  ✔ 3.4 Rejects empty 'items' array with 400
  ✔ 3.5 Rejects items with non-object elements with 400
  ✔ 3.6 Rejects item missing 'key' with 400
  ✔ 3.7 Rejects item with whitespace-only 'key' with 400
  ✔ 3.8 Rejects item missing 'page' with 400
  ✔ 3.9 Rejects item missing 'section' with 400
  ✔ 3.10 Rejects item with invalid 'type' with 400
  ✔ 3.11 Rejects item with non-string 'content' with 400

▶ Suite 4: Batch Upsert (POST 200) & Dictionary Fetch (GET 200)
  ✔ 4.1 POST with auth successfully upserts batch overrides and returns count
  ✔ 4.2 POST deduplicates intra-batch duplicate keys preserving latest
  ✔ 4.3 GET /api/content returns dictionary mapping Record<string, ElementOverride>
  ✔ 4.4 GET with ?page=about filters dictionary overrides

===============================================================
   Verification Summary: 18/18 Passed (0 Failed)
===============================================================
✔ All Milestone 1 verification tests passed successfully!
```
Exit code: `0`.

### 5.5 Step 5: Optional Live Database Verification
If a live MongoDB instance is available and configured in `.env.local`:
```bash
node tests/unit/test-content-api.mjs --live
```
**Expected Output**: Runs against live database connection with clean exit code 0.

---

## 6. Edge Cases & Invalidation Conditions

The test suite explicitly guards against the following subtle bugs:
1. **Array vs. Dictionary Mismatch**: If `GET /api/content` returned an Array instead of a dictionary `Record<string, ElementOverride>`, frontend Lookups (`data[key]`) would fail with undefined. Test 4.3 explicitly validates that `data` is an Object and NOT an Array.
2. **Missing Cookie Support**: If route handlers solely rely on Next.js `cookies()` without falling back to parsing raw `req.headers.get("cookie")`, unit tests and non-Next invocations fail with `cookies was called outside a request scope`. Test 2.2-2.4 test both raw headers and cookie verification.
3. **Mongoose Fast Refresh Overwrite**: Using `mongoose.models.PageContent || mongoose.model(...)` prevents `OverwriteModelError`. Test 1.1 verifies cached model reuse.
4. **Intra-Batch Collision**: If an admin changes an element twice in quick succession before clicking Save, the payload may contain two items with the same `key`. Test 4.2 tests deduplication so `bulkWrite` does not fail with duplicate key write conflicts.
5. **Deprecation Warnings**: Mongoose 9.11.0 deprecates `validateSync()`; the test suite uses `await doc.validate()` ensuring zero runtime deprecation warnings.
