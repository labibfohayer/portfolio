#!/usr/bin/env node
/**
 * Master E2E Test Runner for Portfolio Visual Builder
 * Supports Tiers 1-4 opaque-box testing across R1, R2, R3, R4.
 * Returns Exit Code 0 on all pass, Exit Code 1 on any failure.
 */

import { getSuites, clearSuites } from "./helpers/test-context.mjs";
import { registerTier1R1Tests } from "./tier1-features/test-r1-editor-interface.mjs";
import { registerTier1R2Tests } from "./tier1-features/test-r2-text-editing.mjs";
import { registerTier1R3Tests } from "./tier1-features/test-r3-image-replacement.mjs";
import { registerTier1R4Tests } from "./tier1-features/test-r4-db-persistence.mjs";
import { registerTier2R1Tests } from "./tier2-boundaries/test-r1-boundaries.mjs";
import { registerTier2R2Tests } from "./tier2-boundaries/test-r2-boundaries.mjs";
import { registerTier2R3Tests } from "./tier2-boundaries/test-r3-boundaries.mjs";
import { registerTier2R4Tests } from "./tier2-boundaries/test-r4-boundaries.mjs";
import { registerTier3Tests } from "./tier3-interactions/test-cross-features.mjs";
import { registerTier4Tests } from "./tier4-scenarios/test-admin-workflows.mjs";

async function main() {
  const args = process.argv.slice(2);
  const tierFilter = args.find((a, i) => args[i - 1] === "--tier");

  console.log("\n=======================================================");
  console.log("   PORTFOLIO VISUAL BUILDER — E2E TEST SUITE RUNNER   ");
  console.log("=======================================================\n");

  clearSuites();

  // Register all suites
  registerTier1R1Tests();
  registerTier1R2Tests();
  registerTier1R3Tests();
  registerTier1R4Tests();
  registerTier2R1Tests();
  registerTier2R2Tests();
  registerTier2R3Tests();
  registerTier2R4Tests();
  registerTier3Tests();
  registerTier4Tests();

  let allSuites = getSuites();

  if (tierFilter) {
    allSuites = allSuites.filter((s) => s.name.toLowerCase().includes(`tier ${tierFilter}`));
    console.log(`Filtering for Tier ${tierFilter} (${allSuites.length} suites selected)\n`);
  }

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];
  const overallStart = performance.now();

  for (const suite of allSuites) {
    console.log(`\n\x1b[1m\x1b[36m▶ Suite: ${suite.name}\x1b[0m`);
    const { results } = await suite.run();

    for (const res of results) {
      totalTests++;
      if (res.passed) {
        passedTests++;
        console.log(`  \x1b[32m✔\x1b[0m ${res.title} \x1b[90m(${res.duration}ms)\x1b[0m`);
      } else {
        failedTests++;
        console.log(`  \x1b[31m✖\x1b[0m ${res.title} \x1b[90m(${res.duration}ms)\x1b[0m`);
        console.log(`    \x1b[31mError: ${res.error}\x1b[0m`);
        failures.push({ suite: suite.name, ...res });
      }
    }
  }

  const overallDuration = Math.round(performance.now() - overallStart);

  console.log("\n=======================================================");
  console.log("                   TEST SUITE SUMMARY                  ");
  console.log("=======================================================");
  console.log(`Total Test Cases : ${totalTests}`);
  console.log(`Passed           : \x1b[32m${passedTests}\x1b[0m`);
  console.log(`Failed           : ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : `0`}`);
  console.log(`Total Duration   : ${overallDuration}ms`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    console.error(`\x1b[31m[FAILED] ${failedTests} test case(s) failed.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`\x1b[32m[PASSED] All ${passedTests} test cases passed successfully!\x1b[0m\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Unhandled error in test runner:", err);
  process.exit(1);
});
