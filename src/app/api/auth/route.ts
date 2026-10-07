import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Default fallback if not set in Vercel
    const validUsername = process.env.ADMIN_USERNAME || "Labib";
    const validPassword = process.env.ADMIN_PASSWORD || "LabibSadiya";

    if (username === validUsername && password === validPassword) {
      // Set a simple auth cookie (expires in 1 day)
      cookies().set('admin_auth', 'true', { maxAge: 60 * 60 * 24 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
