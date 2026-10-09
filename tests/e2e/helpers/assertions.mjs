import assert from "node:assert/strict";

export function assertEqual(actual, expected, message) {
  assert.strictEqual(actual, expected, message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

export function assertDeepEqual(actual, expected, message) {
  assert.deepStrictEqual(actual, expected, message || `Expected deep equality between actual and expected`);
}

export function assertTrue(value, message) {
  assert.ok(value, message || `Expected truthy value, got ${value}`);
}

export function assertFalse(value, message) {
  assert.ok(!value, message || `Expected falsy value, got ${value}`);
}

export function assertIncludes(haystack, needle, message) {
  if (typeof haystack === "string") {
    assert.ok(haystack.includes(needle), message || `Expected string to contain "${needle}"`);
  } else if (Array.isArray(haystack)) {
    assert.ok(haystack.includes(needle), message || `Expected array to contain ${JSON.stringify(needle)}`);
  } else {
    throw new Error(`assertIncludes target must be string or array, got ${typeof haystack}`);
  }
}

export function assertMatch(value, regex, message) {
  assert.match(String(value), regex, message || `Expected ${value} to match pattern ${regex}`);
}

export function assertStatus(response, expectedStatus, message) {
  const actualStatus = response.status !== undefined ? response.status : response.statusCode;
  assert.strictEqual(actualStatus, expectedStatus, message || `Expected HTTP status ${expectedStatus}, got ${actualStatus}`);
}

export async function assertThrowsAsync(fn, errorMatcher, message) {
  let threw = false;
  try {
    await fn();
  } catch (err) {
    threw = true;
    if (errorMatcher) {
      if (typeof errorMatcher === "function") {
        assert.ok(err instanceof errorMatcher, message || `Expected error of type ${errorMatcher.name}, got ${err}`);
      } else if (errorMatcher instanceof RegExp) {
        assert.match(err.message, errorMatcher, message || `Expected error message to match ${errorMatcher}`);
      }
    }
  }
  assert.ok(threw, message || `Expected async function to throw an error, but it succeeded`);
}
