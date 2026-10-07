import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by id ascending (e.g. "01", "02")
    const projects = await Project.find({}).sort({ id: 1 }).lean();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // This expects an array of all projects to replace the current ones, 
    // OR we can just handle individual updates. But since our UI manages the full array:
    const { projects } = await req.json();
    await connectToDatabase();
    
    // Clear and reinsert for simplicity (matching the previous UI approach)
    await Project.deleteMany({});
    await Project.insertMany(projects);

    return NextResponse.json({ success: true, message: "Projects updated successfully in MongoDB!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
