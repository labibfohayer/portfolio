/**
 * Tier 3 — Cross-Feature Interactions
 * Pairwise and multi-feature interaction workflows between Editor, Styles, Images, and DB Persistence
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";
import { createLargeImageFixture } from "../helpers/image-fixture.mjs";

export function registerTier3Tests() {
  describe("Tier 3: Cross-Feature Interactions", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T3.1: Multi-Property Styling + Persistence (Content + Font + Color bundled save)", async () => {
      // 1. Click text element
      builder.clickElement("home.hero.title");
      // 2. Change text
      builder.updateTextContent("AUTONOMOUS SYSTEMS ARCHITECT");
      // 3. Change font
      builder.updateFontFamily("Space Grotesk");
      // 4. Change color
      builder.updateTextColor("#06b6d4");

      // Verify draft state holds all three modifications
      const draft = builder.getCurrentValue("home.hero.title");
      assertEqual(draft.content, "AUTONOMOUS SYSTEMS ARCHITECT");
      assertEqual(draft.fontFamily, "Space Grotesk");
      assertEqual(draft.color, "#06b6d4");

      // 5. Save changes
      const saveRes = await builder.saveChanges();
      assertEqual(saveRes.status, 200);
      assertEqual(saveRes.count, 1);

      // 6. Verify in database
      const persisted = repo.get("home.hero.title");
      assertEqual(persisted.content, "AUTONOMOUS SYSTEMS ARCHITECT");
      assertEqual(persisted.fontFamily, "Space Grotesk");
      assertEqual(persisted.color, "#06b6d4");

      // 7. Verify public site dynamic rendering
      const publicView = builder.renderPublicSite();
      assertEqual(publicView["home.hero.title"].content, "AUTONOMOUS SYSTEMS ARCHITECT");
      assertEqual(publicView["home.hero.title"].fontFamily, "Space Grotesk");
      assertEqual(publicView["home.hero.title"].color, "#06b6d4");
    });

    suite.test("T3.2: Interleaved Text and Image Edits in unified authoring session", async () => {
      // 1. Edit text
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Hello, I am Labib");

      // 2. Deselect and click image
      builder.deselect();
      builder.clickElement("home.hero.avatar");
      const imageFixture = createLargeImageFixture(1920, 1080, 2000);
      const uploadResult = await builder.uploadImage(imageFixture);

      // Verify drafts contain both
      assertTrue(builder.draftOverrides["home.hero.greeting"] !== undefined);
      assertTrue(builder.draftOverrides["home.hero.avatar"] !== undefined);

      // 3. Save single batch
      const saveRes = await builder.saveChanges();
      assertEqual(saveRes.status, 200);
      assertEqual(saveRes.count, 2);

      // 4. Verify DB contains both
      const savedGreeting = repo.get("home.hero.greeting");
      const savedAvatar = repo.get("home.hero.avatar");
      assertEqual(savedGreeting.content, "Hello, I am Labib");
      assertTrue(savedAvatar.content.startsWith("data:image/jpeg;base64,"));
    });

    suite.test("T3.3: Cross-Section Navigation maintains dirty draft state across sections before batch save", async () => {
      // Edit in Home
      builder.navigateToSection("home");
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Cross-Section Home Edit");

      // Navigate to About and edit
      builder.navigateToSection("about");
      builder.clickElement("about.story.title");
      builder.updateTextContent("Cross-Section About Edit");

      // Navigate to Experience and edit
      builder.navigateToSection("experience");
      builder.clickElement("experience.current.role");
      builder.updateTextContent("Cross-Section Experience Edit");

      // Check all 3 drafts remain in memory
      assertEqual(Object.keys(builder.draftOverrides).length, 3);
      assertTrue(builder.isDirty);

      // Single save
      const saveRes = await builder.saveChanges();
      assertEqual(saveRes.status, 200);
      assertEqual(saveRes.count, 3);
      assertFalse(builder.isDirty);

      // Verify all 3 in repository
      assertEqual(repo.get("home.hero.greeting").content, "Cross-Section Home Edit");
      assertEqual(repo.get("about.story.title").content, "Cross-Section About Edit");
      assertEqual(repo.get("experience.current.role").content, "Cross-Section Experience Edit");
    });

    suite.test("T3.4: Viewport switching during live editing preserves toolbar positioning and modifications", async () => {
      // Start in Desktop
      builder.setViewport("desktop");
      builder.clickElement("home.hero.title");
      builder.updateTextContent("Desktop Viewport Edit");

      // Switch to Mobile
      builder.setViewport("mobile");
      assertEqual(builder.getViewportWidth(), 390);
      assertEqual(builder.selectedElementId, "home.hero.title");
      builder.updateTextColor("#ec4899");

      // Switch to Tablet
      builder.setViewport("tablet");
      assertEqual(builder.getViewportWidth(), 768);
      builder.updateFontFamily("Playfair");

      // Check cumulative modifications in current value
      const current = builder.getCurrentValue("home.hero.title");
      assertEqual(current.content, "Desktop Viewport Edit");
      assertEqual(current.color, "#ec4899");
      assertEqual(current.fontFamily, "Playfair");
    });

    suite.test("T3.5: Discard / Reset workflow interaction restores original state without persisting", async () => {
      // Admin makes edits to multiple elements
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Unwanted Draft Edit");
      builder.clickElement("home.hero.avatar");
      const img = createLargeImageFixture(800, 800, 500);
      await builder.uploadImage(img);

      assertTrue(builder.isDirty);

      // Admin clicks Discard / Cancel
      builder.discardDrafts();
      assertFalse(builder.isDirty);
      assertEqual(Object.keys(builder.draftOverrides).length, 0);

      // Ensure DB was untouched
      assertEqual(repo.get("home.hero.greeting"), null);
      assertEqual(repo.get("home.hero.avatar"), null);

      // Public site retains factory default
      const publicView = builder.renderPublicSite();
      assertEqual(publicView["home.hero.greeting"].content, "Hi, I'm Labib");
    });
  });
}
