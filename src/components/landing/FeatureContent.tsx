// ─────────────────────────────────────────────────────────────
// FILE: src/components/landing/FeatureContent.tsx
// DESC: แสดงภาพตัวอย่าง + รายการ feature ย่อยตาม tab ที่เลือก
// PROPS:
//  - imageDesktop: path รูป desktop
//  - imageMobile: path รูป mobile
//  - items: รายการย่อย (bullet list)
// ─────────────────────────────────────────────────────────────

import Image from "next/image";

type Props = {
  imageDesktop: string;
  imageMobile: string;
  items: string[]; // แสดง bullet
};

export default function FeatureContent({
  imageDesktop,
  imageMobile,
  items,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
      {/* รูปตัวอย่างฝั่งซ้าย */}
      <div className="flex-shrink-0 relative w-[300px] h-[200px] md:w-[420px] md:h-[280px]">
        <Image
          src={imageDesktop}
          alt="Desktop Preview"
          fill
          className="rounded-xl object-contain shadow"
        />
        <Image
          src={imageMobile}
          alt="Mobile Preview"
          width={80}
          height={140}
          className="absolute -bottom-4 -right-4 border-4 border-white rounded-lg shadow-md bg-white"
        />
      </div>

      {/* รายการ bullet list ฝั่งขวา */}
      <ul className="text-left space-y-3 max-w-md">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
