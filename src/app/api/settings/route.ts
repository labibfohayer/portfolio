import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Find global settings or create default if not exists
    let settings = await Settings.findOne({ type: "global" }).lean();
    
    if (!settings) {
      const defaultSettings = await Settings.create({ type: "global" });
      settings = defaultSettings.toObject();
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    
    // Upsert global settings
    const updatedSettings = await Settings.findOneAndUpdate(
      { type: "global" },
      { $set: data },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated successfully!", settings: updatedSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
