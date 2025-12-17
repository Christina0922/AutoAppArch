"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SavedPlan } from "@/lib/types";
import { getPlanById } from "@/lib/storage";
import PlanDetail from "@/components/PlanDetail";
import PaywallModal from "@/components/PaywallModal";
import Link from "next/link";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro] = useState(false); // MVP에서는 항상 false

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      const foundPlan = getPlanById(params.id);
      if (foundPlan) {
        setPlan(foundPlan);
      } else {
        alert("설계안을 찾을 수 없습니다.");
        router.push("/history");
      }
    }
  }, [params.id, router]);

  const handleContinue = () => {
    if (isPro) {
      // Pro 사용자는 상세 보기로 이동
      router.push(`/app?planId=${plan?.id}`);
    } else {
      // 무료 사용자는 요금제 모달 표시
      setShowPaywall(true);
    }
  };

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <p className="text-base text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link
          href="/history"
          className="text-base text-gray-500 hover:text-gray-900 font-medium mb-6 inline-block transition-colors"
        >
          ← 목록으로 돌아가기
        </Link>
        <p className="text-sm text-gray-400 mb-1">
          생성일: {new Date(plan.createdAt).toLocaleString("ko-KR")}
        </p>
        <p className="text-sm text-gray-400">
          키워드: {plan.keywords.join(", ")}
        </p>
      </div>
      
      <PlanDetail result={plan.result} keywords={plan.keywords} showProgress={true} />
      
      <div className="mt-8 bg-white rounded-lg border border-gray-100 p-8">
        <button
          onClick={handleContinue}
          className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
        >
          이 설계안으로 계속 진행하기
        </button>
      </div>

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
