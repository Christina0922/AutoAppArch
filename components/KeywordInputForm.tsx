"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AppType } from "@/lib/types"; // AppType은 "app"만 허용

interface KeywordInputFormProps {
  onSubmit: (keywords: string[], selectedType: AppType) => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

// 키워드 정규화 함수 (쉼표, 공백, 줄바꿈을 콤마 기준으로 정리)
const normalizeKeywords = (input: string): string[] => {
  return input
    .split(/[,\n\r]+/)
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
};

export default function KeywordInputForm({
  onSubmit,
  isLoading = false,
  loadingMessage = "",
}: KeywordInputFormProps) {
  const t = useTranslations("keywordInput");
  const tCommon = useTranslations("common");
  const [keywordInput, setKeywordInput] = useState("");
  const [validationError, setValidationError] = useState("");

  // 번역 파일에서 예시 가져오기
  const exampleChips = t.raw("examples") as Array<{ text: string; keywords: string[] }>;

  const handleExampleClick = (keywords: string[]) => {
    setKeywordInput(keywords.join(", "));
    setValidationError("");
  };

  const handleInputChange = (value: string) => {
    setKeywordInput(value);
    setValidationError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 로딩 중이면 중복 제출 방지
    if (isLoading) {
      return;
    }
    
    // 정규화
    const normalized = normalizeKeywords(keywordInput);
    
    // 검증
    if (normalized.length === 0) {
      setValidationError(t("errorMinKeywords"));
      return;
    }
    
    if (normalized.length === 1) {
      // 경고만 표시하고 계속 진행 가능
    }
    
    if (normalized.length > 6) {
      setValidationError(t("errorMaxKeywords"));
      return;
    }
    
    // 각 키워드 길이 검증
    const tooLong = normalized.find((k) => k.length > 20);
    if (tooLong) {
      setValidationError(t("errorKeywordLength"));
      return;
    }
    
    setValidationError("");
    onSubmit(normalized, "app"); // 모바일 앱만 지원
  };

  const isValid = normalizeKeywords(keywordInput).length > 0 && 
                  normalizeKeywords(keywordInput).length <= 6 &&
                  !normalizeKeywords(keywordInput).some((k) => k.length > 20);

  const tMobile = useTranslations("common");
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="text-xs text-gray-500 mb-4">{tMobile("mobileAppArchitecture")}</p>
      </div>

      <div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            {t("title")}
          </p>
          {/* 예시 칩 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {exampleChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(chip.keywords)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`${t("exampleAria")}: ${chip.text}`}
              >
                {chip.text}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label htmlFor="keyword-input" className="sr-only">
            {t("labelAria")}
          </label>
          <textarea
            id="keyword-input"
            value={keywordInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white resize-none"
            rows={3}
            disabled={isLoading}
            aria-label={t("labelAria")}
            aria-describedby={validationError ? "keyword-error" : normalizeKeywords(keywordInput).length === 1 ? "keyword-warning" : undefined}
            aria-invalid={!!validationError}
          />
          {validationError && (
            <p id="keyword-error" className="text-sm text-red-600" role="alert">
              {validationError}
            </p>
          )}
          {normalizeKeywords(keywordInput).length === 1 && !validationError && (
            <p id="keyword-warning" className="text-sm text-amber-600">
              {t("warningSingleKeyword")}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        aria-label={isLoading ? t("buttonAriaGenerating") : t("buttonAria")}
      >
        {isLoading ? loadingMessage || t("generating") : t("submitButton")}
      </button>
    </form>
  );
}
