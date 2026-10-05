"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(() => import("react-github-calendar").then(mod => mod.GitHubCalendar), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[160px] w-full max-w-[800px] bg-slate-900/50 rounded-xl"></div>
});

export default function GithubStats() {
  const customTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#334155', '#164e63', '#0891b2', '#06b6d4', '#22d3ee']
  };

  return (
    <section id="github-stats" className="py-24 relative z-10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Open Source <span className="text-cyan-500">Contributions.</span></h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">My live GitHub statistics, streaks, and top programming languages.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
              <img 
                src="https://github-readme-stats.shion.dev/api?username=labibfohayer&theme=radical&hide_border=false&include_all_commits=false&count_private=false" 
                alt="GitHub Stats" 
                className="w-full rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] border border-white/10"
              />
            </Tilt>
          </motion.div>
          
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
                <img 
                  src="https://streak-stats.demolab.com/?user=labibfohayer&theme=radical&hide_border=false" 
                  alt="GitHub Streak" 
                  className="w-full rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] border border-white/10"
                />
              </Tilt>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000}>
                <img 
                  src="https://github-readme-stats.shion.dev/api/top-langs/?username=labibfohayer&theme=radical&hide_border=false&include_all_commits=false&count_private=false&layout=compact" 
                  alt="Top Languages" 
                  className="w-full rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] border border-white/10"
                />
              </Tilt>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 glass-card p-6 md:p-8 rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center"
        >
          <h3 className="text-xl font-bold mb-8 text-white text-center">Daily Commit Graph</h3>
          <div className="w-full overflow-x-auto pb-4 flex justify-center text-neutral-300">
            <GitHubCalendar 
              username="labibfohayer" 
              colorScheme="dark"
              theme={customTheme}
              blockSize={14}
              blockMargin={5}
              fontSize={14}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
