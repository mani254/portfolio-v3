import SmoothScroll from "@/components/common/SmoothScroll";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "sanity-lib";
import ProjectDetailsClient from "./ProjectDetailsClient";


export const revalidate = 3600;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const isDev = process.env.NODE_ENV === "development";
  try {
    const projects = await getAllProjects();
    const pages = projects.map((project) => ({
      slug: project.slug,
    }));

    if (isDev) {
      console.log(`[generateStaticParams] Generated ${pages.length} project pages for static generation`);
    }

    return pages;
  } catch (error) {
    if (isDev) {
      console.error("[generateStaticParams] Error generating static params for projects:", error);
    }
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Portfolio",
      description: "The project you're looking for does not exist.",
    };
  }

  const title = `${project.title} | Portfolio Projects`;
  const description = project.overview || `Learn more about the ${project.title} project.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(project.mainImage && {
        images: [
          {
            url: project.mainImage,
            width: 1200,
            height: 630,
            alt: project.mainImageAlt || project.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(project.mainImage && { images: [project.mainImage] }),
    },
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <SmoothScroll><ProjectDetailsClient project={project} /></SmoothScroll>;
}
