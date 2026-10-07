import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

const defaultProjects = [
  {
    id: "01", title: "WEBPULSE AUTOMATION", role: "AGENCY PLATFORM & AUTOMATION",
    desc: "A scalable tech agency platform offering custom web development and smart workflow automations to help businesses scale effortlessly.",
    tech: ["NEXT.JS", "REACT", "TAILWIND CSS", "AUTOMATION"], image: "/projects/webpulse.png",
    contributions: ["Architected the entire agency landing page and service workflows.", "Integrated automated pipelines for lead generation and business scaling.", "Engineered ultra-fast UI with modern glassmorphism and animations."], liveUrl: "#", githubUrl: "#"
  },
  {
    id: "02", title: "AL MADINA MADRASA", role: "INSTITUTIONAL WEBSITE & MANAGEMENT",
    desc: "Complete digital presence and automation foundation for Al Madina Model Madrasa & Research Institute.",
    tech: ["REACT", "TAILWIND", "NODE.JS", "DATABASE"], image: "/projects/al-madina.png",
    contributions: ["Built a highly responsive and fast public-facing institutional website.", "Set up the foundational architecture for student and staff data routing.", "Modernized the digital branding and online admission processes."], liveUrl: "#", githubUrl: "#"
  },
  {
    id: "03", title: "MADRASA OS", role: "INSTITUTIONAL OPERATING SYSTEM",
    desc: "A comprehensive management dashboard for madrasas covering student tracking, attendance, fees, staff payroll, and daily operations.",
    tech: ["FULL-STACK", "DASHBOARD UI", "API ARCHITECTURE", "SECURITY"], image: "/projects/madrasa-os.png",
    contributions: ["Engineered a centralized dashboard for managing 1000+ students and staff.", "Automated complex fee collection, daily accounting, and attendance tracking.", "Built role-based access control (RBAC) for admins, teachers, and parents."], liveUrl: "#", githubUrl: "#"
  },
  {
    id: "04", title: "BD MESS", role: "SMART LIVING & MEAL MANAGEMENT SYSTEM",
    desc: "A modern, high-craft living platform featuring automated utility splitting, meal calculation, and streamlined resident management flow.",
    tech: ["REACT.JS", "TAILWIND CSS", "FIREBASE", "ALGORITHMS"], image: "/projects/bd-mess.jpg",
    contributions: ["Architected an interactive dashboard with instant metrics and state persistence.", "Engineered responsive visual aesthetics with fluid mobile-first UX.", "Optimized build pipeline and automated complex billing calculations."], liveUrl: "#", githubUrl: "#"
  },
  {
    id: "05", title: "EXPENSE TRACKER", role: "FINANCIAL ANALYTICS & ACCOUNTING",
    desc: "Production financial tracking and analytics platform featuring daily safe limits, digital vaults, and real-time computation.",
    tech: ["NEXT.JS", "TYPESCRIPT", "REST API", "FRAMER MOTION"], image: "/projects/expense.jpg",
    contributions: ["Built resilient microservices architecture for safe expense tracking.", "Engineered dynamic real-time expenditure charts with category breakdown.", "Ensured 99.9% uptime with zero-friction database communication."], liveUrl: "#", githubUrl: "#"
  },
  {
    id: "06", title: "PONYOPURI E-COMMERCE", role: "SCALABLE DIGITAL STOREFRONT",
    desc: "Custom high-performance storefront that handles inventory management and direct WhatsApp ordering workflows.",
    tech: ["E-COMMERCE", "NODE.JS", "PAYMENT GATEWAYS", "REACT"], image: "/projects/ponyopuri.png",
    contributions: ["Orchestrated seamless checkout flows with instant WhatsApp conversion.", "Created highly optimized product grids with sub-second render speeds.", "Designed responsive mobile layout ensuring max conversion rates."], liveUrl: "#", githubUrl: "#"
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear and insert
    await Project.deleteMany({});
    await Project.insertMany(defaultProjects);

    return NextResponse.json({ success: true, message: "Database successfully seeded with 6 projects!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
