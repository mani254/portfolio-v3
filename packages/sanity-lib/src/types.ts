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
