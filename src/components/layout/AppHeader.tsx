/****************************************************************************************
 *  AppHeader
 *  ----------
 *  • แถบบนสุด มี Hamburger สำหรับเปิด/ปิด Sidebar
 *  • แสดงเฉพาะผู้ที่ login
 ****************************************************************************************/

"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Props = { toggleSidebar: () => void };

export default function AppHeader({ toggleSidebar }: Props) {
  const { data: session, status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 bg-zinc-900 px-4 shadow md:pl-72">
      {/* Hamburger – visible all screens */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="rounded-md p-2 text-zinc-200 hover:bg-zinc-800 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <span className="text-lg font-semibold text-white">Winai3</span>

      {/* avatar right side */}
      <div className="ml-auto flex items-center">
        <Image
          src={session.user?.image ?? "/avatar-placeholder.png"}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    </header>
  );
}
