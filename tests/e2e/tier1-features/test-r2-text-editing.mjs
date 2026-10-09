/**
 * Tier 1 — Feature Coverage: R2 Inline Text & Style Editing
 * Requirements: ORIGINAL_REQUEST §R2, PROJECT.md Features 9, 10, 11, 12
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler, SUPPORTED_FONTS } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";

export function registerTier1R2Tests() {
  describe("Tier 1: R2 Inline Text & Style Editing", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T1.6: Clicking editable text opens Canva-style contextual text toolbar", async () => {
      assertFalse(builder.toolbarVisible, "Toolbar should initially be hidden");
      const selection = builder.clickElement("home.hero.greeting");
      assertTrue(builder.toolbarVisible, "Toolbar must appear after element click");
      assertEqual(builder.toolbarType, "text", "Toolbar type must be 'text'");
      assertEqual(selection.selectedElementId, "home.hero.greeting");
    });

    suite.test("T1.7: Text content input updates draft content with zero latency in preview", async () => {
      builder.clickElement("home.hero.greeting");
      const updated = builder.updateTextContent("Welcome to My Portfolio");
      assertEqual(updated.content, "Welcome to My Portfolio", "Draft content must match updated text");
      assertTrue(builder.isDirty, "Builder state must be marked dirty");
    });

    suite.test("T1.8: Font family selector updates element fontFamily style in real-time", async () => {
      builder.clickElement("home.hero.greeting");
      for (const font of SUPPORTED_FONTS) {
        const updated = builder.updateFontFamily(font);
        assertEqual(updated.fontFamily, font, `Font family must update to ${font}`);
      }
    });

    suite.test("T1.9: Text color picker updates element color style in real-time", async () => {
      builder.clickElement("home.hero.greeting");
      const neonCyan = "#06b6d4";
      const updated = builder.updateTextColor(neonCyan);
      assertEqual(updated.color, neonCyan, "Color must update to neon cyan");
      
      const vibrantPink = "#ec4899";
      const updatedPink = builder.updateTextColor(vibrantPink);
      assertEqual(updatedPink.color, vibrantPink, "Color must update to vibrant pink");
    });

    suite.test("T1.10: Toolbar dismisses/closes on deselect while preserving unsaved draft changes", async () => {
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Draft Title In Progress");
      builder.updateTextColor("#22d3ee");

      // Deselect element (click outside or Esc)
      builder.deselect();
      assertFalse(builder.toolbarVisible, "Toolbar must be hidden on deselect");
      assertEqual(builder.selectedElementId, null, "Selected element must be null");

      // Draft must be preserved
      const val = builder.getCurrentValue("home.hero.greeting");
      assertEqual(val.content, "Draft Title In Progress", "Draft content must remain in state");
      assertEqual(val.color, "#22d3ee", "Draft color must remain in state");
      assertTrue(builder.isDirty, "Builder must remain dirty until saved");
    });
  });
}
