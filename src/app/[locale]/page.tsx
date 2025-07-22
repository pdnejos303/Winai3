/* Path: src/app/[locale]/page.tsx
   ---------------------------------------------------------------------------
   • ตัด locale ออกจาก href (Link จะเติม /[locale] ให้อัตโนมัติเอง)
   • ไม่ต้อง await params / ไม่ต้องใช้ useParams ถ้าไม่ได้ใช้ค่าอื่น
--------------------------------------------------------------------------- */
"use client";

import { useTranslations } from "next-intl";
import { Link }            from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="flex flex-col items-center justify-center gap-6 py-20">
      <h1 className="text-3xl font-bold">{t("welcome")}</h1>

      {/* ปุ่มเขียวไป Login — ไม่มี /en/en ซ้ำแล้ว */}
      <Link
        href="/login"                                /* ➜ /en/login, /th/login ... */
        className="rounded bg-brand-green px-4 py-2 text-white transition hover:opacity-90"
      >
        {t("goLogin")}
      </Link>
    </main>
  );
}
