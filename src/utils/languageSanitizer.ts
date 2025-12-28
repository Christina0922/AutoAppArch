// src/utils/languageSanitizer.ts
/**
 * 언어 정제 유틸: EN에서는 한글을, KO에서는 영어 과다 사용을 감지하고 재생성 유도
 */

export type Locale = "ko" | "en";

const KOREAN_REGEX = /[가-힣]/;
const ENGLISH_REGEX = /[A-Za-z]/;

/**
 * 문자열에 한글이 포함되어 있는지 확인
 */
export function containsKorean(text: string): boolean {
  return KOREAN_REGEX.test(text);
}

/**
 * 문자열에 영어가 포함되어 있는지 확인
 */
export function containsEnglish(text: string): boolean {
  return ENGLISH_REGEX.test(text);
}

/**
 * EN 로케일인데 한글이 포함된 경우 감지
 * @param text 검사할 텍스트
 * @param locale 현재 로케일
 * @returns 한글이 포함되어 있고 locale이 "en"이면 true
 */
export function shouldSanitizeForEn(text: string, locale: Locale): boolean {
  return locale === "en" && containsKorean(text);
}

/**
 * KO 로케일인데 영어가 과도하게 포함된 경우 감지 (특정 패턴은 허용)
 * @param text 검사할 텍스트
 * @param locale 현재 로케일
 * @returns 영어가 과도하게 포함되어 있고 locale이 "ko"이면 true
 */
export function shouldSanitizeForKo(text: string, locale: Locale): boolean {
  if (locale !== "ko") return false;
  
  // 전체 텍스트에서 한글을 제거한 후 남은 부분의 비율 계산
  const textWithoutKorean = text.replace(KOREAN_REGEX, "").trim();
  if (textWithoutKorean.length === 0) return false;
  
  // 영어만으로 구성된 단어/문장이 과도한 경우 (50% 이상)
  const totalLength = text.length;
  const englishOnlyLength = textWithoutKorean.length;
  const ratio = englishOnlyLength / totalLength;
  
  // 단일 단어나 짧은 텍스트는 허용 (예: "API", "MVP", "Node.js")
  if (totalLength < 20 && !text.match(/\b(?:[A-Z][a-z]*\s*){3,}\b/)) {
    return false;
  }
  
  return ratio > 0.5 && containsEnglish(text);
}

/**
 * 객체/배열 구조에서 모든 문자열 값을 재귀적으로 검사
 * @param obj 검사할 객체/배열/문자열
 * @param locale 현재 로케일
 * @returns 문제가 있는 문자열 경로 배열
 */
export function findLanguageViolations(
  obj: unknown,
  locale: Locale,
  path: string = ""
): string[] {
  const violations: string[] = [];
  
  if (typeof obj === "string") {
    if (shouldSanitizeForEn(obj, locale) || shouldSanitizeForKo(obj, locale)) {
      violations.push(path || "root");
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      violations.push(...findLanguageViolations(item, locale, `${path}[${index}]`));
    });
  } else if (obj && typeof obj === "object") {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      violations.push(...findLanguageViolations(value, locale, newPath));
    });
  }
  
  return violations;
}

/**
 * 개발환경에서 언어 위반을 감지하고 콘솔에 경고 출력
 * @param data 검사할 데이터
 * @param locale 현재 로케일
 * @param context 컨텍스트 정보 (디버깅용)
 */
export function warnLanguageViolations(
  data: unknown,
  locale: Locale,
  context?: string
): void {
  if (process.env.NODE_ENV === "production") return;
  
  const violations = findLanguageViolations(data, locale);
  
  if (violations.length > 0) {
    console.error(
      `[LanguageSanitizer] Language violations detected for locale "${locale}"${context ? ` in ${context}` : ""}:\n` +
      `Violations: ${violations.slice(0, 10).join(", ")}${violations.length > 10 ? ` ... (${violations.length} total)` : ""}`
    );
  }
}

