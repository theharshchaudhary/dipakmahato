import type { Article, ArticleCategory } from "@/types";

export const categories: ArticleCategory[] = [
  "Entrepreneurship",
  "Business Strategy",
  "Technology",
  "Founder Reflections",
];

const draftBody = (topic: string) => [
  {
    id: "context",
    heading: "The context",
    paragraphs: [
      `Draft placeholder. This section will introduce ${topic} and why it matters to someone building a business today.`,
      "Final copy will be written by Dipak. Until then, this text exists only to preview the reading experience: line length, rhythm, and hierarchy.",
    ],
  },
  {
    id: "what-i-observed",
    heading: "What I observed",
    paragraphs: [
      "Draft placeholder for first-hand observations. Real examples and lessons will replace this paragraph once the article is written.",
      "Good writing about business tends to be specific. This space is reserved for specifics — decisions made, trade-offs weighed, and what happened afterwards.",
    ],
  },
  {
    id: "what-i-would-do-differently",
    heading: "What I would do differently",
    paragraphs: [
      "Draft placeholder for reflections and practical takeaways.",
    ],
  },
  {
    id: "closing",
    heading: "Closing thought",
    paragraphs: ["Draft placeholder for a short closing reflection."],
  },
];

// Mock development content — not published material.
export const articles: Article[] = [
  {
    slug: "before-building-a-startup-in-nepal",
    title: "What I Wish I Had Understood Before Building a Startup in Nepal",
    subtitle: "Notes on the gap between planning a business and actually running one.",
    excerpt: "The lessons that only show up once you start — about customers, operations, and patience.",
    category: "Founder Reflections",
    publishedAt: null,
    status: "draft",
    readingMinutes: 7,
    featured: true,
    sections: draftBody("the realities of starting a company in Nepal"),
  },
  {
    slug: "more-orders-better-business",
    title: "Why More Orders Don't Automatically Mean a Better Business",
    subtitle: "Growth, unit economics, and the quiet cost of scale.",
    excerpt: "Volume can hide problems. A look at what actually makes each order worth fulfilling.",
    category: "Business Strategy",
    publishedAt: null,
    status: "draft",
    readingMinutes: 6,
    sections: draftBody("the relationship between growth and business quality"),
  },
  {
    slug: "technology-and-local-businesses",
    title: "Where Technology Can Actually Help Local Businesses",
    subtitle: "Separating useful tools from technology for its own sake.",
    excerpt: "Not every problem needs an app. Thinking about where software genuinely earns its place.",
    category: "Technology",
    publishedAt: null,
    status: "draft",
    readingMinutes: 5,
    sections: draftBody("practical technology for local businesses"),
  },
  {
    slug: "decisions-under-uncertainty",
    title: "Making Decisions When You Don't Have Enough Information",
    subtitle: "A working approach to moving forward without certainty.",
    excerpt: "Most early decisions are made with incomplete data. How to make them anyway.",
    category: "Entrepreneurship",
    publishedAt: null,
    status: "draft",
    readingMinutes: 5,
    sections: draftBody("decision-making under uncertainty"),
  },
  {
    slug: "operations-is-the-product",
    title: "In Local Commerce, Operations Is the Product",
    subtitle: "Why the customer experience is built behind the scenes.",
    excerpt: "Customers rarely see operations — but they feel every part of it.",
    category: "Business Strategy",
    publishedAt: null,
    status: "draft",
    readingMinutes: 6,
    sections: draftBody("operations as a customer experience"),
  },
  {
    slug: "learning-through-execution",
    title: "Learning Through Execution",
    subtitle: "Why doing teaches what planning cannot.",
    excerpt: "Some lessons are only available to people who ship.",
    category: "Entrepreneurship",
    publishedAt: null,
    status: "draft",
    readingMinutes: 4,
    sections: draftBody("learning by doing"),
  },
  {
    slug: "hiring-early-team",
    title: "Notes on Building an Early Team",
    subtitle: "Placeholder reflections on hiring and trust.",
    excerpt: "Draft thoughts on finding people who care about the problem.",
    category: "Founder Reflections",
    publishedAt: null,
    status: "draft",
    readingMinutes: 5,
    sections: draftBody("building an early team"),
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
