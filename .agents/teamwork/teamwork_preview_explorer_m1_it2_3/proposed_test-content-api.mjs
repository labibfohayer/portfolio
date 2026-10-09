/**
 * Standalone Verification Test Suite for Milestone 1: Backend & Schema Persistence
 * (Proposed Revision for Milestone 1 Iteration 2)
 * 
 * Verifies:
 * 1. Mongoose model compilation and schema validation for PageContent (required fields, enum, unique index, empty string content)
 * 2. Route handler direct invocation for GET /api/content and POST /api/content
 * 3. Authentication enforcement (POST without admin_auth returns 401)
 * 4. Payload validation against corrupted or malformed payloads (returns 400), empty array acceptance (returns 200 count 0)
 * 5. Batch upsert persistence, dictionary mapping contract, empty string content (''), and null styling resets
 * 
 * Execution:
 *   node tests/unit/test-content-api.mjs
 * Optional live MongoDB check:
 *   node tests/unit/test-content-api.mjs --live
 */

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

async function describe(suiteTitle, fn) {
  console.log(`\n\x1b[1m\x1b[36m▶ ${suiteTitle}\x1b[0m`);
  return await fn();
}

// Helper to create Request object
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
  await describe("Suite 1: Mongoose Model Compilation & Schema Validation", async () => {
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

    await test("1.8 Schema allows empty string content ('') for clearing text elements (T2.6)", async () => {
      const doc = new PageContent({
        key: "test.empty.text",
        page: "home",
        section: "hero",
        type: "text",
        content: "",
      });
      await doc.validate();
      assert.strictEqual(doc.content, "", "Empty string content should be valid");
    });
  });

  // -------------------------------------------------------------
  // SUITE 2: Route Handler Exports & Authentication (POST 401)
  // -------------------------------------------------------------
  await describe("Suite 2: Route Handler Exports & Authentication Enforcement", async () => {
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
  // SUITE 3: Payload Validation & Contract Boundaries
  // -------------------------------------------------------------
  await describe("Suite 3: Payload Validation against Malformed Payloads & Boundary Handling", async () => {
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

    await test("3.4 Accepts empty 'items' array with 200 and count: 0 (T2.20 contract)", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: [] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 200, "Empty items array should return HTTP 200 per T2.20");
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.count, 0);
      assert.strictEqual(body.message, "No items to update");
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

    await test("3.12 Rejects item with non-string, non-null 'fontFamily' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "test.key", page: "home", section: "hero", type: "text", content: "Hi", fontFamily: 12345 }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert(body.message.includes("fontFamily"));
    });

    await test("3.13 Rejects item with non-string, non-null 'color' with 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "test.key", page: "home", section: "hero", type: "text", content: "Hi", color: false }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert(body.message.includes("color"));
    });
  });

  // -------------------------------------------------------------
  // SUITE 4: Valid Batch Upsert & Reflection (POST 200 & GET 200)
  // -------------------------------------------------------------
  await describe("Suite 4: Batch Upsert (POST 200) & Dictionary Fetch (GET 200)", async () => {
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

    await test("4.5 POST accepts empty string content ('') and persists cleanly (T2.6)", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: "home.hero.cleared",
              page: "home",
              section: "hero",
              type: "text",
              content: "",
            },
          ],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 200, "Empty string text content should be accepted in POST");
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.count, 1);

      // Verify retrieval via GET
      const getReq = createMockRequest("http://localhost:3000/api/content?page=home");
      const getRes = await route.GET(getReq);
      const getBody = await getRes.json();
      assert(getBody.data["home.hero.cleared"], "Cleared item must exist in GET response");
      assert.strictEqual(getBody.data["home.hero.cleared"].content, "");
    });

    await test("4.6 POST accepts null fontFamily and color to reset styling overrides (normalizes to undefined)", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: "home.hero.resetstyle",
              page: "home",
              section: "hero",
              type: "text",
              content: "Text with reset styles",
              fontFamily: null,
              color: null,
            },
          ],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 200, "Expected HTTP 200 when fontFamily/color are null");
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.count, 1);

      // Verify retrieval via GET: fontFamily and color must be undefined (omitted)
      const getReq = createMockRequest("http://localhost:3000/api/content?page=home");
      const getRes = await route.GET(getReq);
      const getBody = await getRes.json();
      const item = getBody.data["home.hero.resetstyle"];
      assert(item, "Reset style item must exist in GET response");
      assert.strictEqual(item.content, "Text with reset styles");
      assert.strictEqual(item.fontFamily, undefined, "fontFamily must be normalized to undefined");
      assert.strictEqual(item.color, undefined, "color must be normalized to undefined");
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
