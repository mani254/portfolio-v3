"use client"

import { FormatedProject } from "@/app/projects/page"
import { getProjectColor } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef } from "react"
import ProjectContent from "./ProjectContent"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  projects: FormatedProject[]
}

export default function ScrollingProjects({ projects }: Props) {

  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  const sectionRefs = useRef<HTMLDivElement[]>([])
  const imageBoxes = useRef<HTMLDivElement[]>([])
  const contentRefs = useRef<HTMLDivElement[]>([])

  // COLOR CHANGE (same as services)
  useEffect(() => {
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
              backgroundColor: getProjectColor(index).backgroundColor,
              duration: 0.5
            }),
          onEnterBack: () =>
            gsap.to(bgRef.current, {
              backgroundColor: getProjectColor(index).backgroundColor,
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
  }, [projects])


  // IMAGE ANIMATION (same as services)
  useEffect(() => {
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
  }, [projects])


  // TEXT ANIMATION
  useEffect(() => {
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
  }, [projects])

  return (
    <div ref={bgRef} className="transition-colors duration-500">
      <div
        ref={containerRef}
        className="flex relative max-w-7xl container m-auto gap-5"
      >
        {/* LEFT IMAGE STACK */}
        <div className="w-[55%]">
          <div className="h-screen sticky top-0 flex items-center justify-center">
            <div className="w-full aspect-16/12 rounded-3xl relative overflow-hidden">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  ref={(el) => { if (el) imageBoxes.current[index] = el }}
                  className="w-full h-full absolute p-8 flex items-center justify-center"
                  style={{
                    zIndex: projects.length - index,
                    background: getProjectColor(index).boxColor
                  }}
                >
                  <div className="image-wrapper relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
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