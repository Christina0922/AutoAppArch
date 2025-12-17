"use client";

import { useState } from "react";

interface KeywordInputFormProps {
  onSubmit: (keywords: string[], selectedType: "app" | "web") => void;
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
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedType, setSelectedType] = useState<"app" | "web">("app");
  const [validationError, setValidationError] = useState("");

  const exampleChips = [
    { text: "영어, 공부", keywords: ["영어", "공부"] },
    { text: "분실물, 지도", keywords: ["분실물", "지도"] },
    { text: "다이어트, 기록", keywords: ["다이어트", "기록"] },
  ];

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
    
    // 정규화
    const normalized = normalizeKeywords(keywordInput);
    
    // 검증
    if (normalized.length === 0) {
      setValidationError("최소 1개 이상의 키워드를 입력해주세요.");
      return;
    }
    
    if (normalized.length === 1) {
      setValidationError("2개 이상의 키워드를 권장합니다. (현재: 1개)");
      // 경고만 표시하고 계속 진행 가능
    }
    
    if (normalized.length > 6) {
      setValidationError("키워드는 최대 6개까지 입력 가능합니다.");
      return;
    }
    
    // 각 키워드 길이 검증
    const tooLong = normalized.find((k) => k.length > 20);
    if (tooLong) {
      setValidationError("키워드는 20자 이하로 입력해주세요.");
      return;
    }
    
    setValidationError("");
    onSubmit(normalized, selectedType);
  };

  const isValid = normalizeKeywords(keywordInput).length > 0 && 
                  normalizeKeywords(keywordInput).length <= 6 &&
                  !normalizeKeywords(keywordInput).some((k) => k.length > 20);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          앱 유형 선택
        </label>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="app"
              checked={selectedType === "app"}
              onChange={(e) => setSelectedType(e.target.value as "app" | "web")}
              className="mr-3 w-4 h-4 text-gray-900 focus:ring-gray-900"
              disabled={isLoading}
            />
            <span className="text-base text-gray-600">모바일 앱</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="web"
              checked={selectedType === "web"}
              onChange={(e) => setSelectedType(e.target.value as "app" | "web")}
              className="mr-3 w-4 h-4 text-gray-900 focus:ring-gray-900"
              disabled={isLoading}
            />
            <span className="text-base text-gray-600">웹 서비스</span>
          </label>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-900 mb-2">
            단어(<span className="text-gray-600">키워드</span>) 몇 개만 입력하세요
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
              >
                {chip.text}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <textarea
            value={keywordInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="예: 영어, 공부 / 분실물, 지도 / 다이어트, 기록"
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white resize-none"
            rows={3}
            disabled={isLoading}
          />
          {validationError && (
            <p className="text-sm text-red-600">{validationError}</p>
          )}
          {normalizeKeywords(keywordInput).length === 1 && !validationError && (
            <p className="text-sm text-amber-600">
              💡 2개 이상의 키워드를 권장합니다. 더 정확한 설계안이 생성됩니다.
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? loadingMessage || "생성 중..." : "앱 설계안 자동 생성하기"}
      </button>
    </form>
  );
}
