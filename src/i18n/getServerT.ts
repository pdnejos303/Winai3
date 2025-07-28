import { getMessages } from "next-intl/server";

export async function getServerT(locale: string) {
  const dict = await getMessages({ locale });

  return function t(
    path: string,
    vars: Record<string, string | number> = {},
  ) {
    const raw = path
      .split(".")
      .reduce<any>((o, k) => o?.[k], dict) ?? path;
    return Object.entries(vars).reduce(
      (s, [k, v]) => s.replace(`{{${k}}}`, String(v)),
      raw,
    );
  };
}
