"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [highlightPro, setHighlightPro] = useState(false);

  const handleContinueClick = () => {
    // 무료 사용자는 그대로 진행
    // 조건 충족 시 Pro 안내로 연결 (내부 로직)
    setHighlightPro(true);
    setTimeout(() => {
      const proCard = document.getElementById("pro-card");
      if (proCard) {
        proCard.scrollIntoView({ behavior: "smooth", block: "center" });
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
            지금 단계에서는
            <br />
            아이디어의 방향과 구조가 완성됩니다.
            <br />
            <br />
            대부분의 사용자는
            <br />
            이 설계를 실제 구현 단계로 가져가기 전까지는
            <br />
            무료로 충분히 진행합니다.
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

      {/* 하단: 요금제 선택 영역 (무료 / Pro 2개만) */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
          요금제
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border border-gray-100 p-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">무료</h3>
            <div className="mb-8">
              <span className="text-3xl font-semibold text-gray-900">₩0</span>
              <span className="text-sm text-gray-500 ml-2">/월</span>
            </div>
            <ul className="space-y-4 mb-10 text-base text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>설계안 미리보기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>월 3개 설계안 생성</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>기본 히스토리 저장</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-3">✗</span>
                <span className="text-gray-400">상세 설계안 보기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-3">✗</span>
                <span className="text-gray-400">PDF 내보내기</span>
              </li>
            </ul>
            <Link
              href="/app"
              className="block w-full h-12 bg-gray-100 text-gray-900 text-base font-medium rounded-md hover:bg-gray-200 transition-colors tracking-tight text-center flex items-center justify-center"
            >
              무료로 시작하기
            </Link>
          </div>

          {/* Pro Plan */}
          <div
            id="pro-card"
            className={`bg-white rounded-lg border-2 p-10 transition-all duration-500 ${
              highlightPro
                ? "border-gray-900 shadow-lg scale-105"
                : "border-gray-200"
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Pro</h3>
            <div className="mb-8">
              <span className="text-3xl font-semibold text-gray-900">₩9,900</span>
              <span className="text-sm text-gray-500 ml-2">/월</span>
            </div>
            <ul className="space-y-4 mb-10 text-base text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>상세 설계안 전체 보기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>무제한 설계안 생성</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>PDF 내보내기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>우선 지원</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>고급 템플릿 사용</span>
              </li>
            </ul>
            <button className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight">
              이 설계안으로 계속 진행하기 (유료)
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
