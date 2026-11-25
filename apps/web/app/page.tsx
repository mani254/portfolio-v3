import CtaPro from "@/components/common/Cta";
import ExperienceSection from "@/components/common/ExperienceSection";
import FeaturedWorkSection from "@/components/common/FeaturedWorkSection";
import Skills from "@/components/common/Skills";
import SmoothScroll from "@/components/common/SmoothScroll";
import { Cpu, Download, Layers, Mail, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getAllExperiences, getAllProjects, getAllTechnologies, getResume } from "sanity-lib";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sai Manikanta — Full-Stack Developer",
  description:
    "Full-stack developer with 3+ years of experience building scalable web applications and seamless user experiences.",
};

const STANDOUT_POINTS = [
  {
    icon: Layers,
    text: "I like building things from both sides of the screen.",
  },
  {
    icon: Cpu,
    text: "The experience people see, and the systems quietly making it work underneath.",
  },
  {
    icon: ShieldCheck,
    text: "I care about building things well — clean structure, thoughtful decisions, and systems that can grow without becoming complicated.",
  },
  {
    icon: Sparkles,
    text: "AI helps me move faster; engineering judgment still drives the work.",
  },
];

const CORE_PILLS = [
  "System design",
  "Architecture",
  "Clean code",
  "Scalability",
  "User experience",
];

export default async function Home() {
  const [technologies, resumeData, experiences, rawProjects] = await Promise.all([
    getAllTechnologies(),
    getResume(),
    getAllExperiences(),
    getAllProjects(),
  ]);

  const resumeUrl = resumeData?.resumeUrl || "/resume.pdf";

  const formattedProjects = rawProjects.map((p) => ({
    _id: p.id,
    title: p.title,
    slug: p.slug,
    overview: p.overview,
    mainImage: p.mainImage || "",
    mainImageAlt: p.mainImageAlt,
    toolsAndLanguages: p.toolsAndLanguages,
  }));

  return (
    <SmoothScroll>
      <main>
        {/* ─────────────────────────────────────────────────────── HERO */}
        <section className="relative unique-section pt-20 md:pt-8">
          {/* Top meta bar */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 sm:mt-5 pb-8 md:pb-16">
            {/* Status badge with glowing animated green dot */}
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Available for Fulltime work
            </div>

            {/* Email link with mail icon and hover micro-interaction */}
            <a
              href="mailto:manifreelancer25@gmail.com"
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-white/70 hover:bg-white hover:border-[#111827]/40 text-[#4b5563] hover:text-[#111827] text-[12px] md:text-[13px] font-medium transition-all duration-200 shadow-2xs backdrop-blur-xs w-fit"
            >
              <Mail className="w-3.5 h-3.5 text-[#6b7280] group-hover:text-[#111827] transition-colors duration-200 stroke-[1.8]" />
              <span>manifreelancer25@gmail.com</span>
            </a>
          </div>

          {/* ── Main two-column hero grid ── */}
          <div className="grid lg:grid-cols-[1.18fr_0.82fr] gap-10 lg:gap-x-20 lg:gap-y-12 items-start max-w-7xl mx-auto">
            {/* Block 1: Headline & Lead (Desktop: Col 1 Row 1 | Mobile/Tab: 1st) */}
            <div className="max-w-2xl lg:col-start-1 lg:row-start-1">
              {/* Main Headline */}
              <h1 className="leading-relaxed">
                Hello, I&apos;m Sai — a{" "}
                <span className="inline-block bg-[#dcfce7] font-heading text-[#111827] font-semibold rounded-full px-3 py-[2px] align-baseline text-[0.88em]">
                  Full-Stack Developer
                </span>{" "}
                who enjoys turning complex ideas into simple, fast, and scalable products.
              </h1>

              {/* Hero Lead Paragraph */}
              <p className="mt-5 md:mt-6 text-[#4b5563] leading-[1.8]">
                With{" "}
                <span className="inline-block bg-[#ffe4e6] font-heading text-[#111827] font-semibold rounded-full px-3 py-[2px] align-baseline text-[0.88em]">
                  3+ years
                </span>{" "}
                of experience, I work across product engineering, backend architecture,
                interactive interfaces, and AI-powered systems.
              </p>
            </div>

            {/* Block 2: Avatar + Badges + Resume (Desktop: Col 2 Row 1-2 with offset | Mobile/Tab: 2nd, in 1st screen) */}
            <div className="flex flex-col items-center w-full min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:-mt-6">
              <div className="relative flex items-end justify-center overflow-hidden w-full max-w-[320px] md:max-w-[360px]">
                <div className="absolute -bottom-[2px] w-full rounded-full h-[65%] bg-[#fdecd2] border border-[#f5ddba]/60" />

                <div className="relative -bottom-4 w-full px-3 z-10 overflow-hidden pointer-events-none">
                  <Image
                    src="/images/manikanta-working.png"
                    alt="Sai Manikanta Mamidi - Full stack developer"
                    width={350}
                    height={350}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Structured Pill Tags */}
              <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-10 md:mt-12">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Always Hold On to
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {CORE_PILLS.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full border border-[#1f2937]/40 bg-transparent text-[13px] md:text-[14px] font-normal text-[#111827] hover:border-[#111827] transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clean Vertical Connector Line & Prominent Black Resume Button */}
              <div className="flex flex-col items-center mt-3 sm:mt-4">
                <div className="w-[1px] h-4 bg-[#d1d5db]" />
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Sai_Manikanta_Resume.pdf"
                  className="group mt-2.5 inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-2.5 rounded-full bg-[#111827] text-white hover:bg-black hover:scale-[1.02] active:scale-95 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg ring-1 ring-white/15 cursor-pointer select-none"
                >
                  <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-safe:group-hover:animate-bounce shrink-0 text-white" />
                  <span>Download My Resume</span>
                </a>
              </div>
            </div>

            {/* Block 3: What Makes Me Stand Out (Desktop: Col 1 Row 2 | Mobile/Tab: 3rd, below the avatar block) */}
            <div className="max-w-2xl lg:col-start-1 lg:row-start-2">
              <h2 className="mb-6">What Makes Me Stand Out</h2>
              <div className="space-y-4">
                {STANDOUT_POINTS.map((point, idx) => {
                  const Icon = point.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-white/70 text-[#111827] shadow-2xs">
                        <Icon className="h-3.5 w-3.5 stroke-[1.8]" />
                      </div>
                      <p className="text-[#4b5563] leading-[1.7]">
                        {point.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────── 2. SKILLS */}
        <Skills technologies={technologies} />

        {/* ─────────────────────────────────────────────── 3. EXPERIENCE */}
        <ExperienceSection experiences={experiences} />

        {/* ──────────────────────────────────────────────────── 4. WORK */}
        <FeaturedWorkSection projects={formattedProjects} />

        {/* ───────────────────────────────────────────────────── 5. CTA */}
        <CtaPro />
      </main>
    </SmoothScroll>
  );
}
