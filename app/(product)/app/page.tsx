"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { generatePlan } from "@/lib/generatePlan";
import { SavedPlan } from "@/lib/types";
import { getPlanById } from "@/lib/storage";
import KeywordInputForm from "@/components/KeywordInputForm";
import PlanPreviewCard from "@/components/PlanPreviewCard";
import PlanDetail from "@/components/PlanDetail";
import SaveButton from "@/components/SaveButton";
import PaywallModal from "@/components/PaywallModal";

export default function AppPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SavedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro] = useState(false); // MVP에서는 항상 false
  const [isFromHistory, setIsFromHistory] = useState(false); // 히스토리에서 열었는지 여부

  // URL 파라미터로 저장된 설계안을 열었는지 확인
  useEffect(() => {
    const planId = searchParams.get("planId");
    if (planId) {
      const savedPlan = getPlanById(planId);
      if (savedPlan) {
        setResult(savedPlan);
        setIsFromHistory(true);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (keywords: string[], selectedType: "app" | "web") => {
    setIsLoading(true);
    
    // 첫 번째 로딩 메시지
    setLoadingMessage("키워드를 분석 중입니다…");
    
    // 0.4~0.6초 후 두 번째 메시지로 변경
    setTimeout(() => {
      setLoadingMessage("앱 설계안을 자동으로 생성하고 있습니다…");
    }, 600);
    
    try {
      // 최소 0.8초, 최대 1.2초 대기 (자동화 체감)
      const minDelay = 800;
      const maxDelay = 1200;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      // 실제로는 API 호출이지만, MVP에서는 로컬 함수 사용
      const planResult = generatePlan(keywords, selectedType);
      const newPlan: SavedPlan = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        keywords,
        selectedType,
        result: planResult,
      };
      setResult(newPlan);
      setShowDetail(false);
      setIsFromHistory(false); // 새로 생성한 설계안
    } catch (error) {
      alert("설계안 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // 저장된 설계안을 다시 열어서 "계속 진행하기" 클릭 시에만 요금제 모달 표시
  const handleContinue = () => {
    if (isPro) {
      setShowDetail(true);
    } else {
      setShowPaywall(true);
    }
  };

  const handleSaved = () => {
    // 저장 완료 후 처리 (선택사항)
  };

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      {!result ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8">
          <KeywordInputForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {!showDetail ? (
            <>
              <PlanPreviewCard
                result={result.result}
                keywords={result.keywords}
                onViewDetail={isFromHistory ? handleContinue : undefined}
                isPro={isPro}
                showContinueButton={isFromHistory}
              />
              {/* 첫 생성 시에만 저장 버튼 표시, 저장된 설계안을 다시 열었을 때는 저장 버튼 숨김 */}
              {!isFromHistory && (
                <div className="bg-white rounded-lg border border-gray-100 p-8">
                  <SaveButton plan={result} onSaved={handleSaved} />
                </div>
              )}
            </>
          ) : (
            <>
              <PlanDetail result={result.result} keywords={result.keywords} />
              {/* 상세 보기에서도 저장 버튼은 첫 생성 시에만 표시 */}
              {!isFromHistory && (
                <div className="bg-white rounded-lg border border-gray-100 p-8">
                  <SaveButton plan={result} onSaved={handleSaved} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
