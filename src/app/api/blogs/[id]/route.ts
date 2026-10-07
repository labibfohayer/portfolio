import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";

// Update a blog
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    
    // Auto-generate slug if title changed and no slug provided
    if (data.title && !data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    await connectToDatabase();
    const updatedBlog = await Blog.findByIdAndUpdate(params.id, data, { new: true });
    
    if (!updatedBlog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Delete a blog
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deletedBlog = await Blog.findByIdAndDelete(params.id);
    
    if (!deletedBlog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
