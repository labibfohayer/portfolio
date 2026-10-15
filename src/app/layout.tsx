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
  metadataBase: new URL("https://portfolio-orpin-rho-68.vercel.app"),
  title: "Labib Fohayer (লাবিব ফোহায়ের) | Founder & Chairman, Webpulse Automation",
  description: "Official portfolio of Labib Fohayer (লাবিব ফোহায়ের). Founder & Chairman of Webpulse Automation, Web Developer & AI Automation Engineer.",
  keywords: ["Labib Fohayer", "লাবিব ফোহায়ের", "Webpulse Automation", "AI Automation Engineer", "Web Developer", "Dhaka", "Bangladesh"],
  authors: [{ name: "Labib Fohayer", url: "https://labibfohayer.github.io" }],
  openGraph: {
    title: "Labib Fohayer (লাবিব ফোহায়ের) | Founder & Chairman",
    description: "Founder & Chairman of Webpulse Automation. Web Developer & AI Automation Engineer.",
    url: "https://portfolio-orpin-rho-68.vercel.app",
    siteName: "Labib Fohayer Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/labibfohayer",
        width: 1200,
        height: 630,
        alt: "Labib Fohayer - Founder & Chairman @ Webpulse Automation",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Labib Fohayer (লাবিব ফোহায়ের) | Founder & Chairman",
    description: "Founder & Chairman of Webpulse Automation. Web Developer & AI Automation Engineer.",
    images: ["https://avatars.githubusercontent.com/labibfohayer"],
  }
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Labib Fohayer",
  "alternateName": ["লাবিব ফোহায়ের", "Md. Labib Fohayer", "LabibFohayer"],
  "url": "https://portfolio-orpin-rho-68.vercel.app",
  "image": "https://avatars.githubusercontent.com/labibfohayer",
  "jobTitle": "Founder & Chairman",
  "worksFor": {
    "@type": "Organization",
    "name": "Webpulse Automation"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dhaka",
    "addressCountry": "Bangladesh"
  },
  "description": "Founder & Chairman of Webpulse Automation. Web Developer & AI Automation Engineer passionate about building digital products and automating business workflows.",
  "sameAs": [
    "https://labibfohayer.github.io",
    "https://linktr.ee/labibfohayer",
    "https://gravatar.com/labibfohayer",
    "https://www.linkedin.com/in/labib-fohayer",
    "https://github.com/labibfohayer",
    "https://www.youtube.com/@LabibFohayer",
    "https://x.com/labibfohayer",
    "https://www.tiktok.com/@labibfohayer"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={cn(spaceGrotesk.variable, outfit.variable, greatVibes.variable, "font-sans antialiased bg-black text-neutral-200 min-h-screen selection:bg-cyan-600/30 selection:text-cyan-200 overflow-x-hidden")}>
        <Preloader />
        <GlobalEffects />
        <EasterEgg />
        {children}
      </body>
    </html>
  );
}
