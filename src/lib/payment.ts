/****************************************************************************************
 *  Helper: createPaymentRecord
 *  ---------------------------------
 *  ใช้บันทึกข้อมูล Payment ลงฐาน PostgreSQL ผ่าน Prisma
 *  - ผูกกับ User ผ่าน userId (FK)
 *  - เก็บ amount (สตางค์), currency, stripeSessionId
 *  - ค่า status เริ่มต้นเป็น PENDING  (enum PaymentStatus อยู่ใน schema)
 *
 *  การเรียกใช้ (ตัวอย่างใน /api/payment/create-session/route.ts):
 *    await createPaymentRecord({
 *      stripeSessionId: stripeSession.id,
 *      amount: 5000,
 *      currency: "THB",
 *      userId: session.user!.id,
 *    });
 ****************************************************************************************/

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface NewPaymentInput {
  stripeSessionId: string;
  amount: number;
  currency: string;
  userId: number;
}

export async function createPaymentRecord(input: NewPaymentInput) {
  const data: Prisma.PaymentUncheckedCreateInput = {
    stripeSessionId: input.stripeSessionId,
    amount: input.amount,
    currency: input.currency,
    userId: input.userId,
    // status = PENDING โดย default จาก schema ไม่ต้องใส่ซ้ำ
  };

  return prisma.payment.create({ data });
}
