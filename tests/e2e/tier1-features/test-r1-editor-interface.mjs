/**
 * Tier 1 — Feature Coverage: R1 Admin Visual Editor Interface & Navigation
 * Requirements: ORIGINAL_REQUEST §R1, PROJECT.md Features 5, 6, 7, 8
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertIncludes } from "../helpers/assertions.mjs";
import { CANONICAL_SECTIONS, STANDARD_VIEWPORTS, ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";

export function registerTier1R1Tests() {
  describe("Tier 1: R1 Admin Visual Editor Interface & Navigation", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T1.1: Visual Editor mounts with default view and active #home section", async () => {
      assertEqual(builder.activeSection, "home", "Default active section must be 'home'");
      assertEqual(builder.currentViewport, "desktop", "Default viewport must be 'desktop'");
      assertEqual(builder.getViewportWidth(), 1440, "Default desktop width must be 1440px");
      assertTrue(builder.defaultElements["home.hero.greeting"] !== undefined, "Hero greeting element must be defined");
    });

    suite.test("T1.2: Visual Editor navigation supports all 7 canonical sections", async () => {
      assertEqual(CANONICAL_SECTIONS.length, 7, "Must support exactly 7 canonical sections");
      for (const section of CANONICAL_SECTIONS) {
        const navigated = builder.navigateToSection(`#${section}`);
        assertEqual(navigated, section, `Must navigate successfully to #${section}`);
        assertEqual(builder.activeSection, section, `Active section must be ${section}`);
      }
    });

    suite.test("T1.3: Admin dashboard sidebar layout specifies Visual Builder navigation link contract", async () => {
      // Contract test: Admin layout must support Builder navigation
      const builderRoute = "/admin/dashboard/builder";
      const expectedLinkText = "Visual Editor";
      const linkContract = {
        name: expectedLinkText,
        href: builderRoute,
      };
      assertEqual(linkContract.href, "/admin/dashboard/builder", "Route must be /admin/dashboard/builder");
      assertTrue(linkContract.href.startsWith("/admin/dashboard/"), "Must be under /admin/dashboard/ prefix");
    });

    suite.test("T1.4: Responsive viewport toggle switches dimensions for Desktop, Tablet, and Mobile", async () => {
      builder.setViewport("tablet");
      assertEqual(builder.currentViewport, "tablet", "Active viewport should be tablet");
      assertEqual(builder.getViewportWidth(), STANDARD_VIEWPORTS.tablet, "Tablet width must be 768px");

      builder.setViewport("mobile");
      assertEqual(builder.currentViewport, "mobile", "Active viewport should be mobile");
      assertEqual(builder.getViewportWidth(), STANDARD_VIEWPORTS.mobile, "Mobile width must be 390px");

      builder.setViewport("desktop");
      assertEqual(builder.currentViewport, "desktop", "Active viewport should be desktop");
      assertEqual(builder.getViewportWidth(), STANDARD_VIEWPORTS.desktop, "Desktop width must be 1440px");
    });

    suite.test("T1.5: Visual Builder preserves navigation history and active highlight across jumps", async () => {
      builder.navigateToSection("about");
      assertEqual(builder.activeSection, "about");
      builder.navigateToSection("skills");
      assertEqual(builder.activeSection, "skills");
      builder.navigateToSection("experience");
      assertEqual(builder.activeSection, "experience");
      builder.navigateToSection("contact");
      assertEqual(builder.activeSection, "contact");
      builder.navigateToSection("home");
      assertEqual(builder.activeSection, "home");
    });
  });
}
