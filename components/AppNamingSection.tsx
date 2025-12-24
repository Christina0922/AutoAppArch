"use client";

import { useState } from "react";
import { AppNaming } from "@/lib/types";

interface AppNamingSectionProps {
  appNaming: AppNaming;
  isPremium: boolean;
  onShowPaywall: () => void;
}

export default function AppNamingSection({
  appNaming,
  isPremium,
  onShowPaywall,
}: AppNamingSectionProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["literal", "brand", "short"])
  );

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 간단한 피드백 (선택사항: 토스트 메시지 추가 가능)
  };

  // 무료 사용자: 미리보기 1개만 표시
  if (!isPremium) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
          앱 이름 추천(프리미엄)
        </h2>

        {/* 미리보기 카드 */}
        <div className="bg-gray-50 rounded-md p-6 border border-gray-200 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {appNaming.preview.name}
              </h3>
              <p className="text-base text-gray-600 mb-2">{appNaming.preview.tagline}</p>
              <p className="text-sm text-gray-500">{appNaming.preview.reason}</p>
            </div>
            <button
              onClick={() => copyToClipboard(appNaming.preview.name)}
              className="ml-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              aria-label="이름 복사"
            >
              복사
            </button>
          </div>
        </div>

        <button
          onClick={onShowPaywall}
          className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          전체 이름 후보 보기(프리미엄)
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          상표/도메인 중복 여부는 별도 확인이 필요합니다.
        </p>
      </div>
    );
  }

  // 프리미엄 사용자: 전체 후보 표시
  const groupLabels: Record<string, string> = {
    literal: "직관형 (기능이 바로 보이는 이름)",
    brand: "브랜딩형 (브랜드 느낌)",
    short: "짧은형 (2~4글자 중심)",
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
        앱 이름 추천(프리미엄)
      </h2>

      <div className="space-y-6">
        {Object.entries(appNaming.premium).map(([groupName, candidates]) => (
          <div key={groupName} className="border border-gray-200 rounded-md">
            <button
              onClick={() => toggleGroup(groupName)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-md"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {groupLabels[groupName]}
              </h3>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedGroups.has(groupName) ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedGroups.has(groupName) && (
              <div className="p-6 space-y-4">
                {candidates.map((candidate, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-md p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                          {candidate.name}
                        </h4>
                        <p className="text-base text-gray-600 mb-2">{candidate.tagline}</p>
                        <p className="text-sm text-gray-500">{candidate.reason}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(candidate.name)}
                        className="ml-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                        aria-label="이름 복사"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        상표/도메인 중복 여부는 별도 확인이 필요합니다.
      </p>
    </div>
  );
}

