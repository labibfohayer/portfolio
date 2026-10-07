import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Default fallback if not set in Vercel
    const validUsername = process.env.ADMIN_USERNAME || "Labib";
    const validPassword = process.env.ADMIN_PASSWORD || "LabibSadiya";

    if (username === validUsername && password === validPassword) {
      // Return a Set-Cookie header instead of using cookies().set for better compatibility
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_auth',
        value: 'true',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
