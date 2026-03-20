"use client"

import { FormatedProject } from "@/app/projects/page"
import { cn, getProjectColor } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import ProjectContent from "./ProjectContent"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  projects: FormatedProject[]
}

export default function ScrollingProjects({ projects }: Props) {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const currentTheme = mounted ? (resolvedTheme || theme || "light") : "light"

  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  const sectionRefs = useRef<HTMLDivElement[]>([])
  const imageBoxes = useRef<HTMLDivElement[]>([])
  const contentRefs = useRef<HTMLDivElement[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const xTo = useRef<((value: number) => void) | null>(null)
  const yTo = useRef<((value: number) => void) | null>(null)

  useEffect(() => {
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 })
      xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.35, ease: "power2.out" })
      yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.35, ease: "power2.out" })
    }
  }, [mounted])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (xTo.current && yTo.current) {
      xTo.current(e.clientX)
      yTo.current(e.clientY)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // COLOR CHANGE (same as services)
  useEffect(() => {
    if (!mounted) return

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el, index) => {
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          toggleActions: "play none none reverse",
          onEnter: () =>
            gsap.to(bgRef.current, {
              backgroundColor: getProjectColor(index, currentTheme).backgroundColor,
              duration: 0.5
            }),
          onEnterBack: () =>
            gsap.to(bgRef.current, {
              backgroundColor: getProjectColor(index, currentTheme).backgroundColor,
              duration: 0.5
            }),
          onLeave: () =>
            gsap.to(bgRef.current, {
              backgroundColor: "transparent",
              duration: 0.5
            }),
          onLeaveBack: () =>
            gsap.to(bgRef.current, {
              backgroundColor: "transparent",
              duration: 0.5
            }),
          scrub: 1
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [projects, currentTheme, mounted])


  // IMAGE ANIMATION (same as services)
  useEffect(() => {
    if (!mounted) return
    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((el, index) => {
        const isLast = index === sectionRefs.current.length - 1
        if (!el || !imageBoxes.current[index] || isLast) return
        const imageWrapper =
          imageBoxes.current[index].querySelector(".image-wrapper")
        if (!imageWrapper) return
        gsap.fromTo(
          imageWrapper,
          { y: "10px" },
          {
            y: "0px",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              end: "top 20%",
              scrub: true
            }
          }
        )
        gsap.fromTo(
          imageBoxes.current[index],
          { clipPath: "inset(0px 0px 0%)" },
          {
            clipPath: "inset(0px 0px 100%)",
            scrollTrigger: {
              trigger: el,
              start: "bottom 85%",
              end: "bottom 0%",
              scrub: true
            }
          }
        )
      })
    }, containerRef)
    return () => ctx.revert()
  }, [projects, mounted])


  // TEXT ANIMATION
  useEffect(() => {
    if (!mounted) return
    const ctx = gsap.context(() => {
      contentRefs.current.forEach((el) => {
        if (!el) return
        gsap.to(el, {
          y: "-50",
          scrollTrigger: {
            trigger: el,
            start: "top 0%",
            end: "top 50%",
            scrub: true
          }
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [projects, mounted])

  if (!mounted) return <div className="min-h-screen" />

  return (
    <div>
      <div ref={bgRef} className="w-full h-full fixed inset-0 transition-colors duration-500 -z-10 overflow-hidden"></div>
      <div
        ref={containerRef}
        className="flex relative container gap-5"
      >
        {/* LEFT IMAGE STACK */}
        <div className="w-[55%]">
          <div className="h-screen sticky top-0 flex items-center justify-center">
            <div className="w-full aspect-16/12 rounded-3xl relative overflow-hidden">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  ref={(el) => { if (el) imageBoxes.current[index] = el }}
                  className="w-full h-full absolute p-8 flex items-center justify-center cursor-none"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onMouseMove={handleMouseMove}
                  onClick={() => router.push(`/projects/${project.slug}`)}
                  style={{
                    zIndex: projects.length - index,
                    background: getProjectColor(index, currentTheme).boxColor
                  }}
                >
                  <div className="image-wrapper relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 dark:bg-black/20 bg-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CUSTOM CURSOR */}
        <div
          ref={cursorRef}
          className={cn(
            "fixed pointer-events-none z-100 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 ease-out",
            hoveredIndex !== null ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
          style={{
            left: 0,
            top: 0,
            width: "80px",
            height: "80px",
            backgroundColor: hoveredIndex !== null
              ? `${getProjectColor(hoveredIndex, currentTheme).cursorColor}44`
              : "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(16px)",
            border: `1.5px solid ${hoveredIndex !== null ? getProjectColor(hoveredIndex, currentTheme).cursorColor : "rgba(255, 255, 255, 0.4)"}`,
            boxShadow: hoveredIndex !== null
              ? `0 0 50px ${getProjectColor(hoveredIndex, currentTheme).cursorColor}44`
              : "none",
            transformOrigin: "center center"
          }}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <span
              className="text-xs font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center"
            >
              View <br /> Details
            </span>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-[45%]">
          {projects.map((project, index) => (
            <div
              key={project._id}
              ref={(el) => { if (el) sectionRefs.current[index] = el }}
              className="flex items-center justify-center h-screen"
            >
              <div
                className="space-y-6 max-w-[380px]"
                ref={(el) => { if (el) contentRefs.current[index] = el }}
              >
                <ProjectContent project={project} index={index} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
