"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import SectionHeading from "../common/SectionHeading"

const stats = [
  { label: "Completed", value: "20+", delay: 0 },
  { label: "Tech Stack", value: "15+", delay: 0.1 },
  { label: "Code Lines", value: "100K+", delay: 0.2 },
  { label: "Cup of Tea", value: "∞", delay: 0.3 },
]

export default function ProjectIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -40])

  return (
    <section ref={containerRef} className="page-section relative -mt-1">

      {/* Subtle Background Glow */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[400px] bg-primary/5 blur-[100px] rounded-full"
      />

      <div className="container">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">

          {/* Content: Kinetic Typography */}
          <div className="space-y-4 md:space-y-6 w-full">

            <SectionHeading heading="Explore" spanContent="My Projects" center={true}></SectionHeading>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed font-medium px-4"
            >
              A showcase of innovation and precision. From complex systems to
              pixel-perfect interfaces, every project is built with passion and
              engineered for excellence.
            </motion.p>
          </div>

          {/* Compact Stats Row: Organic Shapes in a Single Line */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-8 w-full max-w-4xl">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: stat.delay,
                  type: "spring",
                  stiffness: 120,
                  damping: 18
                }}
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 3 : -3 }}
                className="relative w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg group transition-all duration-300"
                style={{
                  borderRadius: i % 2 === 0 ? "20% 80% 80% 20% / 20% 20% 80% 80%" : "75% 25% 25% 75% / 75% 25% 75% 25%"
                }}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <h4 className="text-lg md:text-2xl font-black text-foreground relative z-10">{stat.value}</h4>
                <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground text-center font-bold relative z-10 leading-none px-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}