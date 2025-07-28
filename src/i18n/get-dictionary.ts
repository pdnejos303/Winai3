import type { Locale } from "./config";

export async function getDictionary(locale: Locale) {
  return (await import(`./messages/${locale}.json`)).default;
}
