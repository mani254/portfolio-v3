import { client } from "./client";
import { getImageUrl, urlFor } from "./image";
import type { Project, SanityProject, SanityTechnology, Technology } from "./types";

export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(startDate desc) {
  _id,
  title,
  "slug": slug.current,
  overview,
  mainImage,
  keyFeatures,
  toolsAndLanguages[]->{
    _id,
    title,
    image,
    description,
    isBlack
  },

}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  liveUrl,
  githubUrl,
  overview,
  toolsAndLanguages[]->{
    _id,
    title,
    image,
    description,
    isBlack
  },
  startDate,
  endDate,
  mainImage,
  additionalImage1,
  additionalImage2,
  description,
  roleDescription,
  keyFeatures,
  challengesAndLearnings,
  techStackDetails
}`;

export const ALL_TECHNOLOGIES_QUERY = `*[_type == "technology"] | order(title asc) {
  _id,
  title,
  image,
  description,
  isBlack,
  category
}`;

function transformTechnology(sanityTech: SanityTechnology): Technology {
  return {
    id: sanityTech._id,
    title: sanityTech.title,
    image: sanityTech.image ? urlFor(sanityTech.image).width(200).url() : undefined,
    description: sanityTech.description,
    isBlack: sanityTech.isBlack,
    category: sanityTech.category,
  };
}

function transformProject(sanityProject: SanityProject | null): Project | null {
  if (!sanityProject) return null;

  return {
    id: sanityProject._id,
    title: sanityProject.title,
    slug: sanityProject.slug,
    liveUrl: sanityProject.liveUrl,
    githubUrl: sanityProject.githubUrl,
    overview: sanityProject.overview,
    toolsAndLanguages: sanityProject.toolsAndLanguages?.map(transformTechnology),
    startDate: sanityProject.startDate,
    endDate: sanityProject.endDate,
    mainImage: sanityProject.mainImage ? getImageUrl(sanityProject.mainImage, 1200) : undefined,
    mainImageAlt: sanityProject.mainImage?.alt || sanityProject.title,
    additionalImage1: sanityProject.additionalImage1 ? getImageUrl(sanityProject.additionalImage1, 1200) : undefined,
    additionalImage1Alt: sanityProject.additionalImage1?.alt || "Additional image 1",
    additionalImage2: sanityProject.additionalImage2 ? getImageUrl(sanityProject.additionalImage2, 1200) : undefined,
    additionalImage2Alt: sanityProject.additionalImage2?.alt || "Additional image 2",
    description: sanityProject.description,
    roleDescription: sanityProject.roleDescription,
    keyFeatures: sanityProject.keyFeatures,
    challengesAndLearnings: sanityProject.challengesAndLearnings,
    techStackDetails: sanityProject.techStackDetails,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const sanityProjects = await client.fetch<SanityProject[]>(
      ALL_PROJECTS_QUERY,
      {}
    );
    return sanityProjects.map(p => transformProject(p)).filter((p): p is Project => p !== null);
  } catch (error) {
    console.error("Error fetching all projects from Sanity:", error);
    return [];
  }
}

export async function getAllTechnologies(): Promise<Technology[]> {
  try {
    const sanityTechnologies = await client.fetch<SanityTechnology[]>(
      ALL_TECHNOLOGIES_QUERY,
      {}
    );
    return sanityTechnologies.map(transformTechnology);
  } catch (error) {
    console.error("Error fetching all technologies from Sanity:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const sanityProject = await client.fetch<SanityProject | null>(
      PROJECT_BY_SLUG_QUERY,
      { slug }
    );
    return transformProject(sanityProject);
  } catch (error) {
    console.error("Error fetching project by slug from Sanity:", error);
    return null;
  }
}

