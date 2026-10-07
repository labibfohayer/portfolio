import type { Metadata } from "next";
import { Space_Grotesk, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import GlobalEffects from "@/components/GlobalEffects";
import EasterEgg from "@/components/EasterEgg";
import Preloader from "@/components/Preloader";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-signature" });

export const metadata: Metadata = {
  title: "Md. Labib Fohayer | Founder & AI Automation Engineer",
  description: "Award-winning interactive portfolio of Md. Labib Fohayer. Built for Scale & Precision.",
  openGraph: {
    title: "Md. Labib Fohayer | Tech Founder",
    description: "Building scalable automation solutions and intelligent digital platforms.",
    url: "https://labibfohayer.com",
    siteName: "Md. Labib Fohayer Portfolio",
    images: [
      {
        url: "/profile-ceo.jpg",
        width: 1200,
        height: 630,
        alt: "Md. Labib Fohayer - Founder & CEO @ Webpulse Automation",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Labib Fohayer | Tech Founder",
    description: "Building scalable automation solutions and intelligent digital platforms.",
    images: ["/profile-ceo.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={cn(spaceGrotesk.variable, outfit.variable, greatVibes.variable, "font-sans antialiased bg-black text-neutral-200 min-h-screen selection:bg-cyan-600/30 selection:text-cyan-200 overflow-x-hidden")}>
        <Preloader />
        <GlobalEffects />
        <EasterEgg />
        {children}
      </body>
    </html>
  );
}
