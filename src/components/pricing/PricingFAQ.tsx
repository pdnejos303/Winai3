"use client";

/****************************************************************************************
 *  PricingFAQ – Accordion FAQ section
 ****************************************************************************************/

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type Item = { q: string; a: string };

export default function PricingFAQ() {
  const t = useTranslations("pricing.faq");
  const faq: Item[] = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-24 space-y-4">
      <h2 className="text-center text-2xl font-semibold">
        {useTranslations("pricing")("faqTitle")}
      </h2>

      {faq.map((item, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-medium"
          >
            {item.q}
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                open === idx ? "rotate-180" : ""
              }`}
            />
          </button>

          {open === idx && (
            <div className="border-t border-zinc-200 px-6 py-4 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
