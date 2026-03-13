import { client } from "./client";
import { getImageUrl } from "./image";
import type { BlogPost, Project, SanityBlog, SanityProject, SanityTechnology, Technology } from "./types";

export const ALL_BLOGS_QUERY = `*[_type == "blog" && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  excerpt
}`;

export const BLOG_BY_SLUG_QUERY = `*[_type == "blog" && slug.current == $slug && defined(publishedAt)][0] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  excerpt,
  body
}`;

function transformBlogToPost(sanityBlog: SanityBlog | null): BlogPost | null {
  if (!sanityBlog) return null;

  return {
    id: sanityBlog._id,
    title: sanityBlog.title || "Untitled Post",
    slug: sanityBlog.slug,
    // Provide a simple default main image if not present
    mainImage: sanityBlog.mainImage ? getImageUrl(sanityBlog.mainImage, 1200) : undefined,
    imageAlt: sanityBlog.mainImage?.alt || sanityBlog.title,
    publishedAt: sanityBlog.publishedAt,
    excerpt: sanityBlog.excerpt,
    body: sanityBlog.body,
  };
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const sanityBlogs = await client.fetch<SanityBlog[]>(
      ALL_BLOGS_QUERY,
      {}
    );
    return sanityBlogs.map(b => transformBlogToPost(b)).filter((b): b is BlogPost => b !== null);
  } catch (error) {
    console.error("Error fetching all blogs from Sanity:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const sanityBlog = await client.fetch<SanityBlog | null>(
      BLOG_BY_SLUG_QUERY,
      { slug }
    );
    return transformBlogToPost(sanityBlog);
  } catch (error) {
    console.error("Error fetching blog by slug from Sanity:", error);
    return null;
  }
}

export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(startDate desc) {
  _id,
  title,
  "slug": slug.current,
  overview,
  mainImage
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

function transformTechnology(sanityTech: SanityTechnology): Technology {
  return {
    id: sanityTech._id,
    title: sanityTech.title,
    image: sanityTech.image ? getImageUrl(sanityTech.image, 200) : undefined,
    description: sanityTech.description,
    isBlack: sanityTech.isBlack,
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

