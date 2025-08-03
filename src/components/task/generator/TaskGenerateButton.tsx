// ─────────────────────────────────────────────────────────────
// FILE:  src/components/task/generator/TaskGenerateButton.tsx
// DESC:  ปุ่มเรียก GPT เพื่อ Generate งานจากข้อความยาว
//        • รับ props จาก parent เท่านั้น (ไม่อ่าน input โดยตรง)
//        • ถ้ามี loading หรือ disabled ⇒ ปิดปุ่ม
// ─────────────────────────────────────────────────────────────

"use client";

import { Loader2, Sparkles } from "lucide-react";
import React from "react";

/** Props ที่ปุ่มต้องการ */
type Props = {
  /** สถานะโหลด (กำลังเรียก GPT) */
  loading: boolean;
  /** true ถ้าควรปิดปุ่ม (เช่น input ว่าง) */
  disabled: boolean;
  /** ฟังก์ชันที่ยิงตอนกดปุ่ม */
  onClick: () => void;
};

/**
 * ปุ่ม “Generate Tasks with AI”
 *  - แสดง Icon + เปลี่ยนข้อความขณะโหลด
 *  - ใช้ Tailwind class ทำสี + disabled style
 */
export default function TaskGenerateButton({
  loading,
  disabled,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                 rounded-md text-white transition
                 bg-blue-600 hover:bg-blue-700
                 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          {/* ไอคอนหมุนขณะโหลด */}
          <Loader2 className="h-4 w-4 animate-spin" />
          กำลังสร้าง...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Tasks with AI
        </>
      )}
    </button>
  );
}
