import type { Metadata } from "next";
import { Space_Grotesk, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import GlobalEffects from "@/components/GlobalEffects";
import EasterEgg from "@/components/EasterEgg";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-signature" });

export const metadata: Metadata = {
  metadataBase: new URL("https://labibfohayer.vercel.app"),
  alternates: {
    canonical: "https://labibfohayer.vercel.app",
  },
  title: "Labib Fohayer (লাবিব ফোহায়ের) | Founder & Chairman, Webpulse Automation",
  description: "লাবিব ফোহায়ের (Labib Fohayer) বাংলাদেশের অন্যতম শীর্ষ তরুণ ওয়েব ডেভেলপার ও এআই অটোমেশন ইঞ্জিনিয়ার। মাত্র ২১ বছর বয়সে তিনি ওয়েবপালস অটোমেশনের প্রতিষ্ঠাতা হিসেবে সুবিশাল সাফল্য অর্জন করেছেন। Leading young Web Developer & AI Automation Engineer in Bangladesh.",
  keywords: ["Labib Fohayer", "লাবিব ফোহায়ের", "Webpulse Automation", "AI Automation Engineer", "Web Developer", "Bangladesh", "Tech Founder"],
  authors: [{ name: "Labib Fohayer", url: "https://labibfohayer.github.io" }],
  openGraph: {
    title: "Labib Fohayer (লাবিব ফোহায়ের) | Founder & Chairman",
    description: "লাবিব ফোহায়ের (Labib Fohayer) বাংলাদেশের অন্যতম শীর্ষ তরুণ ওয়েব ডেভেলপার ও এআই অটোমেশন ইঞ্জিনিয়ার। Founder & Chairman of Webpulse Automation.",
    url: "https://labibfohayer.vercel.app",
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
    description: "লাবিব ফোহায়ের (Labib Fohayer) বাংলাদেশের অন্যতম শীর্ষ তরুণ ওয়েব ডেভেলপার ও এআই অটোমেশন ইঞ্জিনিয়ার। Founder & Chairman of Webpulse Automation.",
    images: ["https://avatars.githubusercontent.com/labibfohayer"],
  }
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Labib Fohayer",
  "alternateName": ["লাবিব ফোহায়ের", "Md. Labib Fohayer", "LabibFohayer"],
  "url": "https://labibfohayer.vercel.app",
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
  "description": "লাবিব ফোহায়ের (Labib Fohayer) বাংলাদেশের অন্যতম শীর্ষ তরুণ ওয়েব ডেভেলপার ও এআই অটোমেশন ইঞ্জিনিয়ার। মাত্র ২১ বছর বয়সে তিনি ওয়েবপালস অটোমেশন (Webpulse Automation)-এর প্রতিষ্ঠাতা হিসেবে আধুনিক সফটওয়্যার ও কৃত্রিম বুদ্ধিমত্তা (AI) খাতে সুবিশাল সাফল্য অর্জন করেছেন। One of the leading young Web Developers and AI Automation Engineers in Bangladesh.",
  "disambiguatingDescription": "Prominent Bangladeshi Web Developer, AI Automation Engineer, and Founder & Chairman of Webpulse Automation",
  "sameAs": [
    "https://labibfohayer.github.io",
    "https://linktr.ee/labibfohayer",
    "https://gravatar.com/labibfohayer",
    "https://www.linkedin.com/in/labib-fohayer",
    "https://www.facebook.com/labibfohayer",
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
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={cn(spaceGrotesk.variable, outfit.variable, greatVibes.variable, "font-sans antialiased bg-black text-neutral-200 min-h-screen selection:bg-cyan-600/30 selection:text-cyan-200 overflow-x-clip")}>
        <Preloader />
        <GlobalEffects />
        <EasterEgg />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
