import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function POST() {
  try {
    await connectToDatabase();
    
    // Increment the profileViews counter by 1
    await Settings.findOneAndUpdate(
      { type: "global" },
      { $inc: { profileViews: 1 } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
