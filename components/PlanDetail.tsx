"use client";

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

export default function PlanDetail({
  result,
  keywords = [],
  showProgress = false,
  isPremium = false,
  onShowPaywall = () => {},
  finalSelected = false,
}: PlanDetailProps) {
  return (
    <div className="space-y-6">
      {/* 상단 안내 */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <p className="text-sm text-gray-600 text-center">
          이 페이지는 생성될 앱의 기획서입니다.
        </p>
      </div>

      {/* 자동 생성된 앱 설계안 헤더 - 고정 요소 */}
      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          자동 생성된 <span className="text-gray-600">앱 설계안</span>
        </h1>
        {keywords.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            입력 <span className="font-medium text-gray-700">키워드</span>: {keywords.join(", ")}
          </p>
        )}
      </div>

      {/* 진척 단계 표시 */}
      {showProgress && (
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
      )}

      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{result.title}</h2>
        <p className="text-base text-gray-500 leading-relaxed">{result.tagline}</p>
      </div>

      {/* [사용자 관점]과 [개발자 관점] 섹션 분리 */}
      {(() => {
        const userSections = result.sectionsForRendering.filter((s) =>
          s.heading.startsWith("[사용자 관점]")
        );
        const developerSections = result.sectionsForRendering.filter((s) =>
          s.heading.startsWith("[개발자 관점]")
        );

        return (
          <>
            {/* [사용자 관점] 영역 */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  [사용자 관점]
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  앱 최종 사용자의 관점에서 작성된 내용입니다.
                </p>
              </div>

              {userSections.map((section, idx) => {
                const cleanHeading = section.heading.replace("[사용자 관점] ", "");
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
                  [개발자 관점]
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  앱 제작자(개발자)의 관점에서 작성된 내용입니다.
                </p>
              </div>

              {developerSections.map((section, idx) => {
                const cleanHeading = section.heading.replace("[개발자 관점] ", "");
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

      {/* 앱 이름 추천 섹션 - 최종 확정 후에만 표시 */}
      {finalSelected && result.appNaming && (
        <AppNamingSection
          appNaming={result.appNaming}
          isPremium={isPremium}
          onShowPaywall={onShowPaywall}
        />
      )}
    </div>
  );
}
