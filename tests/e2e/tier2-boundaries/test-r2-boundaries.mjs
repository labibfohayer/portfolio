/**
 * Tier 2 — Boundary & Corner Cases: R2 Inline Text & Style Editing
 * Requirements: ORIGINAL_REQUEST §R2, PROJECT.md Features 10, 11, 12
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";

export function registerTier2R2Tests() {
  describe("Tier 2: R2 Inline Text & Style Editing Boundaries", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T2.6: Empty string text override updates state cleanly without throwing", async () => {
      builder.clickElement("home.hero.greeting");
      const updated = builder.updateTextContent("");
      assertEqual(updated.content, "", "Should allow empty string content");
      assertTrue(builder.isDirty, "Builder must mark dirty");
    });

    suite.test("T2.7: Giant text payload (50,000 characters) processed without buffer overflow", async () => {
      builder.clickElement("about.story.title");
      const giantString = "A".repeat(50000);
      const updated = builder.updateTextContent(giantString);
      assertEqual(updated.content.length, 50000, "Should store full 50,000 characters");
      assertEqual(updated.content, giantString);
    });

    suite.test("T2.8: Text containing XSS attack vectors is preserved as raw text without code execution", async () => {
      builder.clickElement("home.hero.title");
      const xssPayload = `<script>alert('pwned')</script><img src=x onerror=alert(1)><iframe src="javascript:alert(1)"></iframe>`;
      const updated = builder.updateTextContent(xssPayload);
      assertEqual(updated.content, xssPayload, "Should retain raw characters safely");

      // Verify that after saving, raw characters remain intact
      await builder.saveChanges();
      const persisted = repo.get("home.hero.title");
      assertEqual(persisted.content, xssPayload);
    });

    suite.test("T2.9: Multi-byte Unicode, emoji, and complex multilingual characters preserved accurately", async () => {
      builder.clickElement("home.hero.greeting");
      const complexText = "👋 Hello! مرحباً بك 🚀 AI 架构师 — Ça va? 💻 (100% Guaranteed)";
      const updated = builder.updateTextContent(complexText);
      assertEqual(updated.content, complexText, "Complex Unicode characters must match exactly");

      await builder.saveChanges();
      const persisted = repo.get("home.hero.greeting");
      assertEqual(persisted.content, complexText);
    });

    suite.test("T2.10: Malformed hex color code rejected with validation error", async () => {
      builder.clickElement("home.hero.title");
      const invalidColors = ["#ZZZZZZ", "blueish-neon", "#12", "#1234567", "rgb(999,999,999)"];
      for (const badColor of invalidColors) {
        try {
          builder.updateTextColor(badColor);
          assertTrue(false, `Should have rejected invalid color: ${badColor}`);
        } catch (err) {
          assertTrue(err.message.includes("Invalid color code"), `Must throw for ${badColor}`);
        }
      }
    });

    suite.test("T2.11: Unsupported font family rejected with validation error", async () => {
      builder.clickElement("home.hero.title");
      const invalidFonts = ["Comic Sans MS 3D", "NonExistentFontXYZ", "System-Unknown-99"];
      for (const badFont of invalidFonts) {
        try {
          builder.updateFontFamily(badFont);
          assertTrue(false, `Should have rejected font: ${badFont}`);
        } catch (err) {
          assertTrue(err.message.includes("Unsupported font family"), `Must throw for ${badFont}`);
        }
      }
    });
  });
}
