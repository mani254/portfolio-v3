"use client";

import { TECH_CATEGORIES } from "@/lib/consts";
import { Technology } from "sanity-lib";
import SectionHeading from "./SectionHeading";
import TechPill from "./TechPill";

interface GroupedTechnologies {
  [key: string]: Technology[];
}

const Skills = ({ technologies }: { technologies: Technology[] }) => {
  const groupedTech = technologies.reduce((acc: GroupedTechnologies, tech) => {
    const category = tech.category && TECH_CATEGORIES.includes(tech.category)
      ? tech.category
      : "Other";

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {});

  const categories = TECH_CATEGORIES.filter(cat => groupedTech[cat] && groupedTech[cat].length > 0);

  return (
    <section>

      <div className="container py-12">
        <div className="text-center">
          <SectionHeading
            heading="Technologies"
            spanContent="Behind My Work"
            breakBeforeSpan={true}
          />
        </div>
        {categories.map((category) => (
          <div
            key={category}
            className="relative mb-6 max-w-4xl m-auto"
          >
            <h3 className="text-2xl text-center mb-3 text-foreground/30">
              {category}
            </h3>

            <div className="flex gap-4 flex-wrap items-center justify-center ">
              {groupedTech[category].map((tech) => (
                <TechPill key={tech.id} tech={tech} className="backdrop-blur-[5px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
