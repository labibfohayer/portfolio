import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

// Fetch all messages for the admin panel
export async function GET() {
  try {
    await connectToDatabase();
    const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Submit a new message from the contact form
export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const newMessage = await Message.create({ name, email, message });
    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Mark message as read
export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();
    
    await Message.findByIdAndUpdate(id, { read: true });
    return NextResponse.json({ success: true, message: "Message marked as read" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
