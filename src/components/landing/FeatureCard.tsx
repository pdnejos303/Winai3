// Path: src/components/landing/FeatureCard.tsx
import clsx from "clsx";

interface Props {
  category: string;
  title: string;
  description: string;
  videoPosition?: "left" | "right";
}

export default function FeatureCard({
  category,
  title,
  description,
  videoPosition = "right",
}: Props) {
  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6 items-center">
      {/* ฝั่งข้อความ */}
      <div className={clsx("flex-1", videoPosition === "left" && "md:order-2")}>
        <p className="text-sm text-blue-600 font-medium mb-2">{category}</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
      </div>

      {/* ฝั่งวิดีโอ placeholder */}
      <div
        className={clsx(
          "flex-1 w-full h-48 md:h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg",
          videoPosition === "left" && "md:order-1"
        )}
      >
        Put Video การใช้งาน
      </div>
    </div>
  );
}
