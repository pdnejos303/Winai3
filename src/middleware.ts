/* ────────────────────────────────────────────────────────────────────────────
 * FILE:  src/middleware.ts
 * DESC:  Global Edge Middleware
 *        A) Locale guard + redirect  (เฉพาะ “หน้าเว็บ” )
 *        B) ป้องกันไม่ให้เข้าหน้า /app/** ถ้ายังไม่ได้ Login
 *        C) DEV-only in-memory rate-limit (50 req / 60 s / IP) สำหรับ /api
 * ──────────────────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";

/* ---------- A) Locale prefix ---------- */
const LOCALES = ["en", "th", "ja"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "en";

/* ---------- C) Rate-limit (DEV-only) ---------- */
type Hit = { count: number; ts: number };
const hits = new Map<string, Hit>();
const LIMIT = 50;
const WINDOW = 60_000; // ms = 1 minute

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api");
  const segments = pathname.split("/").filter(Boolean);
  const firstSeg = segments[0];

  /* ------------------------------------------------------------------------
   * A) 🌐 Locale Redirect
   *     - ถ้าเข้า / → redirect ไป /en
   *     - ถ้า path ไม่ได้ขึ้นต้นด้วย locale เช่น /login → /en/login
   *     - ทำเฉพาะ path ที่ไม่ใช่ /api
   * ------------------------------------------------------------------------ */
  if (!isApi) {
    if (!firstSeg) {
      const url = req.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}`;
      return NextResponse.redirect(url);
    }

    if (!LOCALES.includes(firstSeg as Locale)) {
      const url = req.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  /* ------------------------------------------------------------------------
   * B) 🔐 ป้องกันเส้นทาง /app/** ถ้ายังไม่ได้ Login
   *     - ใช้ cookie ตรวจว่า login อยู่หรือไม่ (NextAuth)
   *     - ย้ายไป /[locale]/login ถ้ายังไม่มี token
   * ------------------------------------------------------------------------ */
  const isAppRoute = pathname.includes("/app");
  const token =
    req.cookies.get("next-auth.session-token")?.value ??
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (isAppRoute && !token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}/login`;
    return NextResponse.redirect(url);
  }

  /* ------------------------------------------------------------------------
   * C) 🧪 DEV Rate Limit (เฉพาะ /api ยกเว้น /api/auth/*)
   *     - จำกัด 50 requests ต่อ 60 วิ ต่อ IP
   *     - ใช้ in-memory map (ลบเมื่อหมดเวลา)
   * ------------------------------------------------------------------------ */
  if (isApi && !pathname.startsWith("/api/auth/")) {
    const reqWithIP = req as NextRequest & { ip?: string };
    const ip =
      reqWithIP.ip ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const now = Date.now();
    const rec = hits.get(ip) ?? { count: 0, ts: now };

    if (now - rec.ts > WINDOW) {
      rec.count = 0;
      rec.ts = now;
    }
    rec.count += 1;
    hits.set(ip, rec);

    if (rec.count > LIMIT) {
      const headers = {
        "X-RateLimit-Limit": String(LIMIT),
        "X-RateLimit-Remaining": "0",
        "Retry-After": String(Math.ceil((WINDOW - (now - rec.ts)) / 1000)),
      } as const;

      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers }
      );
    }

    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Limit", String(LIMIT));
    res.headers.set("X-RateLimit-Remaining", String(Math.max(0, LIMIT - rec.count)));
    return res;
  }

  /* ------------------------------------------------------------------------
   * D) Default – ปล่อยผ่านทุกอย่าง
   * ------------------------------------------------------------------------ */
  return NextResponse.next();
}

/* --------------------------------------------------------------------------
 *  Apply middleware กับทุก route (ยกเว้น asset ระบบ)
 * -------------------------------------------------------------------------- */
export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|images|static).*)"],
};
