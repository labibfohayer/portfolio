/**
 * Tier 2 — Boundary & Corner Cases: R3 Inline Image Replacement & Compression
 * Requirements: ORIGINAL_REQUEST §R3, PROJECT.md Features 13, 14
 */

import { describe } from "../helpers/test-context.mjs";
import { assertEqual, assertTrue, assertFalse } from "../helpers/assertions.mjs";
import { ContentRepository, ContentApiHandler } from "../helpers/contracts.mjs";
import { VisualBuilderSimulator } from "../helpers/dom-simulator.mjs";
import {
  createLargeImageFixture,
  simulateCanvasCompression,
  calculateAspectRatioFit,
  CORRUPTED_DATA_URL,
  NON_IMAGE_DATA_URL,
} from "../helpers/image-fixture.mjs";

export function registerTier2R3Tests() {
  describe("Tier 2: R3 Inline Image Replacement & Compression Boundaries", (suite) => {
    let repo;
    let api;
    let builder;

    suite.beforeEach(() => {
      repo = new ContentRepository();
      api = new ContentApiHandler(repo);
      builder = new VisualBuilderSimulator(api);
    });

    suite.test("T2.12: Ultra-heavy image (15MB 8K resolution 7680x4320) is downscaled and compressed to <200KB", async () => {
      const ultraHeavy = createLargeImageFixture(7680, 4320, 15000);
      const compressed = simulateCanvasCompression(ultraHeavy);

      assertTrue(compressed.isUnder200KB, "Payload must be under 200KB even for 15MB input");
      assertEqual(compressed.width, 1200, "Width must scale down to max 1200px");
      assertEqual(compressed.height, 675, "Height must scale to 675px maintaining 16:9 ratio");
    });

    suite.test("T2.13: Non-image file MIME type rejected with descriptive validation error", async () => {
      builder.clickElement("home.hero.avatar");
      const pdfFile = {
        dataUrl: NON_IMAGE_DATA_URL,
        mimeType: "application/pdf",
        width: 1000,
        height: 1000,
      };

      try {
        await builder.uploadImage(pdfFile);
        assertTrue(false, "Should have thrown for non-image format");
      } catch (err) {
        assertTrue(err.message.includes("Unsupported image format"), "Must reject non-image format");
      }
    });

    suite.test("T2.14: Corrupted or truncated image data URL throws descriptive decode error", async () => {
      builder.clickElement("home.hero.avatar");
      const corruptFile = {
        dataUrl: CORRUPTED_DATA_URL,
        mimeType: "image/jpeg",
        width: 800,
        height: 600,
      };

      try {
        await builder.uploadImage(corruptFile);
        assertTrue(false, "Should have thrown for corrupted image data");
      } catch (err) {
        assertTrue(err.message.includes("corrupted payload"), "Must report corrupted payload");
      }
    });

    suite.test("T2.15: Small image (50x50px, <10KB) is not upscaled or distorted during compression", async () => {
      const fit = calculateAspectRatioFit(50, 50, 1200);
      assertFalse(fit.scaled, "Small image must not be scaled up");
      assertEqual(fit.width, 50, "Width must remain 50px");
      assertEqual(fit.height, 50, "Height must remain 50px");
    });

    suite.test("T2.16: Extreme aspect ratios (ultra-wide 4000x800 and ultra-tall 800x3200) strictly maintain proportions", async () => {
      // Ultra-wide banner (5:1 ratio)
      const wideFit = calculateAspectRatioFit(4000, 800, 1200);
      assertEqual(wideFit.width, 1200, "Wide image width capped at 1200");
      assertEqual(wideFit.height, 240, "Wide image height scaled to 240 maintaining 5:1 ratio");

      // Ultra-tall mobile screenshot (1:4 ratio)
      const tallFit = calculateAspectRatioFit(800, 3200, 1200);
      assertEqual(tallFit.height, 1200, "Tall image height capped at 1200");
      assertEqual(tallFit.width, 300, "Tall image width scaled to 300 maintaining 1:4 ratio");
    });
  });
}
