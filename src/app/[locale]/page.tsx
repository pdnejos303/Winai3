// ─────────────────────────────────────────────────────────────
// FILE: src/app/[locale]/page.tsx
// DESC: Landing Page หลัก (Hero + Preview + FeatureCard แบบส่ง prop ตรง)
// ─────────────────────────────────────────────────────────────
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import PreviewSection from "@/components/landing/PreviewSection";
import FeatureCard from "@/components/landing/FeatureCard";
import FeatureTabsSection from "@/components/landing/FeatureTabsSection";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="flex flex-col items-center justify-center">
      {/* ---------- Hero Section + CTA ---------- */}
      <section className="w-full px-4 pt-24 pb-16 text-center md:pt-32 bg-gradient-to-b from-white to-blue-50">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          {t("headline")}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {t("subtext")}
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-6 py-3 rounded-lg transition"
          >
            {t("goLogin")}
          </Link>
          <Link
            href="#download"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-lg font-medium px-6 py-3 rounded-lg transition"
          >
            {t("download")}
          </Link>
        </div>
      </section>

      {/* ---------- Dashboard Preview ---------- */}
      <PreviewSection />
               <FeatureTabsSection />

      {/* ---------- Feature Card (แบบใช้ตรง) ---------- */}
      <section className="w-full px-4 py-24 bg-white space-y-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <FeatureCard
            category="Todo List"
            title="Organize everything in your life"
            description="Whether it's work projects, personal tasks, or study plans, this app helps you organize and confidently tackle everything in your life."
            videoPosition="right"
          />

          <FeatureCard
            category="Calendar Views"
            title="Easily plan your schedule"
            description="Different calendar views like monthly, weekly, daily, and agenda offer diverse choices for planning your time more efficiently."
            videoPosition="left"
          />

          <FeatureCard
            category="Pomodoro"
            title="Track time and stay focused"
            description="Adopt the popular 'Pomodoro Technique'—break tasks into 25-minute intervals to stay focused and achieve a productive flow."
            videoPosition="right"
          />

          <FeatureCard
            category="Habit Tracker"
            title="Develop and maintain good habits"
            description="A rich habit library, flexible tracking options, and thoughtful data review help you build good habits effortlessly and lead a fulfilling life."
            videoPosition="left"
          />
        </div>
      </section>
    </main>

  );
  
}
