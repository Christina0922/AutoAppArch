import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ko", "en"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "ko";

function hasLocalePrefix(pathname: string) {
  return locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
}

function getLocaleFromReferer(req: NextRequest): Locale | null {
  const ref = req.headers.get("referer");
  if (!ref) return null;
  try {
    const u = new URL(ref);
    const p = u.pathname;
    if (p === "/en" || p.startsWith("/en/")) return "en";
    if (p === "/ko" || p.startsWith("/ko/")) return "ko";
    return null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // next 내부, api, 정적파일 제외
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return;
  }

  // 이미 /ko 또는 /en이면 통과 (하지만 쿠키는 설정)
  if (hasLocalePrefix(pathname)) {
    // /en 또는 /ko 경로로 직접 접속한 경우 쿠키도 설정
    const detectedLocale: Locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";
    const response = NextResponse.next();
    // 쿠키가 없거나 다르면 업데이트
    const currentCookie = req.cookies.get("NEXT_LOCALE")?.value;
    if (currentCookie !== detectedLocale) {
      response.cookies.set("NEXT_LOCALE", detectedLocale, { path: "/" });
    }
    return response;
  }

  // ✅ 여기부터: locale 없는 경로를 어느 언어로 보낼지 결정
  // 1) 쿠키 (있으면 우선)
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value as Locale | undefined;
  const cookieHit = cookieLocale && (cookieLocale === "ko" || cookieLocale === "en") ? cookieLocale : null;

  // 2) referer 기반 (EN 화면에서 locale 없는 링크를 눌러도 EN 유지)
  const refHit = getLocaleFromReferer(req);

  const chosen: Locale = cookieHit ?? refHit ?? defaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${chosen}${pathname}`;

  const res = NextResponse.redirect(url);
  // 다음 요청부터 유지되도록 쿠키 저장
  res.cookies.set("NEXT_LOCALE", chosen, { path: "/" });
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
