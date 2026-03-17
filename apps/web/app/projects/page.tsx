import CommonBanner from "@/components/common/CommonBanner";
import SmoothScroll from "@/components/common/SmoothScroll";
import MobileProjects from "@/components/projects/MobileProjects";
import ProjectIntro from "@/components/projects/ProjectIntro";
import ScrollingProjects from "@/components/projects/ScrollingProjects";
import { getAllProjects } from "sanity-lib";

export const revalidate = 3600;

export const metadata = {
  title: "Projects | Portfolio",
  description: "A list of all my projects.",
};

export interface Technology {
  id: string
  title: string
  image?: string,
  isBlack?: boolean
}

export interface ProjectFeature {
  question: string,
  answer?: unknown[]
}

export interface FormatedProject {
  _id: string
  title: string
  slug: string
  overview?: string
  mainImage: string
  keyFeatures?: ProjectFeature[]
  toolsAndLanguages?: Technology[]
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  const formatedProjects: FormatedProject[] = projects.map((project) => ({
    _id: project.id,
    title: project.title,
    slug: project.slug,
    overview: project.overview,
    mainImage: project.mainImage || "",
    keyFeatures: project.keyFeatures,
    toolsAndLanguages: project.toolsAndLanguages,
  }));

  return (
    <SmoothScroll>
      <div>
        <CommonBanner title="My Work" />
        <ProjectIntro />
        {/* desktop projects ui scrollable ui*/}
        <div className="hidden md:block">
          <ScrollingProjects projects={formatedProjects} />
        </div>

        {/* mobile projects ui */}
        <section className="block md:hidden">
          <MobileProjects projects={formatedProjects} />
        </section>

      </div>
    </SmoothScroll>
  );
}
