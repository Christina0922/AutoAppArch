import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ko", "en"] as const;
const defaultLocale = "ko";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // next 내부, api, 정적파일 제외
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return;
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
