import SmoothScroll from "@/components/common/SmoothScroll";
import Link from "next/link";
import { getAllProjects } from "sanity-lib";

export const revalidate = 3600;

export const metadata = {
  title: "Projects | Portfolio",
  description: "A list of all my projects.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <SmoothScroll>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Projects</h1>
          <p className="text-xl text-muted-foreground">
            A collection of my recent work and personal projects.
          </p>
        </header>

        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-2xl font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">No projects found.</p>
        )}
      </div>
    </SmoothScroll>
  );
}
