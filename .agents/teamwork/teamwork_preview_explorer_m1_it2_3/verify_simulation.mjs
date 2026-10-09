import assert from "node:assert/strict";
import path from "node:path";
import mongoose, { Schema } from "mongoose";

// 1. Simulate PageContent schema with Explorer 2's fix
const PageContentSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      trim: true,
    },
    page: {
      type: String,
      required: [true, "Page identifier is required"],
      trim: true,
    },
    section: {
      type: String,
      required: [true, "Section identifier is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Content type is required"],
      enum: ["text", "image"],
      default: "text",
    },
    content: {
      type: String,
      validate: {
        validator: (v) => typeof v === "string",
        message: "Content must be a string",
      },
    },
    fontFamily: {
      type: String,
      default: undefined,
      trim: true,
    },
    color: {
      type: String,
      default: undefined,
      trim: true,
    },
  },
  { timestamps: true }
);

const MockPageContent = mongoose.model("MockPageContent", PageContentSchema);

// Test 1: Empty string content validation on model
const emptyDoc = new MockPageContent({
  key: "test.hero.empty",
  page: "home",
  section: "hero",
  type: "text",
  content: "",
});
await emptyDoc.validate();
assert.strictEqual(emptyDoc.content, "");
console.log("✔ Test 1 passed: PageContent validates empty string content ('')");

// Test 2: Null content validation fails on model
const nullDoc = new MockPageContent({
  key: "test.hero.null",
  page: "home",
  section: "hero",
  type: "text",
  content: null,
});
let caught = null;
try {
  await nullDoc.validate();
} catch (e) {
  caught = e;
}
assert(caught, "Null content must fail validation");
console.log("✔ Test 2 passed: PageContent rejects null content");

// 2. Simulate Route POST handler with Explorer 1 and Explorer 3 fixes
const mockStore = new Map();

function simulateRoutePost(body, hasAuth = true) {
  if (!hasAuth) {
    return { status: 401, body: { success: false, message: "Unauthorized" } };
  }

  // Validate body
  if (!body || typeof body !== "object" || !Array.isArray(body.items)) {
    return { status: 400, body: { success: false, message: "Request body must contain an 'items' array" } };
  }

  // Explorer 1 fix:
  if (body.items.length === 0) {
    return { status: 200, body: { success: true, count: 0, message: "No items to update" } };
  }

  // Item validation & normalization (Explorer 3 fix)
  const items = body.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item !== "object") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}` } };
    }
    if (typeof item.key !== "string" || item.key.trim() === "") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'key' required` } };
    }
    if (typeof item.page !== "string" || item.page.trim() === "") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'page' required` } };
    }
    if (typeof item.section !== "string" || item.section.trim() === "") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'section' required` } };
    }
    if (item.type !== "text" && item.type !== "image") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'type' invalid` } };
    }
    if (typeof item.content !== "string") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'content' required` } };
    }

    // Explorer 3: Normalize null style properties to undefined
    if (item.fontFamily === null) {
      item.fontFamily = undefined;
    }
    if (item.color === null) {
      item.color = undefined;
    }

    if (item.fontFamily !== undefined && typeof item.fontFamily !== "string") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'fontFamily' must be a string if provided` } };
    }
    if (item.color !== undefined && typeof item.color !== "string") {
      return { status: 400, body: { success: false, message: `Invalid item at index ${i}: 'color' must be a string if provided` } };
    }
  }

  // Deduplication & persistence
  const itemMap = new Map();
  for (const item of items) {
    itemMap.set(item.key.trim(), item);
  }
  const uniqueItems = Array.from(itemMap.values());

  for (const item of uniqueItems) {
    const existing = mockStore.get(item.key.trim()) || {};
    mockStore.set(item.key.trim(), {
      ...existing,
      key: item.key.trim(),
      page: item.page.trim(),
      section: item.section.trim(),
      type: item.type,
      content: item.content,
      fontFamily: item.fontFamily?.trim() || undefined,
      color: item.color?.trim() || undefined,
      updatedAt: new Date(),
    });
  }

  return { status: 200, body: { success: true, count: uniqueItems.length } };
}

function simulateRouteGet(filterPage) {
  const records = Array.from(mockStore.values());
  const data = {};
  for (const record of records) {
    if (filterPage && record.page !== filterPage) continue;
    data[record.key] = {
      key: record.key,
      page: record.page,
      section: record.section,
      type: record.type,
      content: record.content,
      ...(record.fontFamily ? { fontFamily: record.fontFamily } : {}),
      ...(record.color ? { color: record.color } : {}),
      updatedAt: record.updatedAt,
    };
  }
  return { status: 200, body: { success: true, data } };
}

// Test 3: Empty items array returns 200 with count 0 (T2.20)
const resEmpty = simulateRoutePost({ items: [] });
assert.strictEqual(resEmpty.status, 200);
assert.strictEqual(resEmpty.body.success, true);
assert.strictEqual(resEmpty.body.count, 0);
assert.strictEqual(resEmpty.body.message, "No items to update");
console.log("✔ Test 3 passed: Empty items returns 200 count 0");

// Test 4: Empty string content ('') accepted and persisted
const resEmptyContent = simulateRoutePost({
  items: [
    { key: "home.hero.cleared", page: "home", section: "hero", type: "text", content: "" },
  ],
});
assert.strictEqual(resEmptyContent.status, 200);
assert.strictEqual(resEmptyContent.body.count, 1);
const getCleared = simulateRouteGet("home");
assert.strictEqual(getCleared.body.data["home.hero.cleared"].content, "");
console.log("✔ Test 4 passed: Empty string content accepted and retrieved as ''");

// Test 5: Null fontFamily and color reset styles (normalized to undefined)
const resResetStyles = simulateRoutePost({
  items: [
    {
      key: "home.hero.resetstyle",
      page: "home",
      section: "hero",
      type: "text",
      content: "Reset style element",
      fontFamily: null,
      color: null,
    },
  ],
});
assert.strictEqual(resResetStyles.status, 200);
assert.strictEqual(resResetStyles.body.count, 1);
const getReset = simulateRouteGet("home");
const resetItem = getReset.body.data["home.hero.resetstyle"];
assert(resetItem);
assert.strictEqual(resetItem.fontFamily, undefined);
assert.strictEqual(resetItem.color, undefined);
console.log("✔ Test 5 passed: Null styling accepted and normalized to undefined in GET");

// Test 6: Invalid non-string, non-null styling rejected with 400
const resBadFont = simulateRoutePost({
  items: [
    { key: "k", page: "p", section: "s", type: "text", content: "c", fontFamily: 12345 },
  ],
});
assert.strictEqual(resBadFont.status, 400);
assert(resBadFont.body.message.includes("fontFamily"));

const resBadColor = simulateRoutePost({
  items: [
    { key: "k", page: "p", section: "s", type: "text", content: "c", color: true },
  ],
});
assert.strictEqual(resBadColor.status, 400);
assert(resBadColor.body.message.includes("color"));
console.log("✔ Test 6 passed: Non-string, non-null styling values rejected with 400");

console.log("\n============================================");
console.log("ALL SIMULATION CHECKS PASSED WITH 100% SUCCESS!");
console.log("============================================");
