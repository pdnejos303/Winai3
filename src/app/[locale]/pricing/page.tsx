"use client";

/****************************************************************************************
 *  Pricing Page – cards + FeatureTable + FAQ + CTA (i18n, dark-theme ready)
 ****************************************************************************************/

import CheckoutButton from "@/components/payment/CheckoutButton";
import FeatureTable from "@/components/pricing/FeatureTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import CTABanner from "@/components/pricing/CTABanner";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

/* ---------- Plan data (unchanged) ---------- */
type Feature = { label: string; included: boolean };
type Plan = {
  name: string;
  price: number;
  subtitle: string;
  badge?: string;
  recommended?: boolean;
  features: Feature[];
  paid: boolean;
};

const plans: Plan[] = [
  /* ... (คง Structure เดิม ไม่ตัดออกในที่นี้เพื่อความครบถ้วน) ... */
  /* – Starter – */  {
    name: "Starter",
    price: 0,
    subtitle: "เริ่มต้นใช้งานฟรี",
    badge: "Free Plan",
    paid: false,
    features: [
      { label: "Task Management พื้นฐาน", included: true },
      { label: "Calendar View", included: true },
      { label: "Dashboard พื้นฐาน", included: true },
      { label: "จำกัด 100 To-Do", included: true },
      { label: "AI Assistant", included: false },
      { label: "Habit Tracker", included: false },
    ],
  },
  /* – Power User – */ {
    name: "Power User",
    price: 399,
    subtitle: "สำหรับมืออาชีพ",
    badge: "แนะนำ",
    recommended: true,
    paid: true,
    features: [
      { label: "ทุกฟีเจอร์ใน Free Plan", included: true },
      { label: "AI สร้าง Task-To-Do อัตโนมัติ", included: true },
      { label: "Habit Tracker ครบวงจร", included: true },
      { label: "จำกัด 10 000 To-Do", included: true },
      { label: "Gamification System", included: true },
      { label: "ธีมเสริม", included: true },
    ],
  },
  /* – Pro – */ {
    name: "Power User Pro",
    price: 399,
    subtitle: "สำหรับมืออาชีพขั้นสูง",
    badge: "Pro Plan",
    paid: true,
    features: [
      { label: "ทุกฟีเจอร์ใน Pro-Plan", included: true },
      { label: "Unlimited To-Do", included: true },
      { label: "Customize Dashboard & Theme", included: true },
      { label: "Priority Support", included: true },
      { label: "AI Advisor ส่วนตัว", included: true },
      { label: "API Integration", included: true },
    ],
  },
];

export default function PricingPage() {
  const pt = useTranslations("pricing"); // heading

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* ── Heading ── */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {pt("heading", { default: "เลือกแพ็กเกจที่เหมาะกับคุณ" })}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
          {pt("subheading", {
            default:
              "Unlock your productivity potential with AI and Habit Tracking. Upgrade to achieve your goals faster and smarter.",
          })}
        </p>
      </header>

      {/* ── Plan Cards ── */}
      <section className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`
              relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-6
              shadow-lg transition hover:scale-105 hover:shadow-2xl
              dark:border-zinc-700 dark:bg-zinc-800
              ${plan.recommended ? "ring-2 ring-primary" : ""}
            `}
          >
            {plan.badge && (
              <span
                className={`
                  absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold
                  ${plan.recommended ? "bg-purple-600 text-white" : "bg-zinc-700 text-white"}
                `}
              >
                {plan.badge}
              </span>
            )}

            <h2 className="mt-6 text-xl font-semibold text-zinc-900 dark:text-white">
              {plan.name}
            </h2>
            <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
              {plan.subtitle}
            </p>

            <p className="text-4xl font-extrabold text-zinc-900 dark:text-white">
              ฿{plan.price}
              {plan.price !== 0 && (
                <span className="text-base font-medium text-zinc-500 dark:text-zinc-400">
                  {" "}
                  /เดือน
                </span>
              )}
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f.label} className="flex items-center gap-2">
                  {f.included ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-500" />
                  )}
                  <span
                    className={
                      f.included
                        ? "text-zinc-800 dark:text-zinc-100"
                        : "text-zinc-400 line-through"
                    }
                  >
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              {plan.paid ? (
                <CheckoutButton />
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-md bg-zinc-300 py-2 text-sm font-semibold text-zinc-500"
                >
                  {pt("freeCta", { default: "เริ่มต้นใช้งานฟรี" })}
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* ── Feature Table ── */}
      <FeatureTable />

      {/* ── FAQ ── */}
      <PricingFAQ />

      {/* ── CTA Banner ── */}
      <CTABanner />
    </div>
  );
}
