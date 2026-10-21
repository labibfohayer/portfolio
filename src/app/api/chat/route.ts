import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Fast, reliable models prioritized by response speed
const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash"
];

function getModelConfig(modelName: string) {
  const config: Record<string, any> = {
    maxOutputTokens: 500,
    temperature: 0.7
  };
  // Lite models do not support thinkingConfig, while non-lite flash models require thinkingBudget: 0 for instant responses
  if (!modelName.includes("lite")) {
    config.thinkingConfig = { thinkingBudget: 0 };
  }
  return config;
}

function getEmergencyFallback(message: string): string {
  const lower = (message || "").toLowerCase();
  if (
    lower.includes("contact") ||
    lower.includes("hire") ||
    lower.includes("যোগাযোগ") ||
    lower.includes("নাম্বার") ||
    lower.includes("number") ||
    lower.includes("phone") ||
    lower.includes("email")
  ) {
    return "আপনি সরাসরি লাবিব স্যারের সাথে হোয়াটসঅ্যাপে (+8801580506445) অথবা ইমেইলে (labibfohayer@gmail.com) যোগাযোগ করতে পারেন!";
  }
  if (
    lower.includes("skill") ||
    lower.includes("স্কিল") ||
    lower.includes("stack") ||
    lower.includes("টেকনোলজি")
  ) {
    return "লাবিব স্যার React, Next.js, Tailwind, Python, AI Automation, Node.js, MongoDB ও Firebase-এ পারদর্শী।";
  }
  if (
    lower.includes("project") ||
    lower.includes("প্রজেক্ট") ||
    lower.includes("কাজ") ||
    lower.includes("work")
  ) {
    return "লাবিব স্যারের উল্লেখযোগ্য প্রজেক্টগুলোর মধ্যে রয়েছে BD Mess, Hisab App, Ponyopuri এবং Webpulse Bots। বিস্তারিত উপরে প্রজেক্টস সেকশনে দেখতে পারেন!";
  }
  if (
    lower.includes("who") ||
    lower.includes("কে") ||
    lower.includes("about") ||
    lower.includes("লাবিব") ||
    lower.includes("labib")
  ) {
    return "লাবিব স্যার একজন দক্ষ এআই অটোমেশন ইঞ্জিনিয়ার ও ফুল-স্ট্যাক ডেভেলপার, এবং ওয়েবপালস অটোমেশন (Webpulse Automation)-এর ফাউন্ডার ও সিইও।";
  }
  return "হ্যালো! আমি লাবিব স্যারের পার্সোনাল এআই অ্যাসিস্ট্যান্ট। লাবিব স্যারের কাজ, স্কিল বা সার্ভিস সম্পর্কে জানতে আমাকে যেকোনো প্রশ্ন করতে পারেন অথবা সরাসরি WhatsApp-এ যোগাযোগ করতে পারেন!";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ reply: "হ্যালো! আমি কীভাবে আপনাকে সাহায্য করতে পারি?" });
    }

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined, returning fallback reply");
      return NextResponse.json({ reply: getEmergencyFallback(message) });
    }

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

    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: getModelConfig(modelName)
        });

        // 4.5-second timeout per candidate to guarantee fail-fast before Vercel timeout
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 4500)
        );

        const generatePromise = (async () => {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text();
        })();

        const reply = await Promise.race([generatePromise, timeoutPromise]);
        if (reply && reply.trim()) {
          return NextResponse.json({ reply: reply.trim() });
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }

    console.error("All candidate models exhausted, using emergency fallback:", lastError);
    return NextResponse.json({ reply: getEmergencyFallback(message) });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "লাবিব স্যারের সিস্টেম বর্তমানে একটু ব্যস্ত। আপনি সরাসরি ওনার সাথে WhatsApp (+8801580506445)-এ নক করতে পারেন!"
    });
  }
}
