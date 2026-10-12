const knownProfiles: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "x.com": "X",
  "twitter.com": "X",
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "github.com": "GitHub",
  "youtube.com": "YouTube",
  "medium.com": "Medium",
  "crunchbase.com": "Crunchbase",
};

/** "https://www.linkedin.com/in/x" -> "LinkedIn"; unknown sites show their domain. */
export function profileLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return knownProfiles[host] ?? host;
  } catch {
    return url;
  }
}
