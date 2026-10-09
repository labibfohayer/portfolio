/**
 * Tier 1 — Feature Coverage: R3 Inline Image Replacement & Automatic Compression
 * Requirements: ORIGINAL_REQUEST §R3, PROJECT.md Features 13, 14
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";
import { createLargeImageFixture, simulateCanvasCompression, TINY_VALID_PNG, calculateAspectRatioFit } from "../helpers/image-fixture.mjs";

export function registerTier1R3Tests() {
  describe("Tier 1: R3 Inline Image Replacement & Automatic Compression", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T1.11: Clicking editable image opens contextual image toolbar", async () => {
      assertFalse(builder.toolbarVisible, "Toolbar initially hidden");
      const selection = builder.clickElement("home.hero.avatar");
      assertTrue(builder.toolbarVisible, "Toolbar must appear on image click");
      assertEqual(builder.toolbarType, "image", "Toolbar type must be 'image'");
      assertEqual(selection.selectedElementId, "home.hero.avatar");
    });

    suite.test("T1.12: Image toolbar exposes file replacement action and preserves image element type", async () => {
      builder.clickElement("home.hero.avatar");
      const currentVal = builder.getCurrentValue("home.hero.avatar");
      assertEqual(currentVal.type, "image", "Element type must be 'image'");
      assertTrue(currentVal.content.length > 0, "Current image src must be non-empty");
    });

    suite.test("T1.13: Image compression routine automatically downscales large image to <=1200px max dimension", async () => {
      const largeFixture = createLargeImageFixture(3840, 2160, 4500); // 4K 4.5MB image
      const fit = calculateAspectRatioFit(largeFixture.width, largeFixture.height, 1200);
      
      assertEqual(fit.width, 1200, "Scaled width must be capped at 1200px");
      assertEqual(fit.height, 675, "Scaled height must preserve 16:9 aspect ratio");
      assertTrue(fit.scaled, "Image should be marked as scaled");
    });

    suite.test("T1.14: Image compression routine produces base64 payload under 200KB with JPEG quality 0.7", async () => {
      const largeFixture = createLargeImageFixture(4000, 3000, 6000); // 6MB RAW photo
      const compressed = simulateCanvasCompression({
        dataUrl: largeFixture.dataUrl,
        width: largeFixture.width,
        height: largeFixture.height,
        mimeType: "image/jpeg",
        maxDimension: 1200,
        quality: 0.7,
      });

      assertTrue(compressed.isUnder200KB, "Compressed payload must be under 200KB");
      assertTrue(compressed.sizeBytes < 200 * 1024, "Payload bytes must be less than 204,800 bytes");
      assertEqual(compressed.quality, 0.7, "Quality factor must be 0.7");
      assertTrue(compressed.dataUrl.startsWith("data:image/jpeg;base64,"), "Must output valid JPEG data URL");
    });

    suite.test("T1.15: Compressed image immediately updates preview image src and marks editor dirty", async () => {
      builder.clickElement("home.hero.avatar");
      const originalSrc = builder.getCurrentValue("home.hero.avatar").content;

      const largeFixture = createLargeImageFixture(2400, 1800, 3000);
      const uploadResult = await builder.uploadImage(largeFixture);

      const updatedSrc = builder.getCurrentValue("home.hero.avatar").content;
      assertTrue(updatedSrc !== originalSrc, "Image src must be updated to new data URL");
      assertTrue(updatedSrc.startsWith("data:image/jpeg;base64,"), "New src must be base64 data URL");
      assertTrue(uploadResult.compression.isUnder200KB, "Upload must confirm compression under 200KB");
      assertTrue(builder.isDirty, "Builder state must be dirty");
    });
  });
}
