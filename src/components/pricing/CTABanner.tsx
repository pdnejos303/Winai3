"use client";

/****************************************************************************************
 *  CTABanner – Bottom call-to-action with gradient button
 ****************************************************************************************/

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CTABanner() {
  const t = useTranslations("pricing");

  return (
    <section className="mt-32 text-center">
      <h2 className="mb-3 text-2xl font-semibold">{t("ctaTitle")}</h2>
      <p className="mx-auto max-w-xl text-zinc-600 dark:text-zinc-300">
        {t("ctaBody")}
      </p>

      <Link
        href="/pricing"
        className="mt-8 inline-block rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
      >
        {t("ctaButton")}
      </Link>
    </section>
  );
}
