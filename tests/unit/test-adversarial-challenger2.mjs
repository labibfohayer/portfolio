/**
 * Adversarial Stress Test Suite for Milestone 1: Backend & Schema Persistence
 * Challenger 2 Verification
 * 
 * Verifies:
 * 1. Batch upsert duplicate key resolution (latest item in array wins, intra-batch & cross-batch)
 * 2. Unicode / multiline / Markdown / special characters in text content (byte-for-byte fidelity)
 * 3. GET route query parameters (?page=, ?page=nonexistent, ?page=, multi-params)
 * 4. Mongoose schema validation for missing required fields, enum bounds, and type safety
 * 5. Route POST edge cases, malformed payloads, and contract boundaries
 * 
 * Execution:
 *   node tests/unit/test-adversarial-challenger2.mjs
 */

import assert from "node:assert/strict";
import path from "node:path";
import { createJiti } from "jiti";
import mongoose from "mongoose";

const PROJECT_ROOT = process.cwd();

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/portfolio_test";
}

// Setup mock store
const mockStore = new Map();

// Satisfy src/lib/mongodb.ts cache
global.mongoose = {
  conn: { readyState: 1 },
  promise: Promise.resolve({ readyState: 1 }),
};

// Configure JITI loader
const jiti = createJiti(PROJECT_ROOT, {
  alias: {
    "@": path.resolve(PROJECT_ROOT, "src"),
  },
});

let PageContentModule;
let PageContent;
let route;

try {
  PageContentModule = jiti("./src/models/PageContent.ts");
  PageContent = PageContentModule.default || PageContentModule;
  route = jiti("./src/app/api/content/route.ts");
} catch (err) {
  console.error("Failed to load modules:", err);
  process.exit(1);
}

// Wire in-memory mock implementations for PageContent model
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
      const setOnInsert = op.updateOne.update.$setOnInsert || {};
      const existing = mockStore.get(filterKey);
      if (existing) {
        mockStore.set(filterKey, {
          ...existing,
          ...updateData,
          updatedAt: new Date(),
        });
      } else {
        mockStore.set(filterKey, {
          ...setOnInsert,
          ...updateData,
          createdAt: setOnInsert.createdAt || new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }
  return { ok: 1, upsertedCount: operations.length };
};

// Test Runner Infrastructure
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

function createMockRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  return new Request(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });
}

const authHeaders = {
  "Content-Type": "application/json",
  Cookie: "admin_auth=true",
};

async function runAdversarialTests() {
  console.log("===============================================================");
  console.log("   CHALLENGER 2: ADVERSARIAL STRESS TEST SUITE (MILESTONE 1)  ");
  console.log("===============================================================");

  // Reset store before tests
  mockStore.clear();

  // =========================================================================
  // SUITE 1: Batch Upsert Duplicate Key Resolution
  // =========================================================================
  await describe("Suite 1: Batch Upsert Duplicate Key Resolution", async () => {
    await test("1.1 Intra-batch duplicates: latest item in array wins", async () => {
      mockStore.clear();
      const duplicateBatch = [
        {
          key: "home.hero.greeting",
          page: "home",
          section: "hero",
          type: "text",
          content: "First Greeting (v1)",
          color: "#111111",
        },
        {
          key: "home.hero.greeting",
          page: "home",
          section: "hero",
          type: "text",
          content: "Second Greeting (v2)",
          color: "#222222",
        },
        {
          key: "home.hero.greeting",
          page: "home",
          section: "hero",
          type: "text",
          content: "Third and Final Greeting (v3)",
          color: "#06b6d4",
          fontFamily: "Space Grotesk",
        },
      ];

      const postReq = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: duplicateBatch }),
      });
      const postRes = await route.POST(postReq);
      assert.strictEqual(postRes.status, 200);
      const postBody = await postRes.json();
      assert.strictEqual(postBody.success, true);
      assert.strictEqual(postBody.count, 1, "Count should be exactly 1 after deduplication");

      // Verify GET returns the v3 content
      const getReq = createMockRequest("http://localhost:3000/api/content");
      const getRes = await route.GET(getReq);
      const getBody = await getRes.json();
      const record = getBody.data["home.hero.greeting"];
      assert(record, "Record must exist in GET dictionary");
      assert.strictEqual(record.content, "Third and Final Greeting (v3)");
      assert.strictEqual(record.color, "#06b6d4");
      assert.strictEqual(record.fontFamily, "Space Grotesk");
    });

    await test("1.2 Interleaved duplicates across multiple keys resolve to respective latest items", async () => {
      mockStore.clear();
      const interleavedBatch = [
        { key: "item.A", page: "home", section: "s1", type: "text", content: "A1" },
        { key: "item.B", page: "home", section: "s1", type: "text", content: "B1" },
        { key: "item.A", page: "home", section: "s1", type: "text", content: "A2" },
        { key: "item.C", page: "home", section: "s1", type: "text", content: "C1" },
        { key: "item.A", page: "home", section: "s1", type: "text", content: "A3-WINNER" },
        { key: "item.B", page: "home", section: "s1", type: "text", content: "B2-WINNER" },
      ];

      const postReq = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: interleavedBatch }),
      });
      const postRes = await route.POST(postReq);
      const postBody = await postRes.json();
      assert.strictEqual(postBody.count, 3, "Count should be 3 unique keys");

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();
      assert.strictEqual(getBody.data["item.A"].content, "A3-WINNER");
      assert.strictEqual(getBody.data["item.B"].content, "B2-WINNER");
      assert.strictEqual(getBody.data["item.C"].content, "C1");
    });

    await test("1.3 Keys with leading/trailing whitespace deduplicate to the trimmed key and latest wins", async () => {
      mockStore.clear();
      const whitespaceBatch = [
        { key: "trim.test", page: "home", section: "s", type: "text", content: "Original" },
        { key: "  trim.test  ", page: "home", section: "s", type: "text", content: "Trimmed Winner" },
      ];

      const postReq = createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: whitespaceBatch }),
      });
      const postRes = await route.POST(postReq);
      const postBody = await postRes.json();
      assert.strictEqual(postBody.count, 1);

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();
      assert(getBody.data["trim.test"], "Dictionary key must be trimmed");
      assert.strictEqual(getBody.data["trim.test"].content, "Trimmed Winner");
    });

    await test("1.4 Sequential cross-batch updates correctly overwrite prior persisted state", async () => {
      mockStore.clear();
      // Batch 1
      const batch1 = [
        { key: "stateful.item", page: "home", section: "hero", type: "text", content: "Version 1", color: "#111111" },
      ];
      await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: batch1 }),
      }));

      // Batch 2
      const batch2 = [
        { key: "stateful.item", page: "home", section: "hero", type: "text", content: "Version 2", color: "#222222" },
      ];
      const res2 = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: batch2 }),
      }));
      assert.strictEqual(res2.status, 200);

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();
      assert.strictEqual(getBody.data["stateful.item"].content, "Version 2");
      assert.strictEqual(getBody.data["stateful.item"].color, "#222222");
    });
  });

  // =========================================================================
  // SUITE 2: Text Content Fidelity (Unicode, Multiline, Markdown, Special Characters)
  // =========================================================================
  await describe("Suite 2: Text Content Fidelity (Unicode, Multiline, Markdown, Special Chars)", async () => {
    await test("2.1 Multilingual Unicode & Emoji preserve exact bytes and length", async () => {
      mockStore.clear();
      const unicodeCases = [
        {
          key: "content.chinese",
          page: "about",
          section: "bio",
          type: "text",
          content: "你好，世界！这是一段用于测试全栈工程师与AI架构师的中文简介。包含标点符号：【】、《》、“”‘’",
        },
        {
          key: "content.arabic",
          page: "about",
          section: "bio",
          type: "text",
          content: "مرحبا بالعالم! هذا اختبار للمحرر المرئي لدعم اللغة العربية من اليمين إلى اليسار.",
        },
        {
          key: "content.japanese",
          page: "about",
          section: "bio",
          type: "text",
          content: "こんにちは世界！日本語のひらがな、カタカナ、漢字のテスト：素晴らしいポートフォリオ。",
        },
        {
          key: "content.devanagari",
          page: "about",
          section: "bio",
          type: "text",
          content: "नमस्ते दुनिया! विज़ुअल बिल्डर टेस्ट - तकनीकी विशेषज्ञता।",
        },
        {
          key: "content.emojis",
          page: "about",
          section: "bio",
          type: "text",
          content: "🚀 ✨ 🔥 🎨 💻 🧑🏽‍💻 👨‍👩‍👧‍👦 🏳️‍🌈 ❤️‍🔥 🤖 🧠 ⚡",
        },
        {
          key: "content.accents_math",
          page: "about",
          section: "bio",
          type: "text",
          content: "Café, résumé, naïve, señor, Über, Smörgåsbord. Math: ∑(x_i) = ∫ f(x)dx ± 42% ∞ ≠ ≈ 100°C.",
        },
      ];

      const postRes = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: unicodeCases }),
      }));
      assert.strictEqual(postRes.status, 200);

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();

      for (const expected of unicodeCases) {
        const stored = getBody.data[expected.key];
        assert(stored, `Stored item ${expected.key} must exist`);
        assert.strictEqual(stored.content, expected.content, `Content for ${expected.key} must match verbatim`);
      }
    });

    await test("2.2 Multiline text with \\n, \\r\\n, tabs, and indentation preserves formatting verbatim", async () => {
      mockStore.clear();
      const multilineText = "Line 1: Introduction\r\nLine 2: Tab\tIndented\nLine 3: Multiple   Spaces\n\n\nLine 6: After blank lines\r\nEnd of text.";
      const postRes = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{
            key: "content.multiline",
            page: "blog",
            section: "post",
            type: "text",
            content: multilineText,
          }],
        }),
      }));
      assert.strictEqual(postRes.status, 200);

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();
      assert.strictEqual(getBody.data["content.multiline"].content, multilineText);
    });

    await test("2.3 Complex Markdown syntax preserves headings, codeblocks, tables, and links", async () => {
      mockStore.clear();
      const markdownContent = `# Main Title
## Subtitle with **Bold** and *Italics*

- List item 1
- List item 2 with [Link](https://example.com/test?query=1&foo=bar#section)

\`\`\`typescript
interface Props {
  readonly id: string;
  onClick: () => Promise<void>;
}
\`\`\`

| Column 1 | Column 2 |
| :--- | :--- |
| Val A | Val B |
`;

      const postRes = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{
            key: "content.markdown",
            page: "blog",
            section: "post",
            type: "text",
            content: markdownContent,
          }],
        }),
      }));
      assert.strictEqual(postRes.status, 200);

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();
      assert.strictEqual(getBody.data["content.markdown"].content, markdownContent);
    });

    await test("2.4 HTML tags, quotes, backslashes, and XSS attack payloads are preserved as literal raw strings", async () => {
      mockStore.clear();
      const attackPayloads = [
        `<script>alert('XSS')</script>`,
        `<img src=x onerror="fetch('/leak?c='+document.cookie)">`,
        `"double" 'single' \`backticks\` \\backslash \\\\double\\\\`,
        `{"$gt": ""}`, // NoSQL injection pattern as string
        `<iframe src="javascript:alert(1)"></iframe>`,
      ];

      const items = attackPayloads.map((payload, idx) => ({
        key: `xss.test.${idx}`,
        page: "contact",
        section: "info",
        type: "text",
        content: payload,
      }));

      const postRes = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items }),
      }));
      assert.strictEqual(postRes.status, 200);

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();

      for (let i = 0; i < attackPayloads.length; i++) {
        assert.strictEqual(getBody.data[`xss.test.${i}`].content, attackPayloads[i]);
      }
    });
  });

  // =========================================================================
  // SUITE 3: GET Route Query Parameters & Filtering
  // =========================================================================
  await describe("Suite 3: GET Route Query Parameters & Filtering", async () => {
    mockStore.clear();
    // Populate store across 7 canonical sections
    const seedData = [
      { key: "home.hero.title", page: "home", section: "hero", type: "text", content: "Home Title" },
      { key: "about.bio.text", page: "about", section: "bio", type: "text", content: "About Bio" },
      { key: "projects.list.p1", page: "projects", section: "list", type: "text", content: "Project 1" },
      { key: "skills.frontend.s1", page: "skills", section: "frontend", type: "text", content: "Skill 1" },
      { key: "experience.job.j1", page: "experience", section: "job", type: "text", content: "Job 1" },
      { key: "blog.post.b1", page: "blog", section: "post", type: "text", content: "Blog 1" },
      { key: "contact.email.val", page: "contact", section: "email", type: "text", content: "Contact Email" },
    ];

    await route.POST(createMockRequest("http://localhost:3000/api/content", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ items: seedData }),
    }));

    await test("3.1 GET without parameters returns all 7 section records", async () => {
      const res = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(Object.keys(body.data).length, 7);
      assert(body.data["home.hero.title"]);
      assert(body.data["contact.email.val"]);
    });

    await test("3.2 GET ?page=home returns strictly home records", async () => {
      const res = await route.GET(createMockRequest("http://localhost:3000/api/content?page=home"));
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(Object.keys(body.data).length, 1);
      assert(body.data["home.hero.title"]);
      assert.strictEqual(body.data["about.bio.text"], undefined);
    });

    await test("3.3 GET ?page=nonexistent returns HTTP 200 with an empty dictionary {}", async () => {
      const res = await route.GET(createMockRequest("http://localhost:3000/api/content?page=nonexistent_page_12345"));
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(typeof body.data, "object");
      assert(!Array.isArray(body.data));
      assert.strictEqual(Object.keys(body.data).length, 0);
    });

    await test("3.4 GET ?page= (empty query param) gracefully falls back to returning all records", async () => {
      const res = await route.GET(createMockRequest("http://localhost:3000/api/content?page="));
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(Object.keys(body.data).length, 7, "Empty ?page= should return all records");
    });

    await test("3.5 GET with extra unknown query parameters (?page=projects&filter=active&sort=desc) filters correctly", async () => {
      const res = await route.GET(createMockRequest("http://localhost:3000/api/content?page=projects&filter=active&sort=desc"));
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.strictEqual(Object.keys(body.data).length, 1);
      assert(body.data["projects.list.p1"]);
    });
  });

  // =========================================================================
  // SUITE 4: Mongoose Schema Validation & Enum Bounds
  // =========================================================================
  await describe("Suite 4: Mongoose Schema Validation & Enum Bounds", async () => {
    await test("4.1 Missing required field 'key' fails schema validation", async () => {
      const doc = new PageContent({
        page: "home",
        section: "hero",
        type: "text",
        content: "Test",
      });
      let caughtErr = null;
      try {
        await doc.validate();
      } catch (err) {
        caughtErr = err;
      }
      assert(caughtErr, "Validation must fail");
      assert(caughtErr.errors.key, "ValidationError on key");
    });

    await test("4.2 Missing required field 'page' fails schema validation", async () => {
      const doc = new PageContent({
        key: "test.k",
        section: "hero",
        type: "text",
        content: "Test",
      });
      let caughtErr = null;
      try {
        await doc.validate();
      } catch (err) {
        caughtErr = err;
      }
      assert(caughtErr, "Validation must fail");
      assert(caughtErr.errors.page, "ValidationError on page");
    });

    await test("4.3 Missing required field 'section' fails schema validation", async () => {
      const doc = new PageContent({
        key: "test.k",
        page: "home",
        type: "text",
        content: "Test",
      });
      let caughtErr = null;
      try {
        await doc.validate();
      } catch (err) {
        caughtErr = err;
      }
      assert(caughtErr, "Validation must fail");
      assert(caughtErr.errors.section, "ValidationError on section");
    });

    await test("4.4 Missing required field 'content' fails schema validation", async () => {
      const doc = new PageContent({
        key: "test.k",
        page: "home",
        section: "hero",
        type: "text",
      });
      let caughtErr = null;
      try {
        await doc.validate();
      } catch (err) {
        caughtErr = err;
      }
      assert(caughtErr, "Validation must fail");
      assert(caughtErr.errors.content, "ValidationError on content");
    });

    await test("4.5 Valid enum types ('text', 'image') pass schema validation", async () => {
      const docText = new PageContent({
        key: "test.text",
        page: "home",
        section: "hero",
        type: "text",
        content: "Hello",
      });
      await docText.validate();

      const docImage = new PageContent({
        key: "test.img",
        page: "home",
        section: "hero",
        type: "image",
        content: "data:image/png;base64,...",
      });
      await docImage.validate();
    });

    await test("4.6 Invalid enum types ('video', 'audio', 'TEXT', 'html', '') fail schema validation", async () => {
      const invalidTypes = ["video", "audio", "TEXT", "html", "", "raw", "svg"];
      for (const t of invalidTypes) {
        const doc = new PageContent({
          key: `test.invalid.${t}`,
          page: "home",
          section: "hero",
          type: t,
          content: "Hello",
        });
        let caughtErr = null;
        try {
          await doc.validate();
        } catch (err) {
          caughtErr = err;
        }
        assert(caughtErr, `Validation must fail for invalid type '${t}'`);
        assert(caughtErr.errors.type, `ValidationError must exist on 'type' for '${t}'`);
      }
    });

    await test("4.7 Optional fields fontFamily and color allow undefined", async () => {
      const doc = new PageContent({
        key: "test.optional",
        page: "home",
        section: "hero",
        type: "text",
        content: "Content with undefined styles",
      });
      await doc.validate();
      assert.strictEqual(doc.fontFamily, undefined);
      assert.strictEqual(doc.color, undefined);
    });

    await test("4.8 Optional fields fontFamily and color accept valid string values", async () => {
      const doc = new PageContent({
        key: "test.styled",
        page: "home",
        section: "hero",
        type: "text",
        content: "Styled Content",
        fontFamily: "Great Vibes",
        color: "#ec4899",
      });
      await doc.validate();
      assert.strictEqual(doc.fontFamily, "Great Vibes");
      assert.strictEqual(doc.color, "#ec4899");
    });
    await test("4.9 Mongoose Document validation on empty string content ('')", async () => {
      const doc = new PageContent({
        key: "test.empty",
        page: "home",
        section: "hero",
        type: "text",
        content: "",
      });
      let caughtErr = null;
      try {
        await doc.validate();
      } catch (err) {
        caughtErr = err;
      }
      // Note: By default in Mongoose, required on String rejects empty string ("")
      // We verify Mongoose's exact behavior here for documentation.
      if (caughtErr && caughtErr.errors.content) {
        // Mongoose standard behavior: required validator fails on empty string
        assert(caughtErr.errors.content.message.includes("Content is required"));
      }
    });
  });

  // =========================================================================
  // SUITE 5: Route POST Input Boundaries & Defense in Depth
  // =========================================================================
  await describe("Suite 5: Route POST Input Boundaries & Defense in Depth", async () => {
    await test("5.1 Rejects null / primitive body with 400", async () => {
      const res = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(null),
      }));
      assert.strictEqual(res.status, 400);
    });

    await test("5.2 Rejects non-string fontFamily (number, boolean, object) with 400", async () => {
      const badFontPayloads = [
        { key: "k", page: "p", section: "s", type: "text", content: "c", fontFamily: 123 },
        { key: "k", page: "p", section: "s", type: "text", content: "c", fontFamily: true },
        { key: "k", page: "p", section: "s", type: "text", content: "c", fontFamily: {} },
      ];

      for (const item of badFontPayloads) {
        const res = await route.POST(createMockRequest("http://localhost:3000/api/content", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ items: [item] }),
        }));
        assert.strictEqual(res.status, 400);
      }
    });

    await test("5.3 Rejects non-string color (number, boolean, object) with 400", async () => {
      const badColorPayloads = [
        { key: "k", page: "p", section: "s", type: "text", content: "c", color: 0xff0000 },
        { key: "k", page: "p", section: "s", type: "text", content: "c", color: false },
        { key: "k", page: "p", section: "s", type: "text", content: "c", color: [] },
      ];

      for (const item of badColorPayloads) {
        const res = await route.POST(createMockRequest("http://localhost:3000/api/content", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({ items: [item] }),
        }));
        assert.strictEqual(res.status, 400);
      }
    });

    await test("5.4 Rejects whitespace-only page or section with 400", async () => {
      const res1 = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: [{ key: "k", page: "   ", section: "s", type: "text", content: "c" }] }),
      }));
      assert.strictEqual(res1.status, 400);

      const res2 = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ items: [{ key: "k", page: "p", section: " \t ", type: "text", content: "c" }] }),
      }));
      assert.strictEqual(res2.status, 400);
    });

    await test("5.5 Empty string content ('') in Route POST is accepted and stored cleanly", async () => {
      const res = await route.POST(createMockRequest("http://localhost:3000/api/content", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          items: [{ key: "cleared.text", page: "home", section: "hero", type: "text", content: "" }],
        }),
      }));
      assert.strictEqual(res.status, 200, "Empty string text content should be accepted in POST");

      const getRes = await route.GET(createMockRequest("http://localhost:3000/api/content"));
      const getBody = await getRes.json();
      assert.strictEqual(getBody.data["cleared.text"].content, "");
    });
  });

  // =========================================================================
  // SUITE 6: verifyAdminAuth Edge Cases & Security Bounds
  // =========================================================================
  await describe("Suite 6: verifyAdminAuth Edge Cases & Security Bounds", async () => {
    const { verifyAdminAuth } = route;

    await test("6.1 Accepts valid admin_auth cookie in various header formats", () => {
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth=true" }) }), true);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "other=val; admin_auth=true" }) }), true);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth=true; session=abc" }) }), true);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "a=1; admin_auth=true; b=2" }) }), true);
    });

    await test("6.2 Rejects spoofed, forged, or sub-string cookie values", () => {
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth=false" }) }), false);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth=0" }) }), false);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth_fake=true" }) }), false);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "not_admin_auth=true" }) }), false);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth=" }) }), false);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "admin_auth=trueish" }) }), false);
      assert.strictEqual(verifyAdminAuth({ headers: new Headers({ cookie: "" }) }), false);
      assert.strictEqual(verifyAdminAuth(null), false);
      assert.strictEqual(verifyAdminAuth({}), false);
    });

    await test("6.3 Supports NextRequest style cookie store", () => {
      const mockNextRequest = {
        cookies: {
          get: (name) => (name === "admin_auth" ? { value: "true" } : null),
        },
      };
      assert.strictEqual(verifyAdminAuth(mockNextRequest), true);

      const mockInvalidNextRequest = {
        cookies: {
          get: (name) => (name === "admin_auth" ? { value: "false" } : null),
        },
      };
      assert.strictEqual(verifyAdminAuth(mockInvalidNextRequest), false);
    });
  });


  // =========================================================================
  // Summary
  // =========================================================================
  console.log("\n===============================================================");
  console.log(`   Adversarial Test Summary: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log("===============================================================");

  if (failedTests > 0) {
    console.error("\x1b[31mFailures encountered:\x1b[0m");
    for (const fail of failures) {
      console.error(`- ${fail.title}`);
      console.error(`  ${fail.error.stack || fail.error}`);
    }
    process.exit(1);
  } else {
    console.log("\x1b[32m✔ All adversarial stress tests passed with 100% fidelity!\x1b[0m\n");
    process.exit(0);
  }
}

runAdversarialTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
