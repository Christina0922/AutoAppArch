"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { PlanResult } from "@/lib/types";
import AppNamingSection from "./AppNamingSection";

interface PlanDetailProps {
  result: PlanResult;
  keywords?: string[];
  showProgress?: boolean; // 진척 단계 표시 여부
  isPremium?: boolean; // 프리미엄 사용자 여부
  onShowPaywall?: () => void; // 요금제 모달 표시 콜백
  onBack?: () => void; // 뒤로가기 콜백
  finalSelected?: boolean; // 최종 확정 여부
}

function ProgressSection(): React.ReactElement {
  const t = useTranslations("planDetail");
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-8">
      <p className="text-base text-gray-600 mb-6 leading-relaxed">
        <span dangerouslySetInnerHTML={{ __html: t("progressCurrent") }} />
      </p>
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          {t("progressTitle")}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-gray-900 mr-4 text-base font-medium">✓</span>
            <span className="text-base text-gray-600">{t("progressStep1")}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-900 mr-4 text-base font-medium">✓</span>
            <span className="text-base text-gray-600">{t("progressStep2")}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 text-base">◻</span>
            <span className="text-base text-gray-400">{t("progressStep3")}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 text-base">◻</span>
            <span className="text-base text-gray-400">{t("progressStep4")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanDetail(props: PlanDetailProps): React.ReactElement {
  const { result, keywords = [], showProgress = false, isPremium = false, onShowPaywall = () => {}, onBack, finalSelected = false } = props;
  const t = useTranslations("planDetail");
  const shouldShowProgress: boolean = Boolean(showProgress as boolean);
  
  // result가 없거나 필수 필드가 없는 경우 에러 방지
  if (!result) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-800">No plan data available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {t("backButton")}
        </button>
      )}
      
      {/* 상단 안내 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600 text-center">
          {t("description")}
        </p>
      </div>

      {/* 자동 생성된 앱 설계안 헤더 - 고정 요소 */}
      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          <span dangerouslySetInnerHTML={{ __html: t("title") }} />
        </h1>
        {keywords.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            <span dangerouslySetInnerHTML={{ __html: t("inputKeywords").replace("{keywords}", keywords.join(", ")) }} />
          </p>
        )}
      </div>

      {/* 진척 단계 표시 */}
      {shouldShowProgress ? <ProgressSection /> : (null as any)}

      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{(result?.title as string) ?? ""}</h2>
        <p className="text-base text-gray-500 leading-relaxed">{(result?.tagline as string) ?? ""}</p>
      </div>

      {/* [사용자 관점]과 [개발자 관점] 섹션 분리 */}
      {(() => {
        const sectionsForRendering = (result?.sectionsForRendering as Array<{ heading: string; bullets: string[] }>) || [];
        const userPerspectiveLabel = t("userPerspective");
        const developerPerspectiveLabel = t("developerPerspective");
        const userSections = sectionsForRendering.filter((s) =>
          s.heading.startsWith(userPerspectiveLabel)
        );
        const developerSections = sectionsForRendering.filter((s) =>
          s.heading.startsWith(developerPerspectiveLabel)
        );

        return (
          <>
            {/* [사용자 관점] 영역 */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg border-4 border-blue-200 p-4">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {userPerspectiveLabel}
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  {t("userPerspectiveDesc")}
                </p>
              </div>

              {userSections.map((section, idx) => {
                const cleanHeading = section.heading.replace(`${userPerspectiveLabel} `, "");
                return (
                  <div
                    key={idx}
                    className="bg-blue-50 rounded-md p-8 border-2 border-blue-200"
                  >
                    <h2 className="text-base font-bold text-gray-900 mb-6 tracking-tight">
                      {cleanHeading}
                    </h2>
                    <ul className="space-y-3">
                      {section.bullets.map((bullet, bulletIdx) => (
                        <li
                          key={bulletIdx}
                          className="text-base text-gray-600 leading-relaxed flex items-start"
                        >
                          <span className="text-gray-400 mr-3">•</span>
                          <span className="flex-1 break-words">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* [개발자 관점] 영역 */}
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg border-4 border-purple-200 p-4">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  {developerPerspectiveLabel}
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  {t("developerPerspectiveDesc")}
                </p>
              </div>

              {developerSections.map((section, idx) => {
                const cleanHeading = section.heading.replace(`${developerPerspectiveLabel} `, "");
                return (
                  <div
                    key={idx}
                    className="bg-purple-50 rounded-md p-8 border-2 border-purple-200"
                  >
                    <h2 className="text-base font-bold text-gray-900 mb-6 tracking-tight">
                      {cleanHeading}
                    </h2>
                    <ul className="space-y-3">
                      {section.bullets.map((bullet, bulletIdx) => (
                        <li
                          key={bulletIdx}
                          className="text-base text-gray-600 leading-relaxed flex items-start"
                        >
                          <span className="text-gray-400 mr-3">•</span>
                          <span className="flex-1 break-words">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* 앱 이름 추천 섹션 - appNaming이 있으면 항상 표시 */}
      {result?.appNaming && (
        <AppNamingSection
          appNaming={result.appNaming as any}
          isPremium={isPremium}
          onShowPaywall={onShowPaywall}
        />
      )}
    </div>
  );
}
