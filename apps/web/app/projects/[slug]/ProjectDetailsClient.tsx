"use client";

import CommonPortableTextComponent from "@/components/common/PortableTextComponent";
import SparkleIcon from "@/components/common/SparkleIcon";
import HeaderSection from "@/components/projects/HeaderSection";
import KeyFeatureItem, { FaqPortableTextComponents } from "@/components/projects/KeyFeatureItem";
import ProjectBanner from "@/components/projects/ProjectBanner";
import { Accordion } from "@/components/ui/accordion";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";
import { Project } from "sanity-lib";
import ProjectCarousel from "./ProjectCarousel";

interface Section {
  id: string;
  label: string;
  condition: boolean;
}

export default function ProjectDetailsClient({ project }: { project: Project }) {
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

  const visibleSections = sections.filter(s => s.condition);

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
  if (project.mainImage) images.push({ url: project.mainImage, alt: project.mainImageAlt || "" });
  if (project.additionalImage1) images.push({ url: project.additionalImage1, alt: project.additionalImage1Alt || "" });
  if (project.additionalImage2) images.push({ url: project.additionalImage2, alt: project.additionalImage2Alt || "" });

  return (
    <>
      <ProjectBanner />
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Content */}
          <div className="lg:w-3/4 pb-24">

            {/* Section 1: Header / Overview */}
            <HeaderSection project={project} />

            {/* Section 2: Carousel */}
            {images.length > 0 && (
              <section id="screenshots" className="scroll-mt-24">
                {/* <h2 className="text-3xl font-bold mb-6 text-foreground">Screenshots</h2> */}
                <ProjectCarousel images={images} />
              </section>
            )}


            {/* Section 3: Key Features (Accordion Style) */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <section id="key-features" className="scroll-mt-24">
                <h2 className="section-heading">Key Features</h2>
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
              <section id="role" className="scroll-mt-24">
                <h2 className="section-heading">Role & Responsibilities</h2>
                <div className="max-w-none text-foreground">
                  <PortableText components={CommonPortableTextComponent} value={project.roleDescription} />
                </div>
              </section>
            )}

            {/* Section 5: Description */}
            {project.description && project.description.length > 0 && (
              <section id="description" className="scroll-mt-24">
                <h2 className="section-heading">Detailed Description</h2>
                <div className="max-w-none text-foreground">
                  <PortableText components={CommonPortableTextComponent} value={project.description} />
                </div>
              </section>
            )}

            {/* Section 6: Tech Stack Detail (Inline bold underline title) */}
            {project.techStackDetails && project.techStackDetails.length > 0 && (
              <section id="tech-stack" className="scroll-mt-24">
                <h2 className="section-heading">Technologies Under the Hood</h2>
                <div className="space-y-6">
                  {project.techStackDetails.map((node, idx) => (
                    <p key={idx}>
                      <span className="font-semibold underline">{node.title}:</span>{" "}
                      <span className="text-muted-foreground">{node.description}</span>
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* Section 7: Challenges and Learnings (Normal blocks below title) */}
            {project.challengesAndLearnings && project.challengesAndLearnings.length > 0 && (
              <section id="challenges-learnings" className="scroll-mt-24">
                <h2 className="section-heading">Challenges & Learnings</h2>
                <div className="space-y-5">
                  {project.challengesAndLearnings.map((item, idx) => (
                    <div key={idx} className="space-y-4 py-2 text-sm">
                      <div className="flex items-center gap-2"><SparkleIcon /><h4 className="text-muted-foreground">{item.question}</h4></div>
                      <div className="text-muted-foreground ml-3">
                        <PortableText components={FaqPortableTextComponents} value={item.answer} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Column - Navigation */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">On this page</h3>
              <nav className="flex flex-col space-y-3 border-l-2 border-border pl-4">
                {visibleSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      const el = document.getElementById(section.id);
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY - 80; // Offset for header
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                    }}
                    className={`text-left text-sm transition-all duration-200 ${activeSection === section.id
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
      </div>
    </>
  );
}
