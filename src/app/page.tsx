import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import GithubStats from "@/components/GithubStats";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingMusic from "@/components/FloatingMusic";
import Chatbot from "@/components/Chatbot";
import CommandPalette from "@/components/CommandPalette";
import TechMarquee from "@/components/TechMarquee";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 selection:bg-cyan-500/30 selection:text-white">
      <CommandPalette />
      <FloatingMusic />
      <Chatbot />
      <Navbar />
      <Hero />
      <TechMarquee />
      <About />
      <Skills />
      <Services />
      <Projects />
      <GithubStats />
      <Experience />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}
