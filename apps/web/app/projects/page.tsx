import SmoothScroll from "@/components/common/SmoothScroll";
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
        <header className="mb-12 min-h-[500px]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Projects</h1>
          <p className="text-xl text-muted-foreground">
            A collection of my recent work and personal projects.
          </p>
        </header>
        <ScrollingProjects projects={formatedProjects} />
      </div>
    </SmoothScroll>
  );
}
