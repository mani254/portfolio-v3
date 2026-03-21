"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import { useRef } from "react"
import SectionHeading from "../common/SectionHeading"

const stats = [
  { label: "Completed", value: "20+" },
  { label: "Tech Stack", value: "15+" },
  { label: "Code Lines", value: "100K+" },
  { label: "Cup of Tea", value: "∞" },
]

export default function ProjectIntro() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Refined parallax for performance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const glowY = useTransform(scrollYProgress, [0, 1], [-20, 20])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <section ref={containerRef} className="page-section relative -mt-1 pb-0 overflow-hidden">

      {/* Optimized Background Glow */}
      {/* <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"
      /> */}

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center space-y-8 md:space-y-12"
        >

          {/* Content: Smooth Typography Reveal */}
          <div className="space-y-4 md:space-y-6 w-full translate-z-0">
            <motion.div variants={itemVariants}>
              <SectionHeading heading="Explore" spanContent="My Projects" center={true} />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed font-medium px-4"
            >
              A showcase of innovation and precision. From complex systems to
              pixel-perfect interfaces, every project is built with passion and
              engineered for excellence.
            </motion.p>
          </div>

          {/* Compact Stats Row: Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap justify-center gap-3 md:gap-8 w-full max-w-4xl"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                className="relative w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg group transition-all duration-300 overflow-hidden"
                style={{
                  borderRadius: i % 2 === 0 ? "24% 76% 70% 30% / 30% 30% 70% 70%" : "70% 30% 30% 70% / 70% 30% 70% 30%"
                }}
              >
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full translate-y-full group-hover:translate-y-0 duration-500" />
                <h4 className="text-xl md:text-3xl font-black text-foreground relative z-10 tracking-tight">{stat.value}</h4>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center font-bold relative z-10 leading-none px-1 mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}