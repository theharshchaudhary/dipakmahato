/** Shapes returned by the Laravel API (backend/app/Http/Resources). */

/** Each section of the site owns one colour from the palette. */
export type Tone = "ink" | "sign" | "crimson" | "marigold";

export type PageKey = "home" | "about" | "writing" | "ventures" | "contact";

export type SitePath = "/" | "/about" | "/writing" | "/ventures" | "/contact";

export interface Seo {
  title: string | null;
  description: string | null;
  image: string | null;
}

export interface NavItem {
  label: string;
  path: SitePath;
  key: PageKey;
}

export type PaletteKey =
  | "background"
  | "surface"
  | "text"
  | "mutedText"
  | "lines"
  | "button"
  | "buttonText"
  | "ventures"
  | "writing"
  | "contact"
  | "footer"
  | "footerText";

/** Design settings from the admin's Appearance screen. */
export interface Theme {
  light: Record<PaletteKey, string>;
  dark: Record<PaletteKey, string>;
  darkMode: "auto" | "off";
  headingFont: string;
  serifFont: string;
  buttonShape: "sharp" | "soft" | "pill";
  showGrid: boolean;
}

export interface Site {
  fullName: string;
  shortName: string;
  alternateNames: string[];
  jobTitle: string;
  organization: { name: string; url: string | null } | null;
  positioning: string;
  location: string | null;
  email: string;
  linkedin: string | null;
  sameAs: string[];
  portrait: string | null;
  defaultOgImage: string | null;
  siteUrl: string;
  verification: { google: string | null; bing: string | null };
  theme: Theme;
  logo: string | null;
  favicon: string | null;
  footerNote: string | null;
  customCss: string | null;
  nav: NavItem[];
}

export interface Cta {
  ctaTitle: string;
  ctaBody?: string | null;
  ctaLabel: string;
}

export type HomeSectionKey = "focus" | "writing" | "venture" | "cta";

export interface HomeContent extends Cta {
  heroImage?: string | null;
  heroKeywords?: string[] | null;
  heroHandle?: string | null;
  heroGreeting?: string | null;
  heroIntro?: string | null;
  heroQuestion?: string | null;
  heroMonogram?: string | null;
  heroSignature?: string | null;
  heroSignatureNote?: string | null;
  primaryCtaLabel?: string | null;
  secondaryCtaLabel?: string | null;
  /** Sections below the hero, in order; editors can hide them. */
  sections?: { key: HomeSectionKey; visible: boolean }[] | null;
  focusHeading: string;
  focusItems: {
    title: string;
    body: string;
    ctaLabel: string;
    page: Exclude<PageKey, "home">;
    tone: Tone;
  }[];
  writingHeading: string;
  spotlightBody?: string | null;
  spotlightCtaLabel?: string | null;
}

export interface AboutContent extends Cta {
  lead: string;
  note?: string | null;
  sections: { title: string; body: string }[];
  interestsHeading?: string | null;
  interests: string[];
}

export interface WritingContent {
  heading: string;
  lead?: string | null;
  note?: string | null;
  emptyMessage: string;
}

export interface VenturesContent extends Cta {
  heading: string;
  lead?: string | null;
  note?: string | null;
}

export interface ContactContent {
  heading: string;
  lead?: string | null;
  inquiries: { title: string; body: string }[];
  successMessage: string;
}

export interface PageContentMap {
  home: HomeContent;
  about: AboutContent;
  writing: WritingContent;
  ventures: VenturesContent;
  contact: ContactContent;
}

export interface Page<K extends PageKey> {
  key: K;
  path: SitePath;
  content: PageContentMap[K];
  seo: Seo;
  updatedAt: string | null;
}

export interface Category {
  name: string;
  slug: string;
}

export interface ArticleSummary {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  category: Category | null;
  publishedAt: string | null;
  updatedAt: string | null;
  readingMinutes: number;
  featured: boolean;
  coverImage: string | null;
}

export interface Article extends ArticleSummary {
  html: string;
  toc: { id: string; heading: string }[];
  seo: Seo;
}

export interface Venture {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  description: string;
  problem: string | null;
  product: string | null;
  milestones: string[];
  website: string | null;
  coverImage: string | null;
  screenshots: string[];
  primary: boolean;
}

export interface SitemapEntry {
  path: string;
  lastModified: string | null;
}
