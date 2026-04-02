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

// ============== NEW QUERIES ==============

export const ALL_EXPERIENCES_QUERY = `*[_type == "experience"] | order(startDate desc) {
  _id,
  companyName,
  logo,
  startDate,
  endDate,
  designation,
  location,
  employmentType,
  description
}`;

export const ALL_EDUCATION_QUERY = `*[_type == "education"] | order(startDate desc) {
  _id,
  university,
  course,
  stream,
  percentage,
  startDate,
  endDate,
  iconImage,
  description
}`;

export const RESUME_QUERY = `*[_type == "resume"][0] {
  _id,
  title,
  "resumePdf": {
    "asset": {
      "url": resumePdf.asset->url
    }
  }
}`;

export const ALL_BLOG_CATEGORIES_QUERY = `*[_type == "blogCategory"] | order(title asc) {
  _id,
  title
}`;

// PAGINATED AND FILTERED BLOGS
export const PAGINATED_BLOGS_QUERY = `*[_type == "blog" && ($category == "" || $category in categories[]->title)] | order(_createdAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  readTime,
  author,
  mainImage,
  overview,
  categories[]->{ _id, title }
}`;

export const TOTAL_BLOGS_QUERY = `count(*[_type == "blog" && ($category == "" || $category in categories[]->title)])`;

export const BLOG_BY_SLUG_QUERY = `*[_type == "blog" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  readTime,
  author,
  mainImage,
  categories[]->{ _id, title },
  overview,
  keywords,
  sections
}`;

// ============== FETCHING METHODS ==============

import type { 
  Experience, SanityExperience, 
  Education, SanityEducation, 
  BlogCategory, SanityBlogCategory, 
  Blog, SanityBlog, 
  Resume, SanityResume 
} from "./types";

export async function getAllExperiences(): Promise<Experience[]> {
  try {
    const data = await client.fetch<SanityExperience[]>(ALL_EXPERIENCES_QUERY);
    return data.map(exp => ({
      ...exp,
      id: exp._id,
      logo: exp.logo ? urlFor(exp.logo).width(200).url() : undefined
    }));
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

export async function getAllEducation(): Promise<Education[]> {
  try {
    const data = await client.fetch<SanityEducation[]>(ALL_EDUCATION_QUERY);
    return data.map(edu => ({
      ...edu,
      id: edu._id,
      iconImage: edu.iconImage ? urlFor(edu.iconImage).width(200).url() : undefined
    }));
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

export async function getResume(): Promise<Resume | null> {
  try {
    const data = await client.fetch<SanityResume | null>(RESUME_QUERY);
    if (!data) return null;
    return {
      id: data._id,
      title: data.title,
      resumeUrl: data.resumePdf?.asset?.url
    };
  } catch (error) {
    console.error("Error fetching resume:", error);
    return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const data = await client.fetch<SanityBlogCategory[]>(ALL_BLOG_CATEGORIES_QUERY);
    return data.map(cat => ({ ...cat, id: cat._id }));
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}

export async function getPaginatedBlogs(page: number, limit: number, category: string = ""): Promise<{ blogs: Blog[]; total: number }> {
  try {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const [blogsData, total] = await Promise.all([
      client.fetch<SanityBlog[]>(PAGINATED_BLOGS_QUERY, { category, start, end }),
      client.fetch<number>(TOTAL_BLOGS_QUERY, { category })
    ]);

    const blogs = blogsData.map(blog => ({
      ...blog,
      id: blog._id,
      categories: blog.categories?.map((c: SanityBlogCategory) => ({ id: c._id, title: c.title })),
      mainImage: blog.mainImage ? getImageUrl(blog.mainImage, 800) : undefined, // Use getImageUrl for bigger images
      mainImageAlt: blog.mainImage?.alt || blog.title
    }));

    return { blogs, total };
  } catch (error) {
    console.error("Error fetching paginated blogs:", error);
    return { blogs: [], total: 0 };
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const data = await client.fetch<SanityBlog | null>(BLOG_BY_SLUG_QUERY, { slug });
    if (!data) return null;

    return {
      ...data,
      id: data._id,
      categories: data.categories?.map((c: SanityBlogCategory) => ({ id: c._id, title: c.title })),
      mainImage: data.mainImage ? getImageUrl(data.mainImage, 1200) : undefined,
      mainImageAlt: data.mainImage?.alt || data.title
    };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}
