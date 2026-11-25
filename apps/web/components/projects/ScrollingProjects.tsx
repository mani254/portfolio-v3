"use client"

import { FormatedProject } from "@/app/projects/page"
import { getProjectColor } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

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
  const [mounted, setMounted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  const sectionRefs = useRef<HTMLDivElement[]>([])
  const imageBoxes = useRef<HTMLDivElement[]>([])
  const contentRefs = useRef<HTMLDivElement[]>([])

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
        const isLast = index === sectionRefs.current.length - 1

        ScrollTrigger.create({
          trigger: el,
          start: `top ${index === 0 ? "15%" : "50%"}`,
          end: `bottom ${isLast ? "90%" : "50%"}`,
          // markers: true,
          toggleActions: "play none none reverse",
          onEnter: () =>
            gsap.to(bgRef.current, {
              backgroundColor: getProjectColor(index).backgroundColor,
              duration: 0.2
            }),
          onEnterBack: () =>
            gsap.to(bgRef.current, {
              backgroundColor: getProjectColor(index).backgroundColor,
              duration: 0.2
            }),
          onLeave: () =>
            gsap.to(bgRef.current, {
              backgroundColor: "transparent",
              duration: 0.2
            }),
          onLeaveBack: () =>
            gsap.to(bgRef.current, {
              backgroundColor: "transparent",
              duration: 0.2
            }),
          scrub: 1
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [projects, mounted])


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
                  className="w-full h-full absolute p-8 flex items-center justify-center cursor-pointer"
                  onClick={() => router.push(`/projects/${project.slug}`)}
                  style={{
                    zIndex: projects.length - index,
                    background: getProjectColor(index).boxColor
                  }}
                >
                  <div className="image-wrapper relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <Image
                      src={project.mainImage}
                      alt={project.mainImageAlt || `${project.title} - Showcase preview`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                </div>
              ))}
            </div>
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
