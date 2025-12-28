import { getRequestConfig } from "next-intl/server";

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

/**
 * 어떤 값이 들어오든 Locale로 "안전하게" 정규화합니다.
 * - undefined / null / 기타 타입 => defaultLocale
 * - "ko" | "en" 이외 => defaultLocale
 */
export function normalizeLocale(input: unknown): Locale {
  const value = typeof input === "string" ? input : "";

  if ((locales as readonly string[]).includes(value)) {
    return value as Locale;
  }

  // 개발 중 디버깅이 필요하면 경고만 남기고 절대 throw 하지 않습니다.
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[i18n] invalid locale "${String(input)}" -> fallback to "${defaultLocale}"`);
  }

  return defaultLocale;
}

export default getRequestConfig(async ({ locale }) => {
  // ===== 단일 진실원: 라우트(pathname)가 언어를 결정 =====
  // locale은 next-intl이 pathname에서 추출한 값만 사용
  // 브라우저 언어/쿠키/localStorage는 절대 사용하지 않음
  
  // pathname이 /en으로 시작하면 무조건 en, 그 외는 무조건 ko
  const validLocale: Locale = normalizeLocale(locale);
  
  // 명확성: /en이면 en, 그 외는 ko (defaultLocale)
  const finalLocale: Locale = validLocale === "en" ? "en" : defaultLocale;

  return {
    locale: finalLocale,
    messages: (await import(`./messages/${finalLocale}.json`)).default,
  };
});
