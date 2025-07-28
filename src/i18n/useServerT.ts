import { getMessages } from "next-intl/server";

/** สำหรับใช้ใน **Server Component**
 *  const t = await useServerT(locale);
 *  t("home.welcome")
 */
export async function useServerT(locale: string) {
  const messages = await getMessages({ locale });
  return function t(path: string, vars: Record<string, string | number> = {}) {
    const raw = path
      .split(".")
      .reduce<any>((o, k) => o?.[k], messages) ?? path;
    return Object.entries(vars).reduce(
      (res, [k, v]) => res.replace(`{{${k}}}`, String(v)),
      raw,
    );
  };
}
