export const locales = ["en", "th", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
