/**
 * Test Context & Runner Harness for E2E Test Suite
 */

class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
  }

  test(title, fn) {
    this.tests.push({ title, fn });
  }

  beforeEach(fn) {
    this.beforeEachHooks.push(fn);
  }

  afterEach(fn) {
    this.afterEachHooks.push(fn);
  }

  async run() {
    const results = [];
    for (const test of this.tests) {
      const startTime = performance.now();
      try {
        for (const hook of this.beforeEachHooks) {
          await hook();
        }
        await test.fn();
        for (const hook of this.afterEachHooks) {
          await hook();
        }
        const duration = Math.round(performance.now() - startTime);
        results.push({ title: test.title, passed: true, duration });
      } catch (err) {
        const duration = Math.round(performance.now() - startTime);
        results.push({
          title: test.title,
          passed: false,
          duration,
          error: err.stack || err.message || String(err),
        });
      }
    }
    return { name: this.name, results };
  }
}

const activeSuites = [];

export function describe(name, fn) {
  const suite = new TestSuite(name);
  activeSuites.push(suite);
  fn(suite);
  return suite;
}

export function getSuites() {
  return activeSuites;
}

export function clearSuites() {
  activeSuites.length = 0;
}
