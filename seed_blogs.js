const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://labibfohayer_db_user:806rbfYNz4074cMI@cluster0.rsujika.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0";

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  coverImage: String,
  published: Boolean,
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

const defaultBlogs = [
  {
    title: "How I Automated 80% of Client Support with Python & AI",
    slug: "automated-client-support-ai",
    excerpt: "Customer support is the backbone of any business, but handling repetitive queries can drain a team's energy. At Webpulse Automation, I noticed many of our clients were struggling...",
    content: "Customer support is the backbone of any business, but handling repetitive queries can drain a team's energy. At Webpulse Automation, I noticed many of our clients were struggling to keep up with 24/7 customer inquiries. That's when I built \"Webpulse Bots.\"\n\nUsing Python and advanced AI models, I engineered a smart chatbot capable of understanding natural language and context. It wasn't just about keyword matching; the AI was trained on specific business data to provide accurate, human-like responses.\n\nThe result? The bot successfully resolved 80% of routine client queries automatically. Human agents were freed up to focus on complex issues, drastically reducing response times from hours to seconds. This is the power of AI automation—it doesn't replace humans; it empowers them.",
    coverImage: "/blog/blog-1.jpg",
    published: true,
  },
  {
    title: "From Delivery Rider to Tech Founder: My Journey",
    slug: "delivery-rider-to-tech-founder",
    excerpt: "A few years ago, my daily routine consisted of navigating city traffic as a delivery rider and working as a salesman. Life was a constant grind, but I had a burning passion for technology...",
    content: "A few years ago, my daily routine consisted of navigating city traffic as a delivery rider and working as a salesman. Life was a constant grind, but I had a burning passion for technology. Between deliveries and late-night shifts, I started learning how to code.\n\nThere were countless nights of frustration, staring at bugs I couldn't fix, but the dream of building something of my own kept me going. I mastered React, Python, and full-stack development step by step.\n\nToday, I am proud to be the Founder and CEO of Webpulse Automation. We build scalable software and AI solutions for businesses. Looking back, the discipline I learned on the streets as a rider gave me the resilience needed to survive in the tech industry. Never let your current situation dictate your future.",
    coverImage: "/blog/blog-2.jpg",
    published: true,
  },
  {
    title: "Scaling Full-Stack Apps with Next.js & Supabase",
    slug: "scaling-nextjs-supabase",
    excerpt: "When building 'Hisab App' (a financial tracker) and 'Ponyopuri' (an e-commerce storefront), speed and scalability were my top priorities. That's why I chose Next.js and Supabase...",
    content: "When building \"Hisab App\" (a financial tracker) and \"Ponyopuri\" (an e-commerce storefront), speed and scalability were my top priorities. That's why I chose Next.js and Supabase as my core stack.\n\nNext.js provides excellent Server-Side Rendering (SSR), ensuring that the applications load instantly and rank highly on search engines. Supabase, as an open-source Firebase alternative, gave me the power of a robust PostgreSQL database with real-time capabilities.\n\nOne of the biggest challenges was handling complex relational data for accounting without slowing down the UI. By leveraging Next.js API routes and Supabase's powerful querying, I managed to create a seamless, high-speed experience. Choosing the right architecture from day one is the secret to building apps that scale effortlessly.",
    coverImage: "/blog/blog-3-new.jpg",
    published: true,
  },
  {
    title: "The Future of Business: AI-Powered Customer Support",
    slug: "ai-powered-customer-support",
    excerpt: "Imagine this: It's 3:00 AM, and a potential customer visits your website with a question. By the time your team wakes up to reply at 9:00 AM, the customer has already bought from a competitor...",
    content: "Imagine this: It's 3:00 AM, and a potential customer visits your website with a question. By the time your team wakes up to reply at 9:00 AM, the customer has already bought from a competitor. This is the reality for businesses without AI support.\n\nAI-powered customer support is no longer a luxury; it's a necessity. Modern AI bots do more than just say \"Hello.\" They can analyze inventory, process orders, and provide personalized recommendations in real time.\n\nAt Webpulse Automation, we integrate these smart agents directly into your workflow. Investing in an AI chatbot means your business is open 24/7, catching leads while you sleep. The future of business belongs to those who adapt to automation today.",
    coverImage: "/blog/blog-4.jpg",
    published: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");
    await Blog.deleteMany({});
    await Blog.insertMany(defaultBlogs);
    console.log("Blogs seeded successfully");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
