"use client";
import { createContext, useContext } from "react";

/* ---------- type ---------- */
export type Dictionary = Record<string, unknown>;
type Vars             = Record<string, string | number>;
type TFunction        = (path: string, vars?: Vars) => string;

/* ---------- context ---------- */
const I18nCtx = createContext<{ t: TFunction }>({
  t: (k) => k, // fallback
});

/* ---------- provider ---------- */
export function IntlProvider({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) {
  /* helper แกะ path "a.b.c" */
  const t: TFunction = (path, vars) => {
    const raw = path
      .split(".")
      .reduce<unknown>((o, key) => (o as Dictionary | undefined)?.[key], dict);

    const text = typeof raw === "string" ? raw : path;

    return vars
      ? Object.entries(vars).reduce(
          (str, [k, v]) => str.replace(`{{${k}}}`, String(v)),
          text,
        )
      : text;
  };

  return <I18nCtx.Provider value={{ t }}>{children}</I18nCtx.Provider>;
}

/* ---------- hook ---------- */
export const useT = () => useContext(I18nCtx).t;
