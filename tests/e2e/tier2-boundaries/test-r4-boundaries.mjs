/**
 * Tier 2 — Boundary & Corner Cases: R4 Database Persistence & API Robustness
 * Requirements: ORIGINAL_REQUEST §R4, PROJECT.md Features 1, 2
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse, assertStatus } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";

export function registerTier2R4Tests() {
  describe("Tier 2: R4 Database Persistence & API Robustness Boundaries", (suite) => {
    let repo;
    let api;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
    });

    suite.test("T2.17: POST /api/content without admin_auth cookie returns HTTP 401 Unauthorized", async () => {
      const req = new Request("http://localhost/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            { key: "home.hero.greeting", page: "home", section: "home", type: "text", content: "Unauthorized Text" },
          ],
        }),
      });

      const res = await api.handlePost(req);
      assertStatus(res, 401);
      const json = await res.json();
      assertFalse(json.success);
      assertTrue(json.message.includes("Unauthorized"));
    });

    suite.test("T2.18: POST /api/content with invalid or forged cookie returns HTTP 401 Unauthorized", async () => {
      const req = new Request("http://localhost/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "admin_auth=false; other_token=12345",
        },
        body: JSON.stringify({
          items: [
            { key: "home.hero.greeting", page: "home", section: "home", type: "text", content: "Forged Text" },
          ],
        }),
      });

      const res = await api.handlePost(req);
      assertStatus(res, 401);
    });

    suite.test("T2.19: POST /api/content with malformed non-JSON body returns HTTP 400 Bad Request", async () => {
      const req = new Request("http://localhost/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "admin_auth=true",
        },
        body: "{ broken_json: true, missing_close_brace: ",
      });

      const res = await api.handlePost(req);
      assertStatus(res, 400);
      const json = await res.json();
      assertFalse(json.success);
      assertTrue(json.message.includes("Invalid JSON"));
    });

    suite.test("T2.20: POST /api/content with empty items array returns HTTP 200 with count 0", async () => {
      const req = new Request("http://localhost/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "admin_auth=true",
        },
        body: JSON.stringify({ items: [] }),
      });

      const res = await api.handlePost(req);
      assertStatus(res, 200);
      const json = await res.json();
      assertTrue(json.success);
      assertEqual(json.count, 0);
    });

    suite.test("T2.21: POST /api/content with invalid schema fields returns HTTP 400 with descriptive error", async () => {
      const invalidPayloads = [
        // Missing key
        { page: "home", section: "home", type: "text", content: "Missing key" },
        // Invalid type
        { key: "item.1", page: "home", section: "home", type: "video_embed", content: "Invalid type" },
        // Non-string content
        { key: "item.2", page: "home", section: "home", type: "text", content: 12345 },
      ];

      for (const invalidItem of invalidPayloads) {
        const req = new Request("http://localhost/api/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            cookie: "admin_auth=true",
          },
          body: JSON.stringify({ items: [invalidItem] }),
        });

        const res = await api.handlePost(req);
        assertStatus(res, 400, `Item should fail validation: ${JSON.stringify(invalidItem)}`);
        const json = await res.json();
        assertFalse(json.success);
      }
    });

    suite.test("T2.22: Concurrent batch upserts to /api/content resolve atomically without corruption", async () => {
      const batchA = [
        { key: "home.hero.greeting", page: "home", section: "home", type: "text", content: "Concurrent A" },
        { key: "about.story.title", page: "about", section: "about", type: "text", content: "About A" },
      ];
      const batchB = [
        { key: "home.hero.title", page: "home", section: "home", type: "text", content: "Concurrent B" },
        { key: "skills.heading.title", page: "skills", section: "skills", type: "text", content: "Skills B" },
      ];

      const reqA = new Request("http://localhost/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie: "admin_auth=true" },
        body: JSON.stringify({ items: batchA }),
      });
      const reqB = new Request("http://localhost/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie: "admin_auth=true" },
        body: JSON.stringify({ items: batchB }),
      });

      // Fire simultaneously
      const [resA, resB] = await Promise.all([api.handlePost(reqA), api.handlePost(reqB)]);

      assertStatus(resA, 200);
      assertStatus(resB, 200);

      const all = repo.getAll();
      assertEqual(all["home.hero.greeting"].content, "Concurrent A");
      assertEqual(all["about.story.title"].content, "About A");
      assertEqual(all["home.hero.title"].content, "Concurrent B");
      assertEqual(all["skills.heading.title"].content, "Skills B");
    });
  });
}
