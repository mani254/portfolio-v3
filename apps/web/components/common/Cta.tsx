"use client"

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { ScheduleMeetingButton } from "./ScheduleMeetingButton";
import SectionHeading from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

function CtaPro() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef1 = useRef<SVGSVGElement>(null);
  const svgRef2 = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.to(sectionRef.current, {
        y: -50,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      // SVG Path Animations (Stroke Drawing)
      [svgRef1.current, svgRef2.current].forEach((svg) => {
        const paths = svg?.querySelectorAll("path");

        paths?.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              end: "bottom 60%",
              scrub: 1,
            },
          });
        });
      });


    }, sectionRef);

    // Refresh ScrollTrigger to ensure correct calculations
    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => ctx.revert();
  }, [svgRef1, svgRef2, sectionRef]);

  return (
    <section
      ref={sectionRef}
      className="relative page-section overflow-hidden"
    >
      {/* ===== BACKGROUND ===== */}
      <div className="cta-gradient absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-20" />

      {/* ===== CONTENT ===== */}
      <div className="container max-w-5xl mx-auto px-6 text-center">

        <SectionHeading
          heading="Available for full-time roles &"
          spanContent="Freelance projects"
          breakBeforeSpan={true}
          center={true}
        />

        <p className="cta-desc mt-8 text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          I thrive on crafting dynamic web applications and delivering seamless user experiences
          with clean architecture and production-grade performance.
        </p>

        {/* ===== SVG DECORATION ===== */}
        <div className="flex justify-center gap-12 md:gap-20 mt-12 opacity-60">

          <svg
            ref={svgRef1}
            xmlns="http://www.w3.org/2000/svg"
            width="80" height="76"
            viewBox="0 0 80 76"
            fill="none"
          >
            <path d="M78.3976 2C71.9513 16.7773 50.931 50.48 10.8521 66.8129C32.1527 64.2204 69.9894 39.073 78.3976 2Z" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M1.60308 67.3314C1.60308 67.3314 24.0249 49.1838 24.0249 49.7023C24.5854 53.8503 7.76911 67.3314 7.76911 67.3314C12.814 68.1091 13.9351 68.8293 27.1079 70.1832C31.3119 71.2202 27.9487 72.0471 27.1079 71.9979C19.7274 71.5658 3.95737 71.3239 2.16362 70.7017C0.369884 70.0795 1.04254 68.1956 1.60308 67.3314Z" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <svg ref={svgRef2} xmlns="http://www.w3.org/2000/svg" width="80" height="76" viewBox="0 0 80 76" fill="none">
            <path d="M1.60241 2C8.04866 16.7773 29.069 50.48 69.1479 66.8129C47.8473 64.2204 10.0106 39.073 1.60241 2Z" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M78.3969 67.3314C78.3969 67.3314 55.9751 49.1838 55.9751 49.7023C55.4146 53.8503 72.2309 67.3314 72.2309 67.3314C67.186 68.1091 66.0649 68.8293 52.8921 70.1832C48.6881 71.2202 52.0513 72.0471 52.8921 71.9979C60.2726 71.5658 76.0426 71.3239 77.8364 70.7017C79.6301 70.0795 78.9575 68.1956 78.3969 67.3314Z" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

        </div>

        {/* ===== ACTIONS ===== */}
        <div className="cta-actions mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
          <ScheduleMeetingButton />

          <div className="flex flex-col items-center sm:items-start gap-3">
            <a
              href="mailto:msmanikanta25@gmail.com"
              className="text-sm md:text-base font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
              msmanikanta25@gmail.com
            </a>
            <a
              href="tel:+918688014415"
              className="text-sm md:text-base font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
              +91 8688014415
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaPro;