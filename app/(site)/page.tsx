"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KeywordInputForm from "@/components/KeywordInputForm";
import ExampleFlowDemo from "@/components/ExampleFlowDemo";
import PlanPreviewCard from "@/components/PlanPreviewCard";
import { generatePlan } from "@/lib/generatePlan";
import type { AppType } from "@/lib/types";

export default function HomePage() {
  const [showExample, setShowExample] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (keywords: string[], selectedType: AppType) => {
    // 키워드를 URL 파라미터로 전달하여 /app 페이지로 이동 (타입은 항상 "app")
    const params = new URLSearchParams({
      keywords: keywords.join(","),
    });
    router.push(`/app?${params.toString()}`);
  };

  // 샘플 결과 생성
  const sampleResults = [
    generatePlan(["영어", "공부"], "app"),
    generatePlan(["분실물", "지도"], "app"),
  ];

  // 추천 키워드
  const recommendedKeywords = [
    { text: "영어, 공부", keywords: ["영어", "공부"] },
    { text: "분실물, 지도", keywords: ["분실물", "지도"] },
    { text: "다이어트, 기록", keywords: ["다이어트", "기록"] },
    { text: "운동, 커뮤니티", keywords: ["운동", "커뮤니티"] },
    { text: "여행, 계획", keywords: ["여행", "계획"] },
  ];

  const handleKeywordClick = (keywords: string[]) => {
    const params = new URLSearchParams({
      keywords: keywords.join(","),
      type: "app",
    });
    router.push(`/app?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-12 tracking-tight leading-tight text-center md:text-left">
          <span className="font-bold text-gray-900">키워드</span>만 입력하면
          <br />
          <span className="font-bold text-gray-900">앱 설계안</span>이 <span className="font-bold text-gray-900">자동</span>으로 생성됩니다
        </h1>

        {/* 실제 작동하는 입력 폼 */}
        <div className="max-w-3xl md:max-w-full">
          <div className="bg-white rounded-lg border border-gray-100 p-8 mb-6">
            <KeywordInputForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />
          </div>
          
          {/* 예시 보기 토글 */}
          <div className="bg-white rounded-lg border border-gray-100 p-8 mb-16">
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

      {/* Empty State Section */}
      <section className="pb-24">
        {/* 3단계 프로세스 카드 */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight text-center md:text-left">
            간단한 <span className="text-gray-600">3단계</span> 프로세스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">키워드 입력</h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                원하는 앱의 키워드를 몇 개만 입력하세요. 예: "영어, 공부"
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">아이디어 선택</h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                생성된 아이디어 중 마음에 드는 것을 선택하고 분기를 생성하세요.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">설계안 생성</h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                최종 선택을 확정하면 완성된 앱 설계안이 자동으로 생성됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 샘플 결과 2개 */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight text-center md:text-left">
            생성된 <span className="text-gray-600">설계안 예시</span>
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
            아래는 실제 생성되는 설계안의 예시입니다. 키워드를 입력하면 여러분만의 설계안이 생성됩니다.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {sampleResults.map((result, idx) => (
              <PlanPreviewCard
                key={idx}
                result={result}
                keywords={idx === 0 ? ["영어", "공부"] : ["분실물", "지도"]}
              />
            ))}
          </div>
        </div>

        {/* 추천 키워드 칩 */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight text-center md:text-left">
            추천 <span className="text-gray-600">키워드</span>
          </h2>
          <p className="text-base text-gray-600 mb-6 text-center md:text-left">
            아래 키워드를 클릭하면 바로 설계안을 생성할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {recommendedKeywords.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleKeywordClick(item.keywords)}
                className="px-4 py-2 text-base bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-200 hover:border-gray-300"
                aria-label={`키워드 사용: ${item.text}`}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
