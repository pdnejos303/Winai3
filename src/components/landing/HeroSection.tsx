// ─────────────────────────────────────────────────────────────
// FILE: src/components/landing/HeroSection.tsx
// DESC: ส่วนบนสุดของ Landing Page – Headline + Description + CTA
// ─────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full px-4 pt-24 pb-16 text-center md:pt-32 bg-gradient-to-b from-white to-blue-50">
      {/* ---------- Heading ใหญ่ ---------- */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Stay Organized, <br className="hidden sm:inline" />
        <span className="text-blue-600">Stay Creative</span>
      </h1>

      {/* ---------- คำอธิบายใต้หัวข้อ ---------- */}
      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        Join millions of people to capture ideas, organize life, and do something creative.
      </p>

      {/* ---------- ปุ่ม CTA สองปุ่ม ---------- */}
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <Link href="/en/login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-6 py-3 rounded-lg transition">
            Get Started
          </button>
        </Link>
        <Link href="#download">
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-lg font-medium px-6 py-3 rounded-lg transition">
            Download
          </button>
        </Link>
      </div>
    </section>
  );
}
