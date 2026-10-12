export type ArticleCategory = "Entrepreneurship" | "Business Strategy" | "Technology" | "Founder Reflections";

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: ArticleCategory;
  /** ISO date once published; null while the article is a draft. */
  publishedAt: string | null;
  status: "draft" | "published";
  readingMinutes: number;
  featured?: boolean;
  sections: ArticleSection[];
}

export interface Venture {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  description: string;
  problem: string;
  product: string;
  milestones: string[];
  website: string | null;
  primary?: boolean;
}

export interface NavItem {
  label: string;
  to: "/" | "/about" | "/writing" | "/ventures" | "/contact";
}

export interface Profile {
  fullName: string;
  shortName: string;
  title: string;
  positioning: string;
  email: string;
  linkedin: string;
  portraitUrl: string | null;
}
