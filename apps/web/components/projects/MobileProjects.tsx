"use client"

import { FormatedProject } from "@/app/projects/page"
import { getProjectColor } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import ProjectContent from "./ProjectContent"

interface Props {
  projects: FormatedProject[]
}

export default function MobileProjects({ projects }: Props) {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const currentTheme = mounted ? (resolvedTheme || theme || "light") : "light"

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-12 container">
      {projects.map((project, index) => {
        const colors = getProjectColor(index, currentTheme)

        return (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group relative"
          >
            {/* Background Accent */}
            <div
              className="absolute -inset-2 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
              style={{ backgroundColor: colors.boxColor }}
            />

            <div className="relative space-y-6 overflow-hidden rounded-4xl border border-white/10 bg-white/5 dark:bg-black/20 p-4 backdrop-blur-sm shadow-2xl">
              {/* Project Image Container */}
              <div
                className="relative aspect-16/10 w-full overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => router.push(`/projects/${project.slug}`)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  className="h-full w-full"
                >
                  <Image
                    src={project.mainImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                </motion.div>

                {/* Tag/Category or Index */}
                <div className="absolute top-4 left-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Project Content */}
              <div className="px-2 pb-2 space-y-4">
                <ProjectContent project={project} index={index} isMobile={true} />

                <Button
                  onClick={() => router.push(`/projects/${project.slug}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl  text-sm font-semibold transition-all duration-300 active:scale-95 py-4"
                >
                  View Project Details
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
