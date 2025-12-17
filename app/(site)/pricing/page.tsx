"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllPlans } from "@/lib/storage";

export default function PricingPage() {
  const router = useRouter();
  const [highlightPremium, setHighlightPremium] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    // 설계안이 있는지 확인
    const plans = getAllPlans();
    setHasPlan(plans.length > 0);
  }, []);

  const handleContinueClick = () => {
    if (hasPlan) {
      setHighlightPremium(true);
      setTimeout(() => {
        const premiumCard = document.getElementById("premium-card");
        if (premiumCard) {
          premiumCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      router.push("/app");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 min-h-screen flex flex-col">
      {/* 상단: 현재 상태 선언 영역 (설명 전용) - 컴팩트하게 */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 text-center tracking-tight">
          현재 사용 중인 단계
        </h1>
        <div className="bg-gray-50 border border-gray-100 rounded-md p-6 mb-6">
          <p className="text-sm text-gray-600 leading-relaxed text-center mb-4">
            AutoAppArch는 기본 <span className="font-medium text-gray-900">앱 설계안</span>까지는 무료로 <span className="font-medium text-gray-900">자동</span> 생성할 수 있습니다.
            <br />
            이 설계를 실제 구현 단계까지 가져가고 싶을 때 다음 단계를 선택하면 됩니다.
          </p>
          <div className="text-center">
            <button
              onClick={handleContinueClick}
              className="h-10 px-6 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
            >
              {hasPlan ? "이 설계안으로 계속 진행하기" : "설계안 만들기"}
            </button>
          </div>
        </div>
      </div>

      {/* 하단: 단계 선택 영역 (무료 / Pro / Premium 3개) */}
      <div className="max-w-6xl mx-auto flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center tracking-tight">
          다음 단계 선택
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free - 기본 설계 단계 */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                기본 설계 단계
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">무료</h3>
              <div className="mb-3">
                <span className="text-3xl font-semibold text-gray-900">₩0</span>
                <span className="text-xs text-gray-500 ml-2">/월</span>
              </div>
              {/* 단계 선언 문장 */}
              <p className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
                아이디어의 방향과 구조를 잡는 단계
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <span className="font-medium text-gray-900">키워드</span> 몇 개만 입력하면
                <br />
                앱 설계의 방향과 구조를
                <br />
                <span className="font-medium text-gray-900">자동</span>으로 확인할 수 있습니다.
              </p>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  이 단계에서 할 수 있는 것
                </p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span><span className="font-medium text-gray-900">키워드</span> 기반 앱 구조 <span className="font-medium text-gray-900">자동</span> 생성</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>핵심 개념과 방향 정리</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>기본 설계안 화면 미리보기</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                설계 방향을 잡는 데에는
                <br />
                무료로도 충분합니다.
              </p>
            </div>
            <Link
              href="/app"
              className="block w-full h-10 bg-gray-100 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors tracking-tight text-center flex items-center justify-center"
            >
              무료로 시작하기
            </Link>
          </div>

          {/* Pro - 설계 완성 단계 */}
          <div className="bg-white rounded-lg border-2 border-gray-900 p-6">
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                설계 완성 단계
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Pro</h3>
              <div className="mb-3">
                <span className="text-3xl font-semibold text-gray-900">₩9,900</span>
                <span className="text-xs text-gray-500 ml-2">/월</span>
              </div>
              {/* 단계 선언 문장 */}
              <p className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
                앱 설계를 완성하는 단계
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                이 단계에서는
                <br />
                앱을 만들기 위한 설계가 모두 완성됩니다.
                <br />
                <br />
                아이디어를 확정하기에 충분한 단계입니다.
              </p>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  이 단계에서 할 수 있는 것
                </p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>앱 설계 전체 구조 완성</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>기능 흐름과 핵심 화면 정리</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>수익 구조와 핵심 행동 명확화</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>설계안 저장 및 반복 생성</span>
                  </li>
                </ul>
              </div>
            </div>
            <button className="w-full h-10 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight">
              이 설계안으로 계속 진행하기
            </button>
          </div>

          {/* Premium - 실행 준비 완료 단계 */}
          <div
            id="premium-card"
            className={`bg-white rounded-lg border-2 p-6 transition-all duration-500 ${
              highlightPremium
                ? "border-gray-900 shadow-lg scale-105"
                : "border-gray-200"
            }`}
          >
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
                실행 준비 완료 단계
              </span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">Premium</h3>
              <div className="mb-3">
                <span className="text-3xl font-semibold text-gray-900">₩14,900</span>
                <span className="text-xs text-gray-500 ml-2">/월</span>
              </div>
              {/* 단계 선언 문장 */}
              <p className="text-sm font-medium text-gray-900 mb-4 leading-relaxed">
                실제 개발을 시작하기 위한 단계
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                이 단계에서는
                <br />
                이 설계안을 바로 개발로 옮길 수 있습니다.
                <br />
                <br />
                실제로 앱을 만들 사람들을 위한 최종 단계입니다.
              </p>
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  이 단계에서 할 수 있는 것
                </p>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>설계안을 실행 기준으로 최종 정리</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>외부 전달 가능한 설계 형태 확보</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>개발자·외주·팀과 바로 공유 가능</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2 font-medium">•</span>
                    <span>실제 제작을 전제로 한 최종 설계</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                이 단계는
                <br />
                아이디어를 실제 앱으로 만들기로
                <br />
                결정한 사용자들이 선택합니다.
              </p>
            </div>
            <button className="w-full h-10 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight">
              실행 단계까지 완료하기
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-1">
          Pro와 Premium 요금제는 14일 무료 체험을 제공합니다.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 inline-block mt-2">
          <p className="text-xs text-gray-400">
            * 현재는 MVP 단계로 실제 결제는 진행되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
