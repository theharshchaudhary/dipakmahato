import type { NavItem, Profile } from "@/types";

// Placeholder contact details — replace with verified values.
export const profile: Profile = {
  fullName: "Dipak Kumar Mahato",
  shortName: "Dipak Mahato",
  title: "CEO, Zedfo",
  positioning: "Entrepreneur building businesses in Nepal and learning through execution.",
  email: "hello@example.com",
  linkedin: "https://www.linkedin.com/",
  portraitUrl: null,
};

export const navItems: NavItem[] = [
  { label: "About", to: "/about", tone: "ink" },
  { label: "Writing", to: "/writing", tone: "crimson" },
  { label: "Ventures", to: "/ventures", tone: "sign" },
  { label: "Contact", to: "/contact", tone: "marigold" },
];
