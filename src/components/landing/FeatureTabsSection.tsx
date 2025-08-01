// ─────────────────────────────────────────────────────────────
// FILE: src/components/landing/FeatureTabsSection.tsx
// DESC: Section เดียวจบสำหรับ Feature Tab Selector ทั้งปุ่ม + รูป + รายการ
// ─────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CalendarDays, LayoutPanelLeft, Timer, ListChecks } from "lucide-react";

// ---------- โครงสร้างข้อมูลของ Tab ----------
type FeatureTabKey = "calendar" | "kanban" | "timeline" | "matrix";

const tabs: {
  key: FeatureTabKey;
  label: string;
  icon: React.ReactNode,
  desktopImg: string;
  mobileImg: string;
  bullets: string[];
}[] = [
  {
    key: "calendar",
    label: "Calendar",
    icon: <CalendarDays className="w-5 h-5" />,
    desktopImg: "/images/features/calendar-desktop.png",
    mobileImg: "/images/features/calendar-mobile.png",
    bullets: [
      "🗓 Monthly View – gives a clear overall layout.",
      "📆 Weekly View – clarifies busy and free intervals.",
      "📝 Agenda View – ensures tasks are executed in order.",
      "🔄 Multi-Day View – enables dynamic adjustments.",
      "↔️ Multi-Week View – lets you shift weeks for changes.",
    ],
  },
  {
    key: "kanban",
    label: "Kanban",
    icon: <LayoutPanelLeft className="w-5 h-5" />,
    desktopImg: "/images/features/kanban-desktop.png",
    mobileImg: "/images/features/kanban-mobile.png",
    bullets: [
      "🎯 Drag & drop to organize tasks by phase.",
      "📍 Customize columns for different workflows.",
      "👥 Assign members to specific cards.",
      "✅ Mark progress visually and fast.",
      "💬 Collaborate through comments on each card.",
    ],
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: <Timer className="w-5 h-5" />,
    desktopImg: "/images/features/timeline-desktop.png",
    mobileImg: "/images/features/timeline-mobile.png",
    bullets: [
      "🕒 Set start and due dates per task.",
      "📅 Zoom by day/week/month scale.",
      "🔗 Link dependencies between tasks.",
      "📊 Highlight project progress visually.",
      "📤 Export views for reporting use.",
    ],
  },
  {
    key: "matrix",
    label: "Matrix",
    icon: <ListChecks className="w-5 h-5" />,
    desktopImg: "/images/features/matrix-desktop.png",
    mobileImg: "/images/features/matrix-mobile.png",
    bullets: [
      "🧠 Quadrant-based task prioritization.",
      "🔥 Focus on urgent-important quadrant.",
      "🧹 Delegate or delete low-priority tasks.",
      "🔄 Rebalance priorities daily.",
      "💡 Make decisions faster with visual clarity.",
    ],
  },
];

export default function FeatureTabsSection() {
  const t = useTranslations("home.features");
  const [selected, setSelected] = useState<FeatureTabKey>("calendar");

  const activeTab = tabs.find((tab) => tab.key === selected)!;

  return (
    <section className="w-full bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("headline")}
          </h2>
          <p className="mt-3 text-lg text-blue-600">{t("subtext")}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelected(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border border-transparent
                ${selected === tab.key ? "bg-blue-100 text-blue-700 shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* รูปภาพด้านซ้าย */}
          <div className="flex flex-col items-center justify-center">
            <Image
              src={activeTab.desktopImg}
              alt="Desktop preview"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full"
            />
            <Image
              src={activeTab.mobileImg}
              alt="Mobile preview"
              width={300}
              height={200}
              className="rounded-lg mt-4 shadow w-2/3"
            />
          </div>

          {/* รายการ feature bullet ด้านขวา */}
          <ul className="self-center space-y-3 text-gray-700 text-base">
            {activeTab.bullets.map((line, idx) => (
              <li key={idx} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
