/**
 * Tier 4 — Real-World Scenarios
 * Complete End-to-End Admin Authoring Workflows & User Journeys
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse, assertStatus } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";
import { createLargeImageFixture } from "../helpers/image-fixture.mjs";

export function registerTier4Tests() {
  describe("Tier 4: Real-World Scenarios & Admin Authoring Journeys", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T4.1: Scenario 1 — Complete Hero Rebranding End-to-End Journey", async () => {
      // Step 1: Admin enters Visual Builder
      assertEqual(builder.activeSection, "home");

      // Step 2: Admin clicks Hero greeting text
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Welcome to Labib's AI Systems Lab");
      builder.updateFontFamily("Space Grotesk");
      builder.updateTextColor("#06b6d4");

      // Step 3: Admin clicks Hero avatar and uploads high-res photo
      builder.deselect();
      builder.clickElement("home.hero.avatar");
      const highResPhoto = createLargeImageFixture(3200, 2400, 4200);
      const uploadOutcome = await builder.uploadImage(highResPhoto);

      // Verify client compression occurred
      assertTrue(uploadOutcome.compression.isUnder200KB);
      assertTrue(uploadOutcome.compression.width <= 1200);

      // Step 4: Admin clicks "Save Changes"
      const saveOutcome = await builder.saveChanges();
      assertEqual(saveOutcome.status, 200);
      assertEqual(saveOutcome.count, 2);

      // Step 5: Visitor visits public site
      const liveSite = builder.renderPublicSite();
      assertEqual(liveSite["home.hero.greeting"].content, "Welcome to Labib's AI Systems Lab");
      assertEqual(liveSite["home.hero.greeting"].fontFamily, "Space Grotesk");
      assertEqual(liveSite["home.hero.greeting"].color, "#06b6d4");
      assertTrue(liveSite["home.hero.avatar"].content.startsWith("data:image/jpeg;base64,"));
    });

    suite.test("T4.2: Scenario 2 — Multi-Section Portfolio Overhaul Across 4 Sections", async () => {
      // 1. Home Section
      builder.navigateToSection("home");
      builder.clickElement("home.hero.title");
      builder.updateTextContent("LEAD ARCHITECT FOR DISTRIBUTED INTELLIGENCE");

      // 2. About Section
      builder.navigateToSection("about");
      builder.clickElement("about.story.title");
      builder.updateTextContent("Building Resilient Multi-Agent Autonomous Systems");
      builder.updateFontFamily("Montserrat");

      // 3. Skills Section
      builder.navigateToSection("skills");
      builder.clickElement("skills.heading.title");
      builder.updateTextContent("Full-Spectrum Technical Radar & Core Stacks");
      builder.updateTextColor("#22d3ee");

      // 4. Experience Section
      builder.navigateToSection("experience");
      builder.clickElement("experience.current.role");
      builder.updateTextContent("Principal Autonomous Systems Engineer");

      // 5. Batch Save
      const saveRes = await builder.saveChanges();
      assertEqual(saveRes.status, 200);
      assertEqual(saveRes.count, 4);

      // 6. Verify GET /api/content returns all 4 records
      const getRes = await api.handleGet();
      const allData = (await getRes.json()).data;
      assertEqual(allData["home.hero.title"].content, "LEAD ARCHITECT FOR DISTRIBUTED INTELLIGENCE");
      assertEqual(allData["about.story.title"].content, "Building Resilient Multi-Agent Autonomous Systems");
      assertEqual(allData["skills.heading.title"].content, "Full-Spectrum Technical Radar & Core Stacks");
      assertEqual(allData["experience.current.role"].content, "Principal Autonomous Systems Engineer");
    });

    suite.test("T4.3: Scenario 3 — Session Expiry, 401 Rejection, Re-Authentication & Zero Data Loss", async () => {
      // 1. Admin prepares valuable edits
      builder.clickElement("home.hero.greeting");
      builder.updateTextContent("Critical Production Announcement");

      // 2. Session cookie expires in background
      builder.isAuthenticated = false;

      // 3. Admin attempts to save
      const failedSave = await builder.saveChanges();
      assertEqual(failedSave.status, 401);
      assertFalse(failedSave.success);

      // 4. Draft MUST NOT be lost despite 401
      assertTrue(builder.isDirty, "Builder must remain dirty");
      assertEqual(builder.getCurrentValue("home.hero.greeting").content, "Critical Production Announcement");

      // 5. Admin logs back in (session restored)
      builder.isAuthenticated = true;

      // 6. Admin retries save
      const retrySave = await builder.saveChanges();
      assertEqual(retrySave.status, 200);
      assertTrue(retrySave.success);
      assertFalse(builder.isDirty);

      // 7. Verify persisted correctly in DB
      assertEqual(repo.get("home.hero.greeting").content, "Critical Production Announcement");
    });

    suite.test("T4.4: Scenario 4 — High-Resolution Asset Optimization & Storage Budget Verification", async () => {
      builder.clickElement("home.hero.avatar");
      // Heavy 8.5MB 4000x3000 photo
      const massivePhoto = createLargeImageFixture(4000, 3000, 8500);
      const outcome = await builder.uploadImage(massivePhoto);

      // Verify compression limits
      assertTrue(outcome.compression.isUnder200KB);
      assertTrue(outcome.compression.sizeBytes <= 200 * 1024, "Strictly capped under 200KB");
      assertTrue(outcome.compression.width <= 1200);

      // Persist to backend
      const saveRes = await builder.saveChanges();
      assertEqual(saveRes.status, 200);

      // Validate DB record payload size
      const dbRecord = repo.get("home.hero.avatar");
      assertTrue(dbRecord.content.length <= 200 * 1024, "Stored DB payload must conform to storage budget");
    });

    suite.test("T4.5: Scenario 5 — Override Reversion and Graceful Default Content Fallback", async () => {
      // 1. Initially save an override
      repo.upsert({
        key: "about.story.title",
        page: "about",
        section: "about",
        type: "text",
        content: "Temporary Promotional Headline",
      });

      await builder.loadInitialData();
      let publicView = builder.renderPublicSite();
      assertEqual(publicView["about.story.title"].content, "Temporary Promotional Headline");

      // 2. Clear / delete the override from database
      repo.clear();
      await builder.loadInitialData();

      // 3. Public site immediately and cleanly falls back to default hardcoded content
      publicView = builder.renderPublicSite();
      assertFalse(publicView["about.story.title"].isOverridden);
      assertEqual(publicView["about.story.title"].content, "Engineering Scalable AI Systems");
    });
  });
}
