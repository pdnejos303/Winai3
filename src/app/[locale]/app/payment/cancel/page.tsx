/* ─────────────────────────────────────────────────────────────
 *  URL   : /[locale]/payment/cancel
 *  Desc  : แจ้งผู้ใช้ว่า “ยกเลิกการชำระเงิน”  พร้อมลิงก์ย้อนกลับ
 * ────────────────────────────────────────────────────────────*/
import Link from "next/link";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Payment Canceled",
};

export default function PaymentCancelPage() {
  const t = useTranslations("payment.cancel");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold text-red-600">
        {t("title", { default: "Payment Canceled ❌" })}
      </h1>

      <p className="text-lg text-muted-foreground">
        {t("body", {
          default:
            "It looks like you canceled the checkout. No worries — you can try again anytime.",
        })}
      </p>

      <Link
        href="/pricing"
        className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
      >
        {t("cta", { default: "Return to Pricing" })}
      </Link>
    </main>
  );
}
