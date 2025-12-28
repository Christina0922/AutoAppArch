"use client";

/**
 * 라우트 기반 언어 강제 가드
 * 
 * 단일 진실원: pathname이 언어를 결정
 * - /en으로 시작하면 무조건 en
 * - 그 외는 무조건 ko
 * 
 * 브라우저/쿠키/localStorage 감지는 무시
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function RouteLocaleGuard() {
  const pathname = usePathname();
  const currentLocale = useLocale();
  
  useEffect(() => {
    // pathname에서 언어 결정 (단일 진실원)
    const routeLocale: "ko" | "en" = pathname?.startsWith("/en") ? "en" : "ko";
    
    // 현재 locale이 라우트와 다르면 경고 (개발 환경)
    if (process.env.NODE_ENV === "development" && currentLocale !== routeLocale) {
      console.error(
        `[RouteLocaleGuard] 언어 불일치 감지!\n` +
        `  라우트: ${pathname}\n` +
        `  라우트 기반 언어: ${routeLocale}\n` +
        `  현재 locale: ${currentLocale}\n` +
        `  → 라우트가 언어의 단일 진실원이므로, locale이 ${routeLocale}이어야 합니다.`
      );
    }
    
    // HTML lang 속성 강제 설정
    if (typeof document !== "undefined") {
      document.documentElement.lang = routeLocale;
    }
  }, [pathname, currentLocale]);
  
  return null;
}

