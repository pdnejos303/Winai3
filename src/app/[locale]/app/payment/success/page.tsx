/****************************************************************************************
 *  Payment Success Page  –  /[locale]/app/payment/success
 *  • Server Component   (ไม่ใช้ React-Hooks)
 *  • แสดงข้อความสำเร็จ + ลิงก์กลับ Dashboard
 ****************************************************************************************/

import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata = { title: "Payment Success" };

export default async function PaymentSuccessPage() {
  // ‼️ getTranslations() ใช้ได้ใน Server Component และเป็น async
  const t = await getTranslations("payment.success");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold text-green-600">
        {t("title", { default: "Payment Successful 🎉" })}
      </h1>

      <p className="text-lg text-muted-foreground">
        {t("body", {
          default: "Thank you for your purchase! Your payment has been processed successfully.",
        })}
      </p>

      <Link
        href="/app/dashboard"
        className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700"
      >
        {t("cta", { default: "Go to Dashboard" })}
      </Link>
    </main>
  );
}
