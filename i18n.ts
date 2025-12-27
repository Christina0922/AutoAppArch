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
  // /en 경로에서 언어 강제 고정
  // locale은 next-intl이 자동으로 pathname에서 추출한 locale
  let validLocale: Locale = normalizeLocale(locale);
  
  // pathname이 /en으로 시작하면 무조건 en으로 강제
  // (next-intl이 이미 pathname에서 locale을 추출하므로, 여기서는 추가 검증만 수행)
  if (locale === "en") {
    validLocale = "en";
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
