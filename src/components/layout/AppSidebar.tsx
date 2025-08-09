/****************************************************************************************
 *  AppSidebar  –  เมนูด้านซ้าย (Desktop + Mobile Slide)
 *  ------------------------------------------------------------------------------------
 *  ● แสดงเฉพาะผู้ใช้ที่ login (useSession)
 *  ● Hamburger toggle ถูกควบคุมผ่าน prop open / setOpen  (รับมาจาก layout)
 *  ● ปุ่ม "Upgrade to Pro" → ลิงก์ไปหน้าเลือกแพ็กเกจ  /pricing
 ****************************************************************************************/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ListChecks,
  Calendar,
  Dumbbell,
  User,
  Settings,
} from "lucide-react";
import Image from "next/image";

type Props = { open: boolean; setOpen: (b: boolean) => void };

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/tasks", label: "My Tasks", icon: ListChecks },
  { href: "/app/calendar", label: "Calendar", icon: Calendar },
  { href: "/app/habits", label: "Habits", icon: Dumbbell },
  { href: "/app/profile", label: "Profile", icon: User },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default function AppSidebar({ open, setOpen }: Props) {
  /* ─── auth & route ─── */
  const { data: session, status } = useSession();
  const pathname = usePathname();
  if (status !== "authenticated") return null;

  const isActive = (href: string) => pathname?.startsWith(href);

  /* ─── UI ─── */
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-zinc-900 p-4 shadow-lg
        transition-transform md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* User card */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <Image
          src={session.user?.image ?? "/avatar-placeholder.png"}
          alt="avatar"
          width={80}
          height={80}
          className="rounded-full border border-zinc-700"
        />
        <h2 className="text-lg font-semibold text-white">
          {session.user?.name ?? "User"}
        </h2>
        <p className="text-sm text-zinc-400">Productivity Master</p>

        {/* Level bar (mock) */}
        <div className="mt-2 w-full">
          <div className="mb-1 flex justify-between text-xs text-zinc-400">
            <span>Level&nbsp;5</span>
            <span>1,200 / 1,500&nbsp;XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-700">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: "80%" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="mt-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
              ${
                isActive(href)
                  ? "bg-blue-600 text-white"
                  : "text-zinc-200 hover:bg-zinc-800"
              }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Upgrade box → ไปหน้า /pricing */}
      <div className="mt-8 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-4">
        <h3 className="text-sm font-semibold text-white">Upgrade to Pro</h3>
        <p className="mb-3 text-xs text-zinc-300">
          Get access to all premium features
        </p>

        <Link
          href="/pricing"
          onClick={() => setOpen(false)}
          className="block w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-600
            py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
        >
          View Plans
        </Link>
      </div>
    </aside>
  );
}
