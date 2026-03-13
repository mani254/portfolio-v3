export interface SanityBlog {
  _id: string;
  title: string;
  slug: string;
  mainImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  } | null;
  publishedAt: string;
  excerpt?: string;
  body?: any[]; // Portable text
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  mainImage?: string;
  imageAlt?: string;
  publishedAt: string;
  excerpt?: string;
  body?: any[];
}

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
}

export interface Technology {
  id: string;
  title: string;
  image?: string;
  description?: string;
  isBlack?: boolean;
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

