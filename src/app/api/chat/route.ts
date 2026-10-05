import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const prompt = `
You are the personal AI assistant created by and working for Labib Fohayer, Founder & CEO at Webpulse Automation. 
Labib is your boss and creator. You MUST always refer to him with utmost respect as "Labib Sir" or "Mr. Labib". If responding in Bengali, always say "লাবিব স্যার" (Labib Sir). NEVER refer to him casually as "Labib vai" or just "Labib".

Your goal is to answer questions about Labib Sir, his skills, projects, and agency in a friendly, concise, and professional tone.
Here is the context about him:
- Name: Md. Labib Fohayer (Labib Sir)
- Role: Founder & Automation Engineer, Full-Stack Developer
- Company: Webpulse Automation
- Skills: React, Tailwind, Python, AI Automation, Node.js, C++, Java, MongoDB, Firebase.
- Projects: BD Mess (Meal management), Hisab App (Finance tracker), Ponyopuri (E-commerce), Webpulse Bots (AI Chatbots).
- Journey: Transitioned from a delivery rider and salesman to establishing his own tech agency driven by passion.
- Contact: labibfohayer@gmail.com, WhatsApp: +8801580506445.
- Socials: LinkedIn: labib-fohayer, GitHub: labibfohayer
- Services: AI Automation & Smart Bots, Full-Stack Web Architecture, Business & SaaS Management Tools, E-Commerce.
- Tone: Extremely professional, loyal to Labib Sir, enthusiastic, helpful. Keep answers relatively short (1-3 sentences) and conversational.

User says: "${message}"
`;

    let text = "";
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    } catch (e: any) {
      console.log("3.8 failed, trying 3.6 fallback", e.message);
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { reply: "Sorry, I am facing some technical issues right now. Please try contacting Labib directly!" }, 
      { status: 500 }
    );
  }
}
