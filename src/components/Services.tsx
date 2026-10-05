"use client";

import { motion } from "framer-motion";

const services = [
  { 
    id: "01", 
    title: "AI Automation & Smart Bots", 
    desc: "Custom AI-driven chatbots, workflow automations, and intelligent data-pipelines tailored for businesses." 
  },
  { 
    id: "02", 
    title: "Full-Stack Web Architecture", 
    desc: "Scalable, high-performance responsive web applications built with modern frontend frameworks and clean APIs." 
  },
  { 
    id: "03", 
    title: "Business & SaaS Management Tools", 
    desc: "Cloud-based utility applications automating daily accounts, billing, and resource management." 
  },
  { 
    id: "04", 
    title: "E-Commerce & Digital Infrastructure", 
    desc: "End-to-end e-commerce solutions, seamless payment integrations, inventory tracking, and client-centric UX." 
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core <span className="text-cyan-500">Capabilities.</span></h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group glass-card p-10 rounded-3xl cursor-default hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-cyan-500 font-mono text-sm mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                — {service.id}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
