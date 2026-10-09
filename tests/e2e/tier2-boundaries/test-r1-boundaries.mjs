/**
 * Tier 2 — Boundary & Corner Cases: R1 Admin Visual Editor Interface & Navigation
 * Requirements: ORIGINAL_REQUEST §R1, PROJECT.md Features 5, 7, 8
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse, assertThrowsAsync } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";

export function registerTier2R1Tests() {
  describe("Tier 2: R1 Admin Visual Editor Navigation & Viewport Boundaries", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T2.1: Viewport toggle rejects unsupported viewport presets and reports valid options", async () => {
      try {
        builder.setViewport("smartwatch_120px");
        assertTrue(false, "Should have thrown for unsupported viewport");
      } catch (err) {
        assertTrue(err.message.includes("Unsupported viewport"), "Must throw descriptive error");
      }
    });

    suite.test("T2.2: Section navigation rejects non-existent or malformed section hashes", async () => {
      try {
        builder.navigateToSection("#secret_admin_backdoor");
        assertTrue(false, "Should have thrown for unknown section");
      } catch (err) {
        assertTrue(err.message.includes("Unknown section"), "Must reject unknown section");
      }
    });

    suite.test("T2.3: Rapid navigation jumping across multiple sections remains synchronized", async () => {
      const rapidHops = ["about", "skills", "home", "contact", "experience", "blog", "projects"];
      for (const target of rapidHops) {
        builder.navigateToSection(target);
        assertEqual(builder.activeSection, target, `Section must immediately synchronize to ${target}`);
      }
      assertEqual(builder.activeSection, "projects");
    });

    suite.test("T2.4: Admin editor page enforces authentication state for authoring actions", async () => {
      // Simulate unauthenticated admin
      builder.isAuthenticated = false;
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Hacked Headline");

      // Attempting to save without auth must return 401
      const saveRes = await builder.saveChanges();
      assertEqual(saveRes.status, 401, "Unauthenticated save must be rejected with 401");
      assertFalse(saveRes.success, "Save response must not be successful");
    });

    suite.test("T2.5: Resizing viewport while editing an element retains active selection and draft state", async () => {
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Viewport-Responsive Headline");
      assertEqual(builder.selectedElementId, "home.hero.greeting");

      // Switch to tablet
      builder.setViewport("tablet");
      assertEqual(builder.selectedElementId, "home.hero.greeting", "Selected element should remain active");
      assertEqual(builder.getCurrentValue("home.hero.greeting").content, "Viewport-Responsive Headline");

      // Switch to mobile
      builder.setViewport("mobile");
      assertEqual(builder.selectedElementId, "home.hero.greeting");
      assertEqual(builder.getCurrentValue("home.hero.greeting").content, "Viewport-Responsive Headline");
      assertTrue(builder.isDirty, "Dirty state must remain active across viewport changes");
    });
  });
}
