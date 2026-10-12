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
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Writing", to: "/writing" },
  { label: "Ventures", to: "/ventures" },
  { label: "Contact", to: "/contact" },
];
