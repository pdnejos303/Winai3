// ─────────────────────────────────────────────────────────────
// FILE: src/components/layout/MainNav.tsx
// DESC: Navbar (Client) – แสดงลิงก์หลัก + prefetch /tasks bundle
// ─────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function MainNav() {
  const router = useRouter();
  const locale = useLocale();                     // 🔸 next-intl hook
  const taskHref = `/${locale}/app/tasks`;

  /* ⚡️ อุ่นเครื่อง bundle /tasks เมื่อ Navbar ถูก mount */
  useEffect(() => {
    router.prefetch(taskHref);
  }, [router, taskHref]);

  return (
    <nav className="flex gap-8 py-4">
      {/* ลิงก์ตัวอย่าง – เพิ่มตามต้องการ */}
      <Link href={`/${locale}`} className="hover:text-brand-green">
        Home
      </Link>

      <Link href={taskHref} className="hover:text-brand-green">
        Tasks
      </Link>

      {/* เพิ่มลิงก์อื่น ๆ … */}
    </nav>
  );
}
