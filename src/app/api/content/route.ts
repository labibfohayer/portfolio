import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent, { ElementOverride, PageContentType } from "@/models/PageContent";

export const dynamic = "force-dynamic";

/**
 * Extracts and verifies the admin_auth cookie from NextRequest cookies,
 * standard Web Request headers, or Next.js headers store.
 */
export function verifyAdminAuth(req: Request | NextRequest | any): boolean {
  // 1. NextRequest cookie store
  if (req && "cookies" in req && req.cookies && typeof req.cookies.get === "function") {
    const cookie = req.cookies.get("admin_auth");
    if (cookie && (cookie.value === "true" || (cookie as any) === "true")) {
      return true;
    }
  }

  // 2. Standard Web Request / HTTP Cookie header parsing
  if (req && typeof req.headers?.get === "function") {
    const rawCookie = req.headers.get("cookie");
    if (rawCookie) {
      const pairs = rawCookie.split(";");
      for (const pair of pairs) {
        const [key, ...val] = pair.trim().split("=");
        if (key === "admin_auth" && val.join("=") === "true") {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * GET /api/content
 * Returns a dictionary map { [key: string]: ElementOverride } of all overrides.
 * Optional query parameter ?page=<page> filters overrides by page.
 */
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const filter: Record<string, any> = {};
    if (req.url) {
      try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const page = searchParams.get("page");
        if (page) {
          filter.page = page;
        }
      } catch {
        // Fallback for edge cases
      }
    }

    const records = await PageContent.find(filter).lean();

    const data: Record<string, ElementOverride> = {};
    for (const record of records as any[]) {
      data[record.key] = {
        key: record.key,
        page: record.page,
        section: record.section,
        type: record.type as PageContentType,
        content: record.content,
        ...(record.fontFamily ? { fontFamily: record.fontFamily } : {}),
        ...(record.color ? { color: record.color } : {}),
        updatedAt: record.updatedAt,
      };
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch content overrides",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/content
 * Authenticated batch upsert of element overrides.
 * Requires Cookie: admin_auth=true
 * Body: { items: ElementOverride[] }
 */
export async function POST(req: Request) {
  try {
    // 1. Authentication Check
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Admin session cookie required.",
        },
        { status: 401 }
      );
    }

    // 2. Parse JSON Body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    // 3. Validate Top-Level Body Structure
    if (!body || typeof body !== "object" || !Array.isArray(body.items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body must contain an 'items' array",
        },
        { status: 400 }
      );
    }

    if (body.items.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No items to update",
      });
    }

    // 4. Validate Each Item in the Batch
    const items: ElementOverride[] = body.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item || typeof item !== "object") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: item must be an object`,
          },
          { status: 400 }
        );
      }

      if (typeof item.key !== "string" || item.key.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'key' is required and must be a non-empty string`,
          },
          { status: 400 }
        );
      }

      if (typeof item.page !== "string" || item.page.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'page' is required and must be a non-empty string`,
          },
          { status: 400 }
        );
      }

      if (typeof item.section !== "string" || item.section.trim() === "") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'section' is required and must be a non-empty string`,
          },
          { status: 400 }
        );
      }

      if (item.type !== "text" && item.type !== "image") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'type' must be either 'text' or 'image'`,
          },
          { status: 400 }
        );
      }

      if (typeof item.content !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'content' is required and must be a string`,
          },
          { status: 400 }
        );
      }

      // Normalize null style properties to undefined (resets style overrides)
      if (item.fontFamily === null) {
        item.fontFamily = undefined;
      }
      if (item.color === null) {
        item.color = undefined;
      }

      if (item.fontFamily !== undefined && typeof item.fontFamily !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'fontFamily' must be a string if provided`,
          },
          { status: 400 }
        );
      }

      if (item.color !== undefined && typeof item.color !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid item at index ${i}: 'color' must be a string if provided`,
          },
          { status: 400 }
        );
      }
    }

    // 5. Connect to Database
    await connectToDatabase();

    // 6. In-memory Deduplication (latest item per key takes precedence)
    const itemMap = new Map<string, ElementOverride>();
    for (const item of items) {
      itemMap.set(item.key.trim(), item);
    }
    const uniqueItems = Array.from(itemMap.values());

    // 7. Bulk Write Upsert Operations
    const bulkOps = uniqueItems.map((item) => ({
      updateOne: {
        filter: { key: item.key.trim() },
        update: {
          $set: {
            key: item.key.trim(),
            page: item.page.trim(),
            section: item.section.trim(),
            type: item.type,
            content: item.content,
            fontFamily: item.fontFamily?.trim() || undefined,
            color: item.color?.trim() || undefined,
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await PageContent.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      count: uniqueItems.length,
      message: `Successfully saved ${uniqueItems.length} content override(s).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update content overrides",
      },
      { status: 500 }
    );
  }
}
