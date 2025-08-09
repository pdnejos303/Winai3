/****************************************************************************************
 *  FeatureTable - ตารางเปรียบเทียบฟีเจอร์ (Free / Pro / Elite)
 *  ------------------------------------------------------------------------------------
 *  ✓ = รวมอยู่ในแพ็กเกจ      ✗ = ไม่มีในแพ็กเกจ
 *  ค่า string (เช่น “พื้นฐาน”, “10 000”) แสดงแทน ✓/✗ เมื่อมีความหมายเฉพาะ
 ****************************************************************************************/

import { CheckCircle2, XCircle } from "lucide-react";

type Cell = { value: string | boolean };   // true=✓ false=✗ string=text
type Row  = { feature: string; free: Cell; pro: Cell; elite: Cell };

const rows: Row[] = [
  { feature: "Task Management",    free: { value: true },  pro: { value: true },  elite: { value: true } },
  { feature: "Calendar View",      free: { value: true },  pro: { value: true },  elite: { value: true } },
  { feature: "Dashboard",          free: { value: "พื้นฐาน" }, pro: { value: "สรุปสถิติ" }, elite: { value: "ปรับแต่งได้" } },
  { feature: "AI Assistant",       free: { value: false }, pro: { value: true },  elite: { value: true } },
  { feature: "Habit Tracker",      free: { value: false }, pro: { value: true },  elite: { value: true } },
  { feature: "จำนวน To-Do สูงสุด", free: { value: "500" }, pro: { value: "10 000" }, elite: { value: "ไม่จำกัด" } },
  { feature: "Team Collaboration", free: { value: false }, pro: { value: true },  elite: { value: true } },
  { feature: "Priority System",    free: { value: false }, pro: { value: true },  elite: { value: true } },
  { feature: "Time Tracking",      free: { value: false }, pro: { value: true },  elite: { value: true } },
  { feature: "Gamification System",free: { value: false }, pro: { value: true },  elite: { value: true } },
  { feature: "Advanced Analytics", free: { value: false }, pro: { value: false }, elite: { value: true } },
  { feature: "Priority Support",   free: { value: false }, pro: { value: false }, elite: { value: true } },
  { feature: "API Integration",    free: { value: false }, pro: { value: false }, elite: { value: true } },
];

function renderCell(cell: Cell) {
  if (typeof cell.value === "boolean") {
    return cell.value ? (
      <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
    ) : (
      <XCircle className="mx-auto h-5 w-5 text-rose-500" />
    );
  }
  return <span className="block text-center">{cell.value}</span>;
}

export default function FeatureTable() {
  return (
    <section className="mt-20">
      <h2 className="mb-6 text-center text-2xl font-semibold">
        เปรียบเทียบฟีเจอร์
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm font-semibold">
              <th className="w-1/3 px-4 py-2">ฟีเจอร์</th>
              <th className="px-4 py-2 text-center">Free</th>
              <th className="bg-primary/10 px-4 py-2 text-center">Pro</th>
              <th className="px-4 py-2 text-center">Elite</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((row) => (
              <tr key={row.feature} className="odd:bg-zinc-50 even:bg-white dark:odd:bg-zinc-800 dark:even:bg-zinc-900">
                <td className="px-4 py-2">{row.feature}</td>
                <td className="px-4 py-2">{renderCell(row.free)}</td>
                <td className="bg-primary/10 px-4 py-2">{renderCell(row.pro)}</td>
                <td className="px-4 py-2">{renderCell(row.elite)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
