"use client";

/****************************************************************************************
 *  AppLayout  (หลัง Login)
 *  -----------------------------------------------
 *  1. ไม่มี Header ซ้ำซ้อนแล้ว  (Header ดั้งเดิมของโปรเจคยังทำงานตามปกติ)
 *  2. ไม่เซ็ตพื้นหลังดำ  (bg-zinc-950 ถูกนำออก)
 *  3. Sidebar แสดงคงที่บน Desktop (md:pl-72 ชดเชยช่องว่าง)
 *     - บน Mobile ซ่อนตามค่า `open={false}`  (ไม่มี hamburger toggle ที่นี่)
 ****************************************************************************************/

import { Inter } from "next/font/google";
import ClientProvider from "@/components/ui/ClientProvider";
import AppSidebar from "@/components/layout/AppSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} flex min-h-screen`}>
      {/* Sidebar — fixed ด้านซ้าย (md up) */}
      <AppSidebar open={false} setOpen={() => { /* no toggle here */ }} />

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:pl-72">
        <ClientProvider>{children}</ClientProvider>
      </main>
    </div>
  );
}
