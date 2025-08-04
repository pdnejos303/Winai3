/* ─────────────────────────────────────────────────────────────
 * FILE: src/app/[locale]/layout.tsx
 * DESC: RootLayout สำหรับทุก locale – await params (Promise)
 *       ใส่ Header, MainNav, และ Provider ต่าง ๆ
 * ───────────────────────────────────────────────────────────── */
import "../globals.css";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/components/layout/Header";
import MainNav from "@/components/layout/MainNav";
import ClientProvider from "@/components/ui/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Winai2", description: "Task manager" };

export default async function RootLayout({
  children,
  params,                                // ← Promise ตาม spec
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  /* ตาม Next 15 ต้อง await ก่อนใช้ */
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProvider>
            {/* ส่วนหัวเว็บ */}
            <Header />

            {/* Navbar – มี prefetch /tasks ภายใน */}
            <MainNav />

            {/* เนื้อหาหน้าแต่ละ route */}
            {children}
          </ClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
