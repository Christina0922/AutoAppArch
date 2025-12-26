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
  finalSelected?: boolean; // 최종 확정 여부
}

function ProgressSection(): React.ReactElement {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-8">
      <p className="text-base text-gray-600 mb-6 leading-relaxed">
        현재 이 설계안은 <strong className="text-gray-900 font-medium">'기본 구조 단계'</strong>에 있습니다.
      </p>
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          설계 진행 단계
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-gray-900 mr-4 text-base font-medium">✓</span>
            <span className="text-base text-gray-600">① 아이디어 구조화</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-900 mr-4 text-base font-medium">✓</span>
            <span className="text-base text-gray-600">② 핵심 기능 정리</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 text-base">◻</span>
            <span className="text-base text-gray-400">③ 화면 흐름 설계</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 text-base">◻</span>
            <span className="text-base text-gray-400">④ 구현 준비 단계</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlanDetail(props: PlanDetailProps): JSX.Element {
  const { result, keywords = [], showProgress = false, isPremium = false, onShowPaywall = () => {}, finalSelected = false } = props;
  const t = useTranslations("planDetail");
  const shouldShowProgress: boolean = Boolean(showProgress as boolean);
  
  return (
    <div className="space-y-6">
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
        <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{(result.title as string) ?? ""}</h2>
        <p className="text-base text-gray-500 leading-relaxed">{(result.tagline as string) ?? ""}</p>
      </div>

      {/* [사용자 관점]과 [개발자 관점] 섹션 분리 */}
      {(() => {
        const sectionsForRendering = (result.sectionsForRendering as Array<{ heading: string; bullets: string[] }>) || [];
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
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
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
                    className="bg-gray-50 rounded-md p-8 border border-gray-200"
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
              <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-4">
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
                    className="bg-gray-50 rounded-md p-8 border border-gray-200"
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
      {result.appNaming && (
        <AppNamingSection
          appNaming={result.appNaming as any}
          isPremium={isPremium}
          onShowPaywall={onShowPaywall}
        />
      )}
    </div>
  );
}
