// utils/localePath.ts
export type Locale = "ko" | "en";

const LOCALES: Locale[] = ["ko", "en"];

export function getLocaleFromPathname(pathname: string): Locale | null {
  const p = pathname || "/";
  for (const l of LOCALES) {
    if (p === `/${l}` || p.startsWith(`/${l}/`)) return l;
  }
  return null;
}

// "/history" + "en" => "/en/history"
// "/en/history" + "en" => "/en/history"
// "/ko/history" + "en" => "/en/history"
export function withLocalePrefix(pathnameOrHref: string, locale: Locale, currentPathnameForWarn?: string): string {
  const raw = (pathnameOrHref || "/").startsWith("/") ? pathnameOrHref : `/${pathnameOrHref}`;
  const detected = getLocaleFromPathname(raw);

  if (!detected) {
    // locale prefix가 없는 링크는 버그 원인. EN 화면이면 경고.
    if (currentPathnameForWarn && getLocaleFromPathname(currentPathnameForWarn) === "en") {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[localePath] locale-less navigation detected on EN page: "${raw}"`);
      }
    }
    return `/${locale}${raw === "/" ? "" : raw}`;
  }

  if (detected === locale) return raw;

  // 앞의 "/ko" 또는 "/en"만 교체
  return raw.replace(/^\/(ko|en)(?=\/|$)/, `/${locale}`);
}

// 현재 경로 유지한 채 언어만 바꿈
export function swapLocaleInPathname(currentPathname: string, targetLocale: Locale): string {
  const cur = currentPathname || "/";
  return withLocalePrefix(cur, targetLocale, cur);
}

