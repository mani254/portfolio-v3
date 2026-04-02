export interface SanityTechnology {
  _id: string;
  title: string;
  image?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  } | null;
  description?: string;
  isBlack?: boolean;
  category?: string;
}

export interface Technology {
  id: string;
  title: string;
  image?: string;
  description?: string;
  isBlack?: boolean;
  category?: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  liveUrl?: string;
  githubUrl?: string;
  overview?: string;
  toolsAndLanguages?: SanityTechnology[];
  startDate?: string;
  endDate?: string;
  mainImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  } | null;
  additionalImage1?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  } | null;
  additionalImage2?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  } | null;
  description?: any[];
  roleDescription?: any[];
  keyFeatures?: { question: string; answer: any[] }[];
  challengesAndLearnings?: { question: string; answer: any[] }[];
  techStackDetails?: { title: string; description: string }[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  liveUrl?: string;
  githubUrl?: string;
  overview?: string;
  toolsAndLanguages?: Technology[];
  startDate?: string;
  endDate?: string;
  mainImage?: string;
  mainImageAlt?: string;
  additionalImage1?: string;
  additionalImage1Alt?: string;
  additionalImage2?: string;
  additionalImage2Alt?: string;
  description?: any[];
  roleDescription?: any[];
  keyFeatures?: { question: string; answer: any[] }[];
  challengesAndLearnings?: { question: string; answer: any[] }[];
  techStackDetails?: { title: string; description: string }[];
}

export interface SanityExperience {
  _id: string;
  companyName: string;
  logo?: {
    asset: { _ref: string; _type: "reference" };
  } | null;
  startDate: string;
  endDate?: string;
  designation: string;
  location: string;
  employmentType?: string;
  description?: any[];
}

export interface Experience {
  id: string;
  companyName: string;
  logo?: string;
  startDate: string;
  endDate?: string;
  designation: string;
  location: string;
  employmentType?: string;
  description?: any[];
}

export interface SanityEducation {
  _id: string;
  university: string;
  course: string;
  stream?: string;
  percentage?: string;
  startDate: string;
  endDate?: string;
  iconImage?: {
    asset: { _ref: string; _type: "reference" };
  } | null;
  description?: any[];
}

export interface Education {
  id: string;
  university: string;
  course: string;
  stream?: string;
  percentage?: string;
  startDate: string;
  endDate?: string;
  iconImage?: string;
  description?: any[];
}

export interface SanityBlogCategory {
  _id: string;
  title: string;
}

export interface BlogCategory {
  id: string;
  title: string;
}

export interface SanityBlogSection {
  title?: string;
  description?: any[];
}

export interface SanityBlog {
  _id: string;
  title: string;
  slug: string;
  readTime: string;
  author: string;
  mainImage?: {
    asset: { _ref: string; _type: "reference" };
    alt?: string;
  } | null;
  categories?: SanityBlogCategory[];
  overview?: string;
  keywords?: string[];
  sections?: SanityBlogSection[];
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  readTime: string;
  author: string;
  mainImage?: string;
  mainImageAlt?: string;
  categories?: BlogCategory[];
  overview?: string;
  keywords?: string[];
  sections?: SanityBlogSection[];
}

export interface SanityResume {
  _id: string;
  title: string;
  resumePdf?: {
    asset: { _ref: string; _type: "reference"; url?: string };
  } | null;
}

export interface Resume {
  id: string;
  title: string;
  resumeUrl?: string;
}
