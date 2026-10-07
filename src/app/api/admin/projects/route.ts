import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { projects } = await req.json();

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
    const GITHUB_REPO = process.env.GITHUB_REPO;

    if (!GITHUB_TOKEN || !GITHUB_USERNAME || !GITHUB_REPO) {
      return NextResponse.json({ success: false, message: "GitHub credentials missing in environment." }, { status: 500 });
    }

    const path = "src/data.json";
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}`;

    // 1. Get the current file's SHA
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: 'no-store'
    });

    if (!getRes.ok) {
      const errorText = await getRes.text();
      return NextResponse.json({ success: false, message: `Failed to fetch file from GitHub: ${errorText}` }, { status: 500 });
    }

    const getJson = await getRes.json();
    const sha = getJson.sha;

    // 2. We keep the rest of data.json structure intact (if any)
    // Actually we only have "projects" in it right now, so we can just rebuild it.
    const newContentObj = { projects };
    
    // Format JSON with 2 spaces
    const newContentStr = JSON.stringify(newContentObj, null, 2);
    
    // Encode to base64
    const newContentBase64 = Buffer.from(newContentStr).toString("base64");

    // 3. Update the file via PUT request
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "admin: update projects data via CMS",
        content: newContentBase64,
        sha: sha,
      }),
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      return NextResponse.json({ success: false, message: `Failed to update file: ${errorText}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Projects updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
