/**
 * Tier 1 — Feature Coverage: R4 Database Persistence & Dynamic Rendering
 * Requirements: ORIGINAL_REQUEST §R4, PROJECT.md Features 1, 2, 3, 4, 16
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse, assertStatus } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";
import { TINY_VALID_PNG } from "../helpers/image-fixture.mjs";

export function registerTier1R4Tests() {
  describe("Tier 1: R4 Database Persistence & Dynamic Rendering", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T1.16: GET /api/content returns HTTP 200 with element overrides map", async () => {
      // Seed an override
      repo.upsert({
        key: "home.hero.greeting",
        page: "home",
        section: "home",
        type: "text",
        content: "Hello World",
      });

      const res = await api.handleGet(new Request("http://localhost/api/content"));
      assertStatus(res, 200);
      const json = await res.json();
      assertTrue(json.success, "Response should have success: true");
      assertTrue(typeof json.data === "object", "Response should contain data object");
      assertEqual(json.data["home.hero.greeting"].content, "Hello World");
    });

    suite.test("T1.17: POST /api/content with admin_auth persists text overrides batch", async () => {
      const items = [
        {
          key: "home.hero.greeting",
          page: "home",
          section: "home",
          type: "text",
          content: "Welcome to AI Studio",
          fontFamily: "Space Grotesk",
          color: "#06b6d4",
        },
        {
          key: "about.story.title",
          page: "about",
          section: "about",
          type: "text",
          content: "Next-Gen Software Engineering",
          fontFamily: "Montserrat",
          color: "#ffffff",
        },
      ];

      const req = new Request("http://localhost/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "admin_auth=true",
        },
        body: JSON.stringify({ items }),
      });

      const res = await api.handlePost(req);
      assertStatus(res, 200);
      const json = await res.json();
      assertTrue(json.success);
      assertEqual(json.count, 2, "Must report 2 items persisted");

      // Verify in storage
      const hero = repo.get("home.hero.greeting");
      assertEqual(hero.content, "Welcome to AI Studio");
      assertEqual(hero.fontFamily, "Space Grotesk");
      assertEqual(hero.color, "#06b6d4");
    });

    suite.test("T1.18: POST /api/content with admin_auth persists compressed image overrides", async () => {
      const items = [
        {
          key: "home.hero.avatar",
          page: "home",
          section: "home",
          type: "image",
          content: TINY_VALID_PNG,
        },
      ];

      const req = new Request("http://localhost/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: "admin_auth=true",
        },
        body: JSON.stringify({ items }),
      });

      const res = await api.handlePost(req);
      assertStatus(res, 200);
      const json = await res.json();
      assertTrue(json.success);
      assertEqual(json.count, 1);

      const avatar = repo.get("home.hero.avatar");
      assertEqual(avatar.type, "image");
      assertEqual(avatar.content, TINY_VALID_PNG);
    });

    suite.test("T1.19: Public website dynamically renders persisted database overrides", async () => {
      // Persist override to DB
      repo.upsert({
        key: "skills.heading.title",
        page: "skills",
        section: "skills",
        type: "text",
        content: "Mastery & Expertise Radar",
        fontFamily: "Outfit",
        color: "#10b981",
      });

      // Load into visitor simulator
      await builder.loadInitialData();
      const publicView = builder.renderPublicSite();

      assertTrue(publicView["skills.heading.title"].isOverridden, "Should be marked overridden");
      assertEqual(publicView["skills.heading.title"].content, "Mastery & Expertise Radar");
      assertEqual(publicView["skills.heading.title"].color, "#10b981");
    });

    suite.test("T1.20: Public website gracefully renders default content when no database override exists", async () => {
      // Empty repo
      repo.clear();
      await builder.loadInitialData();
      const publicView = builder.renderPublicSite();

      assertFalse(publicView["home.hero.greeting"].isOverridden, "Should not be overridden");
      assertEqual(publicView["home.hero.greeting"].content, "Hi, I'm Labib", "Must show default greeting");
      assertEqual(publicView["home.hero.title"].content, "FULL-STACK AI DEVELOPER", "Must show default title");
    });
  });
}
