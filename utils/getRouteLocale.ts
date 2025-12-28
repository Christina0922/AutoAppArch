// utils/getRouteLocale.ts
/**
 * 라우트(pathname) 기반으로 로케일을 결정하는 단일 진실 원(Source of Truth)
 * 프로젝트 전체에서 이 함수만 사용하여 로케일을 결정한다.
 */
export type Locale = "ko" | "en";

export function getRouteLocale(pathname: string | null | undefined): Locale {
  const path = pathname || "/";
  
  // /en으로 시작하면 "en"
  if (path.startsWith("/en") && (path === "/en" || path.startsWith("/en/"))) {
    return "en";
  }
  
  // 그 외는 모두 "ko"
  return "ko";
}

