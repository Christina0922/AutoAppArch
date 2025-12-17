"use client";

import { useState } from "react";

interface KeywordInputFormProps {
  onSubmit: (keywords: string[], selectedType: "app" | "web") => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

export default function KeywordInputForm({
  onSubmit,
  isLoading = false,
  loadingMessage = "",
}: KeywordInputFormProps) {
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [selectedType, setSelectedType] = useState<"app" | "web">("app");

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const addKeyword = () => {
    if (keywords.length < 3) {
      setKeywords([...keywords, ""]);
    }
  };

  const removeKeyword = (index: number) => {
    if (keywords.length > 1) {
      const newKeywords = keywords.filter((_, i) => i !== index);
      setKeywords(newKeywords);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validKeywords = keywords.filter((k) => k.trim() !== "");
    if (validKeywords.length === 0) {
      alert("최소 1개 이상의 키워드를 입력해주세요.");
      return;
    }
    onSubmit(validKeywords, selectedType);
  };

  const placeholders = [
    "예: 영어, 공부",
    "예: 분실물, 지도",
    "예: 다이어트, 기록",
  ];

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
        </div>
        <div className="space-y-3">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                placeholder={placeholders[index] || `키워드 ${index + 1}`}
                className="flex-1 px-4 py-3 text-base border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors bg-white"
                disabled={isLoading}
              />
              {keywords.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="px-4 py-3 text-base text-gray-500 hover:text-gray-900 transition-colors"
                  disabled={isLoading}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
        {keywords.length < 3 && (
          <button
            type="button"
            onClick={addKeyword}
            className="mt-4 text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
            disabled={isLoading}
          >
            + 키워드 추가
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? loadingMessage || "생성 중..." : "앱 설계안 자동 생성하기"}
      </button>
    </form>
  );
}
