"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [highlightPremium, setHighlightPremium] = useState(false);

  const handleContinueClick = () => {
    setHighlightPremium(true);
    setTimeout(() => {
      const premiumCard = document.getElementById("premium-card");
      if (premiumCard) {
        premiumCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
      {/* 상단: 현재 상태 선언 영역 (설명 전용) */}
      <div className="max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          현재 사용 중인 단계
        </h1>
        <div className="bg-gray-50 border border-gray-100 rounded-md p-10 mb-8">
          <p className="text-base text-gray-600 leading-relaxed text-center mb-8">
            AutoAppArch는
            <br />
            기본 <span className="font-medium text-gray-900">앱 설계안</span>까지는 무료로 <span className="font-medium text-gray-900">자동</span> 생성할 수 있습니다.
            <br />
            <br />
            이 설계를
            <br />
            실제 구현 단계까지 가져가고 싶을 때
            <br />
            다음 단계를 선택하면 됩니다.
          </p>
          <div className="text-center">
            <button
              onClick={handleContinueClick}
              className="h-12 px-8 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
            >
              이 설계안으로 계속 진행하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단: 단계 선택 영역 (Pro / Premium 2개만) */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
          다음 단계 선택
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pro - 설계 완성 단계 */}
          <div className="bg-white rounded-lg border border-gray-100 p-10">
            <div className="mb-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                설계 완성 단계
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-gray-900">₩9,900</span>
                <span className="text-sm text-gray-500 ml-2">/월</span>
              </div>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                이 단계에서는
                <br />
                앱을 만들기 위한 설계가 모두 완성됩니다.
                <br />
                <br />
                아이디어를 확정하기에 충분한 단계입니다.
              </p>
            </div>
            <button className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight">
              이 설계안으로 계속 진행하기
            </button>
          </div>

          {/* Premium - 실행 준비 완료 단계 */}
          <div
            id="premium-card"
            className={`bg-white rounded-lg border-2 p-10 transition-all duration-500 ${
              highlightPremium
                ? "border-gray-900 shadow-lg scale-105"
                : "border-gray-200"
            }`}
          >
            <div className="mb-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                실행 준비 완료 단계
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-gray-900">₩14,900</span>
                <span className="text-sm text-gray-500 ml-2">/월</span>
              </div>
              <p className="text-base text-gray-600 leading-relaxed mb-3">
                이 단계에서는
                <br />
                이 설계안을 바로 개발로 옮길 수 있습니다.
                <br />
                <br />
                실제로 앱을 만들 사람들을 위한 최종 단계입니다.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                이 단계는 실제로 앱을 만들 사용자들에게 선택됩니다.
              </p>
            </div>
            <button className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight">
              실행 단계까지 완료하기
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-base text-gray-500 mb-2">
          모든 요금제는 14일 무료 체험을 제공합니다.
        </p>
        <p className="text-xs text-gray-400">
          * 현재는 MVP 단계로 실제 결제는 진행되지 않습니다.
        </p>
      </div>
    </div>
  );
}
