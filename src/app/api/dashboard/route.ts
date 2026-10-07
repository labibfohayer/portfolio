import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Message from "@/models/Message";

export async function GET() {
  try {
    await connectToDatabase();
    
    const totalProjects = await Project.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });
    
    // We don't have a real tracking system yet, so we return a placeholder or 0
    const profileViews = "Active"; 

    // Fetch the 4 most recent messages for the activity log
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    const activity = recentMessages.map((msg: any) => ({
      msg: `New message received from '${msg.name}'`,
      time: new Date(msg.createdAt).toLocaleString(),
      type: "msg"
    }));

    // Add a system log at the end
    activity.push({
      msg: "System online and securely connected to MongoDB",
      time: new Date().toLocaleString(),
      type: "sys"
    });

    return NextResponse.json({ 
      success: true, 
      stats: {
        totalProjects,
        unreadMessages,
        profileViews
      },
      activity 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
