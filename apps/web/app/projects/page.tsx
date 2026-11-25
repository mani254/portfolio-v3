import CtaPro from "@/components/common/Cta";
import SmoothScroll from "@/components/common/SmoothScroll";
import MobileProjects from "@/components/projects/MobileProjects";
import ProjectsViewContainer from "@/components/projects/ProjectsViewContainer";
import { getAllProjects } from "sanity-lib";

export const revalidate = 3600;

export const metadata = {
  title: "Work",
  description: "A showcase of projects I've built — from full-stack web apps to developer tools.",
};

export interface Technology {
  id: string;
  title: string;
  image?: string;
  isBlack?: boolean;
}

export interface ProjectFeature {
  question: string;
  answer?: unknown[];
}

export interface FormatedProject {
  _id: string;
  title: string;
  slug: string;
  overview?: string;
  mainImage: string;
  mainImageAlt?: string;
  keyFeatures?: ProjectFeature[];
  toolsAndLanguages?: Technology[];
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  const formatedProjects: FormatedProject[] = projects.map((project) => ({
    _id: project.id,
    title: project.title,
    slug: project.slug,
    overview: project.overview,
    mainImage: project.mainImage || "",
    mainImageAlt: project.mainImageAlt,
    keyFeatures: project.keyFeatures,
    toolsAndLanguages: project.toolsAndLanguages,
  }));

  return (
    <SmoothScroll>
      <div className="pt-16 md:pt-0">
        {/* Page header */}
        <div className="px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 md:pt-12 pb-4">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-[0.15em] uppercase mb-1.5">
            Selected Work
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            My Projects
          </h1>
        </div>

        {/* Desktop view switcher (View Mode / Grid Mode) */}
        <div className="hidden md:block">
          <ProjectsViewContainer projects={formatedProjects} />
        </div>

        {/* Mobile card view */}
        <div className="block md:hidden">
          <MobileProjects projects={formatedProjects} />
        </div>

        <CtaPro />
      </div>
    </SmoothScroll>
  );
}
