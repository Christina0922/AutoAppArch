"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KeywordInputForm from "@/components/KeywordInputForm";
import ExampleFlowDemo from "@/components/ExampleFlowDemo";

export default function HomePage() {
  const [showExample, setShowExample] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (keywords: string[], selectedType: "app" | "web") => {
    // 키워드와 타입을 URL 파라미터로 전달하여 /app 페이지로 이동
    const params = new URLSearchParams({
      keywords: keywords.join(","),
      type: selectedType,
    });
    router.push(`/app?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-12 tracking-tight leading-tight">
          <span className="font-bold text-gray-900">키워드</span>만 입력하면
          <br />
          <span className="font-bold text-gray-900">앱 설계안</span>이 <span className="font-bold text-gray-900">자동</span>으로 생성됩니다
        </h1>

        {/* 실제 작동하는 입력 폼 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-100 p-8 mb-6">
            <KeywordInputForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />
          </div>
          
          {/* 예시 보기 토글 */}
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <button
              onClick={() => setShowExample(!showExample)}
              className="w-full text-left mb-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-md p-2 -m-2"
              aria-label={showExample ? "예시 숨기기" : "예시 보기"}
              aria-expanded={showExample}
            >
              <span className="text-base font-medium text-gray-900">
                {showExample ? "예시 숨기기" : "프로세스 예시 보기"}
              </span>
              <span className="text-gray-400" aria-hidden="true">
                {showExample ? "▲" : "▼"}
              </span>
            </button>
            {showExample && (
              <div className="text-left">
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wider">
                    데모
                  </p>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  마인드맵 프로세스 <span className="text-gray-600">데모</span>
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  아래 예시를 통해 <span className="font-medium text-gray-700">선택 → 분기 생성 → 선택 → 분기 생성</span> 프로세스를 체험해보세요.
                </p>
                <ExampleFlowDemo />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
