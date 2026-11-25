"use client";

import CommonPortableTextComponent from "@/components/common/PortableTextComponent";
import SparkleIcon from "@/components/common/SparkleIcon";
import HeaderSection from "@/components/projects/HeaderSection";
import KeyFeatureItem, { FaqPortableTextComponents } from "@/components/projects/KeyFeatureItem";
import { Accordion } from "@/components/ui/accordion";
import { PortableText } from "@portabletext/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Project } from "sanity-lib";
import ProjectCarousel from "./ProjectCarousel";

interface Section {
  id: string;
  label: string;
  condition: boolean;
}

export default function ProjectDetailsClient({
  project,
  nextProjects = [],
}: {
  project: Project;
  nextProjects?: Project[];
}) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections: Section[] = [
    { id: "overview", label: "Overview", condition: true },
    { id: "screenshots", label: "Screenshots", condition: !!(project.mainImage || project.additionalImage1 || project.additionalImage2) },
    { id: "key-features", label: "Key Features", condition: !!project.keyFeatures && project.keyFeatures.length > 0 },
    { id: "role", label: "Role & Responsibilities", condition: !!project.roleDescription && project.roleDescription.length > 0 },
    { id: "description", label: "Description", condition: !!project.description && project.description.length > 0 },
    { id: "tech-stack", label: "Tech Stack Detail", condition: !!project.techStackDetails && project.techStackDetails.length > 0 },
    { id: "challenges-learnings", label: "Challenges & Learnings", condition: !!project.challengesAndLearnings && project.challengesAndLearnings.length > 0 },
  ];

  const visibleSections = sections.filter((s) => s.condition);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    visibleSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  const images = [];
  if (project.mainImage) images.push({ url: project.mainImage, alt: project.mainImageAlt || `${project.title} - Main showcase screenshot` });
  if (project.additionalImage1) images.push({ url: project.additionalImage1, alt: project.additionalImage1Alt || `${project.title} - Interface feature preview 1` });
  if (project.additionalImage2) images.push({ url: project.additionalImage2, alt: project.additionalImage2Alt || `${project.title} - Interface feature preview 2` });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-20">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Content with tightened, harmonious section gaps */}
        <div className="lg:w-3/4 space-y-8 sm:space-y-10">
          {/* Section 1: Header / Overview */}
          <HeaderSection project={project} />

          {/* Section 2: Carousel */}
          {images.length > 0 && (
            <section id="screenshots" className="scroll-mt-24">
              <ProjectCarousel images={images} />
            </section>
          )}

          {/* Section 3: Key Features (Accordion Style) */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <section id="key-features" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight">
                Key Features
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {project.keyFeatures.map((feature, idx) => (
                  <KeyFeatureItem
                    key={idx}
                    value={`feature-${idx}`}
                    question={feature.question}
                    answer={feature.answer}
                  />
                ))}
              </Accordion>
            </section>
          )}

          {/* Section 4: Role Description */}
          {project.roleDescription && project.roleDescription.length > 0 && (
            <section id="role" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight">
                Role & Responsibilities
              </h2>
              <div className="max-w-none text-foreground text-xs sm:text-sm leading-relaxed">
                <PortableText components={CommonPortableTextComponent} value={project.roleDescription} />
              </div>
            </section>
          )}

          {/* Section 5: Description */}
          {project.description && project.description.length > 0 && (
            <section id="description" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight">
                Detailed Description
              </h2>
              <div className="max-w-none text-foreground text-xs sm:text-sm leading-relaxed">
                <PortableText components={CommonPortableTextComponent} value={project.description} />
              </div>
            </section>
          )}

          {/* Section 6: Tech Stack Detail */}
          {project.techStackDetails && project.techStackDetails.length > 0 && (
            <section id="tech-stack" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight">
                Technologies Under the Hood
              </h2>
              <div className="space-y-4">
                {project.techStackDetails.map((node, idx) => (
                  <p key={idx} className="text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold text-foreground underline">{node.title}:</span>{" "}
                    <span className="text-muted-foreground">{node.description}</span>
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Section 7: Challenges and Learnings */}
          {project.challengesAndLearnings && project.challengesAndLearnings.length > 0 && (
            <section id="challenges-learnings" className="scroll-mt-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground tracking-tight">
                Challenges & Learnings
              </h2>
              <div className="space-y-4">
                {project.challengesAndLearnings.map((item, idx) => (
                  <div key={idx} className="space-y-2 py-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <SparkleIcon />
                      <h4 className="font-semibold text-foreground">{item.question}</h4>
                    </div>
                    <div className="text-muted-foreground ml-5 leading-relaxed">
                      <PortableText components={FaqPortableTextComponents} value={item.answer} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Table of Contents Navigation */}
        <div className="lg:w-1/4 hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              On this page
            </h3>
            <nav className="flex flex-col space-y-2.5 border-l-2 border-border/70 pl-4">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const el = document.getElementById(section.id);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className={`text-left text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeSection === section.id
                      ? "text-primary font-bold -ml-[18px] pl-[16px] border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Next Projects Cards ── */}
      {nextProjects && nextProjects.length > 0 && (
        <div className="pt-12 sm:pt-16 mt-12 sm:mt-16 border-t border-border/60">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Keep Exploring
              </p>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground tracking-tight">
                Next Projects
              </h3>
            </div>
            <Link
              href="/projects"
              className="hover-link group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {nextProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="hover-link group block rounded-3xl border border-border/80 bg-white/80 hover:bg-white hover:border-[#111827]/40 p-4 sm:p-5 transition-all duration-300 shadow-2xs hover:-translate-y-1.5 hover:shadow-xs"
              >
                {p.mainImage && (
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-muted/20 border border-border/40 mb-3.5">
                    <Image
                      src={p.mainImage}
                      alt={p.mainImageAlt || `${p.title} - Project preview`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-heading font-semibold text-base sm:text-lg text-[#111827] tracking-tight group-hover:text-primary transition-colors">
                    {p.title}
                  </h4>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-white text-foreground group-hover:bg-[#111827] group-hover:text-white transition-all">
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
                {p.overview && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.overview}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
