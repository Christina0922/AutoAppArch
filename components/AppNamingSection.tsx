"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppNaming, AppNamingCandidate } from "@/lib/types";

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
  const t = useTranslations("appNaming");
  const tCommon = useTranslations("common");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["intuitive", "emotional", "professional", "casual"])
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

  // 무료 사용자: 선택 개수 * 3배수만큼 추천 표시
  if (!isPremium) {
    // freePreview가 있으면 사용하고, 없으면 preview를 AppNamingCandidate 형태로 변환
    const freePreviewCandidates = appNaming.freePreview || [{
      name: appNaming.preview.name,
      tagline: appNaming.preview.tagline,
      reason: appNaming.preview.reason,
      tags: appNaming.preview.tags,
    }];
    
    return (
      <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
          {t("title")}
        </h2>

        {/* 미리보기 카드들 */}
        <div className="space-y-4 mb-6">
          {freePreviewCandidates.map((candidate, idx) => (
            <div key={idx} className="bg-gray-50 rounded-md p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {candidate.name}
                  </h3>
                  <p className="text-base text-gray-600 mb-2">{candidate.tagline}</p>
                  <p className="text-sm text-gray-500 mb-2">{candidate.reason}</p>
                  {candidate.tags && candidate.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {candidate.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => copyToClipboard(candidate.name)}
                  className="ml-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                  aria-label={tCommon("copy")}
                >
                  {tCommon("copy")}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onShowPaywall}
          className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          {t("viewAllButton")}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          {t("trademarkNotice")}
        </p>
      </div>
    );
  }

  // 프리미엄 사용자: 전체 후보 표시
  const groupLabels: Record<string, string> = {
    intuitive: t("types.intuitive"),
    emotional: t("types.emotional"),
    professional: t("types.professional"),
    casual: t("types.casual"),
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
        {t("title")}
      </h2>

      <div className="space-y-6">
        {(Object.keys(appNaming.premium) as Array<keyof typeof appNaming.premium>).map((groupName) => {
          const candidates: AppNamingCandidate[] = appNaming.premium[groupName];
          return (
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
                {candidates.map((candidate: AppNamingCandidate, idx: number) => (
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
                        <p className="text-sm text-gray-500 mb-2">{candidate.reason}</p>
                        {candidate.tags && candidate.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {candidate.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(candidate.name)}
                        className="ml-4 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                        aria-label={tCommon("copy")}
                      >
                        {tCommon("copy")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">
        {t("trademarkNotice")}
      </p>
    </div>
  );
}

