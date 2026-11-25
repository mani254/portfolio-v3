"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Mail, Phone } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ResponsiveOverlay } from "./ResponsiveOverlay";
import { ScheduleMeetingForm } from "./ScheduleMeetingForm";
import SectionHeader, { HighlightPill } from "./SectionHeader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CtaPro() {
  const [meetingOpen, setMeetingOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef1 = useRef<SVGSVGElement>(null);
  const svgRef2 = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SVG stroke drawing animation
      [svgRef1.current, svgRef2.current].forEach((svg) => {
        const paths = svg?.querySelectorAll("path");
        paths?.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "bottom 70%",
              scrub: 1,
            },
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="unique-section relative overflow-hidden text-center"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          badge="GET IN TOUCH"
          badgeDot={true}
          center={true}
          title={
            <>
              Available for full-time roles &{" "}
              <HighlightPill variant="green">freelance projects.</HighlightPill>
            </>
          }
        />

        <p className="mt-4 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto font-normal leading-relaxed">
          Whether you&apos;re building a new product from zero or need high-impact engineering
          for your team — let&apos;s team up and create something users will truly love.
        </p>

        {/* SVG Animated Flourishes */}
        <div className="flex justify-center gap-10 md:gap-16 mt-8 sm:mt-10 opacity-60 pointer-events-none select-none">
          <svg
            ref={svgRef1}
            xmlns="http://www.w3.org/2000/svg"
            width="68"
            height="64"
            viewBox="0 0 80 76"
            fill="none"
            className="text-[#111827]"
          >
            <path
              d="M78.3976 2C71.9513 16.7773 50.931 50.48 10.8521 66.8129C32.1527 64.2204 69.9894 39.073 78.3976 2Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M1.60308 67.3314C1.60308 67.3314 24.0249 49.1838 24.0249 49.7023C24.5854 53.8503 7.76911 67.3314 7.76911 67.3314C12.814 68.1091 13.9351 68.8293 27.1079 70.1832C31.3119 71.2202 27.9487 72.0471 27.1079 71.9979C19.7274 71.5658 3.95737 71.3239 2.16362 70.7017C0.369884 70.0795 1.04254 68.1956 1.60308 67.3314Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          <svg
            ref={svgRef2}
            xmlns="http://www.w3.org/2000/svg"
            width="68"
            height="64"
            viewBox="0 0 80 76"
            fill="none"
            className="text-[#111827]"
          >
            <path
              d="M1.60241 2C8.04866 16.7773 29.069 50.48 69.1479 66.8129C47.8473 64.2204 10.0106 39.073 1.60241 2Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M78.3969 67.3314C78.3969 67.3314 55.9751 49.1838 55.9751 49.7023C55.4146 53.8503 72.2309 67.3314 72.2309 67.3314C67.186 68.1091 66.0649 68.8293 52.8921 70.1832C48.6881 71.2202 52.0513 72.0471 52.8921 71.9979C60.2726 71.5658 76.0426 71.3239 77.8364 70.7017C79.6301 70.0795 78.9575 68.1956 78.3969 67.3314Z"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Action Row */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {/* Primary Schedule Button */}
          <button
            type="button"
            onClick={() => setMeetingOpen(true)}
            className="hover-link group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-[#111827] text-white hover:bg-black hover:scale-[1.02] active:scale-95 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg ring-1 ring-white/10 cursor-pointer select-none"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <Calendar className="w-4 h-4 text-white shrink-0" />
            <span>Schedule a Meeting</span>
          </button>

          {/* Direct Contact Links */}
          <div className="flex flex-col items-center sm:items-start gap-2.5 text-xs sm:text-sm font-medium">
            <a
              href="mailto:manifreelancer25@gmail.com"
              className="hover-link text-[#4b5563] hover:text-[#111827] transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              <span>manifreelancer25@gmail.com</span>
            </a>

            <a
              href="tel:+918688014415"
              className="hover-link text-[#4b5563] hover:text-[#111827] transition-colors flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-[#111827] transition-colors" />
              <Phone className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              <span>+91 8688014415</span>
            </a>
          </div>
        </div>
      </div>

      {/* Meeting Booking Modal */}
      <ResponsiveOverlay
        open={meetingOpen}
        onOpenChange={setMeetingOpen}
        title="Schedule a 30-Min Call"
        description="Pick a convenient slot on the calendar. An automatic Google Meet link will be emailed to you."
        className="p-2 sm:p-6 bg-white"
        drawerClassName="h-[92vh]"
      >
        <ScheduleMeetingForm onSuccess={() => setMeetingOpen(false)} />
      </ResponsiveOverlay>
    </section>
  );
}