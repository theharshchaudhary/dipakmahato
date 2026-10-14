import type { PaletteKey, Theme } from "@/types";

/*
 * Turns the Appearance settings from the admin into CSS custom properties.
 * Only known keys and valid hex colours make it through, so a bad value can't
 * break the page; custom CSS is passed on as written (admins only).
 */

const paletteVars: Record<PaletteKey, string[]> = {
  background: ["--paper"],
  surface: ["--surface"],
  text: ["--ink"],
  mutedText: ["--ink-soft"],
  lines: ["--line"],
  button: ["--primary"],
  buttonText: ["--primary-ink"],
  ventures: ["--sign", "--sign-text"],
  writing: ["--crimson"],
  contact: ["--marigold"],
  footer: ["--night"],
  footerText: ["--night-ink"],
};

const headingFonts: Record<string, string> = {
  anek: "Anek Latin Variable",
  inter: "Inter Variable",
  geist: "Geist Variable",
  "space-grotesk": "Space Grotesk Variable",
  manrope: "Manrope Variable",
};

const serifFonts: Record<string, string> = {
  newsreader: "Newsreader Variable",
  fraunces: "Fraunces Variable",
  playfair: "Playfair Display Variable",
  lora: "Lora Variable",
  "instrument-serif": "Instrument Serif",
};

const buttonRadius: Record<Theme["buttonShape"], string> = {
  sharp: "0px",
  soft: "0.5rem",
  pill: "9999px",
};

const isHex = (v: unknown): v is string => typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v);

function paletteCss(palette: Partial<Record<PaletteKey, string>>): string {
  return (Object.keys(paletteVars) as PaletteKey[])
    .flatMap((key) => {
      const value = palette[key];
      return isHex(value) ? paletteVars[key].map((v) => `${v}:${value};`) : [];
    })
    .join("");
}

export function themeCss(theme: Theme | undefined, customCss?: string | null): string {
  if (!theme) return "";
  const heading = headingFonts[theme.headingFont];
  const serif = serifFonts[theme.serifFont];
  const radius = buttonRadius[theme.buttonShape];

  const root = [
    paletteCss(theme.light),
    heading ? `--heading-font:"${heading}";` : "",
    serif ? `--serif-font:"${serif}";` : "",
    radius ? `--button-radius:${radius};` : "",
  ].join("");

  // "off" keeps the light palette even when the visitor's device prefers dark.
  const dark =
    theme.darkMode === "off"
      ? `${paletteCss(theme.light)}color-scheme:light;`
      : `${paletteCss(theme.dark)}color-scheme:dark;`;

  return [
    `:root{${root}}`,
    `@media (prefers-color-scheme: dark){:root{${dark}}}`,
    theme.showGrid === false ? ".hero-grid{display:none}" : "",
    // Custom CSS can't close the <style> element it is placed in.
    customCss ? customCss.replace(/<\/style/gi, "<\\/style") : "",
  ].join("\n");
}

/** Background colour for the browser's theme-color hint. */
export function themeBackground(theme: Theme | undefined, mode: "light" | "dark"): string {
  const value = theme?.[theme.darkMode === "off" ? "light" : mode]?.background;
  return isHex(value) ? value : mode === "light" ? "#f3f4f8" : "#0e1224";
}
