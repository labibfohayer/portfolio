/**
 * Adversarial Stress & Security Verification Test Suite
 * Milestone 1: Backend & Schema Persistence
 *
 * Verifies:
 * 1. Cookie authentication bypass attempts & header spoofing
 * 2. Invalid, partial, and corrupted JSON payloads
 * 3. Attack and unusual keys (prototype pollution, MongoDB operators, special characters, unicode)
 * 4. High-volume batch payloads (100+ items, deduplication, large base64 contents)
 */

import assert from "node:assert/strict";
import path from "node:path";
import { createJiti } from "jiti";
import mongoose from "mongoose";

const PROJECT_ROOT = process.cwd();

// Ensure dummy URI if none exists for offline mode
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/portfolio_test";
}

const jiti = createJiti(PROJECT_ROOT, {
  alias: {
    "@": path.resolve(PROJECT_ROOT, "src"),
  },
});

// Setup mock store for offline route testing
const mockStore = new Map();
global.mongoose = {
  conn: { readyState: 1 },
  promise: Promise.resolve({ readyState: 1 }),
};

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
  console.log(`\n\x1b[1m\x1b[35m▶ ${suiteTitle}\x1b[0m`);
  return await fn();
}

function createMockRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  return new Request(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });
}

async function runAdversarialTests() {
  console.log("===============================================================");
  console.log("   Milestone 1 Adversarial Stress & Attack Verification");
  console.log("===============================================================");

  const PageContentModule = jiti("./src/models/PageContent.ts");
  const PageContent = PageContentModule.default || PageContentModule;
  const route = jiti("./src/app/api/content/route.ts");
  const { verifyAdminAuth } = route;

  // Mock DB operations on PageContent
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

  const authHeaders = {
    "Content-Type": "application/json",
    Cookie: "admin_auth=true",
  };

  // -------------------------------------------------------------
  // SUITE 1: Authentication Bypass Stress Testing
  // -------------------------------------------------------------
  await describe("Suite 1: Authentication Bypass & Spoofing Defense", async () => {
    await test("1.1 Empty Cookie header returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.2 Cookie with wrong value (admin_auth=false) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "admin_auth=false" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.3 Cookie with numeric value (admin_auth=1) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "admin_auth=1" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.4 Cookie with uppercase value (admin_auth=TRUE) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "admin_auth=TRUE" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.5 Cookie with prefix/suffix attack (admin_auth=true_admin) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "admin_auth=true_admin" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.6 Cookie with key suffix attack (fake_admin_auth=true) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: "fake_admin_auth=true" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.7 Spoofed header x-admin-auth: true (no cookie) returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-auth": "true" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.8 Spoofed Authorization Bearer header returns 401", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer true" },
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: "s", type: "text", content: "c" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 401);
    });

    await test("1.9 verifyAdminAuth handles null, undefined, or empty request safely", () => {
      assert.strictEqual(verifyAdminAuth(null), false);
      assert.strictEqual(verifyAdminAuth(undefined), false);
      assert.strictEqual(verifyAdminAuth({}), false);
    });

    await test("1.10 verifyAdminAuth handles NextRequest cookie store object properly", () => {
      const mockNextReqValid = {
        cookies: {
          get: (name) => (name === "admin_auth" ? { value: "true" } : null),
        },
      };
      assert.strictEqual(verifyAdminAuth(mockNextReqValid), true);

      const mockNextReqInvalid = {
        cookies: {
          get: (name) => (name === "admin_auth" ? { value: "false" } : null),
        },
      };
      assert.strictEqual(verifyAdminAuth(mockNextReqInvalid), false);

      const mockNextReqMissing = {
        cookies: {
          get: () => null,
        },
      };
      assert.strictEqual(verifyAdminAuth(mockNextReqMissing), false);
    });

    await test("1.11 Multi-cookie header with admin_auth embedded passes authentication", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "session_id=abcdef123456; theme=dark; admin_auth=true; analytics=enabled",
        },
        body: JSON.stringify({ items: [{ key: "auth.test", page: "home", section: "s", type: "text", content: "ok" }] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
    });
  });

  // -------------------------------------------------------------
  // SUITE 2: Invalid, Partial, and Corrupted JSON Structures
  // -------------------------------------------------------------
  await describe("Suite 2: Invalid, Partial, and Corrupted JSON Structures", async () => {
    await test("2.1 Malformed JSON syntax in body returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: `{"items": [{"key": "broken", "page": "home", "section": "hero", "type": "text", "content": "incomplete`,
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert(json.message.includes("JSON"));
    });

    await test("2.2 Primitive body (number) returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: "12345",
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("2.3 Primitive body (boolean) returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: "true",
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("2.4 Array at root instead of object with items returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify([{ key: "k", page: "p", section: "s", type: "text", content: "c" }]),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("2.5 items is null returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: null }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("2.6 items containing null element returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: [null] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert(json.message.includes("index 0"));
    });

    await test("2.7 items containing non-object element (number) returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: [42] }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
    });

    await test("2.8 Partial item missing 'page' returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "valid.key", section: "hero", type: "text", content: "text" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert(json.message.includes("page"));
    });

    await test("2.9 Partial item missing 'section' returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "valid.key", page: "home", type: "text", content: "text" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert(json.message.includes("section"));
    });

    await test("2.10 Partial item missing 'content' returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "valid.key", page: "home", section: "hero", type: "text" }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert(json.message.includes("content"));
    });

    await test("2.11 Item with non-string fontFamily returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "k", page: "p", section: "s", type: "text", content: "c", fontFamily: 123 }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert(json.message.includes("fontFamily"));
    });

    await test("2.12 Item with non-string color returns 400", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "k", page: "p", section: "s", type: "text", content: "c", color: { red: 255 } }],
        }),
      });
      const res = await route.POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert(json.message.includes("color"));
    });
  });

  // -------------------------------------------------------------
  // SUITE 3: Attack, Special, and Unusual Keys
  // -------------------------------------------------------------
  await describe("Suite 3: Attack, Special, and Unusual Keys Stress", async () => {
    await test("3.1 Prototype pollution key '__proto__' does not pollute Object.prototype", async () => {
      const initialProtoKeys = Object.keys(Object.prototype);

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: "__proto__",
              page: "attack",
              section: "pollution",
              type: "text",
              content: "malicious_override",
            },
          ],
        }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);

      // Verify Object.prototype has NOT been modified
      assert.strictEqual((Object.prototype).malicious_override, undefined);
      assert.strictEqual((Object.prototype).content, undefined);
      assert.deepStrictEqual(Object.keys(Object.prototype), initialProtoKeys);
      assert.strictEqual(({}).content, undefined);
    });

    await test("3.2 Prototype pollution key 'constructor' does not alter global constructor", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: "constructor",
              page: "attack",
              section: "pollution",
              type: "text",
              content: "override_constructor",
            },
          ],
        }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(typeof Object.prototype.constructor, "function");
      assert.strictEqual(({}).constructor, Object);
    });

    await test("3.3 MongoDB operator keys ('$set', '$where', '$gt') handled as literal string keys", async () => {
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: "$set",
              page: "home",
              section: "test",
              type: "text",
              content: "dollar set literal value",
            },
            {
              key: "$where",
              page: "home",
              section: "test",
              type: "text",
              content: "dollar where literal value",
            },
          ],
        }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, 2);

      // Verify persistence in mockStore
      assert(mockStore.has("$set"));
      assert.strictEqual(mockStore.get("$set").content, "dollar set literal value");
      assert(mockStore.has("$where"));
      assert.strictEqual(mockStore.get("$where").content, "dollar where literal value");
    });

    await test("3.4 Keys with dots, slashes, brackets, and special characters", async () => {
      const specialKeys = [
        "home.hero.title",
        "home/hero/banner",
        "home[0].hero[title]",
        "special!@#$%^&*()_+-=",
        "spaces in key here",
        "🚀.emoji.header.日本語",
      ];

      const batch = specialKeys.map((k) => ({
        key: k,
        page: "special",
        section: "symbols",
        type: "text",
        content: `content for ${k}`,
      }));

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: batch }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, specialKeys.length);

      // Verify all special keys are preserved
      for (const k of specialKeys) {
        assert(mockStore.has(k.trim()), `Key ${k} should be stored in database`);
      }
    });

    await test("3.5 Very long key string (2,000 characters) accepted and trimmed properly", async () => {
      const longKey = "long.key." + "a".repeat(1990);
      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: longKey,
              page: "stress",
              section: "large",
              type: "text",
              content: "long key content",
            },
          ],
        }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      assert(mockStore.has(longKey));
    });
  });

  // -------------------------------------------------------------
  // SUITE 4: High-Volume Batch Scaling & Deduplication (100+ items)
  // -------------------------------------------------------------
  await describe("Suite 4: Batch Upsert Scale (100+ items) & Stress Performance", async () => {
    await test("4.1 Batch upsert with 120 distinct items succeeds and reports count 120", async () => {
      const batch120 = [];
      for (let i = 0; i < 120; i++) {
        batch120.push({
          key: `scale.item.${i}`,
          page: i % 2 === 0 ? "home" : "projects",
          section: `sec_${i % 5}`,
          type: i % 10 === 0 ? "image" : "text",
          content: `Content for scale element ${i}`,
          fontFamily: i % 3 === 0 ? "Outfit" : undefined,
          color: i % 4 === 0 ? "#10b981" : undefined,
        });
      }

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: batch120 }),
      });

      const startTime = Date.now();
      const res = await route.POST(req);
      const elapsedMs = Date.now() - startTime;

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.count, 120);
      console.log(`    (Processed 120 batch items in ${elapsedMs}ms)`);
      assert(elapsedMs < 1000, `Batch upsert should complete quickly (< 1000ms), took ${elapsedMs}ms`);
    });

    await test("4.2 Intra-batch deduplication across 150 items with 50 duplicates collapses to 100 items", async () => {
      const duplicateBatch = [];
      // 100 unique keys
      for (let i = 0; i < 100; i++) {
        duplicateBatch.push({
          key: `dedup.item.${i}`,
          page: "about",
          section: "bio",
          type: "text",
          content: `Initial content ${i}`,
        });
      }
      // 50 duplicate updates for the first 50 keys with newer content
      for (let i = 0; i < 50; i++) {
        duplicateBatch.push({
          key: `dedup.item.${i}`,
          page: "about",
          section: "bio",
          type: "text",
          content: `UPDATED content ${i}`,
          color: "#ff0000",
        });
      }

      assert.strictEqual(duplicateBatch.length, 150);

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: duplicateBatch }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, 100, "Should deduplicate 150 items to 100 unique keys");

      // Verify that the UPDATED content (last-write-wins) was saved for key 0
      const storedItem0 = mockStore.get("dedup.item.0");
      assert.strictEqual(storedItem0.content, "UPDATED content 0");
      assert.strictEqual(storedItem0.color, "#ff0000");

      // Verify that untouched item 99 has initial content
      const storedItem99 = mockStore.get("dedup.item.99");
      assert.strictEqual(storedItem99.content, "Initial content 99");
    });

    await test("4.3 Large Base64 Image Content (500KB payload) is saved and retrieved safely", async () => {
      // Simulate ~500KB base64 image data
      const largeBase64 = "data:image/webp;base64," + "A".repeat(500 * 1024);

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [
            {
              key: "large.image.banner",
              page: "home",
              section: "hero",
              type: "image",
              content: largeBase64,
            },
          ],
        }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, 1);

      // Verify retrieval via GET
      const getReq = createMockRequest("http://localhost:3000/api/content?page=home");
      const getRes = await route.GET(getReq);
      assert.strictEqual(getRes.status, 200);
      const getJson = await getRes.json();
      assert(getJson.data["large.image.banner"], "Large image key should exist in GET response");
      assert.strictEqual(getJson.data["large.image.banner"].content.length, largeBase64.length);
    });

    await test("4.4 GET /api/content dictionary mapping handles 200+ stored items accurately", async () => {
      const getReq = createMockRequest("http://localhost:3000/api/content");
      const getRes = await route.GET(getReq);
      assert.strictEqual(getRes.status, 200);
      const getJson = await getRes.json();
      assert.strictEqual(getJson.success, true);
      assert(typeof getJson.data === "object");
      assert(!Array.isArray(getJson.data));

      const totalKeys = Object.keys(getJson.data).length;
      console.log(`    (Retrieved dictionary with ${totalKeys} keys)`);
      assert(totalKeys >= 200, `Expected at least 200 keys in stored map, found ${totalKeys}`);
    });
  });

  // -------------------------------------------------------------
  // SUITE 5: Deep Stress: 1,000 Items, XSS Content, & URL Edge Cases
  // -------------------------------------------------------------
  await describe("Suite 5: 1,000 Items Scale, XSS Content, & URL Edge Cases", async () => {
    await test("5.1 High volume: 1,000 items in a single batch upsert executes cleanly", async () => {
      const batch1000 = [];
      for (let i = 0; i < 1000; i++) {
        batch1000.push({
          key: `mega.item.${i}`,
          page: `page_${i % 10}`,
          section: `sec_${i % 20}`,
          type: "text",
          content: `Content ${i}`,
        });
      }

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: batch1000 }),
      });

      const startTime = Date.now();
      const res = await route.POST(req);
      const elapsedMs = Date.now() - startTime;

      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, 1000);
      console.log(`    (Processed 1,000 batch items in ${elapsedMs}ms)`);
      assert(elapsedMs < 2000, "1,000 items should be processed within 2 seconds");
    });

    await test("5.2 Preserves raw HTML/XSS payloads in content without crashing or unintended execution", async () => {
      const xssPayloads = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert(1)>",
        "javascript:void(0)",
        "'\"><svg/onload=alert('XSS')>",
        "Hello &amp; welcome to &#39;my&#39; site",
      ];

      const batch = xssPayloads.map((payload, idx) => ({
        key: `xss.test.${idx}`,
        page: "home",
        section: "hero",
        type: "text",
        content: payload,
      }));

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: batch }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, xssPayloads.length);

      // Verify intact storage
      for (let i = 0; i < xssPayloads.length; i++) {
        assert.strictEqual(mockStore.get(`xss.test.${i}`).content, xssPayloads[i]);
      }
    });

    await test("5.3 5 revisions of the same key in a batch: last-write-wins", async () => {
      const revisions = [
        { key: "single.key.revision", page: "home", section: "hero", type: "text", content: "Rev 1" },
        { key: "single.key.revision", page: "home", section: "hero", type: "text", content: "Rev 2" },
        { key: "single.key.revision", page: "home", section: "hero", type: "text", content: "Rev 3" },
        { key: "single.key.revision", page: "home", section: "hero", type: "text", content: "Rev 4" },
        { key: "single.key.revision", page: "home", section: "hero", type: "text", content: "Rev 5 - FINAL" },
      ];

      const req = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: revisions }),
      });

      const res = await route.POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.count, 1);
      assert.strictEqual(mockStore.get("single.key.revision").content, "Rev 5 - FINAL");
    });

    await test("5.4 GET handles malformed or empty URLs gracefully", async () => {
      const reqEmpty = new Request("http://localhost:3000/api/content");
      const res = await route.GET(reqEmpty);
      assert.strictEqual(res.status, 200);

      // Request with no url property (edge case object)
      const resNoUrl = await route.GET({});
      assert.strictEqual(resNoUrl.status, 200);
    });
  });

  // -------------------------------------------------------------
  // Test Summary
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  console.log(`   Adversarial Test Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log("===============================================================");

  if (failedTests > 0) {
    console.error("\x1b[31mAdversarial Failures encountered:\x1b[0m");
    for (const fail of failures) {
      console.error(`- ${fail.title}`);
      console.error(`  ${fail.error.stack || fail.error}`);
    }
    process.exit(1);
  } else {
    console.log("\x1b[32m✔ All adversarial stress and security tests passed successfully!\x1b[0m\n");
    process.exit(0);
  }
}

runAdversarialTests().catch((err) => {
  console.error("Fatal adversarial test runner error:", err);
  process.exit(1);
});
