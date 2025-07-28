/* src/app/[locale]/layout.tsx */
import "../globals.css";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import ClientProvider from "@/components/ui/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Winai2", description: "Task manager" };

export default async function RootLayout({
  children,
  params,                        // <-- Promise version
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  /* ต้อง await ก่อนใช้ params ตาม spec Next15 */
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={inter.className}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProvider>
            <Header />
            {children}
          </ClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
