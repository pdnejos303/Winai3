// Path: src/components/landing/PreviewSection.tsx
"use client";

import Image from "next/image";

export default function PreviewSection() {
  return (
    <section className="relative w-full px-4 py-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* ---------- เอฟเฟค Glow ฟ้า (พื้นหลัง) ---------- */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-300 opacity-30 blur-[160px] rounded-full z-0 pointer-events-none" />

      {/* ---------- Content ด้านหน้า ---------- */}
      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-center">
        <div className="relative w-full max-w-5xl">
          {/* Desktop Mockup */}
          <Image
            src="/landing/hero-desktop.png"
            alt="Dashboard Preview"
            width={1200}
            height={800}
            className="w-full h-auto rounded-2xl border shadow-xl z-10 relative"
            priority
          />

          {/* Mobile Mockup ซ้อนขวาล่าง */}
          <div className="absolute -right-10 bottom-0 w-[280px] drop-shadow-lg z-10">
            <Image
              src="/landing/hero-mobile.png"
              alt="Mobile Preview"
              width={300}
              height={600}
              className="w-full h-auto rounded-xl border"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
