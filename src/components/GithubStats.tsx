"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { Terminal, Github } from "lucide-react";

const GitHubCalendar = dynamic(() => import("react-github-calendar").then(mod => mod.GitHubCalendar), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[160px] w-full max-w-[800px] bg-cyan-950/20 rounded-xl border border-cyan-500/20"></div>
});

const TerminalWindow = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="w-full h-full rounded-2xl overflow-hidden border border-cyan-500/20 bg-black/80 shadow-[0_0_30px_rgba(6,182,212,0.05)] backdrop-blur-md flex flex-col group hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-500">
    <div className="flex items-center px-4 py-2.5 bg-cyan-950/30 border-b border-cyan-500/20 group-hover:bg-cyan-900/30 transition-colors">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
        <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
      </div>
      <div className="mx-auto text-[10px] font-mono text-cyan-500/70 flex items-center gap-2 tracking-widest uppercase group-hover:text-cyan-400 transition-colors">
        <Terminal size={12} /> {title}
      </div>
    </div>
    <div className="p-6 flex-grow flex items-center justify-center relative overflow-hidden">
      {children}
    </div>
  </div>
);

const GithubGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 400 * 2,
      height: 400 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0, 0, 0],
      markerColor: [0.023, 0.713, 0.831], // cyan-500 rgb(6,182,212) -> normalized
      glowColor: [0.023, 0.713, 0.831],
      markers: [
        { location: [23.8103, 90.4125], size: 0.1 }, // Dhaka
        { location: [37.7749, -122.4194], size: 0.05 }, // SF
        { location: [51.5074, -0.1278], size: 0.05 }, // London
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });
    return () => globe.destroy();
  }, []);

  return (
    <div className="w-full flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-700">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "auto", maxWidth: 300, aspectRatio: "1/1" }}
        className="drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]"
      />
    </div>
  );
};

export default function GithubStats() {
  const customTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#0f172a', '#164e63', '#0891b2', '#06b6d4', '#22d3ee']
  };

  const username = "labibfohayer";
  
  // Custom Hacker Theme URL Parameters
  const themeParams = "bg_color=00000000&title_color=06b6d4&text_color=a3a3a3&icon_color=06b6d4&border_color=00000000&hide_border=true";
  
  const statsUrl = `https://github-readme-stats.shion.dev/api?username=${username}&${themeParams}&include_all_commits=true&count_private=true`;
  const langsUrl = `https://github-readme-stats.shion.dev/api/top-langs/?username=${username}&${themeParams}&layout=compact`;
  const streakUrl = `https://streak-stats.demolab.com/?user=${username}&background=00000000&border=00000000&hide_border=true&stroke=06b6d4&ring=06b6d4&fire=06b6d4&currStreakNum=06b6d4&currStreakLabel=a3a3a3&sideNums=a3a3a3&sideLabels=a3a3a3&dates=a3a3a3`;

  return (
    <section id="github-stats" className="py-32 relative z-10 bg-[black]">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            OPEN SOURCE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
            GLOBAL <span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">CONTRIBUTIONS</span>
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-6 leading-relaxed">
            Tracking my engineering impact across open-source ecosystems, global commits, and continuous deployment streaks.
          </p>
        </motion.div>

        {/* Top 3 Column Grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-stretch mb-12">
          
          {/* Left: Overall Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:col-span-1 h-full"
          >
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
              <TerminalWindow title="~/github_stats.sh">
                <img 
                  src={statsUrl} 
                  alt="GitHub Stats" 
                  className="w-full h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500"
                />
              </TerminalWindow>
            </Tilt>
          </motion.div>

          {/* Middle: 3D Globe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full lg:col-span-1 h-full min-h-[300px]"
          >
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
              <TerminalWindow title="~/open_source_network.exe">
                <GithubGlobe />
              </TerminalWindow>
            </Tilt>
          </motion.div>
          
          {/* Right: Streaks & Top Langs Stacked */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full lg:col-span-1 flex flex-col gap-6 h-full"
          >
            <div className="flex-1">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                <TerminalWindow title="~/streak_tracker.sh">
                  <img 
                    src={streakUrl} 
                    alt="GitHub Streak" 
                    className="w-full h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500"
                  />
                </TerminalWindow>
              </Tilt>
            </div>
            <div className="flex-1">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                <TerminalWindow title="~/top_langs.json">
                  <img 
                    src={langsUrl} 
                    alt="Top Languages" 
                    className="w-full h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500"
                  />
                </TerminalWindow>
              </Tilt>
            </div>
          </motion.div>

        </div>

        {/* Bottom Wide Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative group w-full max-w-[1000px] mx-auto"
        >
          {/* Animated Neon Running Border Effect */}
          <div className="absolute -inset-[2px] rounded-3xl bg-[linear-gradient(90deg,#06b6d4,transparent,#06b6d4)] bg-[length:200%_100%] animate-[slide_3s_linear_infinite] opacity-30 group-hover:opacity-100 blur-[2px] transition-all duration-500" />
          <div className="absolute -inset-[2px] rounded-3xl bg-cyan-500 opacity-0 group-hover:opacity-20 blur-[10px] transition-all duration-500" />
          
          <div className="relative glass-card p-6 md:p-10 rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center bg-black/90 backdrop-blur-xl">
            <h3 className="text-xl font-display font-bold mb-8 text-white text-center flex items-center gap-3 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> 
              CONTRIBUTION HEATMAP
            </h3>
            <div className="w-full overflow-x-auto pb-4 flex justify-center text-neutral-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <GitHubCalendar 
                username={username} 
                colorScheme="dark"
                theme={customTheme}
                blockSize={14}
                blockMargin={5}
                fontSize={14}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
